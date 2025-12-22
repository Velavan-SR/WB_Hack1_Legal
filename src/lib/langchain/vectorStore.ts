import { generateEmbedding } from '../langchain/embeddings';
import { vectorSearch, storeClause } from '../database/mongodb';
import { ClauseDocument, RiskLevel, ClauseCategory } from '@/types';

/**
 * Searches for similar clauses using semantic search
 */
export async function searchSimilarClauses(
  query: string,
  limit: number = 5
): Promise<ClauseDocument[]> {
  try {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // Perform vector search
    const results = await vectorSearch(queryEmbedding, limit);

    return results;
  } catch (error) {
    console.error('Error searching clauses:', error);
    throw error;
  }
}

/**
 * Indexes a clause for future semantic search
 */
export async function indexClause(
  text: string,
  metadata: {
    category: ClauseCategory;
    riskLevel: RiskLevel;
    sourceUrl?: string;
  }
): Promise<void> {
  try {
    // Generate embedding
    const embedding = await generateEmbedding(text);

    // Create document
    const document: ClauseDocument = {
      text,
      embedding,
      metadata: {
        ...metadata,
        analyzedAt: new Date(),
      },
    };

    // Store in MongoDB
    await storeClause(document);
  } catch (error) {
    console.error('Error indexing clause:', error);
    throw error;
  }
}

/**
 * Indexes multiple clauses in batch
 */
export async function indexClauses(
  clauses: Array<{
    text: string;
    metadata: {
      category: ClauseCategory;
      riskLevel: RiskLevel;
      sourceUrl?: string;
    };
  }>
): Promise<void> {
  try {
    // Generate embeddings for all clauses
    const texts = clauses.map((c) => c.text);
    const { generateEmbeddings } = await import('../langchain/embeddings');
    const embeddings = await generateEmbeddings(texts);

    // Create documents
    const documents: ClauseDocument[] = clauses.map((clause, index) => ({
      text: clause.text,
      embedding: embeddings[index],
      metadata: {
        ...clause.metadata,
        analyzedAt: new Date(),
      },
    }));

    // Store all in MongoDB
    const { storeClauses } = await import('../database/mongodb');
    await storeClauses(documents);
  } catch (error) {
    console.error('Error indexing clauses:', error);
    throw error;
  }
}
