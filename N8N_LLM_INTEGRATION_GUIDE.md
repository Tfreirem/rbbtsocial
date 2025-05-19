# N8N Workflow Guide for LLM Integration with Meta Ads API

This guide explains how to implement and use the n8n workflow for enabling LLMs to interact with Meta Ads data. The workflow uses a Model Context Protocol (MCP) approach to interpret LLM requests and route them to the appropriate Meta Ads API endpoints.

## Overview

The workflow follows this sequence:

1. **Schedule Trigger** - Initiates the workflow on a schedule
2. **MCP (Model Context Protocol)** - Interprets the user's query and decides which endpoint to call
3. **ADS AI Agent** - Acts as an orchestrator for the individual tools
4. **Parse** - Formats the API response data for the LLM
5. **HTTP Request** - Sends the final structured data to your LLM or application

## Workflow Components Explained

### 1. Schedule Trigger

The Schedule Trigger node initiates the workflow at regular intervals. This is useful for:
- Refreshing data in your dashboard periodically
- Processing queued LLM requests
- Updating cached data for faster responses

You can adjust the schedule based on your needs, or replace it with:
- **Webhook Trigger**: For real-time requests from your application
- **Manual Trigger**: For testing or on-demand execution

### 2. MCP (Model Context Protocol) Function

This is the brain of the system, responsible for:
- Interpreting natural language queries
- Determining the correct Meta Ads endpoint to call 
- Extracting parameters like time periods, filters, and metrics
- Providing context to the LLM about the available data

The MCP function analyzes the query text and:
1. Detects which entity type is being requested (campaigns, ad sets, ads, etc.)
2. Identifies if the user wants a list of entities or performance metrics
3. Extracts any filters, sorting preferences, or specific IDs
4. Determines time periods (yesterday, last 7 days, etc.)
5. Identifies which metrics or dimensions are relevant to the query

It then outputs a structured request for the AI Agent to process.

### 3. ADS AI Agent (Tools Agent)

This node acts as an orchestrator, directing the query to the appropriate tool based on the MCP output:

- **Chat Model/Memory**: Maintains context between requests
- **Tool Output Parser**: Processes the results from tools

The Agent node connects to various tools:
- **Lista campanhas**: Gets list of campaigns
- **Lista Ad Sets**: Gets list of ad sets
- **List Ads**: Gets list of ads
- **Get Campaign Insights**: Gets performance metrics for campaigns
- **Get Ad Set Insights**: Gets performance metrics for ad sets
- **Get Ad Insights**: Gets performance metrics for ads
- **Get IG Posts**: Gets Instagram posts
- **Get Post Comments**: Gets comments on posts
- **Get Media Insights**: Gets performance data for media

### 4. Parse Function

This node transforms the raw API data into a format that's optimized for LLM consumption by:
- Restructuring the data into a clean, consistent format
- Generating natural language summaries of the data
- Adding context and metadata to help the LLM understand the response
- Formatting numeric values appropriately (currencies, percentages, etc.)
- Handling errors and edge cases

The Parse function:
1. Takes the original query and API response
2. Formats the data based on the endpoint type
3. Generates a summary of the results
4. Returns a structured object ready for the LLM

### 5. HTTP Request

The final node sends the structured data to your application or directly to an LLM API. This can be:
- Your dashboard backend
- A direct API call to an LLM service
- A database for storage and later retrieval

## How to Use This Workflow

### Implementing in n8n

1. Create a new workflow in n8n
2. Add the Schedule Trigger (or Webhook for real-time requests)
3. Add a Function node for the MCP (copy the code from `mcp_function_for_n8n.js`)
4. Set up the Meta Ads API endpoints as HTTP Request nodes
5. Add a Function node for parsing (copy the code from `parse_function_for_n8n.js`)
6. Add an HTTP Request node to send the data to your application or LLM

### Example Queries

The MCP is designed to handle various queries such as:

- "Mostrar todas as campanhas ativas"
- "Qual o desempenho das campanhas nos últimos 7 dias?"
- "Quais conjuntos de anúncios tiveram o melhor ROAS no último mês?"
- "Mostrar desempenho de anúncios por faixa etária e gênero"
- "Listar as 10 campanhas com maior gasto ontem"
- "Mostrar publicações do Instagram com mais comentários"

### Customizing the Workflow

You can extend the workflow by:

1. **Adding New Endpoints**:
   - Create new HTTP Request nodes for additional Meta API endpoints
   - Update the MCP function to recognize and route to these endpoints
   - Add formatting logic to the Parse function

2. **Enhancing Natural Language Understanding**:
   - Add more pattern matching to the `determineRequestType` function
   - Include synonyms or alternative phrasings for common requests
   - Support additional languages beyond Portuguese and English

3. **Improving Data Processing**:
   - Add data validation and cleaning steps
   - Implement caching for frequently requested data
   - Add historical comparison (vs previous period)

## Connecting the Workflow to Your Dashboard

To integrate this workflow with your RBBT SOCIAL DASH:

1. Setup an API endpoint in your application to receive data from n8n
2. Configure the final HTTP Request node to send data to this endpoint
3. In your frontend, display a chat interface where users can ask questions
4. Send user queries to n8n via webhook
5. Process the response and update your dashboard UI

## Troubleshooting

Common issues and solutions:

- **API Rate Limiting**: Implement exponential backoff and retry logic
- **Query Misinterpretation**: Review MCP logs to improve pattern matching
- **Missing Data**: Check that your access token has the required permissions
- **Performance Issues**: Implement pagination and optimize data processing

## Advanced Integration

For a more advanced setup:

1. **Implement Semantic Search**: Replace simple pattern matching with embeddings-based similarity
2. **Add Memory**: Store conversation history to maintain context across queries
3. **Implement Feedback Loop**: Collect user feedback to improve the system over time
4. **Multi-User Support**: Add user identification to personalize responses

## Security Considerations

When implementing this workflow:

1. **API Credentials**: Store your Meta Ads API credentials securely using n8n's credential store
2. **Access Control**: Implement proper authentication for webhook endpoints
3. **Data Privacy**: Ensure sensitive metrics are only shown to authorized users
4. **Logging**: Log queries and responses for debugging, but remove sensitive data

## Conclusion

This integration creates a powerful natural language interface for your Meta Ads data, allowing users to query and analyze marketing performance through simple, conversational interactions. By processing these queries through n8n and the MCP framework, you're effectively giving your dashboard AI capabilities without having to rebuild your application from scratch. 