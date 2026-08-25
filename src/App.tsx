import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Findings from './pages/Findings'
import Methodology from './pages/Methodology'
import Paper from './pages/Paper'

// ─── Protected Route Component ───────────────────────────────────────────────
interface ProtectedRouteProps {
  children: JSX.Element
  correctPass?: string
}

function ProtectedRoute({
  children,
  correctPass = 'vc' // Change your desired password here
}: ProtectedRouteProps) {
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

  return (
    <div style={{
      minHeight: '50vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 0'
    }}>
      <form onSubmit={handleUnlock} style={{
        maxWidth: '380px',
        width: '100%',
        padding: '2.5rem',
        border: '1px solid var(--rule, #E8E3DC)',
        background: '#FAF8F5',
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
          fontFamily: 'Playfair Display, Georgia, serif',
          fontSize: '1.4rem',
          color: 'var(--ink, #181615)',
          marginBottom: '1.5rem',
          fontWeight: 600
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
            border: error ? '1px solid #C85A32' : '1px solid var(--rule, #E8E3DC)',
            borderRadius: '4px',
            marginBottom: '0.5rem',
            outline: 'none',
            boxSizing: 'border-box',
            background: '#fff'
          }}
        />

        {error && (
          <p style={{ color: '#C85A32', fontSize: '0.75rem', marginBottom: '1rem' }}>
            Incorrect password. Please try again.
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
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Unlock Page
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
            Return Home
          </button>
        </div>
      </form>
    </div>
  )
}

// ─── Header Component ────────────────────────────────────────────────────────
function EditorialHeader() {
  const location = useLocation()

  const getPageLabel = (pathname: string) => {
    switch(pathname) {
      case '/findings': return 'FINDINGS'
      case '/methodology': return 'METHODOLOGY'
      case '/paper': return 'PAPER & DATA'
      default: return 'OVERVIEW'
    }
  }

  return (
    <header style={{ padding: '2rem 3rem 0', backgroundColor: 'var(--ground)', width: '100%' }}>
      {/* Top Meta Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        fontSize: '0.75rem',
        fontFamily: 'monospace',
        letterSpacing: '0.1em',
        color: 'var(--mid)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" style={{ color: 'var(--ink)', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.05em' }}>
            VC & PATENT RESEARCH
          </Link>
          <span style={{ color: 'var(--rule)' }}>|</span>
          <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{getPageLabel(location.pathname)}</span>
        </div>
        <div>
          Seltzer · QSS 20 - 26X · Dartmouth · 2026
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{
        display: 'flex',
        gap: '2rem',
        fontSize: '0.875rem',
        fontWeight: 500,
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--ink)'
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: location.pathname === '/' ? 'var(--ink)' : 'var(--mid)', fontWeight: location.pathname === '/' ? 'bold' : 'normal' }}>
          Overview
        </Link>
        <Link to="/findings" style={{ textDecoration: 'none', color: location.pathname === '/findings' ? 'var(--ink)' : 'var(--mid)', fontWeight: location.pathname === '/findings' ? 'bold' : 'normal' }}>
          Findings
        </Link>
        <Link to="/methodology" style={{ textDecoration: 'none', color: location.pathname === '/methodology' ? 'var(--ink)' : 'var(--mid)', fontWeight: location.pathname === '/methodology' ? 'bold' : 'normal' }}>
          Methodology
        </Link>
        <Link to="/paper" style={{ textDecoration: 'none', color: location.pathname === '/paper' ? 'var(--ink)' : 'var(--mid)', fontWeight: location.pathname === '/paper' ? 'bold' : 'normal' }}>
          Paper & Data
        </Link>
      </div>
    </header>
  )
}

// ─── Main App Component ──────────────────────────────────────────────────────
export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#181615]">
        <EditorialHeader />
        <main className="flex-grow px-12 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/findings"
              element={
                <ProtectedRoute>
                  <Findings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/methodology"
              element={
                <ProtectedRoute>
                  <Methodology />
                </ProtectedRoute>
              }
            />
            <Route
              path="/paper"
              element={
                <ProtectedRoute>
                  <Paper />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <footer className="border-t border-[#E8E3DC] py-8 px-12 text-center text-sm text-[#8C877E] bg-[#FAF8F5]">
          Seltzer · Final Research Project · QSS 20 - 26X · Dartmouth College
        </footer>
      </div>
    </Router>
  )
}