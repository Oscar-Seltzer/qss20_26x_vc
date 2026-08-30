import { useEffect, useRef } from 'react'

// ─── Inline styles as a design system ────────────────────────────────────────
// Colors: FAF8F5 ground · 181615 charcoal · C85A32 terracotta · 8C877E warm-grey · E8E3DC rule
// Type: Playfair Display (display) · Inter (body/data)

const FONT_LINK = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400&family=Inter:wght@300;400;500;600&display=swap'

const metrics = [
  {
    id: 'forward-citations',
    label: 'Forward Citations',
    shortDef: 'Normalized Citation Impact',
    value: '2.1×',
    context: 'higher normalized forward citations vs. non-VC peers',
    detail:
      'VC-backed patents average 2.03 normalized forward citations compared to 0.98* for non-VC peers (p = 0.014), measured relative to subclass and grant-year cohort baselines. <br> *Due to the majority of the normalized data being non-VC, non-VC ~= 1',
  },
  {
    id: 'patent-scope',
    label: 'Patent Scope',
    shortDef: 'Total Claim Count',
    value: '+39%',
    context: 'more total claims filed per patent on average',
    detail:
      'VC-backed patents average 22.2 claims versus 16.0 for non-VC patents (p < 0.001). This could be from increased budgets, a strategy of bolstering competitive moats, or purely because of increased innovation rates.',
  },
  {
    id: 'science-intensity',
    label: 'Science Intensity',
    shortDef: 'NPL Citation Ratio',
    value: '0.45',
    context: 'mean NPL share vs. 0.37 for non-VC patents',
    detail:
      'Non-patent literature accounts for 44.6% of backward citations in VC-backed patents versus 36.9% in non-VC patents (p = 0.005), proxying closer proximity to scientific research.',
  },
]

