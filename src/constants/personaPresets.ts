export const personaPresets = {
  'Vibe Coder': [
    { 
      label: "E-commerce Platform", 
      appDescription: "A high-traffic e-commerce platform with real-time inventory management, dynamic pricing, cart abandonment recovery, and multi-currency payment processing serving customers across 50+ countries",
      scale: "Growth" as const,
      priorities: ["Cost Optimization", "Global Performance", "Scalability"]
    },
    { 
      label: "Social Platform", 
      appDescription: "A social platform with live chat, video streaming, real-time activity feeds, content moderation, and algorithmic timeline generation handling millions of daily active users",
      scale: "Enterprise" as const, 
      priorities: ["Scalability", "Global Performance", "Developer Velocity"]
    },
    { 
      label: "Collaborative Tool", 
      appDescription: "A collaborative whiteboard app with real-time multiplayer editing, document sharing, video calls, and persistent session state supporting teams of up to 100 concurrent users",
      scale: "Startup" as const,
      priorities: ["Developer Velocity", "Cost Optimization"]
    }
  ],
  'AIE/FDE': [
    { 
      label: "REST API Backend", 
      appDescription: "A REST API serving mobile apps with OAuth authentication, file uploads to cloud storage, push notifications, rate limiting, and comprehensive logging serving 10M+ API calls daily",
      scale: "Growth" as const,
      priorities: ["Developer Velocity", "Global Performance", "Scalability"]
    },
    { 
      label: "Analytics Dashboard", 
      appDescription: "A real-time analytics dashboard processing millions of events per second with custom visualizations, automated alerting, data aggregation, and machine learning insights for business intelligence",
      scale: "Enterprise" as const,
      priorities: ["Scalability", "Global Performance", "Enterprise Security"]
    },
    { 
      label: "Headless CMS", 
      appDescription: "A headless CMS with global content delivery, automatic image optimization, multi-language support, version control, and API-first architecture powering websites across multiple regions",
      scale: "Growth" as const,
      priorities: ["Global Performance", "Developer Velocity"]
    }
  ],
  'CIO/CTO': [
    { 
      label: "Gaming Platform", 
      appDescription: "A multiplayer online game with real-time player interactions, anti-cheat systems, matchmaking algorithms, leaderboards, and in-game economy supporting 100K+ concurrent players globally",
      scale: "Enterprise" as const,
      priorities: ["Global Performance", "Scalability", "Enterprise Security"]
    },
    { 
      label: "IoT Platform", 
      appDescription: "An IoT platform collecting sensor data from thousands of devices with predictive analytics, automated alerting, data visualization, and machine learning models for industrial monitoring and optimization",
      scale: "Enterprise" as const,
      priorities: ["Scalability", "Enterprise Security", "Cost Optimization"]
    },
    { 
      label: "Enterprise SaaS", 
      appDescription: "Enterprise-grade SaaS platform with multi-tenant architecture, compliance controls, RBAC, audit logging, SSO integration, and 99.99% SLA requirements serving Fortune 500 companies",
      scale: "Global" as const,
      priorities: ["Enterprise Security", "Scalability", "Global Performance"]
    }
  ]
};

export type PersonaPreset = typeof personaPresets[keyof typeof personaPresets][0];