"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  Save,
  User,
  FileText,
  TestTube,
  CheckCircle2,
  Circle,
} from "lucide-react";
import {
  DataManager,
  type Patient,
  type Invoice,
  type ReportResult,
} from "@/lib/data-manager";
import { FBCReportCard } from "@/components/fbc-report-card";
import { TestSelectionComponent } from "@/components/test-selection";
import { useAuth } from "@/components/auth-provider";
import Link from "next/link";
import { UFRReportCard } from "@/components/ufr-report-card";
import { LipidProfileReportCard } from "@/components/lipid-profile-report-card";
import { OGTTGraph } from "@/components/ogtt-graph";
import { PPBSReportCard } from "@/components/ppbs-report-card";
import { BSSReportCard } from "@/components/bss-report-card";
import { BGRhReportCard } from "@/components/bgrh-report-card";
import { Checkbox } from "@/components/ui/checkbox";

// Helper function to check if a value is within reference range
function isValueInRange(value: string, referenceRange: string): boolean | null {
  if (!value || !referenceRange || value.trim() === "") return null;

  const numValue = parseFloat(value);
  if (isNaN(numValue)) return null; // Can't determine for non-numeric values

  // Handle ranges like "4.0-11.0" or "4.0 - 11.0"
  const rangeMatch = referenceRange.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/);
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]);
    const max = parseFloat(rangeMatch[2]);
    return numValue >= min && numValue <= max;
  }

  // Handle "< X" ranges
  const lessThanMatch = referenceRange.match(/[<]\s*(\d+\.?\d*)/);
  if (lessThanMatch) {
    const max = parseFloat(lessThanMatch[1]);
    return numValue < max;
  }

  // Handle "> X" ranges
  const greaterThanMatch = referenceRange.match(/[>]\s*(\d+\.?\d*)/);
  if (greaterThanMatch) {
    const min = parseFloat(greaterThanMatch[1]);
    return numValue > min;
  }

  // Can't determine
  return null;
}

// Helper function to get indicator color classes
function getValueIndicatorClass(value: string, referenceRange: string): string {
  const inRange = isValueInRange(value, referenceRange);

  if (inRange === null) return ""; // No indicator for non-numeric or indeterminate
  if (inRange) return "border-l-4 border-l-green-500 bg-green-50"; // In range - green
  return "border-l-4 border-l-red-500 bg-red-50"; // Out of range - red
}

// Helper function to get qualitative options for a test
function getQualitativeOptions(
  testCode: string
): { value: string; label: string }[] {
  // Special cases for specific tests
  if (testCode === "VDRL") {
    return [
      { value: "Reactive", label: "Reactive" },
      { value: "Non-Reactive", label: "Non-Reactive" },
    ];
  }

  // Default qualitative options
  return [
    { value: "Positive", label: "Positive" },
    { value: "Negative", label: "Negative" },
  ];
}

// Helper function to extract unit from reference range
function getUnitFromRange(range: string): string {
  // Extract unit from ranges like "4.0-11.0 x10³/μL" or "12.0-16.0 g/dL" or "< 8 IU/ml"
  // Pattern: match numbers, spaces, operators (<, >, =, -), then capture everything after
  const unitMatch = range.match(/^[\s\d\.\-<>=]+\s*(.+?)(?:\s*\(.*\))?$/);
  if (unitMatch && unitMatch[1]) {
    return unitMatch[1].trim();
  }
  return "";
}

async function getDefaultReferenceRange(
  testCode: string,
  componentName: string,
  dataManager: any
): Promise<string> {
  const test = await dataManager.getTestByCode(testCode);
  if (!test || !test.referenceRange) return "";

  // For components like "Total Cholesterol" from "Lipid Profile - Total Cholesterol"
  const cleanComponentName = componentName.replace(/.*\s-\s/, "");

  return (
    test.referenceRange[componentName] ||
    test.referenceRange[cleanComponentName] ||
    ""
  );
}

// Helper function to get unit and reference range from test catalog
async function getTestDetails(
  testCode: string,
  componentName: string,
  dataManager: any
) {
  const test = await dataManager.getTestByCode(testCode);

  if (!test) {
    return { unit: "", referenceRange: "" };
  }

  // For single-component tests, use the test's unit directly
  if (Object.keys(test.referenceRange).length === 1) {
    const firstRange = Object.entries(test.referenceRange)[0];
    return {
      unit: test.unit,
      referenceRange: firstRange ? firstRange[1] : "",
    };
  }

  // For multi-component tests, find the specific component's reference range
  const cleanComponentName = componentName.replace(/.*\s-\s/, "");
  const referenceRange =
    test.referenceRange[componentName] ||
    test.referenceRange[cleanComponentName] ||
    "";

  // NEW: Check if test has unitPerTest mapping for specific components
  let componentUnit = test.unit; // Default to test's general unit
  if (test.unitPerTest) {
    componentUnit =
      test.unitPerTest[componentName] ||
      test.unitPerTest[cleanComponentName] ||
      test.unit;
  }

  return {
    unit: componentUnit,
    referenceRange: referenceRange,
  };
}

