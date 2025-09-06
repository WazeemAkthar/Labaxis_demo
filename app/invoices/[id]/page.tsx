"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, Printer as Print, Edit } from "lucide-react"
import { DataManager, type Invoice } from "@/lib/data-manager"
import { generateInvoicePDF } from "@/lib/pdf-generator"
import Link from "next/link"

export default function InvoiceDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const invoiceId = params.id as string

  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const authStatus = localStorage.getItem("lablite_auth")
    if (authStatus !== "authenticated") {
      router.push("/")
      return
    }
    setIsAuthenticated(true)

    // Load invoice data
    const dataManager = DataManager.getInstance()
    const allInvoices = dataManager.getInvoices()
    const invoiceData = allInvoices.find((inv) => inv.id === invoiceId)

    if (!invoiceData) {
      // Invoice not found, redirect to invoices list
      router.push("/invoices")
      return
    }

    setInvoice(invoiceData)
    setLoading(false)
  }, [invoiceId])

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = async () => {
    if (!invoice) return
    
    try {
      // Get patient data for the PDF
      const dataManager = DataManager.getInstance()
      const patient = dataManager.getPatientById(invoice.patientId)
      
      if (!patient) {
        alert("Patient information not found")
        return
      }
      
      // Generate and download PDF
      await generateInvoicePDF(invoice, patient)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    }
  }


  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Invoice Not Found</h1>
          <Button asChild>
            <Link href="/invoices">Back to Invoices</Link>
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href="/invoices">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Invoice {invoice.id}</h1>
            <p className="text-muted-foreground">Created on {new Date(invoice.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Print className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        {/* Invoice Content */}
        <Card className="print:shadow-none">
          <CardHeader className="pb-6">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">Azza Medical Laboratory Services</CardTitle>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Unique Place for all Diagnostic needs</div>
                  <div>Phone: 0752537178, 0776452417, 0753274455</div>
                  <div>Email: azzaarafath@gmail.com</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  {invoice.lineItems.length} {invoice.lineItems.length === 1 ? 'test' : 'tests'}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Patient Information */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">Bill To:</h3>
                <div className="space-y-1">
                  <div className="font-medium">{invoice.patientName}</div>
                  <div className="text-sm text-muted-foreground">Patient ID: {invoice.patientId}</div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Invoice Details:</h3>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="text-muted-foreground">Invoice ID:</span> {invoice.id}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date:</span>{" "}
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tests:</span> {invoice.lineItems.length}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Line Items */}
            <div>
              <h3 className="font-semibold mb-4">Test Details:</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                  <div className="col-span-2">Code</div>
                  <div className="col-span-5">Test Name</div>
                  <div className="col-span-1 text-center">Qty</div>
                  <div className="col-span-2 text-right">Unit Price</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>
                {invoice.lineItems.map((item) => (
                  <div key={item.testCode} className="grid grid-cols-12 gap-4 text-sm py-2">
                    <div className="col-span-2">
                      <Badge variant="outline">{item.testCode}</Badge>
                    </div>
                    <div className="col-span-5">{item.testName}</div>
                    <div className="col-span-1 text-center">{item.quantity}</div>
                    <div className="col-span-2 text-right">LKR {item.unitPrice.toFixed(2)}</div>
                    <div className="col-span-2 text-right font-medium">LKR {item.total.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-full max-w-sm space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>LKR {invoice.subtotal.toFixed(2)}</span>
                </div>
                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({(invoice.discountPercent * 100).toFixed(1)}%):</span>
                    <span>-LKR {invoice.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Grand Total:</span>
                  <span>LKR {invoice.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t text-center text-sm text-muted-foreground">
              <p>Thank you for choosing Azza Medical Laboratory Services for your healthcare needs.</p>
              <p className="mt-2">For questions about this invoice, please contact us at info@lablite.com</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  )
}
