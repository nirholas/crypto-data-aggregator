/**
 * Groq/OpenAI API utilities
 * AI features for premium endpoints
 */

const AI_API_KEY = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
const AI_MODEL = process.env.AI_MODEL || 'llama-3.3-70b-versatile';
const AI_PROVIDER = process.env.AI_PROVIDER || 'groq';

const API_URL =
  AI_PROVIDER === 'groq'
    ? 'https://api.groq.com/openai/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions';

export function isGroqConfigured(): boolean {
  return !!AI_API_KEY;
}

/**
 * Groq client compatible interface
 * Provides an SDK-like interface for Groq/OpenAI API calls
 */
interface ChatCompletionMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionChoice {
  index: number;
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
}

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: ChatCompletionChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface CreateChatCompletionParams {
  model: string;
  messages: ChatCompletionMessage[];
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: 'json_object' | 'text' };
}

/**
 * Groq client with chat.completions.create method
 */
export const groqClient = {
  chat: {
    completions: {
      create: async (params: CreateChatCompletionParams): Promise<ChatCompletionResponse> => {
        if (!AI_API_KEY) {
          throw new Error('AI API key not configured');
        }

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${AI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: params.model || AI_MODEL,
            messages: params.messages,
            temperature: params.temperature ?? 0.3,
            max_tokens: params.max_tokens ?? 2000,
            ...(params.response_format && { response_format: params.response_format }),
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('AI API error:', errorText);
          throw new Error(`AI API error: ${response.status}`);
        }

        return response.json();
      },
    },
  },
};

export async function promptGroqJson<T>(prompt: string, _schema?: unknown): Promise<T | null> {
  if (!AI_API_KEY) {
    return null;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      console.error('AI API error:', await response.text());
      return null;
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;

    if (!content) {
      return null;
    }

    return JSON.parse(content) as T;
  } catch (error) {
    console.error('AI request failed:', error);
    return null;
  }
}
