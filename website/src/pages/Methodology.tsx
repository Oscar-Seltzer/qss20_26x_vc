// ─── Methodology page ─────────────────────────────────────────────────────────
// Inherits design system from Home / Findings:
// Colors: FAF8F5 ground · 181615 charcoal · C85A32 terracotta · 8C877E warm-grey · E8E3DC rule
// Type: Playfair Display (display) · Inter (body/data) · system monospace (equations/code)

import { useEffect, useRef, useState } from 'react'

const FONT_LINK =
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400&family=Inter:wght@300;400;500;600&display=swap'

// ─── Data ────────────────────────────────────────────────────────────────────

const pipelineSteps = [
  {
    step: '01',
    label: 'Cohort Extraction & Citation Networks',
    source: 'DuckDB · PatentsView Bulk Releases',
    detail:
      'DuckDB streams relational bulk tables (g_cpc_current, g_us_patent_citation encompassing >130M dyads, and g_other_reference) to extract a 500,000-patent sample granted between 2000 and 2020. Patent-level forward, backward, and NPL citation totals are calculated and exported as step1_metrics.parquet.',
  },
  {
    step: '02',
    label: 'Claims Matching & Parsing',
    source: 'PyArrow · patent_claims_stats.dta.zip',
    detail:
      'Historical claim-level records (tracking total claims, independent claim counts, and claim word lengths) are streamed from compressed Stata files in 5-million-row chunks via PyArrow, joined on unique patent identifiers, and exported as step2_claims.parquet.',
  },
  {
    step: '03',
    label: 'Master Normalization & Panel Assembly',
    source: 'DuckDB · patentvc_enhanced_4var.dta · cleaned_patent_panel.parquet',
    detail:
      'Step 1 and Step 2 datasets are merged with the Patent VC enhanced linkage panel (matching PitchBook/VentureSource rounds to grant numbers) and disambiguated corporate assignees. Raw citations are peer-normalized against 4-character CPC subclass × grant year peer groups.',
  },
]

const models = [
  {
    id: 'norm-citations',
    label: 'Peer-Normalized Forward Citation Index',
    tag: 'Formula 1',
    numerator: 'Raw Forward Citationsᵢ',
    denominator: 'E[Raw Forward Citations | CPC Subclassᵢ, Grant Yearᵢ]',
    resultSymbol: 'Normalized Citationsᵢ =',
    vars: [
      { sym: 'Raw Citationsᵢ', desc: 'Total forward patent citations accumulated by patent i' },
      { sym: 'E[· | Subclass, Year]', desc: 'Empirical mean forward citations of all patents in the same 4-character CPC subclass and grant year' },
      { sym: '1.0 Benchmark', desc: 'Represents exact parity with technology-class and vintage peer group' },
    ],
    note: 'Corrects for mechanical truncation artifacts from patent vintage and systemic velocity differences across sectors.',
  },
  {
    id: 'npl-ratio',
    label: 'Science Intensity Metric',
    tag: 'Formula 2',
    numerator: 'NPL Citationsᵢ',
    denominator: 'Backward Patent Citationsᵢ + NPL Citationsᵢ',
    resultSymbol: 'NPL Ratioᵢ =',
    vars: [
      { sym: 'NPL Citationsᵢ', desc: 'Number of non-patent literature references (academic journals, proceedings, preprints)' },
      { sym: 'Backward Citationsᵢ', desc: 'Count of citations to prior patent disclosures' },
      { sym: 'Bounded [0, 1]', desc: 'Proportion of prior art directly anchored in foundational scientific literature' },
    ],
    note: 'Captures proximity to open science and foundational research at the patent level.',
  },
  {
    id: 'welch-ttest',
    label: "Welch's Two-Sample t-Test Formulation",
    tag: 'Statistical Test',
    numerator: 'X̄_VC - X̄_NonVC',
    denominator: '√( (s²_VC / n_VC) + (s²_NonVC / n_NonVC) )',
    resultSymbol: 't =',
    vars: [
      { sym: 'X̄_VC, X̄_NonVC', desc: 'Sample group means for normalized citations, total claims, and NPL ratios' },
      { sym: 's², n', desc: 'Sample variances and cohort sizes (VC: n=9,536; Non-VC: n=490,464)' },
      { sym: 'Unequal Variance', desc: 'Does not assume equal variances, accommodating severe cohort sample size imbalance' },
    ],
    note: 'Degrees of freedom adjusted according to the Welch–Satterthwaite equation across all outcome comparisons.',
  },
]

