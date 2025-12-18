"use client";

import type React from "react";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  FlaskConical,
  Users,
  FileText,
  Activity,
  DollarSign,
  Menu,
  LogOut,
  Home,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logOut } from "@/lib/auth";
import { Footer } from "@/components/footer";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Invoices", href: "/invoices", icon: FileText },
  { name: "Reports", href: "/reports", icon: Activity },
  { name: "Finance", href: "/finance", icon: DollarSign },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Users", href: "/users", icon: Users },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await logOut();
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-40 bg-white shadow-lg hover:bg-[#1FB6B2]/10 border border-[#1FB6B2]/20"
          >
            <Menu className="h-6 w-6 text-[#0F3D5E]" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent
            pathname={pathname}
            router={router}
            onSignOut={handleSignOut}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <SidebarContent
          pathname={pathname}
          router={router}
          onSignOut={handleSignOut}
        />
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}

function SidebarContent({
  pathname,
  router,
  onSignOut,
}: {
  pathname: string;
  router: ReturnType<typeof useRouter>;
  onSignOut: () => void;
}) {
  return (
    <div className="flex flex-col h-full bg-linear-to-b from-[#0F3D5E] to-[#0A2940] shadow-2xl">
      {/* Logo Section */}
      <div className="p-6 border-b border-[#1FB6B2]/20">
        <div className="flex items-center gap-3">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-[#1FB6B2] rounded-xl blur-lg opacity-40 animate-pulse"></div>
            {/* Icon container */}
            <div className="relative bg-linear-to-br from-[#1FB6B2] to-[#17a39f] p-3 rounded-xl shadow-lg">
              <FlaskConical className="h-7 w-7 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-[#1FB6B2] tracking-wider uppercase">
              LabAxis
            </div>
            <h1 className="text-sm font-bold leading-tight text-white">
              Medical Laboratory
            </h1>
            <p className="text-xs text-[#1FB6B2]/80 font-medium mt-0.5">
              Unique Place for Diagnostics
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1.5 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const handleClick = (e: React.MouseEvent) => {
            e.preventDefault();
            router.push(item.href);
          };
          return (
            <button
              key={item.name}
              onClick={handleClick}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all text-left relative overflow-hidden group hover:cursor-pointer",
                isActive
                  ? "bg-linear-to-r from-[#1FB6B2] to-[#17a39f] text-white shadow-lg shadow-[#1FB6B2]/30"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              {/* Hover effect background */}
              {!isActive && (
                <div className="absolute inset-0 bg-linear-to-r from-[#1FB6B2]/0 to-[#1FB6B2]/10 opacity-0 group-hover:opacity-100  transition-opacity"></div>
              )}
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white"></div>
              )}
              
              <Icon className={cn("h-5 w-5 relative z-10", isActive ? "text-white" : "")} />
              <span className="relative z-10">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Contact Info */}
      <div className="p-4 border-t border-[#1FB6B2]/20 bg-[#0A2940]/50">
        <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm">
          <p className="text-xs font-bold text-[#1FB6B2] mb-2">Contact Us</p>
          <div className="space-y-1">
            <p className="text-xs text-white/80 flex items-center gap-2">
              <span className="w-1 h-1 bg-[#1FB6B2] rounded-full"></span>
              info@labaxis.com
            </p>
          </div>
        </div>
      </div>

      {/* Sign out */}
      <div className="p-4 border-t border-[#1FB6B2]/20">
        <Button
          variant="ghost"
          onClick={onSignOut}
          className="w-full justify-start gap-3 text-white/70 hover:text-white hover:bg-white/10 transition-all rounded-xl py-3 font-semibold"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}