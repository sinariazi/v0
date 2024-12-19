import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn } from 'aws-amplify/auth'
import { configureAmplify } from '../lib/amplify-config'

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
}

interface SignInError {
  name: string;
  message: string;
  code?: string;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    console.log('SignInModal: Attempting to configure Amplify...')
    const configured = configureAmplify()
    console.log('SignInModal: Amplify configuration result:', configured)
    setIsConfigured(configured)
    if (!configured) {
      setError('Amplify configuration failed. Please check your environment variables.')
    }
  }, [])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConfigured) {
      setError('Amplify is not configured. Unable to sign in.')
      return
    }
    setError(null)
    try {
      console.log('Attempting sign in with:', { email })
      const result = await signIn({ username: email, password })
      console.log('Sign in result:', result)
      onClose()
    } catch (error) {
      console.error('Error signing in:', error)
      const signInError = error as SignInError
      console.error('Error name:', signInError.name)
      console.error('Error message:', signInError.message)
      if (signInError.code) {
        console.error('Error code:', signInError.code)
      }
      setError(signInError.message || 'An unknown error occurred')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={!isConfigured}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={!isConfigured}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit" disabled={!isConfigured}>Sign In</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

