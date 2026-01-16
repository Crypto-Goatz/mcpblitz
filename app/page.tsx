"use client";

import { useState } from "react";
import {
  Zap, ArrowRight, Check, Database, BarChart3,
  Globe, Rocket, Users, Mail, Calendar,
  CreditCard, FileText, Bot, Sparkles, Download,
  Terminal, Copy, CheckCircle2
} from "lucide-react";

// Available MCP tools with their free/paid status
const MCP_TOOLS = {
  analytics: {
    id: "ga4-analytics",
    name: "Google Analytics",
    description: "Traffic insights & user behavior",
    icon: BarChart3,
    free: true,
    category: "analytics",
    config: {
      command: "uvx",
      args: ["--from", "google-analytics-mcp", "ga4-mcp-server"],
    }
  },
  database: {
    id: "supabase",
    name: "Supabase",
    description: "Database & backend",
    icon: Database,
    free: true,
    category: "database",
    config: {
      type: "http",
      url: "https://mcp.supabase.com/mcp",
    }
  },
  hosting: {
    id: "vercel",
    name: "Vercel",
    description: "Deployments & hosting",
    icon: Globe,
    free: true,
    category: "hosting",
    config: {
      command: "npx",
      args: ["-y", "vercel-mcp"],
    }
  },
  crm: {
    id: "rocket-plus",
    name: "Rocket+ CRM",
    description: "Contacts, deals & automation",
    icon: Rocket,
    free: false,
    category: "crm",
    config: {
      command: "npx",
      args: ["-y", "rocket-plus-mcp"],
    }
  },
  email: {
    id: "resend",
    name: "Email (Resend)",
    description: "Send & track emails",
    icon: Mail,
    free: true,
    category: "communication",
    config: {
      command: "npx",
      args: ["-y", "@resend/mcp"],
    }
  },
  calendar: {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Events & scheduling",
    icon: Calendar,
    free: true,
    category: "productivity",
    config: {
      command: "npx",
      args: ["-y", "google-calendar-mcp"],
    }
  },
  payments: {
    id: "stripe",
    name: "Stripe",
    description: "Payments & subscriptions",
    icon: CreditCard,
    free: true,
    category: "payments",
    config: {
      command: "npx",
      args: ["-y", "stripe-mcp"],
    }
  },
  docs: {
    id: "notion",
    name: "Notion",
    description: "Notes & documentation",
    icon: FileText,
    free: true,
    category: "productivity",
    config: {
      command: "npx",
      args: ["-y", "notion-mcp"],
    }
  },
};

type Role = "business" | "marketer" | "developer" | "manager" | null;
type Step = "welcome" | "role" | "tools" | "generating" | "complete";

