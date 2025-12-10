"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, DollarSign, Activity } from "lucide-react"
import { DataManager } from "@/lib/data-manager"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalInvoices: 0,
    monthlyRevenue: 0,
    testsCompleted: 0,
  })

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push("/")
      return
    }

    // Load statistics
    async function loadStats() {
      const dataManager = DataManager.getInstance()
      const [patients, invoices, reports] = await Promise.all([
        dataManager.getPatients(),
        dataManager.getInvoices(),
        dataManager.getReports(),
      ])

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
    }

    loadStats()
  }, [user, authLoading, router])

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-teal-50/30 via-emerald-50/30 to-cyan-50/30">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-linear-to-r from-teal-600 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-teal-50">Welcome to LabReportHub Medical Laboratory Services</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-teal-100 shadow-md hover:shadow-lg transition-shadow bg-linear-to-br from-white to-teal-50/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Total Patients</CardTitle>
            <div className="bg-teal-100 p-2 rounded-lg">
              <Users className="h-4 w-4 text-teal-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-700">{stats.totalPatients}</div>
            <p className="text-xs text-slate-600">Registered patients</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-100 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-emerald-50/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Total Invoices</CardTitle>
            <div className="bg-emerald-100 p-2 rounded-lg">
              <FileText className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">{stats.totalInvoices}</div>
            <p className="text-xs text-slate-600">Generated invoices</p>
          </CardContent>
        </Card>

        <Card className="border-cyan-100 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-cyan-50/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Monthly Revenue</CardTitle>
            <div className="bg-cyan-100 p-2 rounded-lg">
              <DollarSign className="h-4 w-4 text-cyan-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-700">LKR {stats.monthlyRevenue.toFixed(2)}</div>
            <p className="text-xs text-slate-600">This month's income</p>
          </CardContent>
        </Card>

        <Card className="border-teal-100 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-teal-50/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Tests Completed</CardTitle>
            <div className="bg-teal-100 p-2 rounded-lg">
              <Activity className="h-4 w-4 text-teal-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-700">{stats.testsCompleted}</div>
            <p className="text-xs text-slate-600">Reports generated</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-teal-100 shadow-lg bg-gradient-to-br from-white to-teal-50/20">
        <CardHeader>
          <CardTitle className="text-teal-800">Quick Actions</CardTitle>
          <CardDescription className="text-slate-600">Get started with common laboratory tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/patients/new">
              <Card className="cursor-pointer hover:shadow-lg transition-all border-teal-200 bg-gradient-to-br from-teal-50 to-white hover:from-teal-100 hover:to-teal-50">
                <CardContent className="p-4 text-center">
                  <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-3 rounded-full w-fit mx-auto mb-2">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-teal-800">Register Patient</h3>
                  <p className="text-sm text-slate-600">Add new patient to system</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/invoices/new">
              <Card className="cursor-pointer hover:shadow-lg transition-all border-emerald-200 bg-gradient-to-br from-emerald-50 to-white hover:from-emerald-100 hover:to-emerald-50">
                <CardContent className="p-4 text-center">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-full w-fit mx-auto mb-2">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-emerald-800">Create Invoice</h3>
                  <p className="text-sm text-slate-600">Generate test invoice</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/reports/new">
              <Card className="cursor-pointer hover:shadow-lg transition-all border-cyan-200 bg-gradient-to-br from-cyan-50 to-white hover:from-cyan-100 hover:to-cyan-50">
                <CardContent className="p-4 text-center">
                  <div className="bg-gradient-to-br from-cyan-500 to-teal-600 p-3 rounded-full w-fit mx-auto mb-2">
                    <Activity className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-cyan-800">Generate Report</h3>
                  <p className="text-sm text-slate-600">Create test report</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}