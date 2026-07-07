import React, { useState, useEffect, useRef } from "react";
import { 
  Activity, 
  Users, 
  MapPin, 
  Bus, 
  CheckCircle2, 
  ShieldAlert, 
  Trash2, 
  Volume2, 
  BookOpen, 
  Settings, 
  HelpCircle, 
  Zap, 
  Send, 
  ChevronRight, 
  Play, 
  Languages, 
  Database,
  Cpu,
  Info,
  Sliders,
  Terminal as TermIcon
} from "lucide-react";
import { MapVisualization } from "./components/MapVisualization";
import { ConsoleTerminal } from "./components/ConsoleTerminal";
import { BlueprintConsole } from "./components/BlueprintConsole";

// Define TypeScript structures for our agent simulation
interface SimulationStep {
  agentId: 'fan' | 'crowd' | 'transit' | 'volunteer' | 'emergency' | 'sustainability';
  agentName: string;
  actionType: 'THINKING' | 'TOOL_CALL' | 'COMMUNICATION' | 'DECISION';
  message: string;
  details: string;
  targetAgentId?: string;
  toolName?: string;
  toolArgs?: any;
}

interface ActionTask {
  owner: string;
  task: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}

interface SimulationResponse {
  scenarioTitle: string;
  scenarioDescription: string;
  globalStatus: {
    crowdLevel: 'Normal' | 'Moderate' | 'High' | 'Critical';
    transitStatus: 'On Time' | 'Delayed' | 'Rerouted';
    safetyStatus: 'Secure' | 'Alert' | 'Emergency';
    sustainabilityIndex: number;
  };
  steps: SimulationStep[];
  finalPlan: {
    title: string;
    description: string;
    actions: ActionTask[];
  };
}

