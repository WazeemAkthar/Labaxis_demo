"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FlaskConical, Microscope, Activity, Shield } from "lucide-react"
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSignIn(e as any)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1FB6B2]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-[#F5F7FA]">
      {/* Left Side - Branding & Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#0F3D5E] via-[#0a2d45] to-[#1FB6B2] relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#1FB6B2] rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#1FB6B2] rounded-full opacity-10 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl shadow-lg">
                <img src='./logo.png' alt="logo" className="h-24 w-full text-white rounded-lg" />
              </div>
           
            </div>
            
            <h2 className="text-3xl font-bold mb-4 leading-tight">
              Advanced Diagnostic Solutions for Better Healthcare
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Your trusted partner for comprehensive medical laboratory testing and analysis
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="bg-[#1FB6B2]/20 p-2 rounded-lg">
                <Microscope className="h-6 w-6 text-[#1FB6B2]" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Precision Testing</h3>
                <p className="text-sm text-gray-300">State-of-the-art equipment for accurate results</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="bg-[#1FB6B2]/20 p-2 rounded-lg">
                <Activity className="h-6 w-6 text-[#1FB6B2]" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Real-time Monitoring</h3>
                <p className="text-sm text-gray-300">Track and manage test results instantly</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="bg-[#1FB6B2]/20 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-[#1FB6B2]" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Secure & Compliant</h3>
                <p className="text-sm text-gray-300">HIPAA compliant with advanced security</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="bg-[#1FB6B2] p-3 rounded-xl shadow-lg">
              <FlaskConical className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#0F3D5E]">LabAxis</h1>
              <p className="text-sm text-[#1FB6B2] font-medium">Medical Laboratory Services</p>
            </div>
          </div>

          <Card className="shadow-xl border-gray-200">
            <CardHeader className="space-y-2 pb-6">
              <CardTitle className="text-2xl font-bold text-[#1F2933]">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-[#1F2933]/70">
                Sign in to access your laboratory dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5" onKeyPress={handleKeyPress}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#1F2933] font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@labaxis.com"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                    className="h-11 border-gray-300 focus:border-[#1FB6B2] focus:ring-[#1FB6B2] bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#1F2933] font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    required
                    className="h-11 border-gray-300 focus:border-[#1FB6B2] focus:ring-[#1FB6B2] bg-white"
                  />
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 flex items-center gap-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  onClick={handleSignIn}
                  disabled={isLoading}
                  className="w-full h-11 bg-gradient-to-r from-[#0F3D5E] to-[#1FB6B2] hover:from-[#0a2d45] hover:to-[#1aa39f] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-br from-[#F5F7FA] to-gray-100 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#1FB6B2]"></div>
                  <p className="text-sm text-[#1F2933] font-semibold">Firebase Authentication</p>
                </div>
                <p className="text-xs text-[#1F2933]/70 leading-relaxed">
                  This application uses Firebase Auth for secure user authentication. Create an account in the Firebase Console to get started.
                </p>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-[#1F2933]/60 mt-6">
            © 2024 LabAxis. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}