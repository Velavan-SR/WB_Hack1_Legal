import { NextRequest, NextResponse } from 'next/server';
import { parseDocument } from '@/lib/parsers';
import { AnalysisInput, AnalysisResult } from '@/types';
import { isValidURL, sanitizeInput } from '@/lib/utils/validators';
import { analyzeFlagsDetailed, extractClauses } from '@/lib/utils/flagDetection';
import { analyzeMultipleClauses, calculateDocumentRiskScore, generateAnalysisSummary } from '@/lib/langchain/clauseAnalyzer';
import { generateDocumentId } from '@/lib/database/utils';

/**
 * POST /api/analyze
 * Analyzes text, URL, or PDF for legal clauses with full risk detection
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { source, type, useAI = true } = body;

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

    // If useAI is false, just return pattern-based analysis (faster)
    if (!useAI) {
      const flagAnalysis = analyzeFlagsDetailed(parsed.text);
      
      return NextResponse.json({
        success: true,
        documentId: generateDocumentId(parsed.metadata.source),
        source: parsed.metadata.source,
        metadata: parsed.metadata,
        analysis: {
          redFlagsCount: flagAnalysis.redFlags.length,
          yellowFlagsCount: flagAnalysis.yellowFlags.length,
          greenFlagsCount: flagAnalysis.greenFlags.length,
          overallRisk: flagAnalysis.overallRisk,
          flags: flagAnalysis,
        },
      });
    }

    // Full AI-powered analysis
    const clauses = extractClauses(parsed.text);
    
    // Limit to first 10 clauses for demo (to avoid high costs)
    const clausesToAnalyze = clauses.slice(0, 10);
    
    const analyzed = await analyzeMultipleClauses(clausesToAnalyze);

    const riskScore = calculateDocumentRiskScore(
      analyzed.redFlags.length,
      analyzed.yellowFlags.length,
      analyzed.greenFlags.length
    );

    const summary = generateAnalysisSummary(
      analyzed.redFlags,
      analyzed.yellowFlags,
      analyzed.greenFlags
    );

    const result: AnalysisResult = {
      documentId: generateDocumentId(parsed.metadata.source),
      source: parsed.metadata.source,
      analyzedAt: new Date(),
      redFlags: analyzed.redFlags,
      yellowFlags: analyzed.yellowFlags,
      greenFlags: analyzed.greenFlags,
      totalClauses: clausesToAnalyze.length,
      riskScore,
      summary,
    };

    return NextResponse.json({
      success: true,
      data: result,
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
    description: 'Analyzes legal documents from text, URL, or PDF with AI-powered risk detection',
    requestBody: {
      source: 'string (text content, URL, or base64 PDF)',
      type: '"text" | "url" | "pdf"',
      useAI: 'boolean (optional, default: true) - Use GPT-4 for analysis or pattern matching only',
    },
    example: {
      source: 'https://example.com/terms',
      type: 'url',
      useAI: true,
    },
    response: {
      redFlags: 'Array of high-risk clauses',
      yellowFlags: 'Array of medium-risk clauses',
      greenFlags: 'Array of fair/standard clauses',
      riskScore: 'Overall risk score (0-100)',
      summary: 'Human-readable analysis summary',
    },
  });
}
