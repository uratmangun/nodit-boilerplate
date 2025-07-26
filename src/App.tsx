import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import RouteErrorBoundary from '@/components/common/RouteErrorBoundary'
import GlobalErrorBoundary from '@/components/common/GlobalErrorBoundary'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Toaster } from '@/components/ui/toaster'
import { StagewiseToolbar } from '@stagewise/toolbar-react'
import ReactPlugin from '@stagewise-plugins/react'

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@/pages/HomePage'))
const ChatPage = lazy(() => import('@/pages/ChatPage'))
const MCPPage = lazy(() => import('@/pages/MCPPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function App() {
  return (
    <GlobalErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route
                index
                element={
                  <RouteErrorBoundary>
                    <Suspense fallback={<LoadingSpinner />}>
                      <HomePage />
                    </Suspense>
                  </RouteErrorBoundary>
                }
              />
              <Route
                path="chat"
                element={
                  <RouteErrorBoundary>
                    <Suspense fallback={<LoadingSpinner />}>
                      <ChatPage />
                    </Suspense>
                  </RouteErrorBoundary>
                }
              />
              <Route
                path="mcp"
                element={
                  <RouteErrorBoundary>
                    <Suspense fallback={<LoadingSpinner />}>
                      <MCPPage />
                    </Suspense>
                  </RouteErrorBoundary>
                }
              />
              <Route
                path="*"
                element={
                  <RouteErrorBoundary>
                    <Suspense fallback={<LoadingSpinner />}>
                      <NotFoundPage />
                    </Suspense>
                  </RouteErrorBoundary>
                }
              />
            </Route>
          </Routes>
          <Toaster />
        </BrowserRouter>
        <StagewiseToolbar config={{ plugins: [ReactPlugin] }} />
      </ThemeProvider>
    </GlobalErrorBoundary>
  )
}

export default App
