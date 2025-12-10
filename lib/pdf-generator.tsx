import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font, pdf } from '@react-pdf/renderer'
import type { Report, Patient, Invoice } from './data-manager'

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
    padding: 20,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 12,
    borderBottom: '1 solid #e0e0e0',
    paddingBottom: 8
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 3,
    color: '#1f2937'
  },
  subtitle: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 6
  },
  section: {
    marginBottom: 8,
    padding: 6,
    backgroundColor: '#f9fafb',
    borderRadius: 2
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#374151'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3
  },
  label: {
    fontSize: 8,
    color: '#6b7280',
    fontWeight: 'bold'
  },
  value: {
    fontSize: 8,
    color: '#1f2937'
  },
  table: {
    marginBottom: 8
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e5e7eb',
    paddingVertical: 2
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    fontWeight: 'bold',
    fontSize: 7,
    padding: 3
  },
  tableCell: {
    fontSize: 7,
    padding: 3,
    flex: 1
  },
  fbcSection: {
    marginBottom: 6
  },
  fbcSectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 3,
    color: '#374151',
    backgroundColor: '#f3f4f6',
    padding: 2
  },
  fbcTable: {
    marginBottom: 4
  },
  fbcTableRow: {
    flexDirection: 'row',
    borderBottom: '0.5 solid #e5e7eb',
    paddingVertical: 1.5
  },
  fbcTableHeader: {
    backgroundColor: '#f9fafb',
    fontWeight: 'bold',
    fontSize: 6,
    padding: 2
  },
  fbcTableCell: {
    fontSize: 6,
    padding: 2
  },
  fbcParameterCell: {
    flex: 2
  },
  fbcResultCell: {
    flex: 1,
    textAlign: 'center'
  },
  fbcUnitCell: {
    flex: 1.2,
    textAlign: 'center'
  },
  fbcRangeCell: {
    flex: 1.5,
    textAlign: 'center'
  },
  fbcStatusCell: {
    flex: 0.8,
    textAlign: 'center'
  },
  statusBadge: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    fontSize: 5,
    padding: 1,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  separator: {
    borderBottom: '1 solid #d1d5db',
    marginVertical: 3
  },
  qrBox: {
    width: 60,
    height: 60,
    backgroundColor: '#ffffff',
    border: '1 solid #000',
    marginBottom: 5,
    position: 'relative'
  },
  qrPattern: {
    position: 'absolute',
    backgroundColor: '#000000'
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 8,
    borderTop: '1 solid #e0e0e0',
    textAlign: 'center'
  },
  footerText: {
    fontSize: 6,
    color: '#9ca3af'
  },
  // Standard header styles
  labHeader: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: '2 solid #374151'
  },
  labTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1f2937',
    textAlign: 'center'
  },
  labSubtitle: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 2
  },
  labContact: {
    fontSize: 8,
    color: '#6b7280',
    textAlign: 'center'
  },
  documentBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#374151',
    color: '#ffffff',
    fontSize: 10,
    padding: 6,
    fontWeight: 'bold'
  },
  qrText: {
    fontSize: 6,
    textAlign: 'center',
    color: '#666',
    marginTop: 20
  }
})

// Helper function to check value status
const checkValueStatus = (value: string, referenceRange: string) => {
  if (!value || !referenceRange) return 'normal'
  
  const numValue = parseFloat(value)
  if (isNaN(numValue)) return 'normal'
  
  const rangeMatch = referenceRange.match(/(\d+\.?\d*)-(\d+\.?\d*)/)
  if (!rangeMatch) return 'normal'
  
  const minValue = parseFloat(rangeMatch[1])
  const maxValue = parseFloat(rangeMatch[2])
  
  if (numValue < minValue) return 'low'
  if (numValue > maxValue) return 'high'
  return 'normal'
}


