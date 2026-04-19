import { useState } from 'react'
import type { FormEvent, CSSProperties } from 'react'
import { verifyPassword, SCUBA_PASSWORD_HASH } from '../utils/auth'

interface LoginProps {
  onLogin: (username: string) => void
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (username === 'admin') {
        const isValid = await verifyPassword(password, SCUBA_PASSWORD_HASH)
        if (isValid) {
          onLogin(username)
        } else {
          setError('Invalid credentials')
        }
      } else {
        setError('Invalid credentials')
      }
    } catch {
      setError('Authentication error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--color-bg-primary)' }}>
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-accent)' }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="font-mono text-3xl tracking-widest mb-2" style={{ color: 'var(--color-accent-green)' }}>
            DEEPRUN
          </div>
          <div className="font-mono text-sm tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
            SUBMERSIBLE CONTROL
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-mono tracking-widest mb-2" style={{ color: 'var(--color-text-primary)' }}>
              USERNAME
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded border font-mono tracking-widest text-sm focus:outline-none focus:ring-2"
              style={{
                background: 'var(--color-bg-surface)',
                borderColor: 'var(--color-border-accent)',
                color: 'var(--color-text-primary)',
                '--tw-ring-color': 'var(--color-accent-cyan)'
              } as CSSProperties}
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-mono tracking-widest mb-2" style={{ color: 'var(--color-text-primary)' }}>
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded border font-mono tracking-widest text-sm focus:outline-none focus:ring-2"
              style={{
                background: 'var(--color-bg-surface)',
                borderColor: 'var(--color-border-accent)',
                color: 'var(--color-text-primary)',
                '--tw-ring-color': 'var(--color-accent-cyan)'
              } as CSSProperties}
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <div className="text-center font-mono text-sm tracking-widest" style={{ color: 'var(--color-danger)' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded font-mono tracking-widest text-sm transition-colors hover:opacity-90 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'var(--color-accent-green)',
              color: 'var(--color-bg-primary)',
              '--tw-ring-color': 'var(--color-accent-cyan)'
            } as CSSProperties}
          >
            {isLoading ? 'LOGGING IN...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  )
}