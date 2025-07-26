# Implementation Plan

- [x] 1. Review current ChatPage implementation and identify OpenAI API usage
  - Analyze existing chat interface structure and message handling
  - Identify hardcoded OpenAI API endpoints and authentication
  - Document current state management and UI components
  - Assess compatibility with OpenRouter API requirements
  - _Requirements: 1.1, 2.1_

- [x] 2. Refactor API calls to use OpenRouter endpoint and headers
  - Replace OpenAI API endpoint with https://openrouter.ai/api/v1/chat/completions
  - Update authentication to use Bearer token format
  - Add required HTTP-Referer and X-Title headers
  - Ensure request body format matches OpenRouter specifications
  - _Requirements: 1.3, 1.4, 1.5_

- [x] 3. Add input fields for API key and model name above chatbox
  - Create settings panel with API key input (password masked)
  - Add model name selection/input field
  - Implement toggle functionality for settings visibility
  - Style components to match existing UI design
  - _Requirements: 1.1, 1.2, 2.1_

- [x] 4. Implement logic to save/load API key and model name to/from localStorage
  - Create localStorage utilities for secure key storage
  - Implement automatic loading of saved credentials on component mount
  - Add validation for API key format and model name
  - Handle localStorage errors and fallback scenarios
  - _Requirements: 1.1, 1.2_

- [x] 5. Ensure chat requests use stored API key and model name
  - Integrate stored credentials into API request headers
  - Add validation to prevent requests without valid API key
  - Implement error handling for authentication failures
  - Test with various model names and API key formats
  - _Requirements: 1.3, 1.4, 2.4_

- [x] 6. Test end-to-end chat flow with OpenRouter
  - Verify message sending and receiving functionality
  - Test error handling for invalid API keys and network issues
  - Validate response parsing and message display
  - Ensure proper loading states and user feedback
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 7. Integrate MCP tool-calling capabilities in ChatPage
  - Import and configure useMcp hook with Nodit server URL
  - Expose available tools list in chat context
  - Implement tool discovery and display functionality
  - Add connection state monitoring and error handling
  - _Requirements: 3.1, 5.1, 6.1, 6.2_

- [x] 8. Allow user to invoke tools from chat interface
  - Create tool execution interface within chat flow
  - Implement callTool function integration
  - Add tool execution status display in chat messages
  - Handle tool execution errors gracefully
  - _Requirements: 3.2, 3.3, 3.4, 6.3_

- [x] 9. Use callTool to execute selected tool and display result in chat
  - Implement asynchronous tool execution with status tracking
  - Format tool results for display in chat interface
  - Add visual indicators for tool execution progress
  - Handle various tool result formats (string, JSON, errors)
  - _Requirements: 3.2, 3.3, 3.4_

- [x] 10. Render chat responses as markdown in the UI
  - Integrate react-markdown for AI response rendering
  - Add rehype-highlight for code syntax highlighting
  - Style markdown content to match chat interface design
  - Handle edge cases and malformed markdown gracefully
  - _Requirements: 2.2_

- [x] 11. Disable chat input and show retry button if MCP is disconnected
  - Monitor MCP connection state using useMcp hook
  - Implement conditional input disabling based on connection status
  - Create retry button with appropriate styling and functionality
  - Add visual feedback for connection state changes
  - _Requirements: 5.1, 5.2, 5.3, 5.5_

- [x] 12. Remove execute button from MCP tools panel
  - Clean up MCPPage component to remove direct tool execution
  - Simplify tools display to show only names and descriptions
  - Update UI to focus on chat-based tool interaction
  - Remove unused code and dependencies related to direct execution
  - _Requirements: 6.3_

- [x] 13. Parse OpenRouter response for tool calls
  - Implement tool_calls detection in OpenRouter API responses
  - Extract tool names, IDs, and arguments from response structure
  - Validate tool call format and handle malformed requests
  - Add error handling for unsupported tool call formats
  - _Requirements: 4.1, 4.4_

- [x] 14. Call MCP tools using callTool with correct arguments
  - Convert OpenRouter tool call arguments to MCP format
  - Execute tools asynchronously using MCP callTool function
  - Handle argument parsing and validation errors
  - Implement timeout and error recovery mechanisms
  - _Requirements: 3.2, 4.1, 4.5_

- [x] 15. Chain tool results and continue conversation with AI
  - Format tool execution results for OpenRouter conversation context
  - Implement recursive tool calling for multi-step operations
  - Handle tool result integration in conversation history
  - Add support for multiple tool calls in single AI response
  - _Requirements: 4.2, 4.3, 4.4_

- [x] 16. Implement convertMcpToolsToOpenRouter function
  - Transform MCP tool schemas to OpenRouter function format
  - Map tool names, descriptions, and parameter schemas
  - Handle missing or invalid tool schema properties
  - Ensure compatibility with OpenRouter tool calling requirements
  - _Requirements: 3.1, 4.1_

- [x] 17. Create handleToolCalls function for multi-tool chaining
  - Implement sequential tool execution with result chaining
  - Add conversation history management for tool contexts
  - Handle recursive AI tool requests after receiving results
  - Implement proper error propagation through tool chains
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 18. Add tool execution status messages in chat interface
  - Display tool execution start notifications with tool names
  - Show tool results with proper formatting and visual indicators
  - Add error messages for failed tool executions
  - Implement distinct styling for tool-related messages
  - _Requirements: 3.3, 3.4, 2.4_

- [x] 19. Implement connection retry functionality
  - Add retry button functionality using MCP retry method
  - Implement exponential backoff for connection attempts
  - Provide user feedback during retry operations
  - Handle successful reconnection and state restoration
  - _Requirements: 5.2, 5.3, 5.4_

- [x] 20. Test complete tool calling and chaining workflow
  - Verify single tool execution through chat interface
  - Test multi-tool chaining with complex queries
  - Validate error handling for tool execution failures
  - Ensure proper conversation flow with tool results
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5_
