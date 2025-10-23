"use client"

import React, { useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ReportQRCodeProps {
  reportId: string
  patientName: string
  className?: string
  size?: number
  showLabel?: boolean
}

export function ReportQRCode({ 
  reportId, 
  patientName, 
  className = "", 
  size = 100,
  showLabel = true 
}: ReportQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Generate the download URL for the report
  const generateDownloadURL = () => {
    const baseURL = typeof window !== 'undefined' ? window.location.origin : ''
    return `${baseURL}/reports/${reportId}/download?patient=${encodeURIComponent(patientName)}`
  }

  useEffect(() => {
    const generateQR = async () => {
      if (canvasRef.current) {
        const downloadURL = generateDownloadURL()
        
        try {
          await QRCode.toCanvas(canvasRef.current, downloadURL, {
            width: size,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#ffffff'
            }
          })
        } catch (error) {
          console.error('Error generating QR code:', error)
        }
      }
    }

    generateQR()
  }, [reportId, patientName, size])

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      <canvas 
        ref={canvasRef}
        className="border border-gray-300 rounded"
      />
      {showLabel && (
        <div className="text-center">
          <p className="text-xs text-muted-foreground mt-1">
            Report: {reportId}
          </p>
        </div>
      )}
    </div>
  )
}

export default ReportQRCode