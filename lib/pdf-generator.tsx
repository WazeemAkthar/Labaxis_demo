import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font, pdf } from '@react-pdf/renderer'
import type { Report, Invoice, Patient } from './data-manager'

// Register fonts (optional - you can use built-in fonts)
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf'
})

// Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 20,
    borderBottom: '1 solid #e0e0e0',
    paddingBottom: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1f2937'
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 10
  },
  section: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 4
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#374151'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  label: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: 'bold'
  },
  value: {
    fontSize: 10,
    color: '#1f2937'
  },
  table: {
    marginBottom: 15
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e5e7eb',
    paddingVertical: 5
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    fontWeight: 'bold',
    fontSize: 9,
    padding: 5
  },
  tableCell: {
    fontSize: 9,
    padding: 5,
    flex: 1
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 15,
    borderTop: '1 solid #e0e0e0',
    textAlign: 'center'
  },
  footerText: {
    fontSize: 8,
    color: '#9ca3af'
  }
})

// Report PDF Component
const ReportPDF: React.FC<{ report: Report; patient: Patient }> = ({ report, patient }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Lab Report</Text>
        <Text style={styles.subtitle}>Azza Medical Laboratory Services - Unique Place for all Diagnostic needs</Text>
      </View>

      {/* Patient Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patient Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Report ID:</Text>
          <Text style={styles.value}>{report.id}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Patient Name:</Text>
          <Text style={styles.value}>{patient.firstName} {patient.lastName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Age:</Text>
          <Text style={styles.value}>{patient.age} years</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Gender:</Text>
          <Text style={styles.value}>{patient.gender}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Report Date:</Text>
          <Text style={styles.value}>{new Date(report.createdAt).toLocaleDateString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Doctor:</Text>
          <Text style={styles.value}>{patient.doctorName}</Text>
        </View>
      </View>

      {/* Test Results */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Results</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, { backgroundColor: '#f3f4f6' }]}>
            <Text style={[styles.tableCell, styles.tableHeader]}>Test</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Result</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Unit</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Reference Range</Text>
          </View>
          {report.results.map((result, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{result.testName}</Text>
              <Text style={styles.tableCell}>{result.value}</Text>
              <Text style={styles.tableCell}>{result.unit}</Text>
              <Text style={styles.tableCell}>{result.referenceRange}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Doctor Remarks */}
      {report.doctorRemarks && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Doctor's Remarks</Text>
          <Text style={styles.value}>{report.doctorRemarks}</Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Reviewed by: {report.reviewedBy} | Generated on: {new Date().toLocaleString()}
        </Text>
        <Text style={styles.footerText}>
          Azza Medical Laboratory Services - azzaarafath@gmail.com
        </Text>
      </View>
    </Page>
  </Document>
)

// Invoice PDF Component
const InvoicePDF: React.FC<{ invoice: Invoice; patient: Patient }> = ({ invoice, patient }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Invoice</Text>
        <Text style={styles.subtitle}>Azza Medical Laboratory Services - Unique Place for all Diagnostic needs</Text>
      </View>

      {/* Invoice Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Invoice Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Invoice ID:</Text>
          <Text style={styles.value}>{invoice.id}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Patient Name:</Text>
          <Text style={styles.value}>{patient.firstName} {patient.lastName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{new Date(invoice.createdAt).toLocaleDateString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{invoice.status}</Text>
        </View>
      </View>

      {/* Patient Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patient Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Age:</Text>
          <Text style={styles.value}>{patient.age} years</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Gender:</Text>
          <Text style={styles.value}>{patient.gender}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{patient.phone}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{patient.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Doctor:</Text>
          <Text style={styles.value}>{patient.doctorName}</Text>
        </View>
      </View>

      {/* Line Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, { backgroundColor: '#f3f4f6' }]}>
            <Text style={[styles.tableCell, styles.tableHeader]}>Test</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Quantity</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Unit Price</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Total</Text>
          </View>
          {invoice.lineItems.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.testName}</Text>
              <Text style={styles.tableCell}>{item.quantity}</Text>
              <Text style={styles.tableCell}>LKR {item.unitPrice.toFixed(2)}</Text>
              <Text style={styles.tableCell}>LKR {item.total.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Totals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Summary</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Subtotal:</Text>
          <Text style={styles.value}>LKR {invoice.subtotal.toFixed(2)}</Text>
        </View>
        {invoice.discountAmount > 0 && (
          <View style={styles.row}>
            <Text style={styles.label}>Discount ({invoice.discountPercent}%):</Text>
            <Text style={styles.value}>-LKR {invoice.discountAmount.toFixed(2)}</Text>
          </View>
        )}
        <View style={styles.row}>
          <Text style={[styles.label, { fontSize: 12, fontWeight: 'bold' }]}>Grand Total:</Text>
          <Text style={[styles.value, { fontSize: 12, fontWeight: 'bold' }]}>LKR {invoice.grandTotal.toFixed(2)}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Generated on: {new Date().toLocaleString()}
        </Text>
        <Text style={styles.footerText}>
          Azza Medical Laboratory Services - azzaarafath@gmail.com
        </Text>
      </View>
    </Page>
  </Document>
)

// Export functions
export const generateReportPDF = async (report: Report, patient: Patient) => {
  const blob = await pdf(<ReportPDF report={report} patient={patient} />).toBlob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Lab_Report_${report.id}.pdf`
  link.click()
  URL.revokeObjectURL(url)
}

export const generateInvoicePDF = async (invoice: Invoice, patient: Patient) => {
  const blob = await pdf(<InvoicePDF invoice={invoice} patient={patient} />).toBlob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Invoice_${invoice.id}.pdf`
  link.click()
  URL.revokeObjectURL(url)
}