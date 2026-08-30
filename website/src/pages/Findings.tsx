// ─── Findings page ───────────────────────────────────────────────────────────
// Inherits the full design system from Home.tsx:
// Colors: FAF8F5 ground · 181615 charcoal · C85A32 terracotta · 8C877E warm-grey · E8E3DC rule
// Type: Playfair Display (display) · Inter (body/data)

import { useEffect, useRef, useState } from 'react'

const FONT_LINK =
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400&family=Inter:wght@300;400;500;600&display=swap'

// ─── Data ────────────────────────────────────────────────────────────────────

const sections = [
  {
    id: 'cpc-citations',
    chapter: 'A',
    label: 'Sector-Specific Citation Impact',
    subtitle: 'Peer-normalized forward citations across CPC sections',
    anchor: '2.03×',
    anchorCaption: 'peer-normalized forward citations',
    thesis:
      'VC-backed patents generate high citation multiples in frontier fields like DeepTech, but offer no measurable advantage in mature engineering sectors.',
    stats: [
      { value: '2.03', label: 'Normalized citations (VC)', note: 'vs. 0.98 baseline (p=0.014)' },
      { value: '2.68×', label: 'Electricity (Section H)', note: 'Highest sector premium' },
      { value: '0.76×', label: 'Mechanical Eng. (Section F)', note: 'Underperforms baseline' },
    ],
    figure: {
      src: '/figure1.png',
      alt: 'Figure 1: Mean Normalized Forward Citation Impact Across CPC Technology Sections',
    },
    findings: [
      {
        head: 'Venture capital accelerates frontier technologies',
        body: 'Across the 500,000-patent sample, VC-backed patents receive more than double the peer-normalized forward citations of non-VC patents (2.03 vs. 0.98). Since citations are standardized against 4-character CPC subclass and grant-year peer groups, this difference represents a true advantage rather than a byproduct of faster-moving technology categories.',
      },
      {
        head: 'The DeepTech multiplier',
        body: 'The venture-backing premium is not uniform. Instead, it is heavily concentrated in DeepTech, hardware, and computational fields. In Electricity (Section H) and Physics & Computing (Section G), VC-backed patents achieve 2.68× and 2.34× their peer-group citation benchmarks, respectively. In these frontier sectors, risk-tolerant equity perfectly aligns with longer development cycles.',
      },
      {
        head: 'Incumbency in mature sectors',
        body: 'In traditional industrial categories like Operations & Transport (Section B) and Mechanical Engineering (Section F), VC-backed inventions underperform the 1.0 parity benchmark. This suggests that in more mature engineering sectors driven by supply chains and manufacturing optimizations, venture capital provides no inherent innovation advantage over corporate incumbents.',
      },
    ],
  },
  {
    id: 'science-intensity',
    chapter: 'B',
    label: 'Science Intensity',
    subtitle: 'Non-patent literature (NPL) and academic proximity',
    anchor: '44.6%',
    anchorCaption: 'non-patent literature ratio',
    thesis:
      'Venture-funded technologies build more substantially on academic literature and scientific discoveries than their non-VC peers.',
    stats: [
      { value: '44.6%', label: 'VC NPL Ratio', note: 'vs. 36.9% non-VC (p=0.0047)' },
      { value: '0.2-0.9', label: 'VC NPL Distribution', note: 'Sustained density across high values' },
      { value: 'Zero', label: 'Non-VC Concentration', note: 'Baseline clusters heavily near zero' },
    ],
    figure: {
      src: '/figure2a.png',
      alt: 'Figure 2: Empirical Distribution of Science Intensity',
    },
    findings: [
      {
        head: 'A higher reliance on scientific research',
        body: 'Science intensity is captured via the Non-Patent Literature (NPL) ratio, reflecting the proportion of preceding technology grounded in academic literature and scientific papers rather than existing patent disclosures. VC-backed patents exhibit a statistically significant premium, carrying a 44.6% NPL ratio compared to 36.9% for non-VC patents.',
      },
      {
        head: 'Sustained proximity to open science',
        body: 'Kernel density estimates of the NPL ratio demonstrate a distributional difference. While non-VC patents cluster heavily near zero, indicating little to no academic grounding, VC-backed patents show a relatively uniform density across the 0.2 to 0.9 range.',
      },
      {
        head: 'Scientific anchoring as a defensive strategy',
        body: 'This sustained proximity to open scientific research suggests a specific commercial strategy. This is due to the fact that anchoring claims in peer-reviewed scientific literature provides venture-backed startups with increased protection against prior-art invalidation during post-grant review and infringement proceedings.',
      },
    ],
  },
  {
    id: 'policy-trends',
    chapter: 'C',
    label: 'Policy Responsiveness',
    subtitle: 'Adaptability to the America Invents Act',
    anchor: '2011',
    anchorCaption: 'AIA reform enactment',
    thesis:
      'VC-backed firms are highly sensitive to policy reform, rapidly adapting drafting strategies to lock in defensible IP while non-VC filers remain static.',
    stats: [
      { value: '15.6', label: 'VC Claims (2011)', note: 'Compression during AIA enactment' },
      { value: '23.4', label: 'VC Claims (2014)', note: 'Aggressive post-reform expansion' },
      { value: 'Flat', label: 'Non-VC trend', note: 'Remained at 14-15 claims throughout' },
    ],
    figure: {
      src: '/figure3.png',
      alt: 'Figure 3: Distribution of Total Claims by Funding Status',
    },
    findings: [
      {
        head: 'The America Invents Act as a catalyst',
        body: 'Examining claim drafting around the 2011 Leahy-Smith America Invents Act (AIA) shows a divergence in cohort behavior. The transition to a first-inventor-to-file regime served as an external shock to the patent system, testing the adaptability of various filing entities.',
      },
      {
        head: 'Rapid adaptation vs. a static baseline',
        body: 'Non-VC filers exhibited minimal to no change in behavior, with average claim counts remaining flat between 14 and 15 from 2008 through 2014. In contrast, VC-backed claims sank to 15.6 in the 2011 reform year before surging rapidly to 20.5 in 2012 and reaching a series high of 23.4 by 2014.',
      },
      {
        head: 'Reevaluating reform outcomes',
        body: 'This high degree of responsiveness suggests that venture-backed companies possess the legal resources and deep-set strategies to adapt to procedural reforms. Consequently, reforms like the AIA may inadvertently increase the defensive moats of well-capitalized firms while failing to alter the trajectory of general inventors, potentially limiting broader innovation through competition.',
      },
    ],
  },
  {
    id: 'patent-scope',
    chapter: 'D',
    label: 'Legal Scope & Defensibility',
    subtitle: 'Claim counts and IP moats',
    anchor: '22.2',
    anchorCaption: 'average claims per VC patent',
    thesis:
      'Venture-backed startups construct broader claim trees to maximize defensive moats against incumbent litigation.',
    stats: [
      { value: '22.2', label: 'Mean claims (VC)', note: 'vs. 16.0 non-VC (p<10⁻¹⁸⁵)' },
      { value: '19', label: 'Median claims (VC)', note: 'Interquartile range: 11-29' },
      { value: '14', label: 'Median claims (Non-VC)', note: 'Interquartile range: 8-21' },
    ],
    figure: {
      src: '/figure4.png',
      alt: 'Figure 4: Claim Count Before and After 2011 Policy Reform',
    },
    findings: [
      {
        head: 'Broader legal defensibility',
        body: 'Legal defensibility is heavily dictated by total claim counts. VC-backed patents are substantially broader, averaging 22.2 claims compared to 16.0 for the non-VC baseline. This difference indicates that VC-backed patents are more defensively drafted and significantly more resource-intensive to prosecute and likely to initially formulate as well requiring more funds.',
      },
      {
        head: 'An upward shift across all quartiles',
        body: 'The distribution of total claims shows an upward shift for venture-backed IP. The median VC-backed patent contains 19 claims (with an interquartile range of 11-29), separating from the non-VC median of 14 claims (IQR: 8-21) even when suppressing outliers.',
      },
      {
        head: 'Constructing the IP moat',
        body: 'This elevated claim count represents intentional legal architecture. By maximizing the number of claims, venture-backed startups raise the cost and complexity of designing around their intellectual property, locking in more defensible commercial territory for future development and M&A exits.',
      },
    ],
  },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function Findings() {
  const [activeId, setActiveId] = useState<string>(sections[0].id)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  // Intersection observer — highlight the sidebar nav as user scrolls
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    sections.forEach(({ id }) => {
      const el = sectionRefs.current[id]
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id) },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href={FONT_LINK} rel="stylesheet" />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --ground:   #FAF8F5;
          --ink:      #181615;
          --accent:   #228B22;
          --mid:      #8C877E;
          --rule:     #E8E3DC;
          --surface:  #F2EEE9;
        }

        html { font-size: 16px; scroll-behavior: smooth; }
        body {
          background: var(--ground);
          color: var(--ink);
          font-family: 'Inter', system-ui, sans-serif;
          font-weight: 400;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }

        /* ── Shared layout ── */
        .page-wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* ── Masthead ── */
        .masthead {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 0;
          border-bottom: 1px solid var(--rule);
        }
        .masthead-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .masthead-wordmark {
          font-family: 'Inter', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--mid);
          text-decoration: none;
        }
        .masthead-wordmark:hover { color: var(--ink); }
        .masthead-sep {
          width: 1px;
          height: 1rem;
          background: var(--rule);
        }
        .masthead-page {
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink);
        }
        .masthead-meta {
          font-size: 0.7rem;
          color: var(--mid);
          letter-spacing: 0.06em;
          font-variant-numeric: tabular-nums;
        }

        /* ── Page header ── */
        .page-header {
          padding: 3.5rem 0 3rem;
          border-bottom: 1px solid var(--rule);
        }
        .page-header-eyebrow {
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 1rem;
        }
        .page-header-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: var(--ink);
          text-wrap: balance;
          margin-bottom: 1rem;
        }
        .page-header-desc {
          font-size: 0.95rem;
          font-weight: 300;
          color: var(--mid);
          max-width: 62ch;
          line-height: 1.7;
        }

        /* ── Body layout: sidebar + content ── */
        .body-layout {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 0 4rem;
          align-items: start;
          padding: 3rem 0 5rem;
        }

        /* ── Sidebar nav ── */
        .sidebar {
          position: sticky;
          top: 2rem;
        }
        .sidebar-label {
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--mid);
          margin-bottom: 1.25rem;
        }
        .nav-item {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
          padding: 0.55rem 0;
          border-top: 1px solid var(--rule);
          cursor: pointer;
          background: none;
          border-left: none;
          border-right: none;
          border-bottom: none;
          width: 100%;
          text-align: left;
          transition: none;
        }
        .nav-item:last-child { border-bottom: 1px solid var(--rule); }
        .nav-chapter {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 0.7rem;
          font-style: italic;
          color: var(--mid);
          min-width: 0.75rem;
          transition: color 0.15s;
        }
        .nav-text {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--mid);
          line-height: 1.4;
          transition: color 0.15s;
        }
        .nav-item.active .nav-chapter,
        .nav-item.active .nav-text {
          color: var(--ink);
        }
        .nav-item.active .nav-chapter {
          color: var(--accent);
        }
        .nav-item:hover .nav-text { color: var(--ink); }
        .nav-item:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }

        /* ── Content column ── */
        .content { min-width: 0; }

        /* ── Finding section ── */
        .finding-section {
          padding-top: 3.5rem;
          scroll-margin-top: 2rem;
        }
        .finding-section + .finding-section {
          border-top: 2px solid var(--rule);
          margin-top: 3.5rem;
        }

        .section-eyebrow {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .section-chapter {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 0.8rem;
          font-style: italic;
          color: var(--accent);
        }
        .section-label-text {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--mid);
        }
        .section-eyebrow-rule {
          flex: 1;
          height: 1px;
          background: var(--rule);
        }

        .section-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.5rem, 2.8vw, 2.1rem);
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.015em;
          color: var(--ink);
          margin-bottom: 0.5rem;
          text-wrap: balance;
        }
        .section-subtitle {
          font-size: 0.8rem;
          color: var(--mid);
          font-weight: 400;
          margin-bottom: 1.5rem;
        }
        .section-thesis {
          font-size: 1rem;
          font-weight: 300;
          font-style: italic;
          line-height: 1.7;
          color: var(--ink);
          border-left: 2px solid var(--accent);
          padding-left: 1.25rem;
          margin-bottom: 2.5rem;
          max-width: 60ch;
        }

        /* ── Stat row ── */
        .stat-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          border: 1px solid var(--rule);
          margin-bottom: 2.5rem;
          background: var(--surface);
        }
        .stat-cell {
          padding: 1.5rem 1.75rem;
        }
        .stat-cell + .stat-cell {
          border-left: 1px solid var(--rule);
        }
        .stat-value {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 2rem;
          font-weight: 800;
          line-height: 1;
          color: var(--ink);
          font-variant-numeric: tabular-nums;
          margin-bottom: 0.35rem;
        }
        .stat-label {
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--ink);
          margin-bottom: 0.2rem;
        }
        .stat-note {
          font-size: 0.68rem;
          color: var(--mid);
          line-height: 1.4;
        }

        /* ── Figures (Boxed Framing like Home.tsx) ── */
        .figure-container {
          margin: 3rem 0;
          border-top: 1px solid var(--ink);
          border-bottom: 1px solid var(--ink);
          padding: 1.25rem 0;
          background: transparent;
        }
        .figure-inner-box {
          border-left: 1px solid var(--ink);
          border-right: 1px solid var(--ink);
          padding: 1.75rem 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          background: transparent;
        }
        .figure-img {
          width: 100%;
          max-width: 100%;
          height: auto;
          display: block;
          object-fit: contain;
        }

        /* ── Finding entries ── */
        .finding-entries { display: flex; flex-direction: column; gap: 0; }
        .finding-entry {
          padding: 2rem 0;
          border-top: 1px solid var(--rule);
        }
        .finding-entry:last-child { border-bottom: 1px solid var(--rule); }
        .finding-head {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.05rem;
          font-weight: 600;
          line-height: 1.3;
          color: var(--ink);
          margin-bottom: 0.65rem;
          text-wrap: balance;
        }
        .finding-body {
          font-size: 0.88rem;
          line-height: 1.8;
          color: var(--mid);
          max-width: 68ch;
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
        @media (max-width: 800px) {
          .body-layout {
            grid-template-columns: 1fr;
            gap: 2rem 0;
          }
          .sidebar {
            position: static;
            display: flex;
            flex-wrap: wrap;
            gap: 0;
            border-top: 1px solid var(--rule);
            border-bottom: 1px solid var(--rule);
            padding: 0.5rem 0;
          }
          .sidebar-label { display: none; }
          .nav-item {
            border: none;
            padding: 0.5rem 1rem 0.5rem 0;
          }
          .nav-item:last-child { border: none; }
          .stat-row { grid-template-columns: 1fr; }
          .stat-cell + .stat-cell { border-left: none; border-top: 1px solid var(--rule); }
          .figure-inner-box { padding: 1rem 0.75rem; }
        }
        @media (max-width: 480px) {
          .page-wrap { padding: 0 1.25rem; }
          .section-title { font-size: 1.5rem; }
          .stat-value { font-size: 1.6rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
        }
      `}</style>

      <main>
        <div className="page-wrap">

          {/* ── Masthead ── */}
          <header className="masthead">
            <div className="masthead-left">
              <a href="/" className="masthead-wordmark">VC &amp; Patent Research</a>
              <div className="masthead-sep" aria-hidden="true" />
              <span className="masthead-page">Empirical Findings</span>
            </div>
            <span className="masthead-meta">QSS 20 · Dartmouth · 2026</span>
          </header>

          {/* ── Page header ── */}
          <div className="page-header">
            <p className="page-header-eyebrow">Four empirical dimensions</p>
            <h1 className="page-header-title">What the patent record reveals<br />about venture-backed innovation</h1>
            <p className="page-header-desc">
              Across 500,000 U.S. patents granted between 2000 and 2020[cite: 1], VC-backed patents diverge from
              the non-VC baseline on every measurable axis — citation impact,
              scientific proximity, legal scope, and responsiveness to policy reform[cite: 1].
              These pages present the four core findings in detail.
            </p>
          </div>

          {/* ── Body: sidebar + sections ── */}
          <div className="body-layout">

            {/* Sidebar nav */}
            <nav className="sidebar" aria-label="Findings navigation">
              <p className="sidebar-label">Sections</p>
              {sections.map((s) => (
                <button
                  key={s.id}
                  className={`nav-item${activeId === s.id ? ' active' : ''}`}
                  onClick={() => scrollTo(s.id)}
                  aria-current={activeId === s.id ? 'location' : undefined}
                >
                  <span className="nav-chapter">{s.chapter}</span>
                  <span className="nav-text">{s.label}</span>
                </button>
              ))}
            </nav>

            {/* Content */}
            <div className="content">
              {sections.map((s) => (
                <section
                  key={s.id}
                  id={s.id}
                  className="finding-section"
                  ref={(el) => { sectionRefs.current[s.id] = el }}
                >
                  {/* Section eyebrow */}
                  <div className="section-eyebrow">
                    <span className="section-chapter">{s.chapter}</span>
                    <span className="section-label-text">{s.label}</span>
                    <div className="section-eyebrow-rule" aria-hidden="true" />
                  </div>

                  {/* Title + thesis */}
                  <h2 className="section-title">{s.subtitle}</h2>
                  <p className="section-subtitle">{s.label}</p>
                  <blockquote className="section-thesis">{s.thesis}</blockquote>

                  {/* Stat row */}
                  <div className="stat-row" role="list">
                    {s.stats.map((st) => (
                      <div className="stat-cell" role="listitem" key={st.label}>
                        <div className="stat-value">{st.value}</div>
                        <div className="stat-label">{st.label}</div>
                        <div className="stat-note">{st.note}</div>
                      </div>
                    ))}
                  </div>

                  {/* Figure Box */}
                  {s.figure && (
                    <div className="figure-container">
                      <div className="figure-inner-box">
                        <img
                          src={s.figure.src}
                          alt={s.figure.alt}
                          className="figure-img"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}

                  {/* Findings */}
                  <div className="finding-entries">
                    {s.findings.map((f) => (
                      <article className="finding-entry" key={f.head}>
                        <h3 className="finding-head">{f.head}</h3>
                        <p className="finding-body">{f.body}</p>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>

          </div>

          {/* ── Footer ── */}
          <footer className="footer">
            <p className="footer-note">
              Data: 500,000 U.S. patents sampled from 2000-2020 via USPTO Bulk Releases[cite: 1] ·
              Matched to PitchBook and VentureSource institutional financing rounds[cite: 1].
              All comparisons utilize Welch's unequal variance formulation[cite: 1].
            </p>
            <span className="footer-badge">QSS 20 · 2026</span>
          </footer>

        </div>
      </main>
    </>
  )
}