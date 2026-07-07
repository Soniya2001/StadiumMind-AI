import React, { useEffect, useRef, useState } from "react";
import { Terminal, Shield, MessageSquare, Zap, Eye, CheckCircle2 } from "lucide-react";

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

interface ConsoleTerminalProps {
  steps: SimulationStep[];
  isSimulating: boolean;
  activeStepIndex: number;
}

export const ConsoleTerminal: React.FC<ConsoleTerminalProps> = React.memo(({
  steps,
  isSimulating,
  activeStepIndex,
}) => {
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeStepIndex, steps]);

  const getAgentTheme = (agentId: string) => {
    switch (agentId) {
      case "fan":
        return {
          bg: "bg-fuchsia-950/40 border-fuchsia-800/80",
          text: "text-fuchsia-400",
          accent: "fuchsia",
          label: "Fan Concierge Agent"
        };
      case "crowd":
        return {
          bg: "bg-emerald-950/40 border-emerald-800/80",
          text: "text-emerald-400",
          accent: "emerald",
          label: "Crowd Intelligence Agent"
        };
      case "transit":
        return {
          bg: "bg-sky-950/40 border-sky-800/80",
          text: "text-sky-400",
          accent: "sky",
          label: "Transportation Agent"
        };
      case "volunteer":
        return {
          bg: "bg-violet-950/40 border-violet-800/80",
          text: "text-violet-400",
          accent: "violet",
          label: "Volunteer Copilot Agent"
        };
      case "emergency":
        return {
          bg: "bg-rose-950/40 border-rose-800/80",
          text: "text-rose-400",
          accent: "rose",
          label: "Emergency Coordinator"
        };
      case "sustainability":
        return {
          bg: "bg-amber-950/40 border-amber-800/80",
          text: "text-amber-400",
          accent: "amber",
          label: "Sustainability Agent"
        };
      default:
        return {
          bg: "bg-slate-950/40 border-slate-800",
          text: "text-slate-400",
          accent: "slate",
          label: "Core AI Supervisor"
        };
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case "THINKING":
        return <Eye className="h-3.5 w-3.5 animate-pulse text-indigo-400" />;
      case "TOOL_CALL":
        return <Zap className="h-3.5 w-3.5 text-amber-400" />;
      case "COMMUNICATION":
        return <MessageSquare className="h-3.5 w-3.5 text-cyan-400" />;
      case "DECISION":
        return <Shield className="h-3.5 w-3.5 text-emerald-400" />;
      default:
        return <Terminal className="h-3.5 w-3.5 text-slate-400" />;
    }
  };

  const visibleSteps = steps.slice(0, activeStepIndex + 1);

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl border border-slate-800 overflow-hidden font-mono text-xs">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Terminal className="h-4 w-4 text-cyan-400" />
          <span className="font-semibold text-slate-200 text-xs tracking-tight">STADIUMMIND_OS_BUS_CONSOLE</span>
        </div>
        <div className="flex space-x-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-800"></span>
          <span className="h-2.5 w-2.5 rounded-full bg-slate-800"></span>
          <span className="h-2.5 w-2.5 rounded-full bg-slate-800"></span>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[300px] max-h-[500px]">
        {visibleSteps.length === 0 ? (
          <div className="space-y-2.5 animate-fadeIn">
            <div className="text-[10px] text-cyan-400 font-mono tracking-wider mb-2 uppercase border-b border-slate-900 pb-1.5 flex items-center justify-between">
              <span>📡 ACTIVE BASELINE AMBIENT STREAM</span>
              <span className="text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-900/30 px-1 py-0.5 rounded uppercase text-[8px] animate-pulse">● LIVE CORRIDOR TELEMETRY</span>
            </div>
            
            <div className="flex items-start space-x-2 p-2 rounded bg-slate-900/30 border border-slate-900">
              <span className="text-slate-500 font-bold">12:01:05</span>
              <div>
                <span className="text-emerald-400 font-bold bg-emerald-950 px-1 rounded text-[9px] uppercase font-mono mr-1.5">[CORE SUPERVISOR]</span>
                <span className="text-slate-300 font-sans">Crowd occupancy margins nominal. All 32 physical corridors healthy.</span>
              </div>
            </div>

            <div className="flex items-start space-x-2 p-2 rounded bg-slate-900/30 border border-slate-900">
              <span className="text-slate-500 font-bold">12:03:12</span>
              <div>
                <span className="text-sky-400 font-bold bg-sky-950 px-1 rounded text-[9px] uppercase font-mono mr-1.5">[TRANSIT OUTLETS]</span>
                <span className="text-slate-300 font-sans">Metro fleet terminal bay A check-in: 100% schedule consistency maintained.</span>
              </div>
            </div>

            <div className="flex items-start space-x-2 p-2 rounded bg-slate-900/30 border border-slate-900">
              <span className="text-slate-500 font-bold">12:05:40</span>
              <div>
                <span className="text-violet-400 font-bold bg-violet-950 px-1 rounded text-[9px] uppercase font-mono mr-1.5">[VOLUNTEER COGNITIVE]</span>
                <span className="text-slate-300 font-sans">Sector rotational checklist fully validated. On-ground staff in standby position.</span>
              </div>
            </div>

            <div className="flex items-start space-x-2 p-2 rounded bg-slate-900/30 border border-slate-900">
              <span className="text-slate-500 font-bold">12:07:18</span>
              <div>
                <span className="text-amber-400 font-bold bg-amber-950 px-1 rounded text-[9px] uppercase font-mono mr-1.5">[DEVICES INTEGRATION]</span>
                <span className="text-slate-300 font-sans">Gate B security scanner suite report: 21ms mean processing time. All systems green.</span>
              </div>
            </div>

            <div className="flex items-start space-x-2 p-2 rounded bg-slate-900/30 border border-slate-900">
              <span className="text-slate-500 font-bold">12:10:02</span>
              <div>
                <span className="text-teal-400 font-bold bg-teal-950 px-1 rounded text-[9px] uppercase font-mono mr-1.5">[RESOURCE CONTROL]</span>
                <span className="text-slate-300 font-sans">Ecological bin capacity level monitoring: Current aggregate fill index is 34%.</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col items-center justify-center text-center text-slate-500 py-6 space-y-2 border-t border-slate-900 mt-2">
              <Terminal className="h-6 w-6 text-slate-700 animate-pulse" />
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Awaiting incident trigger trace...</p>
              <p className="text-[9px] text-slate-600 font-mono">SELECT A PRESET FROM THE LEFT OR INJECT A CUSTOM DISPATCH TO BEGIN ORCHESTRATION</p>
            </div>
          </div>
        ) : (
          visibleSteps.map((step, idx) => {
            const theme = getAgentTheme(step.agentId);
            const isLatest = idx === activeStepIndex;
            const isOpen = expandedIndex === idx;

            return (
              <div
                key={idx}
                className={`transition-all duration-300 transform scale-100 border rounded-lg p-3 ${theme.bg} ${
                  isLatest ? "ring-1 ring-cyan-500/50 shadow-lg shadow-cyan-950/20" : ""
                }`}
              >
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-950 uppercase tracking-widest ${theme.text}`}>
                      {theme.label}
                    </span>
                    <span className="text-[10px] text-slate-500">•</span>
                    <span className="flex items-center space-x-1 bg-slate-950 px-1.5 py-0.5 rounded text-[9px] text-slate-400 uppercase">
                      {getActionIcon(step.actionType)}
                      <span>{step.actionType}</span>
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-600 uppercase">STEP #{idx + 1}</span>
                </div>

                {/* Primary Message */}
                <div className="mt-2 text-slate-100 text-xs font-sans leading-relaxed">
                  {step.message}
                </div>

                {/* Expansion Trigger */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/50 flex justify-between items-center">
                  <button
                    id={`expand-step-${idx}`}
                    onClick={() => setExpandedIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    aria-controls={`step-details-${idx}`}
                    aria-label={isOpen ? `Collapse reasoning details for step ${idx + 1}` : `Expand cognitive state reasoning details for step ${idx + 1}`}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center space-x-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded px-1"
                  >
                    <span>{isOpen ? "[-] COLLAPSE REASONING" : "[+] EXPAND COGNITIVE STATE"}</span>
                  </button>

                  {/* Contextual tool indicators */}
                  {step.toolName && (
                    <span className="text-[9px] text-amber-400 bg-amber-950/40 border border-amber-800/50 px-1.5 py-0.5 rounded uppercase">
                      API: {step.toolName}
                    </span>
                  )}
                  {step.targetAgentId && (
                    <span className="text-[9px] text-indigo-400 bg-indigo-950/40 border border-indigo-800/50 px-1.5 py-0.5 rounded uppercase">
                      PEER: @{step.targetAgentId}
                    </span>
                  )}
                </div>

                {/* Expanded Cognition Panel */}
                {isOpen && (
                  <div
                    id={`step-details-${idx}`}
                    role="region"
                    aria-labelledby={`expand-step-${idx}`}
                    className="mt-3 bg-slate-950 p-2.5 rounded border border-slate-800/80 animate-fadeIn text-[11px] leading-relaxed space-y-2"
                  >
                    <div>
                      <span className="text-slate-500 block uppercase text-[9px] font-bold mb-1 tracking-wider">Inner Cognitive Process & Context:</span>
                      <p className="text-slate-300 font-sans">{step.details}</p>
                    </div>

                    {step.toolArgs && Object.keys(step.toolArgs).length > 0 && (
                      <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                        <span className="text-amber-400 block uppercase text-[9px] font-bold mb-1">Tool Execution Payload:</span>
                        <pre className="text-[10px] text-slate-300 overflow-x-auto whitespace-pre-wrap leading-tight">
                          {JSON.stringify(step.toolArgs, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}

        {isSimulating && activeStepIndex < steps.length - 1 && (
          <div className="flex items-center space-x-2 text-cyan-400 text-[10px] py-1">
            <span className="h-2 w-2 rounded-full bg-cyan-500 animate-ping"></span>
            <span className="animate-pulse">NEXT AGENT COMMUNICATING IN TRACE...</span>
          </div>
        )}

        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Footer */}
      <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500">
        <span>AGENTS_CONNECTED: 6</span>
        <span>BUS_STATE: {isSimulating ? "SIMULATING" : steps.length > 0 ? "RESOLVED" : "STANDBY"}</span>
      </div>
    </div>
  );
});
