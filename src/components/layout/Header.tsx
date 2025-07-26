import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import LoginButton from '@/components/auth/LoginButton'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="font-bold text-lg hidden sm:block">nodit mcp boilerplate</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Button
              variant={isActive('/') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/">Home</Link>
            </Button>
            
            <Button
              variant={isActive('/chat') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/chat">Chat</Link>
            </Button>
            
            <Button
              variant={isActive('/mcp') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/mcp">MCP</Link>
            </Button>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            <LoginButton />
            <ThemeToggle />
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur">
            <nav className="flex flex-col space-y-1 p-4">
              <Button
                variant={isActive('/') ? 'default' : 'ghost'}
                size="sm"
                asChild
                className="justify-start"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link to="/">Home</Link>
              </Button>
              
              <Button
                variant={isActive('/about') ? 'default' : 'ghost'}
                size="sm"
                asChild
                className="justify-start"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link to="/about">About</Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}