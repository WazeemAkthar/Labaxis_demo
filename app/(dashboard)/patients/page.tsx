"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

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
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, patients]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatients = filteredPatients.slice(startIndex, endIndex);

  // Pagination handlers
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Patients</h1>
            <p className="text-slate-600 mt-1">
              Manage patient records and information
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-teal-200 hover:bg-teal-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Import Patients
            </Button>
            <Button
              asChild
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Link href="/patients/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Patient
              </Link>
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-slate-200"
          />
        </div>

        {/* Table Section */}
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="font-semibold text-slate-700">PATIENT</TableHead>
                  <TableHead className="font-semibold text-slate-700">NAME</TableHead>
                  <TableHead className="font-semibold text-slate-700">CODE</TableHead>
                  <TableHead className="font-semibold text-slate-700">GENDER</TableHead>
                  <TableHead className="font-semibold text-slate-700">PHONE</TableHead>
                  <TableHead className="font-semibold text-slate-700">EMAIL</TableHead>
                  <TableHead className="font-semibold text-slate-700">DOCTOR</TableHead>
                  <TableHead className="font-semibold text-slate-700">CREATED ON</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">ACTION</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-slate-500">
                      {searchTerm
                        ? "No patients match your search criteria."
                        : "No patients found. Get started by adding your first patient."}
                    </TableCell>
                  </TableRow>
                ) : (
                  currentPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium text-slate-700">
                        {patient.id}
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">
                        {patient.firstName} {patient.lastName}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className="bg-teal-50 text-teal-700 border-teal-200 font-normal"
                        >
                          {patient.id.substring(0, 8)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`font-normal ${
                            patient.gender === "Male"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : patient.gender === "Female"
                              ? "bg-pink-50 text-pink-700 border-pink-200"
                              : "bg-purple-50 text-purple-700 border-purple-200"
                          }`}
                          variant="outline"
                        >
                          {patient.gender}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">{patient.phone}</TableCell>
                      <TableCell className="text-slate-600">{patient.email}</TableCell>
                      <TableCell className="text-slate-600">Dr. {patient.doctorName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-normal">
                          {new Date(patient.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                          >
                            <Link href={`/patients/${patient.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          >
                            <Link href={`/patients/${patient.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletePatient(patient.id)}
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination and Summary */}
        {filteredPatients.length > 0 && (
          <div className="flex items-center justify-between">
            {/* Left side - Records info */}
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <span>Records per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-slate-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div>
                <span className="font-medium">{startIndex + 1}</span>-
                <span className="font-medium">{Math.min(endIndex, filteredPatients.length)}</span> of{" "}
                <span className="font-medium">{filteredPatients.length}</span>
              </div>
            </div>

            {/* Center - Statistics */}
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-700">{filteredPatients.length}</span>
                <span>Total</span>
              </div>
              <div className="h-4 w-px bg-slate-300"></div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-blue-600">{maleCount}</span>
                <span>Male</span>
              </div>
              <div className="h-4 w-px bg-slate-300"></div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-pink-600">{femaleCount}</span>
                <span>Female</span>
              </div>
            </div>

            {/* Right side - Pagination controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className="h-8 w-8 disabled:opacity-50"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="h-8 w-8 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm text-slate-600 px-2">
                Page <span className="font-medium">{currentPage}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="h-8 w-8 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                className="h-8 w-8 disabled:opacity-50"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}