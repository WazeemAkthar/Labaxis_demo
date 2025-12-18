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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [dateFilter, setDateFilter] = useState<
    "all" | "today" | "week" | "month" | "custom"
  >("all");
  const [customDateRange, setCustomDateRange] = useState({
    start: "",
    end: "",
  });
  const [showDateFilter, setShowDateFilter] = useState(false);

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

  const filterByDate = (reports: Report[]) => {
    if (dateFilter === "all") return reports;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return reports.filter((report) => {
      const reportDate = new Date(report.createdAt);

      switch (dateFilter) {
        case "today":
          const reportDay = new Date(
            reportDate.getFullYear(),
            reportDate.getMonth(),
            reportDate.getDate()
          );
          return reportDay.getTime() === today.getTime();

        case "week":
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return reportDate >= weekAgo;

        case "month":
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return reportDate >= monthAgo;

        case "custom":
          if (!customDateRange.start && !customDateRange.end) return true;
          const start = customDateRange.start
            ? new Date(customDateRange.start)
            : new Date(0);
          const end = customDateRange.end
            ? new Date(customDateRange.end)
            : new Date();
          end.setHours(23, 59, 59, 999); // Include the entire end date
          return reportDate >= start && reportDate <= end;

        default:
          return true;
      }
    });
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
    const searchFiltered = reports.filter(
      (report) =>
        report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.invoiceId ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

    const dateFiltered = filterByDate(searchFiltered);
    setFilteredReports(dateFiltered);
    setCurrentPage(1);
  }, [searchTerm, reports, dateFilter, customDateRange]);

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = filteredReports.slice(startIndex, endIndex);

  // Pagination handlers
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

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

        <div className="space-y-4">
          {/* Search and Filter Bar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-600" />
              <Input
                placeholder="Search by report ID, patient name, or invoice ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-teal-200 focus:border-teal-500 focus:ring-teal-500 bg-white"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowDateFilter(!showDateFilter)}
              className={`border-teal-300 text-teal-700 hover:bg-teal-50 ${
                dateFilter !== "all" ? "bg-teal-50 border-teal-500" : ""
              }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter by Date
            </Button>
          </div>

          {/* Date Filter Panel */}
          {showDateFilter && (
            <Card className="border-teal-200 shadow-sm bg-white">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      variant={dateFilter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDateFilter("all")}
                      className={
                        dateFilter === "all"
                          ? "bg-teal-600 hover:bg-teal-700"
                          : "border-teal-200 hover:bg-teal-50"
                      }
                    >
                      All Time
                    </Button>
                    <Button
                      variant={dateFilter === "today" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDateFilter("today")}
                      className={
                        dateFilter === "today"
                          ? "bg-teal-600 hover:bg-teal-700"
                          : "border-teal-200 hover:bg-teal-50"
                      }
                    >
                      Today
                    </Button>
                    <Button
                      variant={dateFilter === "week" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDateFilter("week")}
                      className={
                        dateFilter === "week"
                          ? "bg-teal-600 hover:bg-teal-700"
                          : "border-teal-200 hover:bg-teal-50"
                      }
                    >
                      Last 7 Days
                    </Button>
                    <Button
                      variant={dateFilter === "month" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDateFilter("month")}
                      className={
                        dateFilter === "month"
                          ? "bg-teal-600 hover:bg-teal-700"
                          : "border-teal-200 hover:bg-teal-50"
                      }
                    >
                      Last 30 Days
                    </Button>
                    <Button
                      variant={dateFilter === "custom" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDateFilter("custom")}
                      className={
                        dateFilter === "custom"
                          ? "bg-teal-600 hover:bg-teal-700"
                          : "border-teal-200 hover:bg-teal-50"
                      }
                    >
                      Custom Range
                    </Button>
                  </div>

                  {dateFilter === "custom" && (
                    <div className="flex items-center gap-3 pt-2 border-t border-teal-100">
                      <div className="flex-1">
                        <label className="text-sm font-medium text-slate-700 mb-1 block">
                          Start Date
                        </label>
                        <Input
                          type="date"
                          value={customDateRange.start}
                          onChange={(e) =>
                            setCustomDateRange({
                              ...customDateRange,
                              start: e.target.value,
                            })
                          }
                          className="border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-sm font-medium text-slate-700 mb-1 block">
                          End Date
                        </label>
                        <Input
                          type="date"
                          value={customDateRange.end}
                          onChange={(e) =>
                            setCustomDateRange({
                              ...customDateRange,
                              end: e.target.value,
                            })
                          }
                          className="border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCustomDateRange({ start: "", end: "" });
                          setDateFilter("all");
                        }}
                        className="mt-6 border-red-200 text-red-600 hover:bg-red-50"
                      >
                        Clear
                      </Button>
                    </div>
                  )}

                  {dateFilter !== "all" && (
                    <div className="flex items-center justify-between pt-2 border-t border-teal-100">
                      <p className="text-sm text-slate-600">
                        Showing{" "}
                        <span className="font-medium text-teal-700">
                          {filteredReports.length}
                        </span>{" "}
                        reports
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDateFilter("all");
                          setCustomDateRange({ start: "", end: "" });
                        }}
                        className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                      >
                        Reset Filter
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="border-slate-200 shadow-sm bg-white">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="font-semibold text-slate-700">
                    REPORT ID
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    PATIENT NAME
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    PATIENT ID
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    INVOICE ID
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    REVIEWED BY
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    TESTS
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    DATE
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">
                    ACTION
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentReports.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-12 text-slate-500"
                    >
                      {searchTerm
                        ? "No reports match your search criteria."
                        : "No reports found. Get started by generating your first report."}
                    </TableCell>
                  </TableRow>
                ) : (
                  currentReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium text-teal-700">
                        {report.id}
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">
                        {report.patientName}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-teal-50 text-teal-700 border-teal-200 font-normal"
                        >
                          {report.patientId}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {report.invoiceId || "-"}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        Dr. {report.reviewedBy}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {report.results.length > 0 && (
                            <>
                              <Badge
                                variant="outline"
                                className="bg-cyan-50 border-cyan-200 text-xs text-cyan-700"
                              >
                                {report.results[0].testCode}
                              </Badge>
                              {/* {report.results.length > 1 && (
          <span className="text-xs text-slate-600">
            +{report.results.length - 1} more
          </span>
        )} */}
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200 font-normal"
                        >
                          {new Date(report.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                            title="View Report"
                          >
                            <Link href={`/reports/${report.id}`}>
                              <FileText className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            title="Edit Report"
                          >
                            <Link href={`/reports/${report.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteReport(report.id)}
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Delete Report"
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

        {/* Pagination */}
        {filteredReports.length > 0 && (
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
                <span className="font-medium">
                  {Math.min(endIndex, filteredReports.length)}
                </span>{" "}
                of <span className="font-medium">{filteredReports.length}</span>
              </div>
            </div>

            {/* Center - Statistics */}
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-700">
                  {filteredReports.length}
                </span>
                <span>Total Reports</span>
              </div>
              <div className="h-4 w-px bg-slate-300"></div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-teal-600">
                  {filteredReports.reduce(
                    (sum, report) => sum + report.results.length,
                    0
                  )}
                </span>
                <span>Tests Completed</span>
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
