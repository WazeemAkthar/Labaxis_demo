"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation" // Added useRouter import
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, DollarSign, Activity } from "lucide-react"
import { DataManager } from "@/lib/data-manager"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter() // Added router instance
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalInvoices: 0,
    monthlyRevenue: 0,
    testsCompleted: 0,
  })

  useEffect(() => {
    const authStatus = localStorage.getItem("lablite_auth")
    if (authStatus !== "authenticated") {
      router.push("/") // Use router.push instead of window.location.href to prevent page refresh
      return
    }
    setIsAuthenticated(true)

    // Load statistics
    const dataManager = DataManager.getInstance()
    const patients = dataManager.getPatients()
    const invoices = dataManager.getInvoices()
    const reports = dataManager.getReports()

    // Calculate monthly revenue
    const now = new Date()
    const monthlyInvoices = invoices.filter((inv) => {
      const invDate = new Date(inv.createdAt)
      return invDate.getMonth() === now.getMonth() && invDate.getFullYear() === now.getFullYear()
    })
    const monthlyRevenue = monthlyInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0)

    setStats({
      totalPatients: patients.length,
      totalInvoices: invoices.length,
      monthlyRevenue,
      testsCompleted: reports.reduce((sum, report) => sum + report.results.length, 0),
    })

    setLoading(false)
  }, [router]) // Added router to dependency array

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
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to Azza Medical Laboratory Services</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPatients}</div>
              <p className="text-xs text-muted-foreground">Registered patients</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInvoices}</div>
              <p className="text-xs text-muted-foreground">Generated invoices</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">LKR {stats.monthlyRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">This month's income</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.testsCompleted}</div>
              <p className="text-xs text-muted-foreground">Reports generated</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common laboratory tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Link href="/patients/new">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">Register Patient</h3>
                    <p className="text-sm text-muted-foreground">Add new patient to system</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/invoices/new">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4 text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">Create Invoice</h3>
                    <p className="text-sm text-muted-foreground">Generate test invoice</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/reports/new">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4 text-center">
                    <Activity className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">Generate Report</h3>
                    <p className="text-sm text-muted-foreground">Create test report</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
