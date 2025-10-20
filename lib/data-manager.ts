// Data management utilities for localStorage persistence
export interface Patient {
  name: string;
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email: string;
  doctorName: string;
  notes: string;
  createdAt: string;
}

export interface TestCatalogItem {
  code: string;
  name: string;
  defaultPrice: number;
  estimatedCost: number;
  unit: string;
  referenceRange: Record<string, string | Record<string, string>>;
  category: string;
  isQualitative?: boolean;
  unitPerTest?: Record<string, string>;
}

export interface InvoiceLineItem {
  testCode: string;
  testName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  status: string;
  id: string;
  patientId: string;
  patientName: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  grandTotal: number;
  createdAt: string;
}

export interface ReportResult {
  testCode: string;
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  comments?: string;
}

export interface Report {
  id: string;
  patientId: string;
  patientName: string;
  invoiceId: string | null;
  results: ReportResult[];
  doctorRemarks?: string;
  reviewedBy: string;
  createdAt: string;
}

export class DataManager {
  private static instance: DataManager;
  private data: {
    patients: Patient[];
    invoices: Invoice[];
    reports: Report[];
    testCatalog: TestCatalogItem[];
  };

  private constructor() {
    this.data = {
      patients: [],
      invoices: [],
      reports: [],
      testCatalog: [],
    };
    this.loadData();
  }

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  private loadData() {
    try {
      const stored = localStorage.getItem("lablite_data");
      if (stored) {
        const parsedData = JSON.parse(stored);
        this.data = parsedData;

        // Always ensure we have the latest default tests
        this.ensureDefaultTests();
      } else {
        // Initialize with fresh defaults
        this.initializeWithDefaults();
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      this.initializeWithDefaults();
    }
  }

  private saveData() {
    try {
      localStorage.setItem("lablite_data", JSON.stringify(this.data));
      console.log("Data saved to localStorage:", this.data);
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  }

  // Method to ensure default tests are always present
  private ensureDefaultTests() {
    const defaultTests = this.getDefaultTestCatalog();
    const existingCodes = new Set(this.data.testCatalog.map((t) => t.code));

    let hasNewTests = false;
    defaultTests.forEach((test) => {
      if (!existingCodes.has(test.code)) {
        this.data.testCatalog.push(test);
        hasNewTests = true;
        console.log(`Added new test: ${test.code} - ${test.name}`);
      }
    });

    if (hasNewTests) {
      this.saveData();
    }
  }

  // Method to get the default test catalog (separated for better management)
  private getDefaultTestCatalog(): TestCatalogItem[] {
    return [
      {
        code: "FBC",
        name: "Full Blood Count",
        defaultPrice: 800.0,
        estimatedCost: 250.0,
        unit: "per test",
        referenceRange: {
          WBC: "4.0-11.0 x10³/μL",
          RBC: "4.5-5.5 x10⁶/μL",
          Hemoglobin: "12.0-16.0 g/dL",
          Hematocrit: "36-46%",
          Platelets: "150-450 x10³/μL",
          Neutrophils: "40-60%",
          Lymphocytes: "20-40%",
          Monocytes: "2-8%",
          Eosinophils: "1-4%",
          Basophils: "0.5-1%",
        },
        category: "Hematology",
      },
      {
        code: "ESR",
        name: "Erythrocyte Sedimentation Rate",
        defaultPrice: 300.0,
        estimatedCost: 100.0,
        unit: "mm",
        referenceRange: {
          "1st hour": " ",
          "2nd hour": " ",
        },
        category: "Hematology",
      },
      {
        code: "CRP",
        name: "C-Reactive Protein",
        defaultPrice: 650.0,
        estimatedCost: 200.0,
        unit: "mg/l",
        referenceRange: {
          CRP: "< = 6",
        },
        category: "Biochemistry",
        isQualitative: true,
      },
      {
        code: "LIPID",
        name: "Lipid Profile",
        defaultPrice: 1500.0,
        estimatedCost: 500.0,
        unit: "mg/dL",
        referenceRange: {
          "Total Cholesterol": "150-200 mg/dL",
          "HDL Cholesterol": "40-60 mg/dL",
          Triglycerides: "50-150 mg/dL",
          "VLDL Cholesterol": "5-40 mg/dL",
          "LDL Cholesterol": "60-130 mg/dL",
          "Total Cholesterol/HDL Ratio": "<5.0",
        },
        category: "Biochemistry",
      },
      {
        code: "FBS",
        name: "Fasting Blood Sugar",
        defaultPrice: 200.0,
        estimatedCost: 60.0,
        unit: "mg/dL",
        referenceRange: {
          Glucose: "60 - 110",
        },
        category: "Biochemistry",
      },
      {
        code: "URINE",
        name: "Urinalysis",
        defaultPrice: 300.0,
        estimatedCost: 100.0,
        unit: "per test",
        referenceRange: {
          Protein: "Negative",
          Glucose: "Negative",
          Blood: "Negative",
          Leukocytes: "Negative",
          "Specific Gravity": "1.003-1.030",
        },
        category: "Urinalysis",
      },
      {
        code: "TSH",
        name: "Thyroid Stimulating Hormone (3rd Gen)",
        defaultPrice: 1500.0,
        estimatedCost: 500.0,
        unit: "mIU/L",
        referenceRange: {
          TSH: " ",
        },
        category: "Endocrinology",
      },
      {
        code: "HBA1C",
        name: "Hemoglobin A1c",
        defaultPrice: 2400.0,
        estimatedCost: 800.0,
        unit: "%",
        referenceRange: {
          HbA1c: "<5.7% (Normal), 5.7-6.4% (Prediabetes), ≥6.5% (Diabetes)",
        },
        category: "Biochemistry",
      },
      {
        code: "LIVER",
        name: "Liver Function Tests",
        defaultPrice: 1800.0,
        estimatedCost: 600.0,
        unit: "per test",
        referenceRange: {
          ALT: "7-56 U/L",
          AST: "10-40 U/L",
          "Bilirubin Total": "0.3-1.2 mg/dL",
          Albumin: "3.5-5.0 g/dL",
        },
        category: "Biochemistry",
      },
      // ADD YOUR NEW TESTS HERE
      {
        code: "RF",
        name: "Rheumatoid Factor",
        defaultPrice: 800.0,
        estimatedCost: 250.0,
        unit: "IU/ml",
        referenceRange: {
          "Rheumatoid Factor": "< 8",
        },
        category: "Immunology",
        isQualitative: true,
      },
      {
        code: "ASOT",
        name: "Anti Streptolysin O Titre",
        defaultPrice: 900.0,
        estimatedCost: 300.0,
        unit: "IU/l",
        referenceRange: {
          ASOT: "< 200",
        },
        category: "Immunology",
        isQualitative: true,
      },
      {
        code: "VITAMIN_D",
        name: "Vitamin D (25-OH)",
        defaultPrice: 2000.0,
        estimatedCost: 600.0,
        unit: "ng/mL",
        referenceRange: {
          "Vitamin D": "30-100 ng/mL",
        },
        category: "Biochemistry",
      },
      {
        code: "B12",
        name: "Vitamin B12",
        defaultPrice: 1800.0,
        estimatedCost: 500.0,
        unit: "pg/mL",
        referenceRange: {
          "Vitamin B12": "200-900 pg/mL",
        },
        category: "Biochemistry",
      },
      {
        code: "RBS",
        name: "Random Blood Sugar",
        defaultPrice: 200.0,
        estimatedCost: 60.0,
        unit: "mg/dL",
        referenceRange: {
          Glucose: "70-140",
        },
        category: "Biochemistry",
      },
      {
        code: "SGOT",
        name: "Aspartate Aminotransferase (SGOT/AST)",
        defaultPrice: 400.0,
        estimatedCost: 120.0,
        unit: "IU/L",
        referenceRange: {
          AST: "< 40",
        },
        category: "Biochemistry",
      },
      {
        code: "SGPT",
        name: "Alanine Aminotransferase (SGPT/ALT)",
        defaultPrice: 400.0,
        estimatedCost: 120.0,
        unit: "IU/L",
        referenceRange: {
          ALT: "< 40",
        },
        category: "Biochemistry",
      },
      {
        code: "SCR",
        name: "Serum Creatinine",
        defaultPrice: 350.0,
        estimatedCost: 100.0,
        unit: "mg/dL",
        referenceRange: {
          Creatinine: "0.5 - 1.5",
        },
        category: "Biochemistry",
      },
      {
        code: "SBU",
        name: "Serum Blood Urea",
        defaultPrice: 350.0,
        estimatedCost: 100.0,
        unit: "mg/dL",
        referenceRange: {
          Urea: "< 42",
        },
        category: "Biochemistry",
      },
      {
        code: "HIV",
        name: "Blood for HIV 1 & 2",
        defaultPrice: 1000.0,
        estimatedCost: 300.0,
        unit: "per test",
        referenceRange: {
          "HIV 1 & 2": "Negative",
        },
        category: "Immunology",
        isQualitative: true,
      },
      {
        code: "VDRL",
        name: "Venereal Disease Research Laboratory",
        defaultPrice: 600.0,
        estimatedCost: 180.0,
        unit: "per test",
        referenceRange: {
          VDRL: " ",
        },
        category: "Immunology",
        isQualitative: true,
      },
      {
        code: "UFR",
        name: "Urine Full Report",
        defaultPrice: 300.0,
        estimatedCost: 100.0,
        unit: "per test",
        referenceRange: {
          Colour: "Normal",
          Appearance: "Clear",
          pH: "Acidic",
          "Specific Gravity": "1.003-1.030",
          "Protein (Albumin)": "Negative",
          "Sugar (Reducing substances)": "Negative",
          Urobilinogen: "Normal",
          Bile: "Negative",
          "Acetone/KB": "Negative",
        },
        category: "Urinalysis",
      },
      {
        code: "OGTT",
        name: "Oral Glucose Tolerance Test",
        defaultPrice: 400.0,
        estimatedCost: 120.0,
        unit: "mg/dL",
        referenceRange: {
          Fasting: "70-99",
          "After 1 Hour": "<180",
          "After 2 Hours": "70-140",
        },
        category: "Biochemistry",
      },
      {
        code: "OGCT",
        name: "Oral Glucose Challenging Test",
        defaultPrice: 400.0,
        estimatedCost: 120.0,
        unit: "mg/dL",
        referenceRange: {
          Fasting: "70-99",
          "After 1 Hour": "<180",
          "After 2 Hours": "70-140",
        },
        category: "Biochemistry",
      },
      {
        code: "PPBS",
        name: "Post Prandial Blood Sugar",
        defaultPrice: 200.0,
        estimatedCost: 60.0,
        unit: "mg/dL",
        referenceRange: {
          "Post Prandial": "<140",
        },
        category: "Biochemistry",
      },
      {
        code: "UA",
        name: "Blood for Uric Acid",
        defaultPrice: 400.0,
        estimatedCost: 120.0,
        unit: "mg/dL",
        referenceRange: {
          "Uric Acid": "3.4 - 7.2",
        },
        category: "Biochemistry",
      },
      {
        code: "AMY",
        name: "Serum Amylase",
        defaultPrice: 350.0,
        estimatedCost: 105.0,
        unit: "IU/l",
        referenceRange: {
          Amylase: "36.0 - 115.0",
        },
        category: "Biochemistry",
      },
      {
        code: "BSS",
        name: "Blood for BSS",
        defaultPrice: 450.0,
        estimatedCost: 135.0,
        unit: "mg/dL",
        referenceRange: {
          "Post Prandial Blood Sugar (Post Breakfast / Post Lunch / Post Dinner) - After 01 Hour":
            "< 160",
        },
        category: "Glucose",
      },
      {
        code: "BTCT",
        name: "Bleeding Time & Clotting Time",
        defaultPrice: 400.0,
        estimatedCost: 120.0,
        unit: "Min",
        referenceRange: {
          "Bleeding Time": "2 - 8",
          "Clotting Time": "3 - 10",
        },
        category: "Coagulation",
      },
      {
        code: "BUN",
        name: "Blood Urea Nitrogen (BUN)",
        defaultPrice: 350.0,
        estimatedCost: 105.0,
        unit: "mg/dL",
        referenceRange: {
          "Blood Urea Nitrogen (BUN)": "7.0 - 20.0",
        },
        category: "Biochemistry",
      },
      {
        code: "SCC",
        name: "Serum Corrected Calcium",
        defaultPrice: 400.0,
        estimatedCost: 120.0,
        unit: "mg/dL or g/dL",
        referenceRange: {
          "Serum Total Calcium": "8.5 - 10.8",
          "Serum Albumin": "4.0 - 6.0",
          "Corrected Calcium": "8.5 - 10.8",
        },
        category: "Biochemistry",
      },
      {
        code: "FT3",
        name: "Free Triiodothyronine (Free T3)",
        defaultPrice: 500.0,
        estimatedCost: 150.0,
        unit: "pg/mL",
        referenceRange: {
          "Free T3": "2.3 - 4.2",
        },
        category: "Hormone",
      },
      {
        code: "DEN",
        name: "Dengue Antibody",
        defaultPrice: 600.0,
        estimatedCost: 180.0,
        unit: "qualitative",
        referenceRange: {
          "Dengue Antibody IgM": "Negative",
          "Dengue Antibody IgG": "Negative",
        },
        category: "Infectious Disease",
        isQualitative: true,
      },
      {
        code: "FER",
        name: "Ferritin",
        defaultPrice: 450.0,
        estimatedCost: 135.0,
        unit: "ng/mL",
        referenceRange: {
          Ferritin: "20.0 - 250.0",
        },
        category: "Hematology",
      },
      {
        code: "HB",
        name: "Haemoglobin",
        defaultPrice: 300.0,
        estimatedCost: 90.0,
        unit: "g/dL",
        referenceRange: {
          Haemoglobin: {
            Man: "13.0 - 18.0",
            Woman: "11.0 - 16.5",
          },
        },
        category: "Hematology",
      },
      {
        code: "HBsAg",
        name: "Hepatitis B Surface Antigen (HBs Ag)",
        defaultPrice: 550.0,
        estimatedCost: 165.0,
        unit: "qualitative",
        referenceRange: {
          HBsAg: "Negative",
        },
        category: "Infectious Disease",
        isQualitative: true,
      },
      {
        code: "ALP",
        name: "Alkaline Phosphatase (ALP)",
        defaultPrice: 300.0,
        estimatedCost: 90.0,
        unit: "IU/l",
        referenceRange: {
          "Alkaline Phosphatase": "35.0 - 173.0",
        },
        category: "Biochemistry",
      },
      {
        code: "HCG",
        name: "Blood for Serum H.C.G (Qualitative)",
        defaultPrice: 400.0,
        estimatedCost: 120.0,
        unit: "qualitative",
        referenceRange: {
          "Human Chorionic Gonadotropin": "Negative",
        },
        category: "Hormone",
        isQualitative: true,
      },
      {
        code: "APTT",
        name: "Activated Partial Thromboplastin Time (APTT)",
        defaultPrice: 500.0,
        estimatedCost: 150.0,
        unit: "Sec",
        referenceRange: {
          APTT: "25 - 38",
          Control: "25 - 38",
        },
        category: "Coagulation",
      },
      {
        code: "BGRh",
        name: "Blood Grouping & Rh",
        defaultPrice: 250.0,
        estimatedCost: 75.0,
        unit: "qualitative",
        referenceRange: {
          "Blood group": "Any (A, B, AB, O)",
          "Rhesus factor": "Positive or Negative",
        },
        category: "Hematology",
        isQualitative: true,
      },
      {
        code: "SE",
        name: "Serum Electrolytes",
        defaultPrice: 500.0,
        estimatedCost: 150.0,
        unit: "mEq/l",
        referenceRange: {
          "Serum Sodium": "135.0 - 145.0",
          "Serum Potassium": "3.5 - 5.5",
          "Serum Chloride": "95.0 - 110.0",
        },
        category: "Biochemistry",
      },
      {
        code: "SFA",
        name: "Seminal Fluid Analysis",
        defaultPrice: 1000.0,
        estimatedCost: 300.0,
        unit: "per test",
        referenceRange: {
          Volume: "1.5-5.0 mL",
          Concentration: "15-200 million/mL",
          "Total Motility": "≥40%",
          "Progressive Motility": "≥32%",
          Morphology: "≥4% normal forms",
        },
        category: "Andrology",
      },
      {
        code: "BTP",
        name: "Blood for Total Protein",
        defaultPrice: 350.0,
        estimatedCost: 105.0,
        unit: "g/dL",
        referenceRange: {
          "Total Protein": "6.6 - 8.3",
          Albumin: "2.5 - 6.0",
          Globulin: "1.2 - 3.3",
          "A/G Ratio": "1.2 - 3.3",
        },
        category: "Biochemistry",
      },
      {
        code: "UACR",
        name: "Urine Albumin with Creatinine Ratio",
        defaultPrice: 400.0,
        estimatedCost: 120.0,
        unit: "mg/dL or mg of Alb/g of Cre",
        referenceRange: {
          "Urine Creatinine": "20.0 - 100.0",
          "Urine Albumin": "0.0 - 30.0",
          "Urine Albumin/Urine Creatinine": "< 30.0",
        },
        category: "Renal",
      },
      {
        code: "RFT",
        name: "Renal Function Test",
        defaultPrice: 500.0,
        estimatedCost: 150.0,
        unit: "mg/dL or mEq/l or ml/min/1.73m2",
        referenceRange: {
          "Serum Creatinine": "0.50 - 1.50",
          "Estimated GFR": "> 60",
          "Blood Urea": "10.0 - 45.0",
          "Serum Sodium": "135.0 - 155.0",
          "Serum Potassium": "3.5 - 5.5",
          "Serum Chloride": "95.0 - 110.0",
        },
        unitPerTest: {
          "Serum Creatinine": "mg/dL",
          "Estimated GFR": "ml/min/1.73m2",
          "Blood Urea": "mg/dL",
          "Serum Sodium": "mEq/l",
          "Serum Potassium": "mEq/l",
          "Serum Chloride": "mEq/l",
        },
        category: "Renal",
      },
      {
        code: "FT4",
        name: "Free Thyroxine (Free T4)",
        defaultPrice: 500.0,
        estimatedCost: 150.0,
        unit: "ng/dL",
        referenceRange: {
          "Free T4": "0.8 - 1.8",
        },
        category: "Hormone",
      }
    ];
  }

  // Patient methods
  getPatients(): Patient[] {
    return this.data.patients;
  }

  addPatient(patient: Omit<Patient, "id" | "createdAt">): Patient {
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0].replace(/-/g, "");
    const sequence = String(this.data.patients.length + 1).padStart(4, "0");

    const newPatient: Patient = {
      ...patient,
      id: `PAT-${dateStr}-${sequence}`,
      createdAt: now.toISOString(),
    };

    this.data.patients.push(newPatient);
    this.saveData();
    return newPatient;
  }

  getPatientById(id: string): Patient | undefined {
    return this.data.patients.find((p) => p.id === id);
  }

  // Invoice methods
  getInvoices(): Invoice[] {
    return this.data.invoices;
  }

  addInvoice(invoice: Omit<Invoice, "id" | "createdAt">): Invoice {
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0].replace(/-/g, "");
    const sequence = String(this.data.invoices.length + 1).padStart(4, "0");

    const newInvoice: Invoice = {
      ...invoice,
      id: `INV-${dateStr}-${sequence}`,
      createdAt: now.toISOString(),
    };

    this.data.invoices.push(newInvoice);
    this.saveData();
    return newInvoice;
  }

