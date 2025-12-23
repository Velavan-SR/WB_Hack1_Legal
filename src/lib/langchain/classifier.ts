import { ChatOpenAI } from '@langchain/openai';

let llmInstance: ChatOpenAI | null = null;

/**
 * Gets or creates ChatOpenAI instance
 */
export function getLLM(): ChatOpenAI {
  if (!llmInstance) {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    llmInstance = new ChatOpenAI({
      apiKey: apiKey,
      modelName: 'gpt-4-turbo-preview',
      temperature: 0.3, // Lower temperature for more consistent legal analysis
      maxTokens: 2000,
    });
  }

  return llmInstance;
}

/**
 * Creates a chain for clause classification
 */
export async function classifyClause(clause: string): Promise<any> {
  const llm = getLLM();
  const { clauseClassificationPrompt } = await import('./prompts');
  
  const chain = clauseClassificationPrompt.pipe(llm);
  
  try {
    const result = await chain.invoke({ clause });
    
    // Parse the JSON response
    const content = result.content as string;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error classifying clause:', error);
    throw error;
  }
}

/**
 * Creates a chain for document analysis
 */
export async function analyzeDocument(document: string): Promise<any> {
  const llm = getLLM();
  const { documentAnalysisPrompt } = await import('./prompts');
  
  // Truncate document if too long (to avoid token limits)
  const maxChars = 3000;
  const truncatedDoc = document.length > maxChars 
    ? document.substring(0, maxChars) + '...' 
    : document;
  
  const chain = documentAnalysisPrompt.pipe(llm);
  
  try {
    const result = await chain.invoke({ document: truncatedDoc });
    
    const content = result.content as string;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error analyzing document:', error);
    throw error;
  }
}

/**
 * Creates a chain for risk detection
 */
export async function detectRisks(clause: string): Promise<any> {
  const llm = getLLM();
  const { riskDetectionPrompt } = await import('./prompts');
  
  const chain = riskDetectionPrompt.pipe(llm);
  
  try {
    const result = await chain.invoke({ clause });
    
    const content = result.content as string;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error detecting risks:', error);
    throw error;
  }
}

/**
 * Creates a chain for plain English translation
 */
export async function translateToPlainEnglish(clause: string): Promise<any> {
  const llm = getLLM();
  const { plainEnglishPrompt } = await import('./prompts');
  
  const chain = plainEnglishPrompt.pipe(llm);
  
  try {
    const result = await chain.invoke({ clause });
    
    const content = result.content as string;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error translating to plain English:', error);
    throw error;
  }
}

/**
 * Creates a chain for answering specific questions
 */
export async function answerClauseQuestion(
  question: string,
  clause: string
): Promise<any> {
  const llm = getLLM();
  const { clauseSearchPrompt } = await import('./prompts');
  
  const chain = clauseSearchPrompt.pipe(llm);
  
  try {
    const result = await chain.invoke({ question, clause });
    
    const content = result.content as string;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error answering question:', error);
    throw error;
  }
}
