/**
 * Default content for the MDX editor to showcase our beautiful Mintlify-like components
 * This content will serve as both sample content and a demonstration of the components
 */

export const DEFAULT_MDX_CONTENT = `# API Documentation

Welcome to our API documentation. This guide will help you understand how to use our API endpoints.

## Authentication

All endpoints require authentication using a Bearer token.

<Callout type="info">
  You can get your API token from the dashboard settings page.
</Callout>

<Callout type="warning" title="API Rate Limits">
  Be aware that our API has rate limits of 100 requests per minute.
</Callout>

## Endpoints

### User Endpoints

<Endpoint method="GET" path="/api/v1/users">
  Get a list of all users.
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
  Create a new user.
  
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
  Delete a user.
</Endpoint>

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

## Frequently Asked Questions

<Accordion>
  <AccordionItem title="What authentication method does the API use?">
    The API uses Bearer token authentication. You need to include your API key in the Authorization header of each request.
  </AccordionItem>
  <AccordionItem title="How do I handle pagination?">
    For endpoints that return multiple items, the API supports pagination using \`page\` and \`per_page\` query parameters. The response includes \`total_count\`, \`page\`, and \`per_page\` fields.
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

---

Need more help? [Contact our support team](mailto:support@example.com).
`; 