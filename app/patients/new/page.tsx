"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, User } from "lucide-react"
import { DataManager } from "@/lib/data-manager"
import Link from "next/link"

export default function NewPatientPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    phone: "",
    doctorName: "",
    notes: "",
  })

  useEffect(() => {
    const authStatus = localStorage.getItem("lablite_auth")
    if (authStatus !== "authenticated") {
      router.push("/")
      return
    }
    setIsAuthenticated(true)
    setLoading(false)
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      console.log("[v0] Starting patient creation with data:", formData)
      const dataManager = DataManager.getInstance()
      console.log("[v0] DataManager instance obtained")

      const nameParts = formData.fullName.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''
      
      const patient = dataManager.addPatient({
        firstName,
        lastName,
        age: Number.parseInt(formData.age),
        gender: formData.gender as "Male" | "Female" | "Other",
        phone: formData.phone,
        email: '',
        doctorName: formData.doctorName,
        notes: formData.notes,
      })

      console.log("[v0] Patient created successfully:", patient)

      alert(`Patient ${formData.fullName} has been successfully registered with ID: ${patient.id}`)

      // Small delay to ensure data is saved before navigation
      setTimeout(() => {
        router.push("/patients")
      }, 100)
    } catch (error) {
      console.error("[v0] Error saving patient:", error)
      alert("Error saving patient. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const isFormValid = () => {
    return (
      formData.fullName.trim() &&
      formData.age &&
      formData.gender &&
      formData.phone.trim()
    )
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href="/patients">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Add New Patient</h1>
            <p className="text-muted-foreground">Register a new patient in the system</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Information
              </CardTitle>
              <CardDescription>Enter the patient's personal and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    max="150"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    placeholder="Enter age"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                  required
                />
              </div>

              {/* Medical Information */}
              <div className="space-y-2">
                <Label htmlFor="doctorName">Referring Doctor</Label>
                <Input
                  id="doctorName"
                  value={formData.doctorName}
                  onChange={(e) => handleInputChange("doctorName", e.target.value)}
                  placeholder="Enter doctor's name (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Enter any additional notes or medical history"
                  rows={4}
                />
              </div>

              {/* Form Actions */}
              <div className="flex items-center gap-4 pt-4">
                <Button type="submit" disabled={!isFormValid() || saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Patient"}
                </Button>
                <Button asChild type="button" variant="outline">
                  <Link href="/patients">
                    Cancel
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  )
}
