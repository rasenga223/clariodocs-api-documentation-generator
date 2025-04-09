/**
 * OpenRouter API client for accessing AI models
 * This file handles communication with OpenRouter.ai to use various AI models
 */

// Environment variables should be set in your .env.local file
const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

/**
 * A safe JSON parser that handles problematic characters
 * @param str String to parse
 * @returns Parsed JSON
 */
function safeJSONParse(str: string) {
  // First try standard JSON parse
  try {
    return JSON.parse(str);
  } catch (e) {
    // If that fails, try to clean up the string
    console.warn('⚠️ Standard JSON.parse failed, attempting to clean string');
    
    try {
      // Replace problematic control characters
      const sanitized = str.replace(/[\u0000-\u001F]/g, match => {
        if (match === '\n') return '\\n';
        if (match === '\r') return '\\r';
        if (match === '\t') return '\\t';
        if (match === '\b') return '\\b';
        if (match === '\f') return '\\f';
        return '';
      });
      
      return JSON.parse(sanitized);
    } catch (e2) {
      // If both methods fail, throw the original error
      throw e;
    }
  }
}

// Define the OpenRouter response structure
export interface OpenRouterResponse {
  id: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Available models for documentation generation
export const AVAILABLE_MODELS = [
  {
    id: 'anthropic/claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Most powerful model for complex documentation generation',
    maxTokens: 8000,
  },
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    description: 'Balanced performance and cost for high-quality documentation',
    maxTokens: 4000,
  },
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    description: 'Faster responses for simpler documentation tasks',
    maxTokens: 2000,
  },
  {
    id: 'google/gemini-pro',
    name: 'Gemini Pro',
    description: 'Good for technical documentation with code examples',
    maxTokens: 3000,
  },
  {
    id: 'meta-llama/llama-3-70b-instruct',
    name: 'Llama 3 70B',
    description: 'Open source model with strong technical understanding',
    maxTokens: 3000,
  },
];

/**
 * Generate MDX documentation from an API specification using OpenRouter.ai
 * 
 * @param apiSpec - The API specification (OpenAPI, Postman Collection, etc.)
 * @param model - The AI model to use for generation
 * @param options - Additional generation options
 * @returns The generated MDX content
 */
