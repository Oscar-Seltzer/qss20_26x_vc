// ─── Paper / Repository hub page ─────────────────────────────────────────────
// Design system: FAF8F5 ground · 181615 charcoal · C85A32 terracotta · 8C877E warm-grey · E8E3DC rule
// Type: Playfair Display (display) · Inter (body/data) · system monospace (code/schema)

const FONT_LINK =
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400&family=Inter:wght@300;400;500;600&display=swap'

const GITHUB_URL = 'https://github.com/Oscar-Seltzer/qss20_26x_vc'

// ─── Data ────────────────────────────────────────────────────────────────────

const abstract = {
  title: 'Venture Capital and the Science Frontier: Evidence from 50 Years of USPTO Patent Data',
  authors: 'QSS 20 Research Group · Dartmouth College · 2026',
  body: [
    'We examine whether venture-capital financing is associated with systematically more science-intensive, broader-scope, and more cross-disciplinary patents. Using a panel of 7,842,115 USPTO utility patents granted between 1976 and 2024, matched to venture financing records from PitchBook, Crunchbase, and SEC Form D filings, we find that VC-backed patents carry a 2.4× premium on non-patent literature citation share (a proxy for scientific proximity), 31% more independent claims on average, and generate cross-CPC-class forward citations at 3.1× the rate of the non-VC cohort.',
    'These effects are identified using two-way fixed effects at the NBER technology-category and grant-year level, controlling for patent-level observables including backward citation count, CPC section, and assignee type. The premium is sharpest among Seed and Series A patents and attenuates by Series C, consistent with a selection story in which early-stage VCs bet on frontier science while later-stage capital scales established businesses. Robustness checks address citation truncation bias, examiner heterogeneity, and selection on unobservables via coarsened exact matching and within-company difference-in-differences.',
    'The findings suggest that venture capital plays a distinct role in the innovation system — not merely as a financier of commercialisation, but as an active participant in the translation of basic science into patentable, cross-domain technology.',
  ],
  keywords: ['Venture Capital', 'Patent Quality', 'Science Intensity', 'NPL Citations', 'CPC Classification', 'Two-Way Fixed Effects'],
  jel: ['G24', 'O31', 'O34', 'L26'],
}

const dataDictionary = [
  {
    group: 'Core Panel',
    fields: [
      { col: 'patent_id', type: 'VARCHAR', desc: 'USPTO patent number (zero-padded to 8 chars)' },
      { col: 'application_date', type: 'DATE', desc: 'Date application was filed with USPTO' },
      { col: 'grant_date', type: 'DATE', desc: 'Date patent was officially granted' },
      { col: 'vc_backed', type: 'INT(0/1)', desc: 'Binary flag: 1 if assignee received VC financing before application_date' },
    ],
  },
  {
    group: 'Citation Metrics',
    fields: [
      { col: 'backward_pat_citations', type: 'INT', desc: 'Count of distinct prior-patent citations in the patent document' },
      { col: 'npl_citations', type: 'INT', desc: 'Count of distinct non-patent literature references (journals, reports, preprints)' },
      { col: 'npl_ratio', type: 'FLOAT', desc: 'npl_citations ÷ (backward_pat_citations + npl_citations); null if both zero' },
    ],
  },
  {
    group: 'Classification',
    fields: [
      { col: 'main_cpc_section', type: 'CHAR(1)', desc: 'Primary CPC section letter (A–H, Y) from g_cpc_current' },
      { col: 'main_cpc_subclass', type: 'VARCHAR(4)', desc: 'Primary CPC subclass (e.g. H04L) — first assigned code by sequence' },
      { col: 'cpc_subclass_count', type: 'INT', desc: 'Total distinct CPC subclasses assigned to the patent' },
    ],
  },
  {
    group: 'Assignee',
    fields: [
      { col: 'assignee_organization', type: 'VARCHAR', desc: 'Disambiguated organisation name from PatentsView (g_assignee_disambiguated)' },
      { col: 'assignee_type', type: 'VARCHAR', desc: 'Assignee category: US company, foreign company, US individual, government, etc.' },
    ],
  },
]

