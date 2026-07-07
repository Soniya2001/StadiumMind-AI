import React, { useState, useMemo } from "react";
import { BLUEPRINT_DATA, BlueprintSection } from "../data/blueprint";
import { Search, BookOpen, Copy, Check, Filter } from "lucide-react";

export const BlueprintConsole: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("executive_summary");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [copied, setCopied] = useState(false);

  // Categories
  const categories = ["All", "Vision & Problem", "Agent Architecture", "Cloud & Data Tech", "Workflows & Journeys", "Hackathon Execution"];

  // Search and filter logic
  const filteredSections = useMemo(() => {
    return BLUEPRINT_DATA.filter((section) => {
      const matchesSearch =
        section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || section.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Find selected section
  const currentSection = useMemo(() => {
    return BLUEPRINT_DATA.find((s) => s.id === selectedSectionId) || BLUEPRINT_DATA[0];
  }, [selectedSectionId]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Quick helper to render custom simple markdown elements (bold, lists, code block, tables)
  const renderFormattedContent = (content: string) => {
    return content.split("\n").map((line, idx) => {
      // Empty line
      if (!line.trim()) return <div key={idx} className="h-2" />;

      // Header or Sub-Header
      if (line.startsWith("###")) {
        return (
          <h5 key={idx} className="text-sm font-semibold text-cyan-400 font-mono tracking-tight mt-4 mb-2">
            {line.replace("###", "").trim()}
          </h5>
        );
      }

      // Main Bullet Lists
      if (line.startsWith("*") || line.startsWith("-")) {
        const text = line.substring(1).trim();
        // Check for inline bold (**text**)
        return (
          <li key={idx} className="ml-4 list-disc text-slate-300 font-sans leading-relaxed text-xs mb-1">
            {parseInlineBold(text)}
          </li>
        );
      }

      // Nested lists
      if (line.startsWith("  *") || line.startsWith("  -")) {
        const text = line.trim().substring(1).trim();
        return (
          <li key={idx} className="ml-8 list-circle text-slate-400 font-sans leading-relaxed text-xs mb-1">
            {parseInlineBold(text)}
          </li>
        );
      }

      // Check for code blocks
      if (line.startsWith("```")) {
        return null; // Handle structural code block boundaries elsewhere if needed
      }

      // Tables lines parsing (very basic parser for blueprint tables)
      if (line.startsWith("|")) {
        // Skip separator line e.g., | :--- | :--- |
        if (line.includes("---")) return null;
        
        const cols = line.split("|").map(c => c.trim()).filter(c => c !== "");
        const isHeader = idx === 1 || idx === 0; // Quick crude header check
        
        return (
          <div key={idx} className={`grid grid-cols-4 gap-2 py-2 px-3 border-b border-slate-800 text-[11px] font-mono ${isHeader ? "bg-slate-900/60 font-semibold text-slate-100" : "text-slate-300 hover:bg-slate-900/20"}`}>
            {cols.map((col, colIdx) => (
              <span key={colIdx} className="truncate-2-lines">{parseInlineBold(col)}</span>
            ))}
          </div>
        );
      }

      // Standard text line
      return (
        <p key={idx} className="text-slate-300 font-sans leading-relaxed text-xs mb-3">
          {parseInlineBold(line)}
        </p>
      );
    });
  };

  const parseInlineBold = (text: string) => {
    const parts = text.split(/\*\*([\s\S]*?)\*\*/g);
    if (parts.length === 1) {
      return parseInlineCode(text);
    }
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="font-semibold text-slate-100">{part}</strong>;
      }
      return parseInlineCode(part);
    });
  };

  const parseInlineCode = (text: string) => {
    const parts = text.split(/`([^`]+)`/g);
    if (parts.length === 1) return text;
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <code key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-mono text-[10px]">{part}</code>;
      }
      return part;
    });
  };

  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 flex flex-col h-full min-h-[500px]">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800/80 mb-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-cyan-400" />
          <div>
            <h3 className="text-sm font-semibold text-slate-100 font-sans tracking-tight">Hackathon Arch-Blueprint Manual</h3>
            <p className="text-[10px] text-slate-400 font-sans">Full exhaustive details containing the 32 requested architectural sections</p>
          </div>
        </div>
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm md:ml-auto">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search RAG, Firestore, ADK, security..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-sans"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1.5 pb-4 border-b border-slate-800/40 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all uppercase tracking-wider cursor-pointer ${
              selectedCategory === cat
                ? "bg-cyan-500 text-slate-950 font-bold"
                : "bg-slate-900 hover:bg-slate-850 text-slate-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-hidden">
        {/* Left Sidebar - Interactive Section Selector */}
        <div className="md:col-span-1 border-r border-slate-800/60 pr-4 overflow-y-auto max-h-[450px] space-y-1">
          {filteredSections.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-[11px] font-mono">
              NO COMPILING MATCHES FOUND
            </div>
          ) : (
            filteredSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setSelectedSectionId(section.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-150 flex items-start space-x-2.5 cursor-pointer ${
                  selectedSectionId === section.id
                    ? "bg-slate-900 border border-slate-800 text-slate-100"
                    : "hover:bg-slate-900/40 text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="font-mono text-[10px] font-bold bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-cyan-400 mt-0.5">
                  {section.number}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium font-sans truncate tracking-tight">{section.title}</div>
                  <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest truncate mt-0.5">{section.category}</div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Right Pane - Rich Content Details */}
        <div className="md:col-span-2 flex flex-col h-full overflow-y-auto max-h-[450px] bg-slate-950/40 p-4 rounded-lg border border-slate-900">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded">
                SECTION #{currentSection.number}
              </span>
              <span className="text-slate-500 font-mono text-[10px] uppercase">{currentSection.category}</span>
            </div>
            
            {/* Copy Button */}
            <button
              onClick={() => handleCopy(currentSection.content)}
              className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850 transition-all cursor-pointer"
              title="Copy details as Markdown"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>

          <h4 className="text-base font-semibold text-slate-100 font-sans tracking-tight mb-4">
            {currentSection.title}
          </h4>

          {/* Render formatted content */}
          <div className="flex-1 font-sans text-xs space-y-1">
            {renderFormattedContent(currentSection.content)}
          </div>
        </div>
      </div>
    </div>
  );
};