export default function NewReportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [useDirectTestSelection, setUseDirectTestSelection] = useState(false);
  const [results, setResults] = useState<ReportResult[]>([]);
  const [fbcValues, setFbcValues] = useState<any>(null);
  const [doctorRemarks, setDoctorRemarks] = useState("");
  const [reviewedBy, setReviewedBy] = useState("Dr. Lab Director");
  const [pathologyReport, setPathologyReport] = useState<any>(null);
  const [lipidValues, setLipidValues] = useState<any>(null);
  const [ufrValues, setUfrValues] = useState<any>(null);
  const [ogttValues, setOgttValues] = useState<any>(null);
  const [ppbsValues, setPpbsValues] = useState<any>(null);
  const [bssValues, setBssValues] = useState<any[]>([]);
  const [testCatalog, setTestCatalog] = useState<any[]>([]);
  const [patientSearchTerm, setPatientSearchTerm] = useState("");
  const [reportDate, setReportDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [bgrhValues, setBgrhValues] = useState<any>(null);
  const [searchTestTerm, setSearchTestTerm] = useState("");
  const [completedTests, setCompletedTests] = useState<string[]>([]);
  const [testSelectionOrder, setTestSelectionOrder] = useState<string[]>([]);

  // Helper function to check if a test has been filled
  const isTestFilled = (testCode: string): boolean => {
    switch (testCode) {
      case "FBC":
        return (
          fbcValues &&
          Object.values(fbcValues).some((v) => v && String(v).trim() !== "")
        );
      case "LIPID":
        return (
          lipidValues &&
          Object.values(lipidValues).some((v) => v && String(v).trim() !== "")
        );
      case "UFR":
        return (
          ufrValues &&
          Object.values(ufrValues).some((v) => v && String(v).trim() !== "")
        );
      case "OGTT":
        return (
          ogttValues &&
          (ogttValues.fasting ||
            ogttValues.afterOneHour ||
            ogttValues.afterTwoHours)
        );
      case "PPBS":
        return ppbsValues && ppbsValues.value && ppbsValues.value.trim() !== "";
      case "BSS":
        return (
          bssValues &&
          bssValues.length > 0 &&
          bssValues.some((entry) => entry.value && entry.value.trim() !== "")
        );
      case "BGRh":
        return bgrhValues && bgrhValues.bloodGroup && bgrhValues.rhesus;
      default:
        // For regular tests, check if any result value is filled
        return results.some(
          (r) => r.testCode === testCode && r.value.trim() !== ""
        );
    }
  };

  // Auto-select test when values are entered
  const autoSelectTest = (testCode: string) => {
    if (!selectedTests.includes(testCode)) {
      const newSelected = [...selectedTests, testCode];
      setSelectedTests(newSelected);

      // Add to order if not already there
      if (!testSelectionOrder.includes(testCode)) {
        setTestSelectionOrder([...testSelectionOrder, testCode]);
      }
    }
  };

  // Get test name from catalog
  const getTestName = (testCode: string): string => {
    const test = testCatalog.find((t) => t.code === testCode);
    return test?.name || testCode;
  };

  const hasUFRTest = selectedTests.includes("UFR");
  const hasLipidProfileTest = selectedTests.includes("LIPID");
  const hasOGTTTest = selectedTests.includes("OGTT");
  const hasPPBSTest = selectedTests.includes("PPBS");
  const hasBSSTest = selectedTests.includes("BSS");
  const hasBGRhTest = selectedTests.includes("BGRh");
  const hasFBCTest = selectedTests.includes("FBC");

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/");
      return;
    }

    // Load data
    async function loadData() {
      const dataManager = DataManager.getInstance();
      const patientsData = await dataManager.getPatients();
      const invoicesData = await dataManager.getInvoices();
      const catalogData = await dataManager.getTestCatalog();
      setTestCatalog(catalogData);
      setPatients(patientsData);
      setInvoices(invoicesData);
      setLoading(false);

      // Auto-select patient from query parameter (moved inside loadData)
      const patientIdParam = searchParams.get("patientId");
      if (patientIdParam) {
        const patient = patientsData.find(
          (p: Patient) => p.id === patientIdParam
        );
        if (patient) {
          setSelectedPatient(patient);
          console.log(
            `Auto-selected patient: ${patient.firstName} ${patient.lastName}`
          );
        }
      }
    }

    loadData();
  }, [user, authLoading, router, searchParams]);


  const handlePatientChange = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    setSelectedPatient(patient || null);
    setSelectedInvoice(null);
    setSelectedTests([]);
    setTestSelectionOrder([]);
    setCompletedTests([]);
    setUseDirectTestSelection(true);
    setResults([]);
    setFbcValues(null);
    setLipidValues(null);
    setUfrValues(null);
    setOgttValues(null);
    setPpbsValues(null);
    setBssValues([]);
    setPatientSearchTerm("");
    setBgrhValues(null);
    setSearchTestTerm("");
  };

  const updateResult = (
    testName: string,
    field: keyof ReportResult,
    value: string
  ) => {
    let updatedResults = results.map((result) =>
      result.testName === testName ? { ...result, [field]: value } : result
    );

    // Auto-select test when value is entered
    const result = results.find((r) => r.testName === testName);
    if (result && value.trim() !== "") {
      autoSelectTest(result.testCode);
    }

    // Lipid Profile auto-calculations
    const getVal = (name: string) => {
      const res = updatedResults.find((r) => r.testName.includes(name));
      return res ? parseFloat(res.value) || 0 : 0;
    };

    if (testName.includes("Lipid Profile")) {
      const totalChol = getVal("Total Cholesterol");
      const hdl = getVal("HDL Cholesterol");
      const tg = getVal("Triglycerides");

      // Calculate VLDL = TG / 5
      updatedResults = updatedResults.map((r) =>
        r.testName.includes("VLDL Cholesterol")
          ? { ...r, value: tg > 0 ? (tg / 5).toFixed(2) : "" }
          : r
      );

      // Calculate LDL = TC - (HDL + VLDL)
      const vldl = tg > 0 ? tg / 5 : 0;
      updatedResults = updatedResults.map((r) =>
        r.testName.includes("LDL Cholesterol")
          ? {
              ...r,
              value: totalChol > 0 ? (totalChol - (hdl + vldl)).toFixed(2) : "",
            }
          : r
      );

      // Calculate TC/HDL Ratio
      updatedResults = updatedResults.map((r) =>
        r.testName.includes("Total Cholesterol/HDL Ratio")
          ? { ...r, value: hdl > 0 ? (totalChol / hdl).toFixed(2) : "" }
          : r
      );
    }

    setResults(updatedResults);
  };

  const handleFBCValuesChange = (values: any) => {
    setFbcValues(values);
  };

  const handleTestSelection = async (testCodes: string[]) => {
    // Prevent infinite loops by checking if the selection has actually changed
    if (
      JSON.stringify(testCodes.sort()) === JSON.stringify(selectedTests.sort())
    ) {
      return;
    }

    setSelectedTests(testCodes);

    // Update selection order - keep existing order and add new ones
    const newOrder = [...testSelectionOrder];
    testCodes.forEach((code) => {
      if (!newOrder.includes(code)) {
        newOrder.push(code);
      }
    });
    // Remove deselected tests from order
    const finalOrder = newOrder.filter((code) => testCodes.includes(code));
    setTestSelectionOrder(finalOrder);

    // Initialize results from selected tests
    const dataManager = DataManager.getInstance();
    const testCatalog = await dataManager.getTestCatalog();
    const initialResults: ReportResult[] = [];

    testCodes.forEach((testCode) => {
      const test = testCatalog.find((t) => t.code === testCode);
      const referenceRanges = test?.referenceRange || {};

      // Handle FBC, LIPID, UFR, OGTT, PPBS, BSS, BGRh specially - don't create individual result entries
      if (
        testCode === "FBC" ||
        testCode === "LIPID" ||
        testCode === "UFR" ||
        testCode === "OGTT" ||
        testCode === "PPBS" ||
        testCode === "BSS" ||
        testCode === "BGRh"
      ) {
        return;
      }

      // For multi-component tests, create separate result entries for each component
      if (Object.keys(referenceRanges).length > 1) {
        const componentsToIterate: [string, any][] = test?.componentOrder
          ? test.componentOrder.map(
              (componentName: string) =>
                [componentName, referenceRanges[componentName]] as [string, any]
            )
          : Object.entries(referenceRanges);

        componentsToIterate.forEach(([component, range]: [string, any]) => {
          const componentUnit =
            test?.unitPerTest?.[component] || test?.unit || "";

          initialResults.push({
            testCode: testCode,
            testName: component,
            value: "",
            unit: componentUnit,
            referenceRange: String(range),
            comments: "",
          });
        });
      } else {
        // For single-component tests - use the reference range key
        const firstRange = Object.entries(referenceRanges)[0];
        const componentName = firstRange
          ? firstRange[0]
          : test?.name || testCode;

        // Handle nested reference ranges (like Man/Woman for Haemoglobin)
        let referenceRangeValue = "";
        if (firstRange) {
          const rangeValue = firstRange[1];
          if (typeof rangeValue === "object" && rangeValue !== null) {
            // Store as JSON string for nested objects
            referenceRangeValue = JSON.stringify(rangeValue);
          } else {
            referenceRangeValue = String(rangeValue);
          }
        }

        initialResults.push({
          testCode: testCode,
          testName: componentName,
          value: "",
          unit: test?.unit || "",
          referenceRange: referenceRangeValue,
          comments: "",
        });
      }
    });

    setResults(initialResults);
  };

  const hasUFRResults =
    ufrValues &&
    hasUFRTest &&
    Object.values(ufrValues).some((v) => v && String(v).trim() !== "");

  const hasOGTTResults =
    ogttValues &&
    hasOGTTTest &&
    (ogttValues.fasting || ogttValues.afterOneHour || ogttValues.afterTwoHours);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || selectedTests.length === 0) return;

    setSaving(true);

    try {
      const dataManager = DataManager.getInstance();

      // Prepare all results - USE SELECTION ORDER
      const allResults: ReportResult[] = [];

      // Sort tests by selection order
      const orderedTests = testSelectionOrder.filter((code) =>
        selectedTests.includes(code)
      );

      // Process tests in the order they were selected
      for (const testCode of orderedTests) {
        // Add FBC results if this is FBC test
        if (testCode === "FBC" && fbcValues) {
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
              value: fbcValues.rdwCv,
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
              value: fbcValues.neutrophilsAbs,
              unit: "x10³/μL",
              referenceRange: "2.0-7.5",
              comments: "",
            },
            {
              testCode: "FBC",
              testName: "Lymphocytes (Abs)",
              value: fbcValues.lymphocytesAbs,
              unit: "x10³/μL",
              referenceRange: "1.0-4.0",
              comments: "",
            },
            {
              testCode: "FBC",
              testName: "Eosinophils (Abs)",
              value: fbcValues.eosinophilsAbs,
              unit: "x10³/μL",
              referenceRange: "0.05-0.50",
              comments: "",
            },
            {
              testCode: "FBC",
              testName: "Monocytes (Abs)",
              value: fbcValues.monocytesAbs,
              unit: "x10³/μL",
              referenceRange: "0.20-1.00",
              comments: "",
            },
            {
              testCode: "FBC",
              testName: "Basophils (Abs)",
              value: fbcValues.basophilsAbs,
              unit: "x10³/μL",
              referenceRange: "0.00-0.20",
              comments: "",
            },
          ].filter((r) => r.value && r.value.trim() !== "");

          allResults.push(...fbcResults);
        }

        // Add Lipid Profile results if this is LIPID test
        if (testCode === "LIPID" && lipidValues) {
          const lipidResults = [
            {
              testCode: "LIPID",
              testName: "Cholesterol-Total",
              value: lipidValues.totalCholesterol,
              unit: "mg/dL",
              referenceRange:
                "Desirable <200\nBorderline High 200 - 239\nHigh >239",
              comments: "",
            },
            {
              testCode: "LIPID",
              testName: "HDL Cholesterol",
              value: lipidValues.hdl,
              unit: "mg/dL",
              referenceRange: "40 - 60",
              comments: "",
            },
            {
              testCode: "LIPID",
              testName: "LDL Cholesterol",
              value: lipidValues.ldl,
              unit: "mg/dL",
              referenceRange:
                "Desirable <=129\nBorderline High 129 - 160\nHigh >160",
              comments: "",
            },
            {
              testCode: "LIPID",
              testName: "VLDL Cholesterol",
              value: lipidValues.vldl,
              unit: "mg/dL",
              referenceRange: "7 - 35",
              comments: "",
            },
            {
              testCode: "LIPID",
              testName: "Triglycerides",
              value: lipidValues.triglycerides,
              unit: "mg/dL",
              referenceRange:
                "Normal: < 150\nHigh: 150-199\nHypertriglyceridemia 200-500\nVery High: > 500",
              comments: "",
            },
            {
              testCode: "LIPID",
              testName: "TC/HDL Ratio",
              value: lipidValues.tcHdlRatio,
              unit: "",
              referenceRange: "3.0 - 5.0",
              comments: "",
            },
          ].filter((r) => r.value && r.value.trim() !== "");

          allResults.push(...lipidResults);
        }

        // Add UFR results if this is UFR test
        if (testCode === "UFR" && ufrValues) {
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
              value: ufrValues.specificGravity,
              unit: "",
              referenceRange: "1.010-1.025",
              comments: "",
            },
            {
              testCode: "UFR",
              testName: "Protein(Albumin)",
              value: ufrValues.protein,
              unit: "",
              referenceRange: "",
              comments: "",
            },
            {
              testCode: "UFR",
              testName: "Sugar(Reducing substances)",
              value: ufrValues.sugar,
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
              value: ufrValues.acetone,
              unit: "",
              referenceRange: "",
              comments: "",
            },
            {
              testCode: "UFR",
              testName: "Epithelial cells",
              value: ufrValues.epithelialCells,
              unit: "/HPF",
              referenceRange: "",
              comments: "",
            },
            {
              testCode: "UFR",
              testName: "Pus cells",
              value: ufrValues.pusCells,
              unit: "/HPF",
              referenceRange: "",
              comments: "",
            },
            {
              testCode: "UFR",
              testName: "Red cells",
              value: ufrValues.redCells,
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

        // Add OGTT results if this is OGTT test
        if (testCode === "OGTT" && ogttValues) {
          const ogttResultsArray = [];

          if (ogttValues.fasting && ogttValues.fasting.trim() !== "") {
            ogttResultsArray.push({
              testCode: "OGTT",
              testName: "Fasting Glucose",
              value: ogttValues.fasting,
              unit: "mg/dL",
              referenceRange: "60 - 115",
              comments: "",
            });
          }

          if (
            ogttValues.afterOneHour &&
            ogttValues.afterOneHour.trim() !== ""
          ) {
            ogttResultsArray.push({
              testCode: "OGTT",
              testName: "After 1 Hour Glucose",
              value: ogttValues.afterOneHour,
              unit: "mg/dL",
              referenceRange: "< 180",
              comments: "",
            });
          }

          if (
            ogttValues.afterTwoHours &&
            ogttValues.afterTwoHours.trim() !== ""
          ) {
            ogttResultsArray.push({
              testCode: "OGTT",
              testName: "After 2 Hour Glucose",
              value: ogttValues.afterTwoHours,
              unit: "mg/dL",
              referenceRange: "< 140",
              comments: "",
            });
          }

          allResults.push(...ogttResultsArray);
        }

        // Add PPBS results if this is PPBS test
        if (
          testCode === "PPBS" &&
          ppbsValues &&
          ppbsValues.value &&
          ppbsValues.value.trim() !== ""
        ) {
          const referenceRange =
            ppbsValues.hourType === "After 1 Hour" ? "< 160" : "< 140";

          allResults.push({
            testCode: "PPBS",
            testName: "Post Prandial Blood Sugar",
            value: ppbsValues.value,
            unit: "mg/dL",
            referenceRange: referenceRange,
            comments: "",
            mealType: ppbsValues.mealType,
            hourType: ppbsValues.hourType,
          });
        }

        // Add BSS results if this is BSS test
        if (testCode === "BSS" && bssValues && bssValues.length > 0) {
          bssValues.forEach((entry) => {
            if (entry.value && entry.value.trim() !== "") {
              const referenceRange =
                entry.hourType === "After 1 Hour" ? "< 160" : "< 140";

              allResults.push({
                testCode: "BSS",
                testName: "Post Prandial Blood Sugar",
                value: entry.value,
                unit: "mg/dL",
                referenceRange: referenceRange,
                comments: "",
                mealType: entry.mealType,
                hourType: entry.hourType,
              });
            }
          });
        }

        // Add BGRh results if this is BGRh test
        if (
          testCode === "BGRh" &&
          bgrhValues &&
          bgrhValues.bloodGroup &&
          bgrhValues.rhesus
        ) {
          allResults.push({
            testCode: "BGRh",
            testName: "Blood Grouping & Rh",
            value: bgrhValues.bloodGroup,
            unit: "",
            referenceRange: "",
            comments: bgrhValues.rhesus,
          });
        }

        // Add regular test results
        if (
          !["FBC", "LIPID", "UFR", "OGTT", "PPBS", "BSS", "BGRh"].includes(
            testCode
          )
        ) {
          const regularResults = results.filter(
            (r) => r.testCode === testCode && r.value.trim() !== ""
          );
          allResults.push(...regularResults);
        }
      }

      if (allResults.length === 0) {
        console.error("No results to save!");
        setSaving(false);
        return;
      }

      console.log("All results to save (in order):", allResults);

      const report = await dataManager.addReport({
        patientId: selectedPatient.id,
        patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        invoiceId: selectedInvoice?.id || null,
        results: allResults,
        doctorRemarks,
        reviewedBy,
        reportDate: reportDate,
      });

      // Redirect to report details page
      router.push(`/reports/${report.id}`);
    } catch (error) {
      console.error("Error saving report:", error);
      alert("Error saving report. Please check console for details.");
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteIndividualTest = async (testCode: string) => {
    if (!selectedPatient) return;

    setSaving(true);

    try {
      const dataManager = DataManager.getInstance();
      const allResults: ReportResult[] = [];

      // Collect results for this specific test
      switch (testCode) {
        case "FBC":
          if (fbcValues) {
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
                value: fbcValues.rdwCv,
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
                value: fbcValues.neutrophilsAbs,
                unit: "x10³/μL",
                referenceRange: "2.0-7.5",
                comments: "",
              },
              {
                testCode: "FBC",
                testName: "Lymphocytes (Abs)",
                value: fbcValues.lymphocytesAbs,
                unit: "x10³/μL",
                referenceRange: "1.0-4.0",
                comments: "",
              },
              {
                testCode: "FBC",
                testName: "Eosinophils (Abs)",
                value: fbcValues.eosinophilsAbs,
                unit: "x10³/μL",
                referenceRange: "0.05-0.50",
                comments: "",
              },
              {
                testCode: "FBC",
                testName: "Monocytes (Abs)",
                value: fbcValues.monocytesAbs,
                unit: "x10³/μL",
                referenceRange: "0.20-1.00",
                comments: "",
              },
              {
                testCode: "FBC",
                testName: "Basophils (Abs)",
                value: fbcValues.basophilsAbs,
                unit: "x10³/μL",
                referenceRange: "0.00-0.20",
                comments: "",
              },
            ].filter((r) => r.value && r.value.trim() !== "");
            allResults.push(...fbcResults);
          }
          break;

        case "LIPID":
          if (lipidValues) {
            const lipidResults = [
              {
                testCode: "LIPID",
                testName: "Cholesterol-Total",
                value: lipidValues.totalCholesterol,
                unit: "mg/dL",
                referenceRange:
                  "Desirable <200\nBorderline High 200 - 239\nHigh >239",
                comments: "",
              },
              {
                testCode: "LIPID",
                testName: "HDL Cholesterol",
                value: lipidValues.hdl,
                unit: "mg/dL",
                referenceRange: "40 - 60",
                comments: "",
              },
              {
                testCode: "LIPID",
                testName: "Triglycerides",
                value: lipidValues.triglycerides,
                unit: "mg/dL",
                referenceRange:
                  "Normal: < 150\nHigh: 150-199\nHypertriglyceridemia 200-500\nVery High: > 500",
                comments: "",
              },
              {
                testCode: "LIPID",
                testName: "VLDL Cholesterol",
                value: lipidValues.vldl,
                unit: "mg/dL",
                referenceRange: "7 - 35",
                comments: "",
              },
              {
                testCode: "LIPID",
                testName: "LDL Cholesterol",
                value: lipidValues.ldl,
                unit: "mg/dL",
                referenceRange:
                  "Desirable <=129\nBorderline High 129 - 160\nHigh >160",
                comments: "",
              },
              {
                testCode: "LIPID",
                testName: "TC/HDL Ratio",
                value: lipidValues.tcHdlRatio,
                unit: "",
                referenceRange: "3.0 - 5.0",
                comments: "",
              },
            ].filter((r) => r.value && r.value.trim() !== "");
            allResults.push(...lipidResults);
          }
          break;

        case "UFR":
          if (ufrValues) {
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
                value: ufrValues.specificGravity,
                unit: "",
                referenceRange: "1.010-1.025",
                comments: "",
              },
              {
                testCode: "UFR",
                testName: "Protein(Albumin)",
                value: ufrValues.protein,
                unit: "",
                referenceRange: "",
                comments: "",
              },
              {
                testCode: "UFR",
                testName: "Sugar(Reducing substances)",
                value: ufrValues.sugar,
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
                value: ufrValues.acetone,
                unit: "",
                referenceRange: "",
                comments: "",
              },
              {
                testCode: "UFR",
                testName: "Epithelial cells",
                value: ufrValues.epithelialCells,
                unit: "/HPF",
                referenceRange: "",
                comments: "",
              },
              {
                testCode: "UFR",
                testName: "Pus cells",
                value: ufrValues.pusCells,
                unit: "/HPF",
                referenceRange: "",
                comments: "",
              },
              {
                testCode: "UFR",
                testName: "Red cells",
                value: ufrValues.redCells,
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
          break;

        case "OGTT":
          if (ogttValues) {
            const ogttResultsArray = [];
            if (ogttValues.fasting && ogttValues.fasting.trim() !== "") {
              ogttResultsArray.push({
                testCode: "OGTT",
                testName: "Fasting Glucose",
                value: ogttValues.fasting,
                unit: "mg/dL",
                referenceRange: "60 - 115",
                comments: "",
              });
            }
            if (
              ogttValues.afterOneHour &&
              ogttValues.afterOneHour.trim() !== ""
            ) {
              ogttResultsArray.push({
                testCode: "OGTT",
                testName: "After 1 Hour Glucose",
                value: ogttValues.afterOneHour,
                unit: "mg/dL",
                referenceRange: "< 180",
                comments: "",
              });
            }
            if (
              ogttValues.afterTwoHours &&
              ogttValues.afterTwoHours.trim() !== ""
            ) {
              ogttResultsArray.push({
                testCode: "OGTT",
                testName: "After 2 Hour Glucose",
                value: ogttValues.afterTwoHours,
                unit: "mg/dL",
                referenceRange: "< 140",
                comments: "",
              });
            }
            allResults.push(...ogttResultsArray);
          }
          break;

        case "PPBS":
          if (
            ppbsValues &&
            ppbsValues.value &&
            ppbsValues.value.trim() !== ""
          ) {
            const referenceRange =
              ppbsValues.hourType === "After 1 Hour" ? "< 160" : "< 140";
            allResults.push({
              testCode: "PPBS",
              testName: "Post Prandial Blood Sugar",
              value: ppbsValues.value,
              unit: "mg/dL",
              referenceRange: referenceRange,
              comments: "",
              mealType: ppbsValues.mealType,
              hourType: ppbsValues.hourType,
            });
          }
          break;

        case "BSS":
          if (bssValues && bssValues.length > 0) {
            bssValues.forEach((entry) => {
              if (entry.value && entry.value.trim() !== "") {
                const referenceRange =
                  entry.hourType === "After 1 Hour" ? "< 160" : "< 140";
                allResults.push({
                  testCode: "BSS",
                  testName: "Post Prandial Blood Sugar",
                  value: entry.value,
                  unit: "mg/dL",
                  referenceRange: referenceRange,
                  comments: "",
                  mealType: entry.mealType,
                  hourType: entry.hourType,
                });
              }
            });
          }
          break;

        case "BGRh":
          if (bgrhValues && bgrhValues.bloodGroup && bgrhValues.rhesus) {
            allResults.push({
              testCode: "BGRh",
              testName: "Blood Grouping & Rh",
              value: bgrhValues.bloodGroup,
              unit: "",
              referenceRange: "",
              comments: bgrhValues.rhesus,
            });
          }
          break;

        default:
          // Regular tests
          const testResults = results.filter(
            (r) => r.testCode === testCode && r.value.trim() !== ""
          );
          allResults.push(...testResults);
          break;
      }

      if (allResults.length === 0) {
        alert("Please enter values for this test before completing.");
        setSaving(false);
        return;
      }

      // Create report with single test
      const report = await dataManager.addReport({
        patientId: selectedPatient.id,
        patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        invoiceId: selectedInvoice?.id || null,
        results: allResults,
        doctorRemarks,
        reviewedBy,
        reportDate: reportDate,
      });

      // Mark test as completed
      setCompletedTests([...completedTests, testCode]);

      // Open in new tab
      window.open(`/reports/${report.id}`, "_blank");

      setSaving(false);
    } catch (error) {
      console.error("Error saving individual test report:", error);
      alert("Error saving report. Please check console for details.");
      setSaving(false);
    }
  };

  const hasPPBSResults =
    ppbsValues &&
    hasPPBSTest &&
    ppbsValues.value &&
    ppbsValues.value.trim() !== "";

  const hasBSSResults =
    bssValues &&
    hasBSSTest &&
    bssValues.length > 0 &&
    bssValues.some((entry) => entry.value && entry.value.trim() !== "");

  const hasBGRhResults =
    bgrhValues && hasBGRhTest && bgrhValues.bloodGroup && bgrhValues.rhesus;

  const isFormValid = () => {
    // Check if at least one test is selected (checked)
    if (selectedTests.length === 0) return false;

    const hasRegularResults = results.some(
      (r) => selectedTests.includes(r.testCode) && r.value.trim() !== ""
    );

    const hasFBCResults =
      fbcValues &&
      selectedTests.includes("FBC") &&
      Object.values(fbcValues).some((v) => v && String(v).trim() !== "");

    const hasLipidResults =
      lipidValues &&
      selectedTests.includes("LIPID") &&
      Object.values(lipidValues).some((v) => v && String(v).trim() !== "");

    const hasPathologyResults =
      pathologyReport &&
      pathologyReport.report &&
      pathologyReport.report.trim() !== "";

    return (
      selectedPatient &&
      selectedTests.length > 0 &&
      (hasRegularResults ||
        hasFBCResults ||
        hasLipidResults ||
        hasPathologyResults ||
        (hasUFRResults && selectedTests.includes("UFR")) ||
        (hasOGTTResults && selectedTests.includes("OGTT")) ||
        (hasPPBSResults && selectedTests.includes("PPBS")) ||
        (hasBSSResults && selectedTests.includes("BSS")) ||
        (hasBGRhResults && selectedTests.includes("BGRh"))) &&
      reviewedBy.trim() !== ""
    );
  };

  // ADD THE KEYBOARD SHORTCUT HOOK RIGHT HERE - AFTER isFormValid
