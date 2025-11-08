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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UFRValues {
  colour: string;
  appearance: string;
  ph: string;
  specificGravity: string;
  protein: string;
  sugar: string;
  urobilinogen: string;
  bile: string;
  acetone: string;
  epithelialCells: string;
  pusCells: string;
  redCells: string;
  crystals: string;
  casts: string;
  organisms: string;
  others: string;
}

interface UFRReportCardProps {
  onValuesChange: (values: UFRValues) => void;
}

export function UFRReportCard({ onValuesChange }: UFRReportCardProps) {
  const [values, setValues] = useState<UFRValues>({
    colour: "",
    appearance: "",
    ph: "",
    specificGravity: "",
    protein: "",
    sugar: "",
    urobilinogen: "",
    bile: "",
    acetone: "",
    epithelialCells: "",
    pusCells: "",
    redCells: "",
    crystals: "",
    casts: "",
    organisms: "",
    others: "",
  });

  const updateValue = (field: keyof UFRValues, value: string) => {
    const newValues = { ...values, [field]: value };
    setValues(newValues);
    onValuesChange(newValues);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="outline">UFR</Badge>
          Urine Full Report
        </CardTitle>
        <CardDescription>Enter urine analysis values below.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Physical/Chemical Examination */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">
            Physical & Chemical Examination
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="colour">Colour</Label>
              <Select
                value={values.colour}
                onValueChange={(value) => updateValue("colour", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select colour" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Pale Yellow">Pale Yellow</SelectItem>
                  <SelectItem value="Dark Yellow">Dark Yellow</SelectItem>
                  <SelectItem value="Amber">Amber</SelectItem>
                  <SelectItem value="Reddish">Reddish</SelectItem>
                  <SelectItem value="Brownish">Brownish</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="appearance">Appearance</Label>
              <Select
                value={values.appearance}
                onValueChange={(value) => updateValue("appearance", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select appearance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Clear">Clear</SelectItem>
                  <SelectItem value="Slightly Cloudy">
                    Slightly Cloudy
                  </SelectItem>
                  <SelectItem value="Slightly Turbid">
                    Slightly Turbid
                  </SelectItem>
                  <SelectItem value="Cloudy">Cloudy</SelectItem>
                  <SelectItem value="Turbid">Turbid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ph">PH</Label>
              <Select
                value={values.ph}
                onValueChange={(value) => updateValue("ph", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select PH" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Acidic">Acidic</SelectItem>
                  <SelectItem value="Neutral">Neutral</SelectItem>
                  <SelectItem value="Alkaline">Alkaline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specificGravity">Specific Gravity</Label>
              <Input
                id="specificGravity"
                type="number"
                step="0.001"
                value={values.specificGravity}
                onChange={(e) => updateValue("specificGravity", e.target.value)}
                placeholder="1.025"
              />
              <div className="text-xs text-muted-foreground">
                Normal: 1.010-1.025
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="protein">Protein (Albumin)</Label>
              <Select
                value={values.protein}
                onValueChange={(value) => updateValue("protein", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nil">Nil</SelectItem>
                  <SelectItem value="Faint trace">Faint trace</SelectItem>
                  <SelectItem value="Trace (15 mg/dL)">Trace (15 mg/dL)</SelectItem>
                  <SelectItem value="+ (30 mg/dL)">+ (30 mg/dL)</SelectItem>
                  <SelectItem value="++ (100 mg/dL)">++ (100 mg/dL)</SelectItem>
                  <SelectItem value="+++ (300 mg/dL)">+++ (300 mg/dL)</SelectItem>
                  <SelectItem value="++++ (2000 mg/dL)">++++ (2000 mg/dL)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sugar">Sugar (Reducing substances)</Label>
              <Select
                value={values.sugar}
                onValueChange={(value) => updateValue("sugar", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nil">Nil</SelectItem>
                  <SelectItem value="Trace (100 mg/dL)">Trace (100 mg/dL)</SelectItem>
                  <SelectItem value="+ (250 mg/dL)">+ (250 mg/dL)</SelectItem>
                  <SelectItem value="++ (500 mg/dL)">++ (500 mg/dL)</SelectItem>
                  <SelectItem value="+++ (1000 mg/dL)">+++ (1000 mg/dL)</SelectItem>
                  <SelectItem value="++++ (&ge;2000 mg/dL)">++++ (&ge;2000 mg/dL)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urobilinogen">Urobilinogen</Label>
              <Select
                value={values.urobilinogen}
                onValueChange={(value) => updateValue("urobilinogen", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Increased">Increased</SelectItem>
                  <SelectItem value="Decreased">Decreased</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bile">Bile</Label>
              <Select
                value={values.bile}
                onValueChange={(value) => updateValue("bile", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nil">Nil</SelectItem>
                  <SelectItem value="Present">Present</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="acetone">Acetone/KB</Label>
              <Select
                value={values.acetone}
                onValueChange={(value) => updateValue("acetone", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nil">Nil</SelectItem>
                  <SelectItem value="Present">Present</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Microscopic Examination */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">
            Centrifuge Deposit (Microscopic)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="epithelialCells">Epithelial cells</Label>
              <Input
                id="epithelialCells"
                value={values.epithelialCells}
                onChange={(e) => updateValue("epithelialCells", e.target.value)}
                placeholder="Few"
              />
              <div className="text-xs text-muted-foreground">/HPF</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pusCells">Pus cells</Label>
              <Input
                id="pusCells"
                value={values.pusCells}
                onChange={(e) => updateValue("pusCells", e.target.value)}
                placeholder="Nil"
              />
              <div className="text-xs text-muted-foreground">/HPF</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="redCells">Red cells</Label>
              <Input
                id="redCells"
                value={values.redCells}
                onChange={(e) => updateValue("redCells", e.target.value)}
                placeholder="Nil"
              />
              <div className="text-xs text-muted-foreground">/HPF</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="crystals">Crystals</Label>
              <Input
                id="crystals"
                value={values.crystals}
                onChange={(e) => updateValue("crystals", e.target.value)}
                placeholder="Nil"
              />
              <div className="text-xs text-muted-foreground">/HPF</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="casts">Casts</Label>
              <Input
                id="casts"
                value={values.casts}
                onChange={(e) => updateValue("casts", e.target.value)}
                placeholder="Nil"
              />
              <div className="text-xs text-muted-foreground">/HPF</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organisms">Organisms</Label>
              <Input
                id="organisms"
                value={values.organisms}
                onChange={(e) => updateValue("organisms", e.target.value)}
                placeholder="Nil"
              />
              <div className="text-xs text-muted-foreground">/HPF</div>
            </div>

            <div className="space-y-2 md:col-span-2 lg:col-span-3">
              <Label htmlFor="others">Others</Label>
              <Input
                id="others"
                value={values.others}
                onChange={(e) => updateValue("others", e.target.value)}
                placeholder="Additional findings"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
