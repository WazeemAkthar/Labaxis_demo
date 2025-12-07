"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Trash2,
  Mail,
  Phone,
  Stethoscope,
  FileText,
  Edit,
} from "lucide-react";
import { DataManager, type Patient } from "@/lib/data-manager";
import { useAuth } from "@/components/auth-provider";
import Link from "next/link";

export default function PatientsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDeletePatient = async (patientId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this patient? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const dataManager = DataManager.getInstance();
      await dataManager.deletePatient(patientId);

      // Update local state after successful deletion
      setPatients(patients.filter((patient) => patient.id !== patientId));
      setFilteredPatients(
        filteredPatients.filter((patient) => patient.id !== patientId)
      );
    } catch (error) {
      console.error("Error deleting patient:", error);
      alert("Failed to delete patient. Please try again.");
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/");
      return;
    }

    async function loadPatients() {
      const dataManager = DataManager.getInstance();
      const patientsData = await dataManager.getPatients();
      setPatients(patientsData);
      setFilteredPatients(patientsData);
      setLoading(false);
    }

    loadPatients();
  }, [user, authLoading, router]);

  useEffect(() => {
    const filtered = patients.filter(
      (patient) =>
        patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${patient.firstName} ${patient.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-200 border-t-teal-600"></div>
      </div>
    );
  }

  const maleCount = filteredPatients.filter((p) => p.gender === "Male").length;
  const femaleCount = filteredPatients.filter(
    (p) => p.gender === "Female"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-teal-100">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Patients
            </h1>
            <p className="text-slate-600 mt-1">
              Manage patient records and information
            </p>
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
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {filteredPatients.length === 0 ? (
            <div className="col-span-full">
              <Card className="border-teal-100 shadow-md bg-white/90 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center">
                    <User className="h-10 w-10 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-800">
                    No patients found
                  </h3>
                  <p className="text-slate-600 mb-6">
                    {searchTerm
                      ? "No patients match your search criteria."
                      : "Get started by adding your first patient."}
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
            </div>
          ) : (
            filteredPatients.map((patient) => (
              <Card
                key={patient.id}
                className="border-2 border-teal-200 hover:border-teal-400 hover:shadow-lg transition-all duration-200 overflow-hidden py-0"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">
                          {patient.firstName} {patient.lastName}
                        </h3>
                        <p className="text-teal-50 text-sm">{patient.id}</p>
                      </div>
                    </div>
                    <Badge
                      className={`${
                        patient.gender === "Male"
                          ? "bg-blue-500/20 text-white border-blue-300"
                          : patient.gender === "Female"
                          ? "bg-pink-500/20 text-white border-pink-300"
                          : "bg-purple-500/20 text-white border-purple-300"
                      }`}
                    >
                      {patient.gender}
                    </Badge>
                  </div>
                </div>

                {/* Card Body */}
                <CardContent className="p-4 space-y-3">
                  {/* Age Info */}
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-teal-600" />
                    <span className="text-slate-700">
                      <span className="font-semibold">{patient.age}</span> years
                      {patient.ageMonths && Number(patient.ageMonths) > 0 && (
                        <span className="text-slate-600">
                          {" and "}
                          {patient.ageMonths} months
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 pt-2 border-t border-teal-100">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Phone className="h-4 w-4 text-teal-600" />
                      <span>{patient.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Mail className="h-4 w-4 text-teal-600" />
                      <span className="truncate">{patient.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Stethoscope className="h-4 w-4 text-teal-600" />
                      <span className="truncate">Dr. {patient.doctorName}</span>
                    </div>
                  </div>

                  {/* Notes Section */}
                  {patient.notes && (
                    <div className="pt-2 border-t border-teal-100">
                      <div className="flex items-start gap-2 text-sm">
                        <FileText className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                        <p className="text-slate-600 line-clamp-2">
                          {patient.notes}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Registration Date */}
                  <div className="pt-2 border-t border-teal-100">
                    <p className="text-xs text-slate-500">
                      Registered:{" "}
                      {new Date(patient.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </CardContent>

                {/* Card Footer */}
                <div className="p-4 bg-teal-50 border-t border-teal-100 flex items-center gap-2">
                  <Button
                    asChild
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    <Link href={`/patients/${patient.id}`}>View Details</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="icon"
                    className="border-2 border-amber-300 text-amber-600 hover:bg-amber-50"
                  >
                    <Link href={`/patients/${patient.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeletePatient(patient.id)}
                    className="border-2 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
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
                  <div className="text-sm text-slate-600 mt-1 font-medium">
                    Male
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg border border-pink-100">
                  <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                    {femaleCount}
                  </div>
                  <div className="text-sm text-slate-600 mt-1 font-medium">
                    Female
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
