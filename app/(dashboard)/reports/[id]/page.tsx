"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, Printer as Print, Edit } from "lucide-react";
import {
  DataManager,
  type Report,
  type TestCatalogItem,
} from "@/lib/data-manager";
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
  const [testConfigs, setTestConfigs] = useState<
    Record<string, TestCatalogItem>
  >({});

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
        router.push("/reports");
        return;
      }

      setReport(reportData);

      // Get patient data
      const patientData = await dataManager.getPatientById(
        reportData.patientId
      );
      setPatient(patientData);

      // FIXED: Load all test configurations
      const configs: Record<string, TestCatalogItem> = {};
      const uniqueTestCodes = [
        ...new Set(reportData.results.map((r) => r.testCode)),
      ];

      for (const testCode of uniqueTestCodes) {
        const config = await dataManager.getTestByCode(testCode);
        if (config) {
          configs[testCode] = config;
        }
      }
      setTestConfigs(configs);

      setLoading(false);
    }

    loadReportData();
  }, [reportId, user, authLoading, router]);

  const handlePrint = () => {
    const reportContent = document.querySelector(".print-content");
    if (!reportContent) {
      console.error("Report content not found");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      console.error("Could not open print window");
      return;
    }

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

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Lab Report - ${report?.id ?? ""}</title>
        <style>
          ${styles}
        </style>
      </head>
      <body>
        ${reportContent.innerHTML}
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  const handleDownloadPDF = async () => {
    if (!report) return;

    try {
      const dataManager = DataManager.getInstance();
      const patient = await dataManager.getPatientById(report.patientId);

      if (!patient) {
        alert("Patient information not found");
        return;
      }

      await generateReportPDF(report, patient);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  const renderTestResults = (results: any[]) => {
    console.log("=== RENDERING ALL TEST RESULTS ===");
    console.log("Total results:", results.length);
    console.log("Results:", results);

    const groupedResults = results.reduce((groups, result) => {
      const testCode = result.testCode;
      if (!groups[testCode]) {
        groups[testCode] = [];
      }
      groups[testCode].push(result);
      return groups;
    }, {} as Record<string, any[]>);

    console.log("Grouped results:", groupedResults);

    return (
      <div className="space-y-6">
        {Object.entries(groupedResults).map(([testCode, testResults]) => {
          console.log(`Rendering testCode: ${testCode}, results:`, testResults);

          const resultsArray = testResults as any[];
          if (testCode === "FBC") {
            return <div key={testCode}>{renderFBCResults(resultsArray)}</div>;
          } else if (testCode === "UFR") {
            return <div key={testCode}>{renderUFRResults(resultsArray)}</div>;
          } else if (testCode === "OGTT") {
            return <div key={testCode}>{renderOGTTResults(resultsArray)}</div>;
          } else if (testCode === "PPBS") {
            return <div key={testCode}>{renderPPBSResults(resultsArray)}</div>;
          } else if (testCode === "BSS") {
            return <div key={testCode}>{renderBSSResults(resultsArray)}</div>;
          } else {
            return (
               <div key={testCode}>
      {renderRegularTestResults(testCode, resultsArray)}
    </div>
            );
          }
        })}
      </div>
    );
  };

  const renderOGTTResults = (ogttResults: any[]) => {
    console.log("=== RENDERING OGTT RESULTS ===");
    console.log("OGTT Results:", ogttResults);

    const fastingResult = ogttResults.find((r) =>
      r.testName.includes("Fasting")
    );
    const oneHourResult = ogttResults.find((r) =>
      r.testName.includes("1 Hour")
    );
    const twoHoursResult = ogttResults.find((r) =>
      r.testName.includes("2 Hour")
    );

    console.log("Fasting:", fastingResult);
    console.log("1 Hour:", oneHourResult);
    console.log("2 Hours:", twoHoursResult);

    const fastingValue = fastingResult?.value || "";
    const oneHourValue = oneHourResult?.value || "";
    const twoHoursValue = twoHoursResult?.value || "";

    console.log(
      "Values extracted - Fasting:",
      fastingValue,
      "1H:",
      oneHourValue,
      "2H:",
      twoHoursValue
    );

    return (
      <div key="OGTT" className="border rounded-lg p-6 ogtt-section">
        <div className="flex items-center gap-2 mb-6">
          <Badge variant="outline" className="text-lg px-3 py-1">
            OGTT
          </Badge>
          <span className="font-semibold text-lg">
            Oral Glucose Tolerance Test
          </span>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-collapse border-t-2 border-b-2 border-gray-900">
                <th className="text-left font-semibold">Test</th>
                <th className="text-right font-semibold">Result</th>
                <th className="text-right font-semibold">Units</th>
                <th className="text-right font-semibold">Reference Range</th>
              </tr>
            </thead>
            <tbody>
              {ogttResults.map((result, index) => {
                const displayName = result.testName
                  .replace("Glucose", "")
                  .trim();
                return (
                  <tr key={index} className="border-0 font-mono p-0 table-row">
                    <td className="py-0 font-mono">{displayName}</td>
                    <td className="text-right py-0 font-mono">
                      {result.value}
                    </td>
                    <td className="text-right py-0 font-mono">{result.unit}</td>
                    <td className="text-right py-0 font-mono">
                      {result.referenceRange}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Graph Section */}
        {(fastingValue || oneHourValue || twoHoursValue) && (
          <div className="mt-6 ogtt-graph-wrapper">
            <OGTTGraph
              fasting={fastingValue}
              afterOneHour={oneHourValue}
              afterTwoHours={twoHoursValue}
            />
          </div>
        )}
      </div>
    );
  };

  const renderPPBSResults = (ppbsResults: any[]) => {
    console.log("=== RENDERING PPBS RESULTS ===");
    console.log("PPBS Results:", ppbsResults);

    return (
      <div key="PPBS" className="border rounded-lg p-6">
        <h1 className="font-semibold text-xl text-center mb-3 border-black border-b-2">
          Post Prandial Blood Sugar
        </h1>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">Description</th>
              <th className="text-left p-4">Result</th>
              <th className="text-left p-4">Units</th>
              <th className="text-left p-4">Reference Range</th>
            </tr>
          </thead>
          <tbody>
            {ppbsResults.map((result, index) => (
              <tr key={index} className="border-b">
                <td className="p-4">
                  <div className="font-medium">{result.testName}</div>
                </td>
                <td className="p-4">
                  <div className=" text-lg">{result.value}</div>
                </td>
                <td className="p-4">
                  <div className=" text-lg">{result.unit}</div>
                </td>
                <td className="p-4">
                  <div className=" text-lg">
                    {result.referenceRange}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderBSSResults = (bssResults: any[]) => {
    console.log("=== RENDERING BSS RESULTS ===");
    console.log("BSS Results:", bssResults);

    return (
      <div key="BSS" className="border rounded-lg p-6">
        <h1 className="font-semibold text-xl text-center mb-3 border-black border-b-2">
          Blood for BSS
        </h1>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">Description</th>
              <th className="text-left p-4">Result</th>
              <th className="text-left p-4">Units</th>
              <th className="text-left p-4">Reference Range</th>
            </tr>
          </thead>
          <tbody>
            {bssResults.map((result, index) => (
              <tr key={index} className="border-b">
                <td className="p-4">
                  <div className="font-medium">{result.testName}</div>
                </td>
                <td className="p-4">
                  <div className=" text-lg">{result.value}</div>
                </td>
                <td className="p-4">
                  <div className=" text-lg">{result.unit}</div>
                </td>
                <td className="p-4">
                  <div className=" text-lg">
                    {result.referenceRange}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderFBCResults = (fbcResults: any[]) => {
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
    const testConfig = testConfigs[testCode];
    const testName = testConfig ? testConfig.name : testCode;
    const isESR = testCode === "ESR";
    const isTSH = testCode === "TSH";
    const isHBA1C = testCode === "HBA1C";
    const isBUN = testCode === "BUN";
     const isVDRL = testCode === "VDRL";
     const isHIV = testCode === "HIV";
    const hideReferenceRange = isESR || isTSH || isHBA1C || isBUN || isVDRL || isHIV;
    const hideunits = isHIV;

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
              {!hideunits && (<th className="text-left p-4">Units</th>)}
              {!hideReferenceRange && (
                <th className="text-left p-4">Reference Range</th>
              )}
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
          <div className="text-lg">
            {isVDRL || isHIV ? (
              // For VDRL, show only the comments (Reactive/Non-Reactive)
              <span className="font-semibold">{result.comments}</span>
            ) : (
              <>
                {result.value}
                {isQualitative && result.comments && (
                  <span className="ml-2">({result.comments})</span>
                )}
              </>
            )}
          </div>
        </td>
        {!hideunits && (
          <td className="p-4">
            <div className="text-lg">{result.unit}</div>
          </td>
        )}
        {!hideReferenceRange && (
          <td className="p-4">
            <div className="text-lg">
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
    if (!value || !referenceRange) return "normal";

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "normal";

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

          .print\\:shadow-none {
            box-shadow: none !important;
            border: none !important;
          }

          .max-w-4xl.mx-auto.print\\:max-w-none {
            border: none !important;
            box-shadow: none !important;
          }

          .space-y-6 {
            border: none !important;
          }

          [class*="CardContent"] {
            border: none !important;
          }

          .bg-gray-50.p-4.rounded-sm.border {
            background-color: #f9fafb !important;
            padding: 6px !important;
            margin-bottom: 8px !important;
          }

          h3 {
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 2px;
            margin-top: 2px;
            color: #374151;
          }

          h1.font-semibold.text-xl.text-center {
            display: block !important;
            font-size: 16px !important;
            font-weight: 900 !important;
            text-align: center !important;
            margin-bottom: 8px !important;
            border-bottom: 2px solid #000 !important;
            padding-bottom: 4px !important;
          }

          .border.rounded-lg .flex.items-center.gap-2 {
            justify-content: center !important;
            margin-bottom: 4px !important;
            margin-top: 2px !important;
            width: 100% !important;
          }

          .border.rounded-lg .flex.items-center.gap-2 > [class*="Badge"],
          .border.rounded-lg .flex.items-center.gap-2 > [class*="badge"],
          .border.rounded-lg .flex.items-center.gap-2 > *:first-child {
            display: none !important;
          }

          .border.rounded-lg
            .flex.items-center.gap-2
            > span:not([class*="badge"]):not([class*="Badge"]) {
            font-size: 16px !important;
            font-weight: 900 !important;
            text-align: center !important;
            background-color: #f3f4f6 !important;
            border-radius: 3px !important;
            letter-spacing: 0.5px !important;
          }

          table {
            font-size: 14px;
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 2px;
          }
          th,
          td {
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
            font-family: Menlo, Monaco, Consolas, "Liberation Mono",
              "Courier New", monospace;
          }

          th:first-child,
          td:first-child {
            text-align: left !important;
            width: 30%;
            padding: 0px !important;
          }
          th:nth-child(2),
          td:nth-child(2) {
            text-align: center !important;
            width: 15%;        
            padding: 0px !important;
          }
          th:nth-child(3),
          td:nth-child(3) {
            text-align: center !important;
            width: 15%;
            padding: 0px !important;
          }
          th:nth-child(4),
          td:nth-child(4) {
            text-align: center !important;
            width: 25%;
            padding: 0px !important;
          }
          th:nth-child(5),
          td:nth-child(5) {
            text-align: center !important;
            width: 15%;
            padding: 0px !important;
          }

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

          .border.rounded-lg .mb-6:nth-child(4) table thead {
            display: none !important;
          }

          .border.rounded-lg .mb-6:nth-child(6) table thead {
            display: none !important;
          }

          .border.rounded-lg .mb-6 + hr + .mb-6 table thead,
          .border.rounded-lg .mb-6 + hr + .mb-6 + hr + .mb-6 table thead {
            display: none !important;
          }

          .border.rounded-lg hr {
            display: none !important;
          }

          .border.rounded-lg .mb-6:not(:first-child) {
            margin-bottom: 0 !important;
          }

          .border.rounded-lg {
            border: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
          }

          .badge,
          [class*="badge"] {
            font-size: 14px !important;
            padding: 4px 8px !important;
            background-color: #f3f4f6 !important;
            border: 1px solid #e5e7eb !important;
            color: #374151 !important;
            border-radius: 3px !important;
          }

          [class*="bg-red"],
          [class*="destructive"] {
            background-color: #ef4444 !important;
            color: #ffffff !important;
            font-size: 14px !important;
            padding: 4px 8px !important;
            font-weight: bold !important;
            border-radius: 3px !important;
          }

          .text-muted-foreground {
            color: #6b7280 !important;
            font-size: 8px !important;
            text: left !important;
          }
          .font-medium,
          .font-semibold {
            font-weight: bold !important;
          }

          hr,
          .border-t,
          .border-b {
            border-color: #d1d5db !important;
            margin: 1px 0 !important;
          }

          .text-center.text-sm.text-muted-foreground {
            font-size: 8px !important;
            color: #9ca3af !important;
            margin-top: 12px !important;
            padding-top: 8px !important;
            border-top: 1px solid #e0e0e0 !important;
          }

          .recharts-responsive-container {
            page-break-inside: avoid !important;
            display: block !important;
            margin-top: 20px !important;
            margin-bottom: 20px !important;
          }

          .space-y-4 {
            display: block !important;
          }
        }
}
      `}</style>
      <div className="space-y-6">
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
            {/* <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button> */}
          </div>
        </div>

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
            <div className="bg-gray-50">
              <div className="space-y-2 border-t-2 border-black">
                <div className="grid grid-cols-2">
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
                <div className="grid grid-cols-2">
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
                <div className="grid grid-cols-2">
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
                <div className="grid grid-cols-2">
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

            <div>
  {renderTestResults(report.results)}
  
  {/* Show Additional Details only if there's a single unique test code */}
  {(() => {
    const uniqueTestCodes = [...new Set(report.results.map(r => r.testCode))];
    const shouldShowAdditionalDetails = 
      uniqueTestCodes.length === 1 && 
      !['FBC', 'UFR', 'OGTT', 'PPBS', 'BSS', 'LIPID'].includes(uniqueTestCodes[0]);
    
    return shouldShowAdditionalDetails ? (
      <div className="mt-8">
        <TestAdditionalDetails testCode={uniqueTestCodes[0]} />
      </div>
    ) : null;
  })()}
</div>

            {report.doctorRemarks && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Doctor's Remarks:</h3>
                  <p className="text-sm">{report.doctorRemarks}</p>
                </div>
              </>
            )}

            <p className="font-normal text-center text-lg text-black">
              -- End of Report --
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