// Report PDF Component
const ReportPDF: React.FC<{ report: Report; patient: Patient }> = ({ report, patient }) => {
  // Categorize FBC results
  const fbcResults = report.results.filter(result => result.testCode === 'FBC')
  const otherResults = report.results.filter(result => result.testCode !== 'FBC')
  
  const mainParams = fbcResults.filter(result => 
    ['Hemoglobin', 'RBC', 'PCV', 'MCV', 'MCH', 'MCHC', 'RDW-CV', 'Platelets', 'WBC'].includes(result.testName)
  )
  
  const differentialCount = fbcResults.filter(result => 
    ['Neutrophils', 'Lymphocytes', 'Eosinophils', 'Monocytes', 'Basophils'].includes(result.testName)
  )
  
  const absoluteCount = fbcResults.filter(result => 
    ['Neutrophils (Abs)', 'Lymphocytes (Abs)', 'Eosinophils (Abs)', 'Monocytes (Abs)', 'Basophils (Abs)'].includes(result.testName)
  )

  const renderFBCTable = (results: any[], title?: string) => (
    <View style={styles.fbcSection}>
      {title && <Text style={styles.fbcSectionTitle}>{title}</Text>}
      <View style={styles.fbcTable}>
        <View style={[styles.fbcTableRow, { backgroundColor: '#f9fafb' }]}>
          <Text style={[styles.fbcTableCell, styles.fbcTableHeader, styles.fbcParameterCell]}>Parameter</Text>
          <Text style={[styles.fbcTableCell, styles.fbcTableHeader, styles.fbcResultCell]}>Result</Text>
          <Text style={[styles.fbcTableCell, styles.fbcTableHeader, styles.fbcUnitCell]}>Units</Text>
          <Text style={[styles.fbcTableCell, styles.fbcTableHeader, styles.fbcRangeCell]}>Reference Range</Text>
          <Text style={[styles.fbcTableCell, styles.fbcTableHeader, styles.fbcStatusCell]}>Status</Text>
        </View>
        {results.map((result, index) => {
          const status = checkValueStatus(result.value, result.referenceRange)
          return (
            <View key={index} style={styles.fbcTableRow}>
              <Text style={[styles.fbcTableCell, styles.fbcParameterCell]}>{result.testName}</Text>
              <Text style={[styles.fbcTableCell, styles.fbcResultCell]}>{result.value}</Text>
              <Text style={[styles.fbcTableCell, styles.fbcUnitCell]}>{result.unit}</Text>
              <Text style={[styles.fbcTableCell, styles.fbcRangeCell]}>{result.referenceRange}</Text>
              <Text style={[styles.fbcTableCell, styles.fbcStatusCell]}>
                {status === 'low' && <Text style={styles.statusBadge}>L</Text>}
                {status === 'high' && <Text style={styles.statusBadge}>H</Text>}
              </Text>
            </View>
          )
        })}
      </View>
    </View>
  )

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>LabReportHub Medical Laboratory Services</Text>
          <Text style={styles.subtitle}>Unique Place for all Diagnostic needs</Text>
          {/* <Text style={styles.subtitle}>Phone: 0752537178, 0776452417, 0753274455</Text> */}
          <Text style={styles.subtitle}>Email: LabReportHub@gmail.com</Text>
          <View style={{ alignItems: 'flex-end', marginTop: 8 }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', backgroundColor: '#374151', color: '#ffffff', padding: 4 }}>
              Laboratory Report
            </Text>
          </View>
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

        {/* FBC Test Results */}
        {fbcResults.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>FBC - Full Blood Count</Text>
            
            {/* Main Parameters */}
            {mainParams.length > 0 && renderFBCTable(mainParams)}
            
            {/* Differential Count */}
            {differentialCount.length > 0 && (
              <>
                {mainParams.length > 0 && <View style={styles.separator} />}
                {renderFBCTable(differentialCount, 'Differential Count')}
              </>
            )}
            
            {/* Absolute Count */}
            {absoluteCount.length > 0 && (
              <>
                {(mainParams.length > 0 || differentialCount.length > 0) && <View style={styles.separator} />}
                {renderFBCTable(absoluteCount, 'Absolute Count')}
              </>
            )}
          </View>
        )}

        {/* Other Test Results */}
        {otherResults.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Other Test Results</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, { backgroundColor: '#f3f4f6' }]}>
                <Text style={[styles.tableCell, styles.tableHeader]}>Test</Text>
                <Text style={[styles.tableCell, styles.tableHeader]}>Result</Text>
                <Text style={[styles.tableCell, styles.tableHeader]}>Unit</Text>
                <Text style={[styles.tableCell, styles.tableHeader]}>Reference Range</Text>
              </View>
              {otherResults.map((result, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{result.testName}</Text>
                  <Text style={styles.tableCell}>{result.value}</Text>
                  <Text style={styles.tableCell}>{result.unit}</Text>
                  <Text style={styles.tableCell}>{result.referenceRange}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Doctor Remarks */}
        {report.doctorRemarks && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Doctor's Remarks</Text>
            <Text style={styles.value}>{report.doctorRemarks}</Text>
          </View>
        )}

        {/* End of Report with Demo QR Codes */}
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 15 }}>
            *** End of Report ***
          </Text>
          
          {/* Demo QR Codes */}
          <View style={{ flexDirection: 'row', gap: 30 }}>
            <View style={{ alignItems: 'center' }}>
              <View style={styles.qrBox}>
                <Text style={styles.qrText}>DEMO QR</Text>
              </View>
              <Text style={{ fontSize: 6 }}>Verification</Text>
              <Text style={{ fontSize: 5, color: '#666' }}>verify/{report.id.slice(-6)}</Text>
            </View>
            
            <View style={{ alignItems: 'center' }}>
              <View style={[styles.qrBox, { backgroundColor: '#333333' }]}>
                <Text style={styles.qrText}>DEMO QR</Text>
              </View>
              <Text style={{ fontSize: 6 }}>Report Link</Text>
              <Text style={{ fontSize: 5, color: '#666' }}>report/{report.id.slice(-6)}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Reviewed by: {report.reviewedBy} | Generated on: {new Date().toLocaleString()}
          </Text>
        </View>
      </Page>
    </Document>
  )
}

