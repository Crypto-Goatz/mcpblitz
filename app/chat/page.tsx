"use client"

import { useState, useEffect } from 'react'
import { Zap, ArrowLeft, Rocket, Shield, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Chat from '../components/chat'

export default function ChatPage() {
  const [keys, setKeys] = useState({ anthropicKey: '', rocketApiKey: '' })

  // Load keys from localStorage on mount
  useEffect(() => {
    const savedKeys = localStorage.getItem('mcpblitz_keys')
    if (savedKeys) {
      try {
        setKeys(JSON.parse(savedKeys))
      } catch {
        // Ignore parse errors
      }
    }
  }, [])

  // Save keys to localStorage when changed
  const handleKeyChange = (newKeys: { anthropicKey: string; rocketApiKey: string }) => {
    setKeys(newKeys)
    localStorage.setItem('mcpblitz_keys', JSON.stringify(newKeys))
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </Link>
            <div className="w-px h-6 bg-zinc-800" />
            <Link href="/" className="flex items-center gap-2 logo-pulse cursor-pointer">
              <Zap className="w-8 h-8 text-orange-500" />
              <span className="text-xl font-bold">
                MCP<span className="gradient-text">Blitz</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-green-500" />
              Keys stored locally
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              AI-Powered Chat with MCP Tools
            </div>
            <h1 className="text-3xl font-bold mb-2">
              Talk to Your Business Tools
            </h1>
            <p className="text-zinc-400 max-w-md mx-auto">
              Generate content, manage contacts, and automate tasks using natural language.
              Powered by Claude and Rocket+ MCP.
            </p>
          </div>

          {/* Chat Component */}
          <Chat
            anthropicKey={keys.anthropicKey}
            rocketApiKey={keys.rocketApiKey}
            onKeyChange={handleKeyChange}
          />

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <h3 className="font-semibold mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                Content Generation
              </h3>
              <p className="text-sm text-zinc-500">
                Create blogs, social posts, and email campaigns instantly
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <h3 className="font-semibold mb-1 flex items-center gap-2">
                <Rocket className="w-4 h-4 text-orange-500" />
                CRM Integration
              </h3>
              <p className="text-sm text-zinc-500">
                Manage contacts, send messages, and track deals
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <h3 className="font-semibold mb-1 flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-500" />
                Instant Actions
              </h3>
              <p className="text-sm text-zinc-500">
                Execute automations and workflows in real-time
              </p>
            </div>
          </div>
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
  )
}
