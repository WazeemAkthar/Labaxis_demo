// Data management utilities - now using Firestore instead of localStorage
// This file maintains backward compatibility while delegating to Firestore

import * as firestoreService from "./firestore-service";

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
  hasGraph?: boolean;
  hasMealOptions?: boolean;
  hasMultipleMealOptions?: boolean;
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
  private useFirestore: boolean = true; // Toggle to use Firestore or localStorage

  private constructor() {
    // Firestore initialization happens automatically
  }

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  // Method to ensure default tests are present in Firestore
  async ensureDefaultTests() {
    const defaultTests = this.getDefaultTestCatalog();
    await firestoreService.initializeDefaultTests(defaultTests);
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
          HbA1c: " ",
        },
        category: "Biochemistry",
      },
      {
        code: "LFT",
        name: "Liver Function Tests",
        defaultPrice: 1800.0,
        estimatedCost: 600.0,
        unit: "per test",
        referenceRange: {
          "Bilirubin Total": "0.30 - 1.20",
          "Alkaline Phosphatase": "35.0 - 173.0",
          "SGOT/AST": "5.0 - 42.0",
          "SGPT/ALT": "4.0 - 42.0",
        },
        unitPerTest: {
          "Bilirubin Total": "mg/dl",
          "Alkaline Phosphatase": "IU/l",
          "SGOT/AST": "IU/l",
          "SGPT/ALT": "IU/l",
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
          Glucose: "70 - 140",
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
          AST: "< 42",
        },
        category: "Biochemistry",
      },
            {
        code: "BILIRUBIN",
        name: "Bilirubin Total, Direct & Indirect",
        defaultPrice: 800.0,
        estimatedCost: 250.0,
        unit: "mg/dl",
        referenceRange: {
          "Serum Bilirubin (Total)": "0.2 - 1.2",
          "Serum Bilirubin (Direct)": "0 - 0.3",
          "Serum Bilirubin (Indirect)": "0.2 - 1"
        },
        unitPerTest: {
          "Serum Bilirubin (Total)": "mg/dl",
          "Serum Bilirubin (Direct)": "mg/dl",
          "Serum Bilirubin (Indirect)": "mg/dl"
        },
        category: "Biochemistry"
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
        hasGraph: true,
      },
      {
        code: "OGCT",
        name: "Oral Glucose Challenging Test",
        defaultPrice: 400.0,
        estimatedCost: 120.0,
        unit: "mg/dL",
        referenceRange: {
          // Fasting: "70-99",
          // "After 1 Hour": "<180",
          "After 2 Hours": "<140",
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
         hasMealOptions: true,
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
          BUN: " ",
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
        unitPerTest: {
          "Serum Total Calcium": "mg/dL",
          "Serum Albumin": "g/dL",
          "Corrected Calcium": "mg/dL",
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
        code: "RFT",
        name: "Renal Function Test",
        defaultPrice: 500.0,
        estimatedCost: 150.0,
        unit: "mg/dL or mEq/l or ml/min/1.73m2",
        referenceRange: {
          "Serum Creatinine": "0.50 - 1.50",
          "Estimated GFR": "> 60",
          "Blood Urea": "10.0 - 45.0",
          "Serum Sodium": "135.0 - 145.0",
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
      },
      {
        code: "UACR",
        name: "Urine Albumin with Creatinine Ratio",
        defaultPrice: 400.0,
        estimatedCost: 120.0,
        unit: "mg/dL or mg of Alb/g of Cre",
        referenceRange: {
          "Urine Creatinine": "20.0 - 300.0 mg/dL",
          "Urine Albumin": "0.0 - 30.0 mg/dL",
          "Urine Albumin/Urine Creatinine": "< 30.0 mg of Alb/g of Cre",
        },
        category: "Renal",
      },
      {
  code: "BSS",
  name: "Blood for BSS",
  defaultPrice: 450.0,
  estimatedCost: 135.0,
  unit: "mg/dL",
  referenceRange: {
    "After 1 Hour": "< 160",
    "After 2 Hours": "< 140",
  },
  category: "Glucose",
  hasMultipleMealOptions: true,
}
    ];
  }

  // Patient methods - delegated to Firestore
  async getPatients(): Promise<Patient[]> {
    return firestoreService.getPatients();
  }

  async addPatient(patient: Omit<Patient, "id" | "createdAt">): Promise<Patient> {
    return firestoreService.addPatient(patient);
  }

  async getPatientById(id: string): Promise<Patient | null> {
    return firestoreService.getPatientById(id);
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<void> {
    return firestoreService.updatePatient(id, updates);
  }

  async deletePatient(id: string): Promise<void> {
    return firestoreService.deletePatient(id);
  }

  // Invoice methods - delegated to Firestore
  async getInvoices(): Promise<Invoice[]> {
    return firestoreService.getInvoices();
  }

  async addInvoice(invoice: Omit<Invoice, "id" | "createdAt">): Promise<Invoice> {
    return firestoreService.addInvoice(invoice);
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    return firestoreService.getInvoiceById(id);
  }

  async updateInvoice(id: string, updates: Partial<Invoice>): Promise<void> {
    return firestoreService.updateInvoice(id, updates);
  }

  async deleteInvoice(id: string): Promise<void> {
    return firestoreService.deleteInvoice(id);
  }

  // Report methods - delegated to Firestore
  async getReports(): Promise<Report[]> {
    return firestoreService.getReports();
  }

  async addReport(report: Omit<Report, "id" | "createdAt">): Promise<Report> {
    return firestoreService.addReport(report);
  }

  async getReportById(id: string): Promise<Report | null> {
    return firestoreService.getReportById(id);
  }

  async updateReport(id: string, updates: Partial<Report>): Promise<void> {
    return firestoreService.updateReport(id, updates);
  }

  async deleteReport(id: string): Promise<void> {
    return firestoreService.deleteReport(id);
  }

  // Test catalog methods - delegated to Firestore
  async getTestCatalog(): Promise<TestCatalogItem[]> {
    return firestoreService.getTestCatalog();
  }

  async addTestToCatalog(test: TestCatalogItem): Promise<void> {
    return firestoreService.addTestToCatalog(test);
  }

  async removeTestFromCatalog(testCode: string): Promise<void> {
    return firestoreService.removeTestFromCatalog(testCode);
  }

  async setTestCatalog(catalog: TestCatalogItem[]): Promise<void> {
    await firestoreService.initializeDefaultTests(catalog);
  }

  async refreshTestCatalog(): Promise<void> {
    console.log("Refreshing test catalog...");
    await this.ensureDefaultTests();
  }

  async getTestByCode(code: string): Promise<TestCatalogItem | null> {
    return firestoreService.getTestByCode(code);
  }

  // Utility methods
  generateId(prefix: string): string {
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0].replace(/-/g, "");
    const sequence = String(Date.now()).slice(-4);
    return `${prefix}-${dateStr}-${sequence}`;
  }

  // Initialize defaults in Firestore
  async initializeWithDefaults(): Promise<void> {
    const defaultTests = this.getDefaultTestCatalog();
    await firestoreService.initializeDefaultTests(defaultTests);
    await firestoreService.initializeSampleData();
    console.log("Initialized Firestore with default data");
  }
}
