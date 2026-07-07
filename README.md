# StadiumMind AI

> An Agentic AI Operating System for Smart Stadiums at FIFA World Cup 2026.

StadiumMind AI is a collaborative, multi-agent operating system designed to elevate stadium operations, safety, sustainability, and the tournament experience during the **FIFA World Cup 2026**. Rather than an isolated, passive chatbot, StadiumMind AI orchestrates a cohesive grid of six specialized autonomous agents powered by **Gemini** models and the **Google Agent Development Kit (ADK)** framework.

---

## 🌟 Project Vision

* **Name**: StadiumMind AI
* **Tagline**: An Agentic AI Operating System for Smart Stadiums
* **Core Concept**: Shift stadium operations from reactive manual protocols to proactive, autonomous multi-agent coordination. When a safety hazard, bottleneck, or transit delay triggers, our agents interact directly via a shared blackboard memory, call real-world APIs, and dispatch instant physical solutions to volunteers and staff.

---

## 🤖 The Multi-Agent Orchestrator Grid

Each of our six agents is modeled with a strict cognitive persona, localized telemetry indicators, operational boundaries, and dynamic tool call capabilities:

1. **Fan Concierge Agent** (`@fan`): Handles multi-lingual spectator navigation, personalized digital seat routing, concession discounts, and Lost & Found assistance.
2. **Crowd Intelligence Agent** (`@crowd`): Processes camera telemetry feeds, calculates queue times, detects bottleneck surges, and suggests optimal gate flows.
3. **Transportation Agent** (`@transit`): Monitors metropolitan rail terminals, coordinates parking loops, and optimizes local shuttle bus dispatches.
4. **Volunteer Copilot Agent** (`@volunteer`): Serves on-ground staff by providing instant Standard Operating Procedure (SOP) lookups via RAG and translating requests in over 10 languages.
5. **Emergency Coordinator Agent** (`@emergency`): Escalates security incidents, dispatches paramedic teams, and secures ingress paths for ambulances.
6. **Sustainability Agent** (`@sustainability`): Predicts organic waste overflows, optimizes water station refills, and dispatches rapid-response wet-spill cleaners.

---

## 🎨 Interactive Control Panel & Role-Based Viewports

StadiumMind AI features a highly responsive, multi-perspective operator dashboard that allows operators to experience the stadium ecosystem from various vantage points:

### 1. Multi-Agent Role Selector
Switch seamlessly between five active on-ground personas to audit specialized checklists, itineraries, and localized tools:
* **Operations Manager (`@manager`)**: The default high-level cockpit. Operators can trigger simulator presets (e.g., Gate 4 bottleneck, medical emergency, food spills) or dispatch custom natural language commands to watch Gemini orchestrate physical protocols in real-time.
* **Field Volunteer (`@volunteer`)**: Equipped with a live **Instant Translation Utility** (translating English inquiries into Spanish, French, or Japanese) and dynamic, contextual **SOP Checklist Playbooks** synchronized automatically with Vertex AI.
* **Tournament Fan (`@fan`)**: Displays personalized **Spectator Ticket Passes** (e.g., Seat details for MetLife Stadium, Sector B) alongside smart **Personalized Detour Advisories** directing them away from active crowd bottlenecks.
* **Emergency Ops (`@emergency`)**: Provides immediate visibility into **Paramedic GPS Logistics**, showing ETA timers, live corridor clear signals, and active responder logs.
* **Transit Admin (`@transit`)**: Monitors the active shuttle fleet occupancy, Metropolitan Line statuses, and fleet loop schedules.

### 2. High-Fidelity Interactive Stadium Map
An SVG-rendered interactive blueprint of the stadium. Clicking on any gate, sector, or first aid station triggers a detailed contextual popup overlay displaying:
* **Queue Telemetry**: Live and projected queue wait-times (e.g., Gate 4 displaying "18 mins" current vs "31 mins" projected bottleneck wait-times).
* **AI Action Recommendations**: Clear, actionable recommendations computed dynamically (e.g., "Open Gate 5 & redirect incoming spectator flow").
* **System Confidence**: Real-time confidence index for system cluster planning.
* **Color-Coded Statuses**: Visual feedback (Critical, Warning, Nominal) matching active telemetry states.

### 3. Live Ambient Telemetry Stream
When the system is idle (waiting for a simulator incident trigger), the terminal console is kept warm with a live baseline stream of ambient stadium logs. This feed aggregates updates from:
* **Core Supervisor**: Physical corridor occupancy assessments.
* **Transit Outlets**: Terminal schedules and fleet terminal status.
* **Volunteer Cognitive**: Rotational checklist validations.
* **Device Integrations**: Security scanner suites and speed performance telemetry.
* **Resource Control**: Eco-bin capacity metrics.

---

## 🛠️ Google Cloud & Data Architecture

The architecture is designed to be production-ready and fully scale on **Google Cloud Platform (GCP)**:

* **Reasoning Core**: Google Gemini 3.5 models configured with custom `responseSchema` for robust JSON output.
* **Orchestration**: Google Agent Development Kit (ADK) structure patterns mapped to an Express Node.js event bus.
* **Database & Memory**: Serverless **Firebase Firestore** powering active Blackboard logs, agent state caches, and telemetry indices.
* **RAG Engine**: **Vertex AI Search** providing semantic vector lookup over standard operating manuals and physical stadium blueprints.
* **Host Compute**: **Google Cloud Run** running containerized Node workloads with automated scale-to-zero configurations.
* **Maps Integration**: **Google Maps Platform** (Routes API, Places API, and Directions API) powering physical pathing.

---

## 🚀 Getting Started

This full-stack application includes an interactive React control panel and a secure backend simulation pipeline.

### Prerequisites
* **Node.js** (v18+)
* **NPM** (v9+)

### Installation
1. Install project dependencies:
   ```bash
   npm install
   ```

2. Configure your secret API Keys in your environment variables. Ensure your Gemini key is registered securely:
   ```env
   # .env
   GEMINI_API_KEY="your_api_key_here"
   ```

3. Launch the Express-Vite unified development server:
   ```bash
   npm run dev
   ```
   *The server binds to port `3000` and host `0.0.0.0`.*

### Building for Production
To bundle the frontend assets and compile the TypeScript server into a high-performance self-contained CommonJS target (`dist/server.cjs` via esbuild):
```bash
npm run build
```

Then start the production build:
```bash
npm run start
```
