import { usePrivy } from '@privy-io/react-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Wallet, Mail } from 'lucide-react'

export default function AuthStatus() {
  const { ready, authenticated, user } = usePrivy()

  if (!ready) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Authentication Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading...</p>
        </CardContent>
      </Card>
    )
  }

  if (!authenticated || !user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Authentication Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary">Not Authenticated</Badge>
          <p className="text-sm text-muted-foreground mt-2">
            Please log in to access your account and wallet features.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Authentication Status
        </CardTitle>
        <CardDescription>Your account information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="default">Authenticated</Badge>
        </div>

        {user.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span className="text-sm">{user.email.address}</span>
          </div>
        )}

        {user.wallet && (
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <span className="text-sm font-mono">
              {user.wallet.address.slice(0, 6)}...{user.wallet.address.slice(-4)}
            </span>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          User ID: {user.id}
        </div>
      </CardContent>
    </Card>
  )
}
