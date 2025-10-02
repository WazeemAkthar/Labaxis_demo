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
  referenceRange: Record<string, string>;
  category: string;
  isQualitative?: boolean;
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
        name: "Thyroid Stimulating Hormone",
        defaultPrice: 1500.0,
        estimatedCost: 500.0,
        unit: "mIU/L",
        referenceRange: {
          TSH: "0.4-4.0 mIU/L",
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
          Creatinine: "0.6-1.2 mg/dL",
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
        code: "SE",
        name: "Serum Electrolytes",
        defaultPrice: 500.0,
        estimatedCost: 150.0,
        unit: "mEq/l",
        referenceRange: {
          "Serum Sodium": "135.0 - 145.0 ",
          "Serum Potassium": "3.5 - 5.5",
          "Serum Chloride": "95.0 - 110.0",
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
