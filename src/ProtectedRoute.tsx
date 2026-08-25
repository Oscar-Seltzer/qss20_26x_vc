import { useState } from 'react'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: JSX.Element
  correctPass?: string
}

export default function ProtectedRoute({
  children,
  correctPass = 'vc' // Set your desired password here
}: ProtectedRouteProps) {
  // Check session storage so users don't have to re-enter password on refresh
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('is_authenticated') === 'true'
  })
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [shouldRedirectHome, setShouldRedirectHome] = useState(false)

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    if (input === correctPass) {
      sessionStorage.setItem('is_authenticated', 'true')
      setIsAuthenticated(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  if (shouldRedirectHome) {
    return <Navigate to="/" replace />
  }

  if (isAuthenticated) {
    return children
  }

  // Minimal editorial password prompt
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--ground, #FAF8F5)',
      fontFamily: 'Inter, sans-serif',
      padding: '2rem'
    }}>
      <form onSubmit={handleUnlock} style={{
        maxWidth: '360px',
        width: '100%',
        padding: '2.5rem',
        border: '1px solid var(--rule, #E8E3DC)',
        background: '#fff',
        borderRadius: '4px'
      }}>
        <p style={{
          fontSize: '0.68rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--accent, #228B22)',
          fontWeight: 600,
          marginBottom: '0.5rem'
        }}>
          Work In Progress
        </p>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '1.4rem',
          color: 'var(--ink, #181615)',
          marginBottom: '1.5rem'
        }}>
          Password Required
        </h2>

        <input
          type="password"
          placeholder="Enter password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '0.9rem',
            border: error ? '1px solid #c85a32' : '1px solid var(--rule, #E8E3DC)',
            borderRadius: '4px',
            marginBottom: '0.5rem',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />

        {error && (
          <p style={{ color: '#c85a32', fontSize: '0.75rem', marginBottom: '1rem' }}>
            Incorrect password.
          </p>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: '0.65rem',
              background: 'var(--ink, #181615)',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Unlock
          </button>
          <button
            type="button"
            onClick={() => setShouldRedirectHome(true)}
            style={{
              padding: '0.65rem 1rem',
              background: 'transparent',
              border: '1px solid var(--rule, #E8E3DC)',
              borderRadius: '4px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              color: 'var(--mid, #8C877E)'
            }}
          >
            Home
          </button>
        </div>
      </form>
    </div>
  )
}