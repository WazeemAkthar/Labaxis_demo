"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
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

    // Load reports
    const dataManager = DataManager.getInstance()
    const reportsData = dataManager.getReports()
    setReports(reportsData)
    setFilteredReports(reportsData)
    setLoading(false)
  }, [])

  useEffect(() => {
    // Filter reports based on search term
    const filtered = reports.filter(
      (report) =>
        report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredReports(filtered)
  }, [searchTerm, reports])

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground">Manage laboratory test reports and results</p>
          </div>
          <Button asChild>
            <Link href="/reports/new">
              <Plus className="h-4 w-4 mr-2" />
              Generate Report
            </Link>
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredReports.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredReports.reduce((sum, report) => sum + report.results.length, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by report ID, patient name, or invoice ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reports list */}
        <div className="grid gap-4">
          {filteredReports.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No reports found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm
                    ? "No reports match your search criteria."
                    : "Get started by generating your first report."}
                </p>
                <Button asChild>
                  <Link href="/reports/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Report
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredReports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Activity className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{report.id}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{report.patientName}</span>
                          <span>•</span>
                          <span>{report.patientId}</span>
                          <span>•</span>
                          <span>Invoice: {report.invoiceId}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
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
                      <Badge variant="default">Completed</Badge>
                      <Button asChild variant="outline">
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
    </DashboardLayout>
  )
}
