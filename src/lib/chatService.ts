import { AVAILABLE_MODELS } from './openrouter';

/**
 * Types for chat messages and tool calls
 */

export type MessageRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: MessageRole;
  content: string;
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface Tool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, any>;
      required?: string[];
    };
  };
}

export interface MDXEditToolArgs {
  filename?: string;
  content?: string;
  operation: 'add' | 'edit' | 'remove' | 'fix';
  section?: string;
  replacement?: string;
  explanation?: string;
}

export interface MDXFileInfo {
  filename: string;
  content: string;
}

/**
 * Service for handling chat interactions with OpenRouter.ai
 */
export const chatService = {
  /**
   * Send a chat request to OpenRouter.ai
   */
  async sendChatMessage(
    messages: ChatMessage[],
    model: string = 'anthropic/claude-3.5-sonnet',
    mdxFiles: MDXFileInfo[] = []
  ): Promise<ChatMessage> {
    const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '';
    
    if (!OPENROUTER_API_KEY) {
      throw new Error('OpenRouter API key is not set. Please set NEXT_PUBLIC_OPENROUTER_API_KEY in your .env.local file.');
    }
    
    try {
      console.log('Sending request to OpenRouter:', { model, fileCount: mdxFiles.length });
      
      // Add file contents to the system message
      const systemMessageIndex = messages.findIndex(m => m.role === 'system');
      if (systemMessageIndex !== -1) {
        const fileContents = mdxFiles.map(file => `
File: ${file.filename}
Content:
\`\`\`mdx
${file.content}
\`\`\`
`).join('\n\n');
        
        messages[systemMessageIndex].content = `${messages[systemMessageIndex].content}

CURRENT MDX FILES CONTENT:
${fileContents}`;
      }
      
      // Sanitize messages to ensure they are in the correct format for the model
      const sanitizedMessages = this.sanitizeMessages(messages, model);
      console.log('Sanitized message count:', sanitizedMessages.length);
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'API Documentation Editor',
        },
        body: JSON.stringify({
          model,
          messages: sanitizedMessages,
          max_tokens: 4000, // Increased to handle larger responses with file content
          temperature: 0.7,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenRouter returned error:', errorData);
        throw new Error(`OpenRouter API error: ${errorData.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Raw response from OpenRouter:', data);
      
      if (!data || !data.choices || !data.choices.length) {
        console.error('Invalid response format from OpenRouter:', data);
        throw new Error('Received an invalid response format from the AI service');
      }
      
      return data.choices[0].message;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  },
  
  /**
   * Sanitize messages to ensure compatibility with various models
   */
  sanitizeMessages(messages: ChatMessage[], model: string): ChatMessage[] {
    // Make a copy of the messages so we don't modify the original array
    const result: ChatMessage[] = [...messages];
    
    // Remove the system message if needed (will be added back at the beginning)
    const systemMessage = result.find(m => m.role === 'system');
    if (systemMessage) {
      const systemIndex = result.findIndex(m => m.role === 'system');
      if (systemIndex > 0) {
        // If system message is not at the beginning, remove it to add back later
        result.splice(systemIndex, 1);
      }
    }
    
    // Ensure system message is at the beginning if it exists
    if (systemMessage && result[0].role !== 'system') {
      result.unshift(systemMessage);
    }
    
    return result;
  },
  
  /**
   * Get the system prompt for the chat window
   */
  getSystemPrompt(mdxFiles: MDXFileInfo[]): string {
    return `You are an expert API documentation assistant. Your task is to help the user improve their MDX documentation for their API.

You have access to the following MDX files:
${mdxFiles.map(file => `- ${file.filename}`).join('\n')}

You can help with:
1. Editing existing content to improve clarity and accuracy
2. Adding new sections or examples to make the documentation more comprehensive
3. Removing redundant or confusing parts
4. Fixing formatting issues or syntax errors in the MDX content
5. Make sure file titles for new files are short and no more than 2 words

IMPORTANT: WHEN MAKING CHANGES TO MDX FILES
When a user asks you to make changes to an MDX file (edit, add, remove, or fix something), 
please respond with a specific format that starts with the marker "MDX_UPDATE_START" and ends 
with "MDX_UPDATE_END". Between these markers, provide only the MDX filename and the complete 
updated MDX content, as shown below:

MDX_UPDATE_START
filename: example.mdx
content:
# Title of the Document

This is the complete updated MDX content with the requested changes.

<Component prop={value}>
  Content here
</Component>
MDX_UPDATE_END

For ADDING new files:
Use "MDX_ADD_START" and "MDX_ADD_END" markers:

MDX_ADD_START
filename: new-file.mdx
content:
# New Document

This is the content of the new MDX file.

<Component prop={value}>
  Content here
</Component>
MDX_ADD_END

For DELETING files:
Use "MDX_DELETE_START" and "MDX_DELETE_END" markers:

MDX_DELETE_START
filename: file-to-delete.mdx
MDX_DELETE_END

After any operation, provide a very brief and concise summary of what changes you made and why they improve the documentation.

COMMON MDX SYNTAX ERRORS TO WATCH FOR:
1. Unbalanced curly braces in JSX expressions, e.g., {something without closing brace
2. Multiple expressions inside a single pair of curly braces (not allowed in JSX)
3. Missing backticks in code blocks using {\`...\`} syntax
4. Improper nesting of components
5. Missing or mismatched closing tags
6. Using string values for boolean props (use required={true} not required="true")
7. Unescaped characters in JSX attributes

AVAILABLE MDX COMPONENTS:

<Endpoint method="GET" path="/api/v1/users">
  Get a list of all users.
  
  <ParamsTable>
    <Param name="page" type="integer">
      Page number for pagination. Defaults to 1.
    </Param>
    <Param name="limit" type="integer">
      Number of results per page. Defaults to 20, maximum 100.
    </Param>
  </ParamsTable>
  
  <Response status={200} description="OK">
    <Code title="Response">
{\`{
  "users": [
    {
      "id": "123456",
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}\`}
    </Code>
  </Response>
</Endpoint>

<CodeGroup>
  <Code title="JavaScript">
{\`const response = await fetch('/api/endpoint');
const data = await response.json();\`}
  </Code>
</CodeGroup>

<Callout type="info" title="Note">
  Important information the user should know about.
</Callout>

<RequestBody required={true} contentType="application/json">
  <AttributesTable>
    <ApiAttribute name="name" type="string" required={true} description="The user's full name" />
    <ApiAttribute name="email" type="string" required={true} description="The user's email address" />
  </AttributesTable>
</RequestBody>

Always be helpful, clear, and precise in your suggestions. When making updates, provide the entire file content with your changes applied.`;
  }
}; 