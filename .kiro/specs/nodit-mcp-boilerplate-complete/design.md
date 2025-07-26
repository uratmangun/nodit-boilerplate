# Nodit MCP Boilerplate - Complete Web Application Design

## System Architecture

The Nodit MCP Boilerplate is built as a modern React-based single-page application (SPA) using Vite as the build tool and development server. The architecture follows a component-based approach with clear separation of concerns between presentation, logic, and data layers.

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Browser Client                           │
├─────────────────────────────────────────────────────────────┤
│  React Application (TypeScript + Vite)                     │
│  ├── Layout & Navigation (Header, Theme)                   │
│  ├── Page Components (Home, Chat, MCP)                     │
│  ├── UI Components (shadcn/ui + Custom)                    │
│  └── State Management (React Hooks)                        │
├─────────────────────────────────────────────────────────────┤
│                External Integrations                       │
│  ├── Nodit MCP Server (use-mcp hook)                      │
│  ├── GitHub Repository (Template Source)                   │
│  └── Clipboard API (Copy Functionality)                    │
└─────────────────────────────────────────────────────────────┘
```

## Component Design

### Core Layout Components

#### Header Component (`src/components/layout/Header.tsx`)
- **Purpose**: Provides application branding and navigation
- **Props**: None (uses React Router for navigation state)
- **State**: Navigation active state detection
- **Styling**: Green-themed logo with gradient background, responsive navigation
- **Dependencies**: React Router DOM, Button component, ThemeToggle

#### Layout Component (`src/components/layout/Layout.tsx`)
- **Purpose**: Wraps all pages with consistent header and outlet structure
- **Props**: None (uses React Router Outlet)
- **Structure**: Fixed header with scrollable content area
- **Responsibilities**: Theme application, layout consistency

### Page Components

#### HomePage Component (`src/pages/HomePage.tsx`)
- **Purpose**: Landing page showcasing the boilerplate with GitHub template integration
- **Key Features**:
  - Hero section with green gradient typography
  - GitHub CLI template command with copy functionality
  - Repository links and template usage instructions
- **State Management**: Copy button feedback state
- **UI Elements**: CopyButton custom component for clipboard operations

#### ChatPage Component (`src/pages/ChatPage.tsx`)
- **Purpose**: Mock chat interface demonstrating MCP conversation capabilities
- **Key Features**:
  - Message history with user/bot message differentiation
  - Input field with send functionality
  - Simulated bot responses with delays
  - Feature cards describing Nodit MCP capabilities
- **State Management**: 
  - Messages array state
  - Input value state
  - Loading state for bot responses
- **UI Elements**: ScrollArea for message history, Input component

#### MCPPage Component (`src/pages/MCPPage.tsx`)
- **Purpose**: Live integration with Nodit MCP server displaying real tools
- **Key Features**:
  - Real-time connection to https://nodit-mcp.uratmangun.fun/sse
  - Dynamic tool listing with search and filtering
  - Connection state management (loading, ready, failed)
  - Tool categorization and status display
- **State Management**:
  - MCP connection state via useMcp hook
  - Category filtering state
  - Search term state
- **Data Transformation**: Converts MCP tool format to display format

### UI Component Library

#### Custom Components
- **CopyButton**: Clipboard integration with success feedback
- **Input**: Styled input field with proper focus states
- **ScrollArea**: Scrollable container using Radix UI primitives

#### External Dependencies
- **shadcn/ui**: Button, Card, Badge components with consistent theming
- **Radix UI**: Accessible primitives for ScrollArea
- **Lucide React**: Consistent icon system throughout application

## Data Flow and State Management

### MCP Integration Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   MCPPage       │───▶│   useMcp Hook    │───▶│  Nodit MCP Server   │
│   Component     │    │                  │    │  (SSE Connection)   │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
         │                       │                        │
         ▼                       ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│ UI Rendering    │    │ Connection State │    │   Live Tool Data    │
│ - Tool Cards    │    │ - discovering    │    │ - Tool Names        │
│ - Categories    │    │ - pending_auth   │    │ - Descriptions      │
│ - Search/Filter │    │ - ready          │    │ - Input Schemas     │
│ - Status Badges │    │ - failed         │    │ - Capabilities      │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
```

### Tool Data Transformation
1. **Raw MCP Tools**: Received from server with name, description, inputSchema
2. **Category Assignment**: Tools categorized based on name/description patterns
3. **Icon Mapping**: Dynamic icon assignment based on tool functionality
4. **Status Normalization**: All live tools marked as 'active' status
5. **Capability Extraction**: Input schema properties converted to capability tags

