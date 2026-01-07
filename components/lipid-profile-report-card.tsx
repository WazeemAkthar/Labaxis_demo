"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface LipidProfileReportCardProps {
  onValuesChange: (values: any) => void;
}

export function LipidProfileReportCard({
  onValuesChange,
}: LipidProfileReportCardProps) {
  const [values, setValues] = useState({
    totalCholesterol: "",
    hdl: "",
    triglycerides: "",
    ldl: "",
  });

  const getColorClass = (value: number, type: 'total' | 'hdl' | 'ldl' | 'vldl' | 'tg' | 'ratio') => {
    if (!value) return "";
    
    switch(type) {
      case 'total':
        if (value < 200) return "border-green-500 bg-green-50 dark:bg-green-950";
        if (value >= 200 && value <= 239) return "border-yellow-500 bg-yellow-50 dark:bg-yellow-950";
        return "border-red-500 bg-red-50 dark:bg-red-950";
      
      case 'hdl':
        return value >= 40 && value <= 60 
          ? "border-green-500 bg-green-50 dark:bg-green-950"
          : "border-red-500 bg-red-50 dark:bg-red-950";
      
      case 'ldl':
        if (value <= 129) return "border-green-500 bg-green-50 dark:bg-green-950";
        if (value >= 129 && value <= 160) return "border-yellow-500 bg-yellow-50 dark:bg-yellow-950";
        return "border-red-500 bg-red-50 dark:bg-red-950";
      
      case 'vldl':
        return value >= 7 && value <= 35
          ? "border-green-500 bg-green-50 dark:bg-green-950"
          : "border-red-500 bg-red-50 dark:bg-red-950";
      
      case 'tg':
        if (value < 150) return "border-green-500 bg-green-50 dark:bg-green-950";
        if (value >= 150 && value <= 199) return "border-yellow-500 bg-yellow-50 dark:bg-yellow-950";
        if (value >= 200 && value <= 500) return "border-orange-500 bg-orange-50 dark:bg-orange-950";
        return "border-red-500 bg-red-50 dark:bg-red-950";
      
      case 'ratio':
        return value >= 3.0 && value <= 5.0
          ? "border-green-500 bg-green-50 dark:bg-green-950"
          : "border-red-500 bg-red-50 dark:bg-red-950";
      
      default:
        return "";
    }
  };

  const updateValue = (field: string, value: string) => {
    const newValues = { ...values, [field]: value };
    setValues(newValues);

    // Parse values
    const total = parseFloat(newValues.totalCholesterol) || 0;
    const hdl = parseFloat(newValues.hdl) || 0;
    const tg = parseFloat(newValues.triglycerides) || 0;

    // Calculate VLDL
    const vldl = tg > 0 ? tg / 5 : 0;

    // Calculate LDL using Friedewald equation only if TG < 400
    let ldl = 0;
    if (tg >= 400) {
      ldl = parseFloat(newValues.ldl) || 0;
    } else {
      ldl = total > 0 && hdl > 0 && tg > 0 ? total - hdl - tg / 5 : 0;
    }

    // Calculate TC/HDL ratio
    const tcHdlRatio = total > 0 && hdl > 0 ? total / hdl : 0;

    // Send all values to parent
    onValuesChange({
      totalCholesterol: newValues.totalCholesterol,
      hdl: newValues.hdl,
      triglycerides: newValues.triglycerides,
      vldl: vldl ? vldl.toFixed(1) : "",
      ldl: ldl ? ldl.toFixed(1) : "",
      tcHdlRatio: tcHdlRatio ? tcHdlRatio.toFixed(2) : "",
    });
  };

  const total = parseFloat(values.totalCholesterol) || 0;
  const hdl = parseFloat(values.hdl) || 0;
  const tg = parseFloat(values.triglycerides) || 0;

  const vldl = tg > 0 ? (tg / 5).toFixed(1) : "";

  // LDL calculation based on triglycerides
  let ldl = "";
  const isHighTriglycerides = tg >= 400;

  if (isHighTriglycerides) {
    ldl = values.ldl;
  } else {
    ldl = total > 0 && hdl > 0 && tg > 0 ? (total - hdl - tg / 5).toFixed(1) : "";
  }

  const tcHdlRatio = total > 0 && hdl > 0 ? (total / hdl).toFixed(2) : "";

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="outline">LIPID</Badge>
          Lipid Profile
        </CardTitle>
        <CardDescription>
          Enter Total Cholesterol, HDL, and Triglycerides. VLDL, LDL, and TC/HDL Ratio will be calculated automatically.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Parameters */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">
            Main Parameters
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalCholesterol">Cholesterol-Total</Label>
              <Input
                id="totalCholesterol"
                type="number"
                step="0.1"
                value={values.totalCholesterol}
                onChange={(e) => updateValue("totalCholesterol", e.target.value)}
                placeholder="186.0"
                className={getColorClass(total, 'total')}
              />
              <div className="text-xs text-muted-foreground space-y-1">
                <div>mg/dL</div>
                <div className="font-medium">
                  Desirable &lt;200<br/>
                  Borderline High 200-239<br/>
                  High &gt;239
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hdl">HDL Cholesterol</Label>
              <Input
                id="hdl"
                type="number"
                step="0.1"
                value={values.hdl}
                onChange={(e) => updateValue("hdl", e.target.value)}
                placeholder="48.0"
                className={getColorClass(hdl, 'hdl')}
              />
              <div className="text-xs text-muted-foreground space-y-1">
                <div>mg/dL</div>
                <div className="font-medium">40 - 60</div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="triglycerides">Triglycerides</Label>
              <Input
                id="triglycerides"
                type="number"
                step="0.1"
                value={values.triglycerides}
                onChange={(e) => updateValue("triglycerides", e.target.value)}
                placeholder="193.0"
                className={getColorClass(tg, 'tg')}
              />
              <div className="text-xs text-muted-foreground space-y-1">
                <div>mg/dL</div>
                <div className="font-medium">
                  Normal: &lt;150<br/>
                  High: 150-199<br/>
                  Hypertriglyceridemia 200-500<br/>
                  Very High: &gt;500
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Calculated Parameters */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">
            Calculated Parameters
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ldl">LDL Cholesterol {tg >= 400 && <span className="text-orange-500">(Manual)</span>}</Label>
              <Input
                id="ldl"
                type={tg >= 400 ? "number" : "text"}
                step={tg >= 400 ? "0.1" : undefined}
                value={ldl}
                onChange={(e) => tg >= 400 ? updateValue("ldl", e.target.value) : null}
                placeholder={tg >= 400 ? "Enter LDL" : "99.4"}
                className={`${tg >= 400 ? "" : "bg-muted"} ${ldl ? getColorClass(parseFloat(ldl), 'ldl') : ""}`}
                readOnly={tg < 400}
              />
              <div className="text-xs text-muted-foreground space-y-1">
                <div>mg/dL</div>
                <div className="font-medium">
                  Desirable &lt;=129<br/>
                  Borderline High 129-160<br/>
                  High &gt;160
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vldl">VLDL Cholesterol</Label>
              <Input
                id="vldl"
                type="text"
                value={vldl}
                placeholder="38.6"
                className={`bg-muted ${vldl ? getColorClass(parseFloat(vldl), 'vldl') : ""}`}
                readOnly
              />
              <div className="text-xs text-muted-foreground space-y-1">
                <div>mg/dL</div>
                <div className="font-medium">7 - 35</div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tcHdlRatio">TC/HDL Ratio</Label>
              <Input
                id="tcHdlRatio"
                type="text"
                value={tcHdlRatio}
                placeholder="3.88"
                className={`bg-muted ${tcHdlRatio ? getColorClass(parseFloat(tcHdlRatio), 'ratio') : ""}`}
                readOnly
              />
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Ratio</div>
                <div className="font-medium">3.0 - 5.0</div>
              </div>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="text-sm text-muted-foreground italic border-t pt-4">
          Note: 10-12 hours fasting sample is required.
        </div>
      </CardContent>
    </Card>
  );
}