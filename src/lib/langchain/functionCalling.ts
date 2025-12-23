/**
 * Function Calling for Structured Legal Queries
 * Uses OpenAI function calling to route specific legal questions
 */

import { ChatOpenAI } from "@langchain/openai";
import { searchSimilarClauses } from "./vectorStore";
import { classifyClause, translateToPlainEnglish } from "./classifier";
import type { AnalyzedClause, ClauseCategory } from "@/types";

// Initialize OpenAI model with function calling
const model = new ChatOpenAI({
  modelName: "gpt-4-turbo-preview",
  temperature: 0.2,
});

/**
 * Function definitions for OpenAI function calling
 */
export const legalFunctions = [
  {
    name: "find_cancellation_clause",
    description: "Find and analyze cancellation, termination, or unsubscribe clauses in terms of service",
    parameters: {
      type: "object",
      properties: {
        documentId: {
          type: "string",
          description: "The document ID to search within",
        },
      },
      required: ["documentId"],
    },
  },
  {
    name: "find_privacy_clause",
    description: "Find and analyze privacy, data collection, or personal information clauses",
    parameters: {
      type: "object",
      properties: {
        documentId: {
          type: "string",
          description: "The document ID to search within",
        },
      },
      required: ["documentId"],
    },
  },
  {
    name: "find_data_sharing_clause",
    description: "Find and analyze data sharing, third-party disclosure, or information transfer clauses",
    parameters: {
      type: "object",
      properties: {
        documentId: {
          type: "string",
          description: "The document ID to search within",
        },
      },
      required: ["documentId"],
    },
  },
  {
    name: "find_payment_clause",
    description: "Find and analyze payment, billing, pricing, or subscription fee clauses",
    parameters: {
      type: "object",
      properties: {
        documentId: {
          type: "string",
          description: "The document ID to search within",
        },
      },
      required: ["documentId"],
    },
  },
  {
    name: "find_liability_clause",
    description: "Find and analyze liability, warranty, indemnification, or legal responsibility clauses",
    parameters: {
      type: "object",
      properties: {
        documentId: {
          type: "string",
          description: "The document ID to search within",
        },
      },
      required: ["documentId"],
    },
  },
  {
    name: "analyze_specific_risk",
    description: "Analyze a specific type of risk in the document (e.g., 'privacy', 'cost', 'legal')",
    parameters: {
      type: "object",
      properties: {
        documentId: {
          type: "string",
          description: "The document ID to search within",
        },
        riskType: {
          type: "string",
          enum: ["privacy", "cost", "legal", "liability", "data_sharing", "termination"],
          description: "The type of risk to analyze",
        },
      },
      required: ["documentId", "riskType"],
    },
  },
  {
    name: "compare_clauses",
    description: "Compare similar clauses across multiple documents",
    parameters: {
      type: "object",
      properties: {
        documentIds: {
          type: "array",
          items: { type: "string" },
          description: "Array of document IDs to compare",
        },
        clauseType: {
          type: "string",
          description: "Type of clause to compare (e.g., 'cancellation', 'privacy')",
        },
      },
      required: ["documentIds", "clauseType"],
    },
  },
];

/**
 * Find cancellation/termination clauses
 */
export async function findCancellationClause(documentId: string): Promise<{
  success: boolean;
  clause?: any;
  plainEnglish?: string;
  relatedClauses?: any[];
  error?: string;
}> {
  try {
    const query = "How do I cancel this subscription? What are the termination conditions?";
    const results = await searchSimilarClauses(query, 3);

    if (!results || results.length === 0) {
      return { success: false, error: "No cancellation clause found" };
    }

    const mainClause = results[0];
    const analyzed = await classifyClause(mainClause.text);
    const plainEnglish = await translateToPlainEnglish(mainClause.text);

    return {
      success: true,
      clause: {
        id: mainClause._id || documentId,
        originalText: mainClause.text,
        plainEnglish,
        riskLevel: analyzed.riskLevel,
        category: analyzed.category as ClauseCategory,
        concernKeywords: analyzed.concerns || [],
      },
      plainEnglish,
      relatedClauses: results.slice(1).map(r => ({
        text: r.text,
        metadata: r.metadata,
      })),
    };
  } catch (error) {
    return { success: false, error: `Error: ${error}` };
  }
}

/**
 * Find privacy/data collection clauses
 */
export async function findPrivacyClause(documentId: string): Promise<{
  success: boolean;
  clause?: any;
  plainEnglish?: string;
  relatedClauses?: any[];
  error?: string;
}> {
  try {
    const query = "What personal information is collected? How is my privacy protected?";
    const results = await searchSimilarClauses(query, 3);

    if (!results || results.length === 0) {
      return { success: false, error: "No privacy clause found" };
    }

    const mainClause = results[0];
    const analyzed = await classifyClause(mainClause.text);
    const plainEnglish = await translateToPlainEnglish(mainClause.text);

    return {
      success: true,
      clause: {
        id: mainClause._id || documentId,
        originalText: mainClause.text,
        plainEnglish,
        riskLevel: analyzed.riskLevel,
        category: analyzed.category as ClauseCategory,
        concernKeywords: analyzed.concerns || [],
      },
      plainEnglish,
      relatedClauses: results.slice(1).map(r => ({
        text: r.text,
        metadata: r.metadata,
      })),
    };
  } catch (error) {
    return { success: false, error: `Error: ${error}` };
  }
}