  // Report methods
  getReports(): Report[] {
    return this.data.reports;
  }

  addReport(report: Omit<Report, "id" | "createdAt">): Report {
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0].replace(/-/g, "");
    const sequence = String(this.data.reports.length + 1).padStart(4, "0");

    const newReport: Report = {
      ...report,
      id: `REP-${dateStr}-${sequence}`,
      createdAt: now.toISOString(),
    };

    this.data.reports.push(newReport);
    this.saveData();
    return newReport;
  }

  // Test catalog methods
  getTestCatalog(): TestCatalogItem[] {
    console.log("Getting test catalog:", this.data.testCatalog);
    return this.data.testCatalog;
  }

  // Method to add a single test to the catalog
  addTestToCatalog(test: TestCatalogItem): void {
    const existingIndex = this.data.testCatalog.findIndex(
      (t) => t.code === test.code
    );
    if (existingIndex !== -1) {
      // Update existing test
      this.data.testCatalog[existingIndex] = test;
      console.log(`Updated existing test: ${test.code}`);
    } else {
      // Add new test
      this.data.testCatalog.push(test);
      console.log(`Added new test: ${test.code} - ${test.name}`);
    }
    this.saveData();
  }

  // Method to remove a test from catalog
  removeTestFromCatalog(testCode: string): boolean {
    const initialLength = this.data.testCatalog.length;
    this.data.testCatalog = this.data.testCatalog.filter(
      (test) => test.code !== testCode
    );

    if (this.data.testCatalog.length < initialLength) {
      console.log(`Removed test: ${testCode}`);
      this.saveData();
      return true;
    }
    return false;
  }

  setTestCatalog(catalog: TestCatalogItem[]) {
    this.data.testCatalog = catalog;
    this.saveData();
  }

  // Method to force refresh test catalog (useful for development)
  refreshTestCatalog(): void {
    console.log("Refreshing test catalog...");
    this.ensureDefaultTests();
  }

  // Method to get test by code
  getTestByCode(code: string): TestCatalogItem | undefined {
    return this.data.testCatalog.find((test) => test.code === code);
  }

  // Utility methods
  generateId(prefix: string): string {
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0].replace(/-/g, "");
    const sequence = String(Date.now()).slice(-4);
    return `${prefix}-${dateStr}-${sequence}`;
  }

  // Method to clear all data (useful for development/testing)
  clearAllData(): void {
    this.data = {
      patients: [],
      invoices: [],
      reports: [],
      testCatalog: [],
    };
    localStorage.removeItem("lablite_data");
    this.initializeWithDefaults();
  }

  // Method to initialize with defaults
  private initializeWithDefaults() {
    this.data.testCatalog = this.getDefaultTestCatalog();
    this.initializeSampleData();
    this.saveData();
    console.log("Initialized with default data:", this.data);
  }

  private initializeSampleData() {
    // Add sample patients
    const samplePatients: Patient[] = [
      {
        id: "PAT-20241201-0001",
        firstName: "John",
        lastName: "Smith",
        age: 45,
        gender: "Male",
        phone: "+1-555-0123",
        email: "john.smith@email.com",
        doctorName: "Dr. Sarah Johnson",
        notes: "Regular checkup patient",
        createdAt: "2024-12-01T10:00:00.000Z",
        name: "",
      },
      {
        id: "PAT-20241201-0002",
        firstName: "Emily",
        lastName: "Davis",
        age: 32,
        gender: "Female",
        phone: "+1-555-0124",
        email: "emily.davis@email.com",
        doctorName: "Dr. Michael Brown",
        notes: "Diabetes monitoring",
        createdAt: "2024-12-01T11:30:00.000Z",
        name: "",
      },
      {
        id: "PAT-20241201-0003",
        firstName: "Robert",
        lastName: "Wilson",
        age: 58,
        gender: "Male",
        phone: "+1-555-0125",
        email: "robert.wilson@email.com",
        doctorName: "Dr. Sarah Johnson",
        notes: "Cardiac risk assessment",
        createdAt: "2024-12-01T14:15:00.000Z",
        name: "",
      },
    ];

    // Add sample invoices
    const sampleInvoices: Invoice[] = [
      {
        id: "INV-20241201-0001",
        patientId: "PAT-20241201-0001",
        patientName: "John Smith",
        lineItems: [
          {
            testCode: "FBC",
            testName: "Full Blood Count",
            quantity: 1,
            unitPrice: 800.0,
            total: 800.0,
          },
          {
            testCode: "LIPID",
            testName: "Lipid Profile",
            quantity: 1,
            unitPrice: 1200.0,
            total: 1200.0,
          },
        ],
        subtotal: 2000.0,
        discountPercent: 0,
        discountAmount: 0,
        grandTotal: 2000.0,
        createdAt: "2024-12-01T10:30:00.000Z",
        status: "",
      },
      {
        id: "INV-20241201-0002",
        patientId: "PAT-20241201-0002",
        patientName: "Emily Davis",
        lineItems: [
          {
            testCode: "FBS",
            testName: "Fasting Blood Sugar",
            quantity: 1,
            unitPrice: 200.0,
            total: 200.0,
          },
          {
            testCode: "HBA1C",
            testName: "Hemoglobin A1c",
            quantity: 1,
            unitPrice: 2400.0,
            total: 2400.0,
          },
        ],
        subtotal: 2600.0,
        discountPercent: 5,
        discountAmount: 130.0,
        grandTotal: 2470.0,
        createdAt: "2024-12-01T12:00:00.000Z",
        status: "",
      },
    ];

    // Add sample reports
    const sampleReports: Report[] = [
      {
        id: "REP-20241201-0001",
        patientId: "PAT-20241201-0001",
        patientName: "John Smith",
        invoiceId: "INV-20241201-0001",
        results: [
          {
            testCode: "FBC",
            testName: "Full Blood Count",
            value: "WBC: 7.2, RBC: 4.8, Hgb: 14.5, Hct: 42, PLT: 280",
            unit: "Various",
            referenceRange: "WBC: 4.0-11.0, RBC: 4.5-5.5, Hgb: 12.0-16.0",
            comments: "All values within normal limits",
          },
          {
            testCode: "LIPID",
            testName: "Lipid Profile",
            value: "Total: 185, HDL: 45, LDL: 110, TG: 150",
            unit: "mg/dL",
            referenceRange: "Total <200, HDL >40, LDL <100, TG <150",
            comments: "LDL slightly elevated",
          },
        ],
        doctorRemarks:
          "Overall good health. Recommend dietary modifications for cholesterol management.",
        reviewedBy: "Dr. Sarah Johnson",
        createdAt: "2024-12-01T16:00:00.000Z",
      },
    ];

    this.data.patients = samplePatients;
    this.data.invoices = sampleInvoices;
    this.data.reports = sampleReports;
  }
}
