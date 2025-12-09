"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TestTube } from "lucide-react";

interface BGRhReportCardProps {
  onValuesChange: (values: any) => void;
  initialValues?: {
    bloodGroup: string;
    rhesus: string;
  };
}

export function BGRhReportCard({ onValuesChange, initialValues }: BGRhReportCardProps) {
  const [values, setValues] = useState({
    bloodGroup: initialValues?.bloodGroup || "",
    rhesus: initialValues?.rhesus || "",
  });

  useEffect(() => {
    onValuesChange(values);
  }, [values, onValuesChange]);

  const handleChange = (field: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Blood Grouping & Rh
        </CardTitle>
        <CardDescription>
          Select blood group and Rhesus factor
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="bloodGroup">Blood Group *</Label>
            <Select
              value={values.bloodGroup}
              onValueChange={(value) => handleChange("bloodGroup", value)}
            >
              <SelectTrigger id="bloodGroup">
                <SelectValue placeholder="Select blood group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="AB">AB</SelectItem>
                <SelectItem value="O">O</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rhesus">Rhesus Factor *</Label>
            <Select
              value={values.rhesus}
              onValueChange={(value) => handleChange("rhesus", value)}
            >
              <SelectTrigger id="rhesus">
                <SelectValue placeholder="Select Rhesus factor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="POSITIVE">POSITIVE</SelectItem>
                <SelectItem value="NEGATIVE">NEGATIVE</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {values.bloodGroup && values.rhesus && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Preview:</p>
              <div className="space-y-2">
                <div className="flex justify-center gap-2">
                  <span className="font-medium">Blood group</span>
                  <span>-</span>
                  <span className="font-bold text-lg">{values.bloodGroup}</span>
                </div>
                <div className="flex justify-center gap-2">
                  <span className="font-medium">Rhesus factor</span>
                  <span>-</span>
                  <span className="font-bold text-lg underline">{values.rhesus}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}