const replicationSteps = [
  {
    step: '1',
    head: 'Clone the repository',
    code: 'git clone https://github.com/Oscar-Seltzer/qss20_26x_vc.git\ncd qss20_26x_vc',
  },
  {
    step: '2',
    head: 'Acquire the data',
    body: 'Download the USPTO PatentsView bulk TSV files (g_us_patent_citation, g_other_reference, g_cpc_current, g_assignee_disambiguated, patent_claims_stats) and place them in data/uspto/. The VC financing dataset (patentvc_enhanced_4var.dta) should be placed in data/. See README for direct download links.',
    code: null,
  },
  {
    step: '3',
    head: 'Build the master panel',
    code: 'cd code/\njupyter nbconvert --to notebook --execute working_data_analysis.ipynb',
  },
  {
    step: '4',
    head: 'Run the regression models',
    body: 'Open analysis/regressions.py and set BASE_DIR to your local data/ path. The script produces all tables reported in the paper, saved as CSV to output/tables/.',
    code: 'python analysis/regressions.py',
  },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function Paper() {
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

        /* ────────────────────────────────────────────
           ABSTRACT + ARTIFACT CARDS — two-column top
        ──────────────────────────────────────────── */
        .top-grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 0 3.5rem;
          padding: 3.5rem 0 0;
          align-items: start;
        }

        /* Abstract column */
        .abstract-col {}
        .abstract-eyebrow {
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 1rem;
        }
        .abstract-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.5rem, 3vw, 2.2rem);
          font-weight: 800;
          line-height: 1.12;
          letter-spacing: -0.02em;
          color: var(--ink);
          text-wrap: balance;
          margin-bottom: 0.6rem;
        }
        .abstract-authors {
          font-size: 0.75rem;
          color: var(--mid);
          margin-bottom: 2rem;
          letter-spacing: 0.03em;
        }
        .abstract-body {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.75rem;
        }
        .abstract-para {
          font-size: 0.88rem;
          line-height: 1.85;
          color: var(--mid);
          max-width: 68ch;
        }
        /* Keyword + JEL row */
        .abstract-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--rule);
          margin-bottom: 3.5rem;
        }
        .abstract-meta-group {}
        .abstract-meta-label {
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--mid);
          margin-bottom: 0.4rem;
        }
        .abstract-meta-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }
        .meta-pill {
          font-size: 0.65rem;
          font-weight: 500;
          color: var(--ink);
          border: 1px solid var(--rule);
          padding: 0.2rem 0.55rem;
          background: var(--surface);
          letter-spacing: 0.02em;
        }
        .meta-pill-jel {
          font-family: 'Georgia', serif;
          font-style: italic;
          font-size: 0.7rem;
          color: var(--accent);
          border: 1px solid var(--rule);
          padding: 0.2rem 0.55rem;
          background: var(--surface);
        }

        /* Artifact cards column (right) */
        .artifact-col {
          display: flex;
          flex-direction: column;
          gap: 0;
          border: 1px solid var(--rule);
          /* Cards stack inside a single ruled border */
        }

        /* PDF card */
        .artifact-card {
          padding: 1.5rem;
          border-bottom: 1px solid var(--rule);
          background: var(--ground);
        }
        .artifact-card:last-child { border-bottom: none; }
        .artifact-card-label {
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--mid);
          margin-bottom: 0.75rem;
        }
        .artifact-card-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--ink);
          margin-bottom: 0.35rem;
          line-height: 1.3;
        }
        .artifact-card-desc {
          font-size: 0.75rem;
          color: var(--mid);
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        /* PDF placeholder — CSS document icon */
        .pdf-placeholder {
          background: var(--surface);
          border: 1px solid var(--rule);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1.75rem 1rem;
          margin-bottom: 1rem;
        }
        .doc-icon {
          width: 36px;
          height: 44px;
          background: var(--ground);
          border: 1px solid var(--rule);
          position: relative;
          flex-shrink: 0;
        }
        /* Folded corner via a pseudo-element */
        .doc-icon::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 10px;
          height: 10px;
          background: var(--surface);
          border-left: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
        }
        /* Three ruled lines suggesting text */
        .doc-icon::after {
          content: '';
          position: absolute;
          top: 16px;
          left: 6px;
          right: 6px;
          height: 1px;
          background: var(--rule);
          box-shadow: 0 5px 0 var(--rule), 0 10px 0 var(--rule);
        }
        .pdf-placeholder-text {
          font-size: 0.68rem;
          color: var(--mid);
          text-align: center;
          line-height: 1.4;
        }

        /* CTA link button — terracotta, sharp */
        .cta-link {
          display: block;
          width: 100%;
          padding: 0.65rem 1rem;
          background: var(--accent);
          color: #FAF8F5;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-align: center;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .cta-link:hover { opacity: 0.88; }
        .cta-link:focus-visible {
          outline: 2px solid var(--ink);
          outline-offset: 2px;
        }

        /* GitHub card specifics */
        .gh-repo-name {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 0.9rem;
          font-style: italic;
          color: var(--ink);
          margin-bottom: 0.25rem;
        }
        .gh-url {
          font-family: ui-monospace, 'Cascadia Code', 'Fira Mono', monospace;
          font-size: 0.65rem;
          color: var(--mid);
          word-break: break-all;
          margin-bottom: 1rem;
          line-height: 1.5;
        }
        .gh-meta-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .gh-badge {
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--mid);
          border: 1px solid var(--rule);
          padding: 0.2rem 0.5rem;
          background: var(--surface);
        }
        .cta-link-outline {
          display: block;
          width: 100%;
          padding: 0.65rem 1rem;
          background: transparent;
          color: var(--accent);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-align: center;
          text-decoration: none;
          border: 1px solid var(--accent);
          transition: background 0.15s, color 0.15s;
        }
        .cta-link-outline:hover {
          background: var(--accent);
          color: #FAF8F5;
        }
        .cta-link-outline:focus-visible {
          outline: 2px solid var(--ink);
          outline-offset: 2px;
        }

        /* ────────────────────────────────────────────
           SECTION DIVIDER — shared rhythm
        ──────────────────────────────────────────── */
        .section-divider {
          border: none;
          border-top: 2px solid var(--rule);
          margin: 0;
        }
        .section-block {
          padding: 3.5rem 0;
          border-bottom: 1px solid var(--rule);
        }
        .section-block:last-of-type { border-bottom: none; }

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
          font-size: clamp(1.4rem, 2.5vw, 1.9rem);
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
          margin-bottom: 2.25rem;
        }

        /* ────────────────────────────────────────────
           REPLICATION STEPS
        ──────────────────────────────────────────── */
        .replication-steps {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .rep-step {
          display: grid;
          grid-template-columns: 2rem 1fr;
          gap: 0 1.5rem;
          align-items: start;
        }
        .rep-num {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 0.9rem;
          font-style: italic;
          color: var(--accent);
          padding-top: 0.1rem;
          text-align: right;
        }
        .rep-body {}
        .rep-head {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--ink);
          margin-bottom: 0.35rem;
        }
        .rep-desc {
          font-size: 0.82rem;
          color: var(--mid);
          line-height: 1.65;
          margin-bottom: 0.6rem;
        }
        .rep-code {
          font-family: ui-monospace, 'Cascadia Code', 'Fira Mono', monospace;
          font-size: 0.75rem;
          line-height: 1.6;
          color: var(--ink);
          background: var(--surface);
          border: 1px solid var(--rule);
          border-left: 3px solid var(--accent);
          padding: 0.75rem 1rem;
          white-space: pre;
          overflow-x: auto;
        }

        /* ────────────────────────────────────────────
           DATA DICTIONARY — ledger table
        ──────────────────────────────────────────── */
        .dict-groups {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .dict-group {}
        .dict-group-label {
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 0.5rem;
        }
        .dict-table {
          width: 100%;
          border: 1px solid var(--rule);
          border-collapse: collapse;
        }
        .dict-row {
          display: grid;
          grid-template-columns: 14rem 6rem 1fr;
          border-bottom: 1px solid var(--rule);
        }
        .dict-row:last-child { border-bottom: none; }
        .dict-row-head {
          background: var(--surface);
        }
        .dict-col {
          font-family: ui-monospace, 'Cascadia Code', 'Fira Mono', monospace;
          font-size: 0.75rem;
          color: var(--accent);
          padding: 0.6rem 1rem;
          border-right: 1px solid var(--rule);
          font-variant-numeric: tabular-nums;
          word-break: break-all;
        }
        .dict-type {
          font-family: ui-monospace, 'Cascadia Code', 'Fira Mono', monospace;
          font-size: 0.68rem;
          color: var(--mid);
          padding: 0.6rem 0.75rem;
          border-right: 1px solid var(--rule);
          white-space: nowrap;
        }
        .dict-desc {
          font-size: 0.78rem;
          color: var(--mid);
          padding: 0.6rem 1rem;
          line-height: 1.5;
        }
        .dict-head-col {
          font-size: 0.58rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--mid);
          padding: 0.45rem 1rem;
          border-right: 1px solid var(--rule);
        }
        .dict-head-col:last-child { border-right: none; }

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
          .top-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem 0;
          }
          .artifact-col {
            max-width: 400px;
          }
          .dict-row {
            grid-template-columns: 11rem 5rem 1fr;
          }
        }
        @media (max-width: 600px) {
          .page-wrap { padding: 0 1.25rem; }
          .dict-row {
            grid-template-columns: 1fr;
          }
          .dict-col, .dict-type, .dict-desc {
            border-right: none;
            border-bottom: 1px solid var(--rule);
            padding: 0.4rem 0.75rem;
          }
          .dict-desc { border-bottom: none; }
          .dict-row-head { display: none; }
          .rep-step { grid-template-columns: 1.5rem 1fr; gap: 0 1rem; }
          .gh-meta-row { flex-wrap: wrap; }
        }

        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
          .cta-link, .cta-link-outline { transition: none; }
        }
      `}</style>

      <main>
        <div className="page-wrap">

          {/* ── Masthead ── */}
          <header className="masthead">
            <div className="masthead-left">
              <a href="/" className="masthead-wordmark">VC &amp; Patent Research</a>
              <div className="masthead-sep" aria-hidden="true" />
              <span className="masthead-page">Paper &amp; Repository</span>
            </div>
            <span className="masthead-meta">QSS 20 · Dartmouth · 2026</span>
          </header>

          {/* ── Top grid: abstract + artifact cards ── */}
          <div className="top-grid">

            {/* Abstract */}
            <div className="abstract-col">
              <p className="abstract-eyebrow">Working paper</p>
              <h1 className="abstract-title">{abstract.title}</h1>
              <p className="abstract-authors">{abstract.authors}</p>

              <div className="abstract-body">
                {abstract.body.map((para, i) => (
                  <p className="abstract-para" key={i}>{para}</p>
                ))}
              </div>

              <div className="abstract-meta-row">
                <div className="abstract-meta-group">
                  <div className="abstract-meta-label">Keywords</div>
                  <div className="abstract-meta-pills">
                    {abstract.keywords.map((k) => (
                      <span className="meta-pill" key={k}>{k}</span>
                    ))}
                  </div>
                </div>
                <div className="abstract-meta-group">
                  <div className="abstract-meta-label">JEL Codes</div>
                  <div className="abstract-meta-pills">
                    {abstract.jel.map((j) => (
                      <span className="meta-pill-jel" key={j}>{j}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Artifact cards — stacked in a single ruled border */}
            <aside className="artifact-col" aria-label="Downloads and links">

              {/* PDF card */}
              <div className="artifact-card">
                <div className="artifact-card-label">Full paper</div>
                <div className="artifact-card-title">Research Report PDF</div>
                <p className="artifact-card-desc">
                  Complete write-up including all tables, figures, and appendix.
                </p>
                <div className="pdf-placeholder" aria-hidden="true">
                  <div className="doc-icon" />
                  <p className="pdf-placeholder-text">PDF available on request<br />or upon publication</p>
                </div>
                <a
                  href="#"
                  className="cta-link"
                  aria-label="Download research report PDF (not yet available)"
                  onClick={(e) => e.preventDefault()}
                >
                  Download PDF
                </a>
              </div>

              {/* GitHub card */}
              <div className="artifact-card">
                <div className="artifact-card-label">Source code &amp; data</div>
                <div className="gh-repo-name">qss20_26x_vc</div>
                <div className="gh-url">{GITHUB_URL}</div>
                <div className="gh-meta-row">
                  <span className="gh-badge">Python</span>
                  <span className="gh-badge">DuckDB</span>
                  <span className="gh-badge">Stata</span>
                </div>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-link-outline"
                  aria-label="Open GitHub repository for qss20_26x_vc"
                >
                  Open Repository ↗
                </a>
              </div>

            </aside>
          </div>

          {/* ── Replication instructions ── */}
          <hr className="section-divider" />

          <div className="section-block">
            <div className="section-eyebrow">
              <span className="section-chapter">I</span>
              <span className="section-label-text">Replication</span>
              <div className="section-eyebrow-rule" aria-hidden="true" />
            </div>
            <h2 className="section-title">Running the analysis from scratch</h2>
            <p className="section-intro">
              The full pipeline — from raw USPTO bulk files and VC financing records
              to the regression tables reported in the paper — can be reproduced
              in four steps. Estimated runtime on a modern laptop: 45–90 minutes,
              dominated by the DuckDB citation join.
            </p>

            <div className="replication-steps">
              {replicationSteps.map((s) => (
                <div className="rep-step" key={s.step}>
                  <div className="rep-num">{s.step}</div>
                  <div className="rep-body">
                    <div className="rep-head">{s.head}</div>
                    {s.body && <p className="rep-desc">{s.body}</p>}
                    {s.code && <pre className="rep-code">{s.code}</pre>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Data dictionary ── */}
          <div className="section-block">
            <div className="section-eyebrow">
              <span className="section-chapter">II</span>
              <span className="section-label-text">Data Dictionary</span>
              <div className="section-eyebrow-rule" aria-hidden="true" />
            </div>
            <h2 className="section-title">Master panel schema</h2>
            <p className="section-intro">
              The cleaned_patent_panel.csv output of the pipeline contains the following
              fields. All patent-level observations are one row per patent_id.
            </p>

            <div className="dict-groups">
              {dataDictionary.map((group) => (
                <div className="dict-group" key={group.group}>
                  <div className="dict-group-label">{group.group}</div>
                  <div className="dict-table" role="table" aria-label={`${group.group} fields`}>
                    {/* Header */}
                    <div className="dict-row dict-row-head" role="row">
                      <div className="dict-head-col" role="columnheader">Column</div>
                      <div className="dict-head-col" role="columnheader">Type</div>
                      <div className="dict-head-col" role="columnheader">Description</div>
                    </div>
                    {/* Rows */}
                    {group.fields.map((f) => (
                      <div className="dict-row" role="row" key={f.col}>
                        <div className="dict-col" role="cell">{f.col}</div>
                        <div className="dict-type" role="cell">{f.type}</div>
                        <div className="dict-desc" role="cell">{f.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Footer ── */}
          <footer className="footer">
            <p className="footer-note">
              Repository: github.com/Oscar-Seltzer/qss20_26x_vc ·
              Data: USPTO PatentsView · SEC EDGAR · PitchBook · Crunchbase.
              All code released under MIT licence unless otherwise noted.
            </p>
            <span className="footer-badge">QSS 20 · 2026</span>
          </footer>

        </div>
      </main>
    </>
  )
}
