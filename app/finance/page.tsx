"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, FileText, TrendingUp, TrendingDown, BarChart3 } from "lucide-react"
import { DataManager, type Invoice } from "@/lib/data-manager"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

type DateFilter = "today" | "week" | "month" | "custom"

interface IncomeByDay {
  date: string
  income: number
  invoices: number
}

interface IncomeByTestType {
  testType: string
  income: number
  profit: number
  cost: number
  count: number
}

export default function FinancePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
  const [dateFilter, setDateFilter] = useState<DateFilter>("month")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const authStatus = localStorage.getItem("lablite_auth")
    if (authStatus !== "authenticated") {
      window.location.href = "/"
      return
    }
    setIsAuthenticated(true)

    // Load invoices
    const dataManager = DataManager.getInstance()
    const invoicesData = dataManager.getInvoices()
    setInvoices(invoicesData)
    setLoading(false)
  }, [])

  useEffect(() => {
    // Filter invoices based on date filter
    const now = new Date()
    let filtered: Invoice[] = []

    switch (dateFilter) {
      case "today":
        filtered = invoices.filter((inv) => {
          const invDate = new Date(inv.createdAt)
          return invDate.toDateString() === now.toDateString()
        })
        break
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        filtered = invoices.filter((inv) => {
          const invDate = new Date(inv.createdAt)
          return invDate >= weekAgo
        })
        break
      case "month":
        filtered = invoices.filter((inv) => {
          const invDate = new Date(inv.createdAt)
          return invDate.getMonth() === now.getMonth() && invDate.getFullYear() === now.getFullYear()
        })
        break
      default:
        filtered = invoices
    }

    setFilteredInvoices(filtered)
  }, [dateFilter, invoices])

  // Calculate KPIs
  const totalInvoices = filteredInvoices.length
  const totalIncome = filteredInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0)
  const averageTicket = totalInvoices > 0 ? totalIncome / totalInvoices : 0
  const paidInvoices = filteredInvoices.filter((inv) => inv.status === "Paid")
  const unpaidInvoices = filteredInvoices.filter((inv) => inv.status === "Unpaid")
  const partialInvoices = filteredInvoices.filter((inv) => inv.status === "Partial")

  // Calculate profitability
  const dataManager = DataManager.getInstance()
  const testCatalog = dataManager.getTestCatalog()

  let totalCost = 0
  let totalProfit = 0

  filteredInvoices.forEach((invoice) => {
    invoice.lineItems.forEach((item) => {
      const test = testCatalog.find((t) => t.code === item.testCode)
      const estimatedCost = test ? test.estimatedCost * item.quantity : 0
      totalCost += estimatedCost
      totalProfit += item.total - estimatedCost
    })
  })

  const profitMargin = totalIncome > 0 ? (totalProfit / totalIncome) * 100 : 0

  // Prepare chart data - Income by Day
  const incomeByDay: IncomeByDay[] = []
  const dateMap = new Map<string, { income: number; invoices: number }>()

  filteredInvoices.forEach((invoice) => {
    const date = new Date(invoice.createdAt).toLocaleDateString()
    const existing = dateMap.get(date) || { income: 0, invoices: 0 }
    dateMap.set(date, {
      income: existing.income + invoice.grandTotal,
      invoices: existing.invoices + 1,
    })
  })

  dateMap.forEach((value, date) => {
    incomeByDay.push({
      date,
      income: value.income,
      invoices: value.invoices,
    })
  })

  // Sort by date
  incomeByDay.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Prepare chart data - Income by Test Type
  const testTypeMap = new Map<string, { income: number; cost: number; count: number }>()

  filteredInvoices.forEach((invoice) => {
    invoice.lineItems.forEach((item) => {
      const test = testCatalog.find((t) => t.code === item.testCode)
      const category = test?.category || "Other"
      const estimatedCost = test ? test.estimatedCost * item.quantity : 0

      const existing = testTypeMap.get(category) || { income: 0, cost: 0, count: 0 }
      testTypeMap.set(category, {
        income: existing.income + item.total,
        cost: existing.cost + estimatedCost,
        count: existing.count + item.quantity,
      })
    })
  })

  const incomeByTestType: IncomeByTestType[] = []
  testTypeMap.forEach((value, testType) => {
    incomeByTestType.push({
      testType,
      income: value.income,
      cost: value.cost,
      profit: value.income - value.cost,
      count: value.count,
    })
  })

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

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
            <h1 className="text-3xl font-bold">Finance Dashboard</h1>
            <p className="text-muted-foreground">Income tracking and profitability analysis</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={dateFilter} onValueChange={(value: DateFilter) => setDateFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInvoices}</div>
              <p className="text-xs text-muted-foreground">
                {paidInvoices.length} paid, {unpaidInvoices.length} unpaid
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalIncome.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                ${paidInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0).toFixed(2)} collected
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Ticket</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${averageTicket.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Per invoice</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profitMargin.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">${totalProfit.toFixed(2)} profit</p>
            </CardContent>
          </Card>
        </div>

        {/* Profitability Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Estimated operational costs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${totalProfit.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Revenue minus costs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                ${unpaidInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">{unpaidInvoices.length} unpaid invoices</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Income by Day Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Income by Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incomeByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, "Income"]} />
                    <Bar dataKey="income" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Income by Test Type Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Income by Test Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incomeByTestType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ testType, percent }) => `${testType} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="income"
                    >
                      {incomeByTestType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, "Income"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profit by Test Type Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Profit by Test Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeByTestType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="testType" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      `$${Number(value).toFixed(2)}`,
                      name === "income" ? "Income" : name === "cost" ? "Cost" : "Profit",
                    ]}
                  />
                  <Bar dataKey="income" fill="#0088FE" name="income" />
                  <Bar dataKey="cost" fill="#FF8042" name="cost" />
                  <Bar dataKey="profit" fill="#00C49F" name="profit" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredInvoices.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No invoices found for the selected period.</p>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                    <div className="col-span-2">Invoice ID</div>
                    <div className="col-span-3">Patient</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2">Amount</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-1">Tests</div>
                  </div>
                  {filteredInvoices.slice(0, 10).map((invoice) => (
                    <div key={invoice.id} className="grid grid-cols-12 gap-4 text-sm py-2 hover:bg-muted/50 rounded">
                      <div className="col-span-2 font-medium">{invoice.id}</div>
                      <div className="col-span-3">{invoice.patientName}</div>
                      <div className="col-span-2">{new Date(invoice.createdAt).toLocaleDateString()}</div>
                      <div className="col-span-2 font-medium">${invoice.grandTotal.toFixed(2)}</div>
                      <div className="col-span-2">
                        <Badge
                          variant={
                            invoice.status === "Paid"
                              ? "default"
                              : invoice.status === "Partial"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </div>
                      <div className="col-span-1">{invoice.lineItems.length}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Outstanding Payments */}
        {unpaidInvoices.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Outstanding Payments
                <Badge variant="outline">{unpaidInvoices.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                  <div className="col-span-3">Invoice ID</div>
                  <div className="col-span-4">Patient</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-2">Amount</div>
                  <div className="col-span-1">Days</div>
                </div>
                {unpaidInvoices.map((invoice) => {
                  const daysPast = Math.floor(
                    (new Date().getTime() - new Date(invoice.createdAt).getTime()) / (1000 * 60 * 60 * 24),
                  )
                  return (
                    <div key={invoice.id} className="grid grid-cols-12 gap-4 text-sm py-2 hover:bg-muted/50 rounded">
                      <div className="col-span-3 font-medium">{invoice.id}</div>
                      <div className="col-span-4">{invoice.patientName}</div>
                      <div className="col-span-2">{new Date(invoice.createdAt).toLocaleDateString()}</div>
                      <div className="col-span-2 font-medium text-orange-600">${invoice.grandTotal.toFixed(2)}</div>
                      <div className="col-span-1">
                        <Badge variant={daysPast > 30 ? "destructive" : "secondary"}>{daysPast}d</Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
