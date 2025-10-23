"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Trash2, User, TestTube, Calculator } from "lucide-react"
import { DataManager, type Patient, type TestCatalogItem, type InvoiceLineItem } from "@/lib/data-manager"
import Link from "next/link"

export default function NewInvoicePage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [patients, setPatients] = useState<Patient[]>([])
  const [testCatalog, setTestCatalog] = useState<TestCatalogItem[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([])
  const [discountPercent, setDiscountPercent] = useState(0)

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

    const catalogData = dataManager.getTestCatalog()
    setTestCatalog(catalogData)
    setLoading(false)
  }, [])

  const addTestToInvoice = (testCode: string) => {
    const test = testCatalog.find((t) => t.code === testCode)
    if (!test) return

    // Check if test already exists
    const existingIndex = lineItems.findIndex((item) => item.testCode === testCode)
    if (existingIndex >= 0) {
      // Test already added, don't add again
      return
    }

    const newLineItem: InvoiceLineItem = {
      testCode: test.code,
      testName: test.name,
      quantity: 1,
      unitPrice: test.defaultPrice,
      total: test.defaultPrice,
    }

    setLineItems([...lineItems, newLineItem])
  }

  const removeTestFromInvoice = (testCode: string) => {
    setLineItems(lineItems.filter((item) => item.testCode !== testCode))
  }

  const updateTestPrice = (testCode: string, newPrice: number) => {
    setLineItems(
      lineItems.map((item) =>
        item.testCode === testCode ? { ...item, unitPrice: newPrice, total: newPrice * item.quantity } : item,
      ),
    )
  }

  // Calculate totals
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0)
  const discountAmount = (subtotal * discountPercent) / 100
  const grandTotal = subtotal - discountAmount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPatient || lineItems.length === 0) return

    setSaving(true)

    try {
      console.log("[v0] Starting invoice creation")
      console.log("[v0] Selected patient:", selectedPatient)
      console.log("[v0] Line items:", lineItems)
      console.log("[v0] Totals - subtotal:", subtotal, "discount:", discountAmount, "grand total:", grandTotal)

      const dataManager = DataManager.getInstance()
      console.log("[v0] DataManager instance obtained")

      const invoice = dataManager.addInvoice({
        patientId: selectedPatient.id,
        patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        lineItems,
        subtotal,
        discountPercent: discountPercent / 100,
        discountAmount,
        grandTotal,
        status: ""
      })

      console.log("[v0] Invoice created successfully:", invoice)
      console.log("[v0] Attempting to navigate to:", `/invoices/${invoice.id}`)

      router.push(`/invoices/${invoice.id}`)
    } catch (error) {
      console.error("[v0] Error saving invoice:", error)
      alert("Error creating invoice. Please try again.")
    } finally {
      setSaving(false)
    }
  }

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
            <Link href="/invoices">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create New Invoice</h1>
            <p className="text-muted-foreground">Generate a test invoice for a patient</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Select Patient
              </CardTitle>
              <CardDescription>Choose the patient for this invoice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patient">Patient *</Label>
                  <Select
                    value={selectedPatient?.id || ""}
                    onValueChange={(value) => {
                      const patient = patients.find((p) => p.id === value)
                      setSelectedPatient(patient || null)
                    }}
                  >
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
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="grid gap-2 md:grid-cols-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Patient:</span>
                        <div className="font-medium">
                          {selectedPatient.firstName} {selectedPatient.lastName}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">ID:</span>
                        <div className="font-medium">{selectedPatient.id}</div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Phone:</span>
                        <div className="font-medium">{selectedPatient.phone}</div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Doctor:</span>
                        <div className="font-medium">Dr. {selectedPatient.doctorName}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Test Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Add Tests
              </CardTitle>
              <CardDescription>Select tests from the catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                  {testCatalog.map((test) => (
                    <Card
                      key={test.code}
                      className={`cursor-pointer transition-colors ${
                        lineItems.some((item) => item.testCode === test.code)
                          ? "bg-primary/10 border-primary"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => addTestToInvoice(test.code)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{test.code}</Badge>
                          <span className="font-semibold">LKR {test.defaultPrice.toFixed(2)}</span>
                        </div>
                        <h4 className="font-medium text-sm mb-1">{test.name}</h4>
                        <p className="text-xs text-muted-foreground">{test.category}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Tests */}
          {lineItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Invoice Items
                </CardTitle>
                <CardDescription>Review and adjust selected tests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lineItems.map((item) => (
                    <div key={item.testCode} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{item.testCode}</Badge>
                          <span className="font-medium">{item.testName}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">Quantity: {item.quantity}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <Label htmlFor={`price-${item.testCode}`} className="text-xs text-muted-foreground">
                            Unit Price
                          </Label>
                          <Input
                            id={`price-${item.testCode}`}
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.unitPrice}
                            onChange={(e) => updateTestPrice(item.testCode, Number.parseFloat(e.target.value) || 0)}
                            className="w-24 text-right"
                          />
                        </div>
                        <div className="text-right min-w-[80px]">
                          <div className="text-xs text-muted-foreground">Total</div>
                          <div className="font-semibold">LKR {item.total.toFixed(2)}</div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeTestFromInvoice(item.testCode)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Totals */}
                  <div className="border-t pt-4 space-y-4">
                    <div className="grid gap-4 md:grid-cols-1">
                      <div className="space-y-2">
                        <Label htmlFor="discountPercent">Discount (%)</Label>
                        <Input
                          id="discountPercent"
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          value={discountPercent}
                          onChange={(e) => setDiscountPercent(Number.parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>LKR {subtotal.toFixed(2)}</span>
                      </div>
                      {discountPercent > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount ({discountPercent}%):</span>
                          <span>-LKR {discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <span>Grand Total:</span>
                        <span>LKR {grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form Actions */}
          <div className="flex items-center gap-4">
            <Button
              type="submit"
              disabled={!selectedPatient || lineItems.length === 0 || saving}
              className="min-w-[120px]"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Creating..." : "Create Invoice"}
            </Button>
            <Button asChild type="button" variant="outline">
              <Link href="/invoices">
                Cancel
              </Link>
            </Button>
          </div>
        </form>
      </div>
  )
}
