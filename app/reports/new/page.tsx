"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, User, FileText, TestTube } from "lucide-react"
import { DataManager, type Patient, type Invoice, type ReportResult } from "@/lib/data-manager"
import Link from "next/link"

// Helper function to extract unit from reference range
function getUnitFromRange(range: string): string {
  // Extract unit from ranges like "4.0-11.0 x10³/μL" or "12.0-16.0 g/dL"
  const unitMatch = range.match(/[\s\d\.\-]+(.+)$/)
  return unitMatch ? unitMatch[1].trim() : ""
}

export default function NewReportPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [patients, setPatients] = useState<Patient[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [results, setResults] = useState<ReportResult[]>([])
  const [doctorRemarks, setDoctorRemarks] = useState("")
  const [reviewedBy, setReviewedBy] = useState("Dr. Lab Director")

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
    const invoicesData = dataManager.getInvoices()
    setPatients(patientsData)
    setInvoices(invoicesData)
    setLoading(false)
  }, [])

  const handlePatientChange = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId)
    setSelectedPatient(patient || null)
    setSelectedInvoice(null)
    setResults([])

    // Filter invoices for this patient
    if (patient) {
      const patientInvoices = invoices.filter((inv) => inv.patientId === patient.id)
      // For simplicity, auto-select the first invoice if available
      if (patientInvoices.length > 0) {
        handleInvoiceChange(patientInvoices[0].id)
      }
    }
  }

  const handleInvoiceChange = (invoiceId: string) => {
    const invoice = invoices.find((inv) => inv.id === invoiceId)
    setSelectedInvoice(invoice || null)

    if (invoice) {
      // Initialize results from invoice line items
      const dataManager = DataManager.getInstance()
      const testCatalog = dataManager.getTestCatalog()

      const initialResults: ReportResult[] = []
      
      invoice.lineItems.forEach((item) => {
        const test = testCatalog.find((t) => t.code === item.testCode)
        const referenceRanges = test?.referenceRange || {}

        // For multi-component tests like FBC, create separate result entries for each component
        if (Object.keys(referenceRanges).length > 1) {
          Object.entries(referenceRanges).forEach(([component, range]) => {
            initialResults.push({
              testCode: item.testCode,
              testName: `${item.testName} - ${component}`,
              value: "",
              unit: getUnitFromRange(range),
              referenceRange: range,
              comments: "",
            })
          })
        } else {
          // For single-component tests, create one result entry
          const firstRange = Object.entries(referenceRanges)[0]
          initialResults.push({
            testCode: item.testCode,
            testName: item.testName,
            value: "",
            unit: firstRange ? firstRange[0] : "",
            referenceRange: firstRange ? firstRange[1] : "",
            comments: "",
          })
        }
      })

      setResults(initialResults)
    }
  }

  const updateResult = (testName: string, field: keyof ReportResult, value: string) => {
    setResults(results.map((result) => (result.testName === testName ? { ...result, [field]: value } : result)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPatient || !selectedInvoice || results.length === 0) return

    setSaving(true)

    try {
      const dataManager = DataManager.getInstance()
      const report = dataManager.addReport({
        patientId: selectedPatient.id,
        patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        invoiceId: selectedInvoice.id,
        results: results.filter((r) => r.value.trim() !== ""), // Only include results with values
        doctorRemarks,
        reviewedBy,
      })

      // Redirect to report details page
      router.push(`/reports/${report.id}`)
    } catch (error) {
      console.error("Error saving report:", error)
    } finally {
      setSaving(false)
    }
  }

  const isFormValid = () => {
    return selectedPatient && selectedInvoice && results.some((r) => r.value.trim() !== "") && reviewedBy.trim() !== ""
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const patientInvoices = selectedPatient ? invoices.filter((inv) => inv.patientId === selectedPatient.id) : []

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
            <h1 className="text-3xl font-bold">Generate New Report</h1>
            <p className="text-muted-foreground">Create a laboratory test report with results</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient & Invoice Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Select Patient & Invoice
              </CardTitle>
              <CardDescription>Choose the patient and completed invoice for this report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="patient">Patient *</Label>
                  <Select value={selectedPatient?.id || ""} onValueChange={handlePatientChange}>
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

                <div className="space-y-2">
                  <Label htmlFor="invoice">Invoice *</Label>
                  <Select
                    value={selectedInvoice?.id || ""}
                    onValueChange={handleInvoiceChange}
                    disabled={!selectedPatient}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an invoice" />
                    </SelectTrigger>
                    <SelectContent>
                      {patientInvoices.map((invoice) => (
                        <SelectItem key={invoice.id} value={invoice.id}>
                          {invoice.id} - LKR {invoice.grandTotal.toFixed(2)} ({invoice.lineItems.length} tests)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedPatient && selectedInvoice && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="grid gap-2 md:grid-cols-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Patient:</span>
                      <div className="font-medium">
                        {selectedPatient.firstName} {selectedPatient.lastName}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Invoice:</span>
                      <div className="font-medium">{selectedInvoice.id}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Tests:</span>
                      <div className="font-medium">{selectedInvoice.lineItems.length} tests</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Date:</span>
                      <div className="font-medium">{new Date(selectedInvoice.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test Results */}
          {results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Enter Test Results
                </CardTitle>
                <CardDescription>Input the results for each test</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {results.map((result, index) => (
                  <div key={`${result.testCode}-${index}`} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">{result.testCode}</Badge>
                      <span className="font-medium">{result.testName}</span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor={`value-${result.testCode}-${index}`}>Result Value *</Label>
                        <Input
                          id={`value-${result.testCode}-${index}`}
                          value={result.value}
                          onChange={(e) => updateResult(result.testName, "value", e.target.value)}
                          placeholder="Enter result value"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`unit-${result.testCode}-${index}`}>Unit</Label>
                        <Input
                          id={`unit-${result.testCode}-${index}`}
                          value={result.unit}
                          onChange={(e) => updateResult(result.testName, "unit", e.target.value)}
                          placeholder="e.g., mg/dL, %"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`range-${result.testCode}-${index}`}>Reference Range</Label>
                        <Input
                          id={`range-${result.testCode}-${index}`}
                          value={result.referenceRange}
                          onChange={(e) => updateResult(result.testName, "referenceRange", e.target.value)}
                          placeholder="e.g., 70-100 mg/dL"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`comments-${result.testCode}-${index}`}>Comments (Optional)</Label>
                      <Textarea
                        id={`comments-${result.testCode}-${index}`}
                        value={result.comments || ""}
                        onChange={(e) => updateResult(result.testName, "comments", e.target.value)}
                        placeholder="Any additional comments about this result"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Doctor's Remarks */}
          {results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Additional Information
                </CardTitle>
                <CardDescription>Add doctor's remarks and review information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="doctorRemarks">Doctor's Remarks (Optional)</Label>
                  <Textarea
                    id="doctorRemarks"
                    value={doctorRemarks}
                    onChange={(e) => setDoctorRemarks(e.target.value)}
                    placeholder="Enter any additional remarks or recommendations"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reviewedBy">Reviewed By *</Label>
                  <Input
                    id="reviewedBy"
                    value={reviewedBy}
                    onChange={(e) => setReviewedBy(e.target.value)}
                    placeholder="Enter reviewer name"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form Actions */}
          <div className="flex items-center gap-4">
            <Button type="submit" disabled={!isFormValid() || saving} className="min-w-[120px]">
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Generating..." : "Generate Report"}
            </Button>
            <Button asChild type="button" variant="outline">
              <Link href="/reports">
                Cancel
              </Link>
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