/**
 * Find data sharing/third-party disclosure clauses
 */
export async function findDataSharingClause(documentId: string): Promise<{
  success: boolean;
  clause?: any;
  plainEnglish?: string;
  relatedClauses?: any[];
  error?: string;
}> {
  try {
    const query = "Who do they share my data with? What third parties get my information?";
    const results = await searchSimilarClauses(query, 3);

    if (!results || results.length === 0) {
      return { success: false, error: "No data sharing clause found" };
    }

    const mainClause = results[0];
    const analyzed = await classifyClause(mainClause.text);
    const plainEnglish = await translateToPlainEnglish(mainClause.text);

    return {
      success: true,
      clause: {
        id: mainClause._id || documentId,
        originalText: mainClause.text,
        plainEnglish,
        riskLevel: analyzed.riskLevel,
        category: analyzed.category as ClauseCategory,
        concernKeywords: analyzed.concerns || [],
      },
      plainEnglish,
      relatedClauses: results.slice(1).map(r => ({
        text: r.text,
        metadata: r.metadata,
      })),
    };
  } catch (error) {
    return { success: false, error: `Error: ${error}` };
  }
}

/**
 * Find payment/billing clauses
 */
export async function findPaymentClause(documentId: string): Promise<{
  success: boolean;
  clause?: any;
  plainEnglish?: string;
  relatedClauses?: any[];
  error?: string;
}> {
  try {
    const query = "What are the payment terms? How much does this cost? Are there hidden fees?";
    const results = await searchSimilarClauses(query, 3);

    if (!results || results.length === 0) {
      return { success: false, error: "No payment clause found" };
    }

    const mainClause = results[0];
    const analyzed = await classifyClause(mainClause.text);
    const plainEnglish = await translateToPlainEnglish(mainClause.text);

    return {
      success: true,
      clause: {
        id: mainClause._id || documentId,
        originalText: mainClause.text,
        plainEnglish,
        riskLevel: analyzed.riskLevel,
        category: analyzed.category as ClauseCategory,
        concernKeywords: analyzed.concerns || [],
      },
      plainEnglish,
      relatedClauses: results.slice(1).map(r => ({
        text: r.text,
        metadata: r.metadata,
      })),
    };
  } catch (error) {
    return { success: false, error: `Error: ${error}` };
  }
}

/**
 * Find liability/warranty clauses
 */
export async function findLiabilityClause(documentId: string): Promise<{
  success: boolean;
  clause?: any;
  plainEnglish?: string;
  relatedClauses?: any[];
  error?: string;
}> {
  try {
    const query = "What is their liability? What warranties do they provide? What happens if something goes wrong?";
    const results = await searchSimilarClauses(query, 3);

    if (!results || results.length === 0) {
      return { success: false, error: "No liability clause found" };
    }

    const mainClause = results[0];
    const analyzed = await classifyClause(mainClause.text);
    const plainEnglish = await translateToPlainEnglish(mainClause.text);

    return {
      success: true,
      clause: {
        id: mainClause._id || documentId,
        originalText: mainClause.text,
        plainEnglish,
        riskLevel: analyzed.riskLevel,
        category: analyzed.category as ClauseCategory,
        concernKeywords: analyzed.concerns || [],
      },
      plainEnglish,
      relatedClauses: results.slice(1).map(r => ({
        text: r.text,
        metadata: r.metadata,
      })),
    };
  } catch (error) {
    return { success: false, error: `Error: ${error}` };
  }
}

/**
 * Analyze specific risk type
 */
export async function analyzeSpecificRisk(
  documentId: string,
  riskType: "privacy" | "cost" | "legal" | "liability" | "data_sharing" | "termination"
): Promise<{
  success: boolean;
  analysis?: {
    riskType: string;
    clauses: any[];
    overallRiskLevel: "HIGH" | "MEDIUM" | "LOW";
    summary: string;
  };
  error?: string;
}> {
  try {
    const riskQueries: Record<string, string> = {
      privacy: "privacy risks, data collection, personal information handling",
      cost: "hidden fees, price increases, payment obligations, billing terms",
      legal: "legal obligations, binding arbitration, class action waivers, jurisdiction",
      liability: "liability limitations, warranty disclaimers, indemnification",
      data_sharing: "third-party data sharing, information disclosure, data selling",
      termination: "account termination, service cancellation, contract ending",
    };

    const query = riskQueries[riskType] || riskType;
    const results = await searchSimilarClauses(query, 5);

    if (!results || results.length === 0) {
      return { success: false, error: `No ${riskType} related clauses found` };
    }

    // Classify all found clauses
    const analyzedClauses: any[] = [];
    for (const clause of results) {
      const analyzed = await classifyClause(clause.text);
      analyzedClauses.push({
        id: clause._id || documentId,
        originalText: clause.text,
        riskLevel: analyzed.riskLevel,
        category: analyzed.category as ClauseCategory,
        concernKeywords: analyzed.concerns || [],
      });
    }

    // Determine overall risk level
    const highRiskCount = analyzedClauses.filter(c => c.riskLevel === "HIGH").length;
    const mediumRiskCount = analyzedClauses.filter(c => c.riskLevel === "MEDIUM").length;

    let overallRiskLevel: "HIGH" | "MEDIUM" | "LOW" = "LOW";
    if (highRiskCount >= 2 || (highRiskCount >= 1 && mediumRiskCount >= 2)) {
      overallRiskLevel = "HIGH";
    } else if (highRiskCount >= 1 || mediumRiskCount >= 2) {
      overallRiskLevel = "MEDIUM";
    }

    const summary = `Found ${analyzedClauses.length} ${riskType}-related clauses. ${highRiskCount} high-risk, ${mediumRiskCount} medium-risk. Overall risk: ${overallRiskLevel}`;

    return {
      success: true,
      analysis: {
        riskType,
        clauses: analyzedClauses,
        overallRiskLevel,
        summary,
      },
    };
  } catch (error) {
    return { success: false, error: `Error: ${error}` };
  }
}

