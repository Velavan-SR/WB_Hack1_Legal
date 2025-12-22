import { OpenAIEmbeddings } from '@langchain/openai';

let embeddingsInstance: OpenAIEmbeddings | null = null;

/**
 * Gets or creates OpenAI embeddings instance
 */
export function getEmbeddings(): OpenAIEmbeddings {
  if (!embeddingsInstance) {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    embeddingsInstance = new OpenAIEmbeddings({
      apiKey: apiKey,
      modelName: 'text-embedding-3-small', // 1536 dimensions
    });
  }

  return embeddingsInstance;
}

/**
 * Generates embedding for a single text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const embeddings = getEmbeddings();
  const embedding = await embeddings.embedQuery(text);
  return embedding;
}

/**
 * Generates embeddings for multiple texts in batch
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const embeddings = getEmbeddings();
  const embeddingsList = await embeddings.embedDocuments(texts);
  return embeddingsList;
}

/**
 * Calculates cosine similarity between two vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
