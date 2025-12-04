"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, User, Phone, Stethoscope, FileText } from "lucide-react"
import { DataManager } from "@/lib/data-manager"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"

export default function NewPatientPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
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
    if (authLoading) return

    if (!user) {
      router.push("/")
      return
    }

    setLoading(false)
  }, [user, authLoading, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const dataManager = DataManager.getInstance()

      const nameParts = formData.fullName.trim().split(" ")
      const firstName = nameParts[0] || ""
      const lastName = nameParts.slice(1).join(" ") || ""

      const patient = await dataManager.addPatient({
        firstName,
        lastName,
        age: Number.parseInt(formData.age),
        gender: formData.gender as "Male" | "Female" | "Other",
        phone: formData.phone,
        email: "",
        doctorName: formData.doctorName,
        notes: formData.notes,
        name: "",
      })


      alert(`Patient ${formData.fullName} has been successfully registered with ID: ${patient.id}`)

      setTimeout(() => {
  router.push(`/reports/new?patientId=${patient.id}`)
}, 100)
    } catch (error) {
      console.error("[v0] Error saving patient:", error)
      alert("Error saving patient. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const isFormValid = () => {
    return formData.fullName.trim() && formData.gender
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-200 border-t-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-teal-100">
          <Button
            asChild
            variant="outline"
            size="icon"
            className="h-12 w-12 border-teal-200 hover:bg-teal-50 hover:border-teal-400"
          >
            <Link href="/patients">
              <ArrowLeft className="h-5 w-5 text-teal-600" />
            </Link>
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Add New Patient
            </h1>
            <p className="text-slate-600 mt-1">Register a new patient in the system</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-3xl">
          <Card className="border-teal-100 shadow-md bg-white/90 backdrop-blur-sm">
            <CardHeader className="border-b border-teal-100 bg-gradient-to-r from-teal-50 to-cyan-50">
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
                  <User className="h-5 w-5 text-white" />
                </div>
                Patient Information
              </CardTitle>
              <CardDescription className="text-slate-600">
                Enter the patient's personal and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Personal Information Section */}
              <div className="space-y-4 p-4 bg-gradient-to-r from-slate-50 to-teal-50 rounded-lg border border-teal-100">
                <div className="flex items-center gap-2 text-sm font-semibold text-teal-700 mb-2">
                  <User className="h-4 w-4" />
                  <span>Personal Details</span>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-slate-700 font-medium">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="Enter full name"
                    required
                    className="border-teal-200 focus:border-teal-500 focus:ring-teal-500 h-11"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-slate-700 font-medium">
                      Age
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      min="0"
                      max="150"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      placeholder="Enter age"
                      className="border-teal-200 focus:border-teal-500 focus:ring-teal-500 h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-slate-700 font-medium">
                      Gender <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger className="border-teal-200 focus:border-teal-500 focus:ring-teal-500 h-11">
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
              </div>

              {/* Contact Information Section */}
              <div className="space-y-4 p-4 bg-gradient-to-r from-slate-50 to-cyan-50 rounded-lg border border-cyan-100">
                <div className="flex items-center gap-2 text-sm font-semibold text-cyan-700 mb-2">
                  <Phone className="h-4 w-4" />
                  <span>Contact Information</span>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-700 font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter phone number"
                    className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500 h-11"
                  />
                </div>
              </div>

              {/* Medical Information Section */}
              <div className="space-y-4 p-4 bg-gradient-to-r from-slate-50 to-emerald-50 rounded-lg border border-emerald-100">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 mb-2">
                  <Stethoscope className="h-4 w-4" />
                  <span>Medical Information</span>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="doctorName" className="text-slate-700 font-medium">
                    Referring Doctor
                  </Label>
                  <Input
                    id="doctorName"
                    value={formData.doctorName}
                    onChange={(e) => handleInputChange("doctorName", e.target.value)}
                    placeholder="Enter doctor's name (optional)"
                    className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 h-11"
                  />
                </div>
              </div>

              {/* Notes Section */}
              <div className="space-y-4 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-700 mb-2">
                  <FileText className="h-4 w-4" />
                  <span>Additional Notes</span>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-slate-700 font-medium">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Enter any additional notes or medical history"
                    rows={4}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center gap-4 pt-4 border-t border-teal-100">
                <Button
                  type="submit"
                  disabled={!isFormValid() || saving}
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg shadow-teal-200 disabled:opacity-50 disabled:cursor-not-allowed h-11 px-6"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Patient"}
                </Button>
                <Button
                  asChild
                  type="button"
                  variant="outline"
                  className="border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-400 h-11 px-6"
                >
                  <Link href="/patients">Cancel</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}