const biasControls = [
  {
    id: 'truncation',
    chapter: 'i',
    label: 'Vintage & Classification Normalization',
    head: 'Peer benchmarking against subclass × grant-year cohorts',
    body: 'Older patents mechanically accumulate more citations than recent grants, and citation velocities differ substantially across fields. To prevent truncation and vintage bias from confounding results, forward citations are normalized relative to the empirical mean of patents within the exact same 4-character CPC subclass and grant year.',
    pills: ['Subclass Peer Mean', 'Grant-Year Matching', '1.0 Parity Index'],
  },
  {
    id: 'sample-balance',
    chapter: 'ii',
    label: 'Sample Imbalance & Skewness Corrections',
    head: 'Welch’s t-testing and logarithmic claim transformations',
    body: 'Because the VC cohort is small relative to the broader population (9,536 VC vs. 490,464 non-VC), standard t-tests risk bias. Therefore, Welch’s unequal-variance formulation is applied. Additionally, total claim counts exhibit extreme positive skewness, corrected using ln(Total Claims + 1).',
    pills: ['Welch’s t-Test', 'Logarithmic Claims ln(x+1)', 'Skewness Adjustment'],
  },
  {
    id: 'sector-heterogeneity',
    chapter: 'iii',
    label: 'Sector-Specific Disaggregation',
    head: 'CPC technology section partitioning (A–H)',
    body: 'Treating venture funding as a homogeneous treatment obscures domain differences. We evaluate outcomes partitioned across 6 major primary CPC sections (A, B, C, F, G, H), excluding Sections D (Textiles) and E (Fixed Constructions) due to insufficient VC observation counts.',
    pills: ['6 CPC Sections', 'DeepTech vs. HardTech', 'Sparse Class Exclusion'],
  },
  {
    id: 'limitations',
    chapter: 'iv',
    label: 'Identification & Selection Limitations',
    head: 'Associational nature and unobserved founder quality',
    body: 'Because venture capitalists actively select high-caliber founding teams who might produce superior IP regardless of funding, these estimates reflect associational relationships rather than causal effects. Future work requires round-level stages and more policy data.',
    pills: ['Associational Panel', 'Selection Effects', 'Firm-Age Unobservables'],
  },
]

