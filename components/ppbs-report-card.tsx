"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TestTube } from "lucide-react";

interface PPBSReportCardProps {
  onValuesChange: (values: any) => void;
}

export function PPBSReportCard({ onValuesChange }: PPBSReportCardProps) {
  const [values, setValues] = useState({
    mealType: "Post Breakfast",
    hourType: "After 1 Hour",
    value: "",
  });

  const handleChange = (field: string, value: string) => {
    const newValues = { ...values, [field]: value };
    setValues(newValues);
    onValuesChange(newValues);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          PPBS - Post Prandial Blood Sugar
        </CardTitle>
        <CardDescription>
          Select meal timing and enter blood sugar value
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="ppbs-meal">Meal Type</Label>
            <Select
              value={values.mealType}
              onValueChange={(value) => handleChange("mealType", value)}
            >
              <SelectTrigger id="ppbs-meal">
                <SelectValue placeholder="Select meal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Post Breakfast">Post Breakfast</SelectItem>
                <SelectItem value="Post Lunch">Post Lunch</SelectItem>
                <SelectItem value="Post Dinner">Post Dinner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ppbs-hour">Time After Meal</Label>
            <Select
              value={values.hourType}
              onValueChange={(value) => handleChange("hourType", value)}
            >
              <SelectTrigger id="ppbs-hour">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="After 1 Hour">After 1 Hour</SelectItem>
                <SelectItem value="After 2 Hours">After 2 Hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ppbs-value">Blood Sugar (mg/dL)</Label>
            <Input
              id="ppbs-value"
              type="number"
              value={values.value}
              onChange={(e) => handleChange("value", e.target.value)}
              placeholder="Enter value"
            />
          </div>
        </div>

        <div className="p-3 bg-muted/50 rounded-md text-sm">
          <span className="font-medium">Reference Range: </span>
          <span>
            {values.hourType === "After 1 Hour" ? "< 160 mg/dL" : "< 140 mg/dL"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}