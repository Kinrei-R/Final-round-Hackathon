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

### 5. Data Processing Layer

Responsibilities:

- Load dataset
- Validate data
- Handle missing values
- Standardize data formats
- Extract relevant variables
- Aggregate information by location/ward
- Prepare structured data for downstream modules

Output:

Processed and standardized dengue-related data.

---

### 6. Ward Data Engine

The Ward Data Engine combines available information from the
dataset and existing prediction system.

Responsibilities:

- Organize data by ward/location
- Identify high-risk areas
- Generate ward-level indicators
- Prepare input for resource allocation
- Provide data to the dashboard

---

### 7. Decision & Optimization Layer

#### 7.1 Resource Allocation Engine

Determines how available resources should be prioritized and distributed
according to risk levels, demand, and available capacity.

Inputs:

- Ward-level risk
- Resource availability
- Estimated demand
- Priority indicators

Outputs:

- Resource allocation recommendations
- Priority wards
- Allocation summaries

#### 7.2 Hospital Overflow Routing

Identifies alternative hospitals when a hospital reaches or exceeds
its available capacity.

Responsibilities:

- Monitor capacity
- Identify overloaded hospitals
- Find alternative hospitals within the same city
- Recommend suitable destinations
- Provide routing recommendations

#### 7.3 Vector Control Simulator

Simulates possible vector-control interventions and their potential
impact on dengue risk.

Possible interventions:

- Targeted mosquito-control operations
- High-risk ward prioritization
- Intervention coverage adjustment
- Resource distribution scenarios

The simulator supports scenario comparison for decision-making.

---

### 8. Operational Layer

#### 8.1 Dispatch & Alert Generator

Generates operational recommendations based on outputs from the
decision modules.

Responsibilities:

- Create dispatch recommendations
- Generate alerts for high-risk wards
- Identify urgent resource requirements
- Summarize recommended actions
- Prepare operational instructions

#### 8.2 Reporting & Export

Provides downloadable outputs for decision-makers.

Possible formats:

- CSV
- Excel
- PDF (if supported by the existing project)

Exports may include:

- Ward risk summaries
- Resource allocation plans
- Hospital routing recommendations
- Dispatch reports
- Intervention scenarios

---
