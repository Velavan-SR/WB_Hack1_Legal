import pdf from 'pdf-parse';
import { ParsedDocument } from '@/types';

/**
 * Parses PDF file and extracts text content
 * Accepts Buffer or base64 string
 */
export async function parsePDF(
  pdfData: Buffer | string,
  filename?: string
): Promise<ParsedDocument> {
  try {
    // Convert base64 to Buffer if needed
    const buffer = typeof pdfData === 'string' 
      ? Buffer.from(pdfData, 'base64')
      : pdfData;

    // Parse PDF
    const data = await pdf(buffer);

    // Extract and clean text
    let text = data.text
      .replace(/\s+/g, ' ') // Replace multiple spaces
      .replace(/\n\s*\n/g, '\n') // Remove empty lines
      .trim();

    if (!text || text.length < 50) {
      throw new Error('Insufficient text content in PDF');
    }

    const wordCount = text.split(/\s+/).length;

    return {
      text,
      metadata: {
        source: filename || 'uploaded-pdf',
        type: 'pdf',
        title: filename || 'PDF Document',
        pageCount: data.numpages,
        wordCount,
        parsedAt: new Date(),
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`PDF parsing failed: ${error.message}`);
    }
    throw new Error('PDF parsing failed: Unknown error');
  }
}

/**
 * Validates PDF data before parsing
 */
export function validatePDF(data: Buffer | string): boolean {
  try {
    const buffer = typeof data === 'string' 
      ? Buffer.from(data, 'base64')
      : data;
    
    // Check PDF header signature
    const header = buffer.slice(0, 5).toString();
    return header === '%PDF-';
  } catch {
    return false;
  }
}
