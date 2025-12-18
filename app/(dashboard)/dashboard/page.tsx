"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, DollarSign, Activity, TrendingUp, Calendar, Clock } from "lucide-react"
import { DataManager } from "@/lib/data-manager"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts"

interface ChartDataItem {
  month?: string
  revenue?: number
  invoices?: number
  patients?: number
  name?: string
  value?: number
  [key: string]: string | number | undefined
}

interface ChartData {
  revenueByMonth: ChartDataItem[]
  testsByCategory: ChartDataItem[]
  patientGrowth: ChartDataItem[]
  invoiceStatus: ChartDataItem[]
}

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
  const [chartData, setChartData] = useState<ChartData>({
    revenueByMonth: [],
    testsByCategory: [],
    patientGrowth: [],
    invoiceStatus: []
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

      // Prepare chart data
      prepareChartData(invoices, reports, patients)
      setLoading(false)
    }

    loadStats()
  }, [user, authLoading, router])

  const prepareChartData = (invoices: any[], reports: any[], patients: any[]) => {
    // Revenue by month (last 6 months)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const now = new Date()
    const revenueByMonth: ChartDataItem[] = []
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthRevenue = invoices
        .filter((inv: any) => {
          const invDate = new Date(inv.createdAt)
          return invDate.getMonth() === date.getMonth() && invDate.getFullYear() === date.getFullYear()
        })
        .reduce((sum: number, inv: any) => sum + inv.grandTotal, 0)
      
      revenueByMonth.push({
        month: monthNames[date.getMonth()],
        revenue: monthRevenue,
        invoices: invoices.filter((inv: any) => {
          const invDate = new Date(inv.createdAt)
          return invDate.getMonth() === date.getMonth() && invDate.getFullYear() === date.getFullYear()
        }).length
      })
    }

    // Tests by category
    const testCategories: Record<string, number> = {}
    reports.forEach((report: any) => {
      report.results.forEach((result: any) => {
        const category = result.testName.split(' ')[0] // Simple categorization
        testCategories[category] = (testCategories[category] || 0) + 1
      })
    })
    
    const testsByCategory: ChartDataItem[] = Object.entries(testCategories)
      .map(([name, value]) => ({ name, value }))
      .slice(0, 6)

    // Patient growth (last 6 months)
    const patientGrowth: ChartDataItem[] = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const count = patients.filter((p: any) => {
        const pDate = new Date(p.createdAt)
        return pDate <= date
      }).length
      
      patientGrowth.push({
        month: monthNames[date.getMonth()],
        patients: count
      })
    }

    // Invoice status distribution
    const statusCounts: Record<string, number> = {
      Paid: 0,
      Pending: 0,
      Overdue: 0
    }
    
    invoices.forEach((inv: any) => {
      const status = inv.status || 'Pending'
      statusCounts[status] = (statusCounts[status] || 0) + 1
    })

    const invoiceStatus: ChartDataItem[] = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))

    setChartData({
      revenueByMonth,
      testsByCategory,
      patientGrowth,
      invoiceStatus
    })
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F7FA' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: '#1FB6B2', borderTopColor: 'transparent' }}></div>
      </div>
    )
  }

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  const COLORS = ['#0F3D5E', '#1FB6B2', '#2DD4BF', '#0EA5E9', '#3B82F6', '#8B5CF6']

  return (
    <div className="space-y-8 p-0" style={{ backgroundColor: '#F5F7FA', minHeight: '100vh' }}>
      {/* Hero Header */}
      <div className="shadow-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0F3D5E 0%, #1FB6B2 100%)' }}>
        <div className="p-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Welcome Back, {user?.email || 'Doctor'}</h1>
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{currentDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
              <p className="text-white/80 text-sm mb-1">Laboratory Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-white font-semibold">Operational</span>
              </div>
            </div>
          </div>
        </div>
        <div className="h-2" style={{ background: 'linear-gradient(90deg, #1FB6B2 0%, #0F3D5E 100%)' }}></div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 px-5">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
          {/* <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{ background: '#0F3D5E', transform: 'translate(25%, -25%)' }}></div> */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold" style={{ color: '#1F2933' }}>Total Patients</CardTitle>
            <div className="p-3 rounded-xl" style={{ backgroundColor: '#0F3D5E' }}>
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1" style={{ color: '#0F3D5E' }}>{stats.totalPatients}</div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" style={{ color: '#1FB6B2' }} />
              <p className="text-xs font-medium" style={{ color: '#1FB6B2' }}>Registered patients</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
          {/* <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{ background: '#1FB6B2', transform: 'translate(25%, -25%)' }}></div> */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold" style={{ color: '#1F2933' }}>Total Invoices</CardTitle>
            <div className="p-3 rounded-xl" style={{ backgroundColor: '#1FB6B2' }}>
              <FileText className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1" style={{ color: '#0F3D5E' }}>{stats.totalInvoices}</div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" style={{ color: '#1FB6B2' }} />
              <p className="text-xs font-medium" style={{ color: '#1FB6B2' }}>Generated invoices</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
          {/* <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{ background: '#0F3D5E', transform: 'translate(25%, -25%)' }}></div> */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold" style={{ color: '#1F2933' }}>Monthly Revenue</CardTitle>
            <div className="p-3 rounded-xl" style={{ backgroundColor: '#0F3D5E' }}>
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1" style={{ color: '#0F3D5E' }}>LKR {stats.monthlyRevenue.toFixed(2)}</div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" style={{ color: '#1FB6B2' }} />
              <p className="text-xs font-medium" style={{ color: '#1FB6B2' }}>This month's income</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
          {/* <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{ background: '#1FB6B2', transform: 'translate(25%, -25%)' }}></div> */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold" style={{ color: '#1F2933' }}>Tests Completed</CardTitle>
            <div className="p-3 rounded-xl" style={{ backgroundColor: '#1FB6B2' }}>
              <Activity className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1" style={{ color: '#0F3D5E' }}>{stats.testsCompleted}</div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" style={{ color: '#1FB6B2' }} />
              <p className="text-xs font-medium" style={{ color: '#1FB6B2' }}>Reports generated</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 px-3">
        {/* Revenue Trend Chart */}
        <Card className="border-0 shadow-xl" style={{ backgroundColor: 'white' }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 rounded-full" style={{ backgroundColor: '#1FB6B2' }}></div>
              <div>
                <CardTitle style={{ color: '#0F3D5E' }}>Revenue Trend</CardTitle>
                <CardDescription style={{ color: '#1F2933' }}>Last 6 months revenue overview</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData.revenueByMonth}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1FB6B2" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#1FB6B2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#1F2933" />
                <YAxis stroke="#1F2933" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #1FB6B2', borderRadius: '8px' }}
                  labelStyle={{ color: '#0F3D5E', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#1FB6B2" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Patient Growth Chart */}
        <Card className="border-0 shadow-xl" style={{ backgroundColor: 'white' }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 rounded-full" style={{ backgroundColor: '#0F3D5E' }}></div>
              <div>
                <CardTitle style={{ color: '#0F3D5E' }}>Patient Growth</CardTitle>
                <CardDescription style={{ color: '#1F2933' }}>Cumulative patient registrations</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.patientGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#1F2933" />
                <YAxis stroke="#1F2933" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #0F3D5E', borderRadius: '8px' }}
                  labelStyle={{ color: '#0F3D5E', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="patients" stroke="#0F3D5E" strokeWidth={3} dot={{ fill: '#1FB6B2', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tests by Category */}
        <Card className="border-0 shadow-xl" style={{ backgroundColor: 'white' }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 rounded-full" style={{ backgroundColor: '#1FB6B2' }}></div>
              <div>
                <CardTitle style={{ color: '#0F3D5E' }}>Tests Distribution</CardTitle>
                <CardDescription style={{ color: '#1F2933' }}>Most performed test categories</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.testsByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#1F2933" />
                <YAxis stroke="#1F2933" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #1FB6B2', borderRadius: '8px' }}
                  labelStyle={{ color: '#0F3D5E', fontWeight: 'bold' }}
                />
                <Bar dataKey="value" fill="#1FB6B2" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Invoice Status Pie Chart */}
        <Card className="border-0 shadow-xl" style={{ backgroundColor: 'white' }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 rounded-full" style={{ backgroundColor: '#0F3D5E' }}></div>
              <div>
                <CardTitle style={{ color: '#0F3D5E' }}>Invoice Status</CardTitle>
                <CardDescription style={{ color: '#1F2933' }}>Payment status breakdown</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.invoiceStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.invoiceStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #1FB6B2', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-xl" style={{ backgroundColor: 'white' }}>
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 rounded-full" style={{ backgroundColor: '#1FB6B2' }}></div>
            <div>
              <CardTitle className="text-2xl" style={{ color: '#0F3D5E' }}>Quick Actions</CardTitle>
              <CardDescription className="text-base" style={{ color: '#1F2933' }}>Common laboratory tasks and operations</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <Link href="/patients/new">
              <Card className="cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group overflow-hidden">
                {/* <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(135deg, rgba(15, 61, 94, 0.05) 0%, rgba(31, 182, 178, 0.05) 100%)' }}></div> */}
                <CardContent className="p-6 text-center relative">
                  <div className="p-4 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, #0F3D5E 0%, #1FB6B2 100%)' }}>
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#0F3D5E' }}>Register Patient</h3>
                  <p className="text-sm" style={{ color: '#1F2933' }}>Add new patient to the system</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/invoices/new">
              <Card className="cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group overflow-hidden">
                {/* <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(135deg, rgba(15, 61, 94, 0.05) 0%, rgba(31, 182, 178, 0.05) 100%)' }}></div> */}
                <CardContent className="p-6 text-center relative">
                  <div className="p-4 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, #1FB6B2 0%, #0F3D5E 100%)' }}>
                    <FileText className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#0F3D5E' }}>Create Invoice</h3>
                  <p className="text-sm" style={{ color: '#1F2933' }}>Generate test invoice</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/reports/new">
              <Card className="cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group overflow-hidden">
                {/* <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(135deg, rgba(15, 61, 94, 0.05) 0%, rgba(31, 182, 178, 0.05) 100%)' }}></div> */}
                <CardContent className="p-6 text-center relative">
                  <div className="p-4 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, #0F3D5E 0%, #1FB6B2 100%)' }}>
                    <Activity className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#0F3D5E' }}>Generate Report</h3>
                  <p className="text-sm" style={{ color: '#1F2933' }}>Create test report</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}