export default function Home() {
  const [step, setStep] = useState<Step>("welcome");
  const [role, setRole] = useState<Role>(null);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Suggested tools based on role
  const getSuggestedTools = (role: Role): string[] => {
    switch (role) {
      case "business":
        return ["analytics", "crm", "payments", "email"];
      case "marketer":
        return ["analytics", "email", "crm", "docs"];
      case "developer":
        return ["database", "hosting", "docs", "analytics"];
      case "manager":
        return ["crm", "calendar", "docs", "analytics"];
      default:
        return [];
    }
  };

  // Generate the MCP config JSON
  const generateConfig = () => {
    const mcpServers: Record<string, object> = {};

    selectedTools.forEach(toolKey => {
      const tool = MCP_TOOLS[toolKey as keyof typeof MCP_TOOLS];
      if (tool) {
        mcpServers[tool.id] = {
          type: "stdio",
          ...tool.config,
          env: {}
        };
      }
    });

    return JSON.stringify({ mcpServers }, null, 2);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateConfig());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleTool = (toolKey: string) => {
    setSelectedTools(prev =>
      prev.includes(toolKey)
        ? prev.filter(t => t !== toolKey)
        : [...prev, toolKey]
    );
  };

  // Progress percentage
  const getProgress = () => {
    switch (step) {
      case "welcome": return 0;
      case "role": return 25;
      case "tools": return 50;
      case "generating": return 75;
      case "complete": return 100;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 logo-pulse cursor-pointer">
            <Zap className="w-8 h-8 text-orange-500" />
            <span className="text-xl font-bold">
              MCP<span className="gradient-text">Blitz</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/chat"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-500 text-sm font-medium hover:bg-orange-500/20 transition-colors"
            >
              <Bot className="w-4 h-4" />
              Try AI Chat
            </a>
            <a
              href="https://mcpfed.com"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Advanced Setup →
            </a>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      {step !== "welcome" && (
        <div className="h-1 bg-zinc-800">
          <div
            className="h-full progress-fill"
            style={{ width: `${getProgress()}%` }}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">

          {/* Step: Welcome */}
          {step === "welcome" && (
            <div className="text-center wizard-enter">
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold mb-4">
                  Connect AI to Your Tools
                </h1>
                <p className="text-xl text-zinc-400 max-w-md mx-auto">
                  In 5 minutes, your AI will have access to your analytics, database, CRM, and more.
                </p>
              </div>

              <div className="flex flex-col gap-4 items-center">
                <button
                  onClick={() => setStep("role")}
                  className="btn-glow px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-semibold text-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                  Start Setup
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-sm text-zinc-500">
                  Free tools included • No credit card required
                </p>
              </div>

              {/* Social Proof */}
              <div className="mt-16 pt-8 border-t border-zinc-800">
                <p className="text-zinc-500 text-sm mb-4">Trusted by teams using</p>
                <div className="flex justify-center gap-8 opacity-50">
                  <span className="text-zinc-400">Claude</span>
                  <span className="text-zinc-400">Cursor</span>
                  <span className="text-zinc-400">VS Code</span>
                  <span className="text-zinc-400">Windsurf</span>
                </div>
              </div>
            </div>
          )}

          {/* Step: Role Selection */}
          {step === "role" && (
            <div className="wizard-enter">
              <h2 className="text-2xl font-bold mb-2 text-center">
                What describes you best?
              </h2>
              <p className="text-zinc-400 text-center mb-8">
                We&apos;ll suggest the best tools for your workflow
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: "business", label: "I run a business", icon: Users, desc: "Analytics, CRM, payments" },
                  { id: "marketer", label: "I'm a marketer", icon: BarChart3, desc: "Analytics, email, content" },
                  { id: "developer", label: "I'm a developer", icon: Terminal, desc: "Database, hosting, docs" },
                  { id: "manager", label: "I manage a team", icon: Calendar, desc: "CRM, calendar, docs" },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setRole(option.id as Role);
                      setSelectedTools(getSuggestedTools(option.id as Role));
                      setStep("tools");
                    }}
                    className="tool-card p-6 rounded-xl text-left hover:border-orange-500/50 transition-all"
                  >
                    <option.icon className="w-8 h-8 text-orange-500 mb-3" />
                    <div className="font-semibold mb-1">{option.label}</div>
                    <div className="text-sm text-zinc-500">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step: Tool Selection */}
          {step === "tools" && (
            <div className="wizard-enter">
              <h2 className="text-2xl font-bold mb-2 text-center">
                Select your tools
              </h2>
              <p className="text-zinc-400 text-center mb-8">
                We&apos;ve suggested tools for you. Customize as needed.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {Object.entries(MCP_TOOLS).map(([key, tool]) => {
                  const Icon = tool.icon;
                  const isSelected = selectedTools.includes(key);

                  return (
                    <button
                      key={key}
                      onClick={() => toggleTool(key)}
                      className={`tool-card p-4 rounded-xl text-left flex items-start gap-3 ${isSelected ? 'selected' : ''}`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-orange-500/20' : 'bg-zinc-800'}`}>
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-orange-500' : 'text-zinc-400'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{tool.name}</span>
                          {tool.free ? (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">FREE</span>
                          ) : (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400">PRO</span>
                          )}
                        </div>
                        <div className="text-sm text-zinc-500 truncate">{tool.description}</div>
                      </div>
                      {isSelected && (
                        <Check className="w-5 h-5 text-orange-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("role")}
                  className="px-6 py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:bg-zinc-800 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    setStep("generating");
                    setTimeout(() => setStep("complete"), 2000);
                  }}
                  disabled={selectedTools.length === 0}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                >
                  Generate My Config
                  <Sparkles className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step: Generating */}
          {step === "generating" && (
            <div className="wizard-enter text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-zinc-800 flex items-center justify-center animate-pulse">
                <Bot className="w-8 h-8 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Building your AI stack...
              </h2>
              <p className="text-zinc-400">
                Configuring {selectedTools.length} tool{selectedTools.length > 1 ? 's' : ''} for optimal performance
              </p>
            </div>
          )}

          {/* Step: Complete */}
          {step === "complete" && (
            <div className="wizard-enter">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  Your AI Stack is Ready!
                </h2>
                <p className="text-zinc-400">
                  Copy this config to your Claude settings
                </p>
              </div>

              {/* Config Preview */}
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden mb-6">
                <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-800/50">
                  <span className="text-sm text-zinc-400">claude.json</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-green-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 text-sm text-zinc-300 overflow-x-auto max-h-64">
                  {generateConfig()}
                </pre>
              </div>

              {/* Selected Tools Summary */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-zinc-400 mb-3">Included Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTools.map(key => {
                    const tool = MCP_TOOLS[key as keyof typeof MCP_TOOLS];
                    const Icon = tool.icon;
                    return (
                      <div key={key} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 text-sm">
                        <Icon className="w-4 h-4 text-orange-500" />
                        {tool.name}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setStep("welcome");
                    setRole(null);
                    setSelectedTools([]);
                  }}
                  className="px-6 py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:bg-zinc-800 transition-colors"
                >
                  Start Over
                </button>
                <button
                  onClick={handleCopy}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <Download className="w-5 h-5" />
                  Download Config
                </button>
              </div>

              {/* Next Steps */}
              <div className="mt-8 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                <h3 className="font-medium mb-2">Next Steps</h3>
                <ol className="text-sm text-zinc-400 space-y-2">
                  <li>1. Copy the config above</li>
                  <li>2. Add it to <code className="px-1.5 py-0.5 rounded bg-zinc-700 text-zinc-300">~/.claude.json</code></li>
                  <li>3. Restart Claude Code</li>
                  <li>4. Start talking to your tools!</li>
                </ol>
              </div>

              {/* Try AI Chat CTA */}
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-orange-500" />
                      Try AI-Powered Chat
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1">
                      Talk to your tools using natural language
                    </p>
                  </div>
                  <a
                    href="/chat"
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
                  >
                    Launch Chat
                  </a>
                </div>
              </div>

              {/* Upsell */}
              <div className="mt-4 text-center">
                <p className="text-sm text-zinc-500">
                  Want more advanced features?{" "}
                  <a href="https://mcpfed.com" className="text-orange-500 hover:underline">
                    Try MCPFED →
                  </a>
                </p>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-6">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between text-sm text-zinc-500">
          <span>© 2026 MCPBlitz. Part of the MCPFED ecosystem.</span>
          <div className="flex gap-6">
            <a href="https://mcpfed.com" className="hover:text-white transition-colors">MCPFED</a>
            <a href="https://rocketadd.com" className="hover:text-white transition-colors">Rocket+</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
