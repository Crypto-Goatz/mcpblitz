"use client"

// ============================================================
// MCP Logo Wall - Rotating logos of connected services
// ============================================================

const MCP_CONNECTIONS = [
  // Payments
  { name: "Stripe", logo: "https://logo.clearbit.com/stripe.com", category: "Payments" },
  { name: "PayPal", logo: "https://logo.clearbit.com/paypal.com", category: "Payments" },
  { name: "Square", logo: "https://logo.clearbit.com/squareup.com", category: "Payments" },

  // CRM
  { name: "GoHighLevel", logo: "https://logo.clearbit.com/gohighlevel.com", category: "CRM" },
  { name: "HubSpot", logo: "https://logo.clearbit.com/hubspot.com", category: "CRM" },
  { name: "Salesforce", logo: "https://logo.clearbit.com/salesforce.com", category: "CRM" },
  { name: "Pipedrive", logo: "https://logo.clearbit.com/pipedrive.com", category: "CRM" },
  { name: "Zoho", logo: "https://logo.clearbit.com/zoho.com", category: "CRM" },

  // E-commerce
  { name: "Shopify", logo: "https://logo.clearbit.com/shopify.com", category: "E-commerce" },
  { name: "WooCommerce", logo: "https://logo.clearbit.com/woocommerce.com", category: "E-commerce" },

  // Email
  { name: "Mailchimp", logo: "https://logo.clearbit.com/mailchimp.com", category: "Email" },
  { name: "SendGrid", logo: "https://logo.clearbit.com/sendgrid.com", category: "Email" },
  { name: "Resend", logo: "https://logo.clearbit.com/resend.com", category: "Email" },
  { name: "Gmail", logo: "https://logo.clearbit.com/gmail.com", category: "Email" },

  // Database
  { name: "Google Sheets", logo: "https://logo.clearbit.com/google.com", category: "Database" },
  { name: "Airtable", logo: "https://logo.clearbit.com/airtable.com", category: "Database" },
  { name: "Notion", logo: "https://logo.clearbit.com/notion.so", category: "Database" },
  { name: "Supabase", logo: "https://logo.clearbit.com/supabase.com", category: "Database" },
  { name: "PostgreSQL", logo: "https://logo.clearbit.com/postgresql.org", category: "Database" },

  // Scheduling
  { name: "Google Calendar", logo: "https://logo.clearbit.com/calendar.google.com", category: "Scheduling" },
  { name: "Calendly", logo: "https://logo.clearbit.com/calendly.com", category: "Scheduling" },

  // Communication
  { name: "Slack", logo: "https://logo.clearbit.com/slack.com", category: "Communication" },
  { name: "Twilio", logo: "https://logo.clearbit.com/twilio.com", category: "Communication" },
  { name: "Discord", logo: "https://logo.clearbit.com/discord.com", category: "Communication" },

  // Design & Development
  { name: "Canva", logo: "https://logo.clearbit.com/canva.com", category: "Design" },
  { name: "Vercel", logo: "https://logo.clearbit.com/vercel.com", category: "Deployment" },
  { name: "GitHub", logo: "https://logo.clearbit.com/github.com", category: "Development" },

  // Forms
  { name: "Webflow", logo: "https://logo.clearbit.com/webflow.com", category: "Landing Pages" },
  { name: "JotForm", logo: "https://logo.clearbit.com/jotform.com", category: "Forms" },
]

export default function LogoWall() {
  // Double the array for seamless infinite scroll
  const logos = [...MCP_CONNECTIONS, ...MCP_CONNECTIONS]

  return (
    <div className="w-full overflow-hidden py-8">
      <div className="mb-6 text-center">
        <p className="text-zinc-500 text-sm mb-2">Connect AI to 30+ business tools</p>
        <h3 className="text-lg font-semibold">
          Powered by <span className="gradient-text">MCP Federation</span>
        </h3>
      </div>

      {/* Scrolling container */}
      <div className="relative">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-zinc-950 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-zinc-950 to-transparent z-10" />

        {/* First row - scroll left */}
        <div className="flex animate-scroll-left mb-4">
          {logos.map((item, index) => (
            <div
              key={`row1-${index}`}
              className="flex-shrink-0 mx-3 group"
            >
              <div className="w-16 h-16 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center p-3 transition-all duration-300 group-hover:border-orange-500/50 group-hover:bg-zinc-800">
                <img
                  src={item.logo}
                  alt={item.name}
                  className="w-full h-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to first letter on error
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.parentElement!.innerHTML = `<span class="text-xl font-bold text-zinc-500">${item.name[0]}</span>`
                  }}
                />
              </div>
              <p className="text-xs text-zinc-600 text-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.name}
              </p>
            </div>
          ))}
        </div>

        {/* Second row - scroll right */}
        <div className="flex animate-scroll-right">
          {[...logos].reverse().map((item, index) => (
            <div
              key={`row2-${index}`}
              className="flex-shrink-0 mx-3 group"
            >
              <div className="w-16 h-16 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center p-3 transition-all duration-300 group-hover:border-orange-500/50 group-hover:bg-zinc-800">
                <img
                  src={item.logo}
                  alt={item.name}
                  className="w-full h-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.parentElement!.innerHTML = `<span class="text-xl font-bold text-zinc-500">${item.name[0]}</span>`
                  }}
                />
              </div>
              <p className="text-xs text-zinc-600 text-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-8 mt-8 text-center">
        <div>
          <div className="text-2xl font-bold gradient-text">30+</div>
          <div className="text-xs text-zinc-500">MCP Servers</div>
        </div>
        <div>
          <div className="text-2xl font-bold gradient-text">200+</div>
          <div className="text-xs text-zinc-500">API Tools</div>
        </div>
        <div>
          <div className="text-2xl font-bold gradient-text">10</div>
          <div className="text-xs text-zinc-500">Categories</div>
        </div>
      </div>
    </div>
  )
}
