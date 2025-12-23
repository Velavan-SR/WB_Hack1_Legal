/**
 * Central exports for LangChain functionality
 */

export {
  getEmbeddings,
  generateEmbedding,
  generateEmbeddings,
  cosineSimilarity,
} from './embeddings';

export {
  searchSimilarClauses,
  indexClause,
  indexClauses,
} from './vectorStore';

export {
  getLLM,
  classifyClause,
  analyzeDocument,
  detectRisks,
  translateToPlainEnglish,
  answerClauseQuestion,
} from './classifier';

export {
  analyzeClause,
  analyzeMultipleClauses,
  calculateDocumentRiskScore,
  generateAnalysisSummary,
} from './clauseAnalyzer';
