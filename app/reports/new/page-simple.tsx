"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeft, User } from "lucide-react"
import { DataManager, type Patient } from "@/lib/data-manager"
import Link from "next/link"

export default function NewReportPageSimple() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState("")

  useEffect(() => {
    const authStatus = localStorage.getItem("lablite_auth")
    if (authStatus !== "authenticated") {
      router.push("/")
      return
    }
    
    setIsAuthenticated(true)
    
    // Load data
    const dataManager = DataManager.getInstance()
    const patientsData = dataManager.getPatients()
    setPatients(patientsData)
    setLoading(false)
  }, [router])

  const handlePatientChange = (patientId: string) => {
    console.log("Patient changed to:", patientId)
    setSelectedPatientId(patientId)
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
            <Link href="/reports">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Generate New Report (Simple)</h1>
            <p className="text-muted-foreground">Test version to debug infinite loop</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Select Patient
            </CardTitle>
            <CardDescription>Choose a patient for this report</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Patient *</Label>
              <Select value={selectedPatientId} onValueChange={handlePatientChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName} ({patient.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedPatientId && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <p>Selected Patient ID: {selectedPatientId}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}