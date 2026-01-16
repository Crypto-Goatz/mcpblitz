"use client"

import { useState, useRef, useEffect } from 'react'
import {
  Send, Bot, User, Loader2, Sparkles, Key,
  Wrench, ChevronDown, ChevronUp, AlertCircle,
  CheckCircle2, Zap
} from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  toolsUsed?: Array<{ tool: string; result: unknown }>
}

interface ChatProps {
  anthropicKey?: string
  rocketApiKey?: string
  onKeyChange?: (keys: { anthropicKey: string; rocketApiKey: string }) => void
}

export default function Chat({ anthropicKey = '', rocketApiKey = '', onKeyChange }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(!anthropicKey)
  const [localAnthropicKey, setLocalAnthropicKey] = useState(anthropicKey)
  const [localRocketKey, setLocalRocketKey] = useState(rocketApiKey)
  const [expandedTools, setExpandedTools] = useState<Set<number>>(new Set())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSaveKeys = () => {
    onKeyChange?.({ anthropicKey: localAnthropicKey, rocketApiKey: localRocketKey })
    setShowSettings(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          apiKey: localAnthropicKey || anthropicKey,
          rocketApiKey: localRocketKey || rocketApiKey
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        toolsUsed: data.toolsUsed
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Something went wrong'}`
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleToolExpansion = (index: number) => {
    setExpandedTools(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const suggestedPrompts = [
    "Generate a blog post about AI marketing trends",
    "Give me 5 content ideas for a SaaS startup",
    "Create a course outline for learning Python",
    "List all available tools and mods"
  ]

  return (
    <div className="flex flex-col h-[600px] bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">MCPBlitz AI</h3>
            <p className="text-xs text-zinc-500">Powered by Claude + MCP Tools</p>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-lg transition-colors ${
            showSettings ? 'bg-orange-500/20 text-orange-500' : 'hover:bg-zinc-800 text-zinc-400'
          }`}
        >
          <Key className="w-4 h-4" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 border-b border-zinc-800 bg-zinc-800/30 space-y-3">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Anthropic API Key</label>
            <input
              type="password"
              value={localAnthropicKey}
              onChange={(e) => setLocalAnthropicKey(e.target.value)}
              placeholder="sk-ant-..."
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Rocket+ API Key (for MCP tools)</label>
            <input
              type="password"
              value={localRocketKey}
              onChange={(e) => setLocalRocketKey(e.target.value)}
              placeholder="rp_..."
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-orange-500"
            />
            <p className="text-xs text-zinc-500 mt-1">
              Get your key at <a href="https://rocketadd.com/settings/api-keys" target="_blank" className="text-orange-500 hover:underline">rocketadd.com</a>
            </p>
          </div>
          <button
            onClick={handleSaveKeys}
            disabled={!localAnthropicKey}
            className="w-full py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save & Start Chatting
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !showSettings && (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="font-semibold mb-2">What can I help you with?</h3>
            <p className="text-sm text-zinc-500 mb-6 max-w-xs">
              I can generate content, manage your CRM, create courses, and more using MCP tools.
            </p>
            <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setInput(prompt)}
                  className="text-left text-xs p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors border border-zinc-700"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-orange-500 text-white'
                  : 'bg-zinc-800'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>

              {/* Tool Usage Display */}
              {message.toolsUsed && message.toolsUsed.length > 0 && (
                <div className="mt-3 pt-3 border-t border-zinc-700">
                  <button
                    onClick={() => toggleToolExpansion(index)}
                    className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    <Wrench className="w-3 h-3" />
                    <span>{message.toolsUsed.length} tool{message.toolsUsed.length > 1 ? 's' : ''} used</span>
                    {expandedTools.has(index) ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>

                  {expandedTools.has(index) && (
                    <div className="mt-2 space-y-2">
                      {message.toolsUsed.map((tool, toolIndex) => (
                        <div key={toolIndex} className="bg-zinc-900 rounded-lg p-2">
                          <div className="flex items-center gap-2 text-xs">
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                            <span className="font-mono text-orange-400">{tool.tool}</span>
                          </div>
                          <pre className="mt-1 text-xs text-zinc-500 overflow-x-auto max-h-32">
                            {JSON.stringify(tool.result, null, 2).slice(0, 500)}
                            {JSON.stringify(tool.result).length > 500 && '...'}
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-zinc-700 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-zinc-300" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-zinc-800 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                Thinking...
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800">
        {!localAnthropicKey && !anthropicKey && !showSettings && (
          <div className="mb-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200">
              Add your Anthropic API key to start chatting.{' '}
              <button
                type="button"
                onClick={() => setShowSettings(true)}
                className="text-orange-500 hover:underline"
              >
                Open settings
              </button>
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              localAnthropicKey || anthropicKey
                ? "Ask me anything..."
                : "Add API key to start..."
            }
            disabled={isLoading || (!localAnthropicKey && !anthropicKey)}
            className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-orange-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || (!localAnthropicKey && !anthropicKey)}
            className="px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}