### Connection State Handling
- **Loading States**: Animated spinner with connection status display
- **Error States**: Clear error messages with retry, authenticate, and clear storage options
- **Success States**: Dynamic tool grid with real-time data
- **Reconnection**: Automatic retry logic with exponential backoff

## Routing Architecture

### Route Structure
```
/ (HomePage)
│
├── /chat (ChatPage)
│   └── Mock chat interface with MCP feature showcase
│
└── /mcp (MCPPage)
    └── Live MCP tools dashboard with real-time data
```

### Navigation Logic
- **Active State Detection**: URL-based highlighting of current page
- **Route Protection**: All routes publicly accessible (no authentication required)
- **Fallback Handling**: React Router handles undefined routes

## Styling and Theme System

### Design System Foundation
- **Primary Colors**: Green gradient theme (green-600 to emerald-500 to teal-500)
- **Typography**: Gradient text for headings, proper contrast for readability
- **Spacing**: Consistent Tailwind spacing scale
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts

### Component Styling Patterns
- **Gradient Backgrounds**: Used sparingly for hero elements and branding
- **Card Layouts**: Clean white/dark cards with subtle borders and shadows
- **Status Indicators**: Color-coded badges for different states
- **Interactive Elements**: Proper hover and focus states for accessibility

### Dark/Light Theme Support
- **Theme Toggle**: Available in header for user preference
- **Color Adaptation**: All components support both themes via Tailwind dark: variants
- **Contrast Compliance**: Maintains WCAG AA contrast ratios in both themes

## Technical Implementation Details

### Build Configuration
- **Vite**: Modern build tool with hot module replacement
- **TypeScript**: Strict type checking with proper interface definitions
- **ESLint**: Code quality and consistency enforcement
- **Prettier**: Automated code formatting

### Package Management
- **Primary**: pnpm (preferred for performance and disk efficiency)
- **Fallback**: bun (acceptable alternative with lockfile detection)
- **Dependencies**: 
  - React 19+ with React Router DOM 7+
  - use-mcp for MCP server integration
  - shadcn/ui and Radix UI for component library
  - Tailwind CSS for styling
  - Lucide React for icons

### Environment Configuration
- **Development**: Local Vite dev server with hot reloading
- **Production**: Static build optimized for deployment
- **MCP Connection**: Hardcoded server URL (configurable via environment variables)

## Security Considerations

### Data Handling
- **No Sensitive Storage**: No credentials or sensitive data stored in localStorage
- **HTTPS Only**: All external connections use secure protocols
- **Error Sanitization**: Error messages don't expose system internals

### Cross-Origin Resource Sharing (CORS)
- **MCP Server**: Configured to accept connections from boilerplate domain
- **GitHub API**: Standard HTTPS requests for repository information
- **Clipboard API**: Secure context required for clipboard operations

## Performance Optimization

### Code Splitting
- **Route-based**: Each page component can be lazy-loaded
- **Component Libraries**: Tree-shaking for unused UI components
- **Bundle Analysis**: Vite provides built-in bundle analysis tools

### Network Optimization
- **MCP Connection**: Single persistent SSE connection
- **Asset Loading**: Optimized images and fonts
- **Caching**: Proper HTTP caching headers for static assets

### Runtime Performance
- **React Optimization**: Proper use of hooks and memoization where needed
- **DOM Updates**: Efficient re-rendering through proper key usage
- **Search/Filter**: Debounced input for smooth user experience

## Error Handling and Recovery

### MCP Connection Failures
- **Network Issues**: Retry logic with exponential backoff
- **Authentication**: Manual authentication trigger option
- **State Corruption**: Clear storage option to reset connection state

### UI Error Boundaries
- **Component Failures**: Graceful degradation with error messages
- **Navigation Errors**: Fallback routing for undefined paths
- **Data Loading**: Loading states and error messages for all async operations

## Deployment and Distribution

### GitHub Template Configuration
- **Repository Settings**: Template flag enabled via GitHub CLI
- **Clone Instructions**: Proper GitHub CLI template syntax provided
- **Documentation**: Comprehensive README with setup instructions

### Static Hosting Compatibility
- **SPA Configuration**: Proper routing setup for static hosts
- **Asset Optimization**: Compressed and optimized build output
- **Environment Variables**: Build-time configuration support
