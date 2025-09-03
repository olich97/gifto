// sidebar.tsx
"use client";
import React, { useState, useEffect } from "react";
import { DashboardNav } from "@/components/dashboard-nav";
import { navItems } from "@/constants/data";
import { templateConfig } from "@/template.config";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

const LogoSection = ({ logo, isCollapsed }: { logo: string; isCollapsed: boolean }) => (
  <div className="relative">
    {/* Gradient background accent */}
    <div className="absolute inset-0 bg-gradient-to-r from-[#FF4D9D]/5 to-[#FF8A39]/5 blur-xl" />
    
    <div className="relative border-b border-white/10 p-6">
      <Link href="/">
        <div className="flex items-center justify-center hover:scale-105 transition-all duration-300 group">
          {isCollapsed ? (
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF4D9D] to-[#FF8A39] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-[#FF4D9D] to-[#FF8A39] rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
            </div>
          ) : (
            <div className="relative">
              <Image
                src={logo}
                alt={`${templateConfig.branding.appName} Logo`}
                className="drop-shadow-2xl max-w-[140px] h-auto brightness-110"
                width={140}
                height={45}
              />
              <div className="absolute -inset-4 bg-gradient-to-r from-[#FF4D9D]/20 to-[#FF8A39]/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          )}
        </div>
      </Link>
    </div>
  </div>
);

const NavigationSection = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <div className="flex-1 px-4 py-6 overflow-y-auto">
    <div className="relative">
      {/* Navigation background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent pointer-events-none" />
      
      <div className="relative">
        <DashboardNav items={navItems} isCollapsed={isCollapsed} />
      </div>
    </div>
  </div>
);

const FooterSection = ({
  isCollapsed,
  toggleCollapse,
}: {
  isCollapsed: boolean;
  toggleCollapse: Function;
}) => (
  <div className="relative mt-auto">
    {/* Subtle gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    
    <div className="relative border-t border-white/10 backdrop-blur-sm">
      {/* Wallet Connect Section */}
      <div className="p-4">
        <WalletConnectButton 
          size="sm" 
          className={cn(
            "transition-all duration-300 shadow-lg hover:shadow-xl",
            isCollapsed 
              ? "mx-auto w-12 h-12 p-0 rounded-xl" 
              : "w-full rounded-xl border-white/20 hover:border-white/30"
          )} 
          showAccountId={!isCollapsed}
          variant="outline"
        />
      </div>
      
      {/* Toggle Button Section */}
      <div className={cn(
        "border-t border-white/5 transition-all duration-300",
        isCollapsed ? "p-2" : "p-3"
      )}>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => toggleCollapse()}
                className={cn(
                  "group relative overflow-hidden transition-all duration-300",
                  "hover:bg-gradient-to-r hover:from-white/5 hover:to-white/10",
                  "focus:ring-2 focus:ring-primary/50 focus:ring-offset-0",
                  isCollapsed 
                    ? "w-12 h-12 p-0 mx-auto rounded-xl" 
                    : "w-full p-3 rounded-xl justify-between"
                )}
                variant="ghost"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {isCollapsed ? (
                  <PanelLeftOpen className="h-5 w-5 text-muted-foreground group-hover:text-white transition-colors duration-300" />
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-md bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                        <PanelLeftClose className="h-4 w-4 text-muted-foreground group-hover:text-white transition-colors duration-300" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground group-hover:text-white transition-colors duration-300">
                        Collapse Sidebar
                      </span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-white/40 transition-colors duration-300" />
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent 
              side={isCollapsed ? "right" : "top"} 
              className="font-medium bg-black/90 border-white/20"
            >
              {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  </div>
);

export default function Sidebar({ className }: SidebarProps) {
  const [logo] = useState(templateConfig.branding.logoDark);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const savedCollapseState = localStorage.getItem("sidebarCollapsed");
    setIsCollapsed(savedCollapseState === "true");
  }, []);

  const toggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarCollapsed", String(newCollapsedState));
    }
  };

  return (
    <aside
      className={cn(
        "relative flex flex-col h-screen transition-all duration-500 ease-out overflow-hidden",
        isCollapsed ? "w-20" : "w-64",
        className
      )}
    >
      {/* Multi-layer background */}
      <div className="absolute inset-0">
        {/* Primary gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        
        {/* Subtle mesh pattern overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[length:20px_20px]" />
        </div>
        
        {/* Animated gradient accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF4D9D]/10 via-transparent to-[#FF8A39]/10 animate-pulse" style={{ animationDuration: '4s' }} />
        
        {/* Glassmorphism effect */}
        <div className="absolute inset-0 backdrop-blur-xl bg-black/20" />
      </div>
      
      {/* Border with gradient */}
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
      
      {/* Content with higher z-index */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Logo Section */}
        <LogoSection logo={logo} isCollapsed={isCollapsed} />
        
        {/* Navigation Section */}
        <NavigationSection isCollapsed={isCollapsed} />
        
        {/* Footer Section */}
        <FooterSection
          isCollapsed={isCollapsed}
          toggleCollapse={toggleCollapse}
        />
      </div>
      
      {/* Side accent line */}
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#FF4D9D] via-transparent to-[#FF8A39] opacity-60" />
    </aside>
  );
}
