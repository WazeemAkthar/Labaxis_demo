"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TestTube, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BSSEntry {
  id: string;
  mealType: string;
  hourType: string;
  value: string;
}

interface BSSReportCardProps {
  onValuesChange: (values: BSSEntry[]) => void;
}

export function BSSReportCard({ onValuesChange }: BSSReportCardProps) {
  const [entries, setEntries] = useState<BSSEntry[]>([
    {
      id: Date.now().toString(),
      mealType: "Post Breakfast",
      hourType: "After 1 Hour",
      value: "",
    },
  ]);

  const handleChange = (id: string, field: string, value: string) => {
    const newEntries = entries.map((entry) =>
      entry.id === id ? { ...entry, [field]: value } : entry
    );
    setEntries(newEntries);
    onValuesChange(newEntries);
  };

  const addEntry = () => {
    const newEntry: BSSEntry = {
      id: Date.now().toString(),
      mealType: "Post Breakfast",
      hourType: "After 1 Hour",
      value: "",
    };
    const newEntries = [...entries, newEntry];
    setEntries(newEntries);
    onValuesChange(newEntries);
  };

  const removeEntry = (id: string) => {
    if (entries.length === 1) return; // Keep at least one entry
    const newEntries = entries.filter((entry) => entry.id !== id);
    setEntries(newEntries);
    onValuesChange(newEntries);
  };

  const getReferenceRange = (hourType: string) => {
    return hourType === "After 1 Hour" ? "< 160 mg/dL" : "< 140 mg/dL";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          BSS - Blood Sugar Series
        </CardTitle>
        <CardDescription>
          Add multiple blood sugar readings at different meal times
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {entries.map((entry, index) => (
          <div key={entry.id} className="p-4 border rounded-lg space-y-4">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline">Reading {index + 1}</Badge>
              {entries.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEntry(entry.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor={`bss-meal-${entry.id}`}>Meal Type</Label>
                <Select
                  value={entry.mealType}
                  onValueChange={(value) => handleChange(entry.id, "mealType", value)}
                >
                  <SelectTrigger id={`bss-meal-${entry.id}`}>
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
                <Label htmlFor={`bss-hour-${entry.id}`}>Time After Meal</Label>
                <Select
                  value={entry.hourType}
                  onValueChange={(value) => handleChange(entry.id, "hourType", value)}
                >
                  <SelectTrigger id={`bss-hour-${entry.id}`}>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="After 1 Hour">After 1 Hour</SelectItem>
                    <SelectItem value="After 2 Hours">After 2 Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`bss-value-${entry.id}`}>Blood Sugar (mg/dL)</Label>
                <Input
                  id={`bss-value-${entry.id}`}
                  type="number"
                  value={entry.value}
                  onChange={(e) => handleChange(entry.id, "value", e.target.value)}
                  placeholder="Enter value"
                />
              </div>
            </div>

            <div className="p-3 bg-muted/50 rounded-md text-sm">
              <span className="font-medium">Reference Range: </span>
              <span>{getReferenceRange(entry.hourType)}</span>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addEntry}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Reading
        </Button>
      </CardContent>
    </Card>
  );
}