/**
 * Compare clauses across documents
 */
export async function compareClauses(
  documentIds: string[],
  clauseType: string
): Promise<{
  success: boolean;
  comparison?: {
    clauseType: string;
    documents: Array<{
      documentId: string;
      clause?: any;
      plainEnglish?: string;
    }>;
    analysis: string;
  };
  error?: string;
}> {
  try {
    const query = `${clauseType} clause terms conditions`;
    const documents: Array<{
      documentId: string;
      clause?: any;
      plainEnglish?: string;
    }> = [];

    for (const docId of documentIds) {
      const results = await searchSimilarClauses(query, 1);
      if (results && results.length > 0) {
        const clause = results[0];
        const analyzed = await classifyClause(clause.text);
        const plainEnglish = await translateToPlainEnglish(clause.text);

        documents.push({
          documentId: docId,
          clause: {
            id: clause._id || docId,
            originalText: clause.text,
            plainEnglish,
            riskLevel: analyzed.riskLevel,
            category: analyzed.category as ClauseCategory,
            concernKeywords: analyzed.concerns || [],
          },
          plainEnglish,
        });
      } else {
        documents.push({
          documentId: docId,
        });
      }
    }

    const foundCount = documents.filter(d => d.clause).length;
    const analysis = `Compared ${clauseType} clauses across ${documentIds.length} documents. Found clauses in ${foundCount} documents.`;

    return {
      success: true,
      comparison: {
        clauseType,
        documents,
        analysis,
      },
    };
  } catch (error) {
    return { success: false, error: `Error: ${error}` };
  }
}

/**
 * Function calling router
 */
export async function routeFunctionCall(
  functionName: string,
  args: Record<string, any>
): Promise<any> {
  switch (functionName) {
    case "find_cancellation_clause":
      return await findCancellationClause(args.documentId);

    case "find_privacy_clause":
      return await findPrivacyClause(args.documentId);

    case "find_data_sharing_clause":
      return await findDataSharingClause(args.documentId);

    case "find_payment_clause":
      return await findPaymentClause(args.documentId);

    case "find_liability_clause":
      return await findLiabilityClause(args.documentId);

    case "analyze_specific_risk":
      return await analyzeSpecificRisk(args.documentId, args.riskType);

    case "compare_clauses":
      return await compareClauses(args.documentIds, args.clauseType);

    default:
      return { success: false, error: `Unknown function: ${functionName}` };
  }
}

/**
 * Process natural language query with function calling
 */
export async function processLegalQuery(query: string, documentId?: string): Promise<{
  success: boolean;
  functionCalled?: string;
  result?: any;
  directAnswer?: string;
  error?: string;
}> {
  try {
    // Use GPT-4 to determine which function to call
    const systemPrompt = `You are a legal assistant that helps users find specific clauses in terms of service documents.
Available functions: ${legalFunctions.map(f => f.name).join(", ")}

Given a user query, determine which function to call and extract parameters.
If documentId is not provided in context, respond with an error.
Return JSON: { "function": "function_name", "args": {...} }`;

    const response = await model.invoke([
      { role: "system", content: systemPrompt },
      { role: "user", content: `Query: "${query}"\nDocument ID: ${documentId || "not provided"}` },
    ]);

    const content = response.content as string;
    
    // Try to parse function call from response
    try {
      const parsed = JSON.parse(content);
      if (parsed.function && parsed.args) {
        // Add documentId if not in args
        if (!parsed.args.documentId && documentId) {
          parsed.args.documentId = documentId;
        }

        const result = await routeFunctionCall(parsed.function, parsed.args);
        return {
          success: true,
          functionCalled: parsed.function,
          result,
        };
      }
    } catch (parseError) {
      // If not parseable, treat as direct answer
      return {
        success: true,
        directAnswer: content,
      };
    }

    return {
      success: false,
      error: "Could not determine appropriate function to call",
    };
  } catch (error) {
    return {
      success: false,
      error: `Error: ${error}`,
    };
  }
}
