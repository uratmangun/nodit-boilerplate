import { usePrivy } from '@privy-io/react-auth'
import { Button } from '@/components/ui/button'
import { LogIn, LogOut, User } from 'lucide-react'

export default function LoginButton() {
  const { ready, authenticated, user, login, logout } = usePrivy()

  // Don't render anything until Privy is ready
  if (!ready) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <User className="h-4 w-4 mr-2" />
        Loading...
      </Button>
    )
  }

  if (authenticated && user) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground hidden sm:block">
          {user.email?.address || user.wallet?.address?.slice(0, 6) + '...' || 'User'}
        </span>
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    )
  }

  return (
    <Button variant="ghost" size="sm" onClick={login}>
      <LogIn className="h-4 w-4 mr-2" />
      Login
    </Button>
  )
}
