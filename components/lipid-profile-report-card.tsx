"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface LipidProfileReportCardProps {
  onValuesChange: (values: any) => void
}

export function LipidProfileReportCard({ onValuesChange }: LipidProfileReportCardProps) {
  const [values, setValues] = useState({
    totalCholesterol: "",
    hdl: "",
    triglycerides: "",
  })

  const updateValue = (field: string, value: string) => {
    const newValues = { ...values, [field]: value }
    setValues(newValues)

    // Parse values
    const total = parseFloat(newValues.totalCholesterol) || 0
    const hdl = parseFloat(newValues.hdl) || 0
    const tg = parseFloat(newValues.triglycerides) || 0

    // Calculate VLDL
    const vldl = tg > 0 ? tg / 5 : 0
    
    // Calculate LDL using Friedewald equation
    const ldl = total > 0 && hdl > 0 && tg > 0 ? total - hdl - (tg / 5) : 0
    
    // Calculate Non-HDL
    const nonHdl = total > 0 && hdl > 0 ? total - hdl : 0
    
    // Calculate LDL/HDL ratio
    const ldlHdlRatio = ldl > 0 && hdl > 0 ? ldl / hdl : 0
    
    // Calculate Total/HDL ratio
    const tcHdlRatio = total > 0 && hdl > 0 ? total / hdl : 0
    
    // Calculate TG/HDL ratio
    const tgHdlRatio = tg > 0 && hdl > 0 ? tg / hdl : 0

    // Send all values to parent
    onValuesChange({
      totalCholesterol: newValues.totalCholesterol,
      hdl: newValues.hdl,
      triglycerides: newValues.triglycerides,
      vldl: vldl ? vldl.toFixed(2) : "",
      ldl: ldl ? ldl.toFixed(2) : "",
      nonHdl: nonHdl ? nonHdl.toFixed(2) : "",
      ldlHdlRatio: ldlHdlRatio ? ldlHdlRatio.toFixed(2) : "",
      tcHdlRatio: tcHdlRatio ? tcHdlRatio.toFixed(2) : "",
      tgHdlRatio: tgHdlRatio ? tgHdlRatio.toFixed(2) : "",
    })
  }

  const total = parseFloat(values.totalCholesterol) || 0
  const hdl = parseFloat(values.hdl) || 0
  const tg = parseFloat(values.triglycerides) || 0
  
  const vldl = tg > 0 ? (tg / 5).toFixed(2) : ""
  const ldl = total > 0 && hdl > 0 && tg > 0 ? (total - hdl - (tg / 5)).toFixed(2) : ""
  const nonHdl = total > 0 && hdl > 0 ? (total - hdl).toFixed(2) : ""
  const ldlHdlRatio = ldl && hdl > 0 ? (parseFloat(ldl) / hdl).toFixed(2) : ""
  const tcHdlRatio = total > 0 && hdl > 0 ? (total / hdl).toFixed(2) : ""
  const tgHdlRatio = tg > 0 && hdl > 0 ? (tg / hdl).toFixed(2) : ""

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="outline">LIPID</Badge>
          Lipid Profile
        </CardTitle>
        <CardDescription>
          Enter values below. VLDL, LDL, ratios, and Non-HDL will be calculated automatically.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Parameters */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">Main Parameters</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalCholesterol">Total Cholesterol</Label>
              <Input
                id="totalCholesterol"
                type="number"
                step="0.1"
                value={values.totalCholesterol}
                onChange={(e) => updateValue("totalCholesterol", e.target.value)}
                placeholder="180"
              />
              <div className="text-xs text-muted-foreground">mg/dL (125-200)</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hdl">HDL Cholesterol</Label>
              <Input
                id="hdl"
                type="number"
                step="0.1"
                value={values.hdl}
                onChange={(e) => updateValue("hdl", e.target.value)}
                placeholder="55"
              />
              <div className="text-xs text-muted-foreground">mg/dL (35-80)</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="triglycerides">Triglycerides</Label>
              <Input
                id="triglycerides"
                type="number"
                step="0.1"
                value={values.triglycerides}
                onChange={(e) => updateValue("triglycerides", e.target.value)}
                placeholder="172"
              />
              <div className="text-xs text-muted-foreground">mg/dL (25-200)</div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Calculated Parameters */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">Calculated Parameters</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vldl">VLDL</Label>
              <Input
                id="vldl"
                type="text"
                value={vldl}
                placeholder="Auto-calculated"
                className="bg-muted"
                readOnly
              />
              <div className="text-xs text-muted-foreground">mg/dL (5-40)</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ldl">LDL</Label>
              <Input
                id="ldl"
                type="text"
                value={ldl}
                placeholder="Auto-calculated"
                className="bg-muted"
                readOnly
              />
              <div className="text-xs text-muted-foreground">mg/dL (85-130)</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nonHdl">Non-HDL Cholesterol</Label>
              <Input
                id="nonHdl"
                type="text"
                value={nonHdl}
                placeholder="Auto-calculated"
                className="bg-muted"
                readOnly
              />
              <div className="text-xs text-muted-foreground">mg/dL (&lt;130)</div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Ratios */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">Risk Assessment Ratios</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ldlHdlRatio">LDL/HDL Ratio</Label>
              <Input
                id="ldlHdlRatio"
                type="text"
                value={ldlHdlRatio}
                placeholder="Auto-calculated"
                className="bg-muted"
                readOnly
              />
              <div className="text-xs text-muted-foreground">Ratio (1.5-3.5)</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tcHdlRatio">Total Cholesterol/HDL Ratio</Label>
              <Input
                id="tcHdlRatio"
                type="text"
                value={tcHdlRatio}
                placeholder="Auto-calculated"
                className="bg-muted"
                readOnly
              />
              <div className="text-xs text-muted-foreground">Ratio (3.5-5.0)</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tgHdlRatio">TG/HDL Ratio</Label>
              <Input
                id="tgHdlRatio"
                type="text"
                value={tgHdlRatio}
                placeholder="Auto-calculated"
                className="bg-muted"
                readOnly
              />
              <div className="text-xs text-muted-foreground">Ratio (&lt;4.0)</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}