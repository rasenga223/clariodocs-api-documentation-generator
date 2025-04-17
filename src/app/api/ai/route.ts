import { NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export async function POST(request: Request) {
  if (!OPENROUTER_API_KEY) {
    console.error('OpenRouter API key is not configured');
    return NextResponse.json(
      { error: 'OpenRouter API key is not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { messages, model = 'anthropic/claude-3.5-sonnet' } = body;

    if (!messages || !Array.isArray(messages)) {
      console.error('Invalid messages format:', messages);
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    console.log('Making request to OpenRouter:', {
      model,
      messageCount: messages.length,
    });

    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': request.headers.get('origin') || '',
        'X-Title': 'API Documentation Generator',
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenRouter API error:', error);
      return NextResponse.json(
        { error: error.error?.message || 'OpenRouter API error' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('OpenRouter response received:', {
      model: data.model,
      usage: data.usage,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 