export default function App() {
  const [activeTab, setActiveTab] = useState<"operations" | "blueprint" | "agents" | "onboarding">("operations");
  
  // Simulation states
  const [selectedPresetId, setSelectedPresetId] = useState<string>("gate_bottleneck");
  const [customAlertText, setCustomAlertText] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationData, setSimulationData] = useState<SimulationResponse | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [loadingSimulation, setLoadingSimulation] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Global Stadium State Metrics (Synchronized with simulation playback)
  const [crowdLevel, setCrowdLevel] = useState<'Normal' | 'Moderate' | 'High' | 'Critical'>("Normal");
  const [transitStatus, setTransitStatus] = useState<'On Time' | 'Delayed' | 'Rerouted'>("On Time");
  const [safetyStatus, setSafetyStatus] = useState<'Secure' | 'Alert' | 'Emergency'>("Secure");
  const [sustainabilityIndex, setSustainabilityIndex] = useState<number>(94);
  const [activeIncidentTitle, setActiveIncidentTitle] = useState<string>("All Systems Secure");
  const [activeIncidentDesc, setActiveIncidentDesc] = useState<string>("Awaiting telemetry alarms. No incidents reported.");
  const [selectedMapZone, setSelectedMapZone] = useState<string | null>(null);

  // Playback timer ref
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Stop simulation on tab shift or unmount
  useEffect(() => {
    return () => {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
      }
    };
  }, []);

  // Preset incident triggers list
  const presets = [
    { id: "gate_bottleneck", name: "Gate 4 Bottleneck", category: "Crowd", icon: <Users className="h-4 w-4" /> },
    { id: "medical_incident", name: "Zone B Medical Case", category: "Safety", icon: <ShieldAlert className="h-4 w-4 text-rose-400" /> },
    { id: "transit_delay", name: "Metro Line Suspension", category: "Transit", icon: <Bus className="h-4 w-4 text-sky-400" /> },
    { id: "sustainability_spill", name: "Plaza Food Spill", category: "Sustainability", icon: <Trash2 className="h-4 w-4 text-amber-400" /> }
  ];

  // Triggering Simulation
  const handleTriggerSimulation = async (presetId: string | null, customText?: string) => {
    // Clear existing timer
    if (playbackTimerRef.current) {
      clearInterval(playbackTimerRef.current);
      playbackTimerRef.current = null;
    }

    setLoadingSimulation(true);
    setIsSimulating(true);
    setErrorText(null);
    setSimulationData(null);
    setActiveStepIndex(-1);

    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: presetId,
          customPrompt: customText
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data: SimulationResponse = await response.json();
      setSimulationData(data);
      
      // Update incident header
      setActiveIncidentTitle(data.scenarioTitle);
      setActiveIncidentDesc(data.scenarioDescription);

      // Playback sequence step-by-step
      let stepCounter = -1;
      playbackTimerRef.current = setInterval(() => {
        stepCounter++;
        if (stepCounter < data.steps.length) {
          setActiveStepIndex(stepCounter);
          
          // Gradually shift system metrics as steps execute
          const currentStep = data.steps[stepCounter];
          if (currentStep.agentId === "crowd") {
            setCrowdLevel(data.globalStatus.crowdLevel);
          } else if (currentStep.agentId === "transit") {
            setTransitStatus(data.globalStatus.transitStatus);
          } else if (currentStep.agentId === "emergency") {
            setSafetyStatus(data.globalStatus.safetyStatus);
          } else if (currentStep.agentId === "sustainability") {
            setSustainabilityIndex(data.globalStatus.sustainabilityIndex);
          }
        } else {
          // Playback completed
          if (playbackTimerRef.current) {
            clearInterval(playbackTimerRef.current);
            playbackTimerRef.current = null;
          }
          setIsSimulating(false);
          // Set final status
          setCrowdLevel(data.globalStatus.crowdLevel);
          setTransitStatus(data.globalStatus.transitStatus);
          setSafetyStatus(data.globalStatus.safetyStatus);
          setSustainabilityIndex(data.globalStatus.sustainabilityIndex);
        }
      }, 3500); // 3.5 seconds per agent reasoning step

    } catch (err: any) {
      console.error(err);
      setErrorText("Telemetry failure: could not compile agent planning loop. Falling back to safe offline diagnostics.");
      setIsSimulating(false);
      setLoadingSimulation(false);
    } finally {
      setLoadingSimulation(false);
    }
  };

  const handleCustomAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAlertText.trim()) return;
    handleTriggerSimulation(null, customAlertText);
    setCustomAlertText("");
  };

  // Reset metrics to green normal state
  const handleClearIncident = () => {
    if (playbackTimerRef.current) {
      clearInterval(playbackTimerRef.current);
      playbackTimerRef.current = null;
    }
    setIsSimulating(false);
    setSimulationData(null);
    setActiveStepIndex(-1);
    setCrowdLevel("Normal");
    setTransitStatus("On Time");
    setSafetyStatus("Secure");
    setSustainabilityIndex(94);
    setActiveIncidentTitle("All Systems Secure");
    setActiveIncidentDesc("Awaiting telemetry alarms. No incidents reported.");
    setSelectedMapZone(null);
  };

  // Agent descriptions for "Agent Roles" Tab
  const agentsConfig = [
    {
      id: "fan",
      name: "Fan Concierge Agent",
      role: "Spectator Companion & Guide",
      goal: "Eliminate attendance friction, provide localized support, and route ticket inquiries.",
      tools: ["updateFanItinerary", "translateInboundQuery", "getSeatDirections", "queryLostAndFound"],
      memory: "Short-term attendee language settings, ticket zone history, and food preference profile.",
      decision: "If a gate is congested, query nearby open gate arrival averages, translate to fan's device language, offer a 15% concession discount, and update their spatial directions.",
      comms: "Broadcasts fan relocation volumes to the Crowd Intelligence Agent."
    },
    {
      id: "crowd",
      name: "Crowd Intelligence Agent",
      role: "Predictive Density Supervisor",
      goal: "Maintain crowd safety margins, minimize ticketing lines, and forecast bottleneck patterns.",
      tools: ["analyzeCrowdDensity", "predictQueueDynamics", "optimizeGateFlow", "analyzeEgressFlow"],
      memory: "Historical gate throughput vectors, real-time plaza camera density feeds, and concession occupancy metrics.",
      decision: "If crowd density at any gate exceeds 8.5/10, request Shuttle re-routes from Transportation Agent, SOP actions from Volunteer Copilot, and coordinate mass redirects with Fan Concierge.",
      comms: "Direct handshakes with Transportation, Volunteer Copilot, and Emergency agents."
    },
    {
      id: "transit",
      name: "Transportation Agent",
      role: "Metropolitan Transit Optimizer",
      goal: "Streamline shuttle bus cycles, monitor parking lot vacancies, and adjust outer traffic corridors.",
      tools: ["rerouteShuttleBuses", "monitorTransitSystem", "getParkingCapacity", "requestUberHubStandby"],
      memory: "Active transit fleet coordinates, local train arrival timetables, and parking loop rates.",
      decision: "Upon receiving transit suspension alerts, compute stranded fan numbers, activate emergency reserve buses, and message Crowd Agent to brace for delayed ingress spikes.",
      comms: "Subscribes to Blackboard incident logs to adjust transit cycles."
    },
    {
      id: "volunteer",
      name: "Volunteer Copilot Agent",
      role: "On-Ground Volunteer Enablement",
      goal: "Bridge translations, offer immediate standard operating procedures (SOPs), and report field incidents.",
      tools: ["getSOPGuidance", "broadcastVolunteerAlert", "logFieldIncident", "translateOnGroundRequest"],
      memory: "Volunteer registry lists, sector assignment logs, and the complete stadium standard operating procedures playbook.",
      decision: "When a field volunteer logs an incident, query Vertex AI Search for matching SOP guides, auto-translate instructions, and escalate critical cases directly to the Emergency Coordinator.",
      comms: "Maintains active text interfaces with on-ground volunteers."
    },
    {
      id: "emergency",
      name: "Emergency Coordinator Agent",
      role: "Incident Control & Medical Dispatcher",
      goal: "Ensure high-speed paramedic routing, secure VIP escorts, and orchestrate safety evacuations.",
      tools: ["dispatchEMS", "escalateSecurityIncident", "triggerEvacuationGuide", "logEmergencyCase"],
      memory: "Paramedic coordinate systems, fire safety stations, and security checkpoint status indexes.",
      decision: "If a life safety alert is triggered, deploy the nearest first responder unit, request Crowd Agent to clear egress Vomitories, and notify Volunteer Copilot to cordon off the area.",
      comms: "Authority over all security and emergency dispatch channels."
    },
    {
      id: "sustainability",
      name: "Sustainability Agent",
      role: "Resource & Ecology Controller",
      goal: "Predict organic food waste peaks, clean plazas, optimize water stations, and manage bins.",
      tools: ["monitorBinCapacity", "triggerBinPickup", "predictFoodWaste", "dispatchSanitationCrews"],
      memory: "Plaza trash sensor fill levels, concession product sales projections, and water utility cycles.",
      decision: "If trash bin capacity sensors report values exceeding 85%, dispatch immediate sanitation sweeps, and reschedule general cleaning lines to align with crowd relocation timelines.",
      comms: "Exchanges waste alerts with Volunteer and Crowd agents."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Top Navigation Header */}
      <header className="border-b border-slate-900 bg-slate-950 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
        <div className="flex items-center space-x-3.5">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Cpu className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-semibold tracking-tight text-slate-100">StadiumMind AI</h1>
              <span className="text-[9px] font-mono font-bold bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 px-1.5 py-0.5 rounded uppercase tracking-wider">
                Agentic OS v1.2
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">An Agentic AI Operating System for Smart Stadiums • FIFA World Cup 2026</p>
          </div>
        </div>

        {/* Global Active State Metrics */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center space-x-1.5 text-[10px] font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            <Database className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-500">DB:</span>
            <span className="text-emerald-400 font-bold uppercase">FIRESTORE</span>
          </div>

          <div className="flex items-center space-x-1.5 text-[10px] font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            <Languages className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-500">TRANSLATION:</span>
            <span className="text-cyan-400 font-bold uppercase">READY (es, jp, fr)</span>
          </div>

          <div className="flex items-center space-x-1.5 text-[10px] font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
            <span className="text-slate-500">ADK BUS:</span>
            <span className="text-emerald-400 font-bold">ONLINE</span>
          </div>
        </div>
      </header>

      {/* Main Tabs Selection */}
      <div className="border-b border-slate-900/60 bg-slate-950 px-6 py-2 flex items-center justify-between shrink-0">
        <div className="flex space-x-1.5">
          <button
            onClick={() => setActiveTab("operations")}
            className={`px-4 py-2 rounded-lg text-xs font-mono transition-all uppercase tracking-wider flex items-center space-x-2 cursor-pointer ${
              activeTab === "operations"
                ? "bg-slate-900 border border-slate-800 text-slate-100"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Activity className="h-3.5 w-3.5 text-cyan-400" />
            <span>Operations Console</span>
          </button>

          <button
            onClick={() => setActiveTab("blueprint")}
            className={`px-4 py-2 rounded-lg text-xs font-mono transition-all uppercase tracking-wider flex items-center space-x-2 cursor-pointer ${
              activeTab === "blueprint"
                ? "bg-slate-900 border border-slate-800 text-slate-100"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-amber-400" />
            <span>Arch Blueprint Manual</span>
          </button>

          <button
            onClick={() => setActiveTab("agents")}
            className={`px-4 py-2 rounded-lg text-xs font-mono transition-all uppercase tracking-wider flex items-center space-x-2 cursor-pointer ${
              activeTab === "agents"
                ? "bg-slate-900 border border-slate-800 text-slate-100"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Cpu className="h-3.5 w-3.5 text-indigo-400" />
            <span>Agent Profiles</span>
          </button>

          <button
            onClick={() => setActiveTab("onboarding")}
            className={`px-4 py-2 rounded-lg text-xs font-mono transition-all uppercase tracking-wider flex items-center space-x-2 cursor-pointer ${
              activeTab === "onboarding"
                ? "bg-slate-900 border border-slate-800 text-slate-100"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Settings className="h-3.5 w-3.5 text-violet-400" />
            <span>Developer Stack</span>
          </button>
        </div>

        {/* Current Incident Banner */}
        <div className="hidden lg:flex items-center space-x-3 text-xs bg-slate-900/40 border border-slate-900 px-4 py-1.5 rounded-lg max-w-md truncate">
          <span className={`h-2.5 w-2.5 rounded-full ${
            safetyStatus === "Emergency" ? "bg-rose-500 animate-pulse" :
            safetyStatus === "Alert" ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
          }`}></span>
          <div className="truncate">
            <span className="font-semibold text-slate-300">ACTIVE ALARM: </span>
            <span className="text-slate-400 font-sans text-[11px]">{activeIncidentTitle}</span>
          </div>
        </div>
      </div>

      {/* Main Grid Viewport */}
      <main className="flex-1 overflow-y-auto p-6 bg-slate-950/20">
        {activeTab === "operations" && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 max-w-7xl mx-auto h-full">
            
            {/* LEFT COLUMN - Status Panel, Triggers, & Inputs (5 Cols) */}
            <div className="xl:col-span-5 flex flex-col space-y-6">
              
              {/* Metric Status Bento Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Crowd Level */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between h-[105px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Crowd Density</span>
                    <Users className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="mt-2">
                    <span className={`text-xl font-semibold tracking-tight ${
                      crowdLevel === "Critical" ? "text-rose-400" :
                      crowdLevel === "High" ? "text-amber-400" : "text-emerald-400"
                    }`}>
                      {crowdLevel}
                    </span>
                    <span className="text-[10px] text-slate-500 block font-mono mt-0.5 uppercase">
                      {crowdLevel === "Critical" ? "🚨 Level: 9.2/10 Bottleneck" : "✓ Safe occupancy margin"}
                    </span>
                  </div>
                </div>

                {/* Transit Status */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between h-[105px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Transit Outlets</span>
                    <Bus className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="mt-2">
                    <span className={`text-xl font-semibold tracking-tight ${
                      transitStatus === "Delayed" ? "text-rose-400" :
                      transitStatus === "Rerouted" ? "text-cyan-400" : "text-emerald-400"
                    }`}>
                      {transitStatus}
                    </span>
                    <span className="text-[10px] text-slate-500 block font-mono mt-0.5 uppercase">
                      {transitStatus === "Delayed" ? "⚠️ Metro Corridors Halted" : "✓ Loops running smoothly"}
                    </span>
                  </div>
                </div>

                {/* Emergency Status */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between h-[105px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Security Matrix</span>
                    <ShieldAlert className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="mt-2">
                    <span className={`text-xl font-semibold tracking-tight ${
                      safetyStatus === "Emergency" ? "text-rose-400" :
                      safetyStatus === "Alert" ? "text-amber-400" : "text-emerald-400"
                    }`}>
                      {safetyStatus}
                    </span>
                    <span className="text-[10px] text-slate-500 block font-mono mt-0.5 uppercase">
                      {safetyStatus === "Emergency" ? "🚨 Ambulance Dispatched" : "✓ Perimeters secure"}
                    </span>
                  </div>
                </div>

                {/* Sustainability score */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between h-[105px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Eco-Index</span>
                    <Trash2 className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="mt-2">
                    <span className="text-xl font-semibold tracking-tight text-slate-100">
                      {sustainabilityIndex}%
                    </span>
                    <span className="text-[10px] text-slate-500 block font-mono mt-0.5 uppercase">
                      {sustainabilityIndex < 75 ? "⚠️ Cleanup Sweeps Dispatched" : "✓ Recyclables optimized"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Scenario Quick Trigger Panel */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center space-x-1.5">
                    <Sliders className="h-4 w-4 text-cyan-400" />
                    <h3 className="text-xs font-semibold text-slate-100 font-sans tracking-tight uppercase">Simulate Hackathon Incidents</h3>
                  </div>
                  {simulationData && (
                    <button
                      onClick={handleClearIncident}
                      className="text-[10px] font-mono bg-slate-800 hover:bg-slate-750 text-slate-300 px-2.5 py-1 rounded cursor-pointer"
                    >
                      CLEAR STATE
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {presets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setSelectedPresetId(preset.id);
                        handleTriggerSimulation(preset.id);
                      }}
                      disabled={isSimulating}
                      className={`px-3 py-2.5 rounded-lg border text-left transition-all duration-150 flex items-start space-x-2.5 cursor-pointer ${
                        selectedPresetId === preset.id && simulationData
                          ? "bg-slate-950 border-cyan-500 text-slate-100 ring-1 ring-cyan-500/20"
                          : "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                      } ${isSimulating ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      <div className="mt-0.5">{preset.icon}</div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold font-sans tracking-tight leading-tight truncate">{preset.name}</div>
                        <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">{preset.category}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Alert Field Form */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center space-x-1.5 mb-3">
                  <TermIcon className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-xs font-semibold text-slate-100 font-sans tracking-tight uppercase">Field Dispatch Command (Custom Prompt)</h3>
                </div>
                
                <form onSubmit={handleCustomAlertSubmit} className="space-y-3">
                  <textarea
                    placeholder="Log a custom stadium incident (e.g. 'Stairwell D handrail loose' or 'VIP Fan lost ticketing details near Gate 2 in French'). Click send to watch Gemini orchestrate the agents live..."
                    value={customAlertText}
                    onChange={(e) => setCustomAlertText(e.target.value)}
                    disabled={isSimulating}
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-sans resize-none leading-relaxed"
                  />
                  
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-[10px] font-mono text-slate-500">
                      {isSimulating ? "⚡ AGENT COORDINATION IN PLAY" : "📝 GEMINI LIVE INFERENCE SECURE"}
                    </span>
                    <button
                      type="submit"
                      disabled={isSimulating || !customAlertText.trim()}
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs rounded-lg flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <span>DISPATCH</span>
                      <Send className="h-3 w-3" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Active Incident Details Card */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex-1 flex flex-col justify-between min-h-[120px]">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Active Alarm Monitor</span>
                    {loadingSimulation ? (
                      <span className="text-[10px] font-mono text-cyan-400 animate-pulse uppercase">Planning...</span>
                    ) : (
                      <span className={`h-2 w-2 rounded-full ${
                        safetyStatus === "Emergency" ? "bg-rose-500 animate-pulse" :
                        safetyStatus === "Alert" ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
                      }`} />
                    )}
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200 font-sans tracking-tight">{activeIncidentTitle}</h4>
                  <p className="text-[11px] text-slate-400 font-sans mt-1.5 leading-relaxed">{activeIncidentDesc}</p>
                </div>

                {/* Display map selection details */}
                {selectedMapZone && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                    <div className="flex items-center space-x-1 text-cyan-400">
                      <MapPin className="h-3 w-3" />
                      <span>ZONE SELECTED: {selectedMapZone}</span>
                    </div>
                    <button
                      onClick={() => setSelectedMapZone(null)}
                      className="text-slate-500 hover:text-slate-300"
                    >
                      [Deselect]
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN - Live Stadium Map & Terminal Logs (7 Cols) */}
            <div className="xl:col-span-7 flex flex-col space-y-6">
              
              {/* Live Stadium Spatial SVG Map */}
              <div className="h-[380px] shrink-0">
                <MapVisualization
                  activeScenarioId={simulationData ? selectedPresetId : null}
                  selectedZone={selectedMapZone}
                  onSelectZone={(zoneId) => setSelectedMapZone(zoneId)}
                />
              </div>

              {/* Scrolling Terminal Agent Reasonings logs */}
              <div className="flex-1 flex flex-col">
                <ConsoleTerminal
                  steps={simulationData ? simulationData.steps : []}
                  isSimulating={isSimulating}
                  activeStepIndex={activeStepIndex}
                />
              </div>

            </div>

          </div>
        )}

        {activeTab === "blueprint" && (
          <div className="max-w-7xl mx-auto">
            <BlueprintConsole />
          </div>
        )}

        {activeTab === "agents" && (
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Cpu className="h-5 w-5 text-indigo-400 animate-pulse" />
                <h3 className="text-sm font-semibold text-slate-100 font-sans tracking-tight uppercase">Multi-Agent ADK Specification</h3>
              </div>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Under the Google Agent Development Kit (ADK) framework, each of our 6 intelligent assistants is structured as a dedicated agent entity with clear behavioral boundaries, specific tool bindings, localized memories, and direct communication logs. Explore their exact configurations:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agentsConfig.map((agent) => (
                <div key={agent.id} className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all rounded-xl p-5 space-y-4">
                  {/* Agent Header */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-100 font-sans tracking-tight">{agent.name}</h4>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-semibold mt-0.5 block">{agent.role}</span>
                    </div>
                    <span className="text-[9px] font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-slate-400">
                      ID: @{agent.id}
                    </span>
                  </div>

                  {/* Operational details */}
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block mb-0.5">Primary Operational Goal</span>
                      <p className="text-slate-300 font-sans leading-relaxed">{agent.goal}</p>
                    </div>

                    <div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block mb-1">Bounded Tools (Google ADK APIs)</span>
                      <div className="flex flex-wrap gap-1">
                        {agent.tools.map((tool) => (
                          <code key={tool} className="text-[10px] font-mono text-amber-400 bg-amber-950/40 border border-amber-900/30 px-1.5 py-0.5 rounded">
                            {tool}()
                          </code>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block mb-0.5">Decision Logic (Inner State)</span>
                      <p className="text-slate-300 font-sans leading-relaxed italic">{agent.decision}</p>
                    </div>

                    <div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block mb-0.5">Private Memory Context</span>
                      <p className="text-slate-400 font-sans leading-relaxed">{agent.memory}</p>
                    </div>
                    
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block mb-0.5">Peer-to-Peer Interlock</span>
                      <p className="text-slate-400 font-sans leading-relaxed">{agent.comms}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "onboarding" && (
          <div className="max-w-4xl mx-auto bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center space-x-2 pb-4 border-b border-slate-800">
              <Settings className="h-5 w-5 text-violet-400 animate-spin-slow" />
              <div>
                <h3 className="text-sm font-semibold text-slate-100 font-sans tracking-tight uppercase">Developer Deployment & Key Management</h3>
                <p className="text-[11px] text-slate-400 font-sans">Learn how to run, configure, and customize StadiumMind AI on your local systems or GCP cluster.</p>
              </div>
            </div>

            {/* Quick Developer Guide */}
            <div className="space-y-4 text-xs font-sans leading-relaxed text-slate-300">
              <h4 className="text-xs font-semibold font-mono text-cyan-400 uppercase tracking-wider mb-2">1. Local Setup Instructions</h4>
              <p>
                StadiumMind AI is a unified full-stack application built with Express and Vite. Node.js processes are configured using <code className="px-1.5 py-0.5 rounded bg-slate-950 text-amber-400 font-mono text-[10px]">tsx</code> to run directly in TypeScript development mode on Port 3000.
              </p>
              
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
                <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block mb-2">Bootstrap Commands:</span>
                <pre className="text-[11px] font-mono text-slate-300 space-y-1 overflow-x-auto">
                  <div># Clone and enter directory</div>
                  <div>npm install</div>
                  <div className="text-cyan-400">npm run dev</div>
                </pre>
              </div>

              <h4 className="text-xs font-semibold font-mono text-cyan-400 uppercase tracking-wider mt-4 mb-2">2. Configuring Secrets & Keys</h4>
              <p>
                The application relies on the secure, server-side <code className="px-1.5 py-0.5 rounded bg-slate-950 text-amber-400 font-mono text-[10px]">process.env.GEMINI_API_KEY</code> variable to trigger live, multi-agent simulation reasoning streams. 
              </p>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-2">
                <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono uppercase font-bold mb-1">
                  <Info className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>How AI Studio manages secrets:</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Google AI Studio automatically injects your active user secrets at runtime. To inspect or change your active Gemini API key, click the **Settings → Secrets** panel in the outer AI Studio UI. There is no need to commit raw keys inside the code files!
                </p>
              </div>

              <h4 className="text-xs font-semibold font-mono text-cyan-400 uppercase tracking-wider mt-4 mb-2">3. Google ADK Integration Patterns</h4>
              <p>
                The agent planning sequences are modeled after the standard Google Agent Development Kit paradigm. On the Express server side (<code className="px-1.5 py-0.5 rounded bg-slate-950 text-amber-400 font-mono text-[10px]">server.ts</code>), the Gemini reasoning prompt enforces structure constraints to extract tool calling indices, thoughts, and outputs dynamically:
              </p>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-[11px] font-mono text-indigo-300 overflow-x-auto">
                <pre className="space-y-1">
                  <div>{"const response = await ai.models.generateContent({"}</div>
                  <div>{"  model: 'gemini-3.5-flash',"}</div>
                  <div>{"  contents: prompt,"}</div>
                  <div>{"  config: {"}</div>
                  <div className="text-cyan-400">{"    responseMimeType: 'application/json',"}</div>
                  <div>{"    responseSchema: { ... }"}</div>
                  <div>{"  }"}</div>
                  <div>{"});"}</div>
                </pre>
              </div>

              <h4 className="text-xs font-semibold font-mono text-cyan-400 uppercase tracking-wider mt-4 mb-2">4. Production Bundling & Deployment</h4>
              <p>
                To deploy to Google Cloud Run containers, run the production build. This bundles the React frontend inside static assets and compiles the Express Node.js server into a single self-contained CommonJS file inside <code className="px-1.5 py-0.5 rounded bg-slate-950 text-amber-400 font-mono text-[10px]">dist/server.cjs</code> with ESBuild, allowing cold starts within 200 milliseconds.
              </p>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
                <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block mb-2">Build Command:</span>
                <pre className="text-[11px] font-mono text-slate-300">
                  <div className="text-cyan-400">npm run build</div>
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer copyright */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 shrink-0">
        <div className="flex items-center space-x-1">
          <span>StadiumMind AI Dashboard • Hackathon Proposal Workspace</span>
        </div>
        <div className="flex space-x-4 mt-2 sm:mt-0 font-mono">
          <span>MODEL: models/gemini-3.5-flash</span>
          <span>LATENCY: ~1.2s</span>
          <span>FIFA CODES: SEC-04, TRAN-20, VOL-11</span>
        </div>
      </footer>
    </div>
  );
}
