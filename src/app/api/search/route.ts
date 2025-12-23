import { NextRequest, NextResponse } from 'next/server';
import { ragSearch, enhancedRAGSearch, findAndExplainClause, askAboutTerms } from '@/lib/langchain/rag';

/**
 * POST /api/search
 * Semantic search with RAG and plain English translation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, mode = 'simple', limit = 5 } = body;

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

    // Different search modes
    switch (mode) {
      case 'simple':
        // Simple RAG search with answer
        const simpleResult = await ragSearch(query);
        return NextResponse.json({
          success: true,
          mode: 'simple',
          result: simpleResult,
        });

      case 'enhanced':
        // Enhanced search with multiple context clauses
        const enhancedResult = await enhancedRAGSearch(query);
        return NextResponse.json({
          success: true,
          mode: 'enhanced',
          result: enhancedResult,
        });

      case 'explain':
        // Find and explain relevant clauses
        const explainResults = await findAndExplainClause(query);
        return NextResponse.json({
          success: true,
          mode: 'explain',
          results: explainResults.slice(0, limit),
        });

      case 'ask':
        // Question answering mode
        const askResult = await askAboutTerms(query);
        return NextResponse.json({
          success: true,
          mode: 'ask',
          result: askResult,
        });

      default:
        return NextResponse.json(
          { error: 'Invalid mode. Use: simple, enhanced, explain, or ask' },
          { status: 400 }
        );
    }
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
    description: 'RAG-powered semantic search with plain English translations',
    requestBody: {
      query: 'string (search query or question)',
      mode: '"simple" | "enhanced" | "explain" | "ask" (default: simple)',
      limit: 'number (optional, for explain mode)',
    },
    modes: {
      simple: 'Quick answer with RAG (recommended for questions)',
      enhanced: 'Multi-clause context with comprehensive answer',
      explain: 'Find clauses and translate to plain English',
      ask: 'Q&A with detailed explanation and risks',
    },
    examples: [
      {
        query: 'How do I cancel my subscription?',
        mode: 'ask',
      },
      {
        query: 'data privacy',
        mode: 'explain',
        limit: 3,
      },
    ],
  });
}
