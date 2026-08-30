# Venture Capital and Patenting Dynamics (2000–2020)

An empirical analysis investigating how venture capital (VC) backing influences innovation, corporate patenting strategies, technological impact, legal scope, and science intensity across a sample of 500,000 USPTO patents granted between 2000 and 2020.

---

## Table of Contents

- [Project Overview & Research Objectives](#project-overview--research-objectives)
- [Repository Structure](#repository-structure)
- [Directory & File Reference](#directory--file-reference)
  - [1. Data Pipeline & ETL](#1-data-pipeline--etl)
  - [2. Statistical Analysis & Metrics](#2-statistical-analysis--metrics)
  - [3. Visualization & Figures](#3-visualization--figures)
- [Key Empirical Findings](#key-empirical-findings)
- [Dataset & Variable Dictionary](#dataset--variable-dictionary)
- [Data Sources & Setup](#data-sources--setup)
- [Pipeline Architecture](#pipeline-architecture)
- [Use of Artificial Intelligence](#use-of-artificial-intelligence)

---

## Project Overview & Research Objectives

Venture capital firms pursue asymmetric outcomes: within a standard portfolio of 30 startups, conventional wisdom holds that 10 fail entirely, 10 break even, 5 return 2x–5x, 4 return 10x, and 1 achieves a 50x+ outcome. This project investigates whether VC-backed patents systematically differ from non-VC corporate and individual patents across four structural dimensions:

1. **Technological Impact:** Forward citations normalized against peer benchmarks (CPC subclass × grant year cohort mean).
2. **Patent Scope & Breadth:** Legal complexity and breadth measured by independent and total claim counts.
3. **Science Intensity:** Proximity to foundational scientific research proxied by the Non-Patent Literature (NPL) citation ratio.
4. **Institutional & Policy Responses:** Drafting behavior surrounding statutory shifts (such as the 2011 Leahy-Smith America Invents Act) and across distinct Cooperative Patent Classification (CPC) sections.

---

## Repository Structure

```
├── README.md
├── .gitignore
├── code/
│   ├── 01_extract_cohort_and_citations.ipynb
│   ├── 02_process_claims_and_panel.ipynb
│   ├── 03_descriptive_statistics.ipynb
│   ├── 04_fig1_cpc_section_citations.ipynb
│   ├── 05_fig2_science_and_scope_kde.ipynb
│   ├── 06_fig3_claims_policy_trend.ipynb
│   ├── 07_fig4_claims_distribution.ipynb
│   └── 08_fig5_grant_lag_distribution.ipynb
├── data/
│   └── (Intermediate Parquet/CSV files & raw archives hosted via Drive)
├── output/
│   ├── figure1_cpc_section_citations.png
│   ├── figure1_vert_cpc_section_citations.png
│   ├── figure2a_science_intensity.png
│   ├── figure2b_patent_scope.png
│   ├── figure3_claims_policy_trend.png
│   ├── figure4_claims_distribution.png
│   └── figure5_grant_lag_distribution.png
└── website/
    └── files to run a website showcasing the project hosted on Vercel
```

---

## Directory & File Reference

All source files are available in the main branch repository.

### 1. Data Pipeline & ETL

#### `01_extract_cohort_and_citations.ipynb`
**Description:** Streams USPTO bulk archives to local SSD via DuckDB, draws a 500k random cohort (2000–2020), and compiles forward/backward citation counts, NPL references, CPC subclasses, and disambiguated assignees.

**Inputs:** `patentvc_enhanced_4var.dta`, `g_cpc_current.tsv.zip`, `g_us_patent_citation.tsv.zip`, `g_other_reference.tsv.zip`, `g_assignee_disambiguated.tsv.zip`

**Outputs:** `step1_metrics.parquet`

---

#### `02_process_claims_and_panel.ipynb`
**Description:** Converts claims Stata datasets to chunked Parquet via PyArrow, executes key-indexed DuckDB joins, generates peer benchmark citation baselines (CPC subclass × grant year), and creates the master analytical panel.

**Inputs:** `step1_metrics.parquet`, `patent_claims_stats.dta.zip`

**Outputs:** `step2_claims.parquet`, `cleaned_patent_panel.parquet`, `cleaned_patent_panel.csv`

### 2. Statistical Analysis & Metrics

#### `03_descriptive_statistics.ipynb`
**Description:** Computes parametric and non-parametric summary distributions (mean, std dev, quantiles) and runs two-sample t-tests between VC-backed and non-VC patents across citations, claims, and NPL ratios.

**Inputs:** `cleaned_patent_panel.parquet`

**Outputs:** Standard Output Tables & T-Test Metrics

### 3. Visualization & Figures

#### `04_fig1_cpc_section_citations.ipynb`
**Description:** Computes point estimates and standard errors for normalized citation impact across major CPC technology sections (A, B, C, F, G, H) relative to the 1.0 sector peer benchmark.

**Inputs:** `cleaned_patent_panel.parquet`

**Outputs:** `output/figure1_cpc_section_citations.png`, `output/figure1_vert_cpc_section_citations.png`

---

#### `05_fig2_science_and_scope_kde.ipynb`
**Description:** Estimates kernel density distributions comparing science intensity (`npl_ratio`) and patent scope (`log_claims`) between VC-backed and non-VC cohorts.

**Inputs:** `cleaned_patent_panel.parquet`

**Outputs:** `output/figure2a_science_intensity.png`, `output/figure2b_patent_scope.png`

---

#### `06_fig3_claims_policy_trend.ipynb`
**Description:** Plots longitudinal trends in mean total claim counts from 2008 to 2014, evaluating behavioral changes surrounding the 2011 Leahy-Smith America Invents Act (AIA).

**Inputs:** `cleaned_patent_panel.parquet`

**Outputs:** `output/figure3_claims_policy_trend.png`

---

#### `07_fig4_claims_distribution.ipynb`
**Description:** Generates cross-sectional boxplots of total claims across CPC sections grouped by VC backing status (outliers suppressed for visual clarity).

**Inputs:** `cleaned_patent_panel.parquet`

**Outputs:** `output/figure4_claims_distribution.png`

---

#### `08_fig5_grant_lag_distribution.ipynb`
**Description:** Computes and plots prosecution pendency (years between application filing and patent grant) distributions and median markers for VC and non-VC entities.

**Inputs:** `cleaned_patent_panel.parquet`

**Outputs:** `output/figure5_grant_lag_distribution.png`

---

## Key Empirical Findings

| Metric Dimension | VC-Backed Mean | Non-VC Mean | Statistical Significance | Substantive Interpretation |
| --- | --- | --- | --- | --- |
| **Normalized Citation Impact** | 2.026 | 0.981 | p = 0.014 | VC inventions receive more than double the peer-normalized citations of general corporate inventions. |
| **Patent Scope (Total Claims)** | 22.23 claims | 16.03 claims | p < 10⁻¹⁸⁰ | VC-backed patents carry significantly broader and more extensive legal claims. |
| **Science Intensity (NPL Ratio)** | 44.6% | 36.9% | p = 0.0047 | VC inventions draw substantially more foundational inputs from published academic and scientific literature. |
| **Prosecution Pendency** | 2.91 years | 3.12 years | p < 0.001 | VC assignees reach grant status faster despite filing broader claim sets. |

---

## Dataset & Variable Dictionary

The compiled analytical panel (`cleaned_patent_panel.parquet` / `cleaned_patent_panel.csv`) includes the following variables:

| Variable | Type | Description |
| --- | --- | --- |
| `patent_id` | String | Unique USPTO patent grant identifier. |
| `vc_backed` | Integer | Binary indicator (1 = Assignee received venture funding; 0 = Non-VC). |
| `grant_date` | Date | Official date on which the patent was issued by the USPTO. |
| `application_date` | Date | Official filing date of the original patent application. |
| `grant_year` | Integer | Calendar year of patent issuance (2000–2020). |
| `app_year` | Integer | Calendar year of application filing. |
| `cpc_section` | String | Primary CPC technology section (A, B, C, F, G, H). |
| `cpc_subclass` | String | Detailed 4-character CPC subclass representing the peer technology area. |
| `raw_forward_citations` | Integer | Raw count of forward citations received from subsequent US patents. |
| `peer_benchmark_mean_cites` | Float | Mean forward citations received by patents in the same CPC subclass × grant year. |
| `normalized_forward_citations` | Float | Focal forward citations divided by `peer_benchmark_mean_cites`. |
| `backward_pat_citations` | Integer | Count of citations to prior US patent documents. |
| `npl_citations` | Integer | Count of unique citations to Non-Patent Literature (academic journals, papers). |
| `npl_ratio` | Float | Science intensity ratio: NPL / (Backward Patent Cites + NPL). |
| `total_claims` | Integer | Total count of claims contained in the patent document. |
| `log_claims` | Float | Natural log transformation: ln(total_claims + 1) to correct for positive skew. |
| `avg_words_per_claim` | Float | Average word count across all claims in the document. |
| `total_claim_words` | Integer | Aggregate word count across all claims. |
| `has_independent_claims` | Integer | Binary flag (1 = Document contains explicit independent claims; 0 = Otherwise). |
| `assignee_organization` | String | Standardized disambiguated owner / assignee organization name. |
| `assignee_type` | String | USPTO assignee classification code. |

---

## Data Sources & Setup

### 1. PatentsView Bulk Data Tables

Download the raw `.tsv.zip` archives directly from [PatentsView Data Download Tables](https://patentsview.org/download/data-download-tables):

* `g_cpc_current.tsv.zip` — Current CPC classifications.
* `g_us_patent_citation.tsv.zip` — Patent-to-patent citation linkages (130M+ rows).
* `g_other_reference.tsv.zip` — Non-patent literature citations.
* `g_assignee_disambiguated.tsv.zip` — Disambiguated patent assignees.

### 2. Venture Capital & Claims Data

* **PatentVC Linked Panel (`patentvc_enhanced_4var.dta`):** Curated match between VentureSource/PitchBook venture financing rounds and USPTO patent numbers.
* **USPTO Patent Claims Stats (`patent_claims_stats.dta.zip`):** Longitudinal per-claim breakdown, independent claim flags, and word counts.
* **Direct Access:** Download both files from the project's Google Drive Data Repository.

---

## Pipeline Architecture

The ETL workflow runs on local SSD scratch space using DuckDB's vectorized columnar engine and a PyArrow chunked iteration to prevent zip-bombing yourself:

```
[Raw TSV.ZIP & DTA Files]
           │
           ▼ (DuckDB Streaming Uncompress & Reservoir Sample)
[Step 1: Cohort Extraction & Citation Networks] ──────────► step1_metrics.parquet
           │
           ▼ (PyArrow 5M-Row Chunked Stream + Key Clean)
[Step 2: Claims Matching & Parsing]             ──────────► step2_claims.parquet
           │
           ▼ (Subclass x Grant Year Benchmarking)
[Step 3: Master Normalization & Export]         ──────────► cleaned_patent_panel.parquet / .csv
           │
           ├──► 03_descriptive_statistics.ipynb    (Summary stats & t-tests)
           ├──► 04_fig1_cpc_section_citations.ipynb (Section-level normalized impact)
           ├──► 05_fig2_science_and_scope_kde.ipynb (Empirical KDE density curves)
           ├──► 06_fig3_claims_policy_trend.ipynb   (AIA 2011 longitudinal policy trend)
           ├──► 07_fig4_claims_distribution.ipynb   (Section claim boxplots)
           └──► 08_fig5_grant_lag_distribution.ipynb (Prosecution lag distributions)
```

---

## Use of Artificial Intelligence

Large language models (LLMs such as Claude and Gemini) were utilized throughout the development lifecycle of this project:

* **Pipeline Architecture & Optimization:** Assisting with zero-OOM DuckDB queries and chunked PyArrow parsing routines.
* **Visualization Engineering:** Refactoring matplotlib/seaborn figure scripts to meet rubric requirements.
* **Documentation:** Refining Markdown syntax and formatting.

All empirical hypotheses, econometric specifications, data validation steps, and analytical conclusions were designed, verified, and finalized by the author.
