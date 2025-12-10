"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FlaskConical } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { signIn } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (authLoading) return

    if (user) {
      router.push("/dashboard")
    }
  }, [user, authLoading, router])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await signIn(formData.email, formData.password)
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "Invalid email or password")
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-teal-50 via-emerald-50 to-cyan-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-teal-50 via-emerald-50 to-cyan-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-teal-100">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-teal-500 rounded-full blur-xl opacity-20"></div>
              <div className="relative bg-linear-to-br from-teal-500 to-emerald-600 p-4 rounded-full">
                <FlaskConical className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-pink-500 mb-1 tracking-wide">LabReportHub</div>
            <CardTitle className="text-2xl font-bold bg-linear-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Medical Laboratory Services
            </CardTitle>
            <CardDescription className="text-teal-600 font-medium mt-1">
              Unique Place for all Diagnostic needs
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@LabReportHub.com"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
                className="border-teal-200 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                required
                className="border-teal-200 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-medium py-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 p-4 bg-linear-to-br from-teal-50 to-emerald-50 rounded-lg border border-teal-100">
            <p className="text-sm text-teal-700 text-center font-semibold mb-2">Sign in with Firebase Auth</p>
            <p className="text-xs text-center text-slate-600">
              Create an account in Firebase Console to get started
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}