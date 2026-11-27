# System Architecture
## Dengue Response & Resource Optimization Command System

### 1. Overview

The Dengue Response & Resource Optimization Command System is a
decision-support platform designed to assist authorities in responding
to urban dengue outbreaks.
The system combines dengue data, outbreak risk information, hospital
capacity, and operational requirements to support resource allocation,
hospital overflow routing, vector-control planning, dispatch generation,
and monitoring through a unified command dashboard.

The system extends the existing Phase 1 codebase and integrates the
onsite dataset without replacing the existing core functionality.

---

### 2. Architectural Principles

- Extend the existing Phase 1 codebase.
- Preserve existing functionality and Git history.
- Use modular and reusable components.
- Support local and offline execution.
- Avoid unnecessary external API dependencies.
- Keep data processing, decision logic, and UI separate.
- Make outputs explainable and suitable for demonstration.

---

### 3. High-Level Architecture

The system consists of the following layers:

1. Data Layer
2. Data Processing Layer
3. Decision & Optimization Layer
4. Operational Layer
5. Presentation Layer
6. Local Storage & Export Layer

---

### 4. Data Layer

Sources:

- Existing Phase 1 prediction outputs
- Onsite dengue dataset
- Hospital/resource information
- Ward/location information
- Operational input parameters

The onsite Excel dataset serves as an additional data source.

---
