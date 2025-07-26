import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/ui/copy-button'
import AuthStatus from '@/components/auth/AuthStatus'
import { ExternalLink, Github } from 'lucide-react'

export default function HomePage() {
  const cloneCommand = 'gh repo create my-nodit-project --template uratmangun/nodit-boilerplate --public --clone'
  
  return (
    <div className="min-h-[70vh] flex items-center justify-center relative">
      {/* Green background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-transparent to-emerald-50/20 dark:from-green-950/20 dark:via-transparent dark:to-emerald-950/10" />
      
      <div className="text-center space-y-12 max-w-4xl mx-auto px-4 relative z-10">
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
            Nodit boilerplate
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full" />
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Use this boilerplate to use{' '}
            <span className="text-green-600 dark:text-green-400 font-semibold">nodit mcp</span>{' '}
            on web
          </p>
        </div>

        {/* Template Clone Section */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground flex items-center justify-center gap-2">
              <Github className="h-5 w-5 text-green-600" />
              Use This Template
            </h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Get started quickly by creating a new project from this template using GitHub CLI
            </p>
          </div>

          <div className="w-full max-w-2xl mx-auto space-y-4">
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg font-mono text-sm">
              <code className="flex-1 text-left">{cloneCommand}</code>
              <CopyButton text={cloneCommand} />
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open('https://github.com/uratmangun/nodit-boilerplate', '_blank')}
                className="border-green-200 hover:border-green-300 hover:bg-green-50 dark:border-green-800 dark:hover:border-green-700 dark:hover:bg-green-950"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Repository
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open('https://github.com/uratmangun/nodit-boilerplate/generate', '_blank')}
                className="border-green-200 hover:border-green-300 hover:bg-green-50 dark:border-green-800 dark:hover:border-green-700 dark:hover:bg-green-950"
              >
                <Github className="h-4 w-4 mr-2" />
                Use Template
              </Button>
            </div>
          </div>
        </div>

        {/* Authentication Status */}
        <div className="max-w-md mx-auto">
          <AuthStatus />
        </div>
        
        {/* Optional: Add a subtle green glow effect */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-400/10 rounded-full blur-3xl -z-10" />
      </div>
    </div>
  )
}