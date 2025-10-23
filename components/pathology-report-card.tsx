"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface PathologyReportCardProps {
  onValuesChange: (values: { report: string }) => void
}

export function PathologyReportCard({ onValuesChange }: PathologyReportCardProps) {
  const [report, setReport] = useState("")

  useEffect(() => {
    onValuesChange({ report })
  }, [report])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pathology Report</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Enter pathologist remarks..."
          value={report}
          onChange={(e) => setReport(e.target.value)}
          rows={6}
        />
      </CardContent>
    </Card>
  )
}