// Invoice PDF Component
const InvoicePDF: React.FC<{ invoice: Invoice; patient: Patient }> = ({ invoice, patient }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>LabReportHub Medical Laboratory Services</Text>
          <Text style={styles.subtitle}>Unique Place for all Diagnostic needs</Text>
          {/* <Text style={styles.subtitle}>Phone: 0752537178, 0776452417, 0753274455</Text> */}
          <Text style={styles.subtitle}>Email: LabReportHub@gmail.com</Text>
        </View>

        {/* Patient and Invoice Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill To & Invoice Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Invoice ID:</Text>
            <Text style={styles.value}>{invoice.id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Patient Name:</Text>
            <Text style={styles.value}>{patient.firstName} {patient.lastName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Patient ID:</Text>
            <Text style={styles.value}>{invoice.patientId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{new Date(invoice.createdAt).toLocaleDateString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tests:</Text>
            <Text style={styles.value}>{invoice.lineItems.length}</Text>
          </View>
        </View>

        {/* Test Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Details</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, { backgroundColor: '#f3f4f6' }]}>
              <Text style={[styles.tableCell, styles.tableHeader, { flex: 1 }]}>Code</Text>
              <Text style={[styles.tableCell, styles.tableHeader, { flex: 3 }]}>Test Name</Text>
              <Text style={[styles.tableCell, styles.tableHeader, { flex: 0.8, textAlign: 'center' }]}>Qty</Text>
              <Text style={[styles.tableCell, styles.tableHeader, { flex: 1.2, textAlign: 'right' }]}>Unit Price</Text>
              <Text style={[styles.tableCell, styles.tableHeader, { flex: 1.2, textAlign: 'right' }]}>Total</Text>
            </View>
            {invoice.lineItems.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 1 }]}>{item.testCode}</Text>
                <Text style={[styles.tableCell, { flex: 3 }]}>{item.testName}</Text>
                <Text style={[styles.tableCell, { flex: 0.8, textAlign: 'center' }]}>{item.quantity}</Text>
                <Text style={[styles.tableCell, { flex: 1.2, textAlign: 'right' }]}>LKR {item.unitPrice.toFixed(2)}</Text>
                <Text style={[styles.tableCell, { flex: 1.2, textAlign: 'right' }]}>LKR {item.total.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Totals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Invoice Summary</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Subtotal:</Text>
            <Text style={styles.value}>LKR {invoice.subtotal.toFixed(2)}</Text>
          </View>
          {invoice.discountAmount > 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>Discount ({(invoice.discountPercent * 100).toFixed(1)}%):</Text>
              <Text style={styles.value}>-LKR {invoice.discountAmount.toFixed(2)}</Text>
            </View>
          )}
          <View style={[styles.row, { borderTop: '1 solid #d1d5db', paddingTop: 3, marginTop: 3 }]}>
            <Text style={[styles.label, { fontSize: 10, fontWeight: 'bold' }]}>Grand Total:</Text>
            <Text style={[styles.value, { fontSize: 10, fontWeight: 'bold' }]}>LKR {invoice.grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for choosing LabReportHub Medical Laboratory Services for your healthcare needs.
          </Text>
          <Text style={styles.footerText}>
            For questions about this invoice, please contact us at info@LabReportHub.com
          </Text>
        </View>
      </Page>
    </Document>
  )
}

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