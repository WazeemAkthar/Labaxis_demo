"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Calendar,
  FileText,
  Activity,
  Clock,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { DataManager, type Report } from "@/lib/data-manager";
import Link from "next/link";

interface UserReport {
  id: string;
  patientName: string;
  createdAt: string;
  resultsCount: number;
  lastModifiedAt?: string;
}

interface UserActivity {
  type: "created" | "modified";
  reportId: string;
  patientName: string;
  timestamp: string;
}

export default function UsersPage() {
  const { user, loading: authLoading } = useAuth();
  const [myReports, setMyReports] = useState<UserReport[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"reports" | "activity">("reports");
  const [stats, setStats] = useState({
    totalReports: 0,
    reportsCreated: 0,
    reportsModified: 0,
    lastActivity: "",
  });

  useEffect(() => {
    if (authLoading || !user) return;

    async function loadUserData() {
      try {
        const dataManager = DataManager.getInstance();
        
        // Get all reports to analyze
        const allReportsData = await dataManager.getReports();

        // Filter reports created by current user
        const userCreatedReports = allReportsData.filter(
          (report: any) => report.createdByUserEmail === user!.email
        );

        // Filter reports modified by current user
        const userModifiedReports = allReportsData.filter(
          (report: any) =>
            report.lastModifiedByUserEmail === user!.email &&
            report.createdByUserEmail !== user!.email
        );

        // Format reports for display
        const formattedReports: UserReport[] = userCreatedReports.map((report: any) => ({
          id: report.id,
          patientName: report.patientName,
          createdAt: report.createdAt,
          resultsCount: report.results?.length || 0,
          lastModifiedAt: report.lastModifiedAt,
        }));

        setMyReports(formattedReports);

        // Build activity log
        const activityLog: UserActivity[] = [];

        // Add created reports to activity
        userCreatedReports.forEach((report: any) => {
          activityLog.push({
            type: "created",
            reportId: report.id,
            patientName: report.patientName,
            timestamp: report.createdAt,
          });
        });

        // Add modified reports to activity
        userModifiedReports.forEach((report: any) => {
          if (report.lastModifiedAt) {
            activityLog.push({
              type: "modified",
              reportId: report.id,
              patientName: report.patientName,
              timestamp: report.lastModifiedAt,
            });
          }
        });

        // Sort by timestamp (newest first)
        activityLog.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        setActivities(activityLog);

        // Calculate stats
        const lastActivityTimestamp =
          activityLog.length > 0 ? activityLog[0].timestamp : "";

        setStats({
          totalReports: allReportsData.length,
          reportsCreated: userCreatedReports.length,
          reportsModified: userModifiedReports.length,
          lastActivity: lastActivityTimestamp,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error loading user data:", error);
        setLoading(false);
      }
    }

    loadUserData();
  }, [user, authLoading]);

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRelativeTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDateTime(isoString);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Please log in to view this page</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <User className="h-8 w-8" />
          User Profile & Activity
        </h1>
        <p className="text-muted-foreground mt-1">
          View your account details and activity logs
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReports}</div>
            <p className="text-xs text-muted-foreground">In system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Created</CardTitle>
            <Activity className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">
              {stats.reportsCreated}
            </div>
            <p className="text-xs text-muted-foreground">Reports created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modified</CardTitle>
            <Activity className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {stats.reportsModified}
            </div>
            <p className="text-xs text-muted-foreground">Reports modified</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">
              {stats.lastActivity ? getRelativeTime(stats.lastActivity) : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Most recent action</p>
          </CardContent>
        </Card>
      </div>

      {/* User Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Display Name
                </p>
                <p className="text-base font-semibold">
                  {user.displayName || "Not set"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Mail className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email Address
                </p>
                <p className="text-base font-semibold">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Calendar className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Account Created
                </p>
                <p className="text-base font-semibold">
                  {user.metadata?.creationTime
                    ? formatDateTime(user.metadata.creationTime)
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Last Sign In
                </p>
                <p className="text-base font-semibold">
                  {user.metadata?.lastSignInTime
                    ? formatDateTime(user.metadata.lastSignInTime)
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Reports and Activity */}
      <div className="space-y-4">
        {/* Tab Buttons */}
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "reports"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            My Reports ({stats.reportsCreated})
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "activity"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Activity Log
          </button>
        </div>

        {/* My Reports Tab */}
        {activeTab === "reports" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Reports Created by You
              </CardTitle>
            </CardHeader>
            <CardContent>
              {myReports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>You haven't created any reports yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myReports.map((report) => (
                    <Link
                      key={report.id}
                      href={`/reports/${report.id}`}
                      className="block"
                    >
                      <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-slate-50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="font-mono">
                              {report.id}
                            </Badge>
                            <h3 className="font-semibold">
                              {report.patientName}
                            </h3>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDateTime(report.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {report.resultsCount} tests
                            </span>
                            {report.lastModifiedAt && (
                              <Badge variant="secondary" className="text-xs">
                                Modified
                              </Badge>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Activity Log Tab */}
        {activeTab === "activity" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Your Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No activity recorded yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activities.map((activity, index) => (
                    <div
                      key={`${activity.reportId}-${index}`}
                      className="flex items-start gap-4 p-4 rounded-lg border"
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          activity.type === "created"
                            ? "bg-teal-100"
                            : "bg-amber-100"
                        }`}
                      >
                        {activity.type === "created" ? (
                          <FileText
                            className={`h-4 w-4 ${
                              activity.type === "created"
                                ? "text-teal-600"
                                : "text-amber-600"
                            }`}
                          />
                        ) : (
                          <Activity className="h-4 w-4 text-amber-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant={
                              activity.type === "created"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {activity.type === "created"
                              ? "Created"
                              : "Modified"}
                          </Badge>
                          <Link
                            href={`/reports/${activity.reportId}`}
                            className="font-mono text-sm hover:underline text-blue-600"
                          >
                            {activity.reportId}
                          </Link>
                        </div>
                        <p className="text-sm font-medium">
                          {activity.patientName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {getRelativeTime(activity.timestamp)} •{" "}
                          {formatDateTime(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}