import { RiskLevel, ClauseCategory, AnalyzedClause } from '@/types';
import { classifyClause, detectRisks, translateToPlainEnglish } from './classifier';

/**
 * Analyzes a single clause and returns structured data
 */
export async function analyzeClause(text: string): Promise<AnalyzedClause> {
  try {
    // Run classification and risk detection in parallel
    const [classification, risks] = await Promise.all([
      classifyClause(text),
      detectRisks(text),
    ]);

    // Determine risk level based on multiple factors
    const riskLevel: RiskLevel = determineRiskLevel(
      classification.riskLevel,
      risks.overallRiskScore
    );

    // Get plain English translation
    const plainEnglish = classification.plainEnglish || '';

    return {
      id: generateClauseId(),
      originalText: text,
      plainEnglish,
      riskLevel,
      category: (classification.category as ClauseCategory) || 'other',
      concernKeywords: risks.redFlags || classification.concerns || [],
    };
  } catch (error) {
    console.error('Error analyzing clause:', error);
    throw error;
  }
}

/**
 * Analyzes multiple clauses and categorizes them by risk level
 */
export async function analyzeMultipleClauses(clauses: string[]): Promise<{
  redFlags: AnalyzedClause[];
  yellowFlags: AnalyzedClause[];
  greenFlags: AnalyzedClause[];
}> {
  const results = await Promise.all(
    clauses.map((clause) => analyzeClause(clause))
  );

  const categorized = {
    redFlags: results.filter((c) => c.riskLevel === 'HIGH'),
    yellowFlags: results.filter((c) => c.riskLevel === 'MEDIUM'),
    greenFlags: results.filter((c) => c.riskLevel === 'LOW'),
  };

  return categorized;
}

/**
 * Determines overall risk level based on classification and score
 */
function determineRiskLevel(
  classifiedLevel: string,
  riskScore: number
): RiskLevel {
  // If risk score is explicitly high
  if (riskScore >= 70) return 'HIGH';
  if (riskScore <= 30) return 'LOW';

  // Otherwise use classification
  if (classifiedLevel === 'HIGH') return 'HIGH';
  if (classifiedLevel === 'MEDIUM') return 'MEDIUM';
  return 'LOW';
}

/**
 * Generates unique ID for a clause
 */
function generateClauseId(): string {
  return `clause_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Calculates overall risk score for a document
 */
export function calculateDocumentRiskScore(
  redFlags: number,
  yellowFlags: number,
  greenFlags: number
): number {
  const total = redFlags + yellowFlags + greenFlags;
  
  if (total === 0) return 0;

  // Weighted calculation
  const score = ((redFlags * 100 + yellowFlags * 50) / (total * 100)) * 100;
  
  return Math.min(Math.round(score), 100);
}

/**
 * Generates a summary string from analysis results
 */
export function generateAnalysisSummary(
  redFlags: AnalyzedClause[],
  yellowFlags: AnalyzedClause[],
  greenFlags: AnalyzedClause[]
): string {
  const riskScore = calculateDocumentRiskScore(
    redFlags.length,
    yellowFlags.length,
    greenFlags.length
  );

  let summary = '';

  if (redFlags.length > 0) {
    summary += `⚠️ CRITICAL: Found ${redFlags.length} high-risk clause(s) that take away your rights. `;
  }

  if (yellowFlags.length > 0) {
    summary += `⚠️ WARNING: Found ${yellowFlags.length} medium-risk clause(s) requiring attention. `;
  }

  if (greenFlags.length > 0) {
    summary += `✅ Good: Found ${greenFlags.length} fair/standard clause(s). `;
  }

  summary += `Overall Risk Score: ${riskScore}/100`;

  return summary;
}
