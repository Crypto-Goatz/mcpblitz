// ============================================================
// MCPBlitz - AI Chat API with MCP Tool Calling
// ============================================================
// Connects Claude to MCP tools via Rocket+ API
// ============================================================

import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

// MCP Tools available through Rocket+
const MCP_TOOLS: Anthropic.Tool[] = [
  {
    name: 'list_mods',
    description: 'List all available Rocket+ mods and their tools',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: []
    }
  },
  {
    name: 'content_generate',
    description: 'Generate a blog post with social media content on any topic',
    input_schema: {
      type: 'object' as const,
      properties: {
        topic: {
          type: 'string',
          description: 'The topic to write about'
        },
        type: {
          type: 'string',
          enum: ['blog', 'social', 'email'],
          description: 'Type of content to generate'
        },
        tone: {
          type: 'string',
          enum: ['professional', 'casual', 'friendly', 'authoritative'],
          description: 'Tone of the content'
        }
      },
      required: ['topic']
    }
  },
  {
    name: 'content_ideas',
    description: 'Generate content ideas for a given topic or industry',
    input_schema: {
      type: 'object' as const,
      properties: {
        topic: {
          type: 'string',
          description: 'The topic or industry to generate ideas for'
        },
        count: {
          type: 'number',
          description: 'Number of ideas to generate (default 5)'
        }
      },
      required: ['topic']
    }
  },
  {
    name: 'get_contacts',
    description: 'Get contacts from the CRM with optional filtering',
    input_schema: {
      type: 'object' as const,
      properties: {
        limit: {
          type: 'number',
          description: 'Maximum number of contacts to return'
        },
        query: {
          type: 'string',
          description: 'Search query to filter contacts'
        }
      },
      required: []
    }
  },
  {
    name: 'create_contact',
    description: 'Create a new contact in the CRM',
    input_schema: {
      type: 'object' as const,
      properties: {
        firstName: {
          type: 'string',
          description: 'Contact first name'
        },
        lastName: {
          type: 'string',
          description: 'Contact last name'
        },
        email: {
          type: 'string',
          description: 'Contact email address'
        },
        phone: {
          type: 'string',
          description: 'Contact phone number'
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Tags to add to the contact'
        }
      },
      required: ['email']
    }
  },
  {
    name: 'send_sms',
    description: 'Send an SMS message to a contact',
    input_schema: {
      type: 'object' as const,
      properties: {
        contactId: {
          type: 'string',
          description: 'The contact ID to send SMS to'
        },
        message: {
          type: 'string',
          description: 'The SMS message content'
        }
      },
      required: ['contactId', 'message']
    }
  },
  {
    name: 'course_outline',
    description: 'Generate a course outline on any topic',
    input_schema: {
      type: 'object' as const,
      properties: {
        topic: {
          type: 'string',
          description: 'The course topic'
        },
        modules: {
          type: 'number',
          description: 'Number of modules (default 5)'
        },
        targetAudience: {
          type: 'string',
          description: 'Who the course is for'
        }
      },
      required: ['topic']
    }
  },
  {
    name: 'seo_analyze',
    description: 'Analyze SEO for a URL or content',
    input_schema: {
      type: 'object' as const,
      properties: {
        url: {
          type: 'string',
          description: 'URL to analyze'
        },
        content: {
          type: 'string',
          description: 'Content to analyze for SEO'
        },
        keywords: {
          type: 'array',
          items: { type: 'string' },
          description: 'Target keywords to check'
        }
      },
      required: []
    }
  }
]

// Execute tool via Rocket+ MCP
async function executeMCPTool(toolName: string, params: Record<string, unknown>, apiKey: string) {
  const response = await fetch('https://rocketadd.com/api/mcp/execute', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      tool: toolName,
      params
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`MCP tool execution failed: ${error}`)
  }

  return response.json()
}

export async function POST(request: NextRequest) {
  try {
    const { messages, apiKey, rocketApiKey } = await request.json()

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Anthropic API key required' },
        { status: 400 }
      )
    }

    const anthropic = new Anthropic({ apiKey })

    // System message that explains the AI's capabilities
    const systemMessage = `You are a helpful AI assistant powered by MCPBlitz. You have access to powerful business tools through Rocket+ MCP integration.

Available capabilities:
- Generate blog posts and social media content
- Generate content ideas for any topic
- Access and manage CRM contacts
- Send SMS messages
- Create course outlines
- Analyze SEO

When users ask you to do something that requires these tools, use them! Be proactive and helpful.

After using a tool, summarize the results in a clear, friendly way. If generating content, show a preview and explain what was created.

Current date: ${new Date().toLocaleDateString()}`

    // Convert messages to Anthropic format
    const anthropicMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content
    }))

    // Initial API call with tools
    let response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemMessage,
      tools: rocketApiKey ? MCP_TOOLS : [], // Only provide tools if Rocket API key is set
      messages: anthropicMessages
    })

    // Process tool calls in a loop
    const toolResults: Array<{ tool: string; result: unknown }> = []

    while (response.stop_reason === 'tool_use') {
      const toolUseBlocks = response.content.filter(
        (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
      )

      const toolResultMessages: Anthropic.ToolResultBlockParam[] = []

      for (const toolUse of toolUseBlocks) {
        try {
          if (!rocketApiKey) {
            toolResultMessages.push({
              type: 'tool_result',
              tool_use_id: toolUse.id,
              content: JSON.stringify({ error: 'Rocket+ API key not configured. Please add your API key to use MCP tools.' })
            })
            continue
          }

          const result = await executeMCPTool(
            toolUse.name,
            toolUse.input as Record<string, unknown>,
            rocketApiKey
          )

          toolResults.push({ tool: toolUse.name, result })

          toolResultMessages.push({
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: JSON.stringify(result)
          })
        } catch (error) {
          toolResultMessages.push({
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: JSON.stringify({
              error: error instanceof Error ? error.message : 'Tool execution failed'
            })
          })
        }
      }

      // Continue the conversation with tool results
      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: systemMessage,
        tools: MCP_TOOLS,
        messages: [
          ...anthropicMessages,
          { role: 'assistant', content: response.content },
          { role: 'user', content: toolResultMessages }
        ]
      })
    }

    // Extract final text response
    const textContent = response.content.find(
      (block): block is Anthropic.TextBlock => block.type === 'text'
    )

    return NextResponse.json({
      message: textContent?.text || 'No response generated',
      toolsUsed: toolResults
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Chat failed' },
      { status: 500 }
    )
  }
}
