"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { ArrowLeft, Save, User, FileText, TestTube } from "lucide-react";
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

  const hasUFRTest = useDirectTestSelection
    ? selectedTests.includes("UFR")
    : selectedInvoice?.lineItems.some((item) => item.testCode === "UFR") ||
      false;

  const hasLipidProfileTest = useDirectTestSelection
    ? selectedTests.includes("LIPID")
    : selectedInvoice?.lineItems.some((item) => item.testCode === "LIPID") ||
      false;

  const hasOGTTTest = useDirectTestSelection
    ? selectedTests.includes("OGTT")
    : selectedInvoice?.lineItems.some((item) => item.testCode === "OGTT") ||
      false;

  const hasPPBSTest = useDirectTestSelection
    ? selectedTests.includes("PPBS")
    : selectedInvoice?.lineItems.some((item) => item.testCode === "PPBS") ||
      false;

  const hasBSSTest = useDirectTestSelection
    ? selectedTests.includes("BSS")
    : selectedInvoice?.lineItems.some((item) => item.testCode === "BSS") ||
      false;

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
    }

    loadData();
  }, [user, authLoading, router]);

  const handlePatientChange = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    setSelectedPatient(patient || null);
    setSelectedInvoice(null);
    setSelectedTests([]);
    setUseDirectTestSelection(false);
    setResults([]);
    setFbcValues(null);
    setLipidValues(null);
    setUfrValues(null);
    setOgttValues(null);
    setPpbsValues(null);
    setBssValues([]);
  };

  const handleInvoiceChange = async (invoiceId: string) => {
    const invoice = invoices.find((inv) => inv.id === invoiceId);
    setSelectedInvoice(invoice || null);
    setFbcValues(null);
    setLipidValues(null);
    setUfrValues(null);
    setOgttValues(null);
    setPpbsValues(null);
    setBssValues([]);

    if (invoice) {
      // Initialize results from invoice line items
      const dataManager = DataManager.getInstance();
      const testCatalog = await dataManager.getTestCatalog();

      const initialResults: ReportResult[] = [];

      invoice.lineItems.forEach((item) => {
  const test = testCatalog.find((t) => t.code === item.testCode);
  const referenceRanges = test?.referenceRange || {};

  // Handle FBC, LIPID, UFR, OGTT, PPBS, BSS specially - don't create individual result entries
  if (
    item.testCode === "FBC" ||
    item.testCode === "LIPID" ||
    item.testCode === "UFR" ||
    item.testCode === "OGTT" ||
    item.testCode === "PPBS" ||
    item.testCode === "BSS"
  ) {
    return;
  }

  // For multi-component tests, create separate result entries for each component
  if (Object.keys(referenceRanges).length > 1) {
    Object.entries(referenceRanges).forEach(([component, range]) => {
      const componentUnit =
        test?.unitPerTest?.[component] || test?.unit || "";

      initialResults.push({
        testCode: item.testCode,
        testName: component, // ✅ USE ONLY THE COMPONENT NAME
        value: "",
        unit: componentUnit,
        referenceRange: String(range),
        comments: "",
        isQualitative: test?.isQualitative || false,
      });
    });
  } else {
    // For single-component tests - use the reference range key
    const firstRange = Object.entries(referenceRanges)[0];
    const componentName = firstRange ? firstRange[0] : item.testName;
    
    initialResults.push({
      testCode: item.testCode,
      testName: componentName, // ✅ USE THE REFERENCE RANGE KEY
      value: "",
      unit: test?.unit || "",
      referenceRange: firstRange ? String(firstRange[1]) : "",
      comments: "",
    });
  }
});

      setResults(initialResults);
    }
  };

  const updateResult = (
    testName: string,
    field: keyof ReportResult,
    value: string
  ) => {
    let updatedResults = results.map((result) =>
      result.testName === testName ? { ...result, [field]: value } : result
    );

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

  const handleDirectTestSelection = () => {
    setUseDirectTestSelection(true);
    setSelectedInvoice(null);
    setResults([]);
    setFbcValues(null);
  };

  const handleTestSelection = async (testCodes: string[]) => {
    // Prevent infinite loops by checking if the selection has actually changed
    if (
      JSON.stringify(testCodes.sort()) === JSON.stringify(selectedTests.sort())
    ) {
      return;
    }

    setSelectedTests(testCodes);

    // Initialize results from selected tests
    const dataManager = DataManager.getInstance();
    const testCatalog = await dataManager.getTestCatalog();
    const initialResults: ReportResult[] = [];

    testCodes.forEach((testCode) => {
  const test = testCatalog.find((t) => t.code === testCode);
  const referenceRanges = test?.referenceRange || {};

  // Handle FBC, LIPID, UFR, OGTT, PPBS, BSS specially - don't create individual result entries
  if (
    testCode === "FBC" ||
    testCode === "LIPID" ||
    testCode === "UFR" ||
    testCode === "OGTT" ||
    testCode === "PPBS" ||
    testCode === "BSS"
  ) {
    return;
  }

  // For multi-component tests, create separate result entries for each component
  if (Object.keys(referenceRanges).length > 1) {
    Object.entries(referenceRanges).forEach(([component, range]) => {
      const componentUnit =
        test?.unitPerTest?.[component] || test?.unit || "";

      initialResults.push({
        testCode: testCode,
        testName: component, // ✅ USE ONLY THE COMPONENT NAME
        value: "",
        unit: componentUnit,
        referenceRange: String(range),
        comments: "",
      });
    });
  } else {
    // For single-component tests - use the reference range key
    const firstRange = Object.entries(referenceRanges)[0];
    const componentName = firstRange ? firstRange[0] : (test?.name || testCode);
    
    initialResults.push({
      testCode: testCode,
      testName: componentName, // ✅ USE THE REFERENCE RANGE KEY
      value: "",
      unit: test?.unit || "",
      referenceRange: firstRange ? String(firstRange[1]) : "",
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

  // In new-report-page.tsx, find the handleSubmit function
  // Replace the OGTT section (around line 450-480) with this corrected version:

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || (!selectedInvoice && !useDirectTestSelection))
      return;

    setSaving(true);

    try {
      const dataManager = DataManager.getInstance();

      // Prepare all results including FBC
      const allResults: ReportResult[] = [
        ...results.filter((r) => r.value.trim() !== ""),
      ];

      // Determine if FBC is included
      const hasFBC = useDirectTestSelection
        ? selectedTests.includes("FBC")
        : selectedInvoice?.lineItems.some((item) => item.testCode === "FBC");

      // Add FBC results if available
      if (fbcValues && hasFBC) {
        const fbcResults = [
          {
            testCode: "FBC",
            testName: "Hemoglobin",
            value: fbcValues.hemoglobin,
            unit: "g/dL",
            referenceRange: "12.0-16.0",
            comments: "",
          },
          {
            testCode: "FBC",
            testName: "RBC",
            value: fbcValues.rbc,
            unit: "x10⁶/μL",
            referenceRange: "3.8-5.2",
            comments: "",
          },
          {
            testCode: "FBC",
            testName: "PCV",
            value: fbcValues.pcv,
            unit: "%",
            referenceRange: "36-46",
            comments: "",
          },
          {
            testCode: "FBC",
            testName: "MCV",
            value: fbcValues.mcv,
            unit: "fL",
            referenceRange: "80-100",
            comments: "",
          },
          {
            testCode: "FBC",
            testName: "MCH",
            value: fbcValues.mch,
            unit: "pg",
            referenceRange: "27-33",
            comments: "",
          },
          {
            testCode: "FBC",
            testName: "MCHC",
            value: fbcValues.mchc,
            unit: "g/dL",
            referenceRange: "32-36",
            comments: "",
          },
          {
            testCode: "FBC",
            testName: "RDW-CV",
            value: fbcValues.rdwCv,
            unit: "%",
            referenceRange: "11.5-14.5",
            comments: "",
          },
          {
            testCode: "FBC",
            testName: "Platelets",
            value: fbcValues.platelets,
            unit: "x10³/μL",
            referenceRange: "150-450",
            comments: "",
          },
          {
            testCode: "FBC",
            testName: "WBC",
            value: fbcValues.wbc,
            unit: "x10³/μL",
            referenceRange: "4.0-11.0",
            comments: "",
          },
          {
            testCode: "FBC",
            testName: "Neutrophils",
            value: fbcValues.neutrophils,
            unit: "%",
            referenceRange: "40-70",
            comments: "",
          },
          {
            testCode: "FBC",
            testName: "Lymphocytes",
            value: fbcValues.lymphocytes,
            unit: "%",
            referenceRange: "20-40",
            comments: "",
          },
          {
            testCode: "FBC",
            testName: "Eosinophils",
            value: fbcValues.eosinophils,
            unit: "%",
            referenceRange: "1-4",
            comments: "",
          },
          {
            testCode: "FBC",
            testName: "Monocytes",
            value: fbcValues.monocytes,
            unit: "%",
            referenceRange: "2-8",
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

      // Add Lipid Profile results if available
      if (lipidValues && hasLipidProfileTest) {
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

      // Add UFR results if available
      if (ufrValues && hasUFRTest) {
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

      // Add OGTT results if available
      if (ogttValues && hasOGTTTest) {
        console.log("=== SAVING OGTT DATA ===");
        console.log("ogttValues:", ogttValues);

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

        if (ogttValues.afterOneHour && ogttValues.afterOneHour.trim() !== "") {
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

        console.log("OGTT results to save:", ogttResultsArray);
        allResults.push(...ogttResultsArray);
      }

// Add PPBS results if available (MOVED OUTSIDE OF OGTT BLOCK)
if (ppbsValues && hasPPBSTest && ppbsValues.value && ppbsValues.value.trim() !== "") {
  console.log("=== SAVING PPBS DATA ===");
  console.log("ppbsValues:", ppbsValues);
  
  const referenceRange = ppbsValues.hourType === "After 1 Hour" ? "< 160" : "< 140";
  
  allResults.push({
    testCode: "PPBS",
    testName: "Post Prandial Blood Sugar",
    value: ppbsValues.value,
    unit: "mg/dL",
    referenceRange: referenceRange,
    comments: "",
    mealType: ppbsValues.mealType,      // Store meal type separately
    hourType: ppbsValues.hourType,      // Store hour type separately
  });
  
  console.log("PPBS result added to allResults");
}

      // Add BSS results if available (MOVED OUTSIDE OF OGTT BLOCK)
if (bssValues && hasBSSTest && bssValues.length > 0) {
  console.log("=== SAVING BSS DATA ===");
  console.log("bssValues:", bssValues);
  
  bssValues.forEach((entry) => {
    if (entry.value && entry.value.trim() !== "") {
      const referenceRange = entry.hourType === "After 1 Hour" ? "< 160" : "< 140";
      
      allResults.push({
        testCode: "BSS",
        testName: "Post Prandial Blood Sugar",
        value: entry.value,
        unit: "mg/dL",
        referenceRange: referenceRange,
        comments: "",
        mealType: entry.mealType,      // Store meal type separately
        hourType: entry.hourType,      // Store hour type separately
      });
    }
  });
  
  console.log("BSS results added to allResults");
}

      if (allResults.length === 0) {
        console.error("No results to save!");
        setSaving(false);
        return;
      }

      console.log("All results to save:", allResults);

      const report = await dataManager.addReport({
        patientId: selectedPatient.id,
        patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        invoiceId: selectedInvoice?.id || null,
        results: allResults,
        doctorRemarks,
        reviewedBy,
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

  const isFormValid = () => {
    const hasRegularResults = results.some((r) => r.value.trim() !== "");
    const hasFBC = useDirectTestSelection
      ? selectedTests.includes("FBC")
      : selectedInvoice?.lineItems.some((item) => item.testCode === "FBC");
    const hasFBCResults =
      fbcValues &&
      hasFBC &&
      Object.values(fbcValues).some((v) => v && String(v).trim() !== "");

    const hasLipidResults =
      lipidValues &&
      hasLipidProfileTest &&
      Object.values(lipidValues).some((v) => v && String(v).trim() !== "");

    const hasPathologyResults =
      pathologyReport &&
      pathologyReport.report &&
      pathologyReport.report.trim() !== "";

    const hasValidSelection =
      selectedInvoice || (useDirectTestSelection && selectedTests.length > 0);

    return (
      selectedPatient &&
      hasValidSelection &&
      (hasRegularResults ||
        hasFBCResults ||
        hasLipidResults ||
        hasPathologyResults ||
        hasUFRResults ||
        hasOGTTResults ||
        hasPPBSResults ||
        hasBSSResults) &&
      reviewedBy.trim() !== ""
    );
  };

  // Check if FBC test is selected
  const hasFBCTest = useDirectTestSelection
    ? selectedTests.includes("FBC")
    : selectedInvoice?.lineItems.some((item) => item.testCode === "FBC") ||
      false;

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
              Select Patient & Tests
            </CardTitle>
            <CardDescription>
              Choose the patient and either an existing invoice or select tests
              directly
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
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName} ({patient.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPatient && (
              <div className="space-y-4">
                {/* Option 1: Use existing invoice */}
                {patientInvoices.length > 0 && !useDirectTestSelection && (
                  <div className="space-y-2">
                    <Label htmlFor="invoice">Select Invoice (Optional)</Label>
                    <Select
                      key={selectedInvoice?.id || "no-invoice"}
                      value={selectedInvoice?.id || ""}
                      onValueChange={handleInvoiceChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an invoice" />
                      </SelectTrigger>
                      <SelectContent>
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

                {/* Option 2: Direct test selection */}
                {!selectedInvoice && (
                  <div className="space-y-4">
                    {!useDirectTestSelection && (
                      <div className="text-center p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">
                          No invoice selected or patient paid at hospital?
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleDirectTestSelection}
                        >
                          Select Tests Directly
                        </Button>
                      </div>
                    )}

                    {useDirectTestSelection && (
                      <TestSelectionComponent
                        selectedTests={selectedTests}
                        onTestsChange={handleTestSelection}
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Summary */}
            {selectedPatient &&
              (selectedInvoice ||
                (useDirectTestSelection && selectedTests.length > 0)) && (
                <div className="p-4 bg-muted/50 rounded-lg">
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
                        {selectedInvoice ? "Invoice:" : "Tests:"}
                      </span>
                      <div className="font-medium">
                        {selectedInvoice
                          ? selectedInvoice.id
                          : `${selectedTests.length} selected`}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Test Count:
                      </span>
                      <div className="font-medium">
                        {selectedInvoice
                          ? selectedInvoice.lineItems.length
                          : selectedTests.length}{" "}
                        tests
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Date:
                      </span>
                      <div className="font-medium">
                        {selectedInvoice
                          ? new Date(
                              selectedInvoice.createdAt
                            ).toLocaleDateString()
                          : new Date().toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </CardContent>
        </Card>

        {/* Test Results */}
        {(results.length > 0 ||
          hasFBCTest ||
          hasLipidProfileTest ||
          hasUFRTest ||
          hasOGTTTest ||
          hasPPBSTest ||
          hasBSSTest) && (
          <div className="space-y-6">
            {/* FBC Test - Special Component */}
            {hasFBCTest && (
              <FBCReportCard onValuesChange={handleFBCValuesChange} />
            )}

            {hasLipidProfileTest && (
              <LipidProfileReportCard onValuesChange={setLipidValues} />
            )}

            {hasUFRTest && <UFRReportCard onValuesChange={setUfrValues} />}

            {hasOGTTTest && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TestTube className="h-5 w-5" />
                    OGTT - Oral Glucose Tolerance Test
                  </CardTitle>
                  <CardDescription>
                    Enter fasting, 1-hour, and 2-hour glucose values
                  </CardDescription>
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
                          setOgttValues({
                            ...ogttValues,
                            fasting: e.target.value,
                          })
                        }
                        placeholder="70 - 100"
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
                        placeholder="< 180"
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
                        afterOneHour={ogttValues.afterOneHour || ""}
                        afterTwoHours={ogttValues.afterTwoHours || ""}
                      />
                    )}
                </CardContent>
              </Card>
            )}

            {hasPPBSTest && <PPBSReportCard onValuesChange={setPpbsValues} />}

            {hasBSSTest && <BSSReportCard onValuesChange={setBssValues} />}

            {/* Other Tests */}
            {results.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TestTube className="h-5 w-5" />
                    Enter Test Results
                  </CardTitle>
                  <CardDescription>
                    Input the results for each test
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {results.map((result, index) => {
                    const dataManager = DataManager.getInstance();
                    const testDetails = testCatalog.find(
                      (t) => t.code === result.testCode
                    );
                    const isQualitative = testDetails?.isQualitative || false;

                    return (
                      <div
                        key={`${result.testCode}-${result.testName}-${index}`}
                        className="p-4 border rounded-lg space-y-4"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline">{result.testCode}</Badge>
                          <span className="font-medium">{result.testName}</span>
                          {isQualitative && (
                            <Badge variant="secondary" className="ml-2">
                              Qualitative
                            </Badge>
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
                                  {getQualitativeOptions(result.testCode).map(
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
                              value={result.referenceRange}
                              onChange={(e) =>
                                updateResult(
                                  result.testName,
                                  "referenceRange",
                                  e.target.value
                                )
                              }
                              placeholder={`e.g. ${result.referenceRange}`}
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
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Doctor's Remarks */}
        {(results.length > 0 ||
          hasFBCTest ||
          hasLipidProfileTest ||
          hasUFRTest ||
          hasOGTTTest ||
          hasPPBSTest ||
          hasBSSTest) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Additional Information
              </CardTitle>
              <CardDescription>
                Add doctor's remarks and review information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>
        )}

        {/* Form Actions */}
        <div className="flex items-center gap-4">
          <Button
            type="submit"
            disabled={!isFormValid() || saving}
            className="min-w-[120px]"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Generating..." : "Generate Report"}
          </Button>
          <Button asChild type="button" variant="outline">
            <Link href="/reports">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
