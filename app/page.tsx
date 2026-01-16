"use client";

import { useState } from "react";
import {
  Zap, ArrowRight, Check, Users, Mail, Globe,
  CreditCard, FileText, Bot, Sparkles, Download,
  Copy, CheckCircle2, MessageSquare, BarChart3,
  Calendar, ShoppingCart, Megaphone, PenTool,
  Database, Rocket, ChevronDown, ChevronUp, Star
} from "lucide-react";
import LogoWall from "./components/logo-wall";

// ============================================================
// OUTCOME-BASED WIZARD
// Users tell us WHAT they want to do, we recommend the tools
// ============================================================

interface ToolOption {
  id: string;
  name: string;
  auto?: boolean;  // AI Recommended
  reason: string;
  config: {
    command?: string;
    args?: string[];
    type?: string;
    url?: string;
    env?: Record<string, string>;
  };
}

interface Outcome {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category: string;
  tools: ToolOption[];
}

// What users can DO (outcomes) mapped to tool recommendations
const OUTCOMES: Outcome[] = [
  {
    id: "manage-leads",
    title: "Manage contacts & leads",
    description: "Track leads, manage contacts, organize your CRM",
    icon: Users,
    category: "CRM & Sales",
    tools: [
      {
        id: "rocket-plus",
        name: "Rocket+",
        auto: true,
        reason: "56+ CRM tools, contacts, pipelines, tags, workflows",
        config: { command: "npx", args: ["-y", "rocket-plus-mcp"] }
      },
      {
        id: "hubspot",
        name: "HubSpot",
        reason: "Popular CRM with marketing features",
        config: { command: "npx", args: ["-y", "hubspot-mcp"] }
      },
      {
        id: "salesforce",
        name: "Salesforce",
        reason: "Enterprise CRM platform",
        config: { command: "npx", args: ["-y", "salesforce-mcp"] }
      },
    ]
  },
  {
    id: "send-messages",
    title: "Send emails & SMS",
    description: "Automated follow-ups, campaigns, notifications",
    icon: Mail,
    category: "Communication",
    tools: [
      {
        id: "rocket-plus",
        name: "Rocket+",
        auto: true,
        reason: "SMS, email, and conversations via GHL",
        config: { command: "npx", args: ["-y", "rocket-plus-mcp"] }
      },
      {
        id: "resend",
        name: "Resend",
        reason: "Developer-friendly transactional email",
        config: { command: "npx", args: ["-y", "@resend/mcp"] }
      },
      {
        id: "twilio",
        name: "Twilio",
        reason: "SMS and voice APIs",
        config: { command: "npx", args: ["-y", "twilio-mcp"] }
      },
    ]
  },
  {
    id: "create-content",
    title: "Generate content & blogs",
    description: "AI-written blogs, social posts, marketing copy",
    icon: PenTool,
    category: "Content",
    tools: [
      {
        id: "rocket-plus",
        name: "Rocket+",
        auto: true,
        reason: "Content AI with blog + social post generation",
        config: { command: "npx", args: ["-y", "rocket-plus-mcp"] }
      },
      {
        id: "notion",
        name: "Notion",
        reason: "Notes and content management",
        config: { command: "npx", args: ["-y", "notion-mcp"] }
      },
    ]
  },
  {
    id: "build-website",
    title: "Build landing pages & websites",
    description: "Create and deploy web pages",
    icon: Globe,
    category: "Web",
    tools: [
      {
        id: "vercel",
        name: "Vercel",
        auto: true,
        reason: "Fast deployments, preview URLs, hosting",
        config: { command: "npx", args: ["-y", "vercel-mcp"] }
      },
      {
        id: "webflow",
        name: "Webflow",
        reason: "Visual website builder",
        config: { command: "npx", args: ["-y", "webflow-mcp"] }
      },
      {
        id: "rocket-plus",
        name: "Rocket+ Canvas",
        reason: "Landing page builder with GHL integration",
        config: { command: "npx", args: ["-y", "rocket-plus-mcp"] }
      },
    ]
  },
  {
    id: "take-payments",
    title: "Accept payments",
    description: "Payment links, invoices, subscriptions",
    icon: CreditCard,
    category: "Payments",
    tools: [
      {
        id: "stripe",
        name: "Stripe",
        auto: true,
        reason: "Industry standard for payments",
        config: { command: "npx", args: ["-y", "stripe-mcp"] }
      },
      {
        id: "rocket-plus",
        name: "Rocket+",
        reason: "GHL invoicing and payment links",
        config: { command: "npx", args: ["-y", "rocket-plus-mcp"] }
      },
      {
        id: "paypal",
        name: "PayPal",
        reason: "Widely accepted payment platform",
        config: { command: "npx", args: ["-y", "paypal-mcp"] }
      },
    ]
  },
  {
    id: "schedule-meetings",
    title: "Schedule appointments",
    description: "Calendars, bookings, reminders",
    icon: Calendar,
    category: "Scheduling",
    tools: [
      {
        id: "rocket-plus",
        name: "Rocket+",
        auto: true,
        reason: "GHL calendars with contact integration",
        config: { command: "npx", args: ["-y", "rocket-plus-mcp"] }
      },
      {
        id: "google-calendar",
        name: "Google Calendar",
        reason: "Widely used calendar",
        config: { command: "npx", args: ["-y", "google-calendar-mcp"] }
      },
      {
        id: "calendly",
        name: "Calendly",
        reason: "Scheduling automation",
        config: { command: "npx", args: ["-y", "calendly-mcp"] }
      },
    ]
  },
  {
    id: "run-marketing",
    title: "Run marketing campaigns",
    description: "Funnels, automations, A/B testing",
    icon: Megaphone,
    category: "Marketing",
    tools: [
      {
        id: "rocket-plus",
        name: "Rocket+",
        auto: true,
        reason: "Full marketing suite - funnels, workflows, campaigns",
        config: { command: "npx", args: ["-y", "rocket-plus-mcp"] }
      },
      {
        id: "mailchimp",
        name: "Mailchimp",
        reason: "Email marketing platform",
        config: { command: "npx", args: ["-y", "mailchimp-mcp"] }
      },
    ]
  },
  {
    id: "track-analytics",
    title: "Track analytics & metrics",
    description: "Website traffic, conversions, reporting",
    icon: BarChart3,
    category: "Analytics",
    tools: [
      {
        id: "ga4",
        name: "Google Analytics",
        auto: true,
        reason: "Industry standard for web analytics",
        config: { command: "uvx", args: ["--from", "google-analytics-mcp", "ga4-mcp-server"] }
      },
      {
        id: "rocket-plus",
        name: "Rocket+",
        reason: "CRM analytics and AI insights",
        config: { command: "npx", args: ["-y", "rocket-plus-mcp"] }
      },
    ]
  },
  {
    id: "manage-data",
    title: "Store & manage data",
    description: "Databases, spreadsheets, knowledge bases",
    icon: Database,
    category: "Data",
    tools: [
      {
        id: "supabase",
        name: "Supabase",
        auto: true,
        reason: "Postgres database with realtime & auth",
        config: { type: "http", url: "https://mcp.supabase.com/mcp" }
      },
      {
        id: "airtable",
        name: "Airtable",
        reason: "Spreadsheet-database hybrid",
        config: { command: "npx", args: ["-y", "airtable-mcp"] }
      },
      {
        id: "google-sheets",
        name: "Google Sheets",
        reason: "Collaborative spreadsheets",
        config: { command: "npx", args: ["-y", "google-sheets-mcp"] }
      },
    ]
  },
  {
    id: "sell-online",
    title: "Sell products online",
    description: "E-commerce, inventory, orders",
    icon: ShoppingCart,
    category: "E-commerce",
    tools: [
      {
        id: "shopify",
        name: "Shopify",
        auto: true,
        reason: "Leading e-commerce platform",
        config: { command: "npx", args: ["-y", "shopify-mcp"] }
      },
      {
        id: "stripe",
        name: "Stripe",
        reason: "Payment processing for products",
        config: { command: "npx", args: ["-y", "stripe-mcp"] }
      },
    ]
  },
  {
    id: "team-chat",
    title: "Collaborate with team",
    description: "Team messaging, notifications, updates",
    icon: MessageSquare,
    category: "Communication",
    tools: [
      {
        id: "slack",
        name: "Slack",
        auto: true,
        reason: "Team communication hub",
        config: { command: "npx", args: ["-y", "slack-mcp"] }
      },
      {
        id: "discord",
        name: "Discord",
        reason: "Community and team chat",
        config: { command: "npx", args: ["-y", "discord-mcp"] }
      },
    ]
  },
  {
    id: "automate-workflows",
    title: "Automate business workflows",
    description: "Triggers, sequences, multi-step automations",
    icon: Zap,
    category: "Automation",
    tools: [
      {
        id: "rocket-plus",
        name: "Rocket+",
        auto: true,
        reason: "RocketFlow automation engine with 56+ tools",
        config: { command: "npx", args: ["-y", "rocket-plus-mcp"] }
      },
    ]
  },
];