const findings = [
  {
    index: 'I',
    headline: 'VC backing doubles forward citation impact',
    body: 'Across a cohort of 500,000 USPTO patents granted between 2000 and 2020, VC-backed inventions achieve a mean normalized forward citation impact of 2.03× the non-VC baseline of 0.98 (t = 2.49, p = 0.014). This demonstrates higher downstream technological influence.',
  },
  {
    index: 'II',
    headline: 'Invention breadth expands through claims',
    body: 'VC-funded patents contain an average of 22.2 claims compared to 16.0 for non-VC patents—a 38.7% increase (t = 29.71, p < 10e-180). This is primarily due to a drafting stategy aimed at building out defensive moats.',
  },
  {
    index: 'III',
    headline: 'Closer to scientific literature',
    body: 'VC-backed patents have a higher non-patent literature (NPL) ratio (0.446 vs. 0.369, p = 0.0047). A larger portion of their prior art citations references peer-reviewed scientific literature rather than earlier patent filings. This further supports the idea of VC portfolios being linked to scientific iteration and discovery.',
  },
  {
    index: 'IV',
    headline: 'Citation premiums concentrate in digital and tech sectors',
    body: 'The VC citation premium is heavily sector-dependent. It peaks in Electricity (~2.65×) and Physics & Computing (~2.27×), followed by Chemistry & Metallurgy (~1.55×) and Human Necessities (~1.52×). In contrast, Operations & Transport (0.78×) and Mechanical Engineering (0.58×) fall below the 1.0 peer cohort benchmark.',
  },
]
export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)

  // Subtle scroll-linked parallax on hero rule
  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const onScroll = () => {
      const y = window.scrollY
      const rule = el.querySelector<HTMLElement>('.hero-rule')
      if (rule) rule.style.transform = `translateX(${y * 0.06}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* ── Google Fonts ── */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href={FONT_LINK} rel="stylesheet" />

<style>{`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ground:      #FAF8F5;
    --ink:         #181615;
    --accent:      #228B22;
    --mid:         #8C877E;
    --rule:        #E8E3DC;
    --rule-dark:   #2E2A27;
    --surface:     #F2EEE9;
    --ink-dark:    #EDE8E1;
    --ground-dark: #1A1714;
    --mid-dark:    #736E68;
    --surface-dark:#232019;
  }

  html { font-size: 16px; }

  body {
    background: var(--ground);
    color: var(--ink);
    font-family: 'Inter', system-ui, sans-serif;
    font-weight: 400;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Layout ── */
  .page-wrap {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  /* ── Global rule ── */
  .h-rule {
    border: none;
    border-top: 1px solid var(--rule);
    margin: 0;
  }

  /* ── Masthead ── */
  .masthead {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 0;
    border-bottom: 1px solid var(--rule);
  }
  .masthead-wordmark {
    font-family: 'Inter', sans-serif;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--mid);
  }
  .masthead-meta {
    font-size: 0.7rem;
    font-weight: 400;
    letter-spacing: 0.06em;
    color: var(--mid);
    font-variant-numeric: tabular-nums;
  }

  /* ── Hero ── */
  .hero {
    padding: 5rem 0 4rem;
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 0 4rem;
    align-items: start;
  }
  .hero-eyebrow {
    font-family: 'Inter', sans-serif;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 1.5rem;
  }
  .hero-headline {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(2.6rem, 5vw, 4.2rem);
    font-weight: 800;
    line-height: 1.08;
    letter-spacing: -0.02em;
    color: var(--ink);
    text-wrap: balance;
    margin-bottom: 1.75rem;
  }
  .hero-headline em {
    font-style: italic;
    color: var(--accent);
  }

  /* Hand-drawn SVG loop */
  .drawn-circle-wrapper {
    position: relative;
    display: inline-block;
    white-space: nowrap;
  }
  .drawn-circle-wrapper em {
    font-style: italic;
    position: relative;
    z-index: 2;
  }
  .drawn-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 105%;
    height: 140%;
    pointer-events: none;
    z-index: 1;
    overflow: visible;
  }
  .drawn-circle path {
    fill: none;
    stroke: var(--accent);
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 1500;
    stroke-dashoffset: 1500;
    animation: drawCircle 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: 0.5s;
  }

  @keyframes drawCircle {
    to {
      stroke-dashoffset: 0;
    }
  }

  .hero-rule {
    display: block;
    width: 80px;
    height: 2px;
    background: var(--accent);
    margin-bottom: 1.75rem;
    transition: transform 0.05s linear;
    will-change: transform;
  }
  .hero-lede {
    font-size: 1.05rem;
    font-weight: 300;
    line-height: 1.75;
    color: var(--ink);
    max-width: 58ch;
  }
  .hero-right {
    padding-top: 0.75rem;
    border-left: 1px solid var(--rule);
    padding-left: 2.5rem;
  }
  .hero-aside-label {
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--mid);
    margin-bottom: 1rem;
  }
  .hero-aside-stat {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 3rem;
    font-weight: 800;
    color: var(--ink);
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .hero-aside-desc {
    font-size: 0.8rem;
    color: var(--mid);
    margin-top: 0.4rem;
    line-height: 1.5;
    max-width: 22ch;
  }
  .hero-aside-divider {
    border: none;
    border-top: 1px solid var(--rule);
    margin: 1.5rem 0;
  }

  /* ── Metric cards ── */
  .metrics-section {
    padding: 3rem 0;
    border-top: 1px solid var(--rule);
    border-bottom: 1px solid var(--rule);
  }
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
  }
  .metric-card {
    padding: 2.25rem 2.5rem 2.25rem 0;
  }
  .metric-card + .metric-card {
    padding-left: 2.5rem;
    border-left: 1px solid var(--rule);
  }
  .metric-tag {
    display: inline-block;
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 1.1rem;
  }
  .metric-value {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 3.4rem;
    font-weight: 800;
    line-height: 1;
    color: var(--ink);
    font-variant-numeric: tabular-nums;
    margin-bottom: 0.5rem;
  }
  .metric-label {
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--ink);
    margin-bottom: 0.3rem;
  }
  .metric-context {
    font-size: 0.78rem;
    color: var(--mid);
    line-height: 1.5;
    margin-bottom: 1.25rem;
  }
  .metric-detail {
    font-size: 0.8rem;
    line-height: 1.65;
    color: var(--mid);
    border-top: 1px solid var(--rule);
    padding-top: 1rem;
  }

    /* ── Figures Section (Stacked with Open Corner Frame) ── */
    .figures-section {
      padding: 4rem 0 2rem;
    }

    .figures-grid {
      display: flex;
     flex-direction: column;
    gap: 4rem; /* Spacing between stacked figure cards */
    width: 100%;
    }

    .figure-card {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.5rem; /* Gap between image and frame lines */
    }

    /* Horizontal top & bottom lines (pulled inwards from edges to leave corners open) */
    .figure-card::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 1.25rem;
      right: 1.25rem;
      border-top: 1px solid var(--ink);
      border-bottom: 1px solid var(--ink);
      pointer-events: none;
    }

    /* Vertical left & right lines (pulled inwards from edges to leave corners open) */
    .figure-card::after {
      content: '';
      position: absolute;
      top: 1.25rem;
      bottom: 1.25rem;
      left: 0;
      right: 0;
      border-left: 1px solid var(--ink);
      border-right: 1px solid var(--ink);
      pointer-events: none;
    }

    .figure-img {
      width: 100%;
      height: auto;
      display: block;
      background: #ffffff;
    }

    .figure-caption {
      font-size: 0.78rem;
      color: var(--mid);
      margin-top: 1rem;
      text-align: center;
      line-height: 1.5;
      max-width: 65ch;
    }

  /* ── Findings ── */
  .findings-section {
    padding: 4rem 0;
  }
  .findings-header {
    display: flex;
    align-items: baseline;
    gap: 1.5rem;
    margin-bottom: 3rem;
  }
  .findings-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--ink);
  }
  .findings-subtitle {
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--mid);
  }

  .finding {
    display: grid;
    grid-template-columns: 3rem 1fr;
    gap: 0 2.5rem;
    padding: 2.5rem 0;
    border-top: 1px solid var(--rule);
  }
  .finding:last-child {
    border-bottom: 1px solid var(--rule);
  }
  .finding-index {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1rem;
    font-weight: 400;
    font-style: italic;
    color: var(--accent);
    padding-top: 0.2rem;
    user-select: none;
  }
  .finding-headline {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.2rem;
    font-weight: 600;
    line-height: 1.3;
    color: var(--ink);
    margin-bottom: 0.8rem;
    text-wrap: balance;
  }
  .finding-text {
    font-size: 0.9rem;
    line-height: 1.78;
    color: var(--mid);
    max-width: 70ch;
  }

  /* ── Footer ── */
  .footer {
    border-top: 1px solid var(--rule);
    padding: 2rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .footer-note {
    font-size: 0.7rem;
    color: var(--mid);
    line-height: 1.5;
    max-width: 55ch;
  }
  .footer-badge {
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--mid);
    white-space: nowrap;
  }

  /* ── Responsive ── */
  @media (max-width: 860px) {
    .hero {
      grid-template-columns: 1fr;
      gap: 3rem 0;
      padding: 3.5rem 0 3rem;
    }
    .hero-right {
      border-left: none;
      border-top: 1px solid var(--rule);
      padding-left: 0;
      padding-top: 2rem;
    }
    .metrics-grid {
      grid-template-columns: 1fr;
    }
    .metric-card + .metric-card {
      border-left: none;
      border-top: 1px solid var(--rule);
      padding-left: 0;
      padding-top: 2.25rem;
    }
    .metric-card {
      padding-right: 0;
    }
    .figures-grid {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }
  }

  @media (max-width: 540px) {
    .page-wrap { padding: 0 1.25rem; }
    .hero-headline { font-size: 2.2rem; }
    .metric-value { font-size: 2.6rem; }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-rule { transition: none !important; transform: none !important; }
  }
