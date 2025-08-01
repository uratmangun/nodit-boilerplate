import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useMcp } from 'use-mcp/react'
import { 
  Search, 
  Database, 
  Code, 
  Zap, 
  Shield, 
  Globe, 
  Activity, 
  Layers, 
  CheckCircle,
  AlertCircle,
  Clock,
  Wifi,
  WifiOff,
  Loader2,
  RefreshCw
} from 'lucide-react'

// Icon mapping for tool types
const getToolIcon = (toolName: string) => {
  const name = toolName.toLowerCase()
  if (name.includes('blockchain') || name.includes('data')) return Database
  if (name.includes('node') || name.includes('rpc')) return Activity
  if (name.includes('webhook') || name.includes('event')) return Layers
  if (name.includes('aptos') || name.includes('graphql')) return Zap
  if (name.includes('mcp') || name.includes('ai')) return Shield
  if (name.includes('chain') || name.includes('network')) return Globe
  return Code
}

// Extract category from tool name/description
const getToolCategory = (tool: any) => {
  const name = tool.name?.toLowerCase() || ''
  const desc = tool.description?.toLowerCase() || ''
  
  if (name.includes('blockchain') || name.includes('context')) return 'Blockchain APIs'
  if (name.includes('data') && !name.includes('blockchain')) return 'Data Services'
  if (name.includes('node') || name.includes('rpc')) return 'Node Access'
  if (name.includes('webhook') || name.includes('event')) return 'Event Streaming'
  if (name.includes('aptos')) return 'Aptos Services'
  if (name.includes('mcp') || desc.includes('ai') || desc.includes('model')) return 'AI Integration'
  if (name.includes('chain') || name.includes('network')) return 'Network Coverage'
  return 'General Tools'
}

// Generate example parameters and responses for Nodit MCP tools
const getExampleData = (toolName: string) => {
  // Map tool names to their example data
  const examples: Record<string, { params: any; response: any }> = {
    'list_nodit_api_categories': {
      params: {},
      response: [
        'Blockchain APIs',
        'Data Services',
        'Node Access',
        'Event Streaming',
        'Aptos Services',
        'AI Integration',
        'Network Coverage'
      ]
    },
    'list_nodit_node_apis': {
      params: {},
      response: [
        'eth_blockNumber',
        'eth_call',
        'eth_chainId',
        'eth_estimateGas',
        'eth_gasPrice',
        'eth_getBalance',
        'eth_getBlockByHash',
        'eth_getBlockByNumber',
        'eth_getLogs',
        'eth_getTransactionByHash'
      ]
    },
    'list_nodit_data_apis': {
      params: {},
      response: [
        'get_block_by_number',
        'get_transaction_by_hash',
        'get_balance',
        'get_logs',
        'get_token_transfers'
      ]
    },
    'list_nodit_webhook_apis': {
      params: {},
      response: [
        'create_webhook',
        'get_webhook',
        'update_webhook',
        'delete_webhook',
        'list_webhooks'
      ]
    },
    'call_nodit_api': {
      params: {
        protocol: 'ethereum',
        network: 'mainnet',
        operationId: 'eth_blockNumber',
        requestBody: {
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_blockNumber',
          params: []
        }
      },
      response: {
        jsonrpc: '2.0',
        id: 1,
        result: '0x1234567'
      }
    },
    'call_nodit_aptos_indexer_api': {
      params: {
        network: 'mainnet',
        requestBody: {
          query: `query GetAccount($address: String!) {
            account(address: $address) {
              address
              sequence_number
              authentication_key
            }
          }`,
          variables: { address: '0x1' }
        }
      },
      response: {
        data: {
          account: {
            address: '0x1',
            sequence_number: '12345',
            authentication_key: '0x1234567890abcdef'
          }
        }
      }
    }
  }

  // Default examples for tools without specific ones
  const defaultExamples: Record<string, { params: any; response: any }> = {
    'default': {
      params: {},
      response: {
        success: true,
        data: 'Example response data'
      }
    }
  }

  // Return specific example or default
  return examples[toolName] || defaultExamples['default']
}

const statusColors = {
  active: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400',
  inactive: 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400',
  pending: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400'
}

const statusIcons = {
  active: CheckCircle,
  inactive: AlertCircle,
  pending: Clock
}

