"use client"

import type React from "react"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
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
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = () => {
    localStorage.removeItem("lablite_auth")
    router.push("/")
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
          <SidebarContent pathname={pathname} router={router} onSignOut={handleSignOut} />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <SidebarContent pathname={pathname} router={router} onSignOut={handleSignOut} />
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}

function SidebarContent({ pathname, router, onSignOut }: { pathname: string; router: ReturnType<typeof useRouter>; onSignOut: () => void }) {
  return (
    <div className="flex flex-col h-full bg-card border-r">
      {/* Logo */}
      <div className="flex items-center gap-2 p-6 border-b">
        <FlaskConical className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-lg font-bold leading-tight">Azza Medical Laboratory Services</h1>
          <p className="text-xs text-muted-foreground">Unique Place for all Diagnostic needs</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          const handleClick = (e: React.MouseEvent) => {
            e.preventDefault()
            router.push(item.href)
          }
          return (
            <button
              key={item.name}
              onClick={handleClick}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </button>
          )
        })}
      </nav>

      {/* Contact Info */}
      <div className="p-4 border-t space-y-2">
        <div className="text-xs text-muted-foreground">
          <p className="font-medium">Contact Us</p>
          <p>azzaarafath@gmail.com</p>
          <p>0752537178 | 0776452417</p>
          <p>0753274455</p>
        </div>
      </div>

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
