/*
 * Site content for Biz Flow.
 * Edit text, numbers and contact details here — the pages are rendered from this file.
 */
window.BIZFLOW = {
  brand: {
    name: "Biz Flow",
    tagline: "Where Strategy Flows into Growth",
    headline: "Empowering educational institutes to grow, optimize & lead",
    intro:
      "Biz Flow merges financial discipline with AI-powered marketing, tech and events. We help schools, colleges and universities reduce costs, increase admissions and build a strong digital presence."
  },

  contact: {
    // CHECK: copied from the company profile PDF. Pakistani mobile numbers have
    // 10 digits after +92; this one has 11. Correct all three fields together.
    phoneDisplay: "+92 313 23653568",
    phoneTel: "+9231323653568",
    whatsapp: "9231323653568",
    email: "hello@bizflow.co",
    website: "www.bizflow.co",
    office: "Karachi, Pakistan"
  },

  painPoints: [
    { icon: "trendingUp", title: "Rising operational costs", text: "eating into profits" },
    { icon: "users", title: "Low admissions", text: "caused by a weak online presence" },
    { icon: "fileText", title: "Manual processes", text: "and lack of IT support" },
    { icon: "calendarX", title: "No structured event strategy", text: "for institutional branding" },
    { icon: "wallet", title: "Weak budgeting controls", text: "no forecasting or financial discipline" }
  ],

  mission: "To make every school, college and university financially efficient and digitally dominant.",

  values: [
    { icon: "barChart", title: "Data-Driven Decisions", tone: "blue" },
    { icon: "coins", title: "Cost-Efficient Operations", tone: "purple" },
    { icon: "sparkles", title: "AI-Powered Growth", tone: "green" },
    { icon: "graduationCap", title: "Student-Centric Approach", tone: "orange" }
  ],

  divisions: [
    {
      id: "cost-controls",
      num: 1,
      tone: "blue",
      icon: "barChart",
      name: "Business Analysis & Cost Controls",
      tagline: "Financial clarity for schools, colleges & universities",
      highlights: ["Data-driven financial insights", "Budget optimization", "Cost efficiency"],
      services: [
        {
          title: "Finance & Business Performance Review",
          text: "Audit fee structures, salary costs, utilities, lab & transport expenses."
        },
        {
          title: "Budgeting & Forecasting Controls",
          text: "Annual academic budget, admissions forecasting, cash-flow planning."
        },
        {
          title: "Micro-level Cost Identification",
          text: "Per-student cost, class-wise profitability, vendor cost comparison."
        },
        {
          title: "Proposed Strategies",
          text: "Reduce wastage by 15–25%, renegotiate vendor contracts, optimize staff allocation."
        }
      ],
      result: "More savings to invest in quality education & infrastructure.",
      caseStudy: {
        label: "Case example",
        title: "Private school chain saved PKR 4.2M annually",
        points: [
          "Identified duplicate admin roles",
          "Shifted to solar + energy controls",
          "Centralized purchasing across 3 campuses"
        ],
        outcome: "ROI in 3 months"
      }
    },
    {
      id: "marketing",
      num: 2,
      tone: "purple",
      icon: "megaphone",
      name: "Marketing & AI Content",
      tagline: "AI-powered outreach that turns parents into applicants",
      highlights: ["AI-powered admissions outreach", "Interactive content", "Student engagement"],
      services: [
        {
          title: "Website & Online Promotions",
          text: "SEO-optimized school website, admission landing pages, Google Business Profile."
        },
        {
          title: "YouTube Channel Automation",
          text: "AI-animated campus tours, real parent testimonials and class activities — 3 videos a week."
        },
        {
          title: "Social Media Management",
          text: "Facebook, Instagram & TikTok content calendar for parents and students."
        },
        {
          title: "AI Interactive Content",
          text: "AI-generated reels, admission ads and a 24/7 admission chatbot."
        },
        {
          title: "Lead Funnels & Branding",
          text: "WhatsApp automation, admission funnel, retargeting of website visitors."
        }
      ],
      stats: [
        { value: "40–60%", label: "increase in admission inquiries in 90 days" },
        { value: "3 / week", label: "automated videos" }
      ],
      engine: {
        label: "Our AI engine",
        items: [
          "Canva + AI video",
          "Voiceover in Urdu / English",
          "Auto-posting",
          "Lead tracking dashboard",
          "Parent engagement analytics"
        ],
        footnote: "Platforms: YouTube, Meta, TikTok, Website"
      }
    },
    {
      id: "it-support",
      num: 3,
      tone: "green",
      icon: "wifi",
      name: "Tech Forward & IT Support",
      tagline: "Smart campuses that stay online",
      highlights: ["Smart infrastructure", "24/7 IT support", "Campus connectivity"],
      services: [
        {
          title: "Intranet & Internet Services",
          text: "High-speed campus Wi-Fi, secure intranet for teachers & admin."
        },
        {
          title: "24/7 Technical Support",
          text: "On-call IT helpdesk for smart boards, projectors and computer labs."
        },
        {
          title: "Hardware & Software Support",
          text: "Lab maintenance, CCTV, attendance systems, LMS setup."
        },
        {
          title: "Solutions for Education",
          text: "Student Management System, Fee Management Software, Cloud Backup."
        },
        {
          title: "Security & Monitoring",
          text: "Network monitoring, data protection for student records."
        }
      ],
      stats: [
        { value: "99.8%", label: "network uptime" },
        { value: "−70%", label: "IT support tickets in 6 months" },
        { value: "1,240", label: "smart devices deployed" },
        { value: "1.2 days", label: "average ticket resolution" }
      ],
      result: "Reliable connectivity during online classes & exams."
    },
    {
      id: "events",
      num: 4,
      tone: "orange",
      icon: "calendar",
      name: "Event Management for Branding",
      tagline: "From concept to review — every rupee tracked",
      highlights: ["Campaigns & brand activations", "Events & outreach", "Community engagement"],
      process: [
        {
          title: "Concept & Goals",
          text: "Define the purpose — Open House, Annual Day, Science Fair, Graduation. Target parents & community."
        },
        {
          title: "Budgeting",
          text: "Strict budget control: venue, décor, sound & lights, food, printing."
        },
        {
          title: "Venue & Vendors",
          text: "Select the auditorium; hire reliable sound, lighting, catering and photography."
        },
        {
          title: "Promotion",
          text: "Social media, WhatsApp invites, posters and local press for maximum turnout."
        },
        {
          title: "Execution & Review",
          text: "On-site management, collect feedback, photos & videos for the next admissions."
        }
      ],
      stats: [
        { value: "+12%", label: "year-on-year growth in event attendance (450 attendees, 2025)" },
        { value: "45% → 82%", label: "brand engagement rate (+37 percentage points in 2025)" },
        { value: "Multi-channel", label: "reach across social, press, campus & partners" }
      ]
    }
  ],

  packages: [
    {
      id: "starter",
      name: "Starter",
      audience: "Small schools",
      tone: "blue",
      features: ["Cost audit", "Website", "Social media setup"]
    },
    {
      id: "growth",
      name: "Growth",
      audience: "Mid-size institutes",
      tone: "green",
      features: ["Full finance controls", "Marketing & AI content", "IT support"]
    },
    {
      id: "enterprise",
      name: "Enterprise",
      audience: "School & college chains",
      tone: "purple",
      features: ["All 4 divisions, including event management", "Multi-campus coverage"]
    }
  ],

  // What each package covers, per division (used for the comparison table).
  coverage: [
    { label: "Business Analysis & Cost Controls", starter: "Cost audit", growth: "Full finance controls", enterprise: true },
    { label: "Marketing & AI Content", starter: "Website + social media setup", growth: true, enterprise: true },
    { label: "Tech Forward & IT Support", starter: false, growth: true, enterprise: true },
    { label: "Event Management for Branding", starter: false, growth: false, enterprise: true },
    { label: "Multi-campus coverage", starter: false, growth: false, enterprise: true }
  ],

  homeStats: [
    { value: "40–60%", label: "more admission inquiries in 90 days", tone: "purple" },
    { value: "PKR 4.2M", label: "saved annually by a private school chain", tone: "blue" },
    { value: "99.8%", label: "campus network uptime", tone: "green" },
    { value: "+12%", label: "year-on-year event attendance", tone: "orange" }
  ]
};
