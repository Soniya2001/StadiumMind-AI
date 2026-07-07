export interface BlueprintSection {
  id: string;
  title: string;
  number: number;
  category: "Vision & Problem" | "Agent Architecture" | "Cloud & Data Tech" | "Workflows & Journeys" | "Hackathon Execution";
  content: string;
}

export const BLUEPRINT_DATA: BlueprintSection[] = [
  {
    id: "executive_summary",
    title: "Executive Summary",
    number: 1,
    category: "Vision & Problem",
    content: `**StadiumMind AI** is an agentic, multi-agent operating system designed to elevate stadium operations and fans' experiences during the **FIFA World Cup 2026**. 

Instead of traditional, isolated chatbots that handle queries passively, StadiumMind AI orchestrates a **collaborative network of six specialized autonomous agents** built with the **Google Agent Development Kit (ADK)** and powered by **Gemini 2.5/3.5 models**. These agents work as a cohesive unit—continually observing crowd density, transit times, emergency alerts, safety markers, and food plaza waste levels to transform stadium management from a *reactive* system into a *proactive, autonomous operation*.

By unifying fans, volunteers, transit authorities, security networks, and sustainability operations, StadiumMind AI offers a production-grade, highly-available control plane. It ensures that 80,000+ passionate attendees navigate safely, queues dissolve rapidly, emergency responders find unobstructed routes, and waste resources are optimized in real-time.`
  },
  {
    id: "problem_analysis",
    title: "Problem Analysis",
    number: 2,
    category: "Vision & Problem",
    content: `The **FIFA World Cup 2026** will represent the largest sporting event in history, spanning 3 nations, 16 host cities, and featuring 48 teams. 

With stadium capacities reaching over 80,000 concurrent visitors, stadium infrastructure faces extreme operational bottlenecks. Key challenges include:
* **Hyper-Congestion**: Rapid spikes in pedestrian density at ticketing gates, restrooms, and concessions leading to long lines, safety risks, and physical delays.
* **Siloed Communication**: Incident responders, cleaning crews, transit managers, and volunteers currently work with separate communication channels, causing slow reaction times.
* **Language Barriers**: An influx of international fans with diverse language backgrounds creates massive friction for on-ground volunteers trying to offer directions or seat support.
* **Volatile Transit Demands**: Severe delays on key transit networks (metro corridors, parking shuttles) can instantly strand thousands of fans, forcing massive arrival spikes at entrances.`
  },
  {
    id: "pain_points",
    title: "Pain Points",
    number: 3,
    category: "Vision & Problem",
    content: `We map the real-world operational pain points across our seven core stakeholders:
1. **Fans**: Frustrated by blind queue times, lost items, confusing stadium layouts, and lack of real-time transit alternatives during outages.
2. **Volunteers**: Overwhelmed by changing scenarios, language barriers, and lack of immediate access to Standard Operating Procedures (SOPs) or security contacts.
3. **Stadium Operations Team**: Lacks a unified "single pane of glass" representing current crowd, transit, and infrastructure dynamics.
4. **Security Team**: Struggling to monitor gate barriers and high-density zones manually, resulting in late crowd packing responses.
5. **Medical Team**: Slow emergency response times due to dense pedestrian pathways blockading medical carts.
6. **Transportation Coordinators**: Uncoordinated shuttle dispatching leading to traffic jams and long waits.
7. **Sustainability Team**: Unpredicted concession waste buildup, garbage bin overflows, and hazardous liquid spills left unaddressed.`
  },
  {
    id: "solution_overview",
    title: "Solution Overview",
    number: 4,
    category: "Vision & Problem",
    content: `**StadiumMind AI** provides a complete, modern operational solution:
* **The Smart Stadium Control Plane**: An interactive dashboard showing live indicators (Crowd density, Transit delays, Sustainability indexes, and Emergency alerts).
* **Autonomous Multi-Agent Collaboration**: When an incident occurs, the system utilizes the **Google Agent Development Kit (ADK)** to initiate communication between specialized agents. For example:
  * The *Crowd Intelligence Agent* predicts a gate bottleneck.
  * It requests the *Transportation Agent* to reroute incoming shuttle drop-offs.
  * It tasks the *Volunteer Copilot Agent* to deploy on-ground staff with mobile scanners.
  * It instructs the *Fan Concierge Agent* to push personalized navigation reroutes and concession voucher incentives to approaching fans.
* **Voice and Multilingual Interaction**: Integrated translation services and speech synthesis so volunteers and international fans receive instructions in native tongues.`
  },
  {
    id: "multi_agent_architecture",
    title: "Detailed Multi-Agent Architecture",
    number: 5,
    category: "Agent Architecture",
    content: `The core of the system is built on a decentralized, event-driven multi-agent framework. Each agent is modeled with:
1. **Role & Identity**: Pinned via a system instruction establishing behavior, boundaries, and domain expertise.
2. **Goal & Metrics**: High-level objectives that guide planning.
3. **Tools (Function Declarations)**: Encapsulated APIs the agent can execute (e.g. \`dispatchEMS\`, \`rerouteShuttleBuses\`).
4. **Shared/Private Memory**: Short-term conversational context and access to persistent Firestore states.
5. **Inter-Agent Message Bus**: Event channels allowing agents to post requests to other agents (e.g., \`crowd\` → \`transit\`).`
  },
  {
    id: "agent_responsibilities",
    title: "Responsibilities of every AI Agent",
    number: 6,
    category: "Agent Architecture",
    content: `Below are the specific operational domains for each of our six agents:

| Agent Name | Operational Focus | Primary Goal | Critical Tools |
| :--- | :--- | :--- | :--- |
| **Fan Concierge** | Individual fan guidance | Minimize friction, offer seats, merchandise, and Lost & Found assistance | \`updateFanItinerary\`, \`translateInboundQuery\`, \`getSeatDirections\` |
| **Crowd Intelligence** | Stadium-wide density | Prevent bottlenecks and optimize queues at entrances and concourses | \`analyzeCrowdDensity\`, \`predictQueueDynamics\`, \`optimizeGateFlow\` |
| **Transportation** | External transit loops | Keep shuttle, rideshare, parking, and metro routes highly optimized | \`rerouteShuttleBuses\`, \`monitorTransitSystem\`, \`getParkingCapacity\` |
| **Volunteer Copilot** | Volunteer enablement | Retrieve SOPs, translate on-ground requests, and dispatch staff | \`getSOPGuidance\`, \`broadcastVolunteerAlert\`, \`logFieldIncident\` |
| **Emergency Coordinator** | Safety & medical issues | Fast-track EMS routing, security dispatch, and incident logging | \`dispatchEMS\`, \`escalateSecurityIncident\`, \`triggerEvacuationGuide\` |
| **Sustainability** | Waste & energy loops | Optimize cleaning routes, monitor water refills, and predict concession waste | \`monitorBinCapacity\`, \`triggerBinPickup\`, \`predictFoodWaste\` |`
  },
  {
    id: "agent_communication",
    title: "How Agents Communicate",
    number: 7,
    category: "Agent Architecture",
    content: `StadiumMind AI agents do not act as isolated silos; they communicate via an **Agent-to-Agent Message Broker** implemented over Firestore:
* **Direct Handshakes**: Agents can issue targeted requests to another agent. For example, when the *Emergency Coordinator* dispatches EMS to Sector B, it messages the *Crowd Intelligence Agent* to clear Vomitory B-East:
  \`\`\`json
  {
    "sender": "emergency_coordinator",
    "recipient": "crowd_intelligence",
    "topic": "clear_emergency_corridor",
    "payload": { "zone": "Zone_B", "priority": "Critical" }
  }
  \`\`\`
* **Shared Blackboard System**: A central Firestore-backed 'Blackboard' stores the global operational state. All agents subscribe to Blackboard updates.
* **Context-Preserving Chains**: If an action is taken by one agent, the context (original incident, tool results, agent thoughts) is appended to the prompt of the secondary agent, ensuring seamless reasoning across agent bounds.`
  },
  {
    id: "google_adk_architecture",
    title: "Google ADK Architecture",
    number: 8,
    category: "Agent Architecture",
    content: `The application leverages the **Google Agent Development Kit (ADK)** paradigm to structure the orchestration:
* **Agent Declarations**: Agents are defined as logical units with standard structures.
* **Router Model**: We implement a supervisor model where Gemini acts as the router, mapping incoming incident signals to agent tool calls or peer-to-peer message events.
* **Custom Tool Bindings**: ADK translates TypeScript function declarations into Gemini-compatible \`FunctionDeclaration\` JSON structures, allowing the LLM to trigger real-world APIs.
* **Memory Blocks**: Uses ADK's memory manager to maintain short-term state, preventing context pollution while retaining critical operational updates.`
  },
  {
    id: "system_architecture_diagram",
    title: "System Architecture Diagram",
    number: 9,
    category: "Agent Architecture",
    content: `The logical architecture of StadiumMind AI is divided into four distinct layers:

\`\`\`
   +--------------------------------------------------------------------+
   |                       CLIENT LAYER (React + Vite)                  |
   |   - Operational Dashboard  - Live Map  - Active Incident Tracker   |
   |   - Real-Time Simulation Logs  - Google Maps & Lucide Icons        |
   +---------------------------------+----------------------------------+
                                     | (Secure REST / SSE APIs)
                                     v
   +--------------------------------------------------------------------+
   |                     BACKEND LAYER (Express + Node.js)              |
   |   - Express API Routes (/api/simulate)  - Session Manager          |
   |   - Simulated State & Blackboard - Local File System Cache        |
   +---------------------------------+----------------------------------+
                                     | (@google/genai SDK Integration)
                                     v
   +--------------------------------------------------------------------+
   |                      ORCHESTRATION LAYER (Google ADK)              |
   |   - Gemini 3.5 Flash Reasoning Engine                              |
   |   - Tool Declarations & Functional Parser                          |
   |   - Multi-Agent Message Broker & Sequential Planner                |
   +---------------------------------+----------------------------------+
                                     | (Google Cloud Ecosystem)
                                     v
   +--------------------------------------------------------------------+
   |                        DATA & CLOUD STORAGE LAYER                  |
   |   - Cloud Run (Hosting)  - Firestore (State & Memory)              |
   |   - Vertex AI Search (SOP RAG)  - Google Maps Platform APIs        |
   +--------------------------------------------------------------------+
\`\`\``
  },
  {
    id: "google_cloud_architecture",
    title: "Google Cloud Architecture",
    number: 10,
    category: "Cloud & Data Tech",
    content: `StadiumMind AI is designed to run in a fully cloud-native, high-availability architecture on **Google Cloud Platform (GCP)**:
* **Compute (Cloud Run)**: Express.js server runs inside fully-managed, scale-to-zero Docker containers, assuring low cost during idle periods and rapid scaling during event hours.
* **Database (Firestore)**: Serverless NoSQL document database configured in Multi-Region mode for ultra-low latency real-time listeners.
* **RAG Search (Vertex AI Search)**: Indexes stadium maps, volunteer SOP guidelines, and metro operating schedules.
* **Edge Routing (Cloud Load Balancing & Cloud Armor)**: Protects against DDoS attacks and handles SSL terminations.
* **Logging & Telemetry (Cloud Logging)**: Captures agent decision trails, prompt token usage, and API latency for real-time compliance audits.`
  },
  {
    id: "tech_stack",
    title: "Tech Stack",
    number: 11,
    category: "Cloud & Data Tech",
    content: `The technology stack utilizes highly optimized, modern framework layers:
* **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS 4, and Motion for sleek, responsive transitions and interactive bento grids.
* **Icons**: Lucide React for consistent vector symbols.
* **Backend**: Node.js, Express 4, and TypeScript Execution (\`tsx\`) for server-side endpoints.
* **Orchestration**: \`@google/genai\` SDK using \`gemini-3.5-flash\` for lightning-fast structured JSON generation.
* **Build System**: ESBuild for compiling typescript server endpoints into self-contained CommonJS (\`dist/server.cjs\`) ensuring fast container startup.`
  },
  {
    id: "database_schema",
    title: "Database Schema",
    number: 12,
    category: "Cloud & Data Tech",
    content: `The data storage leverages **Firestore** structured collections. Since Firestore is a document-oriented NoSQL database, the schema maps logical objects into clean, nested documents:

1. **Incidents Collection**: Tracks current emergencies or operational hurdles.
2. **AgentStates Collection**: Tracks busy/idle status, active tasks, and private memories of each of the 6 agents.
3. **Blackboard Collection**: Multi-agent shared message board.
4. **VolunteerSchedules Collection**: Tracks volunteer check-ins, language qualifications, and sector assignments.`
  },
  {
    id: "firestore_collections",
    title: "Firestore Collections Structure",
    number: 13,
    category: "Cloud & Data Tech",
    content: `The Firestore Document Structure is defined as follows:

### \`/incidents/{incidentId}\`
\`\`\`json
{
  "id": "inc_90124",
  "title": "Gate 4 Congestion Bottleneck",
  "status": "ACTIVE",
  "severity": "CRITICAL",
  "createdTime": "2026-07-06T22:50:00Z",
  "resolvedTime": null,
  "zone": "North_Gate4",
  "assignedAgents": ["crowd", "transit", "volunteer"]
}
\`\`\`

### \`/agent_states/{agentId}\`
\`\`\`json
{
  "agentId": "transit",
  "name": "Transportation Agent",
  "status": "BUSY",
  "lastActiveTime": "2026-07-06T22:55:00Z",
  "currentTask": "Rerouting loop 4 buses to loops 3 and 5",
  "memory": {
    "shuttleCapacity": 450,
    "activeFleetSize": 45
  }
}
\`\`\`

### \`/blackboard_messages/{messageId}\`
\`\`\`json
{
  "messageId": "msg_88124",
  "sender": "crowd",
  "recipient": "transit",
  "timestamp": "2026-07-06T22:55:10Z",
  "topic": "transit_re-route_required",
  "payload": {
    "congestedZone": "North_Plaza",
    "suggestedAlternateDropoff": "East_Gate3"
  }
}
\`\`\``
  },
  {
    id: "apis_required",
    title: "APIs Required",
    number: 14,
    category: "Cloud & Data Tech",
    content: `The platform integrates multiple external Google and stadium APIs:
* **Gemini Developer API**: Powers agent planning and chat logic.
* **Google Maps Platform (Places, Routes, Directions)**: Used to fetch pedestrian pathways, route shuttle fleets, and guide fans to parking/metro.
* **Google Cloud Translation API**: Auto-translates foreign languages for volunteers and Fan Concierge.
* **IoT Sensor APIs (Mocked/Simulated)**: Camera feeds (for Crowd density metrics), Digital Trash Can sensors (for Sustainability monitoring), and Metro status feeds.`
  },
  {
    id: "prompt_engineering_strategy",
    title: "Prompt Engineering Strategy",
    number: 15,
    category: "Agent Architecture",
    content: `To achieve reliable output, we utilize the following prompt engineering techniques:
* **Role-Based Framing**: Explicitly instructing the model to adopt a specific operational persona (e.g. "You are the Stadium Medical Dispatch Coordinator...").
* **Few-Shot Tool Usage**: Outlining example inputs and outputs for complex tool invocation chains.
* **Strict Schema Enforcement**: Utilizing \`responseSchema\` and \`responseMimeType: "application/json"\` to guarantee that Gemini's output can be programmatically parsed and mapped directly to our UI components.
* **Chain-of-Thought (CoT)**: Instructing agents to output their inner thoughts and reasoning BEFORE outputting their decisions or message payloads, reducing hallucinations and improving tactical coordination.`
  },
  {
    id: "rag_design",
    title: "RAG Design (Retrieval Augmented Generation)",
    number: 16,
    category: "Agent Architecture",
    content: `Standard Gemini reasoning is enriched with real-time domain knowledge using a vector-based **RAG architecture**:
* **Vector Embeddings (Vertex AI Embeddings)**: Guides, manuals, and layout coordinates are segmented into 500-token chunks and converted to 768-dimension vectors.
* **Vector Store (Firestore + pgvector or Vertex AI Vector Search)**: Stores vectors for semantic similarity searches.
* **Runtime Retrieval**: When the *Volunteer Copilot* gets an emergency request, it runs a semantic search query (e.g., "What is the procedure for an unconscious fan?"). The top 3 matching chunks from the SOP document database are retrieved and injected into the Gemini context window as trusted references.`
  },
  {
    id: "memory_architecture",
    title: "Memory Architecture",
    number: 17,
    category: "Agent Architecture",
    content: `Our agentic system maintains memory at three hierarchical levels:
* **Short-Term Context**: Inside the current execution thread, keeping track of active peer-to-peer messages and tool responses.
* **Session-Level Blackboard**: Saved in Firestore, tracking current active incident histories, status changes, and general team allocations. Allows late-joining agents to instantly catch up on what other agents have already executed.
* **Long-Term Memory**: Historical telemetry data stored in BigQuery, logging completed incident logs, average response times, and volunteer shift performance to improve future models.`
  },
  {
    id: "authentication_flow",
    title: "Authentication Flow",
    number: 18,
    category: "Cloud & Data Tech",
    content: `StadiumMind AI utilizes **Firebase Authentication** to secure our operational dashboard:
* **Role-Based Credentials**: Different dashboards are locked behind specific user claims (e.g., Fan UI vs. On-ground Volunteer UI vs. Stadium Director Control Console).
* **ID Token Verification**: Express server verifies the Firebase ID Token (\`Bearer <token>\`) in the Authorization header on every API route request, utilizing \`firebase-admin\`.
* **Single Sign-On (SSO)**: Supports standard Google Accounts and FIFA Match Ticket ID credentials during event check-ins.`
  },
  {
    id: "frontend_architecture",
    title: "Frontend Architecture",
    number: 19,
    category: "Cloud & Data Tech",
    content: `The React frontend is optimized for speed, clarity, and high-density information display:
* **Modular Code Structure**: Components are split into logical files to prevent code bloat:
  * \`App.tsx\`: Layout, tabs, dashboard grid, and system setup.
  * \`MapVisualization.tsx\`: Clean interactive SVG map rendering stadium zones.
  * \`ConsoleTerminal.tsx\`: Terminal-style feed showing agent thoughts and communication logs.
  * \`BlueprintConsole.tsx\`: Detailed rendering of the 32 blueprint sections with structural categorization.
* **Responsive Layout**: Fluid CSS Grid that adapts dynamically from desktop wide-screens to narrow mobile views (essential for on-ground volunteers).`
  },
  {
    id: "backend_architecture",
    title: "Backend Architecture",
    number: 20,
    category: "Cloud & Data Tech",
    content: `The Express.js backend handles proxying, simulation setups, and static file serving:
* **Lazy SDK Instantiation**: The \`@google/genai\` library client is only instantiated when an active simulation request is triggered, checking for \`process.env.GEMINI_API_KEY\` and falling back gracefully on simulated data.
* **Production Static Serving**: Compiles code into \`dist/\`, using Express static middleware to serve files efficiently in Cloud Run production environments on a unified port 3000.
* **Express v4 Routing**: Simple API route handling, ensuring correct JSON parsing and error response propagation back to the client.`
  },
  {
    id: "deployment_architecture",
    title: "Deployment Architecture",
    number: 21,
    category: "Cloud & Data Tech",
    content: `Our CI/CD and deployment flow uses standard enterprise pipelines:
* **Containerization (Docker)**: A lightweight Dockerfile bundles the Node.js runtime, installs package dependencies, runs the ESBuild server bundling step, and exposes port 3000.
* **Cloud Build & Artifact Registry**: Automatically builds container images on GitHub push, registers them in GCP Artifact Registry, and deploys to **Cloud Run**.
* **Global Edge CDN**: Firebase Hosting is used to serve public web assets, proxying backend requests to the Cloud Run server endpoint.`
  },
  {
    id: "sequence_diagrams",
    title: "Sequence Diagrams",
    number: 22,
    category: "Workflows & Journeys",
    content: `A visual walkthrough of the event-to-resolution sequence inside StadiumMind AI:

\`\`\`
[SOP Hazard] ---> (Sensing/Volunteer log) ---> [StadiumMind API]
                                                      |
                                                      v
                                            [Gemini 3.5 Flash]
                                            (Role-Based Analysis)
                                                      |
                 +-------------------+----------------+--------------------+
                 |                   |                                     |
                 v                   v                                     v
         [Crowd Agent]        [Transit Agent]                     [Volunteer Agent]
      - analyzeCrowd()      - rerouteShuttle()                   - getSOPGuidance()
                 |                   |                                     |
                 +-------------------+----------------+--------------------+
                                                      | (Collectively Planned)
                                                      v
                                             [Action Dispatch]
                                        (Volunteers / Crew / Fans)
\`\`\``
  },
  {
    id: "user_journeys",
    title: "User Journeys",
    number: 23,
    category: "Workflows & Journeys",
    content: `We map the user journeys for two primary on-ground stakeholders during a crisis:

### 1. Alejandro (Volunteer from Spain, based at Gate 4)
* **Goal**: Understand why crowds are backing up and help fans navigate.
* **Experience**: Receives a voice translation alert on his mobile phone: "Gate 4 Bottleneck detected. Access SOP-204." The copilot shows him the exact walking path to Gates 3 & 5. He directs fans easily, reading directions translated from Spanish.

### 2. Soniya (Fan arriving via Metro Green Line)
* **Goal**: Arrive at her seat safely before kick-off.
* **Experience**: Receives an app alert: "Metro delayed, but StadiumMind auxiliary buses are waiting outside. Keep walking 200m." App redirects her map to Gate 3. She enters in 4 minutes, avoiding the heavy Gate 4 congestion entirely.`
  },
  {
    id: "demo_scenario",
    title: "Demo Scenario",
    number: 24,
    category: "Workflows & Journeys",
    content: `To effectively demonstrate the platform during a hackathon, we present four high-fidelity simulation presets:
1. **Gate 4 Bottleneck**: Highlights Crowd Intelligence identifying bottlenecking, Transit Agent rerouting buses, and Volunteer Copilot deploying scanner reinforcements.
2. **Medical Emergency**: Demonstrates Volunteer reporting an issue, Emergency coordinator dispatching paramedics, and Crowd agent diverting traffic to clear the ingress lane.
3. **Metro Suspension**: Displays Transit Agent coordinating 45 backup buses, and Fan Concierge sending geo-fenced routes and discount concession coupons to split crowds.
4. **Plaza Spill**: Shows Sustainability Agent coordinating immediate wet spill cleanups and Trash bin operations, while Volunteers set safety markers.`
  },
  {
    id: "judging_criteria",
    title: "Judging Criteria Mapping",
    number: 25,
    category: "Hackathon Execution",
    content: `How StadiumMind AI maps to standard hackathon evaluation metrics:
* **Impact & Relevance**: Directly solves critical safety, congestion, and operational friction for the world's largest sporting event.
* **Technology Implementation**: Pristine showcase of Google's newest ecosystem tools (ADK, Gemini 3.5, Firestore, Cloud Run).
* **Innovation & Originality**: Pivots from standard simple chatbots to a comprehensive Multi-Agent Operating System with real collaboration logs.
* **Design & UX**: Sleek, responsive, professional dashboard utilizing Inter and mono typography with a clean, cohesive slate theme.`
  },
  {
    id: "innovation_points",
    title: "Innovation Points",
    number: 26,
    category: "Vision & Problem",
    content: `Our innovative features set StadiumMind AI apart from typical hackathon ideas:
* **The Inter-Agent Message Broker**: Multi-agent collaborative reasoning logs showing exactly how independent systems coordinate.
* **Predictive Simulation Integration**: Integrating real-time sensor variables (mocked queue lengths, transit logs) to feed Gemini's planning context.
* **Role-Claimed Unified Console**: A single dashboard that elegantly partitions operational state data for fans, volunteers, and command staff.`
  },
  {
    id: "future_scalability",
    title: "Future Scalability",
    number: 27,
    category: "Hackathon Execution",
    content: `Post-hackathon development can scale StadiumMind AI globally:
* **Multimodal Camera Integrations (Gemini Veo/Vision)**: Feeding direct security camera video chunks into Gemini to auto-identify slips, fights, or ticket gate overcrowding without human operators.
* **Vertex AI Search expansion**: Deep search integration across thousands of local stadium regulations, police guidelines, and public transport schedules.
* **Dynamic Digital Twins**: Fully three-dimensional mapping of stadium zones integrated with active IoT sensors.`
  },
  {
    id: "potential_challenges",
    title: "Potential Challenges",
    number: 28,
    category: "Hackathon Execution",
    content: `Critical challenges and how we proactively address them:
* **LLM Response Latency**: Solved by utilizing the highly optimized, fast \`gemini-3.5-flash\` model, reducing response times to under 1.5 seconds.
* **Network Failures inside Stadiums**: Resolved by incorporating a local service-worker cache on the mobile frontend, allowing volunteers to view offline SOPs if cellular networks fail.
* **Hallucinations during Emergencies**: Solved by utilizing RAG and strict context grounding, forcing Gemini to retrieve and rely entirely on registered SOP documents.`
  },
  {
    id: "architecture_decisions",
    title: "Architecture Decisions & Trade-Offs",
    number: 29,
    category: "Hackathon Execution",
    content: `Key architectural trade-offs made during development:
* **Firestore NoSQL vs. PostgreSQL Relational**: We selected **Firestore** by default to allow near-instant data listener setups and lightning-fast developer onboarding.
* **Model Selection (Gemini Flash vs. Pro)**: We chose **Gemini 3.5 Flash** for active reasoning due to its significantly lower cost, faster API turnaround, and complete support for structured JSON schemas.
* **Unified Full-Stack Container vs. Separate Microservices**: A single Express-Vite backend container was chosen to simplify deployments and assure port-3000 compliance inside sandboxed environments.`
  },
  {
    id: "hackathon_roadmap",
    title: "Hackathon Implementation Roadmap",
    number: 30,
    category: "Hackathon Execution",
    content: `A 36-hour execution plan for a 3-5 person development team:

* **Hours 0-6 (Setup & Architecture)**: Bootstrap the React frontend and Express server, setup the Firestore blueprint collections, and establish Gemini SDK config.
* **Hours 6-18 (Core Coding)**: Code the frontend operational dashboard, design the interactive stadium SVG maps, and build the custom server-side simulation endpoints.
* **Hours 18-30 (Agent Orchestration & RAG)**: Program the multi-agent planning loops and tool bindings. Load volunteer SOP files into Vertex AI Search.
* **Hours 30-36 (Testing, Tuning & Video)**: Optimize UI animations, test prompt parameters to prevent injection, record the final video walkthrough, and deploy to Cloud Run.`
  },
  {
    id: "mvp_features",
    title: "MVP Features",
    number: 31,
    category: "Hackathon Execution",
    content: `Our Minimum Viable Product (MVP) implements:
* **Operational Control Console**: Interactive grid with stadium status lights.
* **Interactive SVG map**: Dynamic zone markers reflecting active incidents.
* **Gemini-Powered Multi-Agent Simulator**: Secure backend \`/api/simulate\` endpoint showing real agent-to-agent collaboration traces.
* **Comprehensive Documentation Center**: Direct in-app display of the 32-point stadium architectural design.`
  },
  {
    id: "advanced_features",
    title: "Advanced Features for Scaling",
    number: 32,
    category: "Hackathon Execution",
    content: `If additional development time is available, we would integrate:
* **Live WebSockets Integration**: Instant Blackboard updates pushing server changes to clients in real-time.
* **Full Vertex AI Search index binding**: Connecting real files (PDF guides) for live Retrieval-Augmented Generation.
* **Text-To-Speech (TTS) voice announcements**: Broadcasting translated agent directives directly through volunteer headsets using prebuilt voices (\`Zephyr\` or \`Kore\`).`
  }
];
