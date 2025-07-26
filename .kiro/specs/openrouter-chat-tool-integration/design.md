# OpenRouter Chat and Tool Integration Design

## System Architecture

The OpenRouter Chat and Tool Integration system consists of three main architectural layers:

1. **Presentation Layer**: React-based chat interface with real-time UI updates
2. **Integration Layer**: OpenRouter API client with MCP tool orchestration
3. **Tool Execution Layer**: MCP server communication and tool result processing

### High-Level Component Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Chat UI       │    │  OpenRouter API  │    │   MCP Server    │
│   Component     │◄──►│   Integration    │◄──►│   (Nodit)       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
        │                        │                        │
        ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Message       │    │  Tool Schema     │    │  Blockchain     │
│   Management    │    │  Conversion      │    │  Tools          │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Component Design

### ChatPage Component
**Purpose**: Main chat interface managing user interactions and conversation flow
**Key Responsibilities**:
- User input handling and message display
- OpenRouter API communication
- MCP tool integration and execution
- Connection state management
- Error handling and user feedback

**State Management**:
```typescript
interface ChatPageState {
  messages: Message[]
  inputValue: string
  isLoading: boolean
  apiKey: string
  modelName: string
  showSettings: boolean
}
```

**Props**: None (root component)
**Dependencies**: useMcp hook, react-markdown, localStorage

### Message Management System
**Purpose**: Handle different message types and rendering
**Message Types**:
- User messages: Direct user input
- Bot messages: AI responses with markdown rendering
- Tool messages: Tool execution status and results
- Error messages: System errors and failures

**Message Interface**:
```typescript
interface Message {
  id: string
  content: string
  sender: 'user' | 'bot' | 'tool'
  timestamp: Date
  toolName?: string
  toolResult?: any
}
```

### OpenRouter Integration Module
**Purpose**: Handle OpenRouter API communication and tool calling
**Key Functions**:
- `convertMcpToolsToOpenRouter()`: Transform MCP tool schemas to OpenRouter format
- `handleSendMessage()`: Process user input and initiate AI conversation
- `handleToolCalls()`: Execute tool chains and continue conversation

**API Request Structure**:
```typescript
interface OpenRouterRequest {
  model: string
  messages: ChatMessage[]
  tools?: ToolDefinition[]
}

interface ToolDefinition {
  type: 'function'
  function: {
    name: string
    description: string
    parameters: JSONSchema
  }
}
```

### MCP Tool Orchestration
**Purpose**: Bridge between OpenRouter tool calls and MCP tool execution
**Key Components**:
- Tool schema conversion from MCP to OpenRouter format
- Asynchronous tool execution with status tracking
- Result formatting and error handling
- Multi-tool chaining support

**Tool Execution Flow**:
1. Parse tool_calls from OpenRouter response
2. Execute each tool using MCP callTool function
3. Format results for OpenRouter conversation continuation
4. Handle recursive tool calling if AI requests more tools

### Connection State Manager
**Purpose**: Monitor and manage MCP server connection status
**States**: 'connecting' | 'ready' | 'error' | 'disconnected'
**Behaviors**:
- Disable chat input when not ready
- Show retry button on connection failure
- Provide visual feedback for connection changes
- Auto-reconnect on connection restoration

## Sequence Diagrams

### Basic Chat Flow
```
User → ChatPage: Send message
ChatPage → OpenRouter: POST /chat/completions
OpenRouter → ChatPage: Response with content
ChatPage → UI: Display AI response
```

### Tool Calling Flow
```
User → ChatPage: Send message
ChatPage → OpenRouter: POST /chat/completions (with tools)
OpenRouter → ChatPage: Response with tool_calls
ChatPage → MCP: Execute tool(name, args)
MCP → ChatPage: Tool result
ChatPage → OpenRouter: POST /chat/completions (with tool results)
OpenRouter → ChatPage: Final response
ChatPage → UI: Display complete conversation
```

### Multi-Tool Chain Flow
```
User → ChatPage: Complex query
ChatPage → OpenRouter: Initial request with tools
OpenRouter → ChatPage: tool_calls[0]
ChatPage → MCP: Execute tool 0
MCP → ChatPage: Result 0
ChatPage → OpenRouter: Continue with result 0
OpenRouter → ChatPage: tool_calls[1]
ChatPage → MCP: Execute tool 1
MCP → ChatPage: Result 1
ChatPage → OpenRouter: Continue with results 0,1
OpenRouter → ChatPage: Final response
ChatPage → UI: Display complete chain
```

## Technical Considerations

### Dependencies
- **React 18+**: Core UI framework with hooks support
- **use-mcp**: MCP client library for tool communication
- **react-markdown**: Markdown rendering for AI responses
- **rehype-highlight**: Syntax highlighting for code blocks
- **lucide-react**: Icon library for UI elements

### Constraints
- OpenRouter API rate limits and usage quotas
- MCP server availability and response times
- Browser localStorage limitations for API key storage
- Network connectivity requirements for real-time features

### Trade-offs
1. **Client-side API key storage**: Convenient but less secure than server-side management
2. **Synchronous tool execution**: Simpler implementation but may impact performance with slow tools
3. **Full conversation history**: Better context but increased memory usage
4. **Real-time UI updates**: Better UX but more complex state management

### Error Handling Strategy
- **Network Errors**: Retry with exponential backoff
- **API Errors**: Display user-friendly messages with error codes
- **Tool Execution Errors**: Continue conversation with error context
- **Connection Failures**: Graceful degradation with retry options

### Performance Optimizations
- **Message Virtualization**: For large conversation histories
- **Tool Result Caching**: Avoid redundant tool executions
- **Debounced Input**: Prevent excessive API calls during typing
- **Lazy Loading**: Load tools and schemas on demand

## Implementation Strategy

### Phase 1: Core Infrastructure
1. Set up OpenRouter API integration with authentication
2. Implement basic chat interface with message management
3. Add MCP connection and tool discovery
4. Create tool schema conversion utilities

### Phase 2: Tool Integration
1. Implement single tool execution flow
2. Add tool result display and formatting
3. Create error handling for tool failures
4. Add connection state management

### Phase 3: Advanced Features
1. Implement multi-tool chaining support
2. Add markdown rendering for AI responses
3. Create retry mechanisms for failed connections
4. Optimize performance and user experience

### Phase 4: Polish and Testing
1. Add comprehensive error handling
2. Implement loading states and visual feedback
3. Create responsive design for mobile devices
4. Add accessibility features and keyboard navigation

## Security Considerations

### API Key Management
- Store API keys in localStorage with appropriate warnings
- Implement key validation before API calls
- Provide clear instructions for key security
- Consider server-side proxy for production deployments

### Tool Execution Security
- Validate tool parameters before execution
- Sanitize tool results before display
- Implement rate limiting for tool calls
- Monitor for suspicious tool usage patterns

### Data Privacy
- No persistent storage of conversation history
- Clear session data on page refresh
- Respect user privacy in error logging
- Comply with data protection regulations

## Monitoring and Observability

### Key Metrics
- API response times and success rates
- Tool execution success rates and latencies
- Connection stability and retry frequencies
- User engagement and session durations

### Error Tracking
- API failures with error codes and context
- Tool execution failures with stack traces
- Connection issues with network diagnostics
- User-reported issues with reproduction steps

### Performance Monitoring
- Chat message rendering times
- Tool execution durations
- Memory usage during long conversations
- Network bandwidth utilization
