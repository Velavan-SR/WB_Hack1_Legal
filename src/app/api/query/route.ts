/**
 * API Route: /api/query
 * Natural language queries with function calling
 */

import { NextRequest, NextResponse } from "next/server";
import {
  processLegalQuery,
  findCancellationClause,
  findPrivacyClause,
  findDataSharingClause,
  findPaymentClause,
  findLiabilityClause,
  analyzeSpecificRisk,
  compareClauses,
  legalFunctions,
} from "@/lib/langchain/functionCalling";
import { validateQuery } from "@/lib/utils/validators";

/**
 * POST /api/query
 * Process natural language legal queries with function calling
 * 
 * Request body:
 * {
 *   "query": "How do I cancel my subscription?",
 *   "documentId": "optional-document-id",
 *   "mode": "auto" | "specific",
 *   "function": "find_cancellation_clause" (if mode is "specific"),
 *   "args": { "documentId": "..." } (if mode is "specific")
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, documentId, mode = "auto", function: functionName, args } = body;

    // Validate query
    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Invalid request: query is required" },
        { status: 400 }
      );
    }

    const queryValidation = validateQuery(query);
    if (!queryValidation.isValid) {
      return NextResponse.json(
        { error: queryValidation.error },
        { status: 400 }
      );
    }

    // Mode: auto - use GPT-4 to determine function
    if (mode === "auto") {
      const result = await processLegalQuery(query, documentId);
      return NextResponse.json(result);
    }

    // Mode: specific - directly call specified function
    if (mode === "specific") {
      if (!functionName) {
        return NextResponse.json(
          { error: "function name required for specific mode" },
          { status: 400 }
        );
      }

      const functionArgs = args || {};
      if (documentId && !functionArgs.documentId) {
        functionArgs.documentId = documentId;
      }

      let result;
      switch (functionName) {
        case "find_cancellation_clause":
          if (!functionArgs.documentId) {
            return NextResponse.json(
              { error: "documentId required" },
              { status: 400 }
            );
          }
          result = await findCancellationClause(functionArgs.documentId);
          break;

        case "find_privacy_clause":
          if (!functionArgs.documentId) {
            return NextResponse.json(
              { error: "documentId required" },
              { status: 400 }
            );
          }
          result = await findPrivacyClause(functionArgs.documentId);
          break;

        case "find_data_sharing_clause":
          if (!functionArgs.documentId) {
            return NextResponse.json(
              { error: "documentId required" },
              { status: 400 }
            );
          }
          result = await findDataSharingClause(functionArgs.documentId);
          break;

        case "find_payment_clause":
          if (!functionArgs.documentId) {
            return NextResponse.json(
              { error: "documentId required" },
              { status: 400 }
            );
          }
          result = await findPaymentClause(functionArgs.documentId);
          break;

        case "find_liability_clause":
          if (!functionArgs.documentId) {
            return NextResponse.json(
              { error: "documentId required" },
              { status: 400 }
            );
          }
          result = await findLiabilityClause(functionArgs.documentId);
          break;

        case "analyze_specific_risk":
          if (!functionArgs.documentId || !functionArgs.riskType) {
            return NextResponse.json(
              { error: "documentId and riskType required" },
              { status: 400 }
            );
          }
          result = await analyzeSpecificRisk(
            functionArgs.documentId,
            functionArgs.riskType
          );
          break;

        case "compare_clauses":
          if (!functionArgs.documentIds || !functionArgs.clauseType) {
            return NextResponse.json(
              { error: "documentIds and clauseType required" },
              { status: 400 }
            );
          }
          result = await compareClauses(
            functionArgs.documentIds,
            functionArgs.clauseType
          );
          break;

        default:
          return NextResponse.json(
            { error: `Unknown function: ${functionName}` },
            { status: 400 }
          );
      }

      return NextResponse.json({
        success: true,
        function: functionName,
        result,
      });
    }

    return NextResponse.json(
      { error: "Invalid mode. Use 'auto' or 'specific'" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Query API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: `${error}` },
      { status: 500 }
    );
  }
}

/**
 * GET /api/query
 * Get API documentation and available functions
 */
export async function GET() {
  return NextResponse.json({
    endpoint: "/api/query",
    description: "Process natural language legal queries with function calling",
    methods: {
      POST: {
        description: "Submit a legal query",
        modes: {
          auto: {
            description: "Automatically determine which function to call based on query",
            body: {
              query: "string (required) - Natural language question",
              documentId: "string (optional) - Document to search in",
              mode: "'auto'",
            },
            example: {
              query: "How do I cancel my subscription?",
              documentId: "doc_123",
              mode: "auto",
            },
          },
          specific: {
            description: "Directly call a specific function",
            body: {
              query: "string (required) - Natural language question",
              documentId: "string (optional) - Document to search in",
              mode: "'specific'",
              function: "string (required) - Function name to call",
              args: "object (optional) - Function arguments",
            },
            example: {
              query: "Find cancellation terms",
              documentId: "doc_123",
              mode: "specific",
              function: "find_cancellation_clause",
              args: { documentId: "doc_123" },
            },
          },
        },
        availableFunctions: legalFunctions.map((f) => ({
          name: f.name,
          description: f.description,
          parameters: f.parameters,
        })),
      },
      GET: {
        description: "Get API documentation",
      },
    },
    examples: [
      {
        title: "Auto mode - Natural query",
        request: {
          method: "POST",
          url: "/api/query",
          body: {
            query: "How do I cancel my subscription?",
            documentId: "doc_123",
            mode: "auto",
          },
        },
      },
      {
        title: "Specific mode - Find privacy clause",
        request: {
          method: "POST",
          url: "/api/query",
          body: {
            query: "Show me privacy terms",
            mode: "specific",
            function: "find_privacy_clause",
            args: { documentId: "doc_123" },
          },
        },
      },
      {
        title: "Specific mode - Analyze risk",
        request: {
          method: "POST",
          url: "/api/query",
          body: {
            query: "What are the privacy risks?",
            mode: "specific",
            function: "analyze_specific_risk",
            args: { documentId: "doc_123", riskType: "privacy" },
          },
        },
      },
      {
        title: "Specific mode - Compare clauses",
        request: {
          method: "POST",
          url: "/api/query",
          body: {
            query: "Compare cancellation terms",
            mode: "specific",
            function: "compare_clauses",
            args: {
              documentIds: ["doc_123", "doc_456"],
              clauseType: "cancellation",
            },
          },
        },
      },
    ],
  });
}