export default function MCPPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Connect to live Nodit MCP server
  const {
    state,
    tools,
    error,
    retry,
    authenticate,
    clearStorage,
  } = useMcp({
    url: 'https://nodit-mcp.uratmangun.fun/sse',
    clientName: 'Nodit MCP Boilerplate',
    autoReconnect: true,
  })

  // Transform MCP tools into our display format with example data
  const transformedTools = tools.map((tool: any, index: number) => {
    // Generate example parameters and responses for each tool
    const exampleData = getExampleData(tool.name || '');
    
    return {
      id: tool.name || `tool-${index}`,
      name: tool.name || 'Unknown Tool',
      description: tool.description || 'No description available',
      category: getToolCategory(tool),
      status: 'active' as const,
      icon: getToolIcon(tool.name || ''),
      inputSchema: tool.inputSchema,
      exampleParams: exampleData?.params || null,
      exampleResponse: exampleData?.response || null,
      lastUsed: undefined,
    };
  })

  // Get unique categories from transformed tools
  const availableCategories = ['all', ...Array.from(new Set(transformedTools.map((tool: any) => tool.category)))]
  const categories = availableCategories.length > 1 ? availableCategories : ['all', 'Blockchain APIs', 'Data Services', 'Node Access', 'Event Streaming', 'Aptos Services', 'AI Integration', 'Network Coverage']

  const filteredTools = transformedTools.filter((tool: any) => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Handle connection states
  if (state === 'failed') {
    return (
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div className="space-y-4">
          <WifiOff className="h-16 w-16 mx-auto text-red-500" />
          <h1 className="text-3xl font-bold text-red-600">Connection Failed</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Failed to connect to Nodit MCP server: {error}
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button onClick={retry} className="bg-green-600 hover:bg-green-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Connection
          </Button>
          <Button variant="outline" onClick={authenticate}>
            Authenticate Manually
          </Button>
          <Button variant="outline" onClick={clearStorage}>
            Clear Storage
          </Button>
        </div>
      </div>
    )
  }

  if (state !== 'ready') {
    return (
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div className="space-y-4">
          <Loader2 className="h-16 w-16 mx-auto text-green-600 animate-spin" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
            Connecting to Nodit MCP Server
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Current state: <span className="font-semibold text-green-600">{state}</span>
          </p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Wifi className="h-5 w-5 text-green-600" />
          <span className="text-sm text-muted-foreground">Establishing connection...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
          MCP Tools Dashboard
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Manage and monitor your Model Context Protocol tools for blockchain operations and data analysis
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search MCP tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {category === 'all' ? 'All Tools' : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="flex flex-col gap-6">
        {filteredTools.map((tool) => {
          const IconComponent = tool.icon
          const StatusIcon = statusIcons[tool.status]
          
          return (
            <div key={tool.id} className="border rounded-lg p-6 bg-card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 flex items-center justify-center">
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{tool.name}</h3>
                    <span className="text-xs text-muted-foreground">{tool.category}</span>
                  </div>
                </div>
                
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusColors[tool.status]}`}>
                  <StatusIcon className="h-3 w-3" />
                  {tool.status}
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {tool.description}
              </p>

              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-2">INPUT SCHEMA</h4>
                  {tool.inputSchema ? (
                    <div className="bg-muted/50 rounded p-3 text-xs font-mono">
                      <pre className="whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
                        {JSON.stringify(tool.inputSchema, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground italic">
                      No input schema available
                    </div>
                  )}

                  {tool.exampleParams && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">EXAMPLE PARAMETERS</h4>
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3 text-xs font-mono">
                        <pre className="whitespace-pre-wrap break-words max-h-24 overflow-y-auto">
                          {JSON.stringify(tool.exampleParams, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {tool.exampleResponse && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">EXAMPLE RESPONSE</h4>
                      <div className="bg-green-50 dark:bg-green-900/20 rounded p-3 text-xs font-mono">
                        <pre className="whitespace-pre-wrap break-words max-h-24 overflow-y-auto">
                          {JSON.stringify(tool.exampleResponse, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>

                {tool.lastUsed && (
                  <div className="text-xs text-muted-foreground">
                    Last used: {tool.lastUsed}
                  </div>
                )}


              
            </div>
          </div>
        )
      })}
    </div>

    {filteredTools.length === 0 && (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No MCP tools found matching your search criteria.</p>
        </div>
      </div>
    )}
  </div>
)
}
