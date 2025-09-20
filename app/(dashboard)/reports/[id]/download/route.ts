import { NextRequest, NextResponse } from 'next/server'
import { DataManager } from '@/lib/data-manager'
import { generateReportPDF } from '@/lib/pdf-generator'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reportId = params.id
    const searchParams = request.nextUrl.searchParams
    const patientName = searchParams.get('patient')

    // Get report data
    const dataManager = DataManager.getInstance()
    const report = dataManager.getReports().find(r => r.id === reportId)
    
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    // Get patient data
    const patient = dataManager.getPatientById(report.patientId)
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    // Optional: Verify patient name matches (for security)
    if (patientName && patient.name !== patientName) {
      return NextResponse.json({ error: 'Invalid access' }, { status: 403 })
    }

    // Generate PDF buffer
    // Ensure generateReportPDF returns binary data (ArrayBuffer | Uint8Array | Buffer).
    const pdfData = await generateReportPDF(report, patient) as ArrayBuffer | Uint8Array | Buffer | null | undefined

    // Normalize to an ArrayBuffer or Uint8Array for NextResponse body
    let body: ArrayBuffer | Uint8Array
    if (pdfData instanceof ArrayBuffer) {
      body = pdfData
    } else if (typeof Uint8Array !== 'undefined' && pdfData instanceof Uint8Array) {
      body = pdfData
    } else if (typeof Buffer !== 'undefined' && Buffer.isBuffer(pdfData)) {
      body = pdfData
    } else {
      // If generateReportPDF returned void/null/undefined, return an error
      console.error('generateReportPDF did not return PDF data', pdfData)
      return NextResponse.json({ error: 'Failed to generate PDF data' }, { status: 500 })
    }

    // Return PDF as response
    return new NextResponse(body as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Lab_Report_${reportId}.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    console.error('Error generating report download:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}