export default function HomePage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center relative">
      {/* Green background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-transparent to-emerald-50/20 dark:from-green-950/20 dark:via-transparent dark:to-emerald-950/10" />
      
      <div className="text-center space-y-8 max-w-4xl mx-auto px-4 relative z-10">
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
        
        {/* Optional: Add a subtle green glow effect */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-400/10 rounded-full blur-3xl -z-10" />
      </div>
    </div>
  )
}