const chapters = [
  { id: 'pipeline', chapter: '1', label: 'Data Streaming & ETL Pipeline' },
  { id: 'models', chapter: '2', label: 'Empirical Metrics & Formulas' },
  { id: 'bias', chapter: '3', label: 'Bias Adjustments & Robustness' },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function Methodology() {
  const [activeId, setActiveId] = useState<string>(chapters[0].id)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    chapters.forEach(({ id }) => {
      const el = sectionRefs.current[id]
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id) },
        { rootMargin: '-25% 0px -65% 0px', threshold: 0 },
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

        /* ── Layout ── */
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

        /* ── Body layout ── */
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
        .nav-item.active .nav-chapter { color: var(--accent); }
        .nav-item.active .nav-text { color: var(--ink); }
        .nav-item:hover .nav-text { color: var(--ink); }
        .nav-item:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }

        /* ── Content column ── */
        .content { min-width: 0; }

        /* ── Section wrapper ── */
        .method-section {
          padding-top: 3.5rem;
          scroll-margin-top: 2rem;
        }
        .method-section + .method-section {
          border-top: 2px solid var(--rule);
          margin-top: 3.5rem;
        }

        /* ── Section eyebrow ── */
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
          margin-bottom: 0.75rem;
          text-wrap: balance;
        }
        .section-intro {
          font-size: 0.88rem;
          font-weight: 300;
          color: var(--mid);
          max-width: 64ch;
          line-height: 1.75;
          margin-bottom: 2.5rem;
        }

        /* ── PIPELINE ── */
        .pipeline {
          display: flex;
          flex-direction: column;
          gap: 0;
          position: relative;
        }
        .pipeline::before {
          content: '';
          position: absolute;
          left: 1.05rem;
          top: 1.1rem;
          bottom: 1.1rem;
          width: 1px;
          background: var(--rule);
          z-index: 0;
        }

        .pipeline-step {
          display: grid;
          grid-template-columns: 2.1rem 1fr;
          gap: 0 1.5rem;
          padding: 0 0 2.25rem;
          position: relative;
          z-index: 1;
        }
        .pipeline-step:last-child { padding-bottom: 0; }

        .step-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
          padding-top: 0.15rem;
        }
        .step-dot {
          width: 0.7rem;
          height: 0.7rem;
          border-radius: 50%;
          background: var(--accent);
          flex-shrink: 0;
        }
        .step-num {
          font-size: 0.58rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--mid);
          font-variant-numeric: tabular-nums;
        }

        .step-body {
          border: 1px solid var(--rule);
          background: var(--surface);
          padding: 1.25rem 1.5rem;
        }
        .step-label {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1rem;
          font-weight: 600;
          color: var(--ink);
          margin-bottom: 0.3rem;
          line-height: 1.3;
        }
        .step-source {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 0.75rem;
        }
        .step-detail {
          font-size: 0.83rem;
          line-height: 1.75;
          color: var(--mid);
        }

        /* ── EQUATIONS / METRICS (Stacked Fraction Styling) ── */
        .model-cards {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .model-card {
          border: 1px solid var(--rule);
        }
        .model-card-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--rule);
          background: var(--surface);
        }
        .model-card-label {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1rem;
          font-weight: 600;
          color: var(--ink);
        }
        .model-card-tag {
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--accent);
          white-space: nowrap;
        }

        .equation-block {
          padding: 1.5rem;
          border-bottom: 1px solid var(--rule);
          border-left: 3px solid var(--accent);
          background: var(--ground);
          overflow-x: auto;
        }

        /* Stacked fraction layout */
        .equation-display {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 1.05rem;
          font-style: italic;
          color: var(--ink);
        }
        .eq-lhs {
          white-space: nowrap;
        }
        .fraction {
          display: inline-flex;
          flex-direction: column;
          vertical-align: middle;
          text-align: center;
        }
        .numerator {
          padding: 0 0.25rem 0.3rem 0.25rem;
          border-bottom: 1px solid var(--ink);
          font-size: 0.95rem;
        }
        .denominator {
          padding: 0.3rem 0.25rem 0 0.25rem;
          font-size: 0.95rem;
        }

        .var-table {
          padding: 1rem 1.5rem;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 0;
          border-bottom: 1px solid var(--rule);
        }
        .var-row {
          display: contents;
        }
        .var-sym {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-style: italic;
          font-size: 0.83rem;
          color: var(--accent);
          padding: 0.45rem 1.5rem 0.45rem 0;
          white-space: nowrap;
          border-bottom: 1px solid var(--rule);
          font-variant-numeric: tabular-nums;
        }
        .var-sym:last-of-type,
        .var-desc:last-of-type { border-bottom: none; }
        .var-desc {
          font-size: 0.8rem;
          line-height: 1.6;
          color: var(--mid);
          padding: 0.45rem 0;
          border-bottom: 1px solid var(--rule);
        }
        .model-note {
          padding: 0.85rem 1.5rem;
          font-size: 0.72rem;
          color: var(--mid);
          font-style: italic;
          line-height: 1.5;
        }

        /* ── BIAS CONTROLS ── */
        .bias-entries {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .bias-entry {
          padding: 2rem 0;
          border-top: 1px solid var(--rule);
          display: grid;
          grid-template-columns: 2rem 1fr;
          gap: 0 1.5rem;
        }
        .bias-entry:last-child { border-bottom: 1px solid var(--rule); }
        .bias-chapter {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 0.8rem;
          font-style: italic;
          color: var(--accent);
          padding-top: 0.15rem;
        }
        .bias-body {}
        .bias-head {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.05rem;
          font-weight: 600;
          line-height: 1.3;
          color: var(--ink);
          margin-bottom: 0.65rem;
          text-wrap: balance;
        }
        .bias-text {
          font-size: 0.88rem;
          line-height: 1.8;
          color: var(--mid);
          max-width: 68ch;
          margin-bottom: 1rem;
        }
        .pill-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .pill {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--accent);
          border: 1px solid var(--rule);
          padding: 0.2rem 0.6rem;
          background: var(--surface);
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
          .model-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }
          .var-table { grid-template-columns: 1fr; }
          .var-sym { border-bottom: none; padding-bottom: 0; }
          .var-desc { border-bottom: 1px solid var(--rule); padding-top: 0; }
        }
        @media (max-width: 540px) {
          .page-wrap { padding: 0 1.25rem; }
          .section-title { font-size: 1.45rem; }
          .pipeline::before { left: 0.85rem; }
          .bias-entry { grid-template-columns: 1.5rem 1fr; gap: 0 1rem; }
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
              <span className="masthead-page">Methodology</span>
            </div>
            <span className="masthead-meta">QSS 20 · Dartmouth · 2026</span>
          </header>

          {/* ── Page header ── */}
          <div className="page-header">
            <p className="page-header-eyebrow">Empirical framework</p>
            <h1 className="page-header-title">Data pipeline, metrics,<br />and statistical testing</h1>
            <p className="page-header-desc">
              How 500,000 USPTO patent records were extracted, processed via DuckDB and PyArrow streaming,
              peer-normalized against technology cohorts, and evaluated using Welch's t-tests and kernel density estimation.
            </p>
          </div>

          {/* ── Body ── */}
          <div className="body-layout">

            {/* Sidebar nav */}
            <nav className="sidebar" aria-label="Methodology navigation">
              <p className="sidebar-label">Sections</p>
              {chapters.map((c) => (
                <button
                  key={c.id}
                  className={`nav-item${activeId === c.id ? ' active' : ''}`}
                  onClick={() => scrollTo(c.id)}
                  aria-current={activeId === c.id ? 'location' : undefined}
                >
                  <span className="nav-chapter">{c.chapter}</span>
                  <span className="nav-text">{c.label}</span>
                </button>
              ))}
            </nav>

            {/* Content */}
            <div className="content">

              {/* ── Section 1: Pipeline ── */}
              <section
                id="pipeline"
                className="method-section"
                ref={(el) => { sectionRefs.current['pipeline'] = el }}
              >
                <div className="section-eyebrow">
                  <span className="section-chapter">1</span>
                  <span className="section-label-text">Data Streaming &amp; ETL Pipeline</span>
                  <div className="section-eyebrow-rule" aria-hidden="true" />
                </div>
                <h2 className="section-title">Vectorized ETL and master panel assembly</h2>
                <p className="section-intro">
                  To process hundreds of millions of relational records without compute bottlenecks,
                  the pipeline executes in three streaming stages using DuckDB's vectorized OLAP engine
                  and PyArrow chunked conversions.
                </p>

                <div className="pipeline" role="list">
                  {pipelineSteps.map((s) => (
                    <div className="pipeline-step" role="listitem" key={s.step}>
                      <div className="step-node" aria-hidden="true">
                        <div className="step-dot" />
                        <div className="step-num">{s.step}</div>
                      </div>
                      <div className="step-body">
                        <div className="step-label">{s.label}</div>
                        <div className="step-source">{s.source}</div>
                        <p className="step-detail">{s.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Section 2: Models ── */}
              <section
                id="models"
                className="method-section"
                ref={(el) => { sectionRefs.current['models'] = el }}
              >
                <div className="section-eyebrow">
                  <span className="section-chapter">2</span>
                  <span className="section-label-text">Empirical Metrics &amp; Formulas</span>
                  <div className="section-eyebrow-rule" aria-hidden="true" />
                </div>
                <h2 className="section-title">Formulas and hypothesis testing</h2>
                <p className="section-intro">
                  Patents are evaluated across three primary outcome dimensions: peer-normalized forward citation impact,
                  academic science intensity (NPL ratio), and claim-based legal defensibility compared via Welch's t-tests.
                </p>

                <div className="model-cards">
                  {models.map((m) => (
                    <div className="model-card" key={m.id}>
                      <div className="model-card-header">
                        <span className="model-card-label">{m.label}</span>
                        <span className="model-card-tag">{m.tag}</span>
                      </div>

                      {/* Stacked Equation Block */}
                      <div className="equation-block">
                        <div className="equation-display">
                          <span className="eq-lhs">{m.resultSymbol}</span>
                          <div className="fraction">
                            <span className="numerator">{m.numerator}</span>
                            <span className="denominator">{m.denominator}</span>
                          </div>
                        </div>
                      </div>

                      {/* Variable legend */}
                      <div className="var-table" role="table" aria-label="Variable definitions">
                        {m.vars.map((v) => (
                          <div className="var-row" role="row" key={v.sym}>
                            <div className="var-sym" role="cell">{v.sym}</div>
                            <div className="var-desc" role="cell">{v.desc}</div>
                          </div>
                        ))}
                      </div>

                      <div className="model-note">{m.note}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Section 3: Bias controls ── */}
              <section
                id="bias"
                className="method-section"
                ref={(el) => { sectionRefs.current['bias'] = el }}
              >
                <div className="section-eyebrow">
                  <span className="section-chapter">3</span>
                  <span className="section-label-text">Bias Adjustments &amp; Robustness</span>
                  <div className="section-eyebrow-rule" aria-hidden="true" />
                </div>
                <h2 className="section-title">Threats to validity, controls, and limitations</h2>
                <p className="section-intro">
                  Methodological adjustments to address vintage truncation, cohort sample size variance,
                  positive claim count skewness, and the associational nature of venture selection.
                </p>

                <div className="bias-entries">
                  {biasControls.map((b) => (
                    <article className="bias-entry" key={b.id}>
                      <div className="bias-chapter" aria-hidden="true">{b.chapter}</div>
                      <div className="bias-body">
                        <h3 className="bias-head">{b.head}</h3>
                        <p className="bias-text">{b.body}</p>
                        <div className="pill-row" aria-label="Controls applied">
                          {b.pills.map((p) => (
                            <span className="pill" key={p}>{p}</span>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

            </div>
          </div>

          {/* ── Footer ── */}
          <footer className="footer">
            <p className="footer-note">
              Data: USPTO PatentsView Bulk Releases · Patent VC Enhanced Linkage Panel ·
              USPTO Patent Claims Statistics. Pipeline implemented in DuckDB and PyArrow.
            </p>
            <span className="footer-badge">QSS 20 · 2026</span>
          </footer>

        </div>
      </main>
    </>
  )
}