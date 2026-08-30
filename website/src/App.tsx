import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Findings from './pages/Findings'
import Methodology from './pages/Methodology'
import Paper from './pages/Paper'

// ─── Header Component ────────────────────────────────────────────────────────
function EditorialHeader() {
  const location = useLocation()

  const getPageLabel = (pathname: string) => {
    switch (pathname) {
      case '/findings':
        return 'FINDINGS'
      case '/methodology':
        return 'METHODOLOGY'
      case '/paper':
        return 'PAPER & DATA'
      default:
        return 'OVERVIEW'
    }
  }

  return (
    <header style={{ padding: '2rem 3rem 0', backgroundColor: 'var(--ground)', width: '100%' }}>
      {/* Top Meta Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          fontSize: '0.75rem',
          fontFamily: 'monospace',
          letterSpacing: '0.1em',
          color: 'var(--mid)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link
            to="/"
            style={{
              color: 'var(--ink)',
              fontWeight: 600,
              textDecoration: 'none',
              letterSpacing: '0.05em',
            }}
          >
            VC & PATENT RESEARCH
          </Link>
          <span style={{ color: 'var(--rule)' }}>|</span>
          <span style={{ color: 'var(--ink)', fontWeight: 600 }}>
            {getPageLabel(location.pathname)}
          </span>
        </div>
        <div>Seltzer · QSS 20 - 26X · Dartmouth · 2026</div>
      </div>

      {/* Navigation Links */}
      <div
        style={{
          display: 'flex',
          gap: '2rem',
          fontSize: '0.875rem',
          fontWeight: 500,
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--ink)',
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            color: location.pathname === '/' ? 'var(--ink)' : 'var(--mid)',
            fontWeight: location.pathname === '/' ? 'bold' : 'normal',
          }}
        >
          Overview
        </Link>
        <Link
          to="/findings"
          style={{
            textDecoration: 'none',
            color: location.pathname === '/findings' ? 'var(--ink)' : 'var(--mid)',
            fontWeight: location.pathname === '/findings' ? 'bold' : 'normal',
          }}
        >
          Findings
        </Link>
        <Link
          to="/methodology"
          style={{
            textDecoration: 'none',
            color: location.pathname === '/methodology' ? 'var(--ink)' : 'var(--mid)',
            fontWeight: location.pathname === '/methodology' ? 'bold' : 'normal',
          }}
        >
          Methodology
        </Link>
        <Link
          to="/paper"
          style={{
            textDecoration: 'none',
            color: location.pathname === '/paper' ? 'var(--ink)' : 'var(--mid)',
            fontWeight: location.pathname === '/paper' ? 'bold' : 'normal',
          }}
        >
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
            <Route path="/findings" element={<Findings />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route path="/paper" element={<Paper />} />
          </Routes>
        </main>
        <footer className="border-t border-[#E8E3DC] py-8 px-12 text-center text-sm text-[#8C877E] bg-[#FAF8F5]">
          Seltzer · Final Research Project · QSS 20 - 26X · Dartmouth College
        </footer>
      </div>
    </Router>
  )
}