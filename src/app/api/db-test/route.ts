import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB, closeMongoDB } from '@/lib/database';

/**
 * Database connection test endpoint
 */
export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now();
    
    // Attempt to connect
    await connectToMongoDB();
    
    const duration = Date.now() - startTime;

    return NextResponse.json({
      status: 'connected',
      message: 'Successfully connected to MongoDB Atlas',
      duration: `${duration}ms`,
      database: process.env.MONGODB_DB_NAME,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Database connection failed',
      },
      { status: 500 }
    );
  }
}

/**
 * Cleanup endpoint (for testing)
 */
export async function DELETE(request: NextRequest) {
  try {
    await closeMongoDB();
    return NextResponse.json({
      status: 'disconnected',
      message: 'Database connection closed',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to close connection',
      },
      { status: 500 }
    );
  }
}
