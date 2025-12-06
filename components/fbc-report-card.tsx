"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface FBCValues {
  hemoglobin: string
  rbc: string
  pcv: string
  mcv: string
  mch: string
  mchc: string
  rdwCv: string
  platelets: string
  wbc: string
  neutrophils: string
  lymphocytes: string
  eosinophils: string
  monocytes: string
  basophils: string
  neutrophilsAbs: string
  lymphocytesAbs: string
  eosinophilsAbs: string
  monocytesAbs: string
  basophilsAbs: string
}

interface FBCReportCardProps {
  onValuesChange: (values: FBCValues) => void
}

export function FBCReportCard({ onValuesChange }: FBCReportCardProps) {
  const [values, setValues] = useState<FBCValues>({
    hemoglobin: "",
    rbc: "",
    pcv: "",
    mcv: "",
    mch: "",
    mchc: "",
    rdwCv: "",
    platelets: "",
    wbc: "",
    neutrophils: "",
    lymphocytes: "",
    eosinophils: "",
    monocytes: "",
    basophils: "",
    neutrophilsAbs: "",
    lymphocytesAbs: "",
    eosinophilsAbs: "",
    monocytesAbs: "",
    basophilsAbs: "",
  })

const updateValue = (field: keyof FBCValues, value: string) => {
  const newValues = { ...values, [field]: value }
  setValues(newValues)
  
  // Calculate derived values based on the new values
  const hb = field === 'hemoglobin' ? parseFloat(value) : parseFloat(newValues.hemoglobin)
  const rbc = field === 'rbc' ? parseFloat(value) : parseFloat(newValues.rbc)
  const pcv = field === 'pcv' ? parseFloat(value) : parseFloat(newValues.pcv)
  const wbc = field === 'wbc' ? parseFloat(value) : parseFloat(newValues.wbc)

  const updatedValues = {
    ...newValues,
    mcv: (pcv && rbc && !isNaN(pcv) && !isNaN(rbc) && rbc !== 0) ? ((pcv / rbc) * 10).toFixed(1) : '',
    mch: (hb && rbc && !isNaN(hb) && !isNaN(rbc) && rbc !== 0) ? ((hb / rbc) * 10).toFixed(1) : '',
    mchc: (hb && pcv && !isNaN(hb) && !isNaN(pcv) && pcv !== 0) ? ((hb / pcv) * 100).toFixed(1) : '',
    neutrophilsAbs: (wbc && newValues.neutrophils && !isNaN(wbc) && !isNaN(parseFloat(newValues.neutrophils))) ? 
      ((parseFloat(newValues.neutrophils) / 100) * wbc).toFixed(2) : '',
    lymphocytesAbs: (wbc && newValues.lymphocytes && !isNaN(wbc) && !isNaN(parseFloat(newValues.lymphocytes))) ? 
      ((parseFloat(newValues.lymphocytes) / 100) * wbc).toFixed(2) : '',
    eosinophilsAbs: (wbc && newValues.eosinophils && !isNaN(wbc) && !isNaN(parseFloat(newValues.eosinophils))) ? 
      ((parseFloat(newValues.eosinophils) / 100) * wbc).toFixed(2) : '',
    monocytesAbs: (wbc && newValues.monocytes && !isNaN(wbc) && !isNaN(parseFloat(newValues.monocytes))) ? 
      ((parseFloat(newValues.monocytes) / 100) * wbc).toFixed(2) : '',
    basophilsAbs: (wbc && newValues.basophils && !isNaN(wbc) && !isNaN(parseFloat(newValues.basophils))) ? 
      ((parseFloat(newValues.basophils) / 100) * wbc).toFixed(2) : '',
  }
  
  // Pass calculated values to parent, but don't store them in local state
  onValuesChange(updatedValues)
}

  // Calculate derived values for display
  const calculateDerivedValues = () => {
    const hb = parseFloat(values.hemoglobin)
    const rbc = parseFloat(values.rbc)
    const pcv = parseFloat(values.pcv)
    const wbc = parseFloat(values.wbc)

    return {
  mcv: (pcv && rbc && !isNaN(pcv) && !isNaN(rbc) && rbc !== 0) ? ((pcv / rbc) * 10).toFixed(1) : '',
  mch: (hb && rbc && !isNaN(hb) && !isNaN(rbc) && rbc !== 0) ? ((hb / rbc) * 10).toFixed(1) : '',
  mchc: (hb && pcv && !isNaN(hb) && !isNaN(pcv) && pcv !== 0) ? ((hb / pcv) * 100).toFixed(1) : '',
  neutrophilsAbs: (wbc && values.neutrophils && !isNaN(wbc) && !isNaN(parseFloat(values.neutrophils))) ? 
    ((parseFloat(values.neutrophils) / 100) * wbc).toFixed(2) : '',
  lymphocytesAbs: (wbc && values.lymphocytes && !isNaN(wbc) && !isNaN(parseFloat(values.lymphocytes))) ? 
    ((parseFloat(values.lymphocytes) / 100) * wbc).toFixed(2) : '',
  eosinophilsAbs: (wbc && values.eosinophils && !isNaN(wbc) && !isNaN(parseFloat(values.eosinophils))) ? 
    ((parseFloat(values.eosinophils) / 100) * wbc).toFixed(2) : '',
  monocytesAbs: (wbc && values.monocytes && !isNaN(wbc) && !isNaN(parseFloat(values.monocytes))) ? 
    ((parseFloat(values.monocytes) / 100) * wbc).toFixed(2) : '',
  basophilsAbs: (wbc && values.basophils && !isNaN(wbc) && !isNaN(parseFloat(values.basophils))) ? 
    ((parseFloat(values.basophils) / 100) * wbc).toFixed(2) : '',
}
  }

  const derivedValues = calculateDerivedValues()

  // Calculate total percentage for differential count
  const totalPercentage = 
    (parseFloat(values.neutrophils) || 0) +
    (parseFloat(values.lymphocytes) || 0) +
    (parseFloat(values.eosinophils) || 0) +
    (parseFloat(values.monocytes) || 0) +
    (parseFloat(values.basophils) || 0)

  const isPercentageValid = Math.abs(totalPercentage - 100) < 0.1

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="outline">FBC</Badge>
          Full Blood Count
        </CardTitle>
        <CardDescription>
          Enter values below. MCV, MCH, MCHC and absolute counts will be calculated automatically.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Parameters */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">Main Parameters</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hemoglobin">Hemoglobin</Label>
              <Input
                id="hemoglobin"
                type="number"
                step="0.1"
                value={values.hemoglobin}
                onChange={(e) => updateValue("hemoglobin", e.target.value)}
                placeholder="12.2"
              />
              <div className="text-xs text-muted-foreground">g/dL (11.0 - 16.5)</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rbc">RBC</Label>
              <Input
                id="rbc"
                type="number"
                step="0.01"
                value={values.rbc}
                onChange={(e) => updateValue("rbc", e.target.value)}
                placeholder="3.82"
              />
              <div className="text-xs text-muted-foreground">x10⁶/μL (3.5 - 6.2)</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pcv">PCV</Label>
              <Input
                id="pcv"
                type="number"
                step="0.1"
                value={values.pcv}
                onChange={(e) => updateValue("pcv", e.target.value)}
                placeholder="36.7"
              />
              <div className="text-xs text-muted-foreground">% (36.0 - 54.0)</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mcv">MCV</Label>
              <Input
                id="mcv"
                type="number"
                step="0.1"
                value={derivedValues.mcv}
                placeholder="Auto-calculated"
                className="bg-muted"
                readOnly
              />
              <div className="text-xs text-muted-foreground">fL (80.0 - 100.0) - PCV/RBC</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mch">MCH</Label>
              <Input
                id="mch"
                type="number"
                step="0.1"
                value={derivedValues.mch}
                placeholder="Auto-calculated"
                className="bg-muted"
                readOnly
              />
              <div className="text-xs text-muted-foreground">pg (27.0 - 34.0) - Hb/RBC</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mchc">MCHC</Label>
              <Input
                id="mchc"
                type="number"
                step="0.1"
                value={derivedValues.mchc}
                placeholder="Auto-calculated"
                className="bg-muted"
                readOnly
              />
              <div className="text-xs text-muted-foreground">g/dL (32.0 - 36.0) - Hb/PCV</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rdwCv">RDW-CV</Label>
              <Input
                id="rdwCv"
                type="number"
                step="0.1"
                value={values.rdwCv}
                onChange={(e) => updateValue("rdwCv", e.target.value)}
                placeholder="14.5"
              />
              <div className="text-xs text-muted-foreground">% (11.0 - 16.0)</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="platelets">Platelets</Label>
              <Input
                id="platelets"
                type="number"
                value={values.platelets}
                onChange={(e) => updateValue("platelets", e.target.value)}
                placeholder="306"
              />
              <div className="text-xs text-muted-foreground">x10³/μL (150 - 450)</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wbc">WBC</Label>
              <Input
                id="wbc"
                type="number"
                step="0.1"
                value={values.wbc}
                onChange={(e) => updateValue("wbc", e.target.value)}
                placeholder="5.9"
              />
              <div className="text-xs text-muted-foreground">x10³/μL (4.0 - 10.0)</div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Differential Count */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm text-muted-foreground">Differential Count</h4>
            <div className={`text-sm ${isPercentageValid ? 'text-green-600' : 'text-red-600'}`}>
              Total: {totalPercentage.toFixed(1)}% {isPercentageValid ? '✓' : '(should be 100%)'}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="neutrophils">Neutrophils</Label>
              <Input
                id="neutrophils"
                type="number"
                step="0.1"
                value={values.neutrophils}
                onChange={(e) => updateValue("neutrophils", e.target.value)}
                placeholder="%"
              />
              <div className="text-xs text-muted-foreground">% (40.0 - 70.0)</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lymphocytes">Lymphocytes</Label>
              <Input
                id="lymphocytes"
                type="number"
                step="0.1"
                value={values.lymphocytes}
                onChange={(e) => updateValue("lymphocytes", e.target.value)}
                placeholder="%"
              />
              <div className="text-xs text-muted-foreground">% (20.0 - 40.0)</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eosinophils">Eosinophils</Label>
              <Input
                id="eosinophils"
                type="number"
                step="0.1"
                value={values.eosinophils}
                onChange={(e) => updateValue("eosinophils", e.target.value)}
                placeholder="%"
              />
              <div className="text-xs text-muted-foreground">% (1.0 - 4.0)</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monocytes">Monocytes</Label>
              <Input
                id="monocytes"
                type="number"
                step="0.1"
                value={values.monocytes}
                onChange={(e) => updateValue("monocytes", e.target.value)}
                placeholder="%"
              />
              <div className="text-xs text-muted-foreground">% (3.0 - 12.0)</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="basophils">Basophils</Label>
              <Input
                id="basophils"
                type="number"
                step="0.1"
                value={values.basophils}
                onChange={(e) => updateValue("basophils", e.target.value)}
                placeholder="%"
              />
              <div className="text-xs text-muted-foreground">% (0-1)</div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Absolute Count */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">Absolute Count</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="neutrophilsAbs">Neutrophils</Label>
              <Input
                id="neutrophilsAbs"
                type="number"
                step="0.01"
                value={derivedValues.neutrophilsAbs}
                placeholder="Auto-calculated"
                className="bg-muted"
                readOnly
              />
              <div className="text-xs text-muted-foreground">x10³/μL (2.0-7.5)</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lymphocytesAbs">Lymphocytes</Label>
              <Input
                id="lymphocytesAbs"
                type="number"
                step="0.01"
                value={derivedValues.lymphocytesAbs}
                placeholder="Auto-calculated"
                className="bg-muted"
                readOnly
              />
              <div className="text-xs text-muted-foreground">x10³/μL (1.0-4.0)</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eosinophilsAbs">Eosinophils</Label>
              <Input
                id="eosinophilsAbs"
                type="number"
                step="0.01"
                value={derivedValues.eosinophilsAbs}
                placeholder="Auto-calculated"
                className="bg-muted"
                readOnly
              />
              <div className="text-xs text-muted-foreground">x10³/μL (0.05-0.50)</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monocytesAbs">Monocytes</Label>
              <Input
                id="monocytesAbs"
                type="number"
                step="0.01"
                value={derivedValues.monocytesAbs}
                placeholder="Auto-calculated"
                className="bg-muted"
                readOnly
              />
              <div className="text-xs text-muted-foreground">x10³/μL (0.20-1.00)</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="basophilsAbs">Basophils</Label>
              <Input
                id="basophilsAbs"
                type="number"
                step="0.01"
                value={derivedValues.basophilsAbs}
                placeholder="Auto-calculated"
                className="bg-muted"
                readOnly
              />
              <div className="text-xs text-muted-foreground">x10³/μL (0.00-0.20)</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}