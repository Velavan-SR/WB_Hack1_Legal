import { PromptTemplate } from '@langchain/core/prompts';

/**
 * Prompt template for classifying a single clause and assessing its risk level
 */
export const clauseClassificationPrompt = PromptTemplate.fromTemplate(`
You are a legal expert specializing in analyzing Terms & Conditions for consumer protection.

Analyze the following legal clause and provide:
1. The primary category (data-privacy, payment, cancellation, arbitration, liability, intellectual-property, termination, modification, other)
2. Risk level (HIGH, MEDIUM, LOW)
3. A plain English explanation of what this clause means
4. Any concerns or keywords that indicate risk

CLAUSE:
{clause}

Respond in JSON format:
{{
  "category": "string",
  "riskLevel": "string",
  "plainEnglish": "string",
  "concerns": ["string"]
}}
`);

/**
 * Prompt template for analyzing entire Terms & Conditions document
 */
export const documentAnalysisPrompt = PromptTemplate.fromTemplate(`
You are a legal expert specializing in consumer protection. Analyze the following Terms & Conditions document.

DOCUMENT:
{document}

Identify and extract:
1. The most risky clauses (anti-consumer practices)
2. The most standard/fair clauses
3. Any unusual or hidden fees/restrictions

Respond in JSON format:
{{
  "riskySections": [
    {{
      "title": "string",
      "text": "string",
      "risk": "string",
      "severity": "HIGH|MEDIUM|LOW"
    }}
  ],
  "fairSections": [
    {{
      "title": "string",
      "text": "string"
    }}
  ],
  "summary": "string"
}}
`);

/**
 * Prompt template for specific question answering about clauses
 */
export const clauseSearchPrompt = PromptTemplate.fromTemplate(`
You are a legal expert. Answer the following question about the provided Terms & Conditions clause.

QUESTION:
{question}

CLAUSE:
{clause}

Provide:
1. A direct answer in plain English
2. The specific part of the clause that answers the question
3. Any important conditions or limitations

Respond in JSON format:
{{
  "answer": "string",
  "sourceText": "string",
  "conditions": ["string"]
}}
`);

/**
 * Prompt template for translating legal jargon to plain English
 */
export const plainEnglishPrompt = PromptTemplate.fromTemplate(`
You are a legal translator specializing in making complex legal text understandable to consumers.

Translate this legal clause into simple, plain English that a 10-year-old could understand:

"{clause}"

Provide:
1. A simple explanation
2. What this means for the user (in practical terms)
3. Any risks or concerns
4. A one-sentence summary

Respond in JSON format:
{{
  "simple": "string",
  "whatItMeans": "string",
  "risks": ["string"],
  "summary": "string"
}}
`);

/**
 * Prompt template for identifying specific risk patterns
 */
export const riskDetectionPrompt = PromptTemplate.fromTemplate(`
You are analyzing a legal clause for consumer-unfriendly practices.

CLAUSE:
{clause}

Check for these specific risks:
1. Data collection/selling to third parties
2. Auto-renewal with hidden cancellation
3. Forced arbitration (no court access)
4. Unilateral modification rights
5. Non-refundable charges
6. Account termination at company discretion
7. Limited liability or no warranty

For each risk found, explain:
- What the risk is
- How it affects the consumer
- How severe it is (HIGH/MEDIUM/LOW)

Respond in JSON format:
{{
  "detectedRisks": [
    {{
      "type": "string",
      "description": "string",
      "impact": "string",
      "severity": "HIGH|MEDIUM|LOW"
    }}
  ],
  "overallRiskScore": 0-100,
  "redFlags": ["string"]
}}
`);
