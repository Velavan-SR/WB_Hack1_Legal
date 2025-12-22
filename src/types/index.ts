// Risk severity levels for clause classification
export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

// Analyzed clause with risk assessment
export interface AnalyzedClause {
  id: string;
  originalText: string;
  plainEnglish: string;
  riskLevel: RiskLevel;
  category: ClauseCategory;
  section?: string;
  concernKeywords: string[];
}

// Clause categories for classification
export type ClauseCategory =
  | 'data-privacy'
  | 'payment'
  | 'cancellation'
  | 'arbitration'
  | 'liability'
  | 'intellectual-property'
  | 'termination'
  | 'modification'
  | 'other';

// Complete analysis result
export interface AnalysisResult {
  documentId: string;
  source: string;
  analyzedAt: Date;
  redFlags: AnalyzedClause[];
  yellowFlags: AnalyzedClause[];
  greenFlags: AnalyzedClause[];
  totalClauses: number;
  riskScore: number; // 0-100
  summary: string;
}

// Input source types
export interface AnalysisInput {
  source: string; // URL or raw text
  type: 'url' | 'text' | 'pdf';
}

// MongoDB document structure
export interface ClauseDocument {
  _id?: string;
  text: string;
  embedding: number[];
  metadata: {
    category: ClauseCategory;
    riskLevel: RiskLevel;
    sourceUrl?: string;
    analyzedAt: Date;
  };
}

// Parser result structure
export interface ParsedDocument {
  text: string;
  metadata: {
    source: string;
    type: 'url' | 'text' | 'pdf';
    title?: string;
    pageCount?: number;
    wordCount: number;
    parsedAt: Date;
  };
}
