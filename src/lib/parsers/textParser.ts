import { ParsedDocument } from '@/types';

/**
 * Processes raw text input for analysis
 * Cleans and validates the text content
 */
export function parseText(rawText: string): ParsedDocument {
  // Clean the text
  const text = rawText
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n\s*\n/g, '\n') // Remove empty lines
    .trim();

  if (!text || text.length < 50) {
    throw new Error('Text must be at least 50 characters long');
  }

  const wordCount = text.split(/\s+/).length;

  return {
    text,
    metadata: {
      source: 'direct-input',
      type: 'text',
      title: 'Direct Text Input',
      wordCount,
      parsedAt: new Date(),
    },
  };
}

/**
 * Validates text input before processing
 */
export function validateText(text: string): {
  valid: boolean;
  error?: string;
} {
  if (!text || typeof text !== 'string') {
    return { valid: false, error: 'Text input is required' };
  }

  const cleanText = text.trim();

  if (cleanText.length < 50) {
    return { valid: false, error: 'Text must be at least 50 characters' };
  }

  if (cleanText.length > 100000) {
    return { valid: false, error: 'Text exceeds maximum length of 100,000 characters' };
  }

  return { valid: true };
}

/**
 * Splits text into manageable chunks for processing
 * Useful for large documents that need to be processed in batches
 */
export function splitTextIntoChunks(
  text: string,
  maxChunkSize: number = 4000,
  overlapSize: number = 200
): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize && currentChunk) {
      chunks.push(currentChunk.trim());
      
      // Add overlap from the end of the previous chunk
      const words = currentChunk.split(/\s+/);
      const overlapWords = words.slice(-Math.floor(overlapSize / 5));
      currentChunk = overlapWords.join(' ') + ' ' + sentence;
    } else {
      currentChunk += ' ' + sentence;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
