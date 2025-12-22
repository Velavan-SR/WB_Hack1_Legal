import { NextResponse } from 'next/server';

/**
 * CORS headers for API routes
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/**
 * Handles OPTIONS requests for CORS
 */
export function handleCORS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

/**
 * Creates JSON response with CORS headers
 */
export function jsonResponse(data: any, status: number = 200) {
  return NextResponse.json(data, {
    status,
    headers: corsHeaders,
  });
}

/**
 * Rate limiting configuration (placeholder for future implementation)
 */
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // limit each IP to 100 requests per windowMs
};
