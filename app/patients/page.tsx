"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, Calendar, User } from "lucide-react"
import { DataManager, type Patient } from "@/lib/data-manager"
import Link from "next/link"

export default function PatientsPage() {
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const authStatus = localStorage.getItem("lablite_auth")
    if (authStatus !== "authenticated") {
      router.push("/")
      return
    }
    setIsAuthenticated(true)

    // Load patients
    const dataManager = DataManager.getInstance()
    const patientsData = dataManager.getPatients()
    setPatients(patientsData)
    setFilteredPatients(patientsData)
    setLoading(false)
  }, [])

  useEffect(() => {
    // Filter patients based on search term
    const filtered = patients.filter(
      (patient) =>
        patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredPatients(filtered)
  }, [searchTerm, patients])

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
            <h1 className="text-3xl font-bold">Patients</h1>
            <p className="text-muted-foreground">Manage patient records and information</p>
          </div>
          <Button asChild>
            <Link href="/patients/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Patient
            </Link>
          </Button>
        </div>

        {/* Search and filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID, name, phone, or email..."
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

        {/* Patients list */}
        <div className="grid gap-4">
          {filteredPatients.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No patients found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "No patients match your search criteria." : "Get started by adding your first patient."}
                </p>
                <Button asChild>
                  <Link href="/patients/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Patient
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredPatients.map((patient) => (
              <Card key={patient.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {patient.firstName} {patient.lastName}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{patient.id}</span>
                          <span>•</span>
                          <span>{patient.age} years old</span>
                          <span>•</span>
                          <Badge variant="secondary">{patient.gender}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>{patient.phone}</span>
                          <span>•</span>
                          <span>{patient.email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(patient.createdAt).toLocaleDateString()}
                        </div>
                        <div className="mt-1">Dr. {patient.doctorName}</div>
                      </div>
                      <Button asChild variant="outline">
                        <Link href={`/patients/${patient.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Summary stats */}
        {filteredPatients.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold">{filteredPatients.length}</div>
                  <div className="text-sm text-muted-foreground">
                    {searchTerm ? "Matching Patients" : "Total Patients"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{filteredPatients.filter((p) => p.gender === "Male").length}</div>
                  <div className="text-sm text-muted-foreground">Male</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {filteredPatients.filter((p) => p.gender === "Female").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Female</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
