"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Save,
  User,
  Phone,
  Stethoscope,
  FileText,
  Mail,
} from "lucide-react";
import { DataManager, type Patient } from "@/lib/data-manager";
import { useAuth } from "@/components/auth-provider";
import Link from "next/link";

export default function EditPatientPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    ageYears: "",
    ageMonths: "",
    gender: "",
    phone: "",
    email: "",
    doctorName: "",
    notes: "",
  });

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/");
      return;
    }

    loadPatient();
  }, [user, authLoading, router, patientId]);

  const loadPatient = async () => {
    try {
      const dataManager = DataManager.getInstance();
      const patientData = await dataManager.getPatientById(patientId);
      
      if (!patientData) {
        alert("Patient not found");
        router.push("/patients");
        return;
      }

      setPatient(patientData);
      setFormData({
        fullName: `${patientData.firstName} ${patientData.lastName}`.trim(),
        ageYears: patientData.age.toString(),
        ageMonths: (patientData.ageMonths || 0).toString(),
        gender: patientData.gender,
        phone: patientData.phone,
        email: patientData.email,
        doctorName: patientData.doctorName,
        notes: patientData.notes,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error loading patient:", error);
      alert("Error loading patient. Please try again.");
      router.push("/patients");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dataManager = DataManager.getInstance();

      const nameParts = formData.fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      await dataManager.updatePatient(patientId, {
        firstName,
        lastName,
        name: formData.fullName.trim(),
        age: Number.parseInt(formData.ageYears || "0"),
        ageMonths: Number.parseInt(formData.ageMonths || "0"),
        gender: formData.gender as "Male" | "Female" | "Other",
        phone: formData.phone,
        email: formData.email,
        doctorName: formData.doctorName,
        notes: formData.notes,
      });

      alert("Patient updated successfully!");
      router.push(`/patients/${patientId}`);
    } catch (error) {
      console.error("Error updating patient:", error);
      alert("Error updating patient. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const isFormValid = () => {
    return formData.fullName.trim() && formData.gender;
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-200 border-t-teal-600"></div>
      </div>
    );
  }

  if (!patient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-teal-100">
          <Button
            asChild
            variant="outline"
            size="icon"
            className="h-12 w-12 border-teal-200 hover:bg-teal-50 hover:border-teal-400"
          >
            <Link href={`/patients`}>
              <ArrowLeft className="h-5 w-5 text-teal-600" />
            </Link>
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Edit Patient
            </h1>
            <p className="text-slate-600 mt-1">
              Update patient information - {patient.id}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-3xl">
          <Card className="border-teal-100 shadow-md bg-white/90 backdrop-blur-sm  py-0">
            <CardHeader className="border-b border-teal-100 bg-gradient-to-r from-teal-50 to-cyan-50 pt-5 rounded-t-lg px-6">
              <CardTitle className="flex items-center gap-2 text-slate-800 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
                  <User className="h-5 w-5 text-white" />
                </div>
                Patient Information
              </CardTitle>
              <CardDescription className="text-slate-600">
                Update the patient's personal and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Personal Information Section */}
              <div className="space-y-4 p-4 bg-gradient-to-r from-slate-50 to-teal-50 rounded-lg border border-teal-100">
                <div className="flex items-center gap-2 text-sm font-semibold text-teal-700 mb-2">
                  <User className="h-4 w-4" />
                  <span>Personal Details</span>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="fullName"
                    className="text-slate-700 font-medium"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    placeholder="Enter full name"
                    required
                    className="border-teal-200 focus:border-teal-500 focus:ring-teal-500 h-11"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label
                      htmlFor="ageYears"
                      className="text-slate-700 font-medium"
                    >
                      Age (Years)
                    </Label>
                    <Input
                      id="ageYears"
                      type="number"
                      min="0"
                      max="150"
                      value={formData.ageYears}
                      onChange={(e) =>
                        handleInputChange("ageYears", e.target.value)
                      }
                      placeholder="Years"
                      className="border-teal-200 focus:border-teal-500 focus:ring-teal-500 h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="ageMonths"
                      className="text-slate-700 font-medium"
                    >
                      Age (Months)
                    </Label>
                    <Input
                      id="ageMonths"
                      type="number"
                      min="0"
                      max="11"
                      value={formData.ageMonths}
                      onChange={(e) =>
                        handleInputChange("ageMonths", e.target.value)
                      }
                      placeholder="Months"
                      className="border-teal-200 focus:border-teal-500 focus:ring-teal-500 h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="gender"
                      className="text-slate-700 font-medium"
                    >
                      Gender <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) =>
                        handleInputChange("gender", value)
                      }
                    >
                      <SelectTrigger className="border-teal-200 focus:border-teal-500 focus:ring-teal-500 h-11">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-4 p-4 bg-gradient-to-r from-slate-50 to-cyan-50 rounded-lg border border-cyan-100">
                <div className="flex items-center gap-2 text-sm font-semibold text-cyan-700 mb-2">
                  <Phone className="h-4 w-4" />
                  <span>Contact Information</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-700 font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter phone number"
                    className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500 h-11"
                  />
                </div>
              </div>

              {/* Medical Information Section */}
              <div className="space-y-4 p-4 bg-gradient-to-r from-slate-50 to-emerald-50 rounded-lg border border-emerald-100">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 mb-2">
                  <Stethoscope className="h-4 w-4" />
                  <span>Medical Information</span>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="doctorName"
                    className="text-slate-700 font-medium"
                  >
                    Referring Doctor
                  </Label>
                  <Input
                    id="doctorName"
                    value={formData.doctorName}
                    onChange={(e) =>
                      handleInputChange("doctorName", e.target.value)
                    }
                    placeholder="Enter doctor's name (optional)"
                    className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 h-11"
                  />
                </div>
              </div>

              {/* Notes Section */}
              <div className="space-y-4 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-700 mb-2">
                  <FileText className="h-4 w-4" />
                  <span>Additional Notes</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-slate-700 font-medium">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Enter any additional notes or medical history"
                    rows={4}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center gap-4 pt-4 border-t border-teal-100">
                <Button
                  type="submit"
                  disabled={!isFormValid() || saving}
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg shadow-teal-200 disabled:opacity-50 disabled:cursor-not-allowed h-11 px-6"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Updating..." : "Update Patient"}
                </Button>
                <Button
                  asChild
                  type="button"
                  variant="outline"
                  className="border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-400 h-11 px-6"
                >
                  <Link href={`/patients/${patientId}`}>Cancel</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}