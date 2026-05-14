'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface NavbarProps {
  user?: { email?: string; user_metadata?: { role?: string } } | null
}

export default function Navbar({ user }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#0F6E56' }}>
              <span className="text-white text-sm font-bold">K</span>
            </div>
            <span className="font-semibold text-lg" style={{ color: '#0F6E56' }}>
              Kabanalouer
            </span>
          </Link>

          {/* Navigation centre */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/chalets" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Explorer les chalets
            </Link>
            <Link href="/regions" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Régions
            </Link>
          </div>

          {/* Actions droite */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  style={{ color: '#0F6E56' }}
                >
                  Mon espace
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm font-medium text-white px-4 py-2 rounded-lg transition-opacity hover:opacity-90"
                  style={{ background: '#0F6E56' }}
                >
                  Publier un chalet
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
