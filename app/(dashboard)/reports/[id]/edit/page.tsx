"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, TestTube } from "lucide-react";
import {
  DataManager,
  type Report,
  type ReportResult,
} from "@/lib/data-manager";
import { FBCReportCard } from "@/components/fbc-report-card";
import { UFRReportCard } from "@/components/ufr-report-card";
import { LipidProfileReportCard } from "@/components/lipid-profile-report-card";
import { OGTTGraph } from "@/components/ogtt-graph";
import { PPBSReportCard } from "@/components/ppbs-report-card";
import { BSSReportCard } from "@/components/bss-report-card";
import { BGRhReportCard } from "@/components/bgrh-report-card";
import { useAuth } from "@/components/auth-provider";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Helper function to check if a value is within reference range
function isValueInRange(value: string, referenceRange: string): boolean | null {
  if (!value || !referenceRange || value.trim() === "") return null;

  const numValue = parseFloat(value);
  if (isNaN(numValue)) return null;

  const rangeMatch = referenceRange.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/);
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]);
    const max = parseFloat(rangeMatch[2]);
    return numValue >= min && numValue <= max;
  }

  const lessThanMatch = referenceRange.match(/[<]\s*(\d+\.?\d*)/);
  if (lessThanMatch) {
    const max = parseFloat(lessThanMatch[1]);
    return numValue < max;
  }

  const greaterThanMatch = referenceRange.match(/[>]\s*(\d+\.?\d*)/);
  if (greaterThanMatch) {
    const min = parseFloat(greaterThanMatch[1]);
    return numValue > min;
  }

  return null;
}

// Helper function to get indicator color classes
function getValueIndicatorClass(value: string, referenceRange: string): string {
  const inRange = isValueInRange(value, referenceRange);
  if (inRange === null) return "";
  if (inRange) return "border-l-4 border-l-green-500 bg-green-50";
  return "border-l-4 border-l-red-500 bg-red-50";
}

// Helper function to get qualitative options
function getQualitativeOptions(
  testCode: string
): { value: string; label: string }[] {
  if (testCode === "VDRL") {
    return [
      { value: "Reactive", label: "Reactive" },
      { value: "Non-Reactive", label: "Non-Reactive" },
    ];
  }
  return [
    { value: "Positive", label: "Positive" },
    { value: "Negative", label: "Negative" },
  ];
}

