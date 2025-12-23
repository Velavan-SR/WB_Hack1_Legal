import { searchSimilarClauses } from './vectorStore';
import { answerClauseQuestion, translateToPlainEnglish } from './classifier';
import { generateEmbedding } from './embeddings';

/**
 * RAG (Retrieval-Augmented Generation) Pipeline
 * Combines vector search with LLM for accurate question answering
 */

export interface RAGResult {
  answer: string;
  sourceClause: string;
  plainEnglish: string;
  confidence: number;
  relatedClauses: Array<{
    text: string;
    category: string;
    riskLevel: string;
  }>;
}

/**
 * Performs RAG search: retrieves relevant clauses and generates answer
 */
export async function ragSearch(query: string): Promise<RAGResult> {
  try {
    // Step 1: Retrieve similar clauses using vector search
    const similarClauses = await searchSimilarClauses(query, 5);

    if (similarClauses.length === 0) {
      throw new Error('No relevant clauses found in the database');
    }

    // Step 2: Use the most relevant clause for answering
    const mostRelevant = similarClauses[0];

    // Step 3: Generate answer using LLM with retrieved context
    const answerResult = await answerClauseQuestion(query, mostRelevant.text);

    // Step 4: Get plain English translation
    const translation = await translateToPlainEnglish(mostRelevant.text);

    // Step 5: Calculate confidence based on similarity (placeholder)
    const confidence = similarClauses.length > 0 ? 0.85 : 0.5;

    return {
      answer: answerResult.answer,
      sourceClause: mostRelevant.text,
      plainEnglish: translation.simple,
      confidence,
      relatedClauses: similarClauses.slice(1).map((clause) => ({
        text: clause.text,
        category: clause.metadata.category,
        riskLevel: clause.metadata.riskLevel,
      })),
    };
  } catch (error) {
    console.error('RAG search error:', error);
    throw error;
  }
}

/**
 * Batch translation: converts multiple clauses to plain English
 */
export async function batchTranslateToPlainEnglish(
  clauses: string[]
): Promise<Array<{ original: string; plainEnglish: string }>> {
  try {
    const translations = await Promise.all(
      clauses.map(async (clause) => {
        const translation = await translateToPlainEnglish(clause);
        return {
          original: clause,
          plainEnglish: translation.simple,
        };
      })
    );

    return translations;
  } catch (error) {
    console.error('Batch translation error:', error);
    throw error;
  }
}

/**
 * Enhanced RAG with multi-clause context
 * Uses multiple relevant clauses to provide comprehensive answer
 */
export async function enhancedRAGSearch(query: string): Promise<{
  answer: string;
  context: string;
  plainEnglish: string;
  sources: Array<{
    text: string;
    category: string;
    relevance: number;
  }>;
}> {
  try {
    // Retrieve multiple relevant clauses
    const similarClauses = await searchSimilarClauses(query, 3);

    if (similarClauses.length === 0) {
      throw new Error('No relevant clauses found');
    }

    // Combine multiple clauses for context
    const combinedContext = similarClauses
      .map((clause, idx) => `[Clause ${idx + 1}]: ${clause.text}`)
      .join('\n\n');

    // Generate answer with full context
    const answerResult = await answerClauseQuestion(query, combinedContext);

    // Translate the most relevant clause
    const translation = await translateToPlainEnglish(similarClauses[0].text);

    return {
      answer: answerResult.answer,
      context: combinedContext,
      plainEnglish: translation.simple,
      sources: similarClauses.map((clause, idx) => ({
        text: clause.text.substring(0, 200) + '...',
        category: clause.metadata.category,
        relevance: 1 - idx * 0.15, // Simple relevance scoring
      })),
    };
  } catch (error) {
    console.error('Enhanced RAG error:', error);
    throw error;
  }
}

/**
 * Semantic clause finder with plain English explanations
 */
export async function findAndExplainClause(
  topic: string
): Promise<Array<{
  clause: string;
  plainEnglish: string;
  category: string;
  riskLevel: string;
}>> {
  try {
    // Find relevant clauses
    const clauses = await searchSimilarClauses(topic, 5);

    // Translate each to plain English
    const explained = await Promise.all(
      clauses.map(async (clause) => {
        const translation = await translateToPlainEnglish(clause.text);
        return {
          clause: clause.text,
          plainEnglish: translation.simple,
          category: clause.metadata.category,
          riskLevel: clause.metadata.riskLevel,
        };
      })
    );

    return explained;
  } catch (error) {
    console.error('Find and explain error:', error);
    throw error;
  }
}

/**
 * Contextual question answering with automatic clause retrieval
 */
export async function askAboutTerms(question: string): Promise<{
  directAnswer: string;
  explanation: string;
  risks: string[];
  relatedTopics: string[];
}> {
  try {
    // Retrieve relevant clauses
    const ragResult = await ragSearch(question);

    // Get detailed translation
    const translation = await translateToPlainEnglish(ragResult.sourceClause);

    return {
      directAnswer: ragResult.answer,
      explanation: translation.whatItMeans,
      risks: translation.risks,
      relatedTopics: ragResult.relatedClauses.map((c) => c.category),
    };
  } catch (error) {
    console.error('Question answering error:', error);
    throw error;
  }
}
