"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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

    const dataManager = DataManager.getInstance()
    const patientsData = dataManager.getPatients()
    setPatients(patientsData)
    setFilteredPatients(patientsData)
    setLoading(false)
  }, [router])

  useEffect(() => {
    const filtered = patients.filter(
      (patient) =>
        patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPatients(filtered)
  }, [searchTerm, patients])

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-200 border-t-teal-600"></div>
      </div>
    )
  }

  const maleCount = filteredPatients.filter((p) => p.gender === "Male").length
  const femaleCount = filteredPatients.filter((p) => p.gender === "Female").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-teal-100">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Patients
            </h1>
            <p className="text-slate-600 mt-1">Manage patient records and information</p>
          </div>
          <Button 
            asChild 
            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg shadow-teal-200"
          >
            <Link href="/patients/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Patient
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="border-teal-100 shadow-md bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-teal-500" />
                <Input
                  placeholder="Search by ID, name, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 h-12 border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-12 w-12 border-teal-200 hover:bg-teal-50 hover:border-teal-400"
              >
                <Filter className="h-5 w-5 text-teal-600" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Patients List */}
        <div className="grid gap-4">
          {filteredPatients.length === 0 ? (
            <Card className="border-teal-100 shadow-md bg-white/90 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-800">No patients found</h3>
                <p className="text-slate-600 mb-6">
                  {searchTerm ? "No patients match your search criteria." : "Get started by adding your first patient."}
                </p>
                <Button 
                  asChild
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
                >
                  <Link href="/patients/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Patient
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredPatients.map((patient) => (
              <Card 
                key={patient.id} 
                className="hover:shadow-xl transition-all duration-300 border-teal-100 bg-white/90 backdrop-blur-sm hover:border-teal-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-teal-200">
                        <User className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-slate-800">
                          {patient.firstName} {patient.lastName}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-slate-600 mt-1">
                          <span className="font-medium text-teal-600">{patient.id}</span>
                          <span className="text-slate-400">•</span>
                          <span>{patient.age} years old</span>
                          <span className="text-slate-400">•</span>
                          <Badge 
                            variant="secondary" 
                            className="bg-teal-100 text-teal-700 hover:bg-teal-200"
                          >
                            {patient.gender}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600 mt-1">
                          <span>{patient.phone}</span>
                          <span className="text-slate-400">•</span>
                          <span>{patient.email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm text-slate-600">
                        <div className="flex items-center gap-2 justify-end text-teal-600">
                          <Calendar className="h-4 w-4" />
                          {new Date(patient.createdAt).toLocaleDateString()}
                        </div>
                        <div className="mt-1 font-medium">Dr. {patient.doctorName}</div>
                      </div>
                      <Button 
                        asChild 
                        variant="outline"
                        className="border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-400"
                      >
                        <Link href={`/patients/${patient.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Summary Stats */}
        {filteredPatients.length > 0 && (
          <Card className="border-teal-100 shadow-md bg-white/90 backdrop-blur-sm">
            <CardHeader className="border-b border-teal-100">
              <CardTitle className="text-xl text-slate-800">Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg border border-teal-100">
                  <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    {filteredPatients.length}
                  </div>
                  <div className="text-sm text-slate-600 mt-1 font-medium">
                    {searchTerm ? "Matching Patients" : "Total Patients"}
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {maleCount}
                  </div>
                  <div className="text-sm text-slate-600 mt-1 font-medium">Male</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg border border-pink-100">
                  <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                    {femaleCount}
                  </div>
                  <div className="text-sm text-slate-600 mt-1 font-medium">Female</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}