export default function EditReportPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const reportId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [patient, setPatient] = useState<any>(null);
  const [results, setResults] = useState<ReportResult[]>([]);
  const [fbcValues, setFbcValues] = useState<any>(null);
  const [ufrValues, setUfrValues] = useState<any>(null);
  const [lipidValues, setLipidValues] = useState<any>(null);
  const [ogttValues, setOgttValues] = useState<any>(null);
  const [ppbsValues, setPpbsValues] = useState<any>(null);
  const [bssValues, setBssValues] = useState<any[]>([]);
  const [bgrhValues, setBgrhValues] = useState<any>(null);
  const [doctorRemarks, setDoctorRemarks] = useState("");
  const [reviewedBy, setReviewedBy] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [testCatalog, setTestCatalog] = useState<any[]>([]);

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

      const catalogData = await dataManager.getTestCatalog();
      setTestCatalog(catalogData);

      setDoctorRemarks(reportData.doctorRemarks || "");
      setReviewedBy(reportData.reviewedBy || "");
      setReportDate(
        reportData.reportDate || reportData.createdAt.split("T")[0]
      );

      // Group results by test code
      const groupedResults = reportData.results.reduce((groups, result) => {
        const testCode = result.testCode;
        if (!groups[testCode]) {
          groups[testCode] = [];
        }
        groups[testCode].push(result);
        return groups;
      }, {} as Record<string, any[]>);

      // Load FBC values
      if (groupedResults.FBC) {
        const fbcData: any = {};
        groupedResults.FBC.forEach((result) => {
          const testName = result.testName;
          if (testName === "Hemoglobin") fbcData.hemoglobin = result.value;
          else if (testName === "RBC") fbcData.rbc = result.value;
          else if (testName === "PCV") fbcData.pcv = result.value;
          else if (testName === "MCV") fbcData.mcv = result.value;
          else if (testName === "MCH") fbcData.mch = result.value;
          else if (testName === "MCHC") fbcData.mchc = result.value;
          else if (testName === "RDW-CV") fbcData.rdwcv = result.value;
          else if (testName === "Platelets") fbcData.platelets = result.value;
          else if (testName === "WBC") fbcData.wbc = result.value;
          else if (testName === "Neutrophils")
            fbcData.neutrophils = result.value;
          else if (testName === "Lymphocytes")
            fbcData.lymphocytes = result.value;
          else if (testName === "Eosinophils")
            fbcData.eosinophils = result.value;
          else if (testName === "Monocytes") fbcData.monocytes = result.value;
          else if (testName === "Basophils") fbcData.basophils = result.value;
          else if (testName === "Neutrophils (Abs)")
            fbcData.neutrophilsabs = result.value;
          else if (testName === "Lymphocytes (Abs)")
            fbcData.lymphocytesabs = result.value;
          else if (testName === "Eosinophils (Abs)")
            fbcData.eosinophilsabs = result.value;
          else if (testName === "Monocytes (Abs)")
            fbcData.monocytesabs = result.value;
          else if (testName === "Basophils (Abs)")
            fbcData.basophilsabs = result.value;
        });
        // Set FBC values immediately - this is key!
        setFbcValues(fbcData);
      }

      // Load UFR values
      if (groupedResults.UFR) {
        const ufrData: any = {};
        groupedResults.UFR.forEach((result) => {
          const testName = result.testName;
          if (testName === "Colour") ufrData.colour = result.value;
          else if (testName === "Appearance") ufrData.appearance = result.value;
          else if (testName === "PH") ufrData.ph = result.value;
          else if (testName === "Specific Gravity")
            ufrData.specificgravity = result.value;
          else if (testName === "Protein(Albumin)")
            ufrData.proteinalbumi = result.value;
          else if (testName === "Sugar(Reducing substances)")
            ufrData.sugarreducingsubstances = result.value;
          else if (testName === "Urobilinogen")
            ufrData.urobilinogen = result.value;
          else if (testName === "Bile") ufrData.bile = result.value;
          else if (testName === "Acetone/KB") ufrData.acetonekb = result.value;
          else if (testName === "Epithelial cells")
            ufrData.epithelialcells = result.value;
          else if (testName === "Pus cells") ufrData.puscells = result.value;
          else if (testName === "Red cells") ufrData.redcells = result.value;
          else if (testName === "Crystals") ufrData.crystals = result.value;
          else if (testName === "Casts") ufrData.casts = result.value;
          else if (testName === "Organisms") ufrData.organisms = result.value;
          else if (testName === "Others") ufrData.others = result.value;
        });
        setUfrValues(ufrData);
      }

      // Load Lipid Profile values
      if (groupedResults.LIPID) {
        const lipidData: any = {};
        groupedResults.LIPID.forEach((result) => {
          if (result.testName === "Total Cholesterol")
            lipidData.totalCholesterol = result.value;
          else if (result.testName === "HDL Cholesterol")
            lipidData.hdl = result.value;
          else if (result.testName === "Triglycerides")
            lipidData.triglycerides = result.value;
          else if (result.testName === "VLDL Cholesterol")
            lipidData.vldl = result.value;
          else if (result.testName === "LDL Cholesterol")
            lipidData.ldl = result.value;
          else if (result.testName === "Total Cholesterol/HDL Ratio")
            lipidData.tcHdlRatio = result.value;
          else if (result.testName === "Non-HDL Cholesterol")
            lipidData.nonHdl = result.value;
        });
        setLipidValues(lipidData);
      }

      // Load OGTT values
      if (groupedResults.OGTT) {
        const ogttData: any = {};
        groupedResults.OGTT.forEach((result) => {
          if (result.testName === "Fasting Glucose")
            ogttData.fasting = result.value;
          else if (result.testName === "After 1 Hour Glucose")
            ogttData.afterOneHour = result.value;
          else if (result.testName === "After 2 Hour Glucose")
            ogttData.afterTwoHours = result.value;
        });
        setOgttValues(ogttData);
      }

      // Load PPBS values
      if (groupedResults.PPBS && groupedResults.PPBS.length > 0) {
        const ppbsResult = groupedResults.PPBS[0];
        setPpbsValues({
          value: ppbsResult.value || "",
          mealType: ppbsResult.mealType || "Breakfast",
          hourType: ppbsResult.hourType || "After 2 Hours",
        });
      }

      // Load BSS values
      if (groupedResults.BSS) {
        const bssData = groupedResults.BSS.map((result) => ({
          value: result.value || "",
          mealType: result.mealType || "Breakfast",
          hourType: result.hourType || "After 2 Hours",
        }));
        setBssValues(bssData);
      }

      // Load BGRh values
      if (groupedResults.BGRh && groupedResults.BGRh.length > 0) {
        const bgrhResult = groupedResults.BGRh[0];
        setBgrhValues({
          bloodGroup: bgrhResult.value || "",
          rhesus: bgrhResult.comments || "",
        });
      }

      // Load other test results (quantitative tests)
      const regularResults = Object.entries(groupedResults)
        .filter(
          ([testCode]) =>
            !["FBC", "UFR", "LIPID", "OGTT", "PPBS", "BSS", "BGRh"].includes(
              testCode
            )
        )
        .flatMap(([_, results]) => results)
        .map((result) => ({
          ...result,
          value: result.value || "",
          unit: result.unit || "",
          referenceRange: result.referenceRange || "",
          comments: result.comments || "",
        }));

      setResults(regularResults);
      setLoading(false);
    }

    loadReportData();
  }, [reportId, user, authLoading, router]);

  const updateResult = (
    testName: string,
    field: keyof ReportResult,
    value: string
  ) => {
    setResults(
      results.map((result) =>
        result.testName === testName ? { ...result, [field]: value } : result
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!report) return;

    setSaving(true);

    try {
      const dataManager = DataManager.getInstance();
      const allResults: ReportResult[] = [
        ...results.filter((r) => r.value.trim() !== ""),
      ];

      const uniqueTestCodes = [
        ...new Set(report.results.map((r) => r.testCode)),
      ];
      const hasFBC = uniqueTestCodes.includes("FBC");
      const hasLIPID = uniqueTestCodes.includes("LIPID");
      const hasUFR = uniqueTestCodes.includes("UFR");
      const hasOGTT = uniqueTestCodes.includes("OGTT");
      const hasPPBS = uniqueTestCodes.includes("PPBS");
      const hasBSS = uniqueTestCodes.includes("BSS");
      const hasBGRh = uniqueTestCodes.includes("BGRh");

      // Add FBC results
      if (fbcValues && hasFBC) {
        const fbcResults = [
          {
            testCode: "FBC",
            testName: "Hemoglobin",
            value: fbcValues.hemoglobin,
            unit: "g/dL",
            referenceRange: "11.0 – 16.5",
            comments: "",
          },
          {
            testCode: "FBC",
            testName: "RBC",
            value: fbcValues.rbc,
            unit: "x10⁶/μL",
            referenceRange: "3.5 - 6.2",
            comments: "",
          },
          {
            testCode: "FBC",
            testName: "PCV",
            value: fbcValues.pcv,
            unit: "%",
            referenceRange: "36.0 – 54.0",
            comments: "",
          },
          {
            testCode: "FBC",
            testName: "MCV",
            value: fbcValues.mcv,
            unit: "fL",
            referenceRange: "80.0 – 100.0",
            comments: "",
          },
          {
            testCode: "FBC",
            testName: "MCH",
            value: fbcValues.mch,
            unit: "pg",
            referenceRange: "27.0 – 34.0",
            comments: "",
          },
          {
            testCode: "FBC",
            testName: "MCHC",
            value: fbcValues.mchc,
            unit: "g/dL",
            referenceRange: "32.0 – 36.0",
            comments: "",
          },
          {
            testCode: "FBC",
            testName: "RDW-CV",
            value: fbcValues.rdwcv || fbcValues.rdwCv,
            unit: "%",
            referenceRange: "11.0 – 16.0",
            comments: "",
          },
          {
            testCode: "FBC",
            testName: "Platelets",
            value: fbcValues.platelets,
            unit: "x10³/μL",
            referenceRange: "150 - 450",
            comments: "",
          },
          {
            testCode: "FBC",
            testName: "WBC",
            value: fbcValues.wbc,
            unit: "x10³/μL",
            referenceRange: "4.0 - 10.0",
            comments: "",
          },
          {
            testCode: "FBC",
            testName: "Neutrophils",
            value: fbcValues.neutrophils,
            unit: "%",
            referenceRange: "40.0 – 70.0",
            comments: "",
          },
          {
            testCode: "FBC",
            testName: "Lymphocytes",
            value: fbcValues.lymphocytes,
            unit: "%",
            referenceRange: "20.0 – 40.0",
            comments: "",
          },
          {
            testCode: "FBC",
            testName: "Eosinophils",
            value: fbcValues.eosinophils,
            unit: "%",
            referenceRange: "1.0 – 5.0",
            comments: "",
          },
          {
            testCode: "FBC",
            testName: "Monocytes",
            value: fbcValues.monocytes,
            unit: "%",
            referenceRange: "3.0 – 12.0",
            comments: "",
          },
          {
            testCode: "FBC",
            testName: "Basophils",
            value: fbcValues.basophils,
            unit: "%",
            referenceRange: "0-1",
            comments: "",
          },
          {
            testCode: "FBC",
            testName: "Neutrophils (Abs)",
            value: fbcValues.neutrophilsabs || fbcValues.neutrophilsAbs,
            unit: "x10³/μL",
            referenceRange: "2.0-7.5",
            comments: "",
          },
          {
            testCode: "FBC",
            testName: "Lymphocytes (Abs)",
            value: fbcValues.lymphocytesabs || fbcValues.lymphocytesAbs,
            unit: "x10³/μL",
            referenceRange: "1.0-4.0",
            comments: "",
          },
          {
            testCode: "FBC",
            testName: "Eosinophils (Abs)",
            value: fbcValues.eosinophilsabs || fbcValues.eosinophilsAbs,
            unit: "x10³/μL",
            referenceRange: "0.05-0.50",
            comments: "",
          },
          {
            testCode: "FBC",
            testName: "Monocytes (Abs)",
            value: fbcValues.monocytesabs || fbcValues.monocytesAbs,
            unit: "x10³/μL",
            referenceRange: "0.20-1.00",
            comments: "",
          },
          {
            testCode: "FBC",
            testName: "Basophils (Abs)",
            value: fbcValues.basophilsabs || fbcValues.basophilsAbs,
            unit: "x10³/μL",
            referenceRange: "0.00-0.20",
            comments: "",
          },
        ].filter((r) => r.value && r.value.trim() !== "");
        allResults.push(...fbcResults);
      }

      // Add Lipid results
      if (lipidValues && hasLIPID) {
        const lipidResults = [
          {
            testCode: "LIPID",
            testName: "Total Cholesterol",
            value: lipidValues.totalCholesterol,
            unit: "mg/dL",
            referenceRange: "< 200",
            comments: "",
          },
          {
            testCode: "LIPID",
            testName: "HDL Cholesterol",
            value: lipidValues.hdl,
            unit: "mg/dL",
            referenceRange: "> 40",
            comments: "",
          },
          {
            testCode: "LIPID",
            testName: "Triglycerides",
            value: lipidValues.triglycerides,
            unit: "mg/dL",
            referenceRange: "< 150",
            comments: "",
          },
          {
            testCode: "LIPID",
            testName: "VLDL Cholesterol",
            value: lipidValues.vldl,
            unit: "mg/dL",
            referenceRange: "< 40",
            comments: "",
          },
          {
            testCode: "LIPID",
            testName: "LDL Cholesterol",
            value: lipidValues.ldl,
            unit: "mg/dL",
            referenceRange: "< 150",
            comments: "",
          },
          {
            testCode: "LIPID",
            testName: "Total Cholesterol/HDL Ratio",
            value: lipidValues.tcHdlRatio,
            unit: "",
            referenceRange: "< 5.0",
            comments: "",
          },
          {
            testCode: "LIPID",
            testName: "Non-HDL Cholesterol",
            value: lipidValues.nonHdl,
            unit: "mg/dL",
            referenceRange: "< 130",
            comments: "",
          },
        ].filter((r) => r.value && r.value.trim() !== "");
        allResults.push(...lipidResults);
      }

      // Add UFR results
      if (ufrValues && hasUFR) {
        const ufrResults = [
          {
            testCode: "UFR",
            testName: "Colour",
            value: ufrValues.colour,
            unit: "",
            referenceRange: "",
            comments: "",
          },
          {
            testCode: "UFR",
            testName: "Appearance",
            value: ufrValues.appearance,
            unit: "",
            referenceRange: "",
            comments: "",
          },
          {
            testCode: "UFR",
            testName: "PH",
            value: ufrValues.ph,
            unit: "",
            referenceRange: "",
            comments: "",
          },
          {
            testCode: "UFR",
            testName: "Specific Gravity",
            value: ufrValues.specificgravity || ufrValues.specificGravity,
            unit: "",
            referenceRange: "1.010-1.025",
            comments: "",
          },
          {
            testCode: "UFR",
            testName: "Protein(Albumin)",
            value: ufrValues.proteinalbumi || ufrValues.protein,
            unit: "",
            referenceRange: "",
            comments: "",
          },
          {
            testCode: "UFR",
            testName: "Sugar(Reducing substances)",
            value: ufrValues.sugarreducingsubstances || ufrValues.sugar,
            unit: "",
            referenceRange: "",
            comments: "",
          },
          {
            testCode: "UFR",
            testName: "Urobilinogen",
            value: ufrValues.urobilinogen,
            unit: "",
            referenceRange: "",
            comments: "",
          },
          {
            testCode: "UFR",
            testName: "Bile",
            value: ufrValues.bile,
            unit: "",
            referenceRange: "",
            comments: "",
          },
          {
            testCode: "UFR",
            testName: "Acetone/KB",
            value: ufrValues.acetonekb || ufrValues.acetone,
            unit: "",
            referenceRange: "",
            comments: "",
          },
          {
            testCode: "UFR",
            testName: "Epithelial cells",
            value: ufrValues.epithelialcells || ufrValues.epithelialCells,
            unit: "/HPF",
            referenceRange: "",
            comments: "",
          },
          {
            testCode: "UFR",
            testName: "Pus cells",
            value: ufrValues.puscells || ufrValues.pusCells,
            unit: "/HPF",
            referenceRange: "",
            comments: "",
          },
          {
            testCode: "UFR",
            testName: "Red cells",
            value: ufrValues.redcells || ufrValues.redCells,
            unit: "/HPF",
            referenceRange: "",
            comments: "",
          },
          {
            testCode: "UFR",
            testName: "Crystals",
            value: ufrValues.crystals,
            unit: "/HPF",
            referenceRange: "",
            comments: "",
          },
          {
            testCode: "UFR",
            testName: "Casts",
            value: ufrValues.casts,
            unit: "/HPF",
            referenceRange: "",
            comments: "",
          },
          {
            testCode: "UFR",
            testName: "Organisms",
            value: ufrValues.organisms,
            unit: "/HPF",
            referenceRange: "",
            comments: "",
          },
          {
            testCode: "UFR",
            testName: "Others",
            value: ufrValues.others,
            unit: "",
            referenceRange: "",
            comments: "",
          },
        ].filter((r) => r.value && r.value.trim() !== "");
        allResults.push(...ufrResults);
      }

      // Add OGTT results
      if (ogttValues && hasOGTT) {
        if (ogttValues.fasting)
          allResults.push({
            testCode: "OGTT",
            testName: "Fasting Glucose",
            value: ogttValues.fasting,
            unit: "mg/dL",
            referenceRange: "60 - 115",
            comments: "",
          });
        if (ogttValues.afterOneHour)
          allResults.push({
            testCode: "OGTT",
            testName: "After 1 Hour Glucose",
            value: ogttValues.afterOneHour,
            unit: "mg/dL",
            referenceRange: "< 180",
            comments: "",
          });
        if (ogttValues.afterTwoHours)
          allResults.push({
            testCode: "OGTT",
            testName: "After 2 Hour Glucose",
            value: ogttValues.afterTwoHours,
            unit: "mg/dL",
            referenceRange: "< 140",
            comments: "",
          });
      }

      // Add PPBS results
      if (ppbsValues && hasPPBS && ppbsValues.value) {
        const referenceRange =
          ppbsValues.hourType === "After 1 Hour" ? "< 160" : "< 140";
        allResults.push({
          testCode: "PPBS",
          testName: "Post Prandial Blood Sugar",
          value: ppbsValues.value,
          unit: "mg/dL",
          referenceRange,
          comments: "",
          mealType: ppbsValues.mealType,
          hourType: ppbsValues.hourType,
        });
      }

      // Add BSS results
      if (bssValues && hasBSS && bssValues.length > 0) {
        bssValues.forEach((entry) => {
          if (entry.value && entry.value.trim() !== "") {
            const referenceRange =
              entry.hourType === "After 1 Hour" ? "< 160" : "< 140";
            allResults.push({
              testCode: "BSS",
              testName: "Post Prandial Blood Sugar",
              value: entry.value,
              unit: "mg/dL",
              referenceRange,
              comments: "",
              mealType: entry.mealType,
              hourType: entry.hourType,
            });
          }
        });
      }

      // Add BGRh results
      if (bgrhValues && hasBGRh && bgrhValues.bloodGroup && bgrhValues.rhesus) {
        allResults.push({
          testCode: "BGRh",
          testName: "Blood Grouping & Rh",
          value: bgrhValues.bloodGroup,
          unit: "",
          referenceRange: "",
          comments: bgrhValues.rhesus,
        });
      }

      await dataManager.updateReport(reportId, {
        results: allResults,
        doctorRemarks,
        reviewedBy,
        reportDate,
      });

      router.push(`/reports/${reportId}`);
    } catch (error) {
      console.error("Error updating report:", error);
      alert("Error updating report. Please check console for details.");
    } finally {
      setSaving(false);
    }
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
        <Button asChild>
          <Link href="/reports">Back to Reports</Link>
        </Button>
      </div>
    );
  }

  const uniqueTestCodes = [...new Set(report.results.map((r) => r.testCode))];
  const hasFBCTest = uniqueTestCodes.includes("FBC");
  const hasLIPIDTest = uniqueTestCodes.includes("LIPID");
  const hasUFRTest = uniqueTestCodes.includes("UFR");
  const hasOGTTTest = uniqueTestCodes.includes("OGTT");
  const hasPPBSTest = uniqueTestCodes.includes("PPBS");
  const hasBSSTest = uniqueTestCodes.includes("BSS");
  const hasBGRhTest = uniqueTestCodes.includes("BGRh");

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href={`/reports`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Report</h1>
          <p className="text-muted-foreground">
            Update test results and report information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <span className="text-sm text-muted-foreground">
                  Patient Name:
                </span>
                <div className="font-medium">{report.patientName}</div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  Patient ID:
                </span>
                <div className="font-medium">{report.patientId}</div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  Report ID:
                </span>
                <div className="font-medium">{report.id}</div>
              </div>
              <div>
                <Label htmlFor="reportDate">Report Date</Label>
                <Input
                  id="reportDate"
                  type="date"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Special Test Cards */}
        {hasFBCTest && (
          <FBCReportCard
            onValuesChange={setFbcValues}
            initialValues={fbcValues}
          />
        )}
        {hasLIPIDTest && (
          <LipidProfileReportCard
            onValuesChange={setLipidValues}
            initialValues={lipidValues}
          />
        )}
        {hasUFRTest && (
          <UFRReportCard
            onValuesChange={setUfrValues}
            initialValues={ufrValues}
          />
        )}
        {hasOGTTTest && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                OGTT - Oral Glucose Tolerance Test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="ogtt-fasting">Fasting (mg/dL)</Label>
                  <Input
                    id="ogtt-fasting"
                    type="number"
                    value={ogttValues?.fasting || ""}
                    onChange={(e) =>
                      setOgttValues({ ...ogttValues, fasting: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ogtt-1hour">After 1 Hour (mg/dL)</Label>
                  <Input
                    id="ogtt-1hour"
                    type="number"
                    value={ogttValues?.afterOneHour || ""}
                    onChange={(e) =>
                      setOgttValues({
                        ...ogttValues,
                        afterOneHour: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ogtt-2hour">After 2 Hour (mg/dL)</Label>
                  <Input
                    id="ogtt-2hour"
                    type="number"
                    value={ogttValues?.afterTwoHours || ""}
                    onChange={(e) =>
                      setOgttValues({
                        ...ogttValues,
                        afterTwoHours: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              {ogttValues &&
                (ogttValues.fasting ||
                  ogttValues.afterOneHour ||
                  ogttValues.afterTwoHours) && (
                  <OGTTGraph
                    fasting={ogttValues.fasting || ""}
                    afterOneHour={ogttValues.afterOneHour || ""}
                    afterTwoHours={ogttValues.afterTwoHours || ""}
                  />
                )}
            </CardContent>
          </Card>
        )}
        {hasPPBSTest && (
          <PPBSReportCard
            onValuesChange={setPpbsValues}
            initialValues={ppbsValues}
          />
        )}
        {hasBSSTest && (
          <BSSReportCard
            onValuesChange={setBssValues}
            initialValues={bssValues}
          />
        )}
        {hasBGRhTest && (
          <BGRhReportCard
            onValuesChange={setBgrhValues}
            initialValues={bgrhValues}
          />
        )}

        {/* Other Test Results */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Test Results
              </CardTitle>
              <CardDescription>
                Update test values. Values outside reference range will be
                highlighted.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {results.map((result, index) => {
                const testDetails = testCatalog.find(
                  (t) => t.code === result.testCode
                );
                const isQualitative = testDetails?.isQualitative || false;
                const indicatorClass =
                  !isQualitative && result.value
                    ? getValueIndicatorClass(
                        result.value,
                        result.referenceRange
                      )
                    : "";

                return (
                  <div
                    key={`${result.testCode}-${result.testName}-${index}`}
                    className={`p-4 border rounded-lg space-y-4 transition-colors ${indicatorClass}`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">{result.testCode}</Badge>
                      <span className="font-medium">{result.testName}</span>
                      {isQualitative && (
                        <Badge variant="secondary" className="ml-2">
                          Qualitative
                        </Badge>
                      )}
                      {!isQualitative && result.value && (
                        <>
                          {isValueInRange(
                            result.value,
                            result.referenceRange
                          ) === true && (
                            <Badge
                              variant="default"
                              className="ml-2 bg-green-600"
                            >
                              Normal
                            </Badge>
                          )}
                          {isValueInRange(
                            result.value,
                            result.referenceRange
                          ) === false && (
                            <Badge variant="destructive" className="ml-2">
                              Out of Range
                            </Badge>
                          )}
                        </>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor={`value-${index}`}>
                          {isQualitative ? "Result" : "Value"}
                        </Label>
                        {isQualitative ? (
                          <Select
                            value={result.value}
                            onValueChange={(value) =>
                              updateResult(result.testName, "value", value)
                            }
                          >
                            <SelectTrigger id={`value-${index}`}>
                              <SelectValue placeholder="Select result" />
                            </SelectTrigger>
                            <SelectContent>
                              {getQualitativeOptions(result.testCode).map(
                                (option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            id={`value-${index}`}
                            type="number"
                            step="0.01"
                            value={result.value}
                            onChange={(e) =>
                              updateResult(
                                result.testName,
                                "value",
                                e.target.value
                              )
                            }
                            placeholder="Enter value"
                          />
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`unit-${index}`}>Unit</Label>
                        <Input
                          id={`unit-${index}`}
                          value={result.unit}
                          onChange={(e) =>
                            updateResult(
                              result.testName,
                              "unit",
                              e.target.value
                            )
                          }
                          placeholder="e.g., mg/dL"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`range-${index}`}>
                          Reference Range
                        </Label>
                        <Input
                          id={`range-${index}`}
                          value={result.referenceRange}
                          onChange={(e) =>
                            updateResult(
                              result.testName,
                              "referenceRange",
                              e.target.value
                            )
                          }
                          placeholder="e.g., 70-110"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`comments-${index}`}>Comments</Label>
                      <Textarea
                        id={`comments-${index}`}
                        value={result.comments}
                        onChange={(e) =>
                          updateResult(
                            result.testName,
                            "comments",
                            e.target.value
                          )
                        }
                        placeholder="Additional notes"
                        rows={2}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Doctor Remarks Section */}
        <Card>
          <CardHeader>
            <CardTitle>Doctor's Remarks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                value={doctorRemarks}
                onChange={(e) => setDoctorRemarks(e.target.value)}
                placeholder="Enter doctor's remarks"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reviewedBy">Reviewed By</Label>
              <Input
                id="reviewedBy"
                value={reviewedBy}
                onChange={(e) => setReviewedBy(e.target.value)}
                placeholder="Doctor's name"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button type="submit" disabled={saving} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/reports/${reportId}`)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
