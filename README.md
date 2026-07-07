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
