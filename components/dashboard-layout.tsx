"use client"

import type React from "react"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { FlaskConical, Users, FileText, Activity, DollarSign, Menu, LogOut, Home, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { logOut } from "@/lib/auth"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Invoices", href: "/invoices", icon: FileText },
  { name: "Reports", href: "/reports", icon: Activity },
  { name: "Finance", href: "/finance", icon: DollarSign },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Users", href: "/users", icon: Users },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await logOut()
      router.push("/")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/30 via-emerald-50/30 to-cyan-50/30">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden fixed top-4 left-4 z-40 bg-white shadow-md hover:bg-teal-50"
          >
            <Menu className="h-6 w-6 text-teal-600" />
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
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-teal-50/30 border-r border-teal-100 shadow-lg">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-teal-100 bg-white/80 backdrop-blur-sm">
        <div className="relative">
          <div className="absolute inset-0 bg-teal-500 rounded-full blur-md opacity-20"></div>
          <div className="relative bg-gradient-to-br from-teal-500 to-emerald-600 p-2 rounded-full">
            <FlaskConical className="h-6 w-6 text-white" />
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold text-pink-500 tracking-wide">NEW AZZA</div>
          <h1 className="text-sm font-bold leading-tight bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
            Medical Laboratory Services
          </h1>
          <p className="text-xs text-teal-600 font-medium">Unique Place for all Diagnostic needs</p>
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
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left",
                pathname === item.href
                  ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md"
                  : "text-slate-600 hover:text-teal-700 hover:bg-teal-50",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </button>
          )
        })}
      </nav>

      {/* Contact Info */}
      <div className="p-4 border-t border-teal-100 space-y-2 bg-gradient-to-br from-teal-50/50 to-emerald-50/50">
        <div className="text-xs text-slate-600">
          <p className="font-semibold text-teal-700 mb-1">Contact Us</p>
          <p className="text-slate-600">azzaarafath@gmail.com</p>
          <p className="text-slate-600">0752537178 | 0776452417</p>
          <p className="text-slate-600">0753274455</p>
        </div>
      </div>

      {/* Sign out */}
      <div className="p-4 border-t border-teal-100 bg-white/80">
        <Button
          variant="ghost"
          onClick={onSignOut}
          className="w-full justify-start gap-3 text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition-all"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}