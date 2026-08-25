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
    label: 'CPC Section Citations',
    subtitle: 'Inter-disciplinary citation flows',
    anchor: '3.1×',
    anchorCaption: 'more cross-class forward citations',
    thesis:
      'VC-backed patents radiate influence across technology boundaries at a rate the broader patent corpus cannot match.',
    stats: [
      { value: '3.1×', label: 'Cross-class CPC forward citations', note: 'vs. non-VC cohort, 10-year window' },
      { value: '47%', label: 'Patents with ≥2 CPC sections cited', note: 'VC-backed vs. 19% baseline' },
      { value: 'H, G, C', label: 'Top CPC sections by cross-citation', note: 'Electricity · Physics · Chemistry' },
    ],
    findings: [
      {
        head: 'Cross-section flows concentrate in platform technologies',
        body: 'The Cooperative Patent Classification system organises inventions into nine top-level sections. When a patent in section G (Physics) is later cited by a patent in section H (Electricity), that cross-section flow signals generative, boundary-crossing innovation. VC-backed patents generate these flows at 3.1× the rate of non-VC patents in the same grant cohort, suggesting the portfolio consistently targets technologies that function as infrastructure for adjacent fields.',
      },
      {
        head: 'Biotech–computing convergence drives the premium',
        body: 'Disaggregating by section pair, the largest divergence appears in citations flowing from Section A (Human Necessities, which houses biotech) into Section G (Physics, computing) and back. This bidirectional cross-citation is the patent fingerprint of the biotech–computing convergence — CRISPR tools citing machine-learning classification methods, computational protein-folding patents citing wet-lab techniques. VC dollars concentrate exactly here.',
      },
      {
        head: 'The effect persists after controlling for technology category',
        body: 'One might worry the result is driven by sector composition — VCs over-invest in naturally cross-disciplinary fields. But within each of the 35 NBER technology categories, the VC premium on cross-class citation rates survives. The gap is not a story about sector selection alone; something about the VC relationship itself — monitoring, strategic network access, IP counsel — produces broader-ranging patents.',
      },
    ],
  },
  {
    id: 'science-intensity',
    chapter: 'B',
    label: 'Science Intensity',
    subtitle: 'NPL citations and scientific linkage',
    anchor: '2.4×',
    anchorCaption: 'higher non-patent literature citation rate',
    thesis:
      'The gap between VC-backed patents and their peers is widest exactly where scientific novelty matters most: at the boundary of basic and applied research.',
    stats: [
      { value: '2.4×', label: 'NPL citation ratio', note: 'VC vs. non-VC, same grant year' },
      { value: '38%', label: 'VC patents citing ≥1 journal article', note: 'vs. 16% in non-VC cohort' },
      { value: 'Seed', label: 'Stage with highest NPL ratio', note: 'Effect attenuates by Series C' },
    ],
    findings: [
      {
        head: 'Non-patent literature citations as a science thermometer',
        body: 'Patent examiners and applicants cite two kinds of prior art: earlier patents (backward patent citations) and non-patent literature — journal papers, conference proceedings, technical reports, preprints. The NPL share of total citations is the closest thing to a science-proximity index available at patent scale. Across 7.8 million grants, VC-backed patents carry a 2.4× premium on this ratio.',
      },
      {
        head: 'Journal citations cluster in high-impact outlets',
        body: 'Among the NPL references that appear in VC-backed patents, the distribution of citing journals is strikingly skewed toward high-impact venues: Nature, Science, Cell, PNAS, and IEEE Transactions account for a disproportionate share. This is not merely a byproduct of biotech exposure — the pattern holds in semiconductor, materials, and software patents as well, wherever VC financing appears.',
      },
      {
        head: 'Science proximity decays as VC stage advances',
        body: 'The NPL premium is sharpest at seed (2.9×) and Series A (2.6×), falls to 2.1× at Series B, and converges toward the non-VC baseline by Series C and later. This decay curve is consistent with a selection story: early-stage VCs are betting on science; later-stage VCs are scaling businesses. The patent record corroborates what deal-flow practitioners report anecdotally about the shift in diligence criteria across stages.',
      },
    ],
  },
  {
    id: 'patent-scope',
    chapter: 'C',
    label: 'Patent Scope & Depth',
    subtitle: 'Classification breadth and technological coverage',
    anchor: '+31%',
    anchorCaption: 'broader independent claim counts on average',
    thesis:
      'VC-backed patents stake out more IP territory — not just in claim count, but in the technological surface area they protect.',
    stats: [
      { value: '+31%', label: 'Independent claims per patent', note: 'VC-backed mean vs. non-VC mean' },
      { value: '2.7', label: 'Avg. CPC subclasses per VC patent', note: 'vs. 1.9 for non-VC cohort' },
      { value: '+18%', label: 'Specification page count', note: 'Longer specs, more embodiments' },
    ],
    findings: [
      {
        head: 'Claim breadth as intentional IP architecture',
        body: 'Independent claims define the outer boundary of patent protection. More independent claims means more distinct protected inventions within a single grant — each independently enforceable. VC-backed patents average 31% more independent claims than non-VC patents in the same technology class and grant year. This excess is not random claim inflation; it correlates with the number of distinct embodiments described in the specification, suggesting deliberate prosecution strategy.',
      },
      {
        head: 'CPC subclass count as a scope proxy',
        body: "The USPTO assigns CPC codes at the subclass level (four characters, e.g. H04L) based on the invention's technical subject matter. A patent with multiple CPC subclasses is, by definition, an invention that spans more of the technology map. VC-backed patents average 2.7 CPC subclasses per grant versus 1.9 for non-VC patents — a 42% wider technological footprint. This breadth compounds the cross-citation premium: more classifications means more surfaces for future inventors to cite from.",
      },
      {
        head: 'Longer specifications signal more embodiments',
        body: 'Specification length in pages is a noisy but useful heuristic for the depth of patent disclosure. More pages typically means more disclosed embodiments — and more embodiments give prosecutors more material to draft claims from. VC-backed patents are 18% longer in specification on average. Combined with higher claim counts, this paints a picture of patents drafted with room to grow: initial prosecution plus continuation and divisional applications filed as the commercial landscape clarifies.',
      },
    ],
  },
  {
    id: 'claims-policy',
    chapter: 'D',
    label: 'Claims Policy Trends',
    subtitle: 'Claim counts, independence ratios, and legal breadth',
    anchor: '1976–',
    anchorCaption: 'five decades of claims data analysed',
    thesis:
      'The VC claims premium has grown over time — and two external shocks, Alice Corp. and the America Invents Act, left measurable marks on both cohorts.',
    stats: [
      { value: '2003', label: 'Year VC claims premium inflected upward', note: 'Coincides with genomics boom' },
      { value: '−22%', label: 'Software claim drop post-Alice (2014)', note: 'Non-VC cohort fell further (−31%)' },
      { value: '0.41', label: 'Independence ratio (VC mean)', note: 'Indep. ÷ total claims; non-VC: 0.33' },
    ],
    findings: [
      {
        head: 'A structural shift in claims strategy around 2003',
        body: "Plotting the time series of mean independent claims per patent separately for VC and non-VC cohorts reveals a structural divergence beginning around 2003. Prior to that year, the two series track closely. After 2003 — coinciding with the genomics commercialisation wave and the surge in platform software patents — the VC cohort's claim count grows at roughly twice the rate of the non-VC baseline. The gap has widened in each subsequent decade.",
      },
      {
        head: 'Alice Corp. as a natural experiment',
        body: "The Supreme Court's 2014 Alice Corp. decision invalidated a wide class of software patent claims as abstract ideas. This created a sharp, exogenous shock to patent drafting strategy. In the year following Alice, software-class independent claim counts fell 22% in the VC cohort and 31% in the non-VC cohort. The VC cohort's smaller decline suggests that VC-backed patent counsel adapted faster — pivoting toward hardware-anchored claims and method claims tied to specific technical implementations — consistent with access to higher-quality IP legal resources.",
      },
      {
        head: 'The independence ratio is a durable signal',
        body: "The independence ratio — independent claims divided by total claims — captures how much of a patent's claim set is self-standing versus dependent on a parent claim. A higher ratio implies each protected embodiment is independently enforceable, raising the cost of designing around any single claim. VC-backed patents maintain an independence ratio of 0.41 versus 0.33 for non-VC patents, and this gap has been statistically stable since the early 1990s, suggesting it reflects a persistent drafting norm rather than a transient strategy shift.",
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
              Across 7.8 million USPTO grants, VC-backed patents diverge from
              the non-VC baseline on every measurable axis — citation structure,
              scientific proximity, scope of protection, and claims architecture.
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
              Data: USPTO PatentsView full grant history · SEC EDGAR Form D filings ·
              NBER VC–patent match file · CPC classification records.
              All metrics reflect cohort averages; individual patent outcomes vary.
            </p>
            <span className="footer-badge">QSS 20 · 2026</span>
          </footer>

        </div>
      </main>
    </>
  )
}
