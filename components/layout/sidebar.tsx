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

interface SidebarProps {
  className?: string;
}

const LogoSection = ({ logo }: { logo: string }) => (
  <div className="logo-container space-y-4 flex justify-center items-center py-6 md:block border-b border-white/10">
    <Link href="/">
      <div
        className="logo-container hover:scale-105 transition-transform duration-300"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Image
          src={logo}
          alt={`${templateConfig.branding.appName} Logo`}
          className="logo-image py-2 drop-shadow-lg"
          width={150}
          height={50}
        />
      </div>
    </Link>
  </div>
);

const NavigationSection = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <div className="px-3 py-4 flex-1">
    <DashboardNav items={navItems} isCollapsed={isCollapsed} />
  </div>
);

const FooterSection = ({
  isCollapsed,
  toggleCollapse,
}: {
  isCollapsed: boolean;
  toggleCollapse: Function;
}) => (
  <footer className="border-t border-white/10 px-4 py-4 space-y-3">
    {!isCollapsed && (
      <div className="px-1">
        <WalletConnectButton size="sm" className="w-full" />
      </div>
    )}
    <TooltipProvider delayDuration={50}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={(event) => toggleCollapse()}
            className="p-2 w-full hover:bg-white/10 transition-colors duration-300"
            variant="ghost"
          >
            {isCollapsed ? (
              <PanelLeftOpen
                className="text-muted-foreground hover:text-white h-[1.2rem] w-[1.2rem] transition-colors duration-300"
                strokeWidth={1.3}
              />
            ) : (
              <PanelLeftClose
                className="text-muted-foreground hover:text-white h-[1.2rem] w-[1.2rem] transition-colors duration-300"
                strokeWidth={1.3}
              />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Toggle sidebar</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </footer>
);

export default function Sidebar({ className }: SidebarProps) {
  const [logo, setLogo] = useState(templateConfig.branding.logoDark); // Always use dark logo
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
    <div
      className={`p-4 sidebar flex flex-col h-full ${className} ${
        isCollapsed ? "collapsed" : ""
      }`}
    >
      <div className="flex h-full border-r border-white/10 bg-gradient-to-b from-black/40 via-black/30 to-black/40 backdrop-blur-md flex-col flex-grow overflow-auto rounded-r-xl shadow-2xl">
        <LogoSection logo={logo} />
        <NavigationSection isCollapsed={isCollapsed} />
        <FooterSection
          isCollapsed={isCollapsed}
          toggleCollapse={toggleCollapse}
        />
      </div>
    </div>
  );
}
