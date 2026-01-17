"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ArrowLeft } from "lucide-react";
import {
  DataManager,
  type Report,
  type TestCatalogItem,
} from "@/lib/data-manager";
import { useAuth } from "@/components/auth-provider";
import TestAdditionalDetails from "@/components/TestAdditionalDetails";
import { OGTTGraph } from "@/components/ogtt-graph";

export default function PDFPreviewPage() {
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

  const [letterheadBase64, setLetterheadBase64] = useState<string>("");
  const [letterheadLoaded, setLetterheadLoaded] = useState(false);
  const [letterheadError, setLetterheadError] = useState<string>("");

  useEffect(() => {
    // Load letterhead image and convert to base64
    const loadLetterheadAsBase64 = async () => {
      try {
        const response = await fetch("/letterhead.jpg");
        if (response.ok) {
          const blob = await response.blob();
          await new Promise<void>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64data = reader.result as string;
              setLetterheadBase64(base64data);
              console.log("✅ Letterhead loaded");
              resolve();
            };
            reader.onerror = () => reject(new Error("FileReader error"));
            reader.readAsDataURL(blob);
          });
          setLetterheadLoaded(true);
          setLetterheadError("");
        } else {
          throw new Error("Failed to fetch letterhead");
        }
      } catch (error) {
        console.error("❌ Could not load letterhead image:", error);
        setLetterheadLoaded(false);
        setLetterheadError("Place letterhead.jpg in /public folder");
      }
    };

    loadLetterheadAsBase64();
  }, []);


  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/");
      return;
    }

    async function loadReportData() {
      const dataManager = DataManager.getInstance();
      const allReports = await dataManager.getReports();
      const reportData = allReports.find((rep) => rep.id === reportId);

      if (!reportData) {
        router.push("/reports");
        return;
      }

      setReport(reportData);

      const patientData = await dataManager.getPatientById(
        reportData.patientId
      );
      setPatient(patientData);

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

  const handleDownloadPDF = async () => {
    try {
      // Show loading state
      const loadingDiv = document.createElement("div");
      loadingDiv.id = "pdf-loading";
      loadingDiv.style.cssText =
        "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); z-index: 9999; font-family: sans-serif;";
      loadingDiv.innerHTML =
        '<div style="text-align: center;"><div style="margin-bottom: 10px;">Generating PDF...</div><div style="width: 200px; height: 4px; background: #e5e7eb; border-radius: 2px; overflow: hidden;"><div style="width: 30%; height: 100%; background: #3b82f6; animation: loading 1.5s ease-in-out infinite;"></div></div></div><style>@keyframes loading { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(233%); } }</style>';
      document.body.appendChild(loadingDiv);

      const element = document.querySelector(".pdf-page") as HTMLElement;
      if (!element) {
        document.body.removeChild(loadingDiv);
        alert("PDF content not found");
        return;
      }

      // Use window.print() as the most reliable method
      window.print();

      // Remove loading indicator after a short delay
      setTimeout(() => {
        const loadingElement = document.getElementById("pdf-loading");
        if (loadingElement) {
          document.body.removeChild(loadingElement);
        }
      }, 1000);
    } catch (error) {
      console.error("Error generating PDF:", error);
      const loadingElement = document.getElementById("pdf-loading");
      if (loadingElement) {
        document.body.removeChild(loadingElement);
      }
      alert(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  const renderTestResults = (results: any[]) => {
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
          } else if (testCode === "LIPID") {
            return (
              <div key={testCode}>
                {renderLipidProfileResults(resultsArray)}
              </div>
            );
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
    const fastingResult = ogttResults.find((r) =>
      r.testName.includes("Fasting")
    );
    const oneHourResult = ogttResults.find((r) =>
      r.testName.includes("1 Hour")
    );
    const twoHoursResult = ogttResults.find((r) =>
      r.testName.includes("2 Hour")
    );

    const fastingValue = fastingResult?.value || "";
    const oneHourValue = oneHourResult?.value || "";
    const twoHoursValue = twoHoursResult?.value || "";

    return (
      <div
        key="OGTT"
        className="ogtt-section"
        style={{ fontFamily: "'Courier New', Courier, monospace" }}
      >
        <div className="flex items-center gap-2 justify-center">
          <div className="font-medium text-md text-black text-center">
            Oral Glucose Tolerance Test
          </div>
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
                    <td className="py-0 font-mono border-b border-gray-200">
                      {displayName}
                    </td>
                    <td className="text-right py-0 font-mono border-b border-gray-200">
                      {result.value}
                    </td>
                    <td className="text-right py-0 font-mono border-b border-gray-200">
                      {result.unit}
                    </td>
                    <td className="text-right py-0 font-mono border-b border-gray-200">
                      {result.referenceRange}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

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
    return (
      <div
        key="PPBS"
        className=""
        style={{ fontFamily: "'Courier New', Courier, monospace" }}
      >
        <h1 className="font-semibold text-xl text-center border-black border-b-2">
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
                  {result.mealType && result.hourType && (
                    <div className="text-md mt-1">
                      ({result.mealType} / {result.hourType})
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <div className="text-lg">{result.value}</div>
                </td>
                <td className="p-4">
                  <div className="text-lg">{result.unit}</div>
                </td>
                <td className="p-4">
                  <div className="text-lg">{result.referenceRange}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderBSSResults = (bssResults: any[]) => {
    return (
      <div
        key="BSS"
        className=""
        style={{ fontFamily: "'Courier New', Courier, monospace" }}
      >
        <h1 className="font-semibold text-xl text-center mb-3 border-black border-b-2">
          Blood for BSS
        </h1>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className=" px-4">Description</th>
              <th className=" px-4">Result</th>
              <th className=" px-4">Units</th>
              <th className=" px-4">Reference Range</th>
            </tr>
          </thead>
          <tbody>
            {bssResults.map((result, index) => (
              <tr key={index} className="border-b">
                <td className="px-1">
                  <div className="font-medium">{result.testName}</div>
                  {result.mealType && result.hourType && (
                    <div className="text-xs">
                      ({result.mealType} / {result.hourType})
                    </div>
                  )}
                </td>
                <td className="px-1">
                  <div className="text-md text-center">{result.value}</div>
                </td>
                <td className="px-4">
                  <div className="text-md">{result.unit}</div>
                </td>
                <td className="px-4">
                  <div className="text-md">{result.referenceRange}</div>
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

    const renderTable = (
      results: any[],
      title?: string,
      showHeader: boolean = true
    ) => (
      <div
        className="mb-6"
        style={{ fontFamily: "'Courier New', Courier, monospace" }}
      >
        {title && (
          <h4 className="font-semibold text-xl text-left text-muted-foreground mb-3 underline">
            {title}
          </h4>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {showHeader && (
              <thead>
                <tr className="border-collapse border-t-2 border-b-2 border-gray-900">
                  <th className="text-left font-semibold">Parameter</th>
                  <th className="text-right font-semibold">Result</th>
                  <th className="text-right font-semibold">Units</th>
                  <th className="text-right font-semibold">Reference Range</th>
                  <th className="text-center font-semibold">Status</th>
                </tr>
              </thead>
            )}
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
                  <tr
                    key={index}
                    className="border-0 font-mono p-0 table-row"
                    style={{ fontFamily: "'Courier New', Courier, monospace" }}
                  >
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
                        <span className="text-xs font-bold text-red-600">
                          {statusDisplay.text}
                        </span>
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
      <div
        key="FBC"
        className=""
        style={{ fontFamily: "'Courier New', Courier, monospace" }}
      >
        <div className="flex items-center gap-2 justify-center">
          <h1 className="font-semibold text-lg">Full Blood Count</h1>
        </div>

        {mainParams.length > 0 && renderTable(mainParams, undefined, true)}
        {mainParams.length > 0 && differentialCount.length > 0 && (
          <hr className="border-gray-200" />
        )}
        {differentialCount.length > 0 &&
          renderTable(differentialCount, "Differential Count", false)}
        {differentialCount.length > 0 && absoluteCount.length > 0 && (
          <hr className="border-gray-200" />
        )}
        {absoluteCount.length > 0 &&
          renderTable(absoluteCount, "Absolute Count", false)}
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

    const renderTable = (
      results: any[],
      title?: string,
      showHeader: boolean = true
    ) => (
      <div
        className="mb-6"
        style={{ fontFamily: "'Courier New', Courier, monospace" }}
      >
        {title && (
          <h4 className="font-semibold text-xl text-left text-muted-foreground mb-3 underline">
            {title}
          </h4>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            {showHeader && (
              <thead>
                <tr className="border-collapse border-t-2 border-b-2 border-gray-900">
                  <th className="text-left font-semibold px-1">Parameter</th>
                  <th className="text-right font-semibold px-1">Result</th>
                  <th className="text-right font-semibold px-1">Units</th>
                </tr>
              </thead>
            )}
            <tbody>
              {results.map((result, index) => {
                return (
                  <tr key={index} className="border-0 font-mono table-row">
                    <td className="px-1 font-mono border-b border-gray-200">
                      {result.testName}
                    </td>
                    <td className="text-right px-1 font-mono border-b border-gray-200">
                      {result.value}
                    </td>
                    <td className="text-right px-1 font-mono border-b border-gray-200">
                      {result.unit}
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
      <div
        key="UFR"
        className=""
        style={{ fontFamily: "'Courier New', Courier, monospace" }}
      >
        <div className="flex items-center justify-center">
          <h1 className="font-semibold text-lg">Urine Full Report</h1>
        </div>

        {physicalChemical.length > 0 &&
          renderTable(physicalChemical, undefined, true)}
        {physicalChemical.length > 0 && microscopic.length > 0 && (
          <hr className="my-4 border-gray-200" />
        )}
        {microscopic.length > 0 &&
          renderTable(microscopic, "Centrifuge Deposit", false)}
      </div>
    );
  };

  const renderLipidProfileResults = (lipidResults: any[]) => {
    // Helper function to format reference range
    const formatReferenceRange = (range: string) => {
      if (!range) return "";
      // Split by \n and render each line
      return range.split("\n").map((line, idx) => (
        <div key={idx} className="leading-tight">
          {line}
        </div>
      ));
    };

    return (
      <div key="LIPID" className="border rounded-lg p-6">
        <h1 className="font-semibold text-xl text-center mb-3 border-black border-b-2 uppercase">
          Lipid Profile
        </h1>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b uppercase">
              <th className="text-left p-1">Test</th>
              <th className="text-left p-1">Value</th>
              <th className="text-left p-1">Units</th>
              <th className="text-left p-1">Reference Range</th>
            </tr>
          </thead>
          <tbody>
            {lipidResults.map((result, index) => (
              <tr key={index} className="border-b">
                <td className="p-1 align-top text-left">
                  <div className="">{result.testName}</div>
                </td>
                <td className={`p-1 text-left align-top`}>
                  <div className="">{result.value}</div>
                </td>
                <td className="p-1 text-left align-top">
                  <div className="">{result.unit}</div>
                </td>
                <td className="p-1 align-top text-left">
                  <div className="text-sm text-left">
                    {formatReferenceRange(result.referenceRange)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4">
          <p className="text-xs text-black">
            Note:- 10-12 hours fasting sample is required.
          </p>
        </div>
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
    const isHCG = testCode === "HCG";
    const isDEN = testCode === "DEN";
    const isFT3 = testCode === "FT3";
    const isFER = testCode === "FER";
    const isHBsAg = testCode === "HBsAg";
    const isHCGU = testCode === "HCGU";
    const isUKB = testCode === "UKB";
    const isDNS1 = testCode === "DNS1";
    const isWIDAL = testCode === "WIDAL";
    const isUACR = testCode === "UACR";
    const hideReferenceRange =
      isESR ||
      isTSH ||
      isHBA1C ||
      isBUN ||
      isVDRL ||
      isHIV ||
      isHCG ||
      isDEN ||
      isFT3 ||
      isFER ||
      isHBsAg ||
      isHCGU ||
      isUKB ||
      isDNS1 ||
      isWIDAL ||
      isUACR;
    const hideunits =
      isHIV ||
      isHCG ||
      isDEN ||
      isHBsAg ||
      isHCGU ||
      isUKB ||
      isDNS1 ||
      isWIDAL;

    return (
      <div
        key={testCode}
        style={{ fontFamily: "'Courier New', Courier, monospace" }}
      >
        <h1 className="text-lg text-center mb-3 font-bold border-black border-b">
          {testName}
        </h1>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-1">Test</th>
              <th className="text-left p-1">Value</th>
              {!hideunits && <th className="text-left p-1">Units</th>}
              {!hideReferenceRange && (
                <th className="text-left p-1">Reference Range</th>
              )}
            </tr>
          </thead>
          <tbody>
            {testResults.map((result, index) => {
              const isQualitative = testConfig?.isQualitative || false;
              const displayName = result.testName;
              return (
                <tr key={`${testCode}-${index}`} className="border-b">
                  <td className="p-1">
                    <div className="flex items-center gap-2">
                      <span className="">{displayName}</span>
                    </div>
                  </td>
                  <td className="p-1">
                    <div className="">
                      {isVDRL ||
                      isHIV ||
                      isHCG ||
                      isDEN ||
                      isHBsAg ||
                      isHCGU ||
                      isUKB ||
                      isDNS1 ||
                      isWIDAL ? (
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
                    <td className="p-1">
                      <div className="">{result.unit}</div>
                    </td>
                  )}
                  {!hideReferenceRange && (
                    <td className="p-1">
                      <div className="">
                        {(() => {
                          try {
                            const parsed =
                              typeof result.referenceRange === "string"
                                ? JSON.parse(result.referenceRange)
                                : result.referenceRange;

                            if (
                              typeof parsed === "object" &&
                              parsed !== null &&
                              !Array.isArray(parsed)
                            ) {
                              return Object.entries(parsed)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(", ");
                            }
                            return result.referenceRange;
                          } catch {
                            return result.referenceRange;
                          }
                        })()}
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Report Not Found</h1>
      </div>
    );
  }

  return (
    <div className="pdf-preview-container">
      <style jsx global>{`
        @media screen {
          .pdf-preview-container {
            background: #525659;
            min-height: 100vh;
            padding: 20px;
          }

          .pdf-page {
            background: white;
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 0;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            position: relative;
            overflow: hidden;
          }

          .pdf-page::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 100%;
           background-image: ${letterheadLoaded ? `url('${letterheadBase64}')` : "none"};
            background-size: 100% auto;
            background-repeat: no-repeat;
            background-position: top center;
            pointer-events: none;
            z-index: 0;
          }

          .pdf-content {
            position: relative;
            z-index: 1;
            padding: ${letterheadLoaded ? "2.18in 3mm 2mm 3mm" : "15mm"};
            background: transparent;
          }

          .action-buttons {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            display: flex;
            gap: 10px;
          }

          /* Hide all navigation elements in PDF view */
          .pdf-page nav,
          .pdf-page header,
          .pdf-page aside,
          .pdf-page [role="navigation"],
          .pdf-page button:not(.action-buttons button) {
            display: none !important;
          }
          .signature-container {
            position: absolute;
            bottom: -15mm;
            right: 82mm;
            z-index: 10;
          }

          .signatureimg {
            height: 20px;
            width: auto;
          }

          .text-red-600 {
            color: #dc2626 !important;
            font-weight: bold !important;
          }

          /* Ensure table alignment */
          .space-y-6 > div:not(.mt-8) table {
            font-size: 14px;
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 2px;
            table-layout: fixed; /* Add this for even column distribution */
          }
        }

        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body * {
            visibility: hidden;
          }
          .pdf-page,
          .pdf-page * {
            visibility: visible;
          }

          .pdf-page {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            min-height: 297mm;
            margin: 0;
            padding: 0;
            box-shadow: none;
            overflow: visible;
          }

          .pdf-page::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 100%;
            background-image: ${letterheadLoaded ? `url('${letterheadBase64}')` : "none"};
            background-size: 100% auto;
            background-repeat: no-repeat;
            background-position: top center;
            pointer-events: none;
            z-index: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .pdf-content {
            position: relative;
            z-index: 1;
            padding: ${letterheadLoaded ? "2.18in 3mm 2mm 3mm" : "15mm"};
            background: transparent;
          }

          /* Hide all UI elements */
          .action-buttons,
          .no-print,
          nav,
          header,
          aside,
          [role="navigation"],
          button {
            display: none !important;
            visibility: hidden !important;
          }

          @page {
            size: A4;
            margin: 0;
          }

          .space-y-1.border-t.border-black.font-mono,
          .space-y-1.border-t.border-black.font-mono * {
            font-family: "Courier New", Courier, monospace !important;
            color: #000000 !important;
          }

          .space-y-6 > div:not(.mt-8) table {
            font-size: 14px;
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 2px;
          }

          .space-y-6 > div:not(.mt-8) th {
            background-color: #f8f9fa !important;
            font-weight: 600 !important;
            text-align: center !important;
            padding: 0px !important;
            border-bottom: 1px solid #000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .space-y-6 > div:not(.mt-8) th:first-child,
          .space-y-6 > div:not(.mt-8) td:first-child {
            text-align: left !important;
            width: 30%;
            padding: 0px !important;
          }

          /* Ensure table borders print correctly */
          table,
          th,
          td {
            border-color: #000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .signature-container {
            position: absolute !important;
            bottom: 15mm !important;
            right: 15mm !important;
            z-index: 10 !important;
            visibility: visible !important;
          }

          .signatureimg {
            height: 60px !important;
            width: auto !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .text-red-600 {
            color: #dc2626 !important;
            font-weight: bold !important;
          }

          [class*="bg-red"],
          [class*="destructive"] {
            background-color: transparent !important;
            color: #ef4444 !important;
            font-size: 14px !important;
            padding: 0px !important;
            font-weight: bold !important;
            border-radius: 0px !important;
          }

          /* Ensure table alignment */
          .space-y-6 > div:not(.mt-8) table {
            font-size: 14px;
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 2px;
            table-layout: fixed; /* Add this for even column distribution */
          }
        }
      `}</style>

      <div className="action-buttons no-print">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleDownloadPDF}>
          <Download className="h-4 w-4 mr-2" />
          Save as PDF
        </Button>
        {letterheadLoaded && (
          <div className="text-green-600 text-sm bg-white px-3 py-2 rounded shadow max-w-xs">
            ✅ Letterheads loaded
          </div>
        )}
        {!letterheadLoaded && letterheadError && (
          <div className="text-yellow-600 text-sm bg-white px-3 py-2 rounded shadow max-w-xs">
            ⚠️ {letterheadError}
          </div>
        )}
      </div>

      <div className="pdf-page">
        <div className="pdf-content">
          <div className="space-y-3">
            <div className="space-y-1 border-t border-black font-mono">
              <div className="grid grid-cols-2">
                <div className="flex">
                  <span className="text-sm text-gray-900 w-32 shrink-0 text-left uppercase">
                    Patient Name
                  </span>
                  <span className="text-sm text-gray-900 uppercase">
                    :&nbsp;&nbsp;&nbsp;{report.patientName}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-sm text-gray-900 w-32 shrink-0 text-left uppercase">
                    Report ID
                  </span>
                  <span className="text-sm text-gray-900 uppercase">
                    :&nbsp;&nbsp;&nbsp;{report.id}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="flex">
                  <span className="text-sm text-gray-900 w-32 shrink-0 text-left uppercase">
                    Age
                  </span>
                  <span className="text-sm text-gray-900 uppercase">
                    :&nbsp;&nbsp;&nbsp;
                    {patient?.age && patient.age > 0
                      ? `${patient.age} years`
                      : ""}
                    {patient?.ageMonths && patient.ageMonths > 0
                      ? patient?.age && patient.age > 0
                        ? ` ${patient.ageMonths} months`
                        : `${patient.ageMonths} months`
                      : ""}
                    {(!patient?.age || patient.age === 0) &&
                    (!patient?.ageMonths || patient.ageMonths === 0)
                      ? "N/A"
                      : ""}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-sm text-gray-900 w-32 shrink-0 text-left uppercase">
                    Patient ID
                  </span>
                  <span className="text-sm text-gray-900 uppercase">
                    :&nbsp;&nbsp;&nbsp;{report.patientId}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="flex">
                  <span className="text-sm text-gray-900 w-32 shrink-0 text-left uppercase">
                    Gender
                  </span>
                  <span className="text-sm text-gray-900 uppercase">
                    :&nbsp;&nbsp;&nbsp;{patient?.gender}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-sm text-gray-900 w-32 shrink-0 text-left uppercase">
                    Report Date
                  </span>
                  <span className="text-sm text-gray-900 uppercase">
                    :&nbsp;&nbsp;&nbsp;
                    {(() => {
                      const date = new Date(
                        report.reportDate || report.createdAt
                      );
                      const day = String(date.getDate()).padStart(2, "0");
                      const month = String(date.getMonth() + 1).padStart(
                        2,
                        "0"
                      );
                      const year = date.getFullYear();
                      return `${day}/${month}/${year}`;
                    })()}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="flex">
                  <span className="text-sm text-gray-900 w-32 shrink-0 text-left uppercase">
                    Phone
                  </span>
                  <span className="text-sm text-gray-900 uppercase">
                    :&nbsp;&nbsp;&nbsp;{patient?.phone}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-sm text-gray-900 w-32 shrink-0 text-left uppercase">
                    Ref By
                  </span>
                  <span className="text-sm text-gray-900 uppercase">
                    :&nbsp;&nbsp;&nbsp;{patient?.doctorName}
                  </span>
                </div>
              </div>
              <div className="border-t border-black"></div>
            </div>

            <div>
              {renderTestResults(report.results)}

              {(() => {
                const uniqueTestCodes = [
                  ...new Set(report.results.map((r) => r.testCode)),
                ];
                const shouldShowAdditionalDetails =
                  uniqueTestCodes.length === 1 &&
                  !["FBC", "UFR", "OGTT", "PPBS", "BSS"].includes(
                    uniqueTestCodes[0]
                  );

                return shouldShowAdditionalDetails ? (
                  <div className="mt-8">
                    <TestAdditionalDetails
                      testCode={uniqueTestCodes[0].toLowerCase()}
                    />
                  </div>
                ) : null;
              })()}
            </div>

            {report.doctorRemarks && (
              <div>
                <h3 className="font-semibold mb-2">Remarks:</h3>
                <p className="text-sm">{report.doctorRemarks}</p>
              </div>
            )}

            <p className="font-normal text-center text-xs">
              -- End of Report --
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
