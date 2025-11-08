"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, Printer as Print, Edit } from "lucide-react";
import { DataManager, type Report } from "@/lib/data-manager";
import { generateReportPDF } from "@/lib/pdf-generator";
import { useAuth } from "@/components/auth-provider";
import Link from "next/link";
import ReportQRCode from "@/components/ReportQRCode";
import TestAdditionalDetails from "@/components/TestAdditionalDetails";
import { OGTTGraph } from "@/components/ogtt-graph";

export default function ReportDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const reportId = params.id as string;

  const [report, setReport] = useState<Report | null>(null);
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/");
      return;
    }

    // Load report data
    async function loadReportData() {
      const dataManager = DataManager.getInstance();
      const allReports = await dataManager.getReports();
      const reportData = allReports.find((rep) => rep.id === reportId);

      if (!reportData) {
        // Report not found, redirect to reports list
        router.push("/reports");
        return;
      }

      setReport(reportData);

      // Get patient data
      const patientData = await dataManager.getPatientById(reportData.patientId);
      setPatient(patientData);

      setLoading(false);
    }

    loadReportData();
  }, [reportId, user, authLoading, router]);

  const handlePrint = () => {
    // Get the report content element
    const reportContent = document.querySelector(".print-content");

    if (!reportContent) {
      console.error("Report content not found");
      return;
    }

    // Create a new window for printing
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      console.error("Could not open print window");
      return;
    }

    // Get the styles from the current document
    const styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join("");
        } catch (e) {
          console.log("Cannot access stylesheet");
          return "";
        }
      })
      .join("");

    // Write the HTML content to the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Lab Report - ${report?.id ?? ""}</title>
        <style>
          ${styles}
          /* Additional print-specific styles */
        @media print {
          body { 
            font-size: 8px; 
            font-family: Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          @page { 
            margin: 15px; 
            size: A4;
          }
          
          /* Your existing print styles here - copy from the <style jsx global> block */
          /* Hide header for print - letterhead will be used */
          [class*="CardHeader"] {
            display: none !important;
          }
          header {
            display: none !important;
          }
          .display {
            display: none !important;
          }
          
          /* Remove main card border and shadow */
          .print\\:shadow-none {
            box-shadow: none !important;
            border: none !important;
          }
          
          /* All your other existing print styles... */
        }
      </style>
    </head>
    <body>
      ${reportContent.innerHTML}
    </body>
    </html>
  `);

    printWindow.document.close();

    // Wait for content to load, then print
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  const handleDownloadPDF = async () => {
    if (!report) return;

    try {
      // Get patient data for the PDF
      const dataManager = DataManager.getInstance();
      const patient = await dataManager.getPatientById(report.patientId);

      if (!patient) {
        alert("Patient information not found");
        return;
      }

      // Generate and download PDF
      await generateReportPDF(report, patient);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  const renderTestResults = (results: any[]) => {
    // Group results by test type
    const groupedResults = results.reduce((groups, result) => {
      const testCode = result.testCode;
      if (!groups[testCode]) {
        groups[testCode] = [];
      }
      groups[testCode].push(result);
      return groups;
    }, {} as Record<string, any[]>);

    return (
      <div className="space-y-6">
        {Object.entries(groupedResults).map(([testCode, testResults]) => {
          const resultsArray = testResults as any[];
          if (testCode === "FBC") {
            return <div key={testCode}>{renderFBCResults(resultsArray)}</div>;
          } else if (testCode === "UFR") {
            return <div key={testCode}>{renderUFRResults(resultsArray)}</div>;
          } else {
            return (
              <div key={testCode}>
                {renderRegularTestResults(testCode, resultsArray)}
                <div className="mt-[5rem]">
                  <TestAdditionalDetails testCode={testCode} />
                </div>
              </div>
            );
          }
        })}
      </div>
    );
  };

  const renderFBCResults = (fbcResults: any[]) => {
    // Categorize the FBC results
    const mainParams = fbcResults.filter((result) =>
      [
        "Hemoglobin",
        "RBC",
        "PCV",
        "MCV",
        "MCH",
        "MCHC",
        "RDW-CV",
        "Platelets",
        "WBC",
      ].includes(result.testName)
    );

    const differentialCount = fbcResults.filter((result) =>
      [
        "Neutrophils",
        "Lymphocytes",
        "Eosinophils",
        "Monocytes",
        "Basophils",
      ].includes(result.testName)
    );

    const absoluteCount = fbcResults.filter((result) =>
      [
        "Neutrophils (Abs)",
        "Lymphocytes (Abs)",
        "Eosinophils (Abs)",
        "Monocytes (Abs)",
        "Basophils (Abs)",
      ].includes(result.testName)
    );

    const renderTable = (results: any[], title?: string) => (
      <div className="mb-6">
        {title && (
          <h4 className="font-semibold text-xl text-left text-muted-foreground mb-3 underline">
            {title}
          </h4>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className=" border-collapse border-t-2 border-b-2 border-gray-900">
                <th className="text-left font-semibold">Parameter</th>
                <th className="text-right font-semibold">Result</th>
                <th className="text-right font-semibold">Units</th>
                <th className="text-right font-semibold">Reference Range</th>
                <th className="text-center font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => {
                const status = checkValueStatus(
                  result.value,
                  result.referenceRange
                );
                const getStatusDisplay = (status: string) => {
                  if (status === "low")
                    return { text: "L", variant: "destructive" as const };
                  if (status === "high")
                    return { text: "H", variant: "destructive" as const };
                  return { text: "", variant: "default" as const };
                };
                const statusDisplay = getStatusDisplay(status);

                return (
                  <tr key={index} className="border-0 font-mono p-0 table-row">
                    <td className="py-0 font-mono">{result.testName}</td>
                    <td className="text-right py-0 font-mono">
                      {result.value}
                    </td>
                    <td className="text-right py-0 font-mono">{result.unit}</td>
                    <td className="text-right py-0 font-mono">
                      {result.referenceRange}
                    </td>
                    <td className="text-center py-0 font-mono">
                      {statusDisplay.text && (
                        <Badge
                          variant={statusDisplay.variant}
                          className="text-xs font-bold px-1 py-0 min-h-0 h-4"
                        >
                          {statusDisplay.text}
                        </Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );

    return (
      <div key="FBC" className="border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Badge variant="outline" className="text-lg px-3 py-1">
            FBC
          </Badge>
          <span className="font-semibold text-lg">Full Blood Count</span>
        </div>

        {mainParams.length > 0 && renderTable(mainParams)}
        {mainParams.length > 0 && differentialCount.length > 0 && (
          <hr className="my-4 border-gray-200" />
        )}
        {differentialCount.length > 0 &&
          renderTable(differentialCount, "Differential Count")}
        {differentialCount.length > 0 && absoluteCount.length > 0 && (
          <hr className="my-4 border-gray-200" />
        )}
        {absoluteCount.length > 0 &&
          renderTable(absoluteCount, "Absolute Count")}
      </div>
    );
  };

  const renderUFRResults = (ufrResults: any[]) => {
    const physicalChemical = ufrResults.filter((result) =>
      [
        "Colour",
        "Appearance",
        "PH",
        "Specific Gravity",
        "Protein(Albumin)",
        "Sugar(Reducing substances)",
        "Urobilinogen",
        "Bile",
        "Acetone/KB",
      ].includes(result.testName)
    );

    const microscopic = ufrResults.filter((result) =>
      [
        "Epithelial cells",
        "Pus cells",
        "Red cells",
        "Crystals",
        "Casts",
        "Organisms",
        "Others",
      ].includes(result.testName)
    );

    const renderTable = (results: any[], title?: string) => (
      <div className="mb-6">
        {title && (
          <h4 className="font-semibold text-xl text-left text-muted-foreground mb-3 underline">
            {title}
          </h4>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-collapse border-t-2 border-b-2 border-gray-900">
                <th className="text-left font-semibold">Description</th>
                <th className="text-right font-semibold">Results</th>
                <th className="text-right font-semibold">Units</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index} className="border-0 font-mono p-0 table-row">
                  <td className="py-0 font-mono">{result.testName}</td>
                  <td className="text-right py-0 font-mono">{result.value}</td>
                  <td className="text-right py-0 font-mono">{result.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    return (
      <div key="UFR" className="border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Badge variant="outline" className="text-lg px-3 py-1">
            UFR
          </Badge>
          <span className="font-semibold text-lg">Urine Full Report</span>
        </div>

        {physicalChemical.length > 0 && renderTable(physicalChemical)}
        {physicalChemical.length > 0 && microscopic.length > 0 && (
          <hr className="my-4 border-gray-200" />
        )}
        {microscopic.length > 0 &&
          renderTable(microscopic, "Centrifuge Deposit")}
      </div>
    );
  };

  const renderRegularTestResults = (testCode: string, testResults: any[]) => {
    const dataManager = DataManager.getInstance();
    const testConfig = dataManager.getTestByCode(testCode);
    const testName = testConfig ? testConfig.name : testCode;
    const isESR = testCode === "ESR";
    const isTSH = testCode === "TSH";
    const hideReferenceRange = isESR || isTSH;

    const hasGraph = testConfig?.hasGraph || false;
    const isOGTT = testCode === "OGTT";
    if (isOGTT && hasGraph) {
      const fastingResult = testResults.find((r) =>
        r.testName.includes("Fasting")
      );
      const oneHourResult = testResults.find((r) =>
        r.testName.includes("1 Hour")
      );
      const twoHoursResult = testResults.find((r) =>
        r.testName.includes("2 Hours")
      );

      return (
        <div key={testCode} className="space-y-4">
          <h1 className="font-semibold text-xl text-center mb-3 border-black border-b-2">
            {testName}
          </h1>

       

          {/* Then show the table */}
          <table className="w-full border-collapse mt-4">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Test</th>
                <th className="text-left p-4">Value</th>
                <th className="text-left p-4">Units</th>
                <th className="text-left p-4">Reference Range</th>
              </tr>
            </thead>
            <tbody>
              {testResults.map((result, index) => {
                const displayName = result.testName.includes(" - ")
                  ? result.testName.split(" - ")[1]
                  : result.testName;
                return (
                  <tr key={`${testCode}-${index}`} className="border-b">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{displayName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-lg">
                        {result.value}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-lg">{result.unit}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-lg">
                        {result.referenceRange}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

             {/* Show the graph */}
          <OGTTGraph
            fasting={fastingResult?.value || "0"}
            afterOneHour={oneHourResult?.value || "0"}
            afterTwoHours={twoHoursResult?.value || "0"}
          />

          <div className="mt-[5rem]">
            <TestAdditionalDetails testCode={testCode} />
          </div>
        </div>
      );
    }

    return (
      <div key={testCode}>
        <h1 className="font-semibold text-xl text-center mb-3 border-black border-b-2">
          {testName}
        </h1>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">Test</th>
              <th className="text-left p-4">Value</th>
              <th className="text-left p-4">Units</th>
              {!isESR && <th className="text-left p-4">Reference Range</th>}
            </tr>
          </thead>
          <tbody>
            {testResults.map((result, index) => {
              const isQualitative = testConfig?.isQualitative || false;

              const displayName = result.testName.includes(" - ")
                ? result.testName.split(" - ")[1]
                : result.testName;
              return (
                <tr key={`${testCode}-${index}`} className="border-b">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{displayName}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-lg">
                      {result.value}
                      {isQualitative && result.comments && (
                        <span className="ml-2">({result.comments})</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-lg">{result.unit}</div>
                  </td>
                  {!hideReferenceRange && (
                    <td className="p-4">
                      <div className="font-semibold text-lg">
                        {result.referenceRange}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };
  const checkValueStatus = (value: string, referenceRange: string) => {
    // Returns 'normal', 'low', or 'high'
    if (!value || !referenceRange) return "normal";

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "normal";

    // Extract range like "12.0-16.0" or "4.0-11.0"
    const rangeMatch = referenceRange.match(/(\d+\.?\d*)-(\d+\.?\d*)/);
    if (!rangeMatch) return "normal";

    const minValue = parseFloat(rangeMatch[1]);
    const maxValue = parseFloat(rangeMatch[2]);

    if (numValue < minValue) return "low";
    if (numValue > maxValue) return "high";
    return "normal";
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary display"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Report Not Found</h1>
        <Button asChild>
          <Link href="/reports">Back to Reports</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <style jsx global>{`
        @media print {
          body {
            font-size: 8px;
            // font-family: Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .table-row {
            padding: 0px !important;
            margin: 0px !important;
          }
          .no-print {
            display: none !important;
          }
          .print-break {
            page-break-after: always;
          }
          @page {
            margin: 15px;
            size: A4;
          }

          /* Hide header for print - letterhead will be used */
          [class*="CardHeader"] {
            display: none !important;
          }
          header {
            display: none !important;
          }
          .display {
            display: none !important;
          }
          .print\\:shadow-none > div:first-child {
            display: none !important;
          }

          /* Remove main card border and shadow */
          .print\\:shadow-none {
            box-shadow: none !important;
            border: none !important;
          }

          /* Remove outer card styling */
          .max-w-4xl.mx-auto.print\\:max-w-none {
            border: none !important;
            box-shadow: none !important;
          }

          /* Remove any container borders around patient section */
          .space-y-6 {
            border: none !important;
          }

          /* Remove card content borders */
          [class*="CardContent"] {
            border: none !important;
          }

          /* Keep patient info section border as is */
          .bg-gray-50.p-4.rounded-sm.border {
            background-color: #f9fafb !important;
            padding: 6px !important;
            margin-bottom: 8px !important;
          }

          /* Section titles - reduced spacing */
          h3 {
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 2px;
            margin-top: 2px;
            color: #374151;
          }

          /* FBC Title - center it with reduced margins */
          .border.rounded-lg .flex.items-center.gap-2 {
            justify-content: center !important;
            margin-bottom: 4px !important;
            margin-top: 2px !important;
            width: 100% !important;
          }

          /* Hide the FBC badge completely - multiple selectors */
          .border.rounded-lg .flex.items-center.gap-2 > [class*="Badge"],
          .border.rounded-lg .flex.items-center.gap-2 > [class*="badge"],
          .border.rounded-lg .flex.items-center.gap-2 > *:first-child {
            display: none !important;
          }

          /* Style only the Full Blood Count text span (not the badge) */
          .border.rounded-lg
            .flex.items-center.gap-2
            > span:not([class*="badge"]):not([class*="Badge"]) {
            font-size: 16px !important;
            font-weight: 900 !important;
            text-align: center !important;
            background-color: #f3f4f6 !important;
            // padding: 6px 12px !important;
            border-radius: 3px !important;
            letter-spacing: 0.5px !important;
          }

          .border.rounded-lg
            .flex.items-center.gap-2
            > span:not([class*="badge"]):not([class*="Badge"])::after {
            content: " ( FBC )" !important;
          }

          /* Tables - larger fonts for better readability */
          table {
            font-size: 14px;
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 2px;
          }
          th,
          td {
            // padding: 3px 5px;
            // border: 1px solid #ccc;
            vertical-align: middle;
          }
          th {
            background-color: #f8f9fa !important;
            font-weight: bold !important;
            font-size: 16px !important;
            text-align: center !important;
            padding: 0px !important;
          }
          td {
            // font-size: 14px;
            font-family: Menlo, Monaco, Consolas, "Liberation Mono",
              "Courier New", monospace;
          }

          /* Proper column alignment with consistent large fonts */
          th:first-child,
          td:first-child {
            text-align: left !important;
            width: 30%;
            // font-size: 14px !important;
            padding: 0px !important;
          }
          th:nth-child(2),
          td:nth-child(2) {
            text-align: center !important;
            width: 15%;
            font-weight: bold !important;
            // font-size: 14px !important;
            padding: 0px !important;
          }
          th:nth-child(3),
          td:nth-child(3) {
            text-align: center !important;
            width: 15%;
            // font-size: 14px !important;
            padding: 0px !important;
          }
          th:nth-child(4),
          td:nth-child(4) {
            text-align: center !important;
            width: 25%;
            // font-size: 14px !important;
            padding: 0px !important;
          }
          th:nth-child(5),
          td:nth-child(5) {
            text-align: center !important;
            width: 15%;
            // font-size: 14px !important;
            padding: 0px !important;
          }

          /* Show section sub-headers with reduced margins */
          .border.rounded-lg h4 {
            display: block !important;
            font-size: 16px !important;
            font-weight: bold !important;
            margin: 2px 0 2px 0 !important;
            color: #374151 !important;
            background-color: #f3f4f6 !important;
            padding: 6px 0px !important;
            border-radius: 2px !important;
            text-align: left !important;
          }

          /* Keep the first table header, hide only the subsequent ones */
          /* Hide 2nd table header (Differential Count) */
          .border.rounded-lg .mb-6:nth-child(4) table thead {
            display: none !important;
          }

          /* Hide 3rd table header (Absolute Count) */
          .border.rounded-lg .mb-6:nth-child(6) table thead {
            display: none !important;
          }

          /* More specific targeting based on structure after title */
          .border.rounded-lg .mb-6 + hr + .mb-6 table thead,
          .border.rounded-lg .mb-6 + hr + .mb-6 + hr + .mb-6 table thead {
            display: none !important;
          }

          /* Hide the "Test Results:" heading */
          .space-y-6 > div > h3 {
            display: none !important;
          }

          /* Remove separators between sections */
          .border.rounded-lg hr {
            display: none !important;
          }

          /* Remove spacing between table sections */
          .border.rounded-lg .mb-6:not(:first-child) {
            margin-bottom: 0 !important;
          }

          /* FBC sections - remove outer border and reduce spacing */
          .border.rounded-lg {
            border: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
          }

          /* Badge styling - larger for better visibility */
          .badge,
          [class*="badge"] {
            font-size: 14px !important;
            padding: 4px 8px !important;
            background-color: #f3f4f6 !important;
            border: 1px solid #e5e7eb !important;
            color: #374151 !important;
            border-radius: 3px !important;
          }

          /* Status badges - larger and more visible */
          [class*="bg-red"],
          [class*="destructive"] {
            background-color: #ef4444 !important;
            color: #ffffff !important;
            font-size: 14px !important;
            padding: 4px 8px !important;
            font-weight: bold !important;
            border-radius: 3px !important;
          }

          /* Labels and values */
          .text-muted-foreground {
            color: #6b7280 !important;
            font-size: 8px !important;
            text: left !important;
          }
          .font-medium,
          .font-semibold {
            font-weight: bold !important;
          }

          /* Separators - minimal spacing */
          hr,
          .border-t,
          .border-b {
            border-color: #d1d5db !important;
            margin: 1px 0 !important;
          }

          /* Footer styling */
          .text-center.text-sm.text-muted-foreground {
            font-size: 8px !important;
            color: #9ca3af !important;
            margin-top: 12px !important;
            padding-top: 8px !important;
            border-top: 1px solid #e0e0e0 !important;
          }
        }
        /* OGTT Graph styles */
        .recharts-responsive-container {
          page-break-inside: avoid !important;
        }
      `}</style>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 no-print">
          <Button asChild variant="outline" size="icon">
            <Link href="/reports">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Report {report.id}</h1>
            <p className="text-muted-foreground">
              Generated on {new Date(report.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Print className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        {/* Report Content */}
        <Card className="print:shadow-none max-w-4xl mx-auto print:max-w-none print-content">
          <CardHeader className="pb-6 border-b-2 border-gray-300 display">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2 font-bold text-gray-800">
                  Azza Medical Laboratory Services
                </CardTitle>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Unique Place for all Diagnostic needs</div>
                  <div>Phone: 0752537178, 0776452417, 0753274455</div>
                  <div>Email: azzaarafath@gmail.com</div>
                </div>
              </div>
              <div className="text-right">
                <Badge
                  variant="default"
                  className="text-lg px-4 py-2 bg-gray-700 text-white font-bold"
                >
                  Laboratory Report
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 p-3">
            {/* Patient Information - match PDF section styling */}
            <div className="bg-gray-50">
              <div className="space-y-2 border-t-2 border-black">
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex">
                    <span className="text-sm text-gray-600 font-bold w-32 flex-shrink-0 text-left">
                      Patient Name
                    </span>
                    <span className="text-sm text-gray-900">
                      :&nbsp;&nbsp;&nbsp;{report.patientName}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-sm text-gray-600 font-bold w-32 flex-shrink-0 text-left">
                      Report ID
                    </span>
                    <span className="text-sm text-gray-900">
                      :&nbsp;&nbsp;&nbsp;{report.id}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex">
                    <span className="text-sm text-gray-600 font-bold w-32 flex-shrink-0 text-left">
                      Age
                    </span>
                    <span className="text-sm text-gray-900">
                      :&nbsp;&nbsp;&nbsp;{patient?.age} years
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-sm text-gray-600 font-bold w-32 flex-shrink-0 text-left">
                      Patient ID
                    </span>
                    <span className="text-sm text-gray-900">
                      :&nbsp;&nbsp;&nbsp;{report.patientId}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex">
                    <span className="text-sm text-gray-600 font-bold w-32 flex-shrink-0 text-left">
                      Gender
                    </span>
                    <span className="text-sm text-gray-900">
                      :&nbsp;&nbsp;&nbsp;{patient?.gender}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-sm text-gray-600 font-bold w-32 flex-shrink-0 text-left">
                      Report Date
                    </span>
                    <span className="text-sm text-gray-900">
                      :&nbsp;&nbsp;&nbsp;
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex">
                    <span className="text-sm text-gray-600 font-bold w-32 flex-shrink-0 text-left">
                      Phone
                    </span>
                    <span className="text-sm text-gray-900">
                      :&nbsp;&nbsp;&nbsp;{patient?.phone}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-sm text-gray-600 font-bold w-32 flex-shrink-0 text-left">
                      Ref By
                    </span>
                    <span className="text-sm text-gray-900">
                      :&nbsp;&nbsp;&nbsp;{patient?.doctorName}
                    </span>
                  </div>
                </div>
                <div className="border-t-2 border-black"></div>
              </div>
            </div>

            {/* Test Results */}
            <div>{renderTestResults(report.results)}</div>

            {/* Doctor's Remarks */}
            {report.doctorRemarks && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Doctor's Remarks:</h3>
                  <p className="text-sm">{report.doctorRemarks}</p>
                </div>
              </>
            )}

            {/* Footer */}

            {/* <div className="text-center text-sm text-muted-foreground space-y-2 flex-1"> */}
            <p className="font-normal text-center text-lg text-black">
              -- End of Report --
            </p>

            {/* QR Code for download */}
            {/* <div className="flex-shrink-0">
                <ReportQRCode
                  reportId={report.id}
                  patientName={report.patientName}
                  size={80}
                  showLabel={true}
                  className="print:block"
                />
              </div> */}
            {/* </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
