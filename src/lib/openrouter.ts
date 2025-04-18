/**
 * OpenRouter API client for accessing AI models
 * This file handles communication with OpenRouter.ai to use various AI models
 */

// Environment variables should be set in your .env.local file
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
    console.warn('⚠️ Standard JSON.parse failed, attempting to clean string');
    console.log('🔍 First 100 chars of problematic string:', str.substring(0, 100));
    
    try {
      // Step 1: Remove any BOM characters
      let cleaned = str.replace(/^\uFEFF/, '');
      
      // Step 2: Replace problematic control characters
      cleaned = cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, match => {
        if (match === '\n') return '\\n';
        if (match === '\r') return '\\r';
        if (match === '\t') return '\\t';
        if (match === '\b') return '\\b';
        if (match === '\f') return '\\f';
        return '';
      });
      
      // Step 3: Handle escaped quotes and backslashes
      cleaned = cleaned.replace(/\\/g, '\\\\').replace(/(?<!\\)"/g, '\\"');
      
      // Step 4: Ensure the string is proper JSON by wrapping non-JSON-starting content
      if (!cleaned.trim().startsWith('{') && !cleaned.trim().startsWith('[')) {
        cleaned = `{"content": "${cleaned}"}`;
      }
      
      console.log('🧹 Cleaned string (first 100 chars):', cleaned.substring(0, 100));
      
      const parsed = JSON.parse(cleaned);
      
      // If we wrapped it earlier, unwrap it now
      return parsed.content || parsed;
    } catch (e2) {
      console.error('❌ Both parsing attempts failed:', e2);
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
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    description: 'Balanced performance and cost for high-quality documentation',
    maxTokens: 4000,
  },
  {
    id: 'anthropic/claude-3.5-haiku',
    name: 'Claude 3.5 Haiku',
    description: 'Faster responses for simpler documentation tasks',
    maxTokens: 2000,
  },
  {
    id: 'gpt-4.1-mini',
    name: 'GPT-4.1 Mini',
    description: 'Fast and good for technical documentation with code examples',
    maxTokens: 3000,
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'Fast and intelligent with strong technical understanding',
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
  console.log('🚀 Generating documentation with model:', model);
  console.log('🚀 File type:', options.fileType);
  console.log('🚀 Template:', options.template || 'None specified');

  // Construct the prompt for documentation generation
  const systemPrompt = `You are an expert API documentation generator and a senior MDX developer. Your task is to analyze the provided API specification and create beautiful, clear, and comprehensive documentation in MDX format.

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

CRITICAL RESPONSE FORMAT INSTRUCTIONS:
1. Return ONLY the raw JSON array - DO NOT add any markdown symbols (like #) or explanatory text before or after the JSON
2. DO NOT wrap your response in any markdown code blocks (like \`\`\`json or \`\`\`)
3. Start your response with the opening square bracket [ and end with the closing square bracket ]
4. Ensure all newlines in content fields are properly escaped as \\n
5. Make sure there are no control characters in your JSON response
6. Double-check that all quotation marks and escape sequences are properly formatted to avoid JSON parsing errors

IMPORTANT MDX SYNTAX RULES:
1. When using JSX expressions with curly braces {}, ensure:
   - Boolean props use actual booleans, not strings (e.g., required={true} not required={"true"})
   - Never use backticks inside JSX expressions
   - Keep expressions simple and avoid complex JavaScript inside curly braces
   - Always properly close JSX expressions with matching braces

2. When using code blocks with backticks:
   - Always use {\`...\`} syntax for code content inside MDX components
   - Never use nested backticks inside code blocks
   - If you need to show backticks in code examples, escape them properly
   - Keep code blocks and their content properly aligned and formatted

3. For code examples that include object literals with backticks:
   - Format them as a single line without backticks: { algorithm: 'RS256' }
   - Or break them into multiple lines with proper indentation
   - Never mix backticks with object literal syntax

IMPORTANT MDX COMPONENT USAGE:
Here are examples of properly formatted MDX components that you should follow exactly. Pay special attention to the syntax, nesting, and escape characters:

1. For API endpoints:
\`\`\`
<Endpoint method="GET" path="/api/v1/users">
  Get a list of all users.
  
  <ParamsTable>
    <Param name="page" type="integer">
      Page number for pagination. Defaults to 1.
    </Param>
    <Param name="limit" type="integer">
      Number of results per page. Defaults to 20, maximum 100.
    </Param>
    <Param name="sort" type="string">
      Field to sort by (e.g., 'created_at', 'name').
    </Param>
  </ParamsTable>
  
  <Response status={200} description="OK">
    <Code title="Response">
{\`{
  "users": [
    {
      "id": "123456",
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2023-01-15T00:00:00Z"
    },
    {
      "id": "789012",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "created_at": "2023-02-20T00:00:00Z"
    }
  ],
  "meta": {
    "total_count": 125,
    "page": 1,
    "limit": 20
  }
}\`}
    </Code>
  </Response>
</Endpoint>
\`\`\`

2. For code examples:
\`\`\`
<CodeGroup>
  <Code title="JavaScript">
{\`const response = await fetch('/api/endpoint');
const data = await response.json();\`}
  </Code>
  <Code title="Python">
{\`import requests
response = requests.get('/api/endpoint')
data = response.json()\`}
  </Code>
</CodeGroup>
\`\`\`

3. For user object properties:
\`\`\`
<AttributesTable title="User Object Properties">
  <ApiAttribute 
    name="id" 
    type="string" 
    required={true} 
    description="Unique identifier for the user." 
  />
  <ApiAttribute 
    name="name" 
    type="string" 
    required={true} 
    description="Full name of the user." 
  />
  <ApiAttribute 
    name="email" 
    type="string" 
    required={true} 
    description="Email address of the user." 
  />
</AttributesTable>
\`\`\`

4. For modern components:
\`\`\`
<Image 
  src="https://images.unsplash.com/photo-1555952517-2e8e729e0b44?auto=format&fit=crop&w=1600&h=900"
  alt="API Documentation"
  caption="Modern API documentation with interactive components"
  width={1600}
  height={900}
/>

<Terminal title="Installation">npm install @example/api-client</Terminal>

<Terminal title="Example Response" showPrompt={false} language="json">
{\`{
  "status": "success",
  "data": {
    "user": {
      "id": "123",
      "name": "John Doe"
    }
  }
}\`}
</Terminal>

<LinkPreview 
  url="https://github.com/example/api-client"
  title="API Client SDK"
  description="Official JavaScript client for the Example API. Features type-safe requests, automatic retries, and comprehensive documentation."
  image="https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=1600&h=900"
/>
\`\`\`

5. For FAQ sections:
<FAQ title="Frequently Asked Questions">
  <FAQItem question="How do I authenticate API requests?">
    Authentication requires passing your API key in the Authorization header:
    \`Authorization: Bearer your-api-key\`
  </FAQItem>
  
  <FAQItem question="What are the rate limits?">
    The API has the following rate limits:
    - Free tier: 100 requests per hour
    - Pro tier: 1000 requests per hour
    - Enterprise tier: Custom limits
  </FAQItem>
  
  <FAQItem question="How do I handle errors?">
    All API errors follow a standard format with an error code and message.
    Check the error handling section for detailed examples.
  </FAQItem>
</FAQ>

IMPORTANT: Note how the examples above use {\`...\`} for code blocks with JSON to properly escape content. Always follow this pattern exactly.

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
    const response = await fetch(`${window.location.origin}/api/ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
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
      
      // Process and validate each MDX file
      mdxFiles = mdxFiles.map((file: any) => {
        let { filename, content } = file;
        
        // Ensure we have valid filename and content
        filename = filename || 'documentation.mdx';
        content = content || '';
        
        // Clean up MDX content
        content = content
          // Ensure proper escaping of curly braces in code blocks
          .replace(/```([\s\S]*?)\n([\s\S]*?)```/g, (match: string, lang: string, code: string) => {
            // Properly escape any JSX expressions in code blocks
            const escapedCode = code.replace(/\{/g, '\\{').replace(/\}/g, '\\}');
            return `\`\`\`${lang}\n${escapedCode}\`\`\``;
          })
          // Ensure JSX expressions are properly formatted
          .replace(/\{([^}]+)\}/g, (match: string, expr: string) => {
            // If it's already a template literal, leave it alone
            if (expr.includes('`')) return match;
            // Otherwise wrap in template literal
            return `{\`${expr}\`}`;
          });
        
        return { filename, content };
      });
      
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