`}</style>

      <main>
        <div className="page-wrap">

          {/* ── Hero ── */}
          <section className="hero" ref={heroRef}>
            <div className="hero-left">
              <p className="hero-eyebrow"></p>
	      <h1 className="hero-headline">
            Venture capital funds<br />
            <span className="drawn-circle-wrapper">
              <em style={{ color: 'var(--ink)' }}>the science frontier,</em>

              {/* The SVG animation overlay */}
              <svg className="drawn-circle" viewBox="0 0 400 100" preserveAspectRatio="none">
                <path d="
                  M 5,82
                  Q 40,86 80,81
                  T 150,82
                  T 210,81
                  C 290,80 395,85 385,45
                  C 375,3 215,6 205,48
                  C 195,90 270,105 330,90
                " />
              </svg>
            </span>
            <br />
            not just the market.
          </h1>
              <span className="hero-rule" aria-hidden="true" />
              <p className="hero-lede">
                Is venture backing a positive force that drives innovation? By analyzing
                a 500k sample from 7.8 million USPTO patents, we found that
                venture-backed inventions are systematically more science-intensive,
                broader in claim scope, and more influential across technology
                domains than their non-VC counterparts.
              </p>
            </div>

            <aside className="hero-right">
              <p className="hero-aside-label">Dataset</p>
              <div className="hero-aside-stat">7.8M</div>
              <p className="hero-aside-desc">USPTO patents from 1976 - present analyzed against 500k cohort from 2000 - 2020</p>

              <hr className="hero-aside-divider" />

              <p className="hero-aside-label">Coverage</p>
              <div className="hero-aside-stat">50<span style={{ fontSize: '1.6rem' }}>yr</span></div>
              <p className="hero-aside-desc">of patent grant history matched to VC financing records</p>

              <hr className="hero-aside-divider" />

              <p className="hero-aside-label">Data sources</p>
              <p className="hero-aside-desc" style={{ color: 'var(--mid)' }}>
                USPTO PatentsView · SEC Form D filings · CPC classification records · NPL citation index
              </p>
            </aside>
          </section>

        </div>

        {/* ── Metric cards (full-width container, inner page-wrap) ── */}
        <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
          <div className="page-wrap">
            <div className="metrics-section" style={{ border: 'none', padding: '3rem 0' }}>
              <div className="metrics-grid">
                {metrics.map((m) => (
                  <article className="metric-card" key={m.id}>
                    <span className="metric-tag">{m.shortDef}</span>
                    <div className="metric-value">{m.value}</div>
                    <div className="metric-label">{m.label}</div>
                    <p className="metric-context">{m.context}</p>
                    <p className="metric-detail">{m.detail}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="page-wrap">

          {/* ── Figures Section ── */}
          <section className="figures-section">
            <div className="figures-grid">
              <figure className="figure-card">
                <img
                  src="/figure1.png"
                  alt="Mean Normalized Forward Citation Impact Across CPC Technology Sections"
                  className="figure-img"
                />
              </figure>

              <figure className="figure-card">
                <img
                  src="/figure4.png"
                  alt="Distribution of Total Claims by Funding"
                  className="figure-img"
                />
              </figure>
            </div>
          </section>




          {/* ── Findings ── */}
          <section className="findings-section">
            <div className="findings-header">
              <h2 className="findings-title">Key Findings</h2>
              <span className="findings-subtitle">Overview</span>
            </div>

            {findings.map((f) => (
              <article className="finding" key={f.index}>
                <div className="finding-index" aria-hidden="true">{f.index}</div>
                <div className="finding-body">
                  <h3 className="finding-headline">{f.headline}</h3>
                  <p className="finding-text">{f.body}</p>
                </div>
              </article>
            ))}
          </section>

          {/* ── Footer ── */}
          <footer className="footer">
            <p className="footer-note">
              Data: USPTO PatentsView full grant history · SEC EDGAR Form D filings ·
              NBER VC–patent match file. Analysis conducted in Python (DuckDB, pandas).
              All metrics reflect cohort averages; individual patent outcomes vary.
            </p>
            <span className="footer-badge">Seltzer · QSS 20 · 2026</span>
          </footer>

        </div>
      </main>
    </>
  )
}
