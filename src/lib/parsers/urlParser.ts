import axios from 'axios';
import * as cheerio from 'cheerio';
import { ParsedDocument } from '@/types';

/**
 * Fetches and parses Terms & Conditions from a URL
 * Uses Cheerio for HTML parsing and text extraction
 */
export async function parseURL(url: string): Promise<ParsedDocument> {
  try {
    // Fetch the webpage
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    // Load HTML into Cheerio
    const $ = cheerio.load(response.data);

    // Remove script and style elements
    $('script, style, nav, header, footer').remove();

    // Extract title
    const title = $('title').text().trim() || 'Untitled Document';

    // Extract main content - try common content selectors
    let text = '';
    
    // Try common content containers
    const contentSelectors = [
      'main',
      'article',
      '[role="main"]',
      '.content',
      '#content',
      '.terms',
      '.legal',
    ];

    for (const selector of contentSelectors) {
      const content = $(selector).text();
      if (content.length > text.length) {
        text = content;
      }
    }

    // Fallback to body if no specific content found
    if (!text || text.length < 100) {
      text = $('body').text();
    }

    // Clean up the text
    text = text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n') // Remove empty lines
      .trim();

    if (!text || text.length < 50) {
      throw new Error('Insufficient text content found at URL');
    }

    const wordCount = text.split(/\s+/).length;

    return {
      text,
      metadata: {
        source: url,
        type: 'url',
        title,
        wordCount,
        parsedAt: new Date(),
      },
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch URL: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Validates if a URL is accessible and returns valid HTML
 */
export async function validateURL(url: string): Promise<boolean> {
  try {
    const response = await axios.head(url, { timeout: 5000 });
    const contentType = response.headers['content-type'] || '';
    return contentType.includes('text/html');
  } catch {
    return false;
  }
}
