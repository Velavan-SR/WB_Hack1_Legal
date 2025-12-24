import { NextRequest, NextResponse } from 'next/server';
import { checkDatabaseConfig } from '@/lib/database';

/**
 * Health check endpoint for production monitoring
 * GET /api/health - Returns system status and configuration
 */
export async function GET(request: NextRequest) {
  try {
    // Check database configuration
    const dbConfig = checkDatabaseConfig();

    // Check OpenAI API key
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY;

    // Calculate overall health status
    const isHealthy = dbConfig.isValid && hasOpenAIKey;

    const health = {
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      uptime: process.uptime(),
      checks: {
        database: {
          status: dbConfig.isValid ? 'ok' : 'error',
          configured: dbConfig.isValid,
          missing: dbConfig.missing,
        },
        openai: {
          status: hasOpenAIKey ? 'ok' : 'error',
          configured: hasOpenAIKey,
        },
        langchain: {
          status: process.env.LANGCHAIN_TRACING_V2 === 'true' ? 'enabled' : 'disabled',
          configured: !!process.env.LANGCHAIN_API_KEY,
        },
      },
      endpoints: {
        analyze: '/api/analyze',
        search: '/api/search',
        query: '/api/query',
        dbTest: '/api/db-test',
      },
    };

    return NextResponse.json(health, {
      status: isHealthy ? 200 : 503,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
