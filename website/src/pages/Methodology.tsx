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
    label: 'VC Financing Records',
    source: 'PitchBook · Crunchbase · SEC Form D',
    detail:
      'Company-level investment events are drawn from PitchBook and Crunchbase, supplemented with SEC EDGAR Form D filings (exempt offering notices) as an independent verification source. Each record is standardised to a canonical company name, CIK identifier, and deal close date.',
  },
  {
    step: '02',
    label: 'Company → Patent Assignee Match',
    source: 'USPTO PatentsView disambiguated assignee table',
    detail:
      'VC-backed companies are matched to USPTO assignee records using the PatentsView disambiguated assignee table (g_assignee_disambiguated.tsv). Matching proceeds in priority order: exact CIK match via SEC cross-reference, then fuzzy organisation-name matching with a Jaro-Winkler threshold of 0.92, then manual review for the 340 highest-value ambiguous cases.',
  },
  {
    step: '03',
    label: 'Patent-Level Feature Extraction',
    source: 'PatentsView · USPTO CPC · g_us_patent_citation',
    detail:
      'For each matched patent, we extract: grant date, application date, all CPC codes (g_cpc_current.tsv), backward patent citations (g_us_patent_citation.tsv), non-patent literature references (g_other_reference.tsv), and claim statistics from the patent_claims_stats dataset. All joins are keyed on patent_id (VARCHAR) to prevent silent integer-overflow mismatches.',
  },
  {
    step: '04',
    label: 'VC Flag & Cohort Assignment',
    source: 'Deal date × patent application date',
    detail:
      'A patent is flagged VC-backed (VC = 1) if its assignee company received at least one venture financing round whose close date precedes the patent application date. This preserves temporal causality: only capital that could have influenced the invention is counted. Patents with multiple assignees where ≥1 is VC-backed are included in the VC cohort.',
  },
  {
    step: '05',
    label: 'Master Panel Construction',
    source: 'DuckDB merge · cleaned_patent_panel.csv',
    detail:
      'All tables are merged in DuckDB into a master panel of 7,842,115 patent-level observations spanning 1976–2024. The final panel includes the VC flag, all citation metrics, CPC classification features, claim statistics, assignee type, and grant-year and technology-class fixed-effect keys.',
  },
]

const models = [
  {
    id: 'ols-baseline',
    label: 'OLS Baseline',
    tag: 'Specification 1',
    equation: 'y_{it} = α + β·VC_{it} + γ·X_{it} + ε_{it}',
    vars: [
      { sym: 'y_{it}', desc: 'Outcome for patent i granted in year t (NPL ratio, claim count, cross-CPC indicator)' },
      { sym: 'VC_{it}', desc: 'Binary indicator: 1 if patent assignee received VC financing before application date' },
      { sym: 'X_{it}', desc: 'Patent-level controls: log(backward citations), CPC section dummies, application-year' },
      { sym: 'β', desc: 'Coefficient of interest — the raw VC premium on the outcome' },
    ],
    note: 'Robust standard errors clustered at the assignee-organisation level throughout.',
  },
  {
    id: 'twfe',
    label: 'Two-Way Fixed Effects',
    tag: 'Specification 2 — Primary',
    equation: 'y_{it} = β·VC_{it} + X_{it}·Γ + μ_c + τ_t + ε_{it}',
    vars: [
      { sym: 'μ_c', desc: 'NBER technology-category fixed effect (35 categories) — absorbs time-invariant sector composition' },
      { sym: 'τ_t', desc: 'Grant-year fixed effect — absorbs aggregate patent-office trends, examiner cohort effects, and macro conditions' },
      { sym: 'Γ', desc: 'Vector of coefficients on patent-level controls X_{it}' },
      { sym: 'β', desc: 'Within-category, within-year VC premium — the primary reported estimate' },
    ],
    note: 'Technology-category × grant-year interaction fixed effects are used in robustness checks to allow sector trends to vary by year.',
  },
  {
    id: 'stage',
    label: 'Deal-Stage Heterogeneity',
    tag: 'Specification 3',
    equation: 'y_{it} = Σ_s β_s·Stage_{sit} + X_{it}·Γ + μ_c + τ_t + ε_{it}',
    vars: [
      { sym: 'Stage_{sit}', desc: 'Indicator for VC deal stage s ∈ {Seed, Series A, Series B, Series C+} preceding application' },
      { sym: 'β_s', desc: 'Stage-specific VC premium — tests whether science intensity decays with investment maturity' },
      { sym: 'Omitted category', desc: 'Non-VC patents (VC = 0); all β_s are interpretable relative to the non-VC baseline' },
    ],
    note: 'Where a company received multiple rounds before the application date, the earliest round\'s stage is used to capture the founding financing context.',
  },
]

