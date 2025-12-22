import { NextRequest, NextResponse } from 'next/server';
import { searchSimilarClauses } from '@/lib/langchain';

/**
 * POST /api/search
 * Searches for similar clauses using semantic search
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, limit = 5 } = body;

    // Validate input
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    if (query.trim().length < 3) {
      return NextResponse.json(
        { error: 'Query must be at least 3 characters' },
        { status: 400 }
      );
    }

    // Perform semantic search
    const results = await searchSimilarClauses(query, Math.min(limit, 20));

    return NextResponse.json({
      success: true,
      query,
      resultsCount: results.length,
      results: results.map((result) => ({
        text: result.text,
        category: result.metadata.category,
        riskLevel: result.metadata.riskLevel,
        source: result.metadata.sourceUrl,
      })),
    });
  } catch (error) {
    console.error('Search error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Search failed',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/search
 * Returns API documentation
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    endpoint: '/api/search',
    method: 'POST',
    description: 'Searches for similar legal clauses using semantic search',
    requestBody: {
      query: 'string (search query)',
      limit: 'number (optional, default: 5, max: 20)',
    },
    example: {
      query: 'How do I cancel my subscription?',
      limit: 5,
    },
  });
}
