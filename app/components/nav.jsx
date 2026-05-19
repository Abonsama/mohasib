'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, BarChart2, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/AuthContext'

export default function Nav() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/statisticsPage', label: 'Statistics', icon: BarChart2 },
  ]

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 'var(--nav-height)',
      background: 'var(--bg)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 100,
      maxWidth: '100%',
      margin: '0 auto',
    }}>
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 24px',
              borderRadius: '10px',
              textDecoration: 'none',
              color: active ? 'var(--green)' : 'var(--text-muted)',
              background: active ? 'var(--green-tint)' : 'transparent',
              transition: 'all 0.15s',
            }}
          >
            <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
            <span style={{ fontSize: '11px', fontWeight: active ? '600' : '400' }}>
              {label}
            </span>
          </Link>
        )
      })}
      
      {/* Logout button */}
      <button
        onClick={signOut}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          padding: '8px 24px',
          borderRadius: '10px',
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
      >
        <LogOut size={20} strokeWidth={1.8} />
        <span style={{ fontSize: '11px', fontWeight: '400' }}>
          Logout
        </span>
      </button>
    </nav>
  )
}