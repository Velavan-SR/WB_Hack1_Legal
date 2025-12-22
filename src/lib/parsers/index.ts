/**
 * Unified parser interface for all document types
 * Exports all parsing functions
 */

export { parseURL, validateURL } from './urlParser';
export { parsePDF, validatePDF } from './pdfParser';
export { parseText, validateText, splitTextIntoChunks } from './textParser';

import { parseURL } from './urlParser';
import { parsePDF } from './pdfParser';
import { parseText } from './textParser';
import { AnalysisInput, ParsedDocument } from '@/types';

/**
 * Universal parser that routes to appropriate parser based on input type
 */
export async function parseDocument(input: AnalysisInput): Promise<ParsedDocument> {
  switch (input.type) {
    case 'url':
      return await parseURL(input.source);
    
    case 'pdf':
      // Assuming source is base64 encoded PDF data
      return await parsePDF(input.source);
    
    case 'text':
      return parseText(input.source);
    
    default:
      throw new Error(`Unsupported input type: ${input.type}`);
  }
}
