/**
 * Database utility functions and helpers
 */

/**
 * Validates MongoDB connection string
 */
export function validateMongoDBUri(uri: string): boolean {
  try {
    // Check if it starts with mongodb:// or mongodb+srv://
    if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
      return false;
    }

    // Basic format validation
    const url = new URL(uri);
    return url.protocol === 'mongodb:' || url.protocol === 'mongodb+srv:';
  } catch {
    return false;
  }
}

/**
 * Checks if required environment variables are set
 */
export function checkDatabaseConfig(): {
  isValid: boolean;
  missing: string[];
} {
  const required = ['MONGODB_URI', 'MONGODB_DB_NAME', 'MONGODB_COLLECTION_NAME'];
  const missing: string[] = [];

  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
  };
}

/**
 * Formats database error messages for user display
 */
export function formatDatabaseError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('ECONNREFUSED')) {
      return 'Unable to connect to database. Please check your connection.';
    }
    if (error.message.includes('authentication failed')) {
      return 'Database authentication failed. Please check your credentials.';
    }
    if (error.message.includes('not authorized')) {
      return 'Not authorized to access this database.';
    }
    return error.message;
  }
  return 'An unknown database error occurred';
}

/**
 * Generates a unique document ID
 */
export function generateDocumentId(source: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const sourceHash = source.split('').reduce((acc, char) => {
    return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
  }, 0);
  
  return `doc_${timestamp}_${Math.abs(sourceHash)}_${random}`;
}
