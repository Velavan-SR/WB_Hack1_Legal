/**
 * Utility functions for text processing and analysis
 */

/**
 * Detects if text contains common legal keywords
 */
export function detectLegalContent(text: string): boolean {
  const legalKeywords = [
    'terms',
    'conditions',
    'agreement',
    'contract',
    'policy',
    'privacy',
    'rights',
    'obligations',
    'liability',
    'warranties',
  ];

  const lowerText = text.toLowerCase();
  const matchCount = legalKeywords.filter(keyword => 
    lowerText.includes(keyword)
  ).length;

  return matchCount >= 3;
}

/**
 * Extracts section headers from text
 */
export function extractSections(text: string): { title: string; content: string }[] {
  // Match numbered sections like "1.", "1.1", "Article 1", etc.
  const sectionRegex = /(?:^|\n)(\d+\.(?:\d+\.)*\s+[A-Z][^\n]+)/g;
  const matches = Array.from(text.matchAll(sectionRegex));

  if (matches.length === 0) {
    return [{ title: 'Full Document', content: text }];
  }

  const sections: { title: string; content: string }[] = [];
  
  for (let i = 0; i < matches.length; i++) {
    const title = matches[i][1].trim();
    const startIndex = matches[i].index || 0;
    const endIndex = i < matches.length - 1 
      ? matches[i + 1].index 
      : text.length;
    
    const content = text.slice(startIndex, endIndex).trim();
    sections.push({ title, content });
  }

  return sections;
}

/**
 * Identifies potentially risky keywords in text
 */
export function findRiskKeywords(text: string): {
  high: string[];
  medium: string[];
} {
  const highRiskKeywords = [
    'third-party',
    'sell your data',
    'share your information',
    'no refund',
    'non-refundable',
    'auto-renew',
    'automatically renew',
    'forced arbitration',
    'waive your right',
    'cannot cancel',
    'unlimited liability',
    'no warranty',
    'at our sole discretion',
  ];

  const mediumRiskKeywords = [
    'may change',
    'reserve the right',
    'without notice',
    'at any time',
    'suspend your account',
    'terminate access',
    'limited liability',
    'as-is basis',
    'no guarantee',
    'third party',
  ];

  const lowerText = text.toLowerCase();

  const foundHigh = highRiskKeywords.filter(keyword => 
    lowerText.includes(keyword.toLowerCase())
  );

  const foundMedium = mediumRiskKeywords.filter(keyword => 
    lowerText.includes(keyword.toLowerCase())
  );

  return {
    high: foundHigh,
    medium: foundMedium,
  };
}

/**
 * Calculates reading time in minutes
 */
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Truncates text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}
