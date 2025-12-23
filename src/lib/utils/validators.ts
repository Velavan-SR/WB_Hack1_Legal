/**
 * Input validation utilities
 */

/**
 * Validates URL format and protocol
 */
export function isValidURL(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validates file size
 */
export function isValidFileSize(sizeInBytes: number, maxMB: number = 10): boolean {
  const maxBytes = maxMB * 1024 * 1024;
  return sizeInBytes <= maxBytes;
}

/**
 * Validates text length
 */
export function isValidTextLength(
  text: string,
  minLength: number = 50,
  maxLength: number = 100000
): { valid: boolean; error?: string } {
  const length = text.trim().length;

  if (length < minLength) {
    return {
      valid: false,
      error: `Text must be at least ${minLength} characters`,
    };
  }

  if (length > maxLength) {
    return {
      valid: false,
      error: `Text exceeds maximum length of ${maxLength} characters`,
    };
  }

  return { valid: true };
}

/**
 * Sanitizes user input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .trim();
}

/**
 * Validates query string for legal queries
 */
export function validateQuery(query: string): { isValid: boolean; error?: string } {
  if (!query || typeof query !== 'string') {
    return { isValid: false, error: 'Query must be a non-empty string' };
  }

  const trimmed = query.trim();
  
  if (trimmed.length < 3) {
    return { isValid: false, error: 'Query must be at least 3 characters long' };
  }

  if (trimmed.length > 500) {
    return { isValid: false, error: 'Query must be less than 500 characters' };
  }

  return { isValid: true };
}
