import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Bot, User, Settings, Save, Wrench, Zap, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useMcp } from 'use-mcp/react'
import { Badge } from '@/components/ui/badge'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot' | 'tool'
  timestamp: Date
  toolName?: string
  toolResult?: any
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your OpenRouter AI assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [modelName, setModelName] = useState('openai/gpt-4o')
  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showTools, setShowTools] = useState(false)

  // Connect to MCP server for tool calling
  const {
    state: mcpState,
    tools,
    callTool,
    retry,
  } = useMcp({
    url: 'https://nodit-mcp.uratmangun.fun/sse',
    clientName: 'Nodit MCP Chat',
    autoReconnect: true,
  })

  // Load saved settings from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openrouter_api_key')
    const savedModelName = localStorage.getItem('openrouter_model_name')
    
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }
    if (savedModelName) {
      setModelName(savedModelName)
    }
  }, [])

  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem('openrouter_api_key', apiKey)
    localStorage.setItem('openrouter_model_name', modelName)
    setShowSettings(false)
  }



  // Convert MCP tools to OpenRouter tool format
  const convertMcpToolsToOpenRouter = () => {
    return tools.map(tool => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description || 'No description available',
        parameters: tool.inputSchema || {
          type: 'object',
          properties: {},
          required: []
        }
      }
    }))
  }

  // Execute tool calls and continue conversation
  const handleToolCalls = async (toolCalls: any[], conversationHistory: any[]) => {
    const toolResults = []
    
    for (const toolCall of toolCalls) {
      const { id, function: { name, arguments: args } } = toolCall
      
      // Add tool execution message
      const toolMessage: Message = {
        id: Date.now().toString() + Math.random(),
        content: `🔧 Executing tool: ${name}`,
        sender: 'tool',
        timestamp: new Date(),
        toolName: name
      }
      setMessages(prev => [...prev, toolMessage])
      
      try {
        const parsedArgs = JSON.parse(args)
        const result = await callTool(name, parsedArgs)
        
        // Add tool result message
        const resultMessage: Message = {
          id: Date.now().toString() + Math.random(),
          content: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
          sender: 'tool',
          timestamp: new Date(),
          toolName: name,
          toolResult: result
        }
        setMessages(prev => [...prev, resultMessage])
        
        // Prepare tool result for OpenRouter
        toolResults.push({
          role: 'tool',
          tool_call_id: id,
          name: name,
          content: typeof result === 'string' ? result : JSON.stringify(result)
        })
        
      } catch (error) {
        console.error(`Error executing tool ${name}:`, error)
        const errorMessage: Message = {
          id: Date.now().toString() + Math.random(),
          content: `❌ Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          sender: 'tool',
          timestamp: new Date(),
          toolName: name
        }
        setMessages(prev => [...prev, errorMessage])
        
        toolResults.push({
          role: 'tool',
          tool_call_id: id,
          name: name,
          content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        })
      }
    }
    
    // Continue conversation with tool results
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Nodit MCP Boilerplate Chat'
      },
      body: JSON.stringify({
        model: modelName,
        messages: [...conversationHistory, ...toolResults],
        tools: convertMcpToolsToOpenRouter()
      })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    const aiMessage = data.choices[0]?.message
    
    // Check if AI wants to call more tools
    if (aiMessage?.tool_calls) {
      const updatedHistory = [...conversationHistory, ...toolResults, {
        role: 'assistant',
        content: aiMessage.content,
        tool_calls: aiMessage.tool_calls
      }]
      
      await handleToolCalls(aiMessage.tool_calls, updatedHistory)
    } else {
      // Final response
      const finalMessage: Message = {
        id: Date.now().toString() + Math.random(),
        content: aiMessage?.content || 'No response received',
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, finalMessage])
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return
    
    if (!apiKey) {
      alert('Please set your OpenRouter API key first')
      setShowSettings(true)
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue('')
    setIsLoading(true)

    try {
      const initialMessages = [{
        role: 'user',
        content: currentInput
      }]
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Nodit MCP Boilerplate Chat'
        },
        body: JSON.stringify({
          model: modelName,
          messages: initialMessages,
          tools: mcpState === 'ready' ? convertMcpToolsToOpenRouter() : undefined
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const aiMessage = data.choices[0]?.message
      
      // Check if AI wants to call tools
      if (aiMessage?.tool_calls && mcpState === 'ready') {
        const conversationHistory = [
          ...initialMessages,
          {
            role: 'assistant',
            content: aiMessage.content,
            tool_calls: aiMessage.tool_calls
          }
        ]
        
        await handleToolCalls(aiMessage.tool_calls, conversationHistory)
      } else {
        // Regular response without tool calls
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiMessage?.content || 'No response received',
          sender: 'bot',
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, botMessage])
      }
    } catch (error) {
      console.error('Error calling OpenRouter API:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response from OpenRouter'}`,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              OpenRouter AI Chat
            </h1>
            <p className="text-muted-foreground mt-2">
              OpenAI-compatible chat interface using OpenRouter
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTools(!showTools)}
              className="flex items-center gap-2"
            >
              <Wrench className="h-4 w-4" />
              Tools ({tools.length})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Tools Panel */}
      {showTools && (
        <Card className="mb-6 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Available MCP Tools
              <Badge variant="secondary">{mcpState}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mcpState !== 'ready' ? (
              <p className="text-muted-foreground">Connecting to MCP server...</p>
            ) : tools.length === 0 ? (
              <p className="text-muted-foreground">No tools available</p>
            ) : (
              <div className="grid gap-3">
                {tools.map((tool: any, index: number) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{tool.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {tool.description || 'No description available'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <Card className="mb-6 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">OpenRouter Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="apiKey">OpenRouter API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your OpenRouter API key"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="modelName">Model Name</Label>
              <Input
                id="modelName"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="e.g., openai/gpt-4o, anthropic/claude-3.5-sonnet"
                className="mt-1"
              />
            </div>
            <Button onClick={saveSettings} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Settings
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="flex-1 border rounded-lg bg-card/50 backdrop-blur-sm flex flex-col">
        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'bot' && (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                
                {message.sender === 'tool' && (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <Wrench className="h-4 w-4 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-green-600 text-white ml-auto'
                      : message.sender === 'tool'
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-muted'
                  }`}
                >
                  {message.toolName && (
                    <div className="flex items-center gap-1 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {message.toolName}
                      </Badge>
                    </div>
                  )}
                  <div className="text-sm">
                    {message.sender === 'user' ? (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown 
                          rehypePlugins={[rehypeHighlight]}
                          components={{
                            h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-base font-semibold mb-2" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-sm font-semibold mb-1" {...props} />,
                            p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                            li: ({node, ...props}) => <li className="mb-1" {...props} />,
                            code: ({node, inline, ...props}: any) => 
                              inline ? (
                                <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono" {...props} />
                              ) : (
                                <code className="block bg-muted p-2 rounded text-xs font-mono overflow-x-auto" {...props} />
                              ),
                            pre: ({node, ...props}) => <pre className="bg-muted p-2 rounded mb-2 overflow-x-auto" {...props} />,
                            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-muted-foreground pl-4 italic mb-2" {...props} />,
                            hr: ({node, ...props}) => <hr className="my-4 border-muted-foreground" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                            em: ({node, ...props}) => <em className="italic" {...props} />,
                            a: ({node, ...props}) => <a className="text-blue-600 hover:underline" {...props} />,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>

                {message.sender === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={mcpState !== 'ready' ? 'MCP connecting - please wait' : "Type your message about blockchain data, smart contracts, or any Nodit MCP query..."}
              className="flex-1"
              disabled={mcpState !== 'ready' || isLoading}
            />
            {mcpState !== 'ready' && mcpState !== 'loading' && mcpState !== 'connecting' && mcpState !== 'discovering' ? (
              <Button 
                onClick={retry}
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
                size="icon"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleSendMessage}
                disabled={isLoading || mcpState !== 'ready'}
                className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600"
                size="icon"
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {mcpState !== 'ready' ? (
              <span className="text-yellow-500">MCP Status: {mcpState} - {mcpState === 'connecting' || mcpState === 'loading' || mcpState === 'discovering' ? 'connecting...' : 'click retry to reconnect'}</span>
            ) : (
              <>Press Enter to send • Using OpenRouter API with model: {modelName} • MCP Tools: {tools.length} available</>
            )}
          </p>
        </div>
      </div>

      {/* Feature Info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg bg-card/30">
          <h3 className="font-semibold text-green-600 mb-2">🤖 OpenRouter API</h3>
          <p className="text-sm text-muted-foreground">
            Access hundreds of AI models through OpenRouter's unified API
          </p>
        </div>
        <div className="p-4 border rounded-lg bg-card/30">
          <h3 className="font-semibold text-green-600 mb-2">🔐 Secure Storage</h3>
          <p className="text-sm text-muted-foreground">
            API keys and model preferences saved securely in localStorage
          </p>
        </div>
        <div className="p-4 border rounded-lg bg-card/30">
          <h3 className="font-semibold text-green-600 mb-2">⚡ OpenAI Compatible</h3>
          <p className="text-sm text-muted-foreground">
            Drop-in replacement for OpenAI API with enhanced model selection
          </p>
        </div>
      </div>
    </div>
  )
}
