import { Icons } from "@/components/icons";

export interface TemplateConfig {
  // Core Branding - The essentials that every project needs
  branding: {
    appName: string;
    tagline: string;
    description: string;
    logoLight: string;
    logoDark: string;
    favicon: string;
    bannerImage?: string;
  };
  
  // Navigation Structure - Keep it flexible
  navigation: {
    title: string;
    href: string;
    icon: keyof typeof Icons;
    label: string;
    count?: number;
    tag?: string;
    disabled?: boolean;
  }[];
  
  // Dashboard Basic Config
  dashboard: {
    title: string;
    subtitle?: string;
    externalLinks?: {
      label: string;
      url: string;
      icon?: string;
    }[];
  };
  
  // Feature Toggles - What's available
  features: {
    dateRangePicker: boolean;
    refreshButton: boolean;
    search: boolean;
    mobileSupport: boolean;
    darkMode: boolean;
  };
  
  // Optional customizations
  theme?: {
    primaryColor?: string;
    accentColor?: string;
  };
}

// Default template configuration
export const templateConfig: TemplateConfig = {
  branding: {
    appName: "gifto",
    tagline: "Instant Crypto Gift Cards",
    description: "Send crypto tokens as digital gift cards that can be shared by link or QR and redeemed in seconds",
    logoLight: "/gifto.png",
    logoDark: "/gifto_white.png",
    favicon: "/favicon.ico",
  },
  
  navigation: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "home",
      label: "dashboard",
    },
    {
      title: "Send a Gift", 
      href: "/dashboard/send",
      icon: "gift",
      label: "send",
    },
    {
      title: "My Gifts",
      href: "/dashboard/gifts", 
      icon: "package",
      label: "gifts",
    },
    {
      title: "Redeem",
      href: "/dashboard/redeem",
      icon: "download",
      label: "redeem",
    },
  ],
  
  dashboard: {
    title: "Gift Dashboard",
    subtitle: "Send and receive crypto gifts across multiple blockchains",
    externalLinks: [
      { label: "Etherscan", url: "https://etherscan.io", icon: "external-link" },
      { label: "OpenSea", url: "https://opensea.io", icon: "external-link" }
    ],
  },

  features: {
    dateRangePicker: false,
    refreshButton: true,
    search: false,
    mobileSupport: true,
    darkMode: true,
  },
  
  theme: {
    primaryColor: "#FF4D9D",
    accentColor: "#FF8A39",
  },
};

// Example configurations for inspiration - developers can copy and modify
export const examples = {
  ecommerce: {
    ...templateConfig,
    branding: {
      ...templateConfig.branding,
      appName: "E-Commerce Dashboard",
      tagline: "Sales & Inventory Analytics",
    },
    navigation: [
      { title: "Overview", href: "/dashboard", icon: "home", label: "overview" },
      { title: "Products", href: "/dashboard/products", icon: "package", label: "products" },
      { title: "Orders", href: "/dashboard/orders", icon: "shopping-cart", label: "orders" },
      { title: "Customers", href: "/dashboard/customers", icon: "users", label: "customers" },
    ],
    dashboard: {
      title: "Sales Overview",
      subtitle: "Track your online store performance",
      externalLinks: [
        { label: "Shopify Admin", url: "https://admin.shopify.com", icon: "external-link" }
      ],
    },
  },

  saas: {
    ...templateConfig,
    branding: {
      ...templateConfig.branding,
      appName: "SaaS Analytics",
      tagline: "Product & User Insights",
    },
    navigation: [
      { title: "Overview", href: "/dashboard", icon: "home", label: "overview" },
      { title: "Users", href: "/dashboard/users", icon: "users", label: "users" },
      { title: "Revenue", href: "/dashboard/revenue", icon: "dollar-sign", label: "revenue" },
      { title: "Features", href: "/dashboard/features", icon: "zap", label: "features" },
    ],
    dashboard: {
      title: "Product Analytics",
      subtitle: "Monitor user engagement and growth metrics",
    },
  },

  crypto: {
    ...templateConfig,
    branding: {
      ...templateConfig.branding,
      appName: "DeFi Dashboard",
      tagline: "Decentralized Finance Analytics",
    },
    navigation: [
      { title: "Portfolio", href: "/dashboard", icon: "home", label: "portfolio" },
      { title: "Protocols", href: "/dashboard/protocols", icon: "server", label: "protocols" },
      { title: "DeFi Yield", href: "/dashboard/yield", icon: "trending-up", label: "yield" },
      { title: "Risk", href: "/dashboard/risk", icon: "alert-triangle", label: "risk" },
    ],
    dashboard: {
      title: "DeFi Portfolio",
      subtitle: "Track your decentralized finance positions",
    },
    theme: {
      primaryColor: "#f59e0b",
      accentColor: "#10b981",
    },
  },
} as const;