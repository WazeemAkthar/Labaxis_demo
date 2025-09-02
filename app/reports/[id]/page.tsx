"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, Printer as Print, Share, Mail, MessageCircle, Edit } from "lucide-react"
import { DataManager, type Report } from "@/lib/data-manager"
import Link from "next/link"

export default function ReportDetailsPage() {
  const params = useParams()
  const reportId = params.id as string

  const [report, setReport] = useState<Report | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const authStatus = localStorage.getItem("lablite_auth")
    if (authStatus !== "authenticated") {
      window.location.href = "/"
      return
    }
    setIsAuthenticated(true)

    // Load report data
    const dataManager = DataManager.getInstance()
    const allReports = dataManager.getReports()
    const reportData = allReports.find((rep) => rep.id === reportId)

    if (!reportData) {
      // Report not found, redirect to reports list
      window.location.href = "/reports"
      return
    }

    setReport(reportData)
    setLoading(false)
  }, [reportId])

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = async () => {
    // This would generate and download the PDF
    // For now, we'll show an alert
    alert("PDF generation would be implemented here using @react-pdf/renderer")
  }

  const handleShareEmail = () => {
    if (!report) return
    const subject = `Laboratory Report ${report.id} - LabLite Laboratory`
    const body = `Dear ${report.patientName},

Please find attached your laboratory test report.

Report ID: ${report.id}
Invoice ID: ${report.invoiceId}
Tests Completed: ${report.results.length}
Reviewed by: ${report.reviewedBy}

Best regards,
LabLite Laboratory Team

(PDF attached)`

    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
  }

  const handleShareWhatsApp = () => {
    if (!report) return
    const message = `Hello ${report.patientName}, your laboratory test report ${report.id} is ready. ${report.results.length} tests completed. (PDF attached)`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`)
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!report) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Report Not Found</h1>
          <Link href="/reports">
            <Button>Back to Reports</Button>
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
          <Link href="/reports">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Report {report.id}</h1>
            <p className="text-muted-foreground">Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
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

        {/* Report Content */}
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
                <Badge variant="default" className="text-lg px-4 py-2">
                  Laboratory Report
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Patient Information */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">Patient Information:</h3>
                <div className="space-y-1">
                  <div className="font-medium">{report.patientName}</div>
                  <div className="text-sm text-muted-foreground">Patient ID: {report.patientId}</div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Report Details:</h3>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="text-muted-foreground">Report ID:</span> {report.id}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Invoice ID:</span> {report.invoiceId}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date:</span>{" "}
                    {new Date(report.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Reviewed by:</span> {report.reviewedBy}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Test Results */}
            <div>
              <h3 className="font-semibold mb-4">Test Results:</h3>
              <div className="space-y-4">
                {report.results.map((result) => (
                  <div key={result.testCode} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">{result.testCode}</Badge>
                      <span className="font-medium">{result.testName}</span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3 mb-3">
                      <div>
                        <span className="text-sm text-muted-foreground">Result:</span>
                        <div className="font-semibold text-lg">
                          {result.value} {result.unit}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Reference Range:</span>
                        <div className="font-medium">{result.referenceRange}</div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <div>
                          <Badge variant="secondary">Normal</Badge>
                        </div>
                      </div>
                    </div>

                    {result.comments && (
                      <div>
                        <span className="text-sm text-muted-foreground">Comments:</span>
                        <p className="text-sm mt-1">{result.comments}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Doctor's Remarks */}
            {report.doctorRemarks && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Doctor's Remarks:</h3>
                  <p className="text-sm">{report.doctorRemarks}</p>
                </div>
              </>
            )}

            <Separator />

            {/* Footer */}
            <div className="text-center text-sm text-muted-foreground space-y-2">
              <p>This report has been reviewed and approved by {report.reviewedBy}</p>
              <p>For questions about this report, please contact us at info@lablite.com</p>
              <p className="font-medium">*** End of Report ***</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="print:hidden">
          <CardHeader>
            <CardTitle>Share Report</CardTitle>
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
