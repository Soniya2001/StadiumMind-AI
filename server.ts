import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const PORT = 3000;

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Vite requires unsafe-inline in dev mode
}));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json());
app.use("/api/", apiLimiter);

// Lazy-initialize Gemini API to prevent crashes on startup if key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Using mocked responses.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Preset simulation scenarios for FIFA World Cup 2026 stadium operations
const PRESET_SCENARIOS = {
  gate_bottleneck: {
    title: "Gate 4 Bottleneck during Match Entrance",
    description: "Gate 4 is experiencing high congestion with wait times exceeding 45 minutes due to ticket scanner hardware failure and heavy fan arrival. Kick-off is in 30 minutes.",
    systemContext: "A crowd bottleneck at Gate 4. Crowd Intelligence predicts 60-minute wait. Ticket scanners failed. Fans are frustrated. Organizers need to redirect flow to Gates 3 and 5.",
  },
  medical_incident: {
    title: "Zone B Grandstand Medical Incident",
    description: "A spectator in Zone B shows signs of heat exhaustion and faintness. Crowd density is high, making access difficult for standard response teams.",
    systemContext: "Spectator in Zone B with suspected heat exhaustion. Density is high. Need medical dispatch, localized crowd management, and clear pathway. Volunteers nearby need instructions.",
  },
  transit_delay: {
    title: "Metro Line Green Shuttle Suspension",
    description: "A temporary suspension on the main metro transit corridor causes a sudden delay for 15,000 incoming fans waiting at the terminal station. Kick-off is in 1.5 hours.",
    systemContext: "Main transit corridor suspension. 15,000 fans stranded. Transportation Agent needs to coordinate auxiliary shuttle buses, update fan routes, and Crowd Agent prepares gates.",
  },
  sustainability_spill: {
    title: "Concession Area Food Waste & Clean Overflow",
    description: "High-density crowd at the Zone C food plaza leads to massive waste buildup, overflowing bins, and a liquid spill causing slip-and-fall hazards.",
    systemContext: "Zone C food plaza waste overflow and liquid spill hazard. Sustainability Agent needs to dispatch cleaning crews, optimize bin collections, and alert safety/volunteers.",
  }
};

