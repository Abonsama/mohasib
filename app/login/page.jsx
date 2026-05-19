'use client'
import { Suspense, useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn, signUp } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: authError } = isLogin 
      ? await signIn(email, password)
      : await signUp(email, password)

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    const redirectTo = searchParams.get('redirect') || '/'
    router.push(redirectTo)
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: '400px',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '32px',
    }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: '24px',
        color: 'var(--text-primary)',
      }}>
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h1>

      {error && (
        <div style={{
          background: 'rgba(155, 34, 38, 0.1)',
          border: '1px solid #E05C62',
          borderRadius: '8px',
          padding: '10px 14px',
          color: '#9B2226',
          marginBottom: '16px',
          fontSize: '13px',
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--text-secondary)',
            marginBottom: '6px',
          }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--text-secondary)',
            marginBottom: '6px',
          }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: 'var(--radius)',
            border: 'none',
            background: '#2D6A4F',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            marginTop: '8px',
          }}
        >
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <div style={{
        textAlign: 'center',
        marginTop: '20px',
        fontSize: '13px',
        color: 'var(--text-secondary)',
      }}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => { setIsLogin(!isLogin); setError('') }}
          style={{
            background: 'none',
            border: 'none',
            color: '#2D6A4F',
            fontWeight: '600',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: 'var(--bg)',
    }}>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}