export async function generateDocumentation(
  apiSpec: string,
  model: string = 'anthropic/claude-3-sonnet', 
  options: {
    fileType: string;
    template?: string;
    extraInstructions?: string;
  }
): Promise<Array<{filename: string; content: string}>> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is not set. Please set NEXT_PUBLIC_OPENROUTER_API_KEY in your .env.local file.');
  }

  console.log('🚀 Generating documentation with model:', model);
  console.log('🚀 File type:', options.fileType);
  console.log('🚀 Template:', options.template || 'None specified');

  // Construct the prompt for documentation generation
  const systemPrompt = `You are an expert API documentation generator. Your task is to analyze the provided API specification and create beautiful, clear, and comprehensive documentation in MDX format.

Format your output as an array of MDX components that will be used to build the documentation. Each component should be a complete MDX file.

IMPORTANT: Your response MUST be a valid JSON array of objects with the following structure:
[
  {
    "filename": "introduction.mdx",
    "content": "# Introduction\\n\\nWelcome to the API..."
  },
  {
    "filename": "authentication.mdx", 
    "content": "# Authentication\\n\\nThis API uses..."
  },
  ...
]

IMPORTANT FORMATTING INSTRUCTIONS:
1. DO NOT wrap your response in any markdown code blocks (like \`\`\`json or \`\`\`).
2. Return the raw JSON directly without any additional text before or after.
3. Ensure all newlines in content fields are properly escaped as \\n.
4. Make sure there are no control characters in your JSON response.

The API specification is in ${options.fileType} format.
${options.template ? `Use the ${options.template} template style.` : ''}
${options.extraInstructions || ''}

Include the following in your documentation:
1. An introduction section explaining the API's purpose and main features
2. Authentication section if applicable
3. For each endpoint:
   - Clear description of purpose
   - Request parameters with types and descriptions
   - Request body schema if applicable
   - Response formats with examples
   - Error codes and handling
4. Code examples in multiple languages (JavaScript, Python, cURL)
5. Schema definitions with clear explanations

Your MDX should be well-structured, use proper Markdown and React components, and follow best practices for technical documentation.`;

  const userPrompt = `Here is the API specification to document:\n\n${apiSpec}`;

  console.log('🚀 Sending request to OpenRouter API...');
  
  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'API Documentation Generator',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ OpenRouter API error:', errorData);
      throw new Error(`OpenRouter API error: ${errorData.error || response.statusText}`);
    }

    const data: OpenRouterResponse = await response.json();
    console.log('✅ Received response from OpenRouter API:', data);
    
    // Parse the AI response which should be a JSON array of MDX components
    const mdxContent = data.choices[0].message.content;
    console.log('📄 Raw content from AI:', mdxContent.substring(0, 500) + '...');
    
    try {
      // Check if the response is wrapped in a code block and extract content
      const codeBlockMatch = mdxContent.match(/```(?:json)?\s*\n([\s\S]*?)```/);
      const contentToProcess = codeBlockMatch ? codeBlockMatch[1].trim() : mdxContent;
      
      console.log('🔍 Content to process:', contentToProcess.substring(0, 200) + '...');
      
      // Parse the content using our safe JSON parser
      let mdxFiles;
      try {
        mdxFiles = safeJSONParse(contentToProcess);
        console.log('✅ Successfully parsed JSON response');
      } catch (jsonError) {
        console.warn('⚠️ JSON parsing failed completely, falling back to text splitting');
        throw jsonError;
      }
      
      if (!Array.isArray(mdxFiles)) {
        console.warn('⚠️ Response is not an array, wrapping in array');
        mdxFiles = [{ 
          filename: 'documentation.mdx',
          content: mdxContent
        }];
      } else if (mdxFiles.length > 0 && (!mdxFiles[0].filename || !mdxFiles[0].content)) {
        // Check if the array items have the correct structure
        console.warn('⚠️ Array items missing filename/content, restructuring');
        mdxFiles = mdxFiles.map((item, index) => {
          if (typeof item === 'string') {
            return {
              filename: `part-${index + 1}.mdx`,
              content: item
            };
          } else if (item && typeof item === 'object') {
            return {
              filename: item.filename || `part-${index + 1}.mdx`,
              content: item.content || JSON.stringify(item)
            };
          }
          return {
            filename: `part-${index + 1}.mdx`,
            content: JSON.stringify(item)
          };
        });
      }
      
      console.log('📚 Final MDX files structure:', mdxFiles.map((f: any) => f.filename));
      return mdxFiles;
    } catch (e) {
      console.error('❌ Error parsing JSON:', e);
      console.log('⚠️ Falling back to text splitting method');
      
      // If not valid JSON, split by markdown headers as a fallback
      const sections = mdxContent.split(/^# /m).filter(Boolean);
      
      let mdxFiles = [];
      
      // Check if we have valid sections to work with
      if (sections.length > 0) {
        mdxFiles = sections.map((section, index) => {
          const firstLine = section.split('\n')[0].trim();
          const fileName = firstLine
            ? firstLine.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            : `section-${index + 1}`;
            
          return {
            filename: `${fileName}.mdx`,
            content: `# ${section}`
          };
        });
      } else {
        // If no valid markdown sections found, create a single file with the original content
        mdxFiles.push({
          filename: 'documentation.mdx',
          content: mdxContent
        });
      }
      
      console.log('📚 Final MDX files after text splitting:', mdxFiles.map(f => f.filename));
      return mdxFiles;
    }
  } catch (error) {
    console.error('❌ Error generating documentation:', error);
    throw error;
  }
} 