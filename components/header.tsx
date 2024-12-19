'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Menu, X } from 'lucide-react'
import SignUpModal from './SignUpModal'
import SignInModal from './SignInModal'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const [isSignInOpen, setIsSignInOpen] = useState(false)

  const scrollToPricing = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const pricingSection = document.getElementById('pricing')
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' })
      window.history.pushState(null, '', '/#pricing')
    }
  }

  useEffect(() => {
    if (window.location.hash === '#pricing') {
      const pricingSection = document.getElementById('pricing')
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold">Mood Whisper</span>
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-sm font-medium hover:text-primary">Home</Link>
          <Link href="/features" className="text-sm font-medium hover:text-primary">Features</Link>
          <Link href="/how-it-works" className="text-sm font-medium hover:text-primary">How it Works</Link>
          <Link href="/blog" className="text-sm font-medium hover:text-primary">Blog</Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary">About</Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary">Contact</Link>
          <Link href="/admin" className="text-sm font-medium hover:text-primary">Admin</Link>
          <a href="#pricing" className="text-sm font-medium hover:text-primary" onClick={scrollToPricing}>Pricing</a>
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="outline" onClick={() => setIsSignUpOpen(true)}>
            Sign Up
          </Button>
          <Button variant="outline" onClick={() => setIsSignInOpen(true)}>
            Sign In
          </Button>
          <Button asChild variant="outline" className="hidden md:inline-flex">
            <Link href="/schedule-demo">Schedule Demo</Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col space-y-4 p-4">
            <Link href="/" className="text-sm font-medium hover:text-primary">Home</Link>
            <Link href="/features" className="text-sm font-medium hover:text-primary">Features</Link>
            <Link href="/how-it-works" className="text-sm font-medium hover:text-primary">How it Works</Link>
            <Link href="/blog" className="text-sm font-medium hover:text-primary">Blog</Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">About</Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary">Contact</Link>
            <Link href="/admin" className="text-sm font-medium hover:text-primary">Admin</Link>
            <a href="#pricing" className="text-sm font-medium hover:text-primary" onClick={scrollToPricing}>Pricing</a>
            <Button variant="outline" onClick={() => setIsSignUpOpen(true)}>
              Sign Up
            </Button>
            <Button variant="outline" onClick={() => setIsSignInOpen(true)}>
              Sign In
            </Button>
            <Button asChild variant="outline">
              <Link href="/schedule-demo">Schedule Demo</Link>
            </Button>
          </nav>
        </div>
      )}
      <SignUpModal isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} />
      <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
    </header>
  )
}

