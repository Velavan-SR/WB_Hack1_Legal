import { NextRequest, NextResponse } from 'next/server';
import { checkDatabaseConfig } from '@/lib/database';

/**
 * Health check endpoint
 * Verifies system configuration and readiness
 */
export async function GET(request: NextRequest) {
  try {
    // Check database configuration
    const dbConfig = checkDatabaseConfig();

    // Check OpenAI API key
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY;

    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      checks: {
        database: {
          configured: dbConfig.isValid,
          missing: dbConfig.missing,
        },
        openai: {
          configured: hasOpenAIKey,
        },
      },
    };

    // Overall health status
    const isHealthy = dbConfig.isValid && hasOpenAIKey;

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
