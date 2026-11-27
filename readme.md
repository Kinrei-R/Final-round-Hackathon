# Dengue Operational Response & Resource Command System (Phase 2)

> **EDU AI Engineering Hackathon 2026 — 10-Hour Onsite Final (`version-onsite-final`)**  
> Extending our Phase 1 Dengue Early Warning System across **60 urban wards** in Bangladesh into a deterministic, offline-resilient resource optimization, hospital overflow routing, vector-control simulation, and multi-channel dispatch platform.

---

## Live Deployment & Repository Continuity

* **Live Application URL:** `[INSERT_LIVE_DEPLOYED_URL]`
* **Walkthrough Video (07:00 Uncut):** `[INSERT_UNLISTED_VIDEO_URL]`
* **Git Tag / Commit Convention:** Continuous history extending Phase 1 (`version-onsite-final`)
* **Dataset:** `bangladesh dengue large dataset onsite` (60 urban wards across **Dhaka North, Dhaka South, Chattogram, Gazipur, and Narayanganj**)

---

## Overview

Forecasting dengue outbreaks two weeks in advance only saves lives if municipal commissioners and health center managers can translate predictions into immediate logistics. This Phase 2 system bridges predictive ML with real-time public health operations across all 60 wards through five integrated modules:

1. **Constrained Resource Allocation Engine**
2. **Hospital Surge & Cross-Ward Overflow Routing**
3. **"What-If" Vector Control Impact Simulator**
4. **Actionable Multi-Channel Dispatch Notifications**
5. **100% Offline Resilience & Deterministic Fallback**

---

## Core Modules & Operational Architecture

### 1. Constrained Resource Allocation Engine
Converts ward-level predicted cases and risk classifications into exact logistical requirements and vector-control crew assignments under real-world supply constraints:
* **Calculated Resource Demands:**
  * `saline_bags_needed`
  * `diagnostic_kits_needed`
  * `hospital_beds_required`
  * `spraying_crews_assigned`
  * **Interactive Scarcity Controls:** Live sliders allow officers to adjust **Available Regional Stock (`30%` – `100%`)** and **Total Spraying Crews**.
* **Risk & Density Prioritization:** Under scarcity ($<100\%$ stock), supplies and crews are dynamically prioritized using a weighted urgency score combining predicted outbreak risk tier and `population_density_sqkm`.
* **Live Deficit Alerts:** Automatically flags critical ward-level supply deficits whenever allocated inventory falls below $100\%$ of projected demand.

### 2. Hospital Surge & Cross-Ward Overflow Routing
Prevents localized hospital collapse during case surges while respecting municipal administrative boundaries:
* **Intra-City Patient Routing:** Identifies wards where `hospital_beds_required` exceeds local bed capacity and automatically routes overflow patients to lower-burden wards strictly **within the same city pool**:
* Dhaka North
  * Dhaka South
  * Chattogram
  * Gazipur
  * Narayanganj
* **Net Deficit & Headroom Reporting:** Displays pre-transfer shortages, ward-to-ward transfer manifests, remaining city-wide bed headroom, and net unabsorbable city deficits if total municipal capacity is breached.

### 3. "What-If" Vector Control Impact Simulator
Enables health officers to test targeted larvicide and fogging deployments before dispatching field teams:
* **Counterfactual Intervention Modeling:** Simulates deploying a limited pool of spraying crews to selected wards and computes the **2-to-4-week downstream reduction** in:
  * Projected dengue cases
  * Hospital bed occupancy load
  * IV saline bag consumption
  * **Intervention ROI Ranking:** Automatically ranks all 60 wards by **Cases Prevented per Crew ($\text{ROI} = \frac{\Delta \text{Cases}}{\text{Crews Deployed}}$)** to guide high-leverage field deployment.

### 4. Actionable Multi-Channel Dispatch Notifications
Generates structured, ward-specific operational orders ready for immediate field distribution:
* **SMS / WhatsApp Alerts:** Concise, character-optimized dispatch summaries for ward officers and rapid-response crew leads.
* **Printable PDF / HTML Commissioner Briefs:** Formal situation reports detailing predicted cases, required vs. allocated supplies, deficit warnings, intra-city hospital overflow transfers, and assigned spraying teams.
* **Pre-Generated Sample Exports:** Located in [`/exports`](./exports/) for offline inspection and verification.

### 5. Offline Resilience & Deterministic Fallback
Engineered to pass a live Wi-Fi / API kill-switch with zero crashes or degraded math:
* **100% Local Execution:** All forecasting models, constrained linear/priority optimization solvers, intra-city overflow routing algorithms, counterfactual simulators, and template-based dispatch generators execute completely locally.
* **Zero External Runtime Dependencies:** Does not rely on external LLM APIs or cloud endpoints for core calculations or notice generation.

---

## Repository Structure

```text
├── data/                         # Onsite 60-ward dataset & ward capacity metadata
├── models/                       # Serialized Phase 1/2 local forecasting & simulation artifacts
├── src/
│   ├── forecasting/              # Local deterministic ML inference pipeline
│   ├── allocation/               # Constrained resource & crew prioritization engine
│   ├── routing/                  # Intra-city hospital overflow & headroom solver
│   ├── simulator/                # 2-to-4 week vector control counterfactual & ROI ranker
│   └── dispatch/                 # Offline SMS/WhatsApp & HTML/PDF brief generator
├── exports/                      # Sample generated SMS, WhatsApp, and HTML/PDF ward briefs
├── app.py / frontend/            # Interactive Command Center UI
├── ARCHITECTURE.md               # Detailed system architecture, math formulas & AI disclosure
├── README.md                     # Project documentation (this file)
└── requirements.txt              # Local Python/Node dependencies
```

---

## Quickstart & Local Setup (Offline-Ready)

### Prerequisites
* Python `3.10+` (or Node `18+` if running a separate frontend)
* All model weights and datasets bundled locally—no internet connection required after dependency installation.

### Installation & Execution
```bash
# 1. Clone the repository and checkout the onsite tag
git clone <YOUR_PHASE_1_REPO_URL>
cd <REPO_DIRECTORY>
git checkout version-onsite-final
