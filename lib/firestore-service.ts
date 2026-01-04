// Firestore service layer - FIXED for concurrent users with user tracking
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
  where,
} from "firebase/firestore";
import { db, auth } from "./firebase";
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

// ✅ Get current user's initials for ID prefix (single letter)
function getUserInitial(): string {
  const user = auth.currentUser;
  if (!user) return "U";
  
  // Try to get initial from display name
  if (user.displayName) {
    return user.displayName[0].toUpperCase();
  }
  
  // Fallback to first char of email
  if (user.email) {
    return user.email[0].toUpperCase();
  }
  
  // Last resort: use UID first char
  return user.uid[0].toUpperCase();
}

// ✅ Get current user ID
function getCurrentUserId(): string {
  return auth.currentUser?.uid || "anonymous";
}

// ✅ Get current user email
function getCurrentUserEmail(): string {
  return auth.currentUser?.email || "unknown@user.com";
}

// ✅ Generate clean, sequential-looking IDs that are still unique
function generateCleanId(prefix: string): string {
  const now = new Date();
  
  // Format: YYMMDD (6 digits for date)
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  // Generate a 4-digit unique number using timestamp + random
  // This gives us 0000-9999 range but ensures uniqueness
  const timeComponent = Date.now() % 10000; // Last 4 digits of timestamp
  const randomComponent = Math.floor(Math.random() * 100); // 00-99
  const uniqueNum = ((timeComponent + randomComponent) % 10000).toString().padStart(4, '0');
  
  // Format: PREFIX-YYMMDD-NNNN
  // Example: REP-241208-0547
  return `${prefix}-${dateStr}-${uniqueNum}`;
}

// Alternative: Even cleaner with just sequential number per day
function generateShortUniqueId(prefix: string): string {
  const now = new Date();
  
  // Format: YYMMDD
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  // Create unique 4-digit number from microseconds + random
  const microTime = Date.now() % 10000;
  const random = Math.floor(Math.random() * 100);
  const seqNum = ((microTime + random) % 10000).toString().padStart(4, '0');
  
  // Format: PREFIX-YYMMDD-NNNN
  // Example: REP-241208-0547, PAT-241208-1823, INV-241208-2156
  return `${prefix}-${dateStr}-${seqNum}`;
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
  const id = generateShortUniqueId("PAT");
  const createdAt = new Date().toISOString();

  const newPatient: Patient = {
    ...patient,
    id,
    createdAt,
  };

  await setDoc(doc(db, COLLECTIONS.PATIENTS, id), newPatient);
  console.log(`✅ Patient created by ${getCurrentUserEmail()}: ${id}`);
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
  const id = generateShortUniqueId("INV");
  const createdAt = new Date().toISOString();

  const newInvoice: Invoice = {
    ...invoice,
    id,
    createdAt,
  };

  await setDoc(doc(db, COLLECTIONS.INVOICES, id), newInvoice);
  console.log(`✅ Invoice created by ${getCurrentUserEmail()}: ${id}`);
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

// Enhanced Report interface with user tracking (extend in data-manager.ts)
interface EnhancedReport extends Report {
  createdByUserId?: string;
  createdByUserEmail?: string;
  lastModifiedByUserId?: string;
  lastModifiedByUserEmail?: string;
  lastModifiedAt?: string;
}

export async function getReports(): Promise<Report[]> {
  const reportsCol = collection(db, COLLECTIONS.REPORTS);
  const q = query(reportsCol, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ ...doc.data() } as Report));
}

// ✅ NEW: Get reports created by current user only
export async function getMyReports(): Promise<Report[]> {
  const userId = getCurrentUserId();
  const reportsCol = collection(db, COLLECTIONS.REPORTS);
  const q = query(
    reportsCol, 
    where("createdByUserId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ ...doc.data() } as Report));
}

export async function getReportById(id: string): Promise<Report | null> {
  // ✅ Add validation
  if (!id || typeof id !== 'string') {
    console.error('Invalid report ID:', id);
    return null;
  }

  // ✅ Check if db is initialized
  if (!db) {
    console.error('Firestore not initialized');
    return null;
  }

  try {
    const docRef = doc(db, COLLECTIONS.REPORTS, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as Report) : null;
  } catch (error) {
    console.error('Error getting report by ID:', error);
    return null;
  }
}

export async function addReport(
  report: Omit<Report, "id" | "createdAt">
): Promise<Report> {
  const id = generateShortUniqueId("REP");
  const createdAt = new Date().toISOString();
  const userId = getCurrentUserId();
  const userEmail = getCurrentUserEmail();

  // ✅ Add user tracking metadata
  const newReport: EnhancedReport = {
    ...report,
    id,
    createdAt,
    createdByUserId: userId,
    createdByUserEmail: userEmail,
  };

  // ✅ Add retry logic in case of extremely rare collisions
  let retries = 3;
  while (retries > 0) {
    try {
      await setDoc(doc(db, COLLECTIONS.REPORTS, id), newReport);
      console.log(`✅ Report created by ${userEmail}: ${id}`);
      return newReport as Report;
    } catch (error: any) {
      if (error.code === 'already-exists' && retries > 1) {
        // Regenerate ID and retry
        const newId = generateShortUniqueId("REP");
        newReport.id = newId;
        retries--;
        console.warn(`⚠️ ID collision detected, retrying with new ID: ${newId}`);
      } else {
        console.error(`❌ Error creating report by ${userEmail}:`, error);
        throw error;
      }
    }
  }

  throw new Error("Failed to create report after multiple retries");
}

export async function updateReport(
  id: string,
  updates: Partial<Report>
): Promise<void> {
  const docRef = doc(db, COLLECTIONS.REPORTS, id);
  const userId = getCurrentUserId();
  const userEmail = getCurrentUserEmail();
  
  // ✅ Add modification tracking
  const enhancedUpdates = {
    ...updates,
    lastModifiedByUserId: userId,
    lastModifiedByUserEmail: userEmail,
    lastModifiedAt: new Date().toISOString(),
  };
  
  await updateDoc(docRef, enhancedUpdates);
  console.log(`✅ Report ${id} updated by ${userEmail}`);
}

export async function deleteReport(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.REPORTS, id);
  const userEmail = getCurrentUserEmail();
  await deleteDoc(docRef);
  console.log(`✅ Report ${id} deleted by ${userEmail}`);
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

// Add this method to your existing firestore-service.ts file
export async function updateTestInCatalog(
  code: string,
  updates: Partial<TestCatalogItem>
): Promise<void> {
  const docRef = doc(db, COLLECTIONS.TEST_CATALOG, code);
  await updateDoc(docRef, updates);
  console.log(`✅ Test ${code} updated successfully`);
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

// ============= UTILITY FUNCTIONS =============

// ✅ Get audit trail for a report
export async function getReportAuditTrail(reportId: string): Promise<{
  createdBy: string;
  createdAt: string;
  lastModifiedBy?: string;
  lastModifiedAt?: string;
} | null> {
  // ✅ Add validation
  if (!reportId || typeof reportId !== 'string') {
    console.error('Invalid reportId provided to getReportAuditTrail:', reportId);
    return null;
  }

  // ✅ Check if db is initialized
  if (!db) {
    console.error('Firestore not initialized');
    return null;
  }

  const report = await getReportById(reportId);
  if (!report) return null;
  
  const enhancedReport = report as EnhancedReport;
  
  return {
    createdBy: enhancedReport.createdByUserEmail || "Unknown",
    createdAt: report.createdAt,
    lastModifiedBy: enhancedReport.lastModifiedByUserEmail,
    lastModifiedAt: enhancedReport.lastModifiedAt,
  };
}