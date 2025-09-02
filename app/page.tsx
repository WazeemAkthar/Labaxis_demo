"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FlaskConical } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")

  useEffect(() => {
    const checkAuth = () => {
      console.log("[v0] Checking authentication status...")
      const authStatus = localStorage.getItem("lablite_auth") || sessionStorage.getItem("lablite_auth")
      console.log("[v0] Auth status from storage:", authStatus)

      if (authStatus === "authenticated") {
        console.log("[v0] User already authenticated, redirecting to dashboard...")
        setIsAuthenticated(true)
        router.push("/dashboard")
        return
      }
      console.log("[v0] User not authenticated, showing login form")
      setLoading(false)
    }

    // Add small delay to ensure storage is ready
    setTimeout(checkAuth, 100)
  }, [router])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    console.log("[v0] Login attempt with username:", formData.username)

    const storedCredentials = localStorage.getItem("lablite_credentials")
    console.log("[v0] Stored credentials:", storedCredentials)

    const validCredentials = storedCredentials
      ? JSON.parse(storedCredentials)
      : { username: "admin", password: "admin123" }

    console.log("[v0] Valid credentials:", validCredentials)

    if (formData.username === validCredentials.username && formData.password === validCredentials.password) {
      console.log("[v0] Credentials valid, setting authentication...")

      try {
        localStorage.setItem("lablite_auth", "authenticated")
        sessionStorage.setItem("lablite_auth", "authenticated")
        console.log("[v0] Auth status set in both storages")

        setTimeout(() => {
          console.log("[v0] Redirecting to dashboard...")
          setIsAuthenticated(true)
          window.location.href = "/dashboard"
        }, 100)
      } catch (error) {
        console.error("[v0] Storage error:", error)
        setError("Authentication failed. Please try again.")
      }
    } else {
      console.log("[v0] Invalid credentials provided")
      setError("Invalid credentials. Use admin/admin123 for first login")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <FlaskConical className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">LabLite LIMS</CardTitle>
          <CardDescription>Laboratory Information Management System</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="admin"
                value={formData.username}
                onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="admin123"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
            {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground text-center font-medium">Demo Credentials:</p>
            <p className="text-sm text-center mt-1">
              Username: <code className="bg-background px-1 rounded">admin</code>
            </p>
            <p className="text-sm text-center">
              Password: <code className="bg-background px-1 rounded">admin123</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
