// Data management utilities for localStorage persistence
export interface Patient {
  id: string
  firstName: string
  lastName: string
  age: number
  gender: "Male" | "Female" | "Other"
  phone: string
  email: string
  doctorName: string
  notes: string
  createdAt: string
}

export interface TestCatalogItem {
  code: string
  name: string
  defaultPrice: number
  estimatedCost: number
  unit: string
  referenceRange: Record<string, string>
  category: string
}

export interface InvoiceLineItem {
  testCode: string
  testName: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Invoice {
  id: string
  patientId: string
  patientName: string
  lineItems: InvoiceLineItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  discountPercent: number
  discountAmount: number
  grandTotal: number
  status: "Paid" | "Unpaid" | "Partial"
  createdAt: string
}

export interface ReportResult {
  testCode: string
  testName: string
  value: string
  unit: string
  referenceRange: string
  comments?: string
}

export interface Report {
  id: string
  patientId: string
  patientName: string
  invoiceId: string
  results: ReportResult[]
  doctorRemarks?: string
  reviewedBy: string
  createdAt: string
}

export class DataManager {
  private static instance: DataManager
  private data: {
    patients: Patient[]
    invoices: Invoice[]
    reports: Report[]
    testCatalog: TestCatalogItem[]
  }

  private constructor() {
    this.data = {
      patients: [],
      invoices: [],
      reports: [],
      testCatalog: [],
    }
    this.loadData()
  }

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager()
    }
    return DataManager.instance
  }

  private loadData() {
    try {
      const stored = localStorage.getItem("lablite_data")
      if (stored) {
        this.data = JSON.parse(stored)
      } else {
        // Initialize with empty data and load test catalog
        this.initializeTestCatalog()
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error)
      this.initializeTestCatalog()
    }
  }

  private saveData() {
    try {
      localStorage.setItem("lablite_data", JSON.stringify(this.data))
    } catch (error) {
      console.error("Error saving data to localStorage:", error)
    }
  }

  // Patient methods
  getPatients(): Patient[] {
    return this.data.patients
  }

  addPatient(patient: Omit<Patient, "id" | "createdAt">): Patient {
    const now = new Date()
    const dateStr = now.toISOString().split("T")[0].replace(/-/g, "")
    const sequence = String(this.data.patients.length + 1).padStart(4, "0")

    const newPatient: Patient = {
      ...patient,
      id: `PAT-${dateStr}-${sequence}`,
      createdAt: now.toISOString(),
    }

    this.data.patients.push(newPatient)
    this.saveData()
    return newPatient
  }

  getPatientById(id: string): Patient | undefined {
    return this.data.patients.find((p) => p.id === id)
  }

  // Invoice methods
  getInvoices(): Invoice[] {
    return this.data.invoices
  }

  addInvoice(invoice: Omit<Invoice, "id" | "createdAt">): Invoice {
    const now = new Date()
    const dateStr = now.toISOString().split("T")[0].replace(/-/g, "")
    const sequence = String(this.data.invoices.length + 1).padStart(4, "0")

    const newInvoice: Invoice = {
      ...invoice,
      id: `INV-${dateStr}-${sequence}`,
      createdAt: now.toISOString(),
    }

    this.data.invoices.push(newInvoice)
    this.saveData()
    return newInvoice
  }

  // Report methods
  getReports(): Report[] {
    return this.data.reports
  }

  addReport(report: Omit<Report, "id" | "createdAt">): Report {
    const now = new Date()
    const dateStr = now.toISOString().split("T")[0].replace(/-/g, "")
    const sequence = String(this.data.reports.length + 1).padStart(4, "0")

    const newReport: Report = {
      ...report,
      id: `REP-${dateStr}-${sequence}`,
      createdAt: now.toISOString(),
    }

    this.data.reports.push(newReport)
    this.saveData()
    return newReport
  }

  // Test catalog methods
  getTestCatalog(): TestCatalogItem[] {
    return this.data.testCatalog
  }

  setTestCatalog(catalog: TestCatalogItem[]) {
    this.data.testCatalog = catalog
    this.saveData()
  }

  // Utility methods
  generateId(prefix: string): string {
    const now = new Date()
    const dateStr = now.toISOString().split("T")[0].replace(/-/g, "")
    const sequence = String(Date.now()).slice(-4)
    return `${prefix}-${dateStr}-${sequence}`
  }

  private initializeTestCatalog() {
    const defaultCatalog: TestCatalogItem[] = [
      {
        code: "FBC",
        name: "Full Blood Count",
        defaultPrice: 25.0,
        estimatedCost: 8.0,
        unit: "per test",
        referenceRange: {
          WBC: "4.0-11.0 x10³/μL",
          RBC: "4.5-5.5 x10⁶/μL",
          Hemoglobin: "12.0-16.0 g/dL",
          Hematocrit: "36-46%",
          Platelets: "150-450 x10³/μL",
        },
        category: "Hematology",
      },
      {
        code: "CRP",
        name: "C-Reactive Protein",
        defaultPrice: 15.0,
        estimatedCost: 5.0,
        unit: "per test",
        referenceRange: {
          CRP: "<3.0 mg/L",
        },
        category: "Biochemistry",
      },
      {
        code: "LIPID",
        name: "Lipid Profile",
        defaultPrice: 35.0,
        estimatedCost: 12.0,
        unit: "per test",
        referenceRange: {
          "Total Cholesterol": "<200 mg/dL",
          "HDL Cholesterol": ">40 mg/dL (M), >50 mg/dL (F)",
          "LDL Cholesterol": "<100 mg/dL",
          Triglycerides: "<150 mg/dL",
        },
        category: "Biochemistry",
      },
      {
        code: "GLUCOSE",
        name: "Fasting Glucose",
        defaultPrice: 12.0,
        estimatedCost: 4.0,
        unit: "per test",
        referenceRange: {
          Glucose: "70-100 mg/dL",
        },
        category: "Biochemistry",
      },
      {
        code: "URINE",
        name: "Urinalysis",
        defaultPrice: 20.0,
        estimatedCost: 6.0,
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
        defaultPrice: 30.0,
        estimatedCost: 10.0,
        unit: "per test",
        referenceRange: {
          TSH: "0.4-4.0 mIU/L",
        },
        category: "Endocrinology",
      },
      {
        code: "HBA1C",
        name: "Hemoglobin A1c",
        defaultPrice: 28.0,
        estimatedCost: 9.0,
        unit: "per test",
        referenceRange: {
          HbA1c: "<5.7% (Normal), 5.7-6.4% (Prediabetes), ≥6.5% (Diabetes)",
        },
        category: "Biochemistry",
      },
      {
        code: "LIVER",
        name: "Liver Function Tests",
        defaultPrice: 40.0,
        estimatedCost: 15.0,
        unit: "per test",
        referenceRange: {
          ALT: "7-56 U/L",
          AST: "10-40 U/L",
          "Bilirubin Total": "0.3-1.2 mg/dL",
          Albumin: "3.5-5.0 g/dL",
        },
        category: "Biochemistry",
      },
    ]

    this.data.testCatalog = defaultCatalog
    this.initializeSampleData()
    this.saveData()
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
      },
    ]

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
            unitPrice: 25.0,
            total: 25.0,
          },
          {
            testCode: "LIPID",
            testName: "Lipid Profile",
            quantity: 1,
            unitPrice: 35.0,
            total: 35.0,
          },
        ],
        subtotal: 60.0,
        taxRate: 10,
        taxAmount: 6.0,
        discountPercent: 0,
        discountAmount: 0,
        grandTotal: 66.0,
        status: "Paid",
        createdAt: "2024-12-01T10:30:00.000Z",
      },
      {
        id: "INV-20241201-0002",
        patientId: "PAT-20241201-0002",
        patientName: "Emily Davis",
        lineItems: [
          {
            testCode: "GLUCOSE",
            testName: "Fasting Glucose",
            quantity: 1,
            unitPrice: 12.0,
            total: 12.0,
          },
          {
            testCode: "HBA1C",
            testName: "Hemoglobin A1c",
            quantity: 1,
            unitPrice: 28.0,
            total: 28.0,
          },
        ],
        subtotal: 40.0,
        taxRate: 10,
        taxAmount: 4.0,
        discountPercent: 5,
        discountAmount: 2.0,
        grandTotal: 42.0,
        status: "Unpaid",
        createdAt: "2024-12-01T12:00:00.000Z",
      },
    ]

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
        doctorRemarks: "Overall good health. Recommend dietary modifications for cholesterol management.",
        reviewedBy: "Dr. Sarah Johnson",
        createdAt: "2024-12-01T16:00:00.000Z",
      },
    ]

    this.data.patients = samplePatients
    this.data.invoices = sampleInvoices
    this.data.reports = sampleReports
  }
}