const biasControls = [
  {
    id: 'truncation',
    chapter: 'i',
    label: 'Citation Truncation Bias',
    head: 'Forward citations are mechanically truncated for recent grants',
    body: 'A patent granted in 2020 has had at most four years to accumulate forward citations; one granted in 2000 has had twenty-four. Naively comparing raw forward-citation counts across cohorts would confound quality differences with this mechanical truncation. We address this in two ways: (1) all forward-citation outcomes are measured within a fixed five-year post-grant window; (2) as a robustness check, we apply the Hall–Jaffe–Trajtenberg (2001) truncation correction, which re-weights citations by the estimated citation-age distribution for each technology class.',
    pills: ['5-year window', 'HJT correction', 'Class-specific weights'],
  },
  {
    id: 'sample-filters',
    chapter: 'ii',
    label: 'Sample Filtering Rules',
    head: 'Exclusions that preserve internal validity',
    body: 'We drop patents with missing CPC codes (0.4% of the corpus) and patents whose application date precedes 1976 (the start of consistent electronic records). Design patents and plant patents are excluded; only utility patents are retained. Patents with more than 500 backward citations are winsorised at the 99th percentile of the citation distribution within technology class and grant year to limit the influence of outlier filing strategies on regression estimates.',
    pills: ['Utility patents only', '1976–2024', 'CPC non-missing', '99th-pctile winsorise'],
  },
  {
    id: 'examiner',
    chapter: 'iii',
    label: 'Examiner & Art-Unit Effects',
    head: 'Unobserved examiner leniency as a confounder',
    body: 'Patent examiners vary in their propensity to grant claims and to require NPL references. If VC-backed applicants systematically face different examiner pools — plausible if prestigious law firms concentrate their filings in particular art units — the VC coefficient could capture examiner leniency rather than patent quality. We run an auxiliary regression of the outcome on art-unit fixed effects and confirm that the VC premium survives after residualising on art-unit means. Examiner-level fixed effects are also tested where examiner IDs are available in the PatentsView examiner table.',
    pills: ['Art-unit FE', 'Examiner leniency residual', 'PatentsView examiner table'],
  },
  {
    id: 'selection',
    chapter: 'iv',
    label: 'Selection & Endogeneity',
    head: 'VCs choose the best companies — by construction',
    body: 'The most fundamental identification challenge is that VCs select into better companies, and better companies file better patents. The TWFE estimator absorbs time-invariant sector composition and year-level trends, but cannot fully resolve selection on unobservables. We present two additional exercises: (1) a matched-sample analysis using coarsened exact matching on NBER category, grant year, and assignee type, which compares VC-backed patents to observationally similar non-VC patents; (2) a within-company analysis restricted to companies that file both before and after a VC round, using the pre-round patents as the counterfactual.',
    pills: ['CEM matching', 'Within-company DiD', 'Pre-round counterfactual'],
  },
]

const chapters = [
  { id: 'pipeline', chapter: '1', label: 'Data Matching Pipeline' },
  { id: 'models', chapter: '2', label: 'Econometric Models' },
  { id: 'bias', chapter: '3', label: 'Bias Controls & Filtering' },
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

        /* ── Section eyebrow (reused from Findings) ── */
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

        /* ────────────────────────────────────────────
           PIPELINE — vertical stepped diagram
        ──────────────────────────────────────────── */
        .pipeline {
          display: flex;
          flex-direction: column;
          gap: 0;
          position: relative;
        }
        /* Continuous vertical rule running behind all steps */
        .pipeline::before {
          content: '';
          position: absolute;
          left: 1.05rem;       /* centres on the dot */
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

        /* Terracotta dot + step number */
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

        /* ────────────────────────────────────────────
           EQUATIONS
        ──────────────────────────────────────────── */
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

        /* Equation block — monospaced, left-ruled in terracotta */
        .equation-block {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--rule);
          border-left: 3px solid var(--accent);
          background: var(--ground);
          overflow-x: auto;
        }
        .equation {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 1.05rem;
          font-style: italic;
          color: var(--ink);
          line-height: 1.5;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }
        /* Greek and math styling within equations */
        .eq-greek {
          font-family: 'Georgia', serif;
          font-style: italic;
        }

        /* Variable legend */
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

        /* ────────────────────────────────────────────
           BIAS CONTROLS
        ──────────────────────────────────────────── */
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
            <h1 className="page-header-title">Data pipeline, identification,<br />and robustness</h1>
            <p className="page-header-desc">
              How 7.8 million patent records are matched to VC financing events,
              what econometric models isolate the causal estimates, and how
              citation truncation, examiner heterogeneity, and selection bias
              are addressed.
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
                  <span className="section-label-text">Data Matching Pipeline</span>
                  <div className="section-eyebrow-rule" aria-hidden="true" />
                </div>
                <h2 className="section-title">Linking venture financing to the patent record</h2>
                <p className="section-intro">
                  The core identification challenge is connecting investment events — which live in
                  deal databases and SEC filings — to patent grants, which live in the USPTO corpus.
                  The five-stage pipeline below describes how that linkage is constructed, in order.
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
                  <span className="section-label-text">Econometric Models</span>
                  <div className="section-eyebrow-rule" aria-hidden="true" />
                </div>
                <h2 className="section-title">Identification strategy</h2>
                <p className="section-intro">
                  Three regression specifications are estimated in sequence. The OLS baseline
                  establishes the raw correlation; the two-way fixed-effects model is the
                  primary specification reported in all tables; the deal-stage model tests
                  heterogeneity across investment maturity.
                </p>

                <div className="model-cards">
                  {models.map((m) => (
                    <div className="model-card" key={m.id}>
                      <div className="model-card-header">
                        <span className="model-card-label">{m.label}</span>
                        <span className="model-card-tag">{m.tag}</span>
                      </div>

                      {/* Equation */}
                      <div className="equation-block" aria-label={`Equation: ${m.equation}`}>
                        <div className="equation">{m.equation}</div>
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
                  <span className="section-label-text">Bias Controls &amp; Filtering</span>
                  <div className="section-eyebrow-rule" aria-hidden="true" />
                </div>
                <h2 className="section-title">Threats to validity and how they are addressed</h2>
                <p className="section-intro">
                  Four distinct sources of potential bias are documented and mitigated:
                  mechanical citation truncation, sample composition choices, unobserved
                  examiner heterogeneity, and selection of better companies into VC financing.
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
              Data: USPTO PatentsView · SEC EDGAR Form D · PitchBook · Crunchbase ·
              NBER VC–patent match. Regression estimates computed in Python (statsmodels).
              Replication code available on request.
            </p>
            <span className="footer-badge">QSS 20 · 2026</span>
          </footer>

        </div>
      </main>
    </>
  )
}