// API Route for simulating multi-agent operations
app.post("/api/simulate", async (req, res) => {
  const { scenarioId, customPrompt } = req.body;
  
  let title = "Custom Operational Incident";
  let description = customPrompt || "A custom operational request received by the StadiumMind OS.";
  let context = customPrompt;

  if (scenarioId && PRESET_SCENARIOS[scenarioId as keyof typeof PRESET_SCENARIOS]) {
    const preset = PRESET_SCENARIOS[scenarioId as keyof typeof PRESET_SCENARIOS];
    title = preset.title;
    description = preset.description;
    context = preset.systemContext;
  }

  // Fallback / Mock response if Gemini API key is missing
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY" || process.env.GEMINI_API_KEY === "MOCK_KEY") {
    console.log("Gemini API Key is not set or placeholder. Returning simulated high-fidelity mock response.");
    return res.json(getMockSimulationResponse(title, description, scenarioId));
  }

  try {
    const ai = getGeminiClient();
    
    const prompt = `
You are the central orchestrator of "StadiumMind AI" — a collaborative Multi-Agent AI Operating System for Smart Stadiums during the FIFA World Cup 2026.
Simulate a detailed, step-by-step collaborative reasoning and action sequence among our six specialized agents in response to the following incident:

INCIDENT TITLE: ${title}
INCIDENT DESCRIPTION: ${description}
OPERATIONAL CONTEXT: ${context}

Our Six AI Agents:
1. Fan Concierge Agent ("fan"): Assists fans with navigation, seats, multi-lingual translations, lost & found, and schedules.
2. Crowd Intelligence Agent ("crowd"): Monitors density, predicts queue times, bottlenecks, and suggests gates or staff deployment.
3. Transportation Agent ("transit"): Coordinates transit connections, metro, shuttle buses, and parking lots.
4. Volunteer Copilot Agent ("volunteer"): Guides on-ground volunteers, provides Standard Operating Procedures (SOPs), translates, and registers reports.
5. Emergency Coordinator Agent ("emergency"): Handles medical, security incidents, dispatches resources, and coordinates evacuations.
6. Sustainability Agent ("sustainability"): Predicts food waste, schedules cleanup crews, optimizes water/energy/trash bins.

Your output MUST be a structured JSON object representing a sequence of 6 to 10 sequential steps where these agents talk to each other, call tools, and make decisions to solve the problem as an intelligent system. 
Each agent must act in character, utilizing their role, goal, and tools. Let them communicate directly with other agents to solve the issue.

The output MUST conform exactly to this JSON schema:
{
  "scenarioTitle": "String title",
  "scenarioDescription": "String description",
  "globalStatus": {
    "crowdLevel": "Normal" | "Moderate" | "High" | "Critical",
    "transitStatus": "On Time" | "Delayed" | "Rerouted",
    "safetyStatus": "Secure" | "Alert" | "Emergency",
    "sustainabilityIndex": Integer from 0 to 100
  },
  "steps": [
    {
      "agentId": "fan" | "crowd" | "transit" | "volunteer" | "emergency" | "sustainability",
      "agentName": "e.g., Crowd Intelligence Agent",
      "actionType": "THINKING" | "TOOL_CALL" | "COMMUNICATION" | "DECISION",
      "message": "A summary sentence of what this agent is doing or stating.",
      "details": "Deep explanation of the reasoning, the message body, or tool results. Write this in a technical, highly professional, and contextual manner.",
      "targetAgentId": "Optional target agentId (e.g., 'transit') if actionType is COMMUNICATION",
      "toolName": "Optional tool name if actionType is TOOL_CALL (e.g., 'predictQueueDynamics', 'dispatchEMS', 'getSOPGuidance', 'rerouteShuttleBuses', 'updateFanItinerary', 'triggerBinPickup')",
      "toolArgs": "Optional key-value object of tool parameters if TOOL_CALL"
    }
  ],
  "finalPlan": {
    "title": "Overall Action Plan Title",
    "description": "Short explanation of the resolution.",
    "actions": [
      {
        "owner": "Agent or Team name, e.g., 'Crowd Intelligence / Volunteer Team'",
        "task": "The specific task to execute.",
        "priority": "Low" | "Medium" | "High" | "Critical"
      }
    ]
  }
}

Write highly realistic agent dialogue, professional tool definitions, and extremely logical steps that demonstrate true multi-agent synergy! Ensure all text values are valid JSON.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["scenarioTitle", "scenarioDescription", "globalStatus", "steps", "finalPlan"],
          properties: {
            scenarioTitle: { type: Type.STRING },
            scenarioDescription: { type: Type.STRING },
            globalStatus: {
              type: Type.OBJECT,
              required: ["crowdLevel", "transitStatus", "safetyStatus", "sustainabilityIndex"],
              properties: {
                crowdLevel: { type: Type.STRING, enum: ["Normal", "Moderate", "High", "Critical"] },
                transitStatus: { type: Type.STRING, enum: ["On Time", "Delayed", "Rerouted"] },
                safetyStatus: { type: Type.STRING, enum: ["Secure", "Alert", "Emergency"] },
                sustainabilityIndex: { type: Type.INTEGER }
              }
            },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["agentId", "agentName", "actionType", "message", "details"],
                properties: {
                  agentId: { type: Type.STRING, enum: ["fan", "crowd", "transit", "volunteer", "emergency", "sustainability"] },
                  agentName: { type: Type.STRING },
                  actionType: { type: Type.STRING, enum: ["THINKING", "TOOL_CALL", "COMMUNICATION", "DECISION"] },
                  message: { type: Type.STRING },
                  details: { type: Type.STRING },
                  targetAgentId: { type: Type.STRING, enum: ["fan", "crowd", "transit", "volunteer", "emergency", "sustainability"] },
                  toolName: { type: Type.STRING },
                  toolArgs: { type: Type.OBJECT }
                }
              }
            },
            finalPlan: {
              type: Type.OBJECT,
              required: ["title", "description", "actions"],
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                actions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["owner", "task", "priority"],
                    properties: {
                      owner: { type: Type.STRING },
                      task: { type: Type.STRING },
                      priority: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini API");
    }
    
    const parsedData = JSON.parse(resultText.trim());
    return res.json(parsedData);

  } catch (error: any) {
    console.error("Error in Gemini Simulation API:", error);
    // Return a solid mock on failure so the UI never crashes
    return res.status(500).json({
      error: error.message || "Failed to run simulation.",
      fallback: getMockSimulationResponse(title, description, scenarioId)
    });
  }
});

// Mock simulation response builder for safe fallbacks or when API Key is missing
function getMockSimulationResponse(title: string, description: string, scenarioId?: string) {
  let crowdLevel: 'Normal' | 'Moderate' | 'High' | 'Critical' = "Moderate";
  let transitStatus: 'On Time' | 'Delayed' | 'Rerouted' = "On Time";
  let safetyStatus: 'Secure' | 'Alert' | 'Emergency' = "Secure";
  let sustainabilityIndex = 88;
  
  let steps: any[] = [];
  let actions: any[] = [];
  let planTitle = "System Coordination Plan";
  let planDesc = "Coordinating resources across transport, volunteer, and safety sectors.";

  if (scenarioId === "gate_bottleneck") {
    crowdLevel = "Critical";
    safetyStatus = "Alert";
    planTitle = "Dynamic Gate Flow Optimization";
    planDesc = "Rerouting incoming fans from Gate 4 to Gate 3 and 5, updating tickets via app, and deploying dynamic volunteers on-ground.";
    
    steps = [
      {
        agentId: "crowd",
        agentName: "Crowd Intelligence Agent",
        actionType: "TOOL_CALL",
        message: "Triggered Crowd Density Analysis on North Plaza cameras.",
        details: "Crowd density index is 9.2/10 at Gate 4. Queue size exceeds 2,400 fans. Congestion time is 52 minutes. The root cause is suspected hardware scanner lockups.",
        toolName: "analyzeCrowdDensity",
        toolArgs: { cameraZone: "Zone_North_Gate4", resolution: "high" }
      },
      {
        agentId: "crowd",
        agentName: "Crowd Intelligence Agent",
        actionType: "COMMUNICATION",
        message: "Alerted the Volunteer Copilot and Transportation Agents regarding high bottleneck risk.",
        details: "Dynamic congestion predicted. Requesting immediate gate diversion of upcoming shuttle arrivals, and requesting physical volunteer deployment to redirect fan queues.",
        targetAgentId: "volunteer"
      },
      {
        agentId: "transit",
        agentName: "Transportation Agent",
        actionType: "TOOL_CALL",
        message: "Rerouted SoFi shuttle drops from Gate 4 Loop to Gate 3 Terminal.",
        details: "Executed real-time transit routing tool. Redirected 12 incoming active buses to drop off at North-East Gate 3 and West Gate 5 loops, reducing inflow pressure at Gate 4 by 40%.",
        toolName: "rerouteShuttleBuses",
        toolArgs: { fromLoop: "Loop_4", toLoops: ["Loop_3", "Loop_5"] }
      },
      {
        agentId: "volunteer",
        agentName: "Volunteer Copilot Agent",
        actionType: "TOOL_CALL",
        message: "Retrieved Gate Diversion SOP and dispatched emergency team instructions.",
        details: "Fetched 'SOP-204-GateCongestion' from Vertex AI Search. Formulated multi-lingual briefing and pushed notification to 24 free volunteers in North sector to relocate with mobile scanners.",
        toolName: "getSOPGuidance",
        toolArgs: { sopId: "SOP-204-GateCongestion", language: "en" }
      },
      {
        agentId: "fan",
        agentName: "Fan Concierge Agent",
        actionType: "TOOL_CALL",
        message: "Pushed geo-fenced mobile notifications to fans approaching Gate 4.",
        details: "Triggered push notification 'Gate 4 highly active. Please navigate to Gate 3 or 5 for rapid entry of under 5 minutes.' Adjusted itinerary guides and digital seat paths for 4,200 affected users.",
        toolName: "updateFanItinerary",
        toolArgs: { targetZones: ["North_Approach"], action: "redirect_gates_3_5" }
      },
      {
        agentId: "emergency",
        agentName: "Emergency Coordinator Agent",
        actionType: "DECISION",
        message: "Dispatched standby security team to manage Gate 4 barrier lanes.",
        details: "Assessed bottleneck tension. Directed 8 security officers to Gate 4 to maintain orderly queues, assist with manual ticket checks, and prevent barrier packing as a pre-emptive safety measure.",
      }
    ];
    
    actions = [
      { owner: "Transportation Team", task: "Redirect Shuttle Drop-offs 4 to Terminal 3 & 5", priority: "High" },
      { owner: "Volunteer Corps", task: "Deploy 24 volunteers with mobile ticket scanners to Gate 4 queues", priority: "Critical" },
      { owner: "Fan Communication", task: "Push real-time alert to all approaching app holders", priority: "High" },
      { owner: "Security Team", task: "Establish queue-spacing barriers at Gate 4 Entrance", priority: "Medium" }
    ];
  } else if (scenarioId === "medical_incident") {
    crowdLevel = "High";
    safetyStatus = "Emergency";
    planTitle = "Rapid Response Medical Dispatch";
    planDesc = "Clearing transit lanes, dispatching immediate emergency first-responders to Zone B, and guiding volunteers to assist the patient.";
    
    steps = [
      {
        agentId: "volunteer",
        agentName: "Volunteer Copilot Agent",
        actionType: "COMMUNICATION",
        message: "Reported medical incident in Grandstand Zone B, Row 14.",
        details: "Incident reported by Volunteer #1128: Male spectator, ~30 years old, suffering severe dizziness, hyperventilation, and mild loss of consciousness. Requesting immediate medical dispatch.",
        targetAgentId: "emergency"
      },
      {
        agentId: "emergency",
        agentName: "Emergency Coordinator Agent",
        actionType: "TOOL_CALL",
        message: "Dispatched Stadium Medical Team B (First Responders) to Sector B.",
        details: "Assessed density and access. Dispatched 2 nearest paramedics from First Aid Post 2 with a specialized electric medical cart. ETA: 3 minutes 15 seconds.",
        toolName: "dispatchEMS",
        toolArgs: { unitId: "Unit_Paramedic_B2", destination: "Zone_B_Row14" }
      },
      {
        agentId: "crowd",
        agentName: "Crowd Intelligence Agent",
        actionType: "TOOL_CALL",
        message: "Analysed egress bottlenecks around Sector B Concourse.",
        details: "Identified high pedestrian density at Vomitory B-East. Projected routing paths for the paramedics. Suggesting redirecting concourse traffic to Vomitory B-West to clear the lane.",
        toolName: "analyzeEgressFlow",
        toolArgs: { region: "Concourse_Zone_B" }
      },
      {
        agentId: "volunteer",
        agentName: "Volunteer Copilot Agent",
        actionType: "TOOL_CALL",
        message: "Guided nearby Volunteer #1128 with First Aid instructions for heat exhaustion.",
        details: "Queried knowledge base. Instructed volunteer to: 1. Move patient to shadow (if possible), 2. Apply cold compress using concession ice, 3. Loosen tight clothing, 4. Provide sips of electrolyte drink.",
        toolName: "getSOPGuidance",
        toolArgs: { sopId: "SOP-112-HeatStrokeEmergency", language: "en" }
      },
      {
        agentId: "transit",
        agentName: "Transportation Agent",
        actionType: "DECISION",
        message: "Cleared emergency ingress lane at Parking Lot North.",
        details: "Cleared a fast-track corridor from Gate B outer entrance to ensure external ambulances can enter seamlessly if the patient requires hospitalization.",
      },
      {
        agentId: "emergency",
        agentName: "Emergency Coordinator Agent",
        actionType: "COMMUNICATION",
        message: "Confirmed paramedic arrival and patient stabilization status.",
        details: "Paramedics arrived at Row 14. Patient is conscious, administered hydration and cooling. Transporting patient to First Aid Station 2 for observation. Egress corridor worked smoothly.",
        targetAgentId: "volunteer"
      }
    ];

    actions = [
      { owner: "Medical Team", task: "Dispatch Paramedic Unit B2 with mobile cart to Zone B", priority: "Critical" },
      { owner: "Volunteer #1128", task: "Administer on-site cooling SOP instructions", priority: "High" },
      { owner: "Crowd Control", task: "Redirect concession queues at Vomitory B-East to clear ingress path", priority: "Medium" },
      { owner: "Transportation Team", task: "Keep Parking Lot North ambulance corridor clear", priority: "High" }
    ];
  } else if (scenarioId === "transit_delay") {
    crowdLevel = "High";
    transitStatus = "Delayed";
    planTitle = "Transit Congestion Mitigation";
    planDesc = "Deploying auxiliary bus fleets, notifying stranded fans with transit alternatives, and optimizing gate queues for late arrivals.";
    
    steps = [
      {
        agentId: "transit",
        agentName: "Transportation Agent",
        actionType: "TOOL_CALL",
        message: "Detected Metro Line Green shuttle suspension via transit API.",
        details: "Signal failure at Terminal Station has halted Green Line service. Approximately 15,000 fans are delayed at the suburban transport depot. Kick-off is in 90 minutes.",
        toolName: "monitorTransitSystem",
        toolArgs: { line: "Green_Line", status: "suspended" }
      },
      {
        agentId: "transit",
        agentName: "Transportation Agent",
        actionType: "COMMUNICATION",
        message: "Initiated emergency shuttle bus fleet activation.",
        details: "Requesting immediate activation of 45 backup express buses to run transit loops from the suburban depot to Stadium Terminals West & East. Alerting Crowd Agent about late arrival spikes.",
        targetAgentId: "crowd"
      },
      {
        agentId: "crowd",
        agentName: "Crowd Intelligence Agent",
        actionType: "TOOL_CALL",
        message: "Predicted entrance gate arrival patterns with late transit spike.",
        details: "Simulation models show standard peak entrance flow will shift back by 40 minutes, causing a massive concurrent spike of 22,000 fans at Gates 1, 2 and 3 just 15 minutes before kick-off.",
        toolName: "predictQueueDynamics",
        toolArgs: { delayedVolume: 15000, newETA: "T-30m" }
      },
      {
        agentId: "fan",
        agentName: "Fan Concierge Agent",
        actionType: "TOOL_CALL",
        message: "Pushed mass notifications with personalized travel options.",
        details: "Sent target message: 'Metro Green Line is delayed. Direct Shuttle Buses have been dispatched to your location. Or tap here for walking directions (22 mins) or rideshare hubs.' Offered free digital concession coupons to incentivize early/staggered entry.",
        toolName: "updateFanItinerary",
        toolArgs: { segmentedGroup: "Stranded_Metro_Fans" }
      },
      {
        agentId: "volunteer",
        agentName: "Volunteer Copilot Agent",
        actionType: "DECISION",
        message: "Extended volunteer shift cycles and prepped ticket queue monitors.",
        details: "Alerted 120 volunteers at Gates 1, 2, and 3 to prepare for high-density fast-tracking. Shared instructions on managing massive lines and using standby hand scanners.",
      },
      {
        agentId: "sustainability",
        agentName: "Sustainability Agent",
        actionType: "DECISION",
        message: "Adjusted water station refills and waste cycles for late crowd shift.",
        details: "Rescheduled cleaning crews and optimized concession compost/waste collections by 45 minutes to align with the delayed arrival peak, avoiding waste pile-ups during kick-off.",
      }
    ];

    actions = [
      { owner: "Transportation Team", task: "Deploy 45 backup buses from Depot to Stadium", priority: "Critical" },
      { owner: "Fan Communication", task: "Push notifications + 15% discount concession voucher", priority: "High" },
      { owner: "Gate Operations", task: "Open 6 additional standby scanning lanes at Gates 1 & 2", priority: "High" },
      { owner: "Sustainability Team", task: "Delay waste collections by 40 minutes to match crowd shift", priority: "Low" }
    ];
  } else {
    // Sustainability spill or default
    crowdLevel = "Moderate";
    sustainabilityIndex = 62;
    planTitle = "Sanitation & Hazard Abatement";
    planDesc = "Clearing public liquid hazard, deploying clean crews, and routing pedestrians away from the spill zone.";

    steps = [
      {
        agentId: "sustainability",
        agentName: "Sustainability Agent",
        actionType: "TOOL_CALL",
        message: "Detected high concession waste buildup in Plaza C.",
        details: "Automated trash fill sensors indicate bins C1, C2, and C4 are at 95% capacity. Crowd density is high. Liquid spill detected near Concession B3 causing active slip hazard.",
        toolName: "monitorBinCapacity",
        toolArgs: { sector: "Plaza_C" }
      },
      {
        agentId: "sustainability",
        agentName: "Sustainability Agent",
        actionType: "COMMUNICATION",
        message: "Dispatched rapid response cleaning crew to Concession B3 spill site.",
        details: "Urgent cleanup needed. Liquid spill near high-traffic stairwell. Requesting volunteer barricades to prevent accidents.",
        targetAgentId: "volunteer"
      },
      {
        agentId: "volunteer",
        agentName: "Volunteer Copilot Agent",
        actionType: "TOOL_CALL",
        message: "Dispatched 2 nearby volunteers to establish physical safety markers.",
        details: "Instructed Volunteers #404 and #405 to locate safety cones, stand near the wet floor at Plaza C, and verbally warn incoming fans until the cleanup crew arrives.",
        toolName: "getSOPGuidance",
        toolArgs: { sopId: "SOP-802-SpillHazardResponse" }
      },
      {
        agentId: "crowd",
        agentName: "Crowd Intelligence Agent",
        actionType: "DECISION",
        message: "Adjusted pedestrian flow recommendations around Plaza C stairwell.",
        details: "Rerouted digital overhead signs to guide fans to use Stairwell C-West, reducing pedestrian pressure in the wet corridor from 450 people/min to less than 80 people/min.",
      },
      {
        agentId: "sustainability",
        agentName: "Sustainability Agent",
        actionType: "TOOL_CALL",
        message: "Triggered emergency waste compactor pickups for high-compost areas.",
        details: "Dispatched physical operations garbage collectors to empty bins C1-C4. Discharged waste directly to local digester loop. Cleaning completed at B3 within 6 minutes.",
        toolName: "triggerBinPickup",
        toolArgs: { bins: ["C1", "C2", "C4"] }
      }
    ];

    actions = [
      { owner: "Sustainability Crew", task: "Wet mop and dry Concession B3 corridor", priority: "High" },
      { owner: "Volunteer Team", task: "Place warning cones and guide fans to safe stairwells", priority: "High" },
      { owner: "Crowd Management", task: "Redirect overhead digital signage away from Plaza C Stairwell", priority: "Medium" },
      { owner: "Waste Operations", task: "Empty Plaza C bins C1, C2, C4 immediately", priority: "Medium" }
    ];
  }

  return {
    scenarioTitle: title,
    scenarioDescription: description,
    globalStatus: {
      crowdLevel,
      transitStatus,
      safetyStatus,
      sustainabilityIndex
    },
    steps,
    finalPlan: {
      title: planTitle,
      description: planDesc,
      actions
    }
  };
}

// Vite middleware configuration for serving the frontend React app in Dev
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[StadiumMind AI] Express Server running on http://localhost:${PORT}`);
  });
}

startServer();
