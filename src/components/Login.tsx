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
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden" style={{ background: 'var(--color-bg-primary)' }}>

      {/* ── Ocean background layer ── */}
      <div className="ocean-bubbles" aria-hidden="true">
        <span className="bubble" /><span className="bubble" /><span className="bubble" />
        <span className="bubble" /><span className="bubble" /><span className="bubble" />
        <span className="bubble" /><span className="bubble" />
      </div>

      {/* Submarine cruising behind the card */}
      <div className="submarine fixed pointer-events-none" style={{ top: '30%', zIndex: 0 }} aria-hidden="true">
        <svg width="220" height="80" viewBox="0 0 220 80" fill="none" opacity="0.13" style={{ transform: 'scaleX(-1)' }}>
          <ellipse cx="105" cy="52" rx="95" ry="22" fill="#00E5FF" />
          <rect x="85" y="28" width="40" height="26" rx="6" fill="#00E5FF" />
          <rect x="118" y="14" width="3" height="16" rx="1.5" fill="#00E5FF" />
          <rect x="112" y="14" width="12" height="3" rx="1.5" fill="#00E5FF" />
          <circle cx="70" cy="52" r="7" fill="#020B18" stroke="#00E5FF" strokeWidth="2" />
          <circle cx="120" cy="52" r="7" fill="#020B18" stroke="#00E5FF" strokeWidth="2" />
          <circle cx="200" cy="52" r="6" fill="none" stroke="#00E5FF" strokeWidth="2" />
          <line x1="200" y1="46" x2="200" y2="58" stroke="#00E5FF" strokeWidth="2" />
          <line x1="194" y1="52" x2="206" y2="52" stroke="#00E5FF" strokeWidth="2" />
          <path d="M195 40 L210 30 L210 42 Z" fill="#00E5FF" />
          <path d="M195 64 L210 74 L210 62 Z" fill="#00E5FF" />
        </svg>
      </div>

      {/* Fish 1 */}
      <div className="fish-1 fixed pointer-events-none" style={{ top: '20%', zIndex: 0 }} aria-hidden="true">
        <svg width="28" height="14" viewBox="0 0 28 14" fill="none">
          <ellipse cx="16" cy="7" rx="10" ry="5" fill="rgba(255,105,180,0.45)" />
          <polygon points="0,0 0,14 8,7" fill="rgba(255,105,180,0.4)" />
          <circle cx="22" cy="5.5" r="1.2" fill="rgba(255,182,213,0.9)" />
        </svg>
      </div>

      {/* Fish 2 */}
      <div className="fish-2 fixed pointer-events-none" style={{ top: '70%', zIndex: 0 }} aria-hidden="true">
        <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
          <ellipse cx="13" cy="5.5" rx="8" ry="4" fill="rgba(255,105,180,0.45)" />
          <polygon points="0,0 0,11 6,5.5" fill="rgba(255,105,180,0.4)" />
          <circle cx="18" cy="4" r="1" fill="rgba(255,182,213,0.9)" />
        </svg>
      </div>


      {/* Yellow fish 3 */}
      <div className="fish-3 fixed pointer-events-none" style={{ top: '45%', zIndex: 0 }} aria-hidden="true">
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none" style={{ transform: 'scaleX(-1)' }}>
          <ellipse cx="14" cy="6" rx="9" ry="4.5" fill="rgba(255,220,80,0.55)" />
          <polygon points="0,0 0,12 7,6" fill="rgba(255,200,50,0.5)" />
          <circle cx="19" cy="4.5" r="1.1" fill="rgba(255,240,150,0.95)" />
        </svg>
      </div>

      {/* Yellow fish 4 — smaller, different height */}
      <div className="fish-4 fixed pointer-events-none" style={{ top: '58%', zIndex: 0 }} aria-hidden="true">
        <svg width="18" height="9" viewBox="0 0 18 9" fill="none" style={{ transform: 'scaleX(-1)' }}>
          <ellipse cx="11" cy="4.5" rx="7" ry="3.5" fill="rgba(255,210,60,0.5)" />
          <polygon points="0,0 0,9 5,4.5" fill="rgba(255,195,40,0.45)" />
          <circle cx="15" cy="3.2" r="0.9" fill="rgba(255,240,150,0.95)" />
        </svg>
      </div>

      {/* Whale — slow deep pass, faces right */}
      <div className="whale fixed pointer-events-none" style={{ top: '55%', zIndex: 0 }} aria-hidden="true">
        <svg width="180" height="80" viewBox="0 0 180 80" fill="none" opacity="0.18" style={{ transform: 'scaleX(-1)' }}>
          {/* Body */}
          <path d="M20 40 Q10 20 50 15 Q100 8 145 30 Q165 38 162 48 Q160 58 140 60 Q100 68 50 60 Q15 55 20 40 Z"
            fill="#A8D8F0" />
          {/* Belly lighter patch */}
          <path d="M50 52 Q90 62 135 54 Q155 50 155 48 Q153 42 135 40 Q90 35 50 44 Z"
            fill="#C8E8FF" opacity="0.4" />
          {/* Tail flukes */}
          <path d="M155 38 Q175 18 178 28 Q180 34 162 42 Z" fill="#A8D8F0" />
          <path d="M155 52 Q175 70 178 60 Q180 54 162 46 Z" fill="#A8D8F0" />
          {/* Fin */}
          <path d="M90 15 Q95 0 108 8 Q102 15 90 15 Z" fill="#A8D8F0" />
          {/* Eye */}
          <circle cx="42" cy="36" r="4" fill="#020B18" />
          <circle cx="43" cy="35" r="1.2" fill="#C8E8FF" />
          {/* Mouth smile */}
          <path d="M22 42 Q32 48 40 44" stroke="#7BB8D4" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* Seaweed cluster — bottom left */}
      <div className="fixed bottom-0 left-6 flex items-end gap-1 pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
        <svg className="seaweed" width="12" height="80" viewBox="0 0 12 80" fill="none">
          <path d="M6 80 C4 66 8 52 5 38 C3 26 7 12 6 0" stroke="#0F6B4F" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <svg className="seaweed" width="12" height="110" viewBox="0 0 12 110" fill="none">
          <path d="M6 110 C8 92 4 74 7 56 C9 40 5 20 6 0" stroke="#0D4A3A" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <svg className="seaweed" width="12" height="70" viewBox="0 0 12 70" fill="none">
          <path d="M6 70 C4 56 8 42 5 28 C3 16 7 6 6 0" stroke="#0F6B4F" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <svg className="seaweed" width="12" height="95" viewBox="0 0 12 95" fill="none">
          <path d="M6 95 C8 78 4 61 7 44 C9 30 5 14 6 0" stroke="#0D4A3A" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Seaweed cluster — bottom right */}
      <div className="fixed bottom-0 right-8 flex items-end gap-1 pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
        <svg className="seaweed" width="12" height="90" viewBox="0 0 12 90" fill="none">
          <path d="M6 90 C4 74 8 58 5 42 C3 28 7 12 6 0" stroke="#0F6B4F" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <svg className="seaweed" width="12" height="65" viewBox="0 0 12 65" fill="none">
          <path d="M6 65 C8 52 4 38 7 24 C9 14 5 5 6 0" stroke="#0D4A3A" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <svg className="seaweed" width="12" height="100" viewBox="0 0 12 100" fill="none">
          <path d="M6 100 C4 82 8 64 5 46 C3 30 7 14 6 0" stroke="#0F6B4F" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      {/* Ocean floor gradient */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none" style={{ height: '40px', background: 'linear-gradient(to top, #0A1A0F, transparent)', zIndex: 0 }} />

      {/* Login card */}
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg relative" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-accent)', zIndex: 1 }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="font-mono text-3xl tracking-widest mb-2" style={{ color: 'var(--color-accent-green)' }}>
            SCUBAAAA
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
