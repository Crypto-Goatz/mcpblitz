# MCPBlitz

> The 5-minute AI setup wizard for everyone

**Domain:** mcpblitz.com
**Purpose:** Simple onboarding funnel for MCP configuration
**Parent:** MCPFED ecosystem

## What It Does

MCPBlitz is the "easy button" for connecting AI to business tools:

1. User answers 3-4 simple questions
2. System suggests relevant MCP tools
3. User customizes selection
4. Config is auto-generated
5. User copies config to Claude settings

## The Funnel

\`\`\`
MCPBlitz (Simple)     →     MCPFED (Advanced)     →     Rocket+ (Premium)
"5 min setup"               "Operations & FOPs"         "56+ CRM tools"
\`\`\`

## Tech Stack

- Next.js 16 (App Router)
- Tailwind CSS
- Lucide Icons
- No database needed (stateless wizard)

## File Structure

\`\`\`
mcpblitz/
├── app/
│   ├── layout.tsx      # Dark theme, metadata
│   ├── page.tsx        # Wizard component
│   └── globals.css     # Custom styles
└── public/             # Assets
\`\`\`

## MCP Tools Available

| Tool | Free | Category |
|------|------|----------|
| Google Analytics | Yes | Analytics |
| Supabase | Yes | Database |
| Vercel | Yes | Hosting |
| Rocket+ CRM | No (PRO) | CRM |
| Resend Email | Yes | Communication |
| Google Calendar | Yes | Productivity |
| Stripe | Yes | Payments |
| Notion | Yes | Productivity |

## Role-Based Suggestions

| Role | Suggested Tools |
|------|-----------------|
| Business Owner | Analytics, CRM, Payments, Email |
| Marketer | Analytics, Email, CRM, Docs |
| Developer | Database, Hosting, Docs, Analytics |
| Team Manager | CRM, Calendar, Docs, Analytics |

## Development

\`\`\`bash
cd /Users/rocketopp/Desktop/GitHub/mcpblitz
npm run dev
\`\`\`

## Deployment

Deploy to Vercel and point mcpblitz.com to it.

## Next Features

- [ ] Email capture before config download
- [ ] API key collection in wizard
- [ ] Direct installation via CLI command
- [ ] Embedded terminal preview
- [ ] Usage tracking/analytics
