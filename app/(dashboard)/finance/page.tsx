"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DollarSign, FileText, TrendingUp, TrendingDown, BarChart3 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface LineItem {
  testCode: string
  quantity: number
  total: number
}

interface Invoice {
  id: string
  patientName: string
  createdAt: string
  grandTotal: number
  status: string
  lineItems: LineItem[]
}

interface IncomeByDay {
  date: string
  income: number
  invoices: number
}

interface IncomeByTestType {
  [key: string]: string | number
  testType: string
  income: number
  cost: number
  profit: number
  count: number
}

interface TestCatalogItem {
  code: string
  category: string
  estimatedCost: number
}

type DateFilter = "today" | "week" | "month" | "custom"

export default function FinancePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
  const [dateFilter, setDateFilter] = useState<DateFilter>("month")
  const [loading, setLoading] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    const mockInvoices: Invoice[] = [
      {
        id: "INV-001",
        patientName: "John Doe",
        createdAt: new Date().toISOString(),
        grandTotal: 15000,
        status: "Paid",
        lineItems: [
          { testCode: "CBC", quantity: 1, total: 8000 },
          { testCode: "LFT", quantity: 1, total: 7000 }
        ]
      },
      {
        id: "INV-002",
        patientName: "Jane Smith",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        grandTotal: 12000,
        status: "Paid",
        lineItems: [
          { testCode: "RFT", quantity: 1, total: 12000 }
        ]
      },
      {
        id: "INV-003",
        patientName: "Ahmed Hassan",
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        grandTotal: 25000,
        status: "Partial",
        lineItems: [
          { testCode: "CBC", quantity: 1, total: 8000 },
          { testCode: "LFT", quantity: 1, total: 7000 },
          { testCode: "TFT", quantity: 1, total: 10000 }
        ]
      }
    ]
    setInvoices(mockInvoices)
  }, [])

  useEffect(() => {
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

  const totalInvoices = filteredInvoices.length
  const totalIncome = filteredInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0)
  const averageTicket = totalInvoices > 0 ? totalIncome / totalInvoices : 0

  const testCatalog: TestCatalogItem[] = [
    { code: "CBC", category: "Hematology", estimatedCost: 3000 },
    { code: "LFT", category: "Biochemistry", estimatedCost: 2500 },
    { code: "RFT", category: "Biochemistry", estimatedCost: 4000 },
    { code: "TFT", category: "Endocrinology", estimatedCost: 3500 }
  ]

  let totalCost = 0
  let totalProfit = 0

  filteredInvoices.forEach((invoice) => {
    invoice.lineItems.forEach((item: LineItem) => {
      const test = testCatalog.find((t) => t.code === item.testCode)
      const estimatedCost = test ? test.estimatedCost * item.quantity : 0
      totalCost += estimatedCost
      totalProfit += item.total - estimatedCost
    })
  })

  const profitMargin = totalIncome > 0 ? (totalProfit / totalIncome) * 100 : 0

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

  incomeByDay.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const testTypeMap = new Map<string, { income: number; cost: number; count: number }>()

  filteredInvoices.forEach((invoice) => {
    invoice.lineItems.forEach((item: LineItem) => {
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

  const COLORS = ["#14b8a6", "#0d9488", "#0f766e", "#115e59", "#134e4a", "#0e7490"]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-6 border-l-4 border-teal-500">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Finance Dashboard</h1>
                <p className="text-teal-600 font-medium">New Azza Medical Laboratory Services</p>
              </div>
            </div>
            <p className="text-gray-600 ml-15">Income tracking and profitability analysis</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={dateFilter} onValueChange={(value) => setDateFilter(value as DateFilter)}>
              <SelectTrigger className="w-40 border-teal-200 focus:ring-teal-500">
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-teal-100 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-br from-teal-50 to-white">
              <CardTitle className="text-sm font-medium text-gray-700">Total Invoices</CardTitle>
              <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-teal-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-gray-900">{totalInvoices}</div>
              <p className="text-xs text-gray-600 mt-1">Total invoices generated</p>
            </CardContent>
          </Card>

          <Card className="border-teal-100 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-br from-emerald-50 to-white">
              <CardTitle className="text-sm font-medium text-gray-700">Total Income</CardTitle>
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-gray-900">LKR {totalIncome.toFixed(2)}</div>
              <p className="text-xs text-gray-600 mt-1">Total revenue from all invoices</p>
            </CardContent>
          </Card>

          <Card className="border-teal-100 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-br from-cyan-50 to-white">
              <CardTitle className="text-sm font-medium text-gray-700">Average Ticket</CardTitle>
              <div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-cyan-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-gray-900">LKR {averageTicket.toFixed(2)}</div>
              <p className="text-xs text-gray-600 mt-1">Per invoice</p>
            </CardContent>
          </Card>

          <Card className="border-teal-100 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-br from-teal-50 to-white">
              <CardTitle className="text-sm font-medium text-gray-700">Profit Margin</CardTitle>
              <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-teal-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-teal-600">{profitMargin.toFixed(1)}%</div>
              <p className="text-xs text-gray-600 mt-1">LKR {totalProfit.toFixed(2)} profit</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-red-100 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-br from-red-50 to-white">
              <CardTitle className="text-sm font-medium text-gray-700">Total Cost</CardTitle>
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-gray-900">LKR {totalCost.toFixed(2)}</div>
              <p className="text-xs text-gray-600 mt-1">Estimated operational costs</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-100 shadow-md hover:shadow-lg transition-shadow duration-300 md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-br from-emerald-50 to-white">
              <CardTitle className="text-sm font-medium text-gray-700">Total Profit</CardTitle>
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-emerald-600">LKR {totalProfit.toFixed(2)}</div>
              <p className="text-xs text-gray-600 mt-1">Revenue minus costs</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-teal-100 shadow-md">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-white">
              <CardTitle className="text-gray-900">Income by Day</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incomeByDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      formatter={(value) => [`LKR ${Number(value).toFixed(2)}`, "Income"]}
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #14b8a6', borderRadius: '8px' }}
                    />
                    <Bar dataKey="income" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-teal-100 shadow-md">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-white">
              <CardTitle className="text-gray-900">Income by Test Type</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incomeByTestType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ testType, percent }) => `${testType} ${((Number(percent) || 0) * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="income"
                    >
                      {incomeByTestType.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`LKR ${Number(value).toFixed(2)}`, "Income"]}
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #14b8a6', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-teal-100 shadow-md">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-white">
            <CardTitle className="text-gray-900">Profit by Test Type</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeByTestType}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="testType" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    formatter={(value, name) => [
                      `LKR ${Number(value).toFixed(2)}`,
                      name === "income" ? "Income" : name === "cost" ? "Cost" : "Profit",
                    ]}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #14b8a6', borderRadius: '8px' }}
                  />
                  <Bar dataKey="income" fill="#14b8a6" radius={[4, 4, 0, 0]} name="income" />
                  <Bar dataKey="cost" fill="#ef4444" radius={[4, 4, 0, 0]} name="cost" />
                  <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} name="profit" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-teal-100 shadow-md">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-white">
            <CardTitle className="text-gray-900">Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {filteredInvoices.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No invoices found for the selected period.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700 border-b-2 border-teal-500 pb-3">
                    <div className="col-span-2">Invoice ID</div>
                    <div className="col-span-3">Patient</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2">Amount</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-1">Tests</div>
                  </div>
                  {filteredInvoices.slice(0, 10).map((invoice) => (
                    <div 
                      key={invoice.id} 
                      className="grid grid-cols-12 gap-4 text-sm py-3 hover:bg-teal-50 rounded-lg transition-colors duration-200 px-2"
                    >
                      <div className="col-span-2 font-semibold text-teal-700">{invoice.id}</div>
                      <div className="col-span-3 text-gray-700">{invoice.patientName}</div>
                      <div className="col-span-2 text-gray-600">{new Date(invoice.createdAt).toLocaleDateString()}</div>
                      <div className="col-span-2 font-semibold text-gray-900">LKR {invoice.grandTotal.toFixed(2)}</div>
                      <div className="col-span-2">
                        <Badge
                          className={
                            invoice.status === "Paid"
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                              : invoice.status === "Partial"
                                ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </div>
                      <div className="col-span-1 text-gray-700">{invoice.lineItems.length}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}