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
      console.log("Checking authentication status...")
      const authStatus = localStorage.getItem("lablite_auth") || sessionStorage.getItem("lablite_auth")
      console.log("Auth status from storage:", authStatus)

      if (authStatus === "authenticated") {
        console.log("User already authenticated, redirecting to dashboard...")
        setIsAuthenticated(true)
        router.push("/dashboard")
        return
      }
      console.log("User not authenticated, showing login form")
      setLoading(false)
    }

    setTimeout(checkAuth, 100)
  }, [router])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    console.log("Login attempt with username:", formData.username)

    const storedCredentials = localStorage.getItem("lablite_credentials")
    console.log("Stored credentials:", storedCredentials)

    const validCredentials = storedCredentials
      ? JSON.parse(storedCredentials)
      : { username: "admin", password: "admin123" }

    console.log("Valid credentials:", validCredentials)

    if (formData.username === validCredentials.username && formData.password === validCredentials.password) {
      console.log("Credentials valid, setting authentication...")

      try {
        localStorage.setItem("lablite_auth", "authenticated")
        sessionStorage.setItem("lablite_auth", "authenticated")
        console.log("Auth status set in both storages")

        setTimeout(() => {
          console.log("Redirecting to dashboard...")
          setIsAuthenticated(true)
          router.push("/dashboard")
        }, 100)
      } catch (error) {
        console.error("Storage error:", error)
        setError("Authentication failed. Please try again.")
      }
    } else {
      console.log("Invalid credentials provided")
      setError("Invalid credentials. Use admin/admin123 for first login")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-teal-100">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-teal-500 rounded-full blur-xl opacity-20"></div>
              <div className="relative bg-gradient-to-br from-teal-500 to-emerald-600 p-4 rounded-full">
                <FlaskConical className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-pink-500 mb-1 tracking-wide">NEW AZZA</div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
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
              <Label htmlFor="username" className="text-slate-700">Username</Label>
              <Input
                id="username"
                placeholder="admin"
                value={formData.username}
                onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                required
                className="border-teal-200 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="admin123"
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
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-medium py-2 shadow-md hover:shadow-lg transition-all"
            >
              Sign In
            </Button>
          </form>
          <div className="mt-4 p-4 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-lg border border-teal-100">
            <p className="text-sm text-teal-700 text-center font-semibold mb-2">Demo Credentials:</p>
            <p className="text-sm text-center mt-1 text-slate-600">
              Username: <code className="bg-white px-2 py-1 rounded border border-teal-200 text-teal-700 font-mono">admin</code>
            </p>
            <p className="text-sm text-center mt-1 text-slate-600">
              Password: <code className="bg-white px-2 py-1 rounded border border-teal-200 text-teal-700 font-mono">admin123</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}