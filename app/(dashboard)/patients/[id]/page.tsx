"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Phone, Mail, Calendar, FileText, DollarSign, Edit, Activity } from "lucide-react"
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

    const dataManager = DataManager.getInstance()
    const patientData = dataManager.getPatientById(patientId)

    if (!patientData) {
      router.push("/patients")
      return
    }

    setPatient(patientData)

    const allInvoices = dataManager.getInvoices()
    const patientInvoices = allInvoices.filter((inv) => inv.patientId === patientId)
    setInvoices(patientInvoices)

    const allReports = dataManager.getReports()
    const patientReports = allReports.filter((rep) => rep.patientId === patientId)
    setReports(patientReports)

    setLoading(false)
  }, [patientId, router])

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-200 border-t-teal-600"></div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50">
        <Card className="border-teal-100 shadow-lg">
          <CardContent className="p-12 text-center">
            <User className="h-16 w-16 mx-auto mb-4 text-teal-300" />
            <h1 className="text-2xl font-bold mb-4 text-slate-800">Patient Not Found</h1>
            <Button asChild className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">
              <Link href="/patients">Back to Patients</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0)
  const outstandingAmount = invoices
    .filter((inv) => inv.status !== "Paid")
    .reduce((sum, inv) => sum + inv.grandTotal, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
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
          <div className="flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              {patient.firstName} {patient.lastName}
            </h1>
            <p className="text-slate-600 mt-1">Patient ID: {patient.id}</p>
          </div>
          <Button
            variant="outline"
            className="border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-400"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Patient
          </Button>
        </div>

        {/* Patient Overview Card */}
        <Card className="border-teal-100 shadow-md bg-white/90 backdrop-blur-sm">
          <CardHeader className="border-b border-teal-100 bg-gradient-to-r from-teal-50 to-cyan-50">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
                <User className="h-5 w-5 text-white" />
              </div>
              Patient Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-3 p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg border border-teal-100">
                <div className="text-sm font-semibold text-teal-700">Basic Information</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-700">Age:</span>
                    <span className="text-slate-600">{patient.age} years old</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-700">Gender:</span>
                    <Badge variant="secondary" className="bg-teal-100 text-teal-700">
                      {patient.gender}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg border border-cyan-100">
                <div className="text-sm font-semibold text-cyan-700">Contact Information</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-cyan-600" />
                    <span className="text-sm text-slate-600">{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-cyan-600" />
                    <span className="text-sm text-slate-600">{patient.email}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
                <div className="text-sm font-semibold text-emerald-700">Medical Information</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-700">Doctor:</span>
                    <span className="text-sm text-slate-600">Dr. {patient.doctorName}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <div className="text-sm font-semibold text-blue-700">Registration</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-slate-600">
                    {new Date(patient.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {patient.notes && (
              <div className="mt-6 pt-6 border-t border-teal-100">
                <div className="text-sm font-semibold text-slate-700 mb-2">Notes</div>
                <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-lg">{patient.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabbed Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-white/90 border border-teal-100 shadow-sm">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="invoices"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
            >
              Invoices ({invoices.length})
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
            >
              Reports ({reports.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-teal-100 shadow-md bg-white/90 backdrop-blur-sm">
                <CardHeader className="border-b border-teal-100 bg-gradient-to-r from-teal-50 to-cyan-50">
                  <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                    <Activity className="h-5 w-5 text-teal-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {invoices.length === 0 && reports.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto mb-3 text-teal-300" />
                      <p className="text-slate-500">No recent activity</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {invoices.slice(0, 3).map((invoice) => (
                        <div
                          key={invoice.id}
                          className="flex items-center justify-between p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-100"
                        >
                          <div>
                            <div className="font-medium text-sm text-slate-800">Invoice {invoice.id}</div>
                            <div className="text-xs text-slate-500">
                              {new Date(invoice.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <Badge
                            variant={invoice.status === "Paid" ? "default" : "secondary"}
                            className={
                              invoice.status === "Paid"
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                            }
                          >
                            {invoice.status}
                          </Badge>
                        </div>
                      ))}
                      {reports.slice(0, 3).map((report) => (
                        <div
                          key={report.id}
                          className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100"
                        >
                          <div>
                            <div className="font-medium text-sm text-slate-800">Report {report.id}</div>
                            <div className="text-xs text-slate-500">
                              {new Date(report.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <Badge variant="default" className="bg-teal-100 text-teal-700 hover:bg-teal-200">
                            Completed
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-teal-100 shadow-md bg-white/90 backdrop-blur-sm">
                <CardHeader className="border-b border-teal-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                  <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                    Financial Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-600 font-medium">Total Invoices:</span>
                      <span className="font-semibold text-slate-800">{invoices.length}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-teal-50 rounded-lg border border-teal-100">
                      <span className="text-slate-600 font-medium">Total Amount:</span>
                      <span className="font-semibold text-teal-700">${totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-orange-50 rounded-lg border border-orange-100">
                      <span className="text-slate-600 font-medium">Outstanding:</span>
                      <span className="font-semibold text-orange-700">${outstandingAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-4">
            {invoices.length === 0 ? (
              <Card className="border-teal-100 shadow-md bg-white/90 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center">
                    <FileText className="h-10 w-10 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-800">No invoices yet</h3>
                  <p className="text-slate-600 mb-6">Create the first invoice for this patient.</p>
                  <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">
                    Create Invoice
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <Card
                    key={invoice.id}
                    className="border-teal-100 shadow-md bg-white/90 backdrop-blur-sm hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg text-slate-800">{invoice.id}</h3>
                          <p className="text-sm text-slate-600">
                            {new Date(invoice.createdAt).toLocaleDateString()} • {invoice.lineItems.length} tests
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-xl text-teal-700">${invoice.grandTotal.toFixed(2)}</div>
                          <Badge
                            variant={invoice.status === "Paid" ? "default" : "secondary"}
                            className={
                              invoice.status === "Paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }
                          >
                            {invoice.status}
                          </Badge>
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
              <Card className="border-teal-100 shadow-md bg-white/90 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <FileText className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-800">No reports yet</h3>
                  <p className="text-slate-600 mb-6">Generate the first report for this patient.</p>
                  <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <Card
                    key={report.id}
                    className="border-teal-100 shadow-md bg-white/90 backdrop-blur-sm hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg text-slate-800">{report.id}</h3>
                          <p className="text-sm text-slate-600">
                            {new Date(report.createdAt).toLocaleDateString()} • {report.results.length} tests
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="default" className="bg-teal-100 text-teal-700">
                            Completed
                          </Badge>
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
    </div>
  )
}