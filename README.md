# Nodit MCP Boilerplate

A comprehensive web application boilerplate for integrating with Nodit's Model Context Protocol (MCP) services. This template provides a modern React-based interface for showcasing MCP capabilities, including live tool integration, chat functionality, and seamless developer experience.

## ✨ Features

- 🔗 **Live MCP Integration** - Real-time connection to Nodit MCP server with tool discovery
- 💬 **Chat Interface** - Mock conversational AI interface demonstrating MCP capabilities
- 🛠️ **Dynamic Tool Dashboard** - Live listing and categorization of available MCP tools
- 🎨 **Modern UI** - Built with shadcn/ui components and green gradient theming
- ⚡ **Vite + React 19** - Fast development with latest React features
- 🔷 **TypeScript** - Full type safety and IntelliSense support
- 🗄️ **Supabase Ready** - Pre-configured for backend services and authentication
- 📱 **Responsive Design** - Mobile-first approach with dark/light theme support
- 🧪 **Testing Suite** - Vitest with React Testing Library
- 📦 **GitHub Template** - Ready-to-use template for quick project creation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- A Supabase project (create one at [supabase.com](https://supabase.com))
- GitHub CLI (optional, for template usage)

### Creating a New Project from Template

#### Option 1: Using GitHub CLI (Recommended)

```bash
# Create a new repository from this template
gh repo create my-nodit-project --template uratmangun/nodit-mcp-boilerplate --public

# Clone your new repository
gh repo clone my-nodit-project
cd my-nodit-project
```

#### Option 2: Using GitHub Web Interface

1. Go to [github.com/uratmangun/nodit-mcp-boilerplate](https://github.com/uratmangun/nodit-mcp-boilerplate)
2. Click the green **"Use this template"** button
3. Choose **"Create a new repository"**
4. Fill in your repository details and click **"Create repository"**
5. Clone your new repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
   ```

#### Option 3: Manual Clone (Development)

```bash
# For contributing to this template or development purposes
git clone https://github.com/uratmangun/nodit-mcp-boilerplate.git
cd nodit-mcp-boilerplate
```

### Installation

1. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Start the development server**
   ```bash
   bun dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Common components (error boundaries, loading)
│   ├── layout/         # Layout components (header, navigation)
│   ├── providers/      # Context providers (theme, auth)
│   └── ui/            # shadcn/ui components
├── hooks/              # Custom React hooks
├── lib/               # Utility libraries
│   ├── supabase.ts    # Supabase client configuration
│   └── supabase-errors.ts # Error handling utilities
├── pages/             # Page components
│   ├── HomePage.tsx   # Landing page with GitHub template info
│   ├── ChatPage.tsx   # Mock chat interface
│   ├── MCPPage.tsx    # Live MCP tools dashboard
│   └── ...
├── types/             # TypeScript type definitions
├── test/              # Test utilities
└── assets/            # Static assets

supabase/               # Supabase configuration
├── config.toml        # Local development configuration
├── functions/         # Edge Functions
└── migrations/        # Database migrations
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server |
| `bun build` | Build for production |
| `bun preview` | Preview production build |
| `bun test` | Run tests in watch mode |
| `bun test:run` | Run tests once |
| `bun test:ui` | Run tests with UI |
| `bun test:coverage` | Run tests with coverage |
| `bun lint` | Lint code |
| `bun lint:fix` | Fix linting issues |
| `bun format` | Format code with Prettier |
| `bun format:check` | Check code formatting |
| `bun type-check` | Check TypeScript types |
| `bun check-all` | Run all checks (type, lint, format, test) |

## 🔗 MCP Integration

### Nodit MCP Server Connection

The application connects to the Nodit MCP server at `https://nodit-mcp.uratmangun.fun/sse` using the `use-mcp` package:

```typescript
import { useMcp } from 'use-mcp'

const { tools, status, error } = useMcp({
  serverUrl: 'https://nodit-mcp.uratmangun.fun/sse',
  autoReconnect: true,
  reconnectInterval: 5000
})
```

### Available Pages

- **Home (`/`)** - Landing page with project information and GitHub template usage
- **Chat (`/chat`)** - Mock conversational interface showcasing MCP capabilities
- **MCP (`/mcp`)** - Live dashboard displaying real-time MCP tools and their capabilities

### MCP Features

- **Real-time Tool Discovery** - Automatically discovers and categorizes available MCP tools
- **Connection State Management** - Handles loading, error, and ready states
- **Tool Categorization** - Groups tools by type (Blockchain APIs, Data Services, etc.)
- **Search and Filtering** - Filter tools by name, description, or category
- **Status Monitoring** - Real-time status updates for all MCP tools

## 🗄️ Supabase Configuration

### Environment Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to find your project URL and anon key
3. Update your `.env` file with these credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=32_random_string

# Privy Configuration (optional)
VITE_PRIVY_APP_ID=your_privy_app_id
VITE_PRIVY_CLIENT_ID=your_privy_client_id
```

### Local Development

Start the Supabase local development environment:

```bash
# Start Supabase services
bunx supabase start

# Apply migrations (if any)
bunx supabase db reset

# View Supabase Studio
open http://localhost:54323
```

### Database Schema

The project includes TypeScript types for your database schema in `src/types/database.ts`. Update this file to match your Supabase database structure.

### Authentication

The Supabase client is configured with:
- Auto token refresh
- Session persistence
- URL session detection
- Privy integration for Web3 authentication

### Error Handling

The project includes comprehensive error handling utilities in `src/lib/supabase-errors.ts` with:
- Retry mechanisms
- Error logging
- User-friendly error messages

## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) components built on top of:
- **Radix UI** - Unstyled, accessible components
- **Tailwind CSS** - Utility-first styling
- **Class Variance Authority** - Component variants
- **Lucide React** - Beautiful icons

### Adding New Components

```bash
bunx shadcn@latest add button
# or
npx shadcn@latest add button
```

## 🧪 Testing

The project is configured with:
- **Vitest** - Fast test runner
- **React Testing Library** - Component testing utilities
- **jsdom** - DOM environment for tests
- **@testing-library/jest-dom** - Custom matchers

### Running Tests

```bash
# Run tests in watch mode
bun test

# Run tests once
bun test:run

# Run tests with coverage
bun test:coverage

# Run tests with UI
bun test:ui
```

## 📦 Technologies Used

### Core Stack
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui, Radix UI
- **Backend**: Supabase (optional)
- **Routing**: React Router DOM
- **MCP Integration**: use-mcp package
- **Authentication**: Privy (Web3) + Supabase Auth

### Development Tools
- **Testing**: Vitest, React Testing Library
- **Code Quality**: ESLint, Prettier
- **Package Manager**: Bun (recommended) or pnpm
- **Build Tool**: Vite with optimized production builds

### UI Components
- **Component Library**: shadcn/ui
- **Icons**: Lucide React
- **Primitives**: Radix UI
- **Styling**: Tailwind CSS with custom green gradient theme

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run the checks: `bun check-all`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all checks pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔧 Development Workflow

### Adding New MCP Tools

1. The MCP tools are automatically discovered from the Nodit server
2. Tool categorization happens automatically based on naming patterns
3. Custom tool handling can be added in `src/pages/MCPPage.tsx`

### Customizing the UI

1. Update the green gradient theme in `tailwind.config.ts`
2. Modify component styles in `src/components/ui/`
3. Add new pages in `src/pages/` and update routing in `src/App.tsx`

### Testing MCP Integration

```bash
# Run the development server
bun dev

# Visit the MCP page to test live connection
open http://localhost:3000/mcp

# Check browser console for connection status
```

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page for known issues
2. Create a new issue with detailed reproduction steps
3. Refer to the [Nodit MCP Documentation](https://docs.nodit.io/mcp)
4. Check the [use-mcp Package Documentation](https://www.npmjs.com/package/use-mcp)
5. Refer to the [Supabase Documentation](https://supabase.com/docs)
6. Check the [shadcn/ui Documentation](https://ui.shadcn.com/)

## 🌟 What's Next?

This boilerplate provides a solid foundation for MCP integration. Consider extending it with:

- **Real Chat Integration** - Replace mock chat with actual AI conversation
- **Custom MCP Tools** - Add your own MCP tool implementations
- **Advanced Authentication** - Implement role-based access control
- **Data Persistence** - Store chat history and user preferences
- **Real-time Collaboration** - Add multi-user features with Supabase Realtime

---

**Happy coding with Nodit MCP! 🚀**