useEffect(() => {
  const handleKeyPress = (event: KeyboardEvent) => {
    // Check if "G" key is pressed (case insensitive)
    // Also check if user is not typing in an input/textarea
    const target = event.target as HTMLElement;
    const isTyping = 
      target.tagName === 'INPUT' || 
      target.tagName === 'TEXTAREA' || 
      target.isContentEditable;

    if (
      (event.key === 'g' || event.key === 'G') && 
      !isTyping && 
      !event.ctrlKey && 
      !event.metaKey && 
      !event.altKey
    ) {
      event.preventDefault();
      
      // Only trigger if form is valid and not already saving
      if (isFormValid() && !saving && selectedPatient && selectedTests.length > 0) {
        // Trigger form submission
        const form = document.querySelector('form');
        if (form) {
          form.requestSubmit();
        }
      }
    }
  };

  // Add event listener
  window.addEventListener('keydown', handleKeyPress);

  // Cleanup
  return () => {
    window.removeEventListener('keydown', handleKeyPress);
  };
}, [saving, selectedPatient, selectedTests, reviewedBy, results, fbcValues, lipidValues, pathologyReport, ufrValues, ogttValues, ppbsValues, bssValues, bgrhValues]);


  // Get patient invoices
  const patientInvoices = selectedPatient
    ? invoices.filter((inv) => inv.patientId === selectedPatient.id)
    : [];

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/reports">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Generate New Report</h1>
          <p className="text-muted-foreground">
            Create a laboratory test report with results
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient & Test Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Select Patient
            </CardTitle>
            <CardDescription>
              Search and expand any test to enter values. Tests with filled
              values will automatically be included when you generate reports.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Patient *</Label>
              <Select
                key={selectedPatient?.id || "no-patient"}
                value={selectedPatient?.id || ""}
                onValueChange={handlePatientChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2 sticky top-0 bg-background z-10">
                    <Input
                      placeholder="Search by name or ID..."
                      className="h-8"
                      value={patientSearchTerm}
                      onChange={(e) => setPatientSearchTerm(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  {patients
                    .filter((patient) => {
                      const searchLower = patientSearchTerm.toLowerCase();
                      const fullName =
                        `${patient.firstName} ${patient.lastName}`.toLowerCase();
                      const id = patient.id.toLowerCase();
                      return (
                        fullName.includes(searchLower) ||
                        id.includes(searchLower)
                      );
                    })
                    .map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName} ({patient.id})
                      </SelectItem>
                    ))}
                  {patients.filter((patient) => {
                    const searchLower = patientSearchTerm.toLowerCase();
                    const fullName =
                      `${patient.firstName} ${patient.lastName}`.toLowerCase();
                    const id = patient.id.toLowerCase();
                    return (
                      fullName.includes(searchLower) || id.includes(searchLower)
                    );
                  }).length === 0 && (
                    <div className="p-2 text-center text-sm text-muted-foreground">
                      No patients found
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {selectedPatient && (
              <div className="space-y-4">
                {/* Optional: Link to existing invoice */}
                {patientInvoices.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="invoice">Link to Invoice (Optional)</Label>
                    <Select
                      key={selectedInvoice?.id || "no-invoice"}
                      value={selectedInvoice?.id || ""}
                      onValueChange={(invoiceId) => {
                        const invoice = invoices.find(
                          (inv) => inv.id === invoiceId
                        );
                        setSelectedInvoice(invoice || null);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an invoice (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Invoice</SelectItem>
                        {patientInvoices.map((invoice) => (
                          <SelectItem key={invoice.id} value={invoice.id}>
                            {invoice.id} - LKR {invoice.grandTotal.toFixed(2)} (
                            {invoice.lineItems.length} tests)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Report Date */}
                <div className="space-y-2">
                  <Label htmlFor="reportDate">Report Date</Label>
                  <Input
                    id="reportDate"
                    type="date"
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                    className="w-full max-w-[200px]"
                  />
                </div>
              </div>
            )}

            {/* Summary */}
            {selectedPatient && selectedTests.length > 0 && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                <div className="grid gap-2 md:grid-cols-2">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Patient:
                    </span>
                    <div className="font-medium">
                      {selectedPatient.firstName} {selectedPatient.lastName}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Tests Selected:
                    </span>
                    <div className="font-medium">
                      {selectedTests.length} test
                      {selectedTests.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                  {selectedInvoice && (
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Linked Invoice:
                      </span>
                      <div className="font-medium">{selectedInvoice.id}</div>
                    </div>
                  )}
                </div>

                {/* Show selected test names */}
                <div>
                  <span className="text-sm text-muted-foreground block mb-2">
                    Selected Tests:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedTests.map((testCode) => {
                      const test = testCatalog.find((t) => t.code === testCode);
                      return (
                        <Badge key={testCode} variant="secondary">
                          {test?.name || testCode}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
                {/* Show selected test names WITH ORDER */}
                <div>
                  <span className="text-sm text-muted-foreground block mb-2">
                    Selected Tests (in order):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {testSelectionOrder
                      .filter((code) => selectedTests.includes(code))
                      .map((testCode, index) => {
                        const test = testCatalog.find(
                          (t) => t.code === testCode
                        );
                        return (
                          <Badge
                            key={testCode}
                            variant="secondary"
                            className="flex items-center gap-2"
                          >
                            <span className="text-xs font-bold text-muted-foreground">
                              {index + 1}.
                            </span>
                            {test?.name || testCode}
                          </Badge>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Results */}
        {selectedPatient && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Available Tests - Select & Complete
              </CardTitle>
              <CardDescription>
                Search for tests, check the ones you want to include, expand to
                enter values, and click "Complete Test" for individual reports
                or select multiple and use "Generate Combined Report" below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Tests */}
              <div className="space-y-2">
                <Label htmlFor="testSearch">Search Tests</Label>
                <Input
                  id="testSearch"
                  placeholder="Search by test name, code, or category..."
                  value={searchTestTerm}
                  onChange={(e) => setSearchTestTerm(e.target.value)}
                />
              </div>

              <Accordion type="multiple" className="w-full">
                {testCatalog
                  .filter((test) =>
                    searchTestTerm
                      ? test.name
                          .toLowerCase()
                          .includes(searchTestTerm.toLowerCase()) ||
                        test.code
                          .toLowerCase()
                          .includes(searchTestTerm.toLowerCase()) ||
                        test.category
                          .toLowerCase()
                          .includes(searchTestTerm.toLowerCase())
                      : true
                  )
                  .map((test) => {
                    const isSelected = selectedTests.includes(test.code);
                    const isFilled = isTestFilled(test.code);
                    const isCompleted = completedTests.includes(test.code);

                    return (
                      <AccordionItem
                        key={test.code}
                        value={test.code}
                        className={`border rounded-lg mb-3 ${
                          isSelected ? "border-primary bg-primary/5" : ""
                        }`}
                      >
                        <div className="relative">
                          <AccordionTrigger
                            className="px-4 hover:no-underline hover:bg-muted/50"
                            onClick={() => {
                              // Auto-select test when accordion is clicked
                              if (!isSelected) {
                                const newSelectedTests = [
                                  ...selectedTests,
                                  test.code,
                                ];
                                handleTestSelection(newSelectedTests);
                                // Also update order immediately
                                if (!testSelectionOrder.includes(test.code)) {
                                  setTestSelectionOrder([
                                    ...testSelectionOrder,
                                    test.code,
                                  ]);
                                }
                              }
                            }}
                          >
                            <div className="flex items-center gap-3 w-full">
                              {isFilled ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                              ) : (
                                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                              )}
                              <div className="flex-1 text-left">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge variant="outline">{test.code}</Badge>
                                  <span className="font-medium">
                                    {test.name}
                                  </span>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {test.category}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  LKR {test.defaultPrice.toFixed(2)}
                                </p>
                              </div>
                              {isCompleted && (
                                <Badge
                                  variant="default"
                                  className="bg-blue-600"
                                >
                                  Reported
                                </Badge>
                              )}
                              {isFilled && !isCompleted && (
                                <Badge
                                  variant="default"
                                  className="bg-green-600"
                                >
                                  Ready
                                </Badge>
                              )}
                            </div>
                          </AccordionTrigger>

                          {/* Remove button positioned absolutely - OUTSIDE the button */}
                          {isSelected && (
                            <button
                              type="button"
                              className="absolute right-2 top-2 z-10 h-8 w-8 rounded-md hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Remove from selected tests
                                const newSelectedTests = selectedTests.filter(
                                  (code) => code !== test.code
                                );
                                handleTestSelection(newSelectedTests);
                                // Remove from order
                                setTestSelectionOrder(
                                  testSelectionOrder.filter(
                                    (code) => code !== test.code
                                  )
                                );
                              }}
                            >
                              <span className="sr-only">Remove test</span>
                              <span className="text-xl font-bold">×</span>
                            </button>
                          )}
                        </div>

                        <AccordionContent className="px-4 pb-4 pt-2">
                          <div className="space-y-4">
                            {/* FBC Test */}
                            {test.code === "FBC" && (
                              <FBCReportCard
                                onValuesChange={(values) => {
                                  handleFBCValuesChange(values);
                                  if (
                                    values &&
                                    Object.values(values).some(
                                      (v) => v && String(v).trim() !== ""
                                    )
                                  ) {
                                    autoSelectTest("FBC");
                                  }
                                }}
                              />
                            )}

                            {/* Lipid Profile Test */}
                            {test.code === "LIPID" && (
                              <LipidProfileReportCard
                                onValuesChange={(values) => {
                                  setLipidValues(values);
                                  autoSelectTest("LIPID");
                                }}
                              />
                            )}

                            {/* UFR Test */}
                            {test.code === "UFR" && (
                              <UFRReportCard
                                onValuesChange={(values) => {
                                  setUfrValues(values);
                                  autoSelectTest("UFR");
                                }}
                              />
                            )}

                            {/* PPBS Test */}
                            {test.code === "PPBS" && (
                              <PPBSReportCard
                                onValuesChange={(values) => {
                                  setPpbsValues(values);
                                  if (
                                    values &&
                                    values.value &&
                                    values.value.trim() !== ""
                                  ) {
                                    autoSelectTest("PPBS");
                                  }
                                }}
                              />
                            )}

                            {/* BSS Test */}
                            {test.code === "BSS" && (
                              <BSSReportCard
                                onValuesChange={(values) => {
                                  setBssValues(values);
                                  if (values && values.length > 0) {
                                    autoSelectTest("BSS");
                                  }
                                }}
                              />
                            )}

                            {/* BGRh Test */}
                            {test.code === "BGRh" && (
                              <BGRhReportCard
                                onValuesChange={(values) => {
                                  setBgrhValues(values);
                                  autoSelectTest("BGRh");
                                }}
                              />
                            )}

                            {/* OGTT Test */}
                            {test.code === "OGTT" && (
                              <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-3">
                                  <div className="space-y-2">
                                    <Label htmlFor="ogtt-fasting">
                                      Fasting (mg/dL)
                                    </Label>
                                    <Input
                                      id="ogtt-fasting"
                                      type="number"
                                      value={ogttValues?.fasting || ""}
                                      onChange={(e) => {
                                        setOgttValues({
                                          ...ogttValues,
                                          fasting: e.target.value,
                                        });
                                        autoSelectTest("OGTT");
                                      }}
                                      placeholder="60 - 115"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="ogtt-1hour">
                                      After 1 Hour (mg/dL)
                                    </Label>
                                    <Input
                                      id="ogtt-1hour"
                                      type="number"
                                      value={ogttValues?.afterOneHour || ""}
                                      onChange={(e) => {
                                        setOgttValues({
                                          ...ogttValues,
                                          afterOneHour: e.target.value,
                                        });
                                        autoSelectTest("OGTT");
                                      }}
                                      placeholder="< 180"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="ogtt-2hour">
                                      After 2 Hour (mg/dL)
                                    </Label>
                                    <Input
                                      id="ogtt-2hour"
                                      type="number"
                                      value={ogttValues?.afterTwoHours || ""}
                                      onChange={(e) => {
                                        setOgttValues({
                                          ...ogttValues,
                                          afterTwoHours: e.target.value,
                                        });
                                        autoSelectTest("OGTT");
                                      }}
                                      placeholder="< 140"
                                    />
                                  </div>
                                </div>
                                {ogttValues &&
                                  (ogttValues.fasting ||
                                    ogttValues.afterOneHour ||
                                    ogttValues.afterTwoHours) && (
                                    <OGTTGraph
                                      fasting={ogttValues.fasting || ""}
                                      afterOneHour={
                                        ogttValues.afterOneHour || ""
                                      }
                                      afterTwoHours={
                                        ogttValues.afterTwoHours || ""
                                      }
                                    />
                                  )}
                              </div>
                            )}

                            {/* Regular Tests */}
                            {![
                              "FBC",
                              "LIPID",
                              "UFR",
                              "OGTT",
                              "PPBS",
                              "BSS",
                              "BGRh",
                            ].includes(test.code) && (
                              <div className="space-y-4">
                                {results
                                  .filter(
                                    (result) => result.testCode === test.code
                                  )
                                  .map((result, index) => {
                                    const testDetails = testCatalog.find(
                                      (t) => t.code === result.testCode
                                    );
                                    const isQualitative =
                                      testDetails?.isQualitative || false;
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
                                          <span className="font-medium">
                                            {result.testName}
                                          </span>
                                          {isQualitative && (
                                            <Badge
                                              variant="secondary"
                                              className="ml-2"
                                            >
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
                                                <Badge
                                                  variant="destructive"
                                                  className="ml-2"
                                                >
                                                  Out of Range
                                                </Badge>
                                              )}
                                            </>
                                          )}
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-3">
                                          <div className="space-y-2">
                                            <Label
                                              htmlFor={`value-${result.testCode}-${result.testName}-${index}`}
                                            >
                                              Result Value *
                                            </Label>
                                            <Input
                                              id={`value-${result.testCode}-${result.testName}-${index}`}
                                              value={result.value}
                                              onChange={(e) =>
                                                updateResult(
                                                  result.testName,
                                                  "value",
                                                  e.target.value
                                                )
                                              }
                                              placeholder="Enter result value"
                                              className={
                                                !isQualitative && result.value
                                                  ? isValueInRange(
                                                      result.value,
                                                      result.referenceRange
                                                    ) === false
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : isValueInRange(
                                                        result.value,
                                                        result.referenceRange
                                                      ) === true
                                                    ? "border-green-500 focus:ring-green-500"
                                                    : ""
                                                  : ""
                                              }
                                            />
                                          </div>

                                          {isQualitative && (
                                            <div className="space-y-2">
                                              <Label
                                                htmlFor={`qualitative-${result.testCode}-${result.testName}-${index}`}
                                              >
                                                Qualitative Result *
                                              </Label>
                                              <Select
                                                value={result.comments || ""}
                                                onValueChange={(value) =>
                                                  updateResult(
                                                    result.testName,
                                                    "comments",
                                                    value
                                                  )
                                                }
                                              >
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Select result" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {getQualitativeOptions(
                                                    result.testCode
                                                  ).map(
                                                    (option: {
                                                      value: string;
                                                      label: string;
                                                    }) => (
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
                                            </div>
                                          )}

                                          <div className="space-y-2">
                                            <Label
                                              htmlFor={`unit-${result.testCode}-${result.testName}-${index}`}
                                            >
                                              Unit
                                            </Label>
                                            <Input
                                              id={`unit-${result.testCode}-${result.testName}-${index}`}
                                              value={result.unit}
                                              onChange={(e) =>
                                                updateResult(
                                                  result.testName,
                                                  "unit",
                                                  e.target.value
                                                )
                                              }
                                              placeholder={`e.g., ${result.unit}`}
                                            />
                                          </div>

                                          <div className="space-y-2">
                                            <Label
                                              htmlFor={`range-${result.testCode}-${result.testName}-${index}`}
                                            >
                                              Reference Range
                                            </Label>
                                            <Input
                                              id={`range-${result.testCode}-${result.testName}-${index}`}
                                              value={(() => {
                                                try {
                                                  const parsed =
                                                    typeof result.referenceRange ===
                                                    "string"
                                                      ? JSON.parse(
                                                          result.referenceRange
                                                        )
                                                      : result.referenceRange;

                                                  if (
                                                    typeof parsed ===
                                                      "object" &&
                                                    parsed !== null &&
                                                    !Array.isArray(parsed)
                                                  ) {
                                                    return Object.entries(
                                                      parsed
                                                    )
                                                      .map(
                                                        ([key, value]) =>
                                                          `${key}: ${value}`
                                                      )
                                                      .join(", ");
                                                  }
                                                  return result.referenceRange;
                                                } catch {
                                                  return result.referenceRange;
                                                }
                                              })()}
                                              onChange={(e) =>
                                                updateResult(
                                                  result.testName,
                                                  "referenceRange",
                                                  e.target.value
                                                )
                                              }
                                              placeholder={(() => {
                                                try {
                                                  const parsed =
                                                    typeof result.referenceRange ===
                                                    "string"
                                                      ? JSON.parse(
                                                          result.referenceRange
                                                        )
                                                      : result.referenceRange;

                                                  if (
                                                    typeof parsed ===
                                                      "object" &&
                                                    parsed !== null &&
                                                    !Array.isArray(parsed)
                                                  ) {
                                                    return Object.entries(
                                                      parsed
                                                    )
                                                      .map(
                                                        ([key, value]) =>
                                                          `${key}: ${value}`
                                                      )
                                                      .join(", ");
                                                  }
                                                  return `e.g. ${result.referenceRange}`;
                                                } catch {
                                                  return `e.g. ${result.referenceRange}`;
                                                }
                                              })()}
                                            />
                                          </div>
                                        </div>

                                        {!isQualitative && (
                                          <div className="space-y-2">
                                            <Label
                                              htmlFor={`comments-${result.testCode}-${result.testName}-${index}`}
                                            >
                                              Comments (Optional)
                                            </Label>
                                            <Textarea
                                              id={`comments-${result.testCode}-${result.testName}-${index}`}
                                              value={result.comments || ""}
                                              onChange={(e) =>
                                                updateResult(
                                                  result.testName,
                                                  "comments",
                                                  e.target.value
                                                )
                                              }
                                              placeholder="Any additional comments about this result"
                                              rows={2}
                                            />
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                              </div>
                            )}

                            {/* Complete Individual Test Button */}
                            {isFilled && !isCompleted && (
                              <div className="mt-4 pt-4 border-t">
                                <Button
                                  type="button"
                                  onClick={() =>
                                    handleCompleteIndividualTest(test.code)
                                  }
                                  disabled={saving}
                                  className="w-full"
                                >
                                  {saving
                                    ? "Generating..."
                                    : "Complete Test & Preview →"}
                                </Button>
                                <p className="text-xs text-muted-foreground text-center mt-2">
                                  Opens report in new tab for this test only
                                </p>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
              </Accordion>

              {testCatalog.filter((test) =>
                searchTestTerm
                  ? test.name
                      .toLowerCase()
                      .includes(searchTestTerm.toLowerCase()) ||
                    test.code
                      .toLowerCase()
                      .includes(searchTestTerm.toLowerCase()) ||
                    test.category
                      .toLowerCase()
                      .includes(searchTestTerm.toLowerCase())
                  : true
              ).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No tests found matching your search.
                </div>
              )}

              {/* Progress Summary */}
              {selectedTests.length > 0 && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        Selected Tests Progress
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedTests.filter(isTestFilled).length} of{" "}
                        {selectedTests.length} tests filled
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">
                        {selectedTests.filter(isTestFilled).length} Ready
                      </Badge>
                      <Badge variant="outline">
                        {selectedTests.length -
                          selectedTests.filter(isTestFilled).length}{" "}
                        Pending
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Generate Combined Report Section */}
        {selectedPatient && selectedTests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Generate Combined Report</CardTitle>
              <CardDescription>
                Create one report with all selected tests above (Alternative:
                Use "Complete Test" button on individual tests for separate
                reports)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Keyboard shortcut hint */}
  <div className="text-xs text-muted-foreground flex items-center gap-2">
    <kbd className="px-2 py-1 text-xs font-semibold bg-muted border border-border rounded">
      G
    </kbd>
    <span>Press "G" to generate combined report</span>
  </div>
                <div className="space-y-2">
                  <Label htmlFor="doctorRemarks">
                    Doctor's Remarks (Optional)
                  </Label>
                  <Textarea
                    id="doctorRemarks"
                    value={doctorRemarks}
                    onChange={(e) => setDoctorRemarks(e.target.value)}
                    placeholder="Enter any additional remarks or recommendations"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reviewedBy">Reviewed By *</Label>
                  <Input
                    id="reviewedBy"
                    value={reviewedBy}
                    onChange={(e) => setReviewedBy(e.target.value)}
                    placeholder="Enter reviewer name"
                    required
                  />
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    type="submit"
                    disabled={!isFormValid() || saving}
                    className="min-w-[200px]"
                    size="lg"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Generating..." : "Generate Combined Report"}
                    {!saving && (
                      <kbd className="ml-2 px-2 py-0.5 text-xs font-semibold bg-muted rounded">
                        G
                      </kbd>
                    )}
                  </Button>
                  <Button asChild type="button" variant="outline">
                    <Link href="/reports">Cancel</Link>
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground">
                  This will create ONE report containing all{" "}
                  {selectedTests.filter(isTestFilled).length} completed test(s)
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
}
