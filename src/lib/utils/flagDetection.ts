import { RISK_PATTERNS, CLAUSE_CATEGORIES } from '../constants/riskPatterns';
import { RiskLevel, ClauseCategory } from '@/types';

/**
 * Detects flags based on pattern matching
 */
export function detectFlagsByPatterns(text: string): {
  redFlags: string[];
  yellowFlags: string[];
  greenFlags: string[];
} {
  const lowerText = text.toLowerCase();
  const redFlags: string[] = [];
  const yellowFlags: string[] = [];
  const greenFlags: string[] = [];

  // Check HIGH risk patterns (Red Flags)
  for (const [category, patterns] of Object.entries(RISK_PATTERNS.HIGH)) {
    for (const pattern of patterns) {
      const regex = new RegExp(pattern, 'i');
      if (regex.test(lowerText)) {
        redFlags.push(`${category}: ${pattern}`);
      }
    }
  }

  // Check MEDIUM risk patterns (Yellow Flags)
  for (const [category, patterns] of Object.entries(RISK_PATTERNS.MEDIUM)) {
    for (const pattern of patterns) {
      const regex = new RegExp(pattern, 'i');
      if (regex.test(lowerText)) {
        yellowFlags.push(`${category}: ${pattern}`);
      }
    }
  }

  // Check LOW risk patterns (Green Flags - positive indicators)
  for (const [category, patterns] of Object.entries(RISK_PATTERNS.LOW)) {
    for (const pattern of patterns) {
      const regex = new RegExp(pattern, 'i');
      if (regex.test(lowerText)) {
        greenFlags.push(`${category}: ${pattern}`);
      }
    }
  }

  return { redFlags, yellowFlags, greenFlags };
}

/**
 * Categorizes a clause based on keyword matching
 */
export function categorizeClause(text: string): ClauseCategory {
  const lowerText = text.toLowerCase();
  const scores: Record<ClauseCategory, number> = {
    'data-privacy': 0,
    'payment': 0,
    'cancellation': 0,
    'arbitration': 0,
    'liability': 0,
    'intellectual-property': 0,
    'termination': 0,
    'modification': 0,
    'other': 0,
  };

  // Score each category based on keyword matches
  for (const [category, keywords] of Object.entries(CLAUSE_CATEGORIES)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        scores[category as ClauseCategory]++;
      }
    }
  }

  // Find category with highest score
  let maxScore = 0;
  let bestCategory: ClauseCategory = 'other';

  for (const [category, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestCategory = category as ClauseCategory;
    }
  }

  return bestCategory;
}

/**
 * Determines risk level based on flag counts
 */
export function determineRiskLevel(
  redFlagCount: number,
  yellowFlagCount: number
): RiskLevel {
  if (redFlagCount > 0) return 'HIGH';
  if (yellowFlagCount > 1) return 'MEDIUM';
  if (yellowFlagCount === 1) return 'MEDIUM';
  return 'LOW';
}

/**
 * Extracts individual clauses from text based on section numbers
 */
export function extractClauses(text: string): string[] {
  // Try to split by section numbers (1., 2., etc.)
  const sectionRegex = /\n\s*\d+\.\s+/g;
  const parts = text.split(sectionRegex);

  // Filter out empty parts and very short sections
  const clauses = parts
    .map((p) => p.trim())
    .filter((p) => p.length > 50);

  // If we didn't find numbered sections, split by paragraphs
  if (clauses.length < 2) {
    return text
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 50);
  }

  return clauses;
}

/**
 * Analyzes text and returns color-coded flags with explanations
 */
export interface FlagDetectionResult {
  redFlags: Array<{
    text: string;
    reason: string;
    category: string;
  }>;
  yellowFlags: Array<{
    text: string;
    reason: string;
    category: string;
  }>;
  greenFlags: Array<{
    text: string;
    reason: string;
    category: string;
  }>;
  overallRisk: RiskLevel;
}

export function analyzeFlagsDetailed(text: string): FlagDetectionResult {
  const patterns = detectFlagsByPatterns(text);
  
  const redFlags = patterns.redFlags.map((flag) => {
    const [category, pattern] = flag.split(': ');
    return {
      text: findTextSnippet(text, pattern),
      reason: generateFlagReason(pattern, 'HIGH'),
      category,
    };
  });

  const yellowFlags = patterns.yellowFlags.map((flag) => {
    const [category, pattern] = flag.split(': ');
    return {
      text: findTextSnippet(text, pattern),
      reason: generateFlagReason(pattern, 'MEDIUM'),
      category,
    };
  });

  const greenFlags = patterns.greenFlags.map((flag) => {
    const [category, pattern] = flag.split(': ');
    return {
      text: findTextSnippet(text, pattern),
      reason: generateFlagReason(pattern, 'LOW'),
      category,
    };
  });

  const overallRisk = determineRiskLevel(redFlags.length, yellowFlags.length);

  return {
    redFlags,
    yellowFlags,
    greenFlags,
    overallRisk,
  };
}

/**
 * Finds the text snippet containing the pattern
 */
function findTextSnippet(text: string, pattern: string): string {
  const regex = new RegExp(pattern, 'i');
  const match = regex.exec(text);
  
  if (!match) return '';

  const start = Math.max(0, match.index - 50);
  const end = Math.min(text.length, match.index + match[0].length + 50);
  
  let snippet = text.slice(start, end);
  if (start > 0) snippet = '...' + snippet;
  if (end < text.length) snippet = snippet + '...';
  
  return snippet;
}

/**
 * Generates human-readable reason for the flag
 */
function generateFlagReason(pattern: string, risk: RiskLevel): string {
  const reasons: Record<string, string> = {
    'sell your data': '🔴 Your personal data may be sold to third parties',
    'third.{0,10}part': '⚠️ Information may be shared with third parties',
    'auto.{0,5}renew': '🔴 Automatic renewal without easy cancellation',
    'non-refundable': '⚠️ You cannot get your money back',
    'forced arbitration': '🔴 You give up your right to sue in court',
    'terminate.*access': '⚠️ They can terminate your access at any time',
    'GDPR': '✅ Complies with GDPR data protection',
    'right to cancel': '✅ You have the right to cancel',
  };

  return reasons[pattern] || `${risk} risk detected: ${pattern}`;
}
