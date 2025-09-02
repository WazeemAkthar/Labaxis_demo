"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { FlaskConical, Users, FileText, Activity, DollarSign, Menu, LogOut, Home, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Invoices", href: "/invoices", icon: FileText },
  { name: "Reports", href: "/reports", icon: Activity },
  { name: "Finance", href: "/finance", icon: DollarSign },
  { name: "Settings", href: "/settings", icon: Settings },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = () => {
    localStorage.removeItem("lablite_auth")
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-40">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent pathname={pathname} onSignOut={handleSignOut} />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <SidebarContent pathname={pathname} onSignOut={handleSignOut} />
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}

function SidebarContent({ pathname, onSignOut }: { pathname: string; onSignOut: () => void }) {
  return (
    <div className="flex flex-col h-full bg-card border-r">
      {/* Logo */}
      <div className="flex items-center gap-2 p-6 border-b">
        <FlaskConical className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-xl font-bold">LabLite</h1>
          <p className="text-sm text-muted-foreground">LIMS</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          onClick={onSignOut}
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
