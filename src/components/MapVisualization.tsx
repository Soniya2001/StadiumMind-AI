import React from "react";

interface MapVisualizationProps {
  activeScenarioId: string | null;
  selectedZone: string | null;
  onSelectZone: (zoneId: string) => void;
}

export const MapVisualization: React.FC<MapVisualizationProps> = ({
  activeScenarioId,
  selectedZone,
  onSelectZone,
}) => {
  // Determine color coding based on scenario
  const getGate4Status = () => {
    if (activeScenarioId === "gate_bottleneck") return "fill-red-500 animate-pulse stroke-red-300";
    return "fill-emerald-500/80 stroke-emerald-400";
  };

  const getZoneBStatus = () => {
    if (activeScenarioId === "medical_incident") return "fill-amber-500 animate-pulse stroke-amber-300";
    return "fill-slate-700/80 stroke-slate-500";
  };

  const getTransitHubStatus = () => {
    if (activeScenarioId === "transit_delay") return "fill-red-500 animate-pulse stroke-red-300";
    return "fill-sky-500/80 stroke-sky-400";
  };

  const getPlazaCStatus = () => {
    if (activeScenarioId === "sustainability_spill") return "fill-amber-500 animate-pulse stroke-amber-300";
    return "fill-slate-700/80 stroke-slate-500";
  };

  // Dynamic helper for interactive click details
  const getZoneDetails = (zone: string) => {
    switch (zone) {
      case "Gate_4":
        return {
          name: "Gate 4 North Entrance",
          currentQueue: "18 mins",
          projectedQueue: "31 mins",
          recommendation: "Open Gate 5 & Redirect incoming spectator flow",
          confidence: "96%",
          status: "critical"
        };
      case "Sector_B":
        return {
          name: "Sector B Grandstands",
          currentQueue: "N/A (Emergency Case)",
          projectedQueue: "Inbound EMS dispatched",
          recommendation: "Clear grandstand access vomitories & cordons",
          confidence: "94%",
          status: "warning"
        };
      case "transit_loop":
        return {
          name: "Transportation Shuttle Loop",
          currentQueue: "25 mins bus interval",
          projectedQueue: "42 mins (Metro Line Suspension)",
          recommendation: "Activate 4x emergency reserve shuttle buses",
          confidence: "97%",
          status: "critical"
        };
      case "Sector_C":
      case "Concession_Plaza_C":
        return {
          name: "Concession Plaza & Sector C",
          currentQueue: "12 mins line",
          projectedQueue: "22 mins (Organic food spill)",
          recommendation: "Dispatch Sanitation Sweep & deploy wet spill signs",
          confidence: "91%",
          status: "warning"
        };
      case "Gate_5":
        return {
          name: "Gate 5 East Entrance",
          currentQueue: "3 mins",
          projectedQueue: "7 mins",
          recommendation: "Healthy condition. Ready for spectator load absorption.",
          confidence: "95%",
          status: "nominal"
        };
      case "Gate_3":
        return {
          name: "Gate 3 North East Entrance",
          currentQueue: "4 mins",
          projectedQueue: "8 mins",
          recommendation: "Maintain standard security screening speed.",
          confidence: "98%",
          status: "nominal"
        };
      case "Sector_A":
        return {
          name: "Sector A Grandstands",
          currentQueue: "N/A",
          projectedQueue: "Nominal",
          recommendation: "All metrics healthy. Spectator density at 58%.",
          confidence: "99%",
          status: "nominal"
        };
      case "Sector_D":
        return {
          name: "Sector D Grandstands",
          currentQueue: "N/A",
          projectedQueue: "Nominal",
          recommendation: "All metrics healthy. Spectator density at 61%.",
          confidence: "99%",
          status: "nominal"
        };
      default:
        return {
          name: zone.replace(/_/g, " "),
          currentQueue: "2 mins",
          projectedQueue: "4 mins",
          recommendation: "Nominal. Watch live telemetry feed for changes.",
          confidence: "99%",
          status: "nominal"
        };
    }
  };

  const selectedDetails = selectedZone ? getZoneDetails(selectedZone) : null;

  return (
    <div className="relative w-full h-full min-h-[350px] bg-slate-900/60 rounded-xl border border-slate-800 p-4 flex flex-col justify-between overflow-hidden">
      {/* Header Info */}
      <div className="flex justify-between items-start z-10">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Live Spatial Layout</span>
          <h4 className="text-sm font-medium text-slate-100 font-sans tracking-tight">MetLife/SoFi Stadium Operations</h4>
        </div>
        <div className="flex items-center space-x-2 text-[10px] font-mono bg-slate-950/80 border border-slate-800 px-2 py-1 rounded">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-slate-400">TELEMETRY SECURE</span>
        </div>
      </div>

      {/* SVG Interactive Map */}
      <div className="flex-1 flex items-center justify-center py-4 relative">
        <svg
          viewBox="0 0 800 600"
          className="w-full max-h-[300px] text-slate-300 transition-all duration-300 focus:outline-none"
          style={{ filter: "drop-shadow(0 0 15px rgba(15, 23, 42, 0.4))" }}
          aria-label="Interactive spatial map of the stadium"
          role="img"
        >
          <title>Stadium Spatial Layout Map</title>
          <desc>Interactive vector layout illustrating gates, grandstand sectors, transportation hub, and first aid posts</desc>
          {/* Defs for gradients */}
          <defs>
            <radialGradient id="stadiumGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
            </radialGradient>
          </defs>

          {/* Outer Grid & Coordinates */}
          <rect width="800" height="600" fill="url(#stadiumGlow)" className="rounded" />
          <line x1="400" y1="0" x2="400" y2="600" stroke="#1e293b" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="0" y1="300" x2="800" y2="300" stroke="#1e293b" strokeWidth="1" strokeDasharray="5,5" />

          {/* Outer Transit Hub and Parking Loops */}
          {/* North Parking Loop & Bus Drop */}
          <g
            className="cursor-pointer group focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded"
            id="map-element-transit"
            tabIndex={0}
            role="button"
            aria-label="Transportation shuttle loop & metro bus bay"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectZone("transit_loop"); } }}
            onClick={() => onSelectZone("transit_loop")}
          >
            <path
              d="M 250,50 L 550,50 C 600,50 630,80 630,130 L 630,140 L 170,140 L 170,130 C 170,80 200,50 250,50 Z"
              className={`transition-colors duration-300 stroke-2 ${getTransitHubStatus()}`}
            />
            <text x="400" y="95" className="fill-slate-100 text-[12px] font-mono font-medium tracking-wider text-center" textAnchor="middle">
              TRANSPORTATION SHUTTLE LOOP & METRO BUS BAY
            </text>
            <text x="400" y="115" className="fill-slate-400 text-[9px] font-mono" textAnchor="middle">
              {activeScenarioId === "transit_delay" ? "🚨 SERVICE SUSPENDED (DELAY RISK)" : "✓ NORMAL SHUTTLE FREQUENCY"}
            </text>
          </g>

          {/* Stadium Inner Structure Circle (Pitch & Sidewalks) */}
          <circle cx="400" cy="360" r="190" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          <circle cx="400" cy="360" r="140" fill="#0f172a" stroke="#475569" strokeWidth="2" strokeDasharray="3,3" />

          {/* Pitch Field */}
          <rect x="340" y="310" width="120" height="100" rx="4" fill="#312e81/30" stroke="#4338ca" strokeWidth="2" />
          <line x1="400" y1="310" x2="400" y2="410" stroke="#4338ca" strokeWidth="1" />
          <circle cx="400" cy="360" r="18" fill="none" stroke="#4338ca" strokeWidth="1" />

          {/* GRANDSTANDS SECTORS */}
          {/* Sector A (West) */}
          <g
            className="cursor-pointer group focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded"
            id="map-element-zoneA"
            tabIndex={0}
            role="button"
            aria-label="Sector A Grandstands"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectZone("Sector_A"); } }}
            onClick={() => onSelectZone("Sector_A")}
          >
            <path
              d="M 230,360 A 170,170 0 0,1 400,190 L 400,240 A 120,120 0 0,0 280,360 Z"
              className={`transition-colors duration-300 stroke-2 ${selectedZone === "Sector_A" ? "fill-cyan-900/60 stroke-cyan-400 font-bold" : "fill-slate-800/80 stroke-slate-700 hover:fill-slate-700"}`}
            />
            <text x="310" y="260" className="fill-slate-200 text-[11px] font-mono" textAnchor="middle">Sector A</text>
          </g>

          {/* Sector B (North East) */}
          <g
            className="cursor-pointer group focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded"
            id="map-element-zoneB"
            tabIndex={0}
            role="button"
            aria-label="Sector B Grandstands"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectZone("Sector_B"); } }}
            onClick={() => onSelectZone("Sector_B")}
          >
            <path
              d="M 400,190 A 170,170 0 0,1 570,360 L 520,360 A 120,120 0 0,0 400,240 Z"
              className={`transition-colors duration-300 stroke-2 ${selectedZone === "Sector_B" ? "fill-cyan-900/60 stroke-cyan-400 font-bold" : getZoneBStatus()}`}
            />
            <text x="490" y="260" className="fill-slate-200 text-[11px] font-mono" textAnchor="middle">Sector B</text>
          </g>

          {/* Sector C (South East & Concessions/Plaza C) */}
          <g
            className="cursor-pointer group focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded"
            id="map-element-zoneC"
            tabIndex={0}
            role="button"
            aria-label="Sector C Grandstands and Concession Plaza C"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectZone("Sector_C"); } }}
            onClick={() => onSelectZone("Sector_C")}
          >
            <path
              d="M 570,360 A 170,170 0 0,1 400,530 L 400,480 A 120,120 0 0,0 520,360 Z"
              className={`transition-colors duration-300 stroke-2 ${selectedZone === "Sector_C" ? "fill-cyan-900/60 stroke-cyan-400 font-bold" : getPlazaCStatus()}`}
            />
            <text x="490" y="470" className="fill-slate-200 text-[11px] font-mono" textAnchor="middle">Sector C</text>
          </g>

          {/* Sector D (South West) */}
          <g
            className="cursor-pointer group focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded"
            id="map-element-zoneD"
            tabIndex={0}
            role="button"
            aria-label="Sector D Grandstands"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectZone("Sector_D"); } }}
            onClick={() => onSelectZone("Sector_D")}
          >
            <path
              d="M 400,530 A 170,170 0 0,1 230,360 L 280,360 A 120,120 0 0,0 400,480 Z"
              className={`transition-colors duration-300 stroke-2 ${selectedZone === "Sector_D" ? "fill-cyan-900/60 stroke-cyan-400 font-bold" : "fill-slate-800/80 stroke-slate-700 hover:fill-slate-700"}`}
            />
            <text x="310" y="470" className="fill-slate-200 text-[11px] font-mono" textAnchor="middle">Sector D</text>
          </g>

          {/* ACCESS GATES (Numbered Circles outside the bowl) */}
          {/* Gate 1 (West) */}
          <g
            className="cursor-pointer group focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded"
            id="map-element-gate1"
            tabIndex={0}
            role="button"
            aria-label="Gate 1 Entrance"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectZone("Gate_1"); } }}
            onClick={() => onSelectZone("Gate_1")}
          >
            <circle cx="190" cy="360" r="16" className={`transition-all duration-300 stroke-2 ${selectedZone === "Gate_1" ? "fill-cyan-900/80 stroke-cyan-400" : "fill-slate-800 stroke-slate-600 hover:fill-slate-700"}`} />
            <text x="190" y="364" className="fill-slate-200 text-[10px] font-mono font-bold" textAnchor="middle">G1</text>
          </g>

          {/* Gate 2 (North West) */}
          <g
            className="cursor-pointer group focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded"
            id="map-element-gate2"
            tabIndex={0}
            role="button"
            aria-label="Gate 2 Entrance"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectZone("Gate_2"); } }}
            onClick={() => onSelectZone("Gate_2")}
          >
            <circle cx="240" cy="210" r="16" className={`transition-all duration-300 stroke-2 ${selectedZone === "Gate_2" ? "fill-cyan-900/80 stroke-cyan-400" : "fill-slate-800 stroke-slate-600 hover:fill-slate-700"}`} />
            <text x="240" y="214" className="fill-slate-200 text-[10px] font-mono font-bold" textAnchor="middle">G2</text>
          </g>

          {/* Gate 3 (North East) */}
          <g
            className="cursor-pointer group focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded"
            id="map-element-gate3"
            tabIndex={0}
            role="button"
            aria-label="Gate 3 Entrance"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectZone("Gate_3"); } }}
            onClick={() => onSelectZone("Gate_3")}
          >
            <circle cx="560" cy="210" r="16" className={`transition-all duration-300 stroke-2 ${selectedZone === "Gate_3" ? "fill-cyan-900/80 stroke-cyan-400" : "fill-slate-800 stroke-slate-600 hover:fill-slate-700"}`} />
            <text x="560" y="214" className="fill-slate-200 text-[10px] font-mono font-bold" textAnchor="middle">G3</text>
          </g>

          {/* Gate 4 (North Central Entrance) */}
          <g
            className="cursor-pointer group focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded"
            id="map-element-gate4"
            tabIndex={0}
            role="button"
            aria-label="Gate 4 North Entrance"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectZone("Gate_4"); } }}
            onClick={() => onSelectZone("Gate_4")}
          >
            <circle cx="400" cy="165" r="20" className={`transition-all duration-300 stroke-2 ${selectedZone === "Gate_4" ? "ring-2 ring-cyan-400" : ""} ${getGate4Status()}`} />
            <text x="400" y="169" className="fill-slate-950 text-[11px] font-mono font-bold" textAnchor="middle">G4</text>
            <path d="M 400,135 L 400,145" stroke="#334155" strokeWidth="2" />
          </g>

          {/* Gate 5 (East Entrance) */}
          <g
            className="cursor-pointer group focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded"
            id="map-element-gate5"
            tabIndex={0}
            role="button"
            aria-label="Gate 5 East Entrance"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectZone("Gate_5"); } }}
            onClick={() => onSelectZone("Gate_5")}
          >
            <circle cx="610" cy="360" r="16" className={`transition-all duration-300 stroke-2 ${selectedZone === "Gate_5" ? "fill-cyan-900/80 stroke-cyan-400" : "fill-slate-800 stroke-slate-600 hover:fill-slate-700"}`} />
            <text x="610" y="364" className="fill-slate-200 text-[10px] font-mono font-bold" textAnchor="middle">G5</text>
          </g>

          {/* Support Elements: First Aid Post & Concessions */}
          {/* First Aid 2 */}
          <g
            className="cursor-pointer group focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded"
            tabIndex={0}
            role="button"
            aria-label="First Aid Post 2"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectZone("First_Aid_Post_2"); } }}
            onClick={() => onSelectZone("First_Aid_Post_2")}
          >
            <rect x="530" y="280" width="22" height="22" rx="3" fill="#ef4444" stroke="#fca5a5" strokeWidth="1" className={selectedZone === "First_Aid_Post_2" ? "stroke-cyan-400 stroke-2" : ""} />
            <path d="M 541,286 L 541,296 M 536,291 L 546,291" stroke="#ffffff" strokeWidth="2" />
          </g>

          {/* Concessions / Food Zone C */}
          <g
            className="cursor-pointer group focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded"
            tabIndex={0}
            role="button"
            aria-label="Concession and Food Plaza C"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectZone("Concession_Plaza_C"); } }}
            onClick={() => onSelectZone("Concession_Plaza_C")}
          >
            <rect x="520" y="400" width="22" height="22" rx="3" fill="#f59e0b" stroke="#fcd34d" strokeWidth="1" className={selectedZone === "Concession_Plaza_C" ? "stroke-cyan-400 stroke-2" : ""} />
            <text x="531" y="415" className="fill-slate-950 text-[10px] font-bold font-mono" textAnchor="middle">F</text>
          </g>
        </svg>

        {/* INTERACTIVE STADIUM DETAILED POPUP OVERLAY */}
        {selectedDetails && (
          <div className="absolute bottom-2 left-2 right-2 md:bottom-auto md:left-auto md:top-4 md:right-4 md:w-72 bg-slate-950/95 border border-cyan-500/50 rounded-xl p-3.5 shadow-2xl backdrop-blur-md z-20 animate-fadeIn text-xs text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                selectedDetails.status === "critical" ? "bg-rose-950 text-rose-400 border border-rose-900/50" :
                selectedDetails.status === "warning" ? "bg-amber-950 text-amber-400 border border-amber-900/50" :
                "bg-emerald-950 text-emerald-400 border border-emerald-900/50"
              }`}>
                {selectedDetails.status.toUpperCase()}
              </span>
              <button 
                onClick={(e) => { e.stopPropagation(); onSelectZone(""); }}
                aria-label="Close details popup"
                className="text-slate-500 hover:text-slate-200 font-mono text-[11px] cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded px-1"
              >
                [X]
              </button>
            </div>
            
            <h5 className="font-semibold text-slate-100 font-sans text-sm tracking-tight mb-1.5">{selectedDetails.name}</h5>
            
            <div className="grid grid-cols-2 gap-2 font-mono text-[10px] bg-slate-900/50 p-2 rounded border border-slate-850 mb-2">
              <div>
                <span className="text-slate-500 block text-[8px] uppercase">Current Queue</span>
                <span className="text-slate-200 font-medium">{selectedDetails.currentQueue}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[8px] uppercase">Projected Queue</span>
                <span className="text-slate-200 font-medium">{selectedDetails.projectedQueue}</span>
              </div>
            </div>

            <div className="space-y-1 mt-1 bg-slate-900/30 p-2 rounded">
              <span className="text-[8px] font-mono text-slate-500 block uppercase">Recommended AI Dispatch Action</span>
              <p className="text-[10px] text-cyan-300 font-sans font-medium tracking-tight leading-relaxed">
                ↓ {selectedDetails.recommendation}
              </p>
            </div>

            <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 mt-2.5 pt-1 border-t border-slate-900">
              <span>SYSTEM CLUSTER CONFIDENCE</span>
              <span className="text-emerald-400 font-bold">{selectedDetails.confidence}</span>
            </div>
          </div>
        )}
      </div>

      {/* Legend & Details */}
      <div className="grid grid-cols-4 gap-1 text-[9px] font-mono bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 mt-1">
        <div className="flex items-center space-x-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          <span className="text-slate-400">Normal / Safe</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-500"></span>
          <span className="text-slate-400">Warning / Alert</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-slate-400">Critical Incident</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="h-2 w-2 rounded bg-sky-500"></span>
          <span className="text-slate-400">Transit Terminal</span>
        </div>
      </div>
    </div>
  );
};
