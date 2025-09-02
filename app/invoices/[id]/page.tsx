"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, Printer as Print, Share, Mail, MessageCircle, Edit } from "lucide-react"
import { DataManager, type Invoice } from "@/lib/data-manager"
import Link from "next/link"

export default function InvoiceDetailsPage() {
  const params = useParams()
  const invoiceId = params.id as string

  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const authStatus = localStorage.getItem("lablite_auth")
    if (authStatus !== "authenticated") {
      window.location.href = "/"
      return
    }
    setIsAuthenticated(true)

    // Load invoice data
    const dataManager = DataManager.getInstance()
    const allInvoices = dataManager.getInvoices()
    const invoiceData = allInvoices.find((inv) => inv.id === invoiceId)

    if (!invoiceData) {
      // Invoice not found, redirect to invoices list
      window.location.href = "/invoices"
      return
    }

    setInvoice(invoiceData)
    setLoading(false)
  }, [invoiceId])

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = async () => {
    // This would generate and download the PDF
    // For now, we'll show an alert
    alert("PDF generation would be implemented here using @react-pdf/renderer")
  }

  const handleShareEmail = () => {
    if (!invoice) return
    const subject = `Invoice ${invoice.id} - LabLite Laboratory`
    const body = `Dear ${invoice.patientName},

Please find attached your laboratory test invoice.

Invoice ID: ${invoice.id}
Total Amount: $${invoice.grandTotal.toFixed(2)}
Status: ${invoice.status}

Best regards,
LabLite Laboratory Team

(PDF attached)`

    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
  }

  const handleShareWhatsApp = () => {
    if (!invoice) return
    const message = `Hello ${invoice.patientName}, your laboratory test invoice ${invoice.id} for $${invoice.grandTotal.toFixed(2)} is ready. (PDF attached)`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`)
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
          <Link href="/invoices">
            <Button>Back to Invoices</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/invoices">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
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
                <CardTitle className="text-2xl mb-2">LabLite Laboratory</CardTitle>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>123 Medical Center Drive</div>
                  <div>Healthcare City, HC 12345</div>
                  <div>Phone: +1 (555) 123-4567</div>
                  <div>Email: info@lablite.com</div>
                </div>
              </div>
              <div className="text-right">
                <Badge
                  variant={
                    invoice.status === "Paid" ? "default" : invoice.status === "Partial" ? "secondary" : "outline"
                  }
                  className="text-lg px-4 py-2"
                >
                  {invoice.status}
                </Badge>
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
                    <span className="text-muted-foreground">Status:</span> {invoice.status}
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
                    <div className="col-span-2 text-right">${item.unitPrice.toFixed(2)}</div>
                    <div className="col-span-2 text-right font-medium">${item.total.toFixed(2)}</div>
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
                  <span>${invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({(invoice.taxRate * 100).toFixed(1)}%):</span>
                  <span>${invoice.taxAmount.toFixed(2)}</span>
                </div>
                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({(invoice.discountPercent * 100).toFixed(1)}%):</span>
                    <span>-${invoice.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Grand Total:</span>
                  <span>${invoice.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t text-center text-sm text-muted-foreground">
              <p>Thank you for choosing LabLite Laboratory for your healthcare needs.</p>
              <p className="mt-2">For questions about this invoice, please contact us at info@lablite.com</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="print:hidden">
          <CardHeader>
            <CardTitle>Share Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button onClick={handleShareEmail} variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button onClick={handleShareWhatsApp} variant="outline">
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button variant="outline">
                <Share className="h-4 w-4 mr-2" />
                More Options
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Share links will open with pre-filled message and "(PDF attached)" note. Actual PDF attachment would be
              implemented in production.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
