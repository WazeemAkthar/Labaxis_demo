"use client"

import type React from "react"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, User, FileText, TestTube } from "lucide-react"
import { DataManager, type Patient, type Invoice, type ReportResult } from "@/lib/data-manager"
import { FBCReportCard } from "@/components/fbc-report-card"
import { TestSelectionComponent } from "@/components/test-selection"
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
  const [selectedTests, setSelectedTests] = useState<string[]>([])
  const [useDirectTestSelection, setUseDirectTestSelection] = useState(false)
  const [results, setResults] = useState<ReportResult[]>([])
  const [fbcValues, setFbcValues] = useState<any>(null)
  const [doctorRemarks, setDoctorRemarks] = useState("")
  const [reviewedBy, setReviewedBy] = useState("Dr. Lab Director")

  useEffect(() => {
    const authStatus = localStorage.getItem("labaxis_auth")
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

  const handlePatientChange = useCallback((patientId: string) => {
    const patient = patients.find((p) => p.id === patientId)
    setSelectedPatient(patient || null)
    setSelectedInvoice(null)
    setSelectedTests([])
    setUseDirectTestSelection(false)
    setResults([])
    setFbcValues(null)
  }, [patients])

  const handleInvoiceChange = useCallback((invoiceId: string) => {
    const invoice = invoices.find((inv) => inv.id === invoiceId)
    setSelectedInvoice(invoice || null)
    setFbcValues(null)

    if (invoice) {
      // Initialize results from invoice line items
      const dataManager = DataManager.getInstance()
      const testCatalog = dataManager.getTestCatalog()

      const initialResults: ReportResult[] = []
      
      invoice.lineItems.forEach((item) => {
        const test = testCatalog.find((t) => t.code === item.testCode)
        const referenceRanges = test?.referenceRange || {}

        // Handle FBC specially - don't create individual result entries
        if (item.testCode === 'FBC') {
          // FBC will be handled by the specialized component
          return
        }

        // For multi-component tests (excluding FBC), create separate result entries for each component
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
  }, [invoices])

  const updateResult = (testName: string, field: keyof ReportResult, value: string) => {
    setResults(results.map((result) => (result.testName === testName ? { ...result, [field]: value } : result)))
  }

  const handleFBCValuesChange = useCallback((values: any) => {
    setFbcValues(values)
  }, [])

  const handleDirectTestSelection = useCallback(() => {
    setUseDirectTestSelection(true)
    setSelectedInvoice(null)
    setResults([])
    setFbcValues(null)
  }, [])

  const handleTestSelection = useCallback((testCodes: string[]) => {
    // Prevent unnecessary updates if the test selection hasn't actually changed
    if (JSON.stringify(testCodes.sort()) === JSON.stringify(selectedTests.sort())) {
      return
    }
    
    setSelectedTests(testCodes)
    
    // Initialize results from selected tests
    const dataManager = DataManager.getInstance()
    const testCatalog = dataManager.getTestCatalog()
    const initialResults: ReportResult[] = []
    
    testCodes.forEach((testCode) => {
      const test = testCatalog.find((t) => t.code === testCode)
      const referenceRanges = test?.referenceRange || {}

      // Handle FBC specially - don't create individual result entries
      if (testCode === 'FBC') {
        // FBC will be handled by the specialized component
        return
      }

      // For multi-component tests (excluding FBC), create separate result entries for each component
      if (Object.keys(referenceRanges).length > 1) {
        Object.entries(referenceRanges).forEach(([component, range]) => {
          initialResults.push({
            testCode: testCode,
            testName: `${test?.name} - ${component}`,
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
          testCode: testCode,
          testName: test?.name || testCode,
          value: "",
          unit: firstRange ? firstRange[0] : "",
          referenceRange: firstRange ? firstRange[1] : "",
          comments: "",
        })
      }
    })

    setResults(initialResults)
  }, [selectedTests])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPatient || (!selectedInvoice && !useDirectTestSelection)) return

    setSaving(true)

    try {
      const dataManager = DataManager.getInstance()
      
      // Prepare all results including FBC
      const allResults: ReportResult[] = [...results.filter((r) => r.value.trim() !== "")]
      
      // Determine if FBC is included
      const hasFBC = useDirectTestSelection 
        ? selectedTests.includes('FBC')
        : selectedInvoice?.lineItems.some(item => item.testCode === 'FBC')
      
      // Add FBC results if available
      if (fbcValues && hasFBC) {
        const fbcResults = [
          { testCode: 'FBC', testName: 'Hemoglobin', value: fbcValues.hemoglobin, unit: 'g/dL', referenceRange: '12.0-16.0', comments: '' },
          { testCode: 'FBC', testName: 'RBC', value: fbcValues.rbc, unit: 'x10⁶/μL', referenceRange: '3.8-5.2', comments: '' },
          { testCode: 'FBC', testName: 'PCV', value: fbcValues.pcv, unit: '%', referenceRange: '36-46', comments: '' },
          { testCode: 'FBC', testName: 'MCV', value: fbcValues.mcv, unit: 'fL', referenceRange: '80-100', comments: '' },
          { testCode: 'FBC', testName: 'MCH', value: fbcValues.mch, unit: 'pg', referenceRange: '27-33', comments: '' },
          { testCode: 'FBC', testName: 'MCHC', value: fbcValues.mchc, unit: 'g/dL', referenceRange: '32-36', comments: '' },
          { testCode: 'FBC', testName: 'RDW-CV', value: fbcValues.rdwCv, unit: '%', referenceRange: '11.5-14.5', comments: '' },
          { testCode: 'FBC', testName: 'Platelets', value: fbcValues.platelets, unit: 'x10³/μL', referenceRange: '150-450', comments: '' },
          { testCode: 'FBC', testName: 'WBC', value: fbcValues.wbc, unit: 'x10³/μL', referenceRange: '4.0-11.0', comments: '' },
          { testCode: 'FBC', testName: 'Neutrophils', value: fbcValues.neutrophils, unit: '%', referenceRange: '40-70', comments: '' },
          { testCode: 'FBC', testName: 'Lymphocytes', value: fbcValues.lymphocytes, unit: '%', referenceRange: '20-40', comments: '' },
          { testCode: 'FBC', testName: 'Eosinophils', value: fbcValues.eosinophils, unit: '%', referenceRange: '1-4', comments: '' },
          { testCode: 'FBC', testName: 'Monocytes', value: fbcValues.monocytes, unit: '%', referenceRange: '2-8', comments: '' },
          { testCode: 'FBC', testName: 'Basophils', value: fbcValues.basophils, unit: '%', referenceRange: '0-1', comments: '' },
          { testCode: 'FBC', testName: 'Neutrophils (Abs)', value: fbcValues.neutrophilsAbs, unit: 'x10³/μL', referenceRange: '2.0-7.5', comments: '' },
          { testCode: 'FBC', testName: 'Lymphocytes (Abs)', value: fbcValues.lymphocytesAbs, unit: 'x10³/μL', referenceRange: '1.0-4.0', comments: '' },
          { testCode: 'FBC', testName: 'Eosinophils (Abs)', value: fbcValues.eosinophilsAbs, unit: 'x10³/μL', referenceRange: '0.05-0.50', comments: '' },
          { testCode: 'FBC', testName: 'Monocytes (Abs)', value: fbcValues.monocytesAbs, unit: 'x10³/μL', referenceRange: '0.20-1.00', comments: '' },
          { testCode: 'FBC', testName: 'Basophils (Abs)', value: fbcValues.basophilsAbs, unit: 'x10³/μL', referenceRange: '0.00-0.20', comments: '' }
        ].filter(r => r.value && r.value.trim() !== '')
        
        allResults.push(...fbcResults)
      }

      if (allResults.length === 0) return

      const report = dataManager.addReport({
        patientId: selectedPatient.id,
        patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        invoiceId: selectedInvoice?.id || null,
        results: allResults,
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

  const isFormValid = useMemo(() => {
    const hasRegularResults = results.some((r) => r.value.trim() !== "")
    const hasFBC = useDirectTestSelection 
      ? selectedTests.includes('FBC')
      : selectedInvoice?.lineItems.some(item => item.testCode === 'FBC')
    const hasFBCResults = fbcValues && hasFBC && Object.values(fbcValues).some(v => v && String(v).trim() !== "")
    const hasValidSelection = selectedInvoice || (useDirectTestSelection && selectedTests.length > 0)
    return selectedPatient && hasValidSelection && (hasRegularResults || hasFBCResults) && reviewedBy.trim() !== ""
  }, [selectedPatient, selectedInvoice, useDirectTestSelection, selectedTests, results, fbcValues, reviewedBy])

  // Check if FBC test is selected - use useMemo to prevent recalculation
  const hasFBCTest = useMemo(() => {
    return useDirectTestSelection 
      ? selectedTests.includes('FBC')
      : selectedInvoice?.lineItems.some(item => item.testCode === 'FBC') || false
  }, [useDirectTestSelection, selectedTests, selectedInvoice])

  // Memoize patient invoices to prevent recalculation
  const patientInvoices = useMemo(() => {
    return selectedPatient ? invoices.filter((inv) => inv.patientId === selectedPatient.id) : []
  }, [selectedPatient, invoices])

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
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
          {/* Patient & Test Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Select Patient & Tests
              </CardTitle>
              <CardDescription>Choose the patient and either an existing invoice or select tests directly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patient">Patient *</Label>
                <Select key={selectedPatient?.id || 'no-patient'} value={selectedPatient?.id || ""} onValueChange={handlePatientChange}>
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

              {selectedPatient && (
                <div className="space-y-4">
                  {/* Option 1: Use existing invoice */}
                  {patientInvoices.length > 0 && !useDirectTestSelection && (
                    <div className="space-y-2">
                      <Label htmlFor="invoice">Select Invoice (Optional)</Label>
                      <Select
                        key={selectedInvoice?.id || 'no-invoice'}
                        value={selectedInvoice?.id || ""}
                        onValueChange={handleInvoiceChange}
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
                  )}

                  {/* Option 2: Direct test selection */}
                  {!selectedInvoice && (
                    <div className="space-y-4">
                      {!useDirectTestSelection && (
                        <div className="text-center p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-2">
                            No invoice selected or patient paid at hospital?
                          </p>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={handleDirectTestSelection}
                          >
                            Select Tests Directly
                          </Button>
                        </div>
                      )}

                      {useDirectTestSelection && (
                        <TestSelectionComponent
                          selectedTests={selectedTests}
                          onTestsChange={handleTestSelection}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Summary */}
              {selectedPatient && (selectedInvoice || (useDirectTestSelection && selectedTests.length > 0)) && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="grid gap-2 md:grid-cols-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Patient:</span>
                      <div className="font-medium">
                        {selectedPatient.firstName} {selectedPatient.lastName}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">
                        {selectedInvoice ? 'Invoice:' : 'Tests:'}
                      </span>
                      <div className="font-medium">
                        {selectedInvoice 
                          ? selectedInvoice.id
                          : `${selectedTests.length} selected`
                        }
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Test Count:</span>
                      <div className="font-medium">
                        {selectedInvoice 
                          ? selectedInvoice.lineItems.length 
                          : selectedTests.length
                        } tests
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Date:</span>
                      <div className="font-medium">
                        {selectedInvoice 
                          ? new Date(selectedInvoice.createdAt).toLocaleDateString()
                          : new Date().toLocaleDateString()
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test Results */}
          {(results.length > 0 || hasFBCTest) && (
            <div className="space-y-6">
              {/* FBC Test - Special Component */}
              {hasFBCTest && (
                <FBCReportCard onValuesChange={handleFBCValuesChange} />
              )}
              
              {/* Other Tests */}
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
            </div>
          )}

          {/* Doctor's Remarks */}
          {(results.length > 0 || hasFBCTest) && (
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
            <Button type="submit" disabled={!isFormValid || saving} className="min-w-[120px]">
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
  )
}
