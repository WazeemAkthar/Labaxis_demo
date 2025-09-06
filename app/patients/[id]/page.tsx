"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Phone, Mail, Calendar, FileText, DollarSign, Edit } from "lucide-react"
import { DataManager, type Patient, type Invoice, type Report } from "@/lib/data-manager"
import Link from "next/link"

export default function PatientDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const patientId = params.id as string

  const [patient, setPatient] = useState<Patient | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const authStatus = localStorage.getItem("lablite_auth")
    if (authStatus !== "authenticated") {
      router.push("/")
      return
    }
    setIsAuthenticated(true)

    // Load patient data
    const dataManager = DataManager.getInstance()
    const patientData = dataManager.getPatientById(patientId)

    if (!patientData) {
      // Patient not found, redirect to patients list
      router.push("/patients")
      return
    }

    setPatient(patientData)

    // Load related invoices and reports
    const allInvoices = dataManager.getInvoices()
    const patientInvoices = allInvoices.filter((inv) => inv.patientId === patientId)
    setInvoices(patientInvoices)

    const allReports = dataManager.getReports()
    const patientReports = allReports.filter((rep) => rep.patientId === patientId)
    setReports(patientReports)

    setLoading(false)
  }, [patientId])

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!patient) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Patient Not Found</h1>
          <Button asChild>
            <Link href="/patients">Back to Patients</Link>
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
            <Link href="/patients">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">
              {patient.firstName} {patient.lastName}
            </h1>
            <p className="text-muted-foreground">Patient ID: {patient.id}</p>
          </div>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Patient
          </Button>
        </div>

        {/* Patient Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Basic Information</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Age:</span>
                    <span>{patient.age} years old</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Gender:</span>
                    <Badge variant="secondary">{patient.gender}</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Contact Information</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{patient.email}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Medical Information</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Doctor:</span>
                    <span className="text-sm">Dr. {patient.doctorName}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Registration</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{new Date(patient.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {patient.notes && (
              <div className="mt-6 pt-6 border-t">
                <div className="text-sm text-muted-foreground mb-2">Notes</div>
                <p className="text-sm">{patient.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabbed Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="invoices">Invoices ({invoices.length})</TabsTrigger>
            <TabsTrigger value="reports">Reports ({reports.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {invoices.length === 0 && reports.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No recent activity</p>
                  ) : (
                    <div className="space-y-3">
                      {invoices.slice(0, 3).map((invoice) => (
                        <div key={invoice.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div>
                            <div className="font-medium text-sm">Invoice {invoice.id}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(invoice.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <Badge variant={invoice.status === "Paid" ? "default" : "secondary"}>{invoice.status}</Badge>
                        </div>
                      ))}
                      {reports.slice(0, 3).map((report) => (
                        <div key={report.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div>
                            <div className="font-medium text-sm">Report {report.id}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(report.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <Badge variant="default">Completed</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Financial Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Invoices:</span>
                      <span className="font-medium">{invoices.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Amount:</span>
                      <span className="font-medium">
                        ${invoices.reduce((sum, inv) => sum + inv.grandTotal, 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Outstanding:</span>
                      <span className="font-medium text-orange-600">
                        $
                        {invoices
                          .filter((inv) => inv.status !== "Paid")
                          .reduce((sum, inv) => sum + inv.grandTotal, 0)
                          .toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-4">
            {invoices.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No invoices yet</h3>
                  <p className="text-muted-foreground mb-4">Create the first invoice for this patient.</p>
                  <Button>Create Invoice</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <Card key={invoice.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{invoice.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(invoice.createdAt).toLocaleDateString()} • {invoice.lineItems.length} tests
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${invoice.grandTotal.toFixed(2)}</div>
                          <Badge variant={invoice.status === "Paid" ? "default" : "secondary"}>{invoice.status}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            {reports.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No reports yet</h3>
                  <p className="text-muted-foreground mb-4">Generate the first report for this patient.</p>
                  <Button>Generate Report</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <Card key={report.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{report.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(report.createdAt).toLocaleDateString()} • {report.results.length} tests
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="default">Completed</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
