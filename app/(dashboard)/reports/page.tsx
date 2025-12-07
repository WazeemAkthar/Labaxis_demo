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
  Activity,
  FileText,
  Trash2,
  User,
  Stethoscope,
} from "lucide-react";
import { DataManager, type Report } from "@/lib/data-manager";
import { useAuth } from "@/components/auth-provider";
import Link from "next/link";

export default function ReportsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDeleteReport = async (reportId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this report? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const dataManager = DataManager.getInstance();
      await dataManager.deleteReport(reportId);

      // Update local state after successful deletion
      setReports(reports.filter((report) => report.id !== reportId));
      setFilteredReports(
        filteredReports.filter((report) => report.id !== reportId)
      );
    } catch (error) {
      console.error("Error deleting report:", error);
      alert("Failed to delete report. Please try again.");
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/");
      return;
    }

    async function loadReports() {
      const dataManager = DataManager.getInstance();
      const reportsData = await dataManager.getReports();
      setReports(reportsData);
      setFilteredReports(reportsData);
      setLoading(false);
    }

    loadReports();
  }, [user, authLoading, router]);

  useEffect(() => {
    const filtered = reports.filter(
      (report) =>
        report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.invoiceId ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    setFilteredReports(filtered);
  }, [searchTerm, reports]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-teal-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-teal-900">Reports</h1>
            <p className="text-teal-700 mt-1">
              Manage laboratory test reports and results
            </p>
          </div>
          <Button
            asChild
            className="bg-teal-600 hover:bg-teal-700 text-white shadow-md"
          >
            <Link href="/reports/new">
              <Plus className="h-4 w-4 mr-2" />
              Generate Report
            </Link>
          </Button>
        </div>

        {/* <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-teal-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-teal-700">
                    Total Reports
                  </p>
                  <p className="text-3xl font-bold text-teal-900 mt-2">
                    {filteredReports.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-cyan-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-cyan-700">
                    This Month
                  </p>
                  <p className="text-3xl font-bold text-cyan-900 mt-2">
                    {
                      filteredReports.filter((report) => {
                        const reportDate = new Date(report.createdAt);
                        const now = new Date();
                        return (
                          reportDate.getMonth() === now.getMonth() &&
                          reportDate.getFullYear() === now.getFullYear()
                        );
                      }).length
                    }
                  </p>
                </div>
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-cyan-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">
                    Tests Completed
                  </p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">
                    {filteredReports.reduce(
                      (sum, report) => sum + report.results.length,
                      0
                    )}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div> */}

        <div className="border-teal-200 shadow-sm">
          <div className="p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-600" />
                <Input
                  placeholder="Search by report ID, patient name, or invoice ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="border-teal-300 text-teal-700 hover:bg-teal-50"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {filteredReports.length === 0 ? (
            <div className="col-span-full">
              <Card className="border-teal-200">
                <CardContent className="p-12 text-center">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-teal-400" />
                  <h3 className="text-lg font-semibold mb-2 text-teal-900">
                    No reports found
                  </h3>
                  <p className="text-teal-700 mb-4">
                    {searchTerm
                      ? "No reports match your search criteria."
                      : "Get started by generating your first report."}
                  </p>
                  <Button
                    asChild
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    <Link href="/reports/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Generate Report
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredReports.map((report) => (
              <Card
                key={report.id}
                className="border-2 border-teal-200 hover:border-teal-400 hover:shadow-lg transition-all duration-200 overflow-hidden py-0 flex flex-col justify-between"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg">
                        {report.id}
                      </h3>
                      {/* <div className="flex items-center gap-2 mt-1 text-teal-50">
                        <User className="h-3 w-3" />
                        <span className="text-sm font-medium">
                          {report.patientName}
                        </span>
                      </div> */}
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
                      <span className="text-xs font-semibold text-white">
                        {report.results.length > 0 &&
                          `${report.results[0].testCode} - `}
                        {report.results.length} Tests
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <CardContent className="p-4 space-y-3">
                  {/* Patient & Invoice Info */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-teal-700">
                      <User className="h-3 w-3" />
                      <span className="font-medium">Patient Name:</span>
                      <span className="text-teal-900">{report.patientName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-teal-700">
                      <User className="h-3 w-3" />
                      <span className="font-medium">Patient ID:</span>
                      <span className="text-teal-900">{report.patientId}</span>
                    </div>
                    {/* <div className="flex items-center gap-2 text-sm text-teal-700">
                      <span className="font-medium">Invoice:</span>
                      <span className="text-teal-900">{report.invoiceId}</span>
                    </div> */}
                    <div className="flex items-center gap-2 text-sm text-teal-700">
                      <Stethoscope className="h-3 w-3" />
                      <span className="text-teal-900">{report.reviewedBy}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-teal-700">
                      <Calendar className="h-3 w-3" />
                      <span className="text-teal-900">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Test Badges */}
                  <div className="pt-2 border-t border-teal-100">
                    <p className="text-xs font-semibold text-teal-700 mb-2">
                      Tests Included:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {report.results.slice(0, 4).map((result, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="bg-cyan-50 border-cyan-200 text-xs text-cyan-700"
                        >
                          {result.testName}
                        </Badge>
                      ))}
                      {report.results.length > 4 && (
                        <Badge
                          variant="outline"
                          className="bg-teal-50 border-teal-200 text-xs text-teal-700"
                        >
                          +{report.results.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>

                {/* Card Footer */}
                <div className="p-4 bg-teal-50 border-t border-teal-100 flex items-center gap-2">
                  <Button
                    asChild
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    <Link href={`/reports/${report.id}`}>View Report</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteReport(report.id)}
                    className="border-2 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
