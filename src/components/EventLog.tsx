import { useEffect, useRef } from 'react'
import type { LogEntry } from '../hooks/useSocket'

interface Props {
  entries: LogEntry[]
}

export function EventLog({ entries }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [entries])

  return (
    <div className="p-3 relative" style={{ borderTop: '1px solid var(--color-border-accent)' }}>
      <div className="text-xs font-mono tracking-widest mb-2" style={{ color: 'var(--color-text-muted)' }}>
        EVENT LOG
      </div>

      {/* Log scroll area — relative so fish/seaweed are contained */}
      <div
        className="overflow-hidden font-mono text-xs space-y-0.5 relative"
        style={{ height: '80px', background: 'var(--color-bg-surface)', borderRadius: '4px', padding: '6px' }}>

        {/* Seaweed cluster — left edge, rooted at bottom */}
        <div className="absolute bottom-0 left-1 flex items-end gap-0.5 pointer-events-none" style={{ zIndex: 0 }}>
          <svg className="seaweed" width="10" height="44" viewBox="0 0 10 44" fill="none">
            <path d="M5 44 C3 36 7 28 4 20 C2 13 6 6 5 0" stroke="#0F6B4F" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <svg className="seaweed" width="10" height="56" viewBox="0 0 10 56" fill="none">
            <path d="M5 56 C7 46 3 36 6 26 C8 17 4 8 5 0" stroke="#0D4A3A" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          <svg className="seaweed" width="10" height="38" viewBox="0 0 10 38" fill="none">
            <path d="M5 38 C3 30 7 22 4 14 C2 8 6 3 5 0" stroke="#0F6B4F" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>

        {/* Fish 1 — swims at ~25% height */}
        <div className="fish-1 absolute pointer-events-none" style={{ top: '20%', zIndex: 1 }}>
          <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
            <ellipse cx="12" cy="6" rx="8" ry="4" fill="rgba(255,105,180,0.5)" />
            <polygon points="0,0 0,12 6,6" fill="rgba(255,105,180,0.45)" />
            <circle cx="17" cy="5" r="1" fill="rgba(255,182,213,0.9)" />
          </svg>
        </div>

        {/* Yellow fish 3 */}
        <div className="fish-3 absolute pointer-events-none" style={{ top: '12%', zIndex: 1 }}>
          <svg width="20" height="10" viewBox="0 0 24 12" fill="none">
            <ellipse cx="14" cy="6" rx="9" ry="4.5" fill="rgba(255,220,80,0.55)" />
            <polygon points="0,0 0,12 7,6" fill="rgba(255,200,50,0.5)" />
            <circle cx="19" cy="4.5" r="1.1" fill="rgba(255,240,150,0.95)" />
          </svg>
        </div>

        {/* Yellow fish 4 */}
        <div className="fish-4 absolute pointer-events-none" style={{ top: '68%', zIndex: 1 }}>
          <svg width="16" height="8" viewBox="0 0 18 9" fill="none">
            <ellipse cx="11" cy="4.5" rx="7" ry="3.5" fill="rgba(255,210,60,0.5)" />
            <polygon points="0,0 0,9 5,4.5" fill="rgba(255,195,40,0.45)" />
            <circle cx="15" cy="3.2" r="0.9" fill="rgba(255,240,150,0.95)" />
          </svg>
        </div>

        {/* Fish 2 — swims at ~65% height */}
        <div className="fish-2 absolute pointer-events-none" style={{ top: '58%', zIndex: 1 }}>
          <svg width="16" height="9" viewBox="0 0 16 9" fill="none">
            <ellipse cx="9" cy="4.5" rx="6" ry="3" fill="rgba(255,105,180,0.5)" />
            <polygon points="0,0 0,9 4,4.5" fill="rgba(255,105,180,0.45)" />
            <circle cx="12" cy="3.5" r="0.8" fill="rgba(255,182,213,0.9)" />
          </svg>
        </div>

        {/* Submarine — swims through at ~42% height */}
        <div className="sub-swim absolute pointer-events-none" style={{ top: '30%', zIndex: 1 }}>
          <svg width="90" height="32" viewBox="0 0 90 32" fill="none" opacity="0.35" style={{ transform: 'scaleX(-1)' }}>
            <ellipse cx="43" cy="22" rx="38" ry="9" fill="#00E5FF" />
            <rect x="30" y="11" width="18" height="12" rx="3" fill="#00E5FF" />
            <rect x="44" y="5" width="2" height="8" rx="1" fill="#00E5FF" />
            <rect x="41" y="5" width="6" height="2" rx="1" fill="#00E5FF" />
            <circle cx="28" cy="22" r="3" fill="#051628" stroke="#00E5FF" strokeWidth="1.2" />
            <circle cx="50" cy="22" r="3" fill="#051628" stroke="#00E5FF" strokeWidth="1.2" />
            <circle cx="78" cy="22" r="3" fill="none" stroke="#00E5FF" strokeWidth="1.2" />
            <line x1="78" y1="19" x2="78" y2="25" stroke="#00E5FF" strokeWidth="1.2" />
            <line x1="75" y1="22" x2="81" y2="22" stroke="#00E5FF" strokeWidth="1.2" />
            <path d="M78 16 L86 11 L86 17 Z" fill="#00E5FF" />
            <path d="M78 28 L86 33 L86 27 Z" fill="#00E5FF" />
          </svg>
        </div>

        {/* Scrollable log text — sits above seaweed/fish */}
        <div className="overflow-y-auto h-full relative" style={{ zIndex: 2 }}>
          {entries.length === 0 && (
            <div style={{ color: 'var(--color-text-muted)' }}>— awaiting commands —</div>
          )}
          {entries.map((e, i) => (
            <div key={i}>
              <span style={{ color: 'var(--color-text-muted)' }}>[{e.ts} UTC] </span>
              <span style={{ color: 'var(--color-accent-cyan)' }}>CMD: {e.cmd}</span>
              <span style={{ color: 'var(--color-text-muted)' }}> → </span>
              <span style={{ color: 'var(--color-text-primary)' }}>direction: {e.direction}</span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Ocean floor strip */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '12px',
          background: 'linear-gradient(to top, #0A1A0F, transparent)',
          zIndex: 0,
        }}
      />
    </div>
  )
}
