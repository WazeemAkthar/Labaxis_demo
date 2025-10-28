// Firestore service layer to replace localStorage-based DataManager
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  writeBatch,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  Patient,
  Invoice,
  Report,
  TestCatalogItem,
} from "./data-manager";

// Collection names
const COLLECTIONS = {
  PATIENTS: "patients",
  INVOICES: "invoices",
  REPORTS: "reports",
  TEST_CATALOG: "testCatalog",
};

// Helper to generate IDs
function generateId(prefix: string, sequence: number): string {
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0].replace(/-/g, "");
  const seq = String(sequence).padStart(4, "0");
  return `${prefix}-${dateStr}-${seq}`;
}

// ============= PATIENT METHODS =============
export async function getPatients(): Promise<Patient[]> {
  const patientsCol = collection(db, COLLECTIONS.PATIENTS);
  const q = query(patientsCol, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ ...doc.data() } as Patient));
}

export async function getPatientById(id: string): Promise<Patient | null> {
  const docRef = doc(db, COLLECTIONS.PATIENTS, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as Patient) : null;
}

export async function addPatient(
  patient: Omit<Patient, "id" | "createdAt">
): Promise<Patient> {
  const patients = await getPatients();
  const id = generateId("PAT", patients.length + 1);
  const createdAt = new Date().toISOString();

  const newPatient: Patient = {
    ...patient,
    id,
    createdAt,
  };

  await setDoc(doc(db, COLLECTIONS.PATIENTS, id), newPatient);
  return newPatient;
}

export async function updatePatient(
  id: string,
  updates: Partial<Patient>
): Promise<void> {
  const docRef = doc(db, COLLECTIONS.PATIENTS, id);
  await updateDoc(docRef, updates);
}

export async function deletePatient(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.PATIENTS, id);
  await deleteDoc(docRef);
}

// ============= INVOICE METHODS =============
export async function getInvoices(): Promise<Invoice[]> {
  const invoicesCol = collection(db, COLLECTIONS.INVOICES);
  const q = query(invoicesCol, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ ...doc.data() } as Invoice));
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const docRef = doc(db, COLLECTIONS.INVOICES, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as Invoice) : null;
}

export async function addInvoice(
  invoice: Omit<Invoice, "id" | "createdAt">
): Promise<Invoice> {
  const invoices = await getInvoices();
  const id = generateId("INV", invoices.length + 1);
  const createdAt = new Date().toISOString();

  const newInvoice: Invoice = {
    ...invoice,
    id,
    createdAt,
  };

  await setDoc(doc(db, COLLECTIONS.INVOICES, id), newInvoice);
  return newInvoice;
}

export async function updateInvoice(
  id: string,
  updates: Partial<Invoice>
): Promise<void> {
  const docRef = doc(db, COLLECTIONS.INVOICES, id);
  await updateDoc(docRef, updates);
}

export async function deleteInvoice(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.INVOICES, id);
  await deleteDoc(docRef);
}

// ============= REPORT METHODS =============
export async function getReports(): Promise<Report[]> {
  const reportsCol = collection(db, COLLECTIONS.REPORTS);
  const q = query(reportsCol, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ ...doc.data() } as Report));
}

export async function getReportById(id: string): Promise<Report | null> {
  const docRef = doc(db, COLLECTIONS.REPORTS, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as Report) : null;
}

export async function addReport(
  report: Omit<Report, "id" | "createdAt">
): Promise<Report> {
  const reports = await getReports();
  const id = generateId("REP", reports.length + 1);
  const createdAt = new Date().toISOString();

  const newReport: Report = {
    ...report,
    id,
    createdAt,
  };

  await setDoc(doc(db, COLLECTIONS.REPORTS, id), newReport);
  return newReport;
}

export async function updateReport(
  id: string,
  updates: Partial<Report>
): Promise<void> {
  const docRef = doc(db, COLLECTIONS.REPORTS, id);
  await updateDoc(docRef, updates);
}

export async function deleteReport(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.REPORTS, id);
  await deleteDoc(docRef);
}

// ============= TEST CATALOG METHODS =============
export async function getTestCatalog(): Promise<TestCatalogItem[]> {
  const catalogCol = collection(db, COLLECTIONS.TEST_CATALOG);
  const snapshot = await getDocs(catalogCol);
  return snapshot.docs.map((doc) => ({ ...doc.data() } as TestCatalogItem));
}

export async function getTestByCode(
  code: string
): Promise<TestCatalogItem | null> {
  const docRef = doc(db, COLLECTIONS.TEST_CATALOG, code);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as TestCatalogItem) : null;
}

export async function addTestToCatalog(
  test: TestCatalogItem
): Promise<void> {
  await setDoc(doc(db, COLLECTIONS.TEST_CATALOG, test.code), test);
}

export async function updateTestInCatalog(
  code: string,
  updates: Partial<TestCatalogItem>
): Promise<void> {
  const docRef = doc(db, COLLECTIONS.TEST_CATALOG, code);
  await updateDoc(docRef, updates);
}

export async function removeTestFromCatalog(code: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.TEST_CATALOG, code);
  await deleteDoc(docRef);
}

// ============= INITIALIZATION =============
export async function initializeDefaultTests(
  tests: TestCatalogItem[]
): Promise<void> {
  const batch = writeBatch(db);

  tests.forEach((test) => {
    const docRef = doc(db, COLLECTIONS.TEST_CATALOG, test.code);
    batch.set(docRef, test, { merge: true }); // merge to avoid overwriting
  });

  await batch.commit();
}

// Initialize sample data (run once)
export async function initializeSampleData(): Promise<void> {
  const patients = await getPatients();

  // Only initialize if database is empty
  if (patients.length > 0) {
    console.log("Database already has data, skipping initialization");
    return;
  }

  // Sample patients
  const samplePatients: Omit<Patient, "id" | "createdAt">[] = [
    {
      firstName: "John",
      lastName: "Smith",
      age: 45,
      gender: "Male",
      phone: "+1-555-0123",
      email: "john.smith@email.com",
      doctorName: "Dr. Sarah Johnson",
      notes: "Regular checkup patient",
      name: "John Smith",
    },
    {
      firstName: "Emily",
      lastName: "Davis",
      age: 32,
      gender: "Female",
      phone: "+1-555-0124",
      email: "emily.davis@email.com",
      doctorName: "Dr. Michael Brown",
      notes: "Diabetes monitoring",
      name: "Emily Davis",
    },
  ];

  // Add sample patients
  for (const patient of samplePatients) {
    await addPatient(patient);
  }

  console.log("Sample data initialized successfully");
}