type Step = "welcome" | "outcomes" | "tools" | "generating" | "complete";

export default function Home() {
  const [step, setStep] = useState<Step>("welcome");
  const [selectedOutcomes, setSelectedOutcomes] = useState<string[]>([]);
  const [toolSelections, setToolSelections] = useState<Record<string, string>>({});
  const [expandedOutcome, setExpandedOutcome] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Get tools for selected outcomes
  const getSelectedOutcomeData = () => {
    return OUTCOMES.filter(o => selectedOutcomes.includes(o.id));
  };

  // Initialize tool selections with AUTO defaults
  const initializeToolSelections = () => {
    const selections: Record<string, string> = {};
    selectedOutcomes.forEach(outcomeId => {
      const outcome = OUTCOMES.find(o => o.id === outcomeId);
      if (outcome) {
        const autoTool = outcome.tools.find(t => t.auto);
        selections[outcomeId] = autoTool?.id || outcome.tools[0].id;
      }
    });
    setToolSelections(selections);
  };

  // Generate config based on selections
  const generateConfig = () => {
    const mcpServers: Record<string, object> = {};
    const usedTools = new Set<string>();

    selectedOutcomes.forEach(outcomeId => {
      const outcome = OUTCOMES.find(o => o.id === outcomeId);
      const selectedToolId = toolSelections[outcomeId];
      const tool = outcome?.tools.find(t => t.id === selectedToolId);

      if (tool && !usedTools.has(tool.id)) {
        usedTools.add(tool.id);
        mcpServers[tool.id] = {
          type: tool.config.type || "stdio",
          ...tool.config,
          env: tool.config.env || {}
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

  const toggleOutcome = (outcomeId: string) => {
    setSelectedOutcomes(prev =>
      prev.includes(outcomeId)
        ? prev.filter(id => id !== outcomeId)
        : [...prev, outcomeId]
    );
  };

  const getProgress = () => {
    switch (step) {
      case "welcome": return 0;
      case "outcomes": return 33;
      case "tools": return 66;
      case "generating": return 85;
      case "complete": return 100;
    }
  };

  // Count Rocket+ selections
  const getRocketPlusCount = () => {
    return Object.values(toolSelections).filter(t => t === "rocket-plus").length;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-radial">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 logo-pulse cursor-pointer" onClick={() => setStep("welcome")}>
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
          <div className="h-full progress-fill" style={{ width: `${getProgress()}%` }} />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">

          {/* Step: Welcome */}
          {step === "welcome" && (
            <div className="text-center wizard-enter">
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold mb-4">
                  What do you want AI to help with?
                </h1>
                <p className="text-xl text-zinc-400 max-w-md mx-auto">
                  Tell us your goals. We&apos;ll connect the right tools automatically.
                </p>
              </div>

              <div className="flex flex-col gap-4 items-center">
                <button
                  onClick={() => setStep("outcomes")}
                  className="btn-glow px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-semibold text-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                  Let&apos;s Go
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-sm text-zinc-500">
                  No coding required • 2 minute setup
                </p>
              </div>

              {/* Logo Wall */}
              <div className="mt-16 pt-8 border-t border-zinc-800">
                <LogoWall />
              </div>
            </div>
          )}

          {/* Step: Select Outcomes */}
          {step === "outcomes" && (
            <div className="wizard-enter">
              <h2 className="text-2xl font-bold mb-2 text-center">
                What do you want to do?
              </h2>
              <p className="text-zinc-400 text-center mb-8">
                Select everything you want AI to help with
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {OUTCOMES.map((outcome) => {
                  const Icon = outcome.icon;
                  const isSelected = selectedOutcomes.includes(outcome.id);
                  const hasRocketPlus = outcome.tools.some(t => t.id === "rocket-plus" && t.auto);

                  return (
                    <button
                      key={outcome.id}
                      onClick={() => toggleOutcome(outcome.id)}
                      className={`tool-card p-4 rounded-xl text-left transition-all ${isSelected ? 'selected' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-orange-500/20' : 'bg-zinc-800'}`}>
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-orange-500' : 'text-zinc-400'}`} />
                        </div>
                        {isSelected && <Check className="w-5 h-5 text-orange-500" />}
                      </div>
                      <div className="font-medium text-sm mb-1">{outcome.title}</div>
                      <div className="text-xs text-zinc-500 line-clamp-2">{outcome.description}</div>
                      {hasRocketPlus && (
                        <div className="mt-2 flex items-center gap-1">
                          <Rocket className="w-3 h-3 text-orange-500" />
                          <span className="text-xs text-orange-500">Rocket+ powered</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("welcome")}
                  className="px-6 py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:bg-zinc-800 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    initializeToolSelections();
                    setStep("tools");
                  }}
                  disabled={selectedOutcomes.length === 0}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                >
                  Continue with {selectedOutcomes.length} selected
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step: Tool Selection */}
          {step === "tools" && (
            <div className="wizard-enter">
              <h2 className="text-2xl font-bold mb-2 text-center">
                Review your AI toolkit
              </h2>
              <p className="text-zinc-400 text-center mb-2">
                We&apos;ve selected the best tools. Customize if needed.
              </p>
              {getRocketPlusCount() > 0 && (
                <div className="text-center mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-sm">
                    <Rocket className="w-4 h-4" />
                    {getRocketPlusCount()} task{getRocketPlusCount() > 1 ? 's' : ''} powered by Rocket+ (56+ tools)
                  </span>
                </div>
              )}

              <div className="space-y-3 mb-8">
                {getSelectedOutcomeData().map((outcome) => {
                  const Icon = outcome.icon;
                  const selectedToolId = toolSelections[outcome.id];
                  const selectedTool = outcome.tools.find(t => t.id === selectedToolId);
                  const isExpanded = expandedOutcome === outcome.id;

                  return (
                    <div key={outcome.id} className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                      <button
                        onClick={() => setExpandedOutcome(isExpanded ? null : outcome.id)}
                        className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-orange-500" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">{outcome.title}</div>
                            <div className="text-sm text-zinc-500 flex items-center gap-2">
                              {selectedTool?.id === "rocket-plus" && <Rocket className="w-3 h-3 text-orange-500" />}
                              {selectedTool?.name}
                              {selectedTool?.auto && (
                                <span className="flex items-center gap-1 text-xs text-green-500">
                                  <Star className="w-3 h-3" /> AI Pick
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-zinc-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-zinc-500" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 space-y-2">
                          {outcome.tools.map((tool) => (
                            <button
                              key={tool.id}
                              onClick={() => setToolSelections(prev => ({ ...prev, [outcome.id]: tool.id }))}
                              className={`w-full p-3 rounded-lg border text-left transition-all ${
                                selectedToolId === tool.id
                                  ? 'border-orange-500 bg-orange-500/10'
                                  : 'border-zinc-700 hover:border-zinc-600'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {tool.id === "rocket-plus" && <Rocket className="w-4 h-4 text-orange-500" />}
                                  <span className="font-medium">{tool.name}</span>
                                  {tool.auto && (
                                    <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400">
                                      Recommended
                                    </span>
                                  )}
                                </div>
                                {selectedToolId === tool.id && <Check className="w-4 h-4 text-orange-500" />}
                              </div>
                              <p className="text-xs text-zinc-500 mt-1">{tool.reason}</p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("outcomes")}
                  className="px-6 py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:bg-zinc-800 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    setStep("generating");
                    setTimeout(() => setStep("complete"), 2000);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
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
                Building your AI toolkit...
              </h2>
              <p className="text-zinc-400">
                Connecting {Object.keys(toolSelections).length} capabilities
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
                  Your AI Toolkit is Ready!
                </h2>
                <p className="text-zinc-400">
                  Copy this config to start using AI with your tools
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

              {/* What you can do */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-zinc-400 mb-3">What you can now do</h3>
                <div className="flex flex-wrap gap-2">
                  {getSelectedOutcomeData().map(outcome => {
                    const Icon = outcome.icon;
                    return (
                      <div key={outcome.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 text-sm">
                        <Icon className="w-4 h-4 text-orange-500" />
                        {outcome.title}
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
                    setSelectedOutcomes([]);
                    setToolSelections({});
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
                  Copy Config
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
