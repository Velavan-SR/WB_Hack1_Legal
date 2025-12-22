import { MongoClient, Db, Collection } from 'mongodb';
import { ClauseDocument } from '@/types';

let client: MongoClient | null = null;
let db: Db | null = null;

/**
 * MongoDB connection configuration
 */
const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'legal_analyzer';
const MONGODB_COLLECTION_NAME = process.env.MONGODB_COLLECTION_NAME || 'legal_clauses';

/**
 * Establishes connection to MongoDB Atlas
 */
export async function connectToMongoDB(): Promise<MongoClient> {
  if (client) {
    return client;
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(MONGODB_DB_NAME);
    
    console.log('✅ Connected to MongoDB Atlas');
    return client;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    throw error;
  }
}

/**
 * Gets the MongoDB database instance
 */
export async function getDatabase(): Promise<Db> {
  if (!db) {
    await connectToMongoDB();
  }
  return db!;
}

/**
 * Gets the clauses collection
 */
export async function getClausesCollection(): Promise<Collection<ClauseDocument>> {
  const database = await getDatabase();
  return database.collection<ClauseDocument>(MONGODB_COLLECTION_NAME);
}

/**
 * Creates vector search index on the collection
 * This should be run once during setup
 */
export async function createVectorSearchIndex(): Promise<void> {
  try {
    const database = await getDatabase();
    
    await database.command({
      createSearchIndexes: MONGODB_COLLECTION_NAME,
      indexes: [
        {
          name: 'vector_index',
          type: 'vectorSearch',
          definition: {
            fields: [
              {
                type: 'vector',
                path: 'embedding',
                numDimensions: 1536, // OpenAI text-embedding-3-small
                similarity: 'cosine',
              },
            ],
          },
        },
      ],
    });

    console.log('✅ Vector search index created');
  } catch (error) {
    console.error('❌ Failed to create vector search index:', error);
    throw error;
  }
}

/**
 * Performs vector similarity search
 */
export async function vectorSearch(
  queryEmbedding: number[],
  limit: number = 10
): Promise<ClauseDocument[]> {
  const collection = await getClausesCollection();

  const pipeline = [
    {
      $vectorSearch: {
        index: 'vector_index',
        path: 'embedding',
        queryVector: queryEmbedding,
        numCandidates: limit * 10,
        limit: limit,
      },
    },
    {
      $project: {
        _id: 1,
        text: 1,
        metadata: 1,
        score: { $meta: 'vectorSearchScore' },
      },
    },
  ];

  const results = await collection.aggregate(pipeline).toArray();
  return results as ClauseDocument[];
}

/**
 * Stores a clause with its embedding
 */
export async function storeClause(clause: ClauseDocument): Promise<void> {
  const collection = await getClausesCollection();
  await collection.insertOne(clause);
}

/**
 * Stores multiple clauses in batch
 */
export async function storeClauses(clauses: ClauseDocument[]): Promise<void> {
  if (clauses.length === 0) return;
  
  const collection = await getClausesCollection();
  await collection.insertMany(clauses);
}

/**
 * Closes MongoDB connection
 */
export async function closeMongoDB(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('✅ MongoDB connection closed');
  }
}
