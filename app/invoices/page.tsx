"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, Calendar, FileText, DollarSign } from "lucide-react"
import { DataManager, type Invoice } from "@/lib/data-manager"
import Link from "next/link"

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
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
    setFilteredInvoices(invoicesData)
    setLoading(false)
  }, [])

  useEffect(() => {
    // Filter invoices based on search term
    const filtered = invoices.filter(
      (invoice) =>
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.patientId.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredInvoices(filtered)
  }, [searchTerm, invoices])

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0)
  const paidInvoices = filteredInvoices.filter((inv) => inv.status === "Paid")
  const unpaidInvoices = filteredInvoices.filter((inv) => inv.status === "Unpaid")

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Invoices</h1>
            <p className="text-muted-foreground">Manage test invoices and billing</p>
          </div>
          <Link href="/invoices/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredInvoices.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid</CardTitle>
              <Badge variant="default" className="h-4 w-4 rounded-full p-0"></Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paidInvoices.length}</div>
              <p className="text-xs text-muted-foreground">
                ${paidInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0).toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
              <Badge variant="secondary" className="h-4 w-4 rounded-full p-0"></Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unpaidInvoices.length}</div>
              <p className="text-xs text-muted-foreground">
                ${unpaidInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0).toFixed(2)}
              </p>
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
                  placeholder="Search by invoice ID, patient name, or patient ID..."
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

        {/* Invoices list */}
        <div className="grid gap-4">
          {filteredInvoices.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No invoices found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm
                    ? "No invoices match your search criteria."
                    : "Get started by creating your first invoice."}
                </p>
                <Link href="/invoices/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Invoice
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filteredInvoices.map((invoice) => (
              <Card key={invoice.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{invoice.id}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{invoice.patientName}</span>
                          <span>•</span>
                          <span>{invoice.patientId}</span>
                          <span>•</span>
                          <span>{invoice.lineItems.length} tests</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(invoice.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold">${invoice.grandTotal.toFixed(2)}</div>
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
                      <Link href={`/invoices/${invoice.id}`}>
                        <Button variant="outline">View Details</Button>
                      </Link>
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
