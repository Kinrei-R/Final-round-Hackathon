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