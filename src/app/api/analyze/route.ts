import { NextRequest, NextResponse } from 'next/server';
import { parseDocument } from '@/lib/parsers';
import { AnalysisInput } from '@/types';
import { isValidURL, sanitizeInput } from '@/lib/utils/validators';

/**
 * POST /api/analyze
 * Analyzes text, URL, or PDF for legal clauses
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { source, type } = body;

    // Validate input
    if (!source || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: source and type' },
        { status: 400 }
      );
    }

    // Validate type
    if (!['text', 'url', 'pdf'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be: text, url, or pdf' },
        { status: 400 }
      );
    }

    // Validate URL if type is url
    if (type === 'url' && !isValidURL(source)) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Sanitize text input
    const sanitizedSource = type === 'text' ? sanitizeInput(source) : source;

    // Create analysis input
    const input: AnalysisInput = {
      source: sanitizedSource,
      type: type as 'text' | 'url' | 'pdf',
    };

    // Parse document
    const parsed = await parseDocument(input);

    // Return parsed result
    return NextResponse.json({
      success: true,
      data: {
        text: parsed.text.substring(0, 1000) + '...', // Preview first 1000 chars
        metadata: parsed.metadata,
      },
    });
  } catch (error) {
    console.error('Analysis error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Analysis failed',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analyze
 * Returns API documentation
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    endpoint: '/api/analyze',
    method: 'POST',
    description: 'Analyzes legal documents from text, URL, or PDF',
    requestBody: {
      source: 'string (text content, URL, or base64 PDF)',
      type: '"text" | "url" | "pdf"',
    },
    example: {
      source: 'https://example.com/terms',
      type: 'url',
    },
  });
}
