# qss20_26x_vc

# Venture Capital and Patenting Dynamics (2000–2020)

This project is an ongoing empirical analysis investigating how venture capital (VC) backing influences corporate patenting strategies, technological impact, legal scope, and science intensity across 500,000 USPTO patents granted between 2000 and 2020 with the final goal of seeing how to maximize innovation through venture funding.

---

## Project Overview & Research Objectives

VC are known to pursue asymmetric outcomes with a $300 M fund generally investing in 30 companies. The common saying is that out of those 30: 10 will go to 0, 10 will break even, 5 will 2-5x, 4 will 10x, and 1 will 50+x. This project evaluates whether VC-backed inventions differ systematically from traditional non-VC corporate and individual patents across several core dimensions:

- Technological Impact: Forward citations normalized against peer benchmarks (CPC subclass × grant year cohort mean).
- Patent Scope & Breadth: Legal complexity and breadth measured by total independent and dependent claim counts.
- Science Intensity: Proximity to foundational scientific research proxied by the Non-Patent Literature (NPL) citation ratio.
- Institutional & Sector Responses: Differences in drafting behavior around major legal shifts (such as the 2011 Leahy-Smith America Invents Act) and across distinct Cooperative Patent Classification (CPC) technology sections.

This is all with the goal of seeing if: (1) if certain methodologies of investing would procure better results than others and (2) are there policies to put in place to maximize innovation and American Dynamism.


---

## Key Findings & Empirical Summary

Based on Welch's two-sample t-tests across the 500,000-patent random cohort:

- Citation Impact: VC-backed patents achieve more than double the normalized forward citation impact of non-VC patents (2.026 vs. 0.981, p = 0.014).
- Patent Scope: VC-backed patents contain significantly higher claim counts (22.23 vs. 16.03 claims, p < 10^-180), likely due to broader defense strategies. 
- Science Intensity: VC-backed inventions demonstrate a higher reliance on academic and scientific literature (44.6% vs. 36.9% NPL ratio, p = 0.0047).
- Breakthrough Propensity: VC-backed patents maintain a disproportionately higher share in the top 5th percentile of peer-normalized citations throughout the 2000–2020 window.

---

## Dataset & Variable Definitions

The final analytical panel (cleaned_patent_panel.parquet / cleaned_patent_panel.csv) contains patent-level observations with the following variables:

| Variable | Type | Description |
| :--- | :--- | :--- |
| patent_id | String | Unique USPTO patent grant identifier. |
| vc_backed | Integer | Binary indicator (1 = Assignee received venture capital funding; 0 = Non-VC). |
| grant_year | Integer | Calendar year in which the patent was officially granted (2000–2020). |
| app_year | Integer | Calendar year of original patent application filing. |
| cpc_section | String | Broad CPC technology section (A, B, C, F, G, H). |
| cpc_subclass | String | 4-character CPC subclass representing detailed peer technology area. |
| raw_forward_citations | Integer | Total citations received from subsequent US patents. |
| normalized_forward_citations | Float | Ratio of focal forward citations to the peer benchmark (CPC subclass × grant year mean). |
| backward_pat_citations | Integer | Total citations to prior US patent documents. |
| npl_citations | Integer | Count of unique citations to Non-Patent Literature (academic journals, papers). |
| npl_ratio | Float | Science intensity ratio: NPL / (Backward Patent Cites + NPL). |
| total_claims | Integer | Total count of claims within the patent document. |
| log_claims | Float | Natural log transformation: ln(total_claims + 1) to correct right skew. |
| assignee_organization | String | Standardized disambiguated assignee / owner organization. |

---

## Data Sources & Download Instructions

The data pipeline synthesizes data from two primary sources:

### USPTO Bulk Data (PatentsView)
Available for direct download at PatentsView Data Download Tables:
- g_cpc_current.tsv.zip — Current Cooperative Patent Classification assignments.
- g_us_patent_citation.tsv.zip — Patent-to-patent citation linkages (130M+ rows).
- g_other_reference.tsv.zip — Non-patent literature citations.
- g_assignee_disambiguated.tsv.zip — Disambiguated patent assignees and organization names.

### Venture Capital & Claims Data
- PatentVC Linked Panel (patentvc_enhanced_4var.dta): Curated match between VentureSource/PitchBook VC funding events and USPTO patent numbers.
- USPTO Patent Claims Stats (patent_claims_stats.dta.zip): Historical per-claim breakdown, independent claim flags, and word counts.

https://drive.google.com/drive/folders/1jyvfp9pOSz27jY5ny5fRUYi7ELK8gra7?usp=sharing

---

## Pipeline Architecture

Due to large file sizes and limited computing power, the ETL and analysis workflow is designed for zero out-of-memory (OOM) failures using DuckDB's streaming OLAP engine and PyArrow chunked conversions:

```text
[Raw Zip / DTA Files] 
       │
       ▼ (DuckDB Streaming + Uncompressed Local SSD)
 [Step 1: Cohort Extraction & Citation Networks] ───► step1_metrics.parquet
       │
       ▼ (PyArrow 5M-Row Chunked Stata Stream)
 [Step 2: Claims Matching & Parsing]             ───► step2_claims.parquet
       │
       ▼ (Peer Benchmarking & Aggregation)
 [Step 3: Master Normalization & Export]         ───► cleaned_patent_panel.parquet / .csv
       │
       ├──► Descriptive Statistics & Welch's T-Tests
       ├──► Figure 1: CPC Technology Section Citation Impact
       ├──► Figure 2: AIA 2011 Reform Claims Policy Trends (2006–2016)
       └──► Figure 3: Top 5% Breakthrough Share Trajectory (2000–2020)
```
---

## Use of Artificial Intelligence

Large language models (LLMs) were utilized throughout the lifecycle of this project. Specifically, AI tools assisted with:

- Data pipeline optimization (refactoring memory-efficient DuckDB queries and chunked PyArrow conversions)
- Formatting and debugging visualizing code
- Refining formatting and word-choice utilized in documentation and figure descriptions

All underlying empirical methodology, data processing logic, analytical results, and interpretations were reviewed, verified, and finalized by the author.
