/**
 * Central exports for database functionality
 */

export {
  connectToMongoDB,
  getDatabase,
  getClausesCollection,
  createVectorSearchIndex,
  vectorSearch,
  storeClause,
  storeClauses,
  closeMongoDB,
} from './mongodb';

export {
  validateMongoDBUri,
  checkDatabaseConfig,
  formatDatabaseError,
  generateDocumentId,
} from './utils';
