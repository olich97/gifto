"use client";
import { DashboardNav } from "@/components/dashboard-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navItems } from "@/constants/data";
import { Menu } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { templateConfig } from "@/template.config";

interface MobileSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
}

export function MobileSidebar({ className }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden hover:bg-white/10">
          <Menu className="h-6 w-6 text-white" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-72 p-0 bg-gradient-to-b from-black/95 via-black/90 to-black/95 backdrop-blur-xl border-r border-white/10"
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="border-b border-white/10 p-6">
            <Link href="/" onClick={() => setOpen(false)}>
              <div className="flex justify-center items-center">
                <Image
                  src={templateConfig.branding.logoDark}
                  alt={`${templateConfig.branding.appName} Logo`}
                  width={150}
                  height={50}
                  className="drop-shadow-lg"
                />
              </div>
            </Link>
          </div>
          
          {/* Navigation Section */}
          <div className="flex-1 p-4">
            <DashboardNav
              items={navItems}
              setOpen={setOpen}
              isCollapsed={false}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}