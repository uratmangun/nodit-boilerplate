import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Bot, User } from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your Nodit MCP assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you said: "${inputValue}". This is a demo chatbox for the Nodit MCP boilerplate. In a real implementation, this would connect to your Nodit MCP server to process blockchain data and provide intelligent responses.`,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
    }, 1000)
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
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
          Nodit MCP Chat
        </h1>
        <p className="text-muted-foreground mt-2">
          Demo chatbox interface for interacting with Nodit MCP services
        </p>
      </div>

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
                
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-green-600 text-white ml-auto'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
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
              placeholder="Type your message about blockchain data, smart contracts, or any Nodit MCP query..."
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send • This is a demo interface for Nodit MCP integration
          </p>
        </div>
      </div>

      {/* Feature Info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg bg-card/30">
          <h3 className="font-semibold text-green-600 mb-2">🔗 Blockchain Integration</h3>
          <p className="text-sm text-muted-foreground">
            Connect to multiple blockchain networks through Nodit's unified API
          </p>
        </div>
        <div className="p-4 border rounded-lg bg-card/30">
          <h3 className="font-semibold text-green-600 mb-2">💬 MCP Protocol</h3>
          <p className="text-sm text-muted-foreground">
            Leverage Model Context Protocol for intelligent blockchain interactions
          </p>
        </div>
        <div className="p-4 border rounded-lg bg-card/30">
          <h3 className="font-semibold text-green-600 mb-2">⚡ Real-time Data</h3>
          <p className="text-sm text-muted-foreground">
            Get live blockchain data, transaction updates, and smart contract events
          </p>
        </div>
      </div>
    </div>
  )
}
