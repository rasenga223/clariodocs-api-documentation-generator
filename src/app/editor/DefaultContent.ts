/**
 * Default content for the MDX editor to showcase our beautiful Mintlify-like components
 * This content will serve as both sample content and a demonstration of the components
 */

export const DEFAULT_MDX_CONTENT = `# API Documentation

Welcome to our API documentation. This guide will help you understand how to use our API endpoints.

## Authentication

<AuthMethod type="bearer" name="JWT Authentication">
  All endpoints require authentication using a Bearer token.
  
  <CodeGroup>
    <Code title="Example">
{\`Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\`}
    </Code>
  </CodeGroup>
  
  You can get your API token from the dashboard settings page.
</AuthMethod>

<Callout type="info">
  Your API keys carry many privileges, so be sure to keep them secure! Don't share your API keys in publicly accessible areas such as GitHub, client-side code, etc.
</Callout>

## Rate Limits

<RateLimit limit="100" period="minute">
  The API has rate limits to ensure stability and availability. If you exceed the rate limit, you'll receive a \`429 Too Many Requests\` response.
  
  Contact support if you need increased rate limits for your production application.
</RateLimit>

## API Resources

<ApiResource name="Users" description="User management endpoints">

### Endpoints

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
    <CodeGroup>
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
    </CodeGroup>
  </Response>
  
  <Response status={401} description="Unauthorized">
    <CodeGroup>
      <Code title="Response">
{\`{
  "error": "Invalid authentication credentials"
}\`}
      </Code>
    </CodeGroup>
  </Response>
</Endpoint>

<Endpoint method="GET" path="/api/v1/users/{userId}">
  Get details for a specific user.
  
  <ParamsTable>
    <Param name="userId" type="string" required={true}>
      The unique identifier of the user.
    </Param>
  </ParamsTable>
  
  <Response status={200} description="OK">
    <CodeGroup>
      <Code title="Response">
{\`{
  "id": "123456",
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2023-01-15T00:00:00Z"
}\`}
      </Code>
    </CodeGroup>
  </Response>
  
  <Response status={404} description="Not Found">
    <CodeGroup>
      <Code title="Response">
{\`{
  "error": "User not found"
}\`}
      </Code>
    </CodeGroup>
  </Response>
</Endpoint>

<Endpoint method="POST" path="/api/v1/users">
  <StatusBadge type="stable" /> Create a new user.
  
  <ParamsTable>
    <Param name="name" type="string" required={true}>
      The name of the user.
    </Param>
    <Param name="email" type="string" required={true}>
      The email of the user.
    </Param>
    <Param name="role" type="string">
      The role of the user. Defaults to "user".
    </Param>
  </ParamsTable>
  
  <Response status={201} description="Created">
    <CodeGroup>
      <Code title="Response">
{\`{
  "id": "123456",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "created_at": "2023-01-15T00:00:00Z"
}\`}
      </Code>
    </CodeGroup>
  </Response>
</Endpoint>

<Endpoint method="PUT" path="/api/v1/users/{userId}">
  Update a user.
</Endpoint>

<Endpoint method="DELETE" path="/api/v1/users/{userId}">
  <StatusBadge type="beta" /> Delete a user.
</Endpoint>

</ApiResource>

## User Object

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
  <ApiAttribute 
    name="role" 
    type="string" 
    description="Role of the user. One of: 'admin', 'user', 'guest'." 
  />
  <ApiAttribute 
    name="created_at" 
    type="string (ISO 8601)" 
    required={true} 
    description="Timestamp when the user was created." 
  />
  <ApiAttribute 
    name="updated_at" 
    type="string (ISO 8601)" 
    description="Timestamp when the user was last updated." 
  />
</AttributesTable>

## Code Examples

<Tabs>
  <Tab title="Node.js">
    \`\`\`javascript
    const axios = require('axios');
    
    const API_KEY = 'your-api-key';
    
    async function getUser(userId) {
      try {
        const response = await axios.get(\`https://api.example.com/v1/users/\${userId}\`, {
          headers: {
            'Authorization': \`Bearer \${API_KEY}\`,
            'Content-Type': 'application/json'
          }
        });
        
        return response.data;
      } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
      }
    }
    \`\`\`
  </Tab>
  <Tab title="Python">
    \`\`\`python
    import requests

    API_KEY = 'your-api-key'
    
    def get_user(user_id):
        headers = {
            'Authorization': f'Bearer {API_KEY}',
            'Content-Type': 'application/json'
        }
        
        response = requests.get(
            f'https://api.example.com/v1/users/{user_id}',
            headers=headers
        )
        
        response.raise_for_status()
        return response.json()
    \`\`\`
  </Tab>
  <Tab title="cURL">
    \`\`\`bash
    curl -X GET "https://api.example.com/v1/users/123456" \\
      -H "Authorization: Bearer your-api-key" \\
      -H "Content-Type: application/json"
    \`\`\`
  </Tab>
</Tabs>

## Version History

<VersionHistory>
  <Version version="2.0.0" date="2023-09-15">
    - Added pagination support
    - Improved error messages
    - Added new user roles
  </Version>
  <Version version="1.5.0" date="2023-07-10">
    - Added filtering capabilities
    - Enhanced rate limiting headers
  </Version>
  <Version version="1.0.0" date="2023-05-01">
    - Initial release of the API
    - Basic CRUD operations for users
  </Version>
</VersionHistory>

## Frequently Asked Questions

<Accordion>
  <AccordionItem title="What authentication method does the API use?">
    The API uses Bearer token authentication. You need to include your API key in the Authorization header of each request.
  </AccordionItem>
  <AccordionItem title="How do I handle pagination?">
    For endpoints that return multiple items, the API supports pagination using \`page\` and \`limit\` query parameters. The response includes \`total_count\`, \`page\`, and \`limit\` fields in the \`meta\` object.
  </AccordionItem>
  <AccordionItem title="What are the rate limits?">
    The API has a rate limit of 100 requests per minute per API key. If you exceed this limit, you'll receive a 429 Too Many Requests response.
  </AccordionItem>
</Accordion>

## Additional Resources

<CardGroup>
  <Card title="API Reference">
    Complete reference for all API endpoints and parameters.
  </Card>
  <Card title="Webhooks Guide">
    Learn how to set up and use webhooks for real-time updates.
  </Card>
  <Card title="SDK Documentation">
    Detailed guides for using our official client libraries.
  </Card>
</CardGroup>

## Modern Component Examples

<Image 
  src="https://images.unsplash.com/photo-1555952517-2e8e729e0b44?auto=format&fit=crop&w=1600&h=900"
  alt="API Documentation"
  caption="Modern API documentation with interactive components"
  width={1600}
  height={900}
/>

<Video 
  src="https://example.com/api-tutorial.mp4"
  title="Quick start guide for our API"
  poster="https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1600&h=900"
  autoPlay={false}
  controls={true}
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

<CardGroup>
  <Card title="API Client Libraries">
    <Image 
      src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&h=450"
      alt="Code editor showing API client usage"
      width={800}
      height={450}
    />
    Explore our official client libraries for various programming languages.
  </Card>
  <Card title="Video Tutorials">
    <Video 
      src="https://example.com/quick-start.mp4"
      poster="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&h=450"
      autoPlay={false}
      muted={true}
      controls={true}
    />
    Watch our video tutorials to get started quickly.
  </Card>
</CardGroup>

<Callout type="tip">
  Check out our API Best Practices Guide for more information.
</Callout>

<LinkPreview 
  url="https://example.com/blog/api-best-practices"
  title="API Best Practices Guide"
  description="Learn how to make the most of our API with these best practices and tips from our engineering team."
  image="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&h=450"
/>

---

Need more help? [Contact our support team](mailto:support@example.com).
`; 