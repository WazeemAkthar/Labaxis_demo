"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, Calendar, Activity, FileText } from "lucide-react"
import { DataManager, type Report } from "@/lib/data-manager"
import Link from "next/link"

export default function ReportsPage() {
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredReports, setFilteredReports] = useState<Report[]>([])
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
    const reportsData = dataManager.getReports()
    setReports(reportsData)
    setFilteredReports(reportsData)
    setLoading(false)
  }, [])

  useEffect(() => {
    const filtered = reports.filter(
      (report) =>
        report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.invoiceId ?? "").toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredReports(filtered)
  }, [searchTerm, reports])

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-teal-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-teal-900">Reports</h1>
            <p className="text-teal-700 mt-1">Manage laboratory test reports and results</p>
          </div>
          <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white shadow-md">
            <Link href="/reports/new">
              <Plus className="h-4 w-4 mr-2" />
              Generate Report
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-teal-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-teal-900">Total Reports</CardTitle>
              <Activity className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-900">{filteredReports.length}</div>
            </CardContent>
          </Card>

          <Card className="border-cyan-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-teal-900">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-cyan-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-900">
                {
                  filteredReports.filter((report) => {
                    const reportDate = new Date(report.createdAt)
                    const now = new Date()
                    return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear()
                  }).length
                }
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-teal-900">Tests Completed</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-900">
                {filteredReports.reduce((sum, report) => sum + report.results.length, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-teal-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-600" />
                <Input
                  placeholder="Search by report ID, patient name, or invoice ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <Button variant="outline" size="icon" className="border-teal-300 text-teal-700 hover:bg-teal-50">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-3">
          {filteredReports.length === 0 ? (
            <Card className="border-teal-200">
              <CardContent className="p-12 text-center">
                <Activity className="h-12 w-12 mx-auto mb-4 text-teal-400" />
                <h3 className="text-lg font-semibold mb-2 text-teal-900">No reports found</h3>
                <p className="text-teal-700 mb-4">
                  {searchTerm
                    ? "No reports match your search criteria."
                    : "Get started by generating your first report."}
                </p>
                <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white">
                  <Link href="/reports/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Report
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredReports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-all border-teal-200 hover:border-teal-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-sm">
                        <Activity className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base text-teal-900">{report.id}</h3>
                        <div className="flex items-center gap-3 text-xs text-teal-700 mt-0.5">
                          <span className="font-medium">{report.patientName}</span>
                          <span>•</span>
                          <span>{report.patientId}</span>
                          <span>•</span>
                          <span>Invoice: {report.invoiceId}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-teal-600 mt-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(report.createdAt).toLocaleDateString()}
                          <span>•</span>
                          <span>{report.results.length} tests</span>
                          <span>•</span>
                          <span>Reviewed by: {report.reviewedBy}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-200 border-teal-300">
                        Completed
                      </Badge>
                      <Button asChild variant="outline" size="sm" className="border-teal-300 text-teal-700 hover:bg-teal-50">
                        <Link href={`/reports/${report.id}`}>View Report</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}