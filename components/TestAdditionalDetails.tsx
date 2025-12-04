import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TestAdditionalDetailsProps {
  testCode: string;
  className?: string;
}

const TestAdditionalDetails: React.FC<TestAdditionalDetailsProps> = ({
  testCode,
  className = "",
}) => {
  const getAdditionalDetails = (code: string) => {
    switch (code.toLowerCase()) {
      case "lipid":
      case "lipidprofile":
      case "lipid profile":
        return {
          title: "Recommended and High-Risk Plasma Lipid Concentrations",
          content: (
       <div className="space-y-4 font-mono tracking-wide text-sm">
  {/* Header Title */}
  <p className="font-semibold underline underline-offset-4">
    RECOMMENDED AND HIGH RISK PLASMA LIPID CONCENTRATIONS
  </p>

  {/* Spacing */}
  <div className="h-2"></div>

  {/* Table */}
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr>
          <th className="p-2 text-left font-semibold underline">CHEMISTRY</th>
          <th className="p-2 text-center font-semibold underline">DESIRABLE LEVELS</th>
          <th className="p-2 text-center font-semibold underline">BORDERLINE LEVELS</th>
          <th className="p-2 text-center font-semibold underline">HIGH LEVELS</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td className="p-2">Total Cholesterol</td>
          <td className="p-2 text-center">&lt; 200 mg/dl</td>
          <td className="p-2 text-center">200 – 235 mg/dl</td>
          <td className="p-2 text-center">&gt; 235 mg/dl</td>
        </tr>

        <tr>
          <td className="p-2">HDL Cholesterol</td>
          <td className="p-2 text-center">≥ 45 mg/dl</td>
          <td className="p-2 text-center">35 – 45 mg/dl</td>
          <td className="p-2 text-center">&lt; 35 mg/dl</td>
        </tr>

        <tr>
          <td className="p-2">Triglycerides</td>
          <td className="p-2 text-center">&lt; 150 mg/dl</td>
          <td className="p-2 text-center">150 – 200 mg/dl</td>
          <td className="p-2 text-center">&gt; 200 mg/dl</td>
        </tr>

        <tr>
          <td className="p-2">LDL Cholesterol</td>
          <td className="p-2 text-center">&lt; 150 mg/dl</td>
          <td className="p-2 text-center">150 – 190 mg/dl</td>
          <td className="p-2 text-center">&gt; 190 mg/dl</td>
        </tr>

        <tr>
          <td className="p-2">Total Cholesterol / HDL</td>
          <td className="p-2 text-center">&lt; 3.5</td>
          <td className="p-2 text-center">3.5 – 6.0</td>
          <td className="p-2 text-center">&gt; 6.0</td>
        </tr>
      </tbody>
    </table>
  </div>

  {/* Footer Note */}
  <div className="mt-4">
    <p className="text-xs">
      ❖ Fully automated Bio chemistry analyzer – <strong>SELECTRA ProM</strong>
    </p>
  </div>
</div>

          ),
        };

      case "hba1c":
      case "glycated hemoglobin":
      case "glycosylated haemoglobin":
        return {
          title: "HbA1c Reference Values (According to NGSP/DCCT Guidelines)",
          content: (
            <div className="space-y-4">
              <p className="text-sm mb-3 leading-relaxed">
                HbA1c reflects the average blood glucose levels over the past
                2–3 months. It is an essential marker for diabetes diagnosis and
                monitoring glycemic control.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Category
                      </th>
                      <th className="border border-gray-300 p-2 text-center font-semibold">
                        HbA1c (%)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">
                        Non-Diabetics
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        4.6 – 6.2
                      </td>
                    </tr>

                    <tr className="bg-gray-100">
                      <td
                        className="border border-gray-300 p-2 font-semibold"
                        colSpan={2}
                      >
                        Diabetics
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-300 p-2">
                        Good Control
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &lt; 7.0
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        Moderate Control
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        7.0 – 8.0
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        Poor Control
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        8.0 – 10.0
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        Very Poor Control
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &gt; 10.0
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ),
        };

      case "thyroid":
      case "tsh":
      case "thyroid profile":
        return {
          title: "TSH Normal Reference Ranges",
          content: (
            <div className="space-y-4">
              <p className="text-sm mb-3 leading-relaxed">
                The following table shows the expected TSH (Thyroid-Stimulating
                Hormone) reference ranges by age group and pregnancy status.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        AGE
                      </th>
                      <th className="border border-gray-300 p-2 text-center font-semibold">
                        NORMAL RANGE (µIU/ml)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        &lt; 3 Days
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        0.68 – 29.0 µIU/ml
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        4 – 30 Days
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        0.51 – 11.0 µIU/ml
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        1 – 12 Months
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        0.55 – 6.7 µIU/ml
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        1 – 6 Years
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        0.45 – 6.0 µIU/ml
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        6 – 12 Years
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        0.61 – 5.2 µIU/ml
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        12 – 16 Years
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        0.36 – 4.7 µIU/ml
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">Adults</td>
                      <td className="border border-gray-300 p-2 text-center">
                        0.27 – 4.2 µIU/ml
                      </td>
                    </tr>

                    {/* Pregnancy Section */}
                    <tr className="bg-gray-100">
                      <td
                        className="border border-gray-300 p-2 font-semibold"
                        colSpan={2}
                      >
                        Pregnancy
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        1st Trimester
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        0.33 – 4.59 µIU/ml
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        2nd Trimester
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        0.35 – 4.10 µIU/ml
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        3rd Trimester
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        0.21 – 3.15 µIU/ml
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ),
        };

      case "liver":
      case "lft":
      case "liver function test":
        return {
          title: "Liver Function Test Guidelines",
          content: (
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-3 leading-relaxed">
                  Liver function tests assess the liver's ability to perform its
                  normal biochemical functions. These tests help diagnose liver
                  disease, monitor treatment progress, and assess liver damage.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Parameter
                      </th>
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Clinical Significance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">
                        ALT (SGPT)
                      </td>
                      <td className="border border-gray-300 p-2">
                        Most specific for liver cell damage. Elevated in
                        hepatitis, fatty liver
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">
                        AST (SGOT)
                      </td>
                      <td className="border border-gray-300 p-2">
                        Found in liver, heart, muscle. Elevated in liver damage,
                        heart attack
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">
                        ALP
                      </td>
                      <td className="border border-gray-300 p-2">
                        Elevated in bile duct obstruction, liver disease, bone
                        disease
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">
                        Bilirubin (Total)
                      </td>
                      <td className="border border-gray-300 p-2">
                        Elevated in liver dysfunction, bile duct obstruction,
                        hemolysis
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ),
        };

      case "esr":
      case "erythrocyte sedimentation rate":
      case "sed rate":
        return {
          title: "ESR Clinical Information",
          content: (
            <div className="space-y-4">
              {/* Normal ESR Values */}
              <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <h6 className="font-semibold">Male</h6>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Age &lt; 50 : 0 – 15 mm (1st hour)</li>
                      <li>Age &gt; 50 : 0 – 20 mm (1st hour)</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-semibold">Female</h6>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Age &lt; 50 : 0 – 25 mm (1st hour)</li>
                      <li>Age &gt; 50 : 0 – 30 mm (1st hour)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ),
        };

      case "fbs":
      case "fasting blood sugar":
      case "glucose":
      case "fasting glucose":
        return {
          title: "Fasting Blood Glucose Guidelines",
          content: (
            <div className="space-y-4 mt-5">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">60 - 115</td>
                      <td className="border border-gray-300 p-2 font-medium">
                        Normal
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">110 - 125</td>
                      <td className="border border-gray-300 p-2 font-medium">
                        Impaired
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">=&gt;125</td>
                      <td className="border border-gray-300 p-2 font-medium">
                        High
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ),
        };

      case "vitamin_d":
      case "vitamin d":
      case "25-oh vitamin d":
        return {
          title: "Vitamin D Status Guidelines",
          content: (
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-3 leading-relaxed">
                  Vitamin D is essential for bone health, immune function, and
                  calcium absorption. Deficiency is common worldwide and
                  associated with bone disorders, muscle weakness, and increased
                  infection risk.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Level (ng/mL)
                      </th>
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Status
                      </th>
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Clinical Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">&lt;10</td>
                      <td className="border border-gray-300 p-2 font-medium text-red-600">
                        Severe Deficiency
                      </td>
                      <td className="border border-gray-300 p-2">
                        High-dose supplementation required
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">10-20</td>
                      <td className="border border-gray-300 p-2 font-medium text-orange-600">
                        Deficiency
                      </td>
                      <td className="border border-gray-300 p-2">
                        Supplementation recommended
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">20-30</td>
                      <td className="border border-gray-300 p-2 font-medium text-yellow-600">
                        Insufficiency
                      </td>
                      <td className="border border-gray-300 p-2">
                        Consider supplementation
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">30-100</td>
                      <td className="border border-gray-300 p-2 font-medium text-green-600">
                        Sufficient
                      </td>
                      <td className="border border-gray-300 p-2">
                        Maintain current intake
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">&gt;100</td>
                      <td className="border border-gray-300 p-2 font-medium text-red-600">
                        Toxicity Risk
                      </td>
                      <td className="border border-gray-300 p-2">
                        Reduce supplementation
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ),
        };

      case "b12":
      case "vitamin b12":
      case "cobalamin":
        return {
          title: "Vitamin B12 Clinical Guidelines",
          content: (
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-3 leading-relaxed">
                  Vitamin B12 is essential for DNA synthesis, neurological
                  function, and red blood cell formation. Deficiency can cause
                  anemia, neuropathy, and cognitive impairment.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Level (pg/mL)
                      </th>
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">&lt;200</td>
                      <td className="border border-gray-300 p-2 font-medium text-red-600">
                        Deficiency
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">200-300</td>
                      <td className="border border-gray-300 p-2 font-medium text-yellow-600">
                        Borderline Low
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">300-900</td>
                      <td className="border border-gray-300 p-2 font-medium text-green-600">
                        Normal
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">&gt;900</td>
                      <td className="border border-gray-300 p-2 font-medium">
                        High
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
                <p className="text-xs">
                  <strong>Common causes of deficiency:</strong> Pernicious
                  anemia, dietary insufficiency (vegetarians), malabsorption,
                  gastric surgery, certain medications.
                </p>
              </div>
            </div>
          ),
        };

      case "crp":
      case "c-reactive protein":
      case "c reactive protein":
        return {
          title: "C-Reactive Protein Interpretation",
          content: (
            <div className="space-y-4">
              <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400">
                <p>
                  <strong>METHOD: </strong> QUANTITITIVE TURBIDIMETRY
                </p>
                <p>
                  <strong>Fully automated Bio chemistry analyzer </strong> -
                  “SELECTRA ProM“
                </p>
              </div>
            </div>
          ),
        };

      case "rf":
      case "rheumatoid factor":
        return {
          title: "Rheumatoid Factor Clinical Guidelines",
          content: (
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-3 leading-relaxed">
                  Rheumatoid Factor (RF) is an autoantibody commonly associated
                  with rheumatoid arthritis and other autoimmune conditions. It
                  helps in diagnosis and monitoring of rheumatic diseases.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        RF Level (IU/ml)
                      </th>
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Result
                      </th>
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Clinical Significance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">&lt; 8</td>
                      <td className="border border-gray-300 p-2 font-medium text-green-600">
                        NEGATIVE
                      </td>
                      <td className="border border-gray-300 p-2">
                        Normal - Low probability of RA
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">8-20</td>
                      <td className="border border-gray-300 p-2 font-medium text-yellow-600">
                        WEAK POSITIVE
                      </td>
                      <td className="border border-gray-300 p-2">
                        May indicate early RA or other conditions
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">20-60</td>
                      <td className="border border-gray-300 p-2 font-medium text-orange-600">
                        POSITIVE
                      </td>
                      <td className="border border-gray-300 p-2">
                        Significant for RA diagnosis
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">&gt; 60</td>
                      <td className="border border-gray-300 p-2 font-medium text-red-600">
                        STRONGLY POSITIVE
                      </td>
                      <td className="border border-gray-300 p-2">
                        High probability of RA, severe disease
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ),
        };

      case "asot":
      case "anti streptolysin o":
      case "anti streptolysin o titre":
      case "aso":
        return {
          title: "Anti Streptolysin O Titre (ASOT) Guidelines",
          content: (
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-3 leading-relaxed">
                  ASOT measures antibodies against streptolysin O, a toxin
                  produced by Group A Streptococcus bacteria. It helps diagnose
                  recent or past streptococcal infections and post-streptococcal
                  complications.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        ASOT Level (IU/l)
                      </th>
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Result
                      </th>
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Clinical Significance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">&lt; 200</td>
                      <td className="border border-gray-300 p-2 font-medium text-green-600">
                        NEGATIVE
                      </td>
                      <td className="border border-gray-300 p-2">
                        No recent streptococcal infection
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">200-400</td>
                      <td className="border border-gray-300 p-2 font-medium text-yellow-600">
                        BORDERLINE
                      </td>
                      <td className="border border-gray-300 p-2">
                        May indicate recent infection
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">400-800</td>
                      <td className="border border-gray-300 p-2 font-medium text-orange-600">
                        POSITIVE
                      </td>
                      <td className="border border-gray-300 p-2">
                        Recent streptococcal infection likely
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">&gt; 800</td>
                      <td className="border border-gray-300 p-2 font-medium text-red-600">
                        STRONGLY POSITIVE
                      </td>
                      <td className="border border-gray-300 p-2">
                        Recent infection or complications
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ),
        };

      case "se":
      case "serum electrolytes":
        return {
          title: "Serum Electrolytes Clinical Guidelines",
          content: (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Parameter
                      </th>
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Normal Range
                      </th>
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Clinical Significance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        Serum Sodium
                      </td>
                      <td className="border border-gray-300 p-2">
                        135.0-155.0 mEq/l
                      </td>
                      <td className="border border-gray-300 p-2">
                        Outside range may indicate dehydration or hyponatremia
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        Serum Potassium
                      </td>
                      <td className="border border-gray-300 p-2">
                        3.5-5.5 mEq/l
                      </td>
                      <td className="border border-gray-300 p-2">
                        Abnormal levels may suggest hypokalemia or hyperkalemia
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        Serum Chloride
                      </td>
                      <td className="border border-gray-300 p-2">
                        95.0-110.0 mEq/l
                      </td>
                      <td className="border border-gray-300 p-2">
                        Deviations may indicate acid-base imbalances
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ),
        };

      case "ua":
      case "blood for uric acid":
        return {
          title: "Blood for Uric Acid Clinical Guidelines",
          content: (
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-3 leading-relaxed">
                  Blood Uric Acid measures uric acid levels to detect gout or
                  kidney dysfunction.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Uric Acid Level (mg/dL)
                      </th>
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Result
                      </th>
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Clinical Significance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        3.5-7.2 (Male)
                      </td>
                      <td className="border border-gray-300 p-2 font-medium text-green-600">
                        NORMAL
                      </td>
                      <td className="border border-gray-300 p-2">
                        No evidence of hyperuricemia
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        2.6-6.0 (Female)
                      </td>
                      <td className="border border-gray-300 p-2 font-medium text-green-600">
                        NORMAL
                      </td>
                      <td className="border border-gray-300 p-2">
                        No evidence of hyperuricemia
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        &gt; 7.2 (Male)
                      </td>
                      <td className="border border-gray-300 p-2 font-medium text-red-600">
                        HIGH
                      </td>
                      <td className="border border-gray-300 p-2">
                        Risk of gout or kidney stones
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        &gt; 6.0 (Female)
                      </td>
                      <td className="border border-gray-300 p-2 font-medium text-red-600">
                        HIGH
                      </td>
                      <td className="border border-gray-300 p-2">
                        Risk of gout or kidney stones
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400">
                <p className="text-xs">
                  <strong>Note:</strong> Elevated levels may also occur due to
                  diet, medications, or chemotherapy.
                </p>
              </div>
            </div>
          ),
        };

      case "sfa":
      case "seminal fluid analysis":
        return {
          title: "Seminal Fluid Analysis Clinical Guidelines",
          content: (
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-3 leading-relaxed">
                  Seminal Fluid Analysis assesses sperm health and male
                  fertility.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Parameter
                      </th>
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Normal Range
                      </th>
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Clinical Significance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">Volume</td>
                      <td className="border border-gray-300 p-2">1.5-5.0 mL</td>
                      <td className="border border-gray-300 p-2">
                        Low volume may indicate obstruction
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        Concentration
                      </td>
                      <td className="border border-gray-300 p-2">
                        15-200 million/mL
                      </td>
                      <td className="border border-gray-300 p-2">
                        Below range suggests oligospermia
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        Total Motility
                      </td>
                      <td className="border border-gray-300 p-2">≥40%</td>
                      <td className="border border-gray-300 p-2">
                        Reduced motility may affect fertility
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">Morphology</td>
                      <td className="border border-gray-300 p-2">
                        ≥4% normal forms
                      </td>
                      <td className="border border-gray-300 p-2">
                        Abnormal forms may indicate infertility
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400">
                <p className="text-xs">
                  <strong>Note:</strong> Results should be interpreted with a
                  repeat test if abnormal, considering lifestyle factors.
                </p>
              </div>
            </div>
          ),
        };

      case "fer":
      case "serum ferritin":
        return {
          title: "Serum Ferritin Expected Values",
          content: (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Demographic
                      </th>
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Ferritin Level (ng/mL)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">Adult Male</td>
                      <td className="border border-gray-300 p-2">20 - 400 ng/mL</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        Adult Female (&lt;50 Years)
                      </td>
                      <td className="border border-gray-300 p-2">8 - 140 ng/mL</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        Adult Female (≥50 Years)
                      </td>
                      <td className="border border-gray-300 p-2">20 - 400 ng/mL</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">Newborn</td>
                      <td className="border border-gray-300 p-2">25 - 200 ng/mL</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">1 Month</td>
                      <td className="border border-gray-300 p-2">200 - 600 ng/mL</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        2 - 5 Months
                      </td>
                      <td className="border border-gray-300 p-2">50 - 200 ng/mL</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        6 - 15 Months
                      </td>
                      <td className="border border-gray-300 p-2">7 - 140 ng/mL</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ),
        };

      case "ft4":
      case "free thyroxine":
      case "free t4":
        return {
          title: "Free Thyroxine (FT4) Expected Values",
          content: (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Demographic
                      </th>
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Expected Values (ng/dL)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">Newborn</td>
                      <td className="border border-gray-300 p-2">
                        0.89 - 2.45
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        6 days - 3 months
                      </td>
                      <td className="border border-gray-300 p-2">
                        0.89 - 2.40
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        4 - 6 months
                      </td>
                      <td className="border border-gray-300 p-2">
                        0.93 - 1.97
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        7 - 11 months
                      </td>
                      <td className="border border-gray-300 p-2">
                        0.92 - 1.97
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        1 - 6 years
                      </td>
                      <td className="border border-gray-300 p-2">
                        0.93 - 1.79
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        7 - 11 years
                      </td>
                      <td className="border border-gray-300 p-2">
                        0.97 - 1.65
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        12 - 20 years
                      </td>
                      <td className="border border-gray-300 p-2">
                        0.98 - 1.68
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        Adults (21+ years)
                      </td>
                      <td className="border border-gray-300 p-2">
                        0.92 - 1.68
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400">
                <p className="text-xs">
                  <strong>Method:</strong> Electrochemiluminescence Immunoassay
                  (ECLIA)
                </p>
              </div>
            </div>
          ),
        };

      //  case "hcg":
      // case "human chorionic gonadotropin":
      //   return {
      //     title: "Human Chorionic Gonadotropin (HCG) Expected Values",
      //     content: (
      //       <div className="space-y-4">
      //         <div className="overflow-x-auto">
      //           <table className="w-full border-collapse border border-gray-300 text-sm">
      //             <thead>
      //               <tr className="bg-gray-50">
      //                 <th className="border border-gray-300 p-2 text-left font-semibold">
      //                   Demographic
      //                 </th>
      //                 <th className="border border-gray-300 p-2 text-left font-semibold">
      //                   Expected Values (mIU/mL)
      //                 </th>
      //               </tr>
      //             </thead>
      //             <tbody>
      //               <tr>
      //                 <td className="border border-gray-300 p-2">Non-Pregnant Female</td>
      //                 <td className="border border-gray-300 p-2">&lt; 5.0</td>
      //               </tr>
      //               <tr>
      //                 <td className="border border-gray-300 p-2">Postmenopausal Female</td>
      //                 <td className="border border-gray-300 p-2">&lt; 9.0</td>
      //               </tr>
      //               <tr>
      //                 <td className="border border-gray-300 p-2">Male</td>
      //                 <td className="border border-gray-300 p-2">&lt; 2.0</td>
      //               </tr>
      //               <tr>
      //                 <td className="border border-gray-300 p-2">Pregnancy (3-4 weeks)</td>
      //                 <td className="border border-gray-300 p-2">5 - 426</td>
      //               </tr>
      //               <tr>
      //                 <td className="border border-gray-300 p-2">Pregnancy (5-6 weeks)</td>
      //                 <td className="border border-gray-300 p-2">18 - 7,340</td>
      //               </tr>
      //               <tr>
      //                 <td className="border border-gray-300 p-2">Pregnancy (7-12 weeks)</td>
      //                 <td className="border border-gray-300 p-2">1,200 - 90,000</td>
      //               </tr>
      //             </tbody>
      //           </table>
      //         </div>
      //         <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400">
      //           <p className="text-xs">
      //             <strong>Method:</strong> Immunoassay
      //           </p>
      //         </div>
      //       </div>
      //     ),
      //   };
      case "ft3":
      case "free triiodothyronine":
      case "free t3":
        return {
          title: "Free Triiodothyronine (FT3) Expected Values",
          content: (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Demographic
                      </th>
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Expected Values (pg/mL)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">Newborn</td>
                      <td className="border border-gray-300 p-2">1.73 – 6.30 pg/ml</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        6 days - 3 months
                      </td>
                      <td className="border border-gray-300 p-2">1.95 – 6.04 pg/ml</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        4 days - 12 months
                      </td>
                      <td className="border border-gray-300 p-2">2.15 – 5.83 pg/ml</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        1 - 6 years
                      </td>
                      <td className="border border-gray-300 p-2">2.41 – 5.50 pg/ml</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        7 - 11 years
                      </td>
                      <td className="border border-gray-300 p-2">2.53 - 5.22 pg/ml</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        12 - 20 years
                      </td>
                      <td className="border border-gray-300 p-2">2.56 – 5.01 pg/ml</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        Adults (21+ years)
                      </td>
                      <td className="border border-gray-300 p-2">2.00 – 4.40 pg/ml</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400">
                <p className="text-xs">
                  <strong>Method:</strong> Electrochemiluminescence Immunoassay
                  (ECLIA)
                </p>
              </div>
            </div>
          ),
        };
case "bun":
case "blood urea nitrogen":
  return {
    title: "Blood Urea Nitrogen (BUN) Reference Range",
    content: (
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-2 text-left font-semibold">
                  Demographic
                </th>
                <th className="border border-gray-300 p-2 text-left font-semibold">
                  Reference Range (mg/dL)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">
                  Adults (18 – 60 Years)
                </td>
                <td className="border border-gray-300 p-2">6 – 20</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  Adults (60 – 90 Years)
                </td>
                <td className="border border-gray-300 p-2">8 – 23</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Infants (&lt;1 Year)</td>
                <td className="border border-gray-300 p-2">4 – 19</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Infants / Children</td>
                <td className="border border-gray-300 p-2">5 – 18</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400">
          <p className="text-xs">
            <strong>Method:</strong> Enzymatic Urease Method
          </p>
        </div>
      </div>
    ),
  };

  case "crp":
      case "c reactive protein":
        return {
          title: "C-Reactive Protein (CRP) Clinical Guidelines",
          content: (
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-3 leading-relaxed">
                  C-Reactive Protein (CRP) is a marker of inflammation in the
                  body. Elevated levels may indicate infection, chronic
                  inflammatory diseases, or acute conditions.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        CRP Level (mg/L)
                      </th>
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Clinical Significance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">&lt; 3</td>
                      <td className="border border-gray-300 p-2">
                        Normal - No significant inflammation
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">3 - 10</td>
                      <td className="border border-gray-300 p-2">
                        Mild inflammation - Possible minor infection or chronic
                        condition
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">10 - 100</td>
                      <td className="border border-gray-300 p-2">
                        Moderate inflammation - Suggests active infection or
                        inflammatory disease
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">&gt; 100</td>
                      <td className="border border-gray-300 p-2">
                        Severe inflammation - Indicates serious infection or
                        trauma
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ),
        };

case "pt":
case "prothrombin time":
  return {
    title: "Prothrombin Time (PT) Clinical Guidelines",
    content: (
      <div className="space-y-4">
        <div>
          <p className="text-sm mb-3 leading-relaxed">
            This test measures the activity of extrinsic coagulation pathway (Factor II, V, VII, X)
          </p>
          <p className="text-sm leading-relaxed">
            <strong>ISI Value: 1.15</strong>
          </p>
        </div>
      </div>
    ),
  };

  case "uacr":
case "urine albumin with creatinine ratio":
  return {
    title: "Urine Albumin with Creatinine Ratio (UACR) Clinical Guidelines",
    content: (
      <div className="space-y-4">
        <div>
          <p className="text-sm mb-3 leading-relaxed">
            The UACR is used to detect early kidney damage, especially in diabetic or hypertensive patients.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-2 text-left font-semibold">
                  Category
                </th>
                <th className="border border-gray-300 p-2 text-left font-semibold">
                  Reference Range (mg of Alb/g of Cre)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">Normal</td>
                <td className="border border-gray-300 p-2">&lt; 30 mg of Alb/g of Cre</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Microalbuminuria</td>
                <td className="border border-gray-300 p-2">30 – 300 mg of Alb/g of Cre</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Albuminuria</td>
                <td className="border border-gray-300 p-2">&gt; 300 mg of Alb/g of Cre</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
  };
      default:
        return null;
    }
  };



  const details = getAdditionalDetails(testCode);

  if (!details) {
    return null;
  }

  return (
    <div
      className={`mt-6 border-2 border-gray-200 rounded-lg p-4 bg-gray-50 ${className}`}
    >
      <h4 className="font-bold text-lg mb-4 text-gray-800 border-b-2 border-gray-300 pb-2">
        {details.title}
      </h4>
      <div className="text-gray-700">{details.content}</div>


{/* Print-specific styles */}
<style jsx global>{`
  @media print {
    /* Additional details section styling for print */
    .mt-6.border-2.border-gray-200.rounded-lg.p-4.bg-gray-50 {
      margin-top: 8px !important;
      border: 1px solid #666 !important;
      background-color: #f8f9fa !important;
      padding: 8px !important;
      border-radius: 4px !important;
      page-break-inside: avoid !important;
    }

    /* Title styling - more specific selector */
    .mt-6.border-2 h4.font-bold.text-lg.mb-4 {
      font-size: 11px !important;
      margin-bottom: 6px !important;
      color: #333 !important;
      border-bottom: 1px solid #666 !important;
      padding-bottom: 3px !important;
      font-weight: bold !important;
    }

    /* All text in TestAdditionalDetails */
    .mt-6.border-2 .text-sm,
    .mt-6.border-2 .text-xs,
    .mt-6.border-2 p,
    .mt-6.border-2 strong,
    .mt-6.border-2 li,
    .mt-6.border-2 div {
      font-size: 9px !important;
      line-height: 1.4 !important;
    }

    /* Table styling in TestAdditionalDetails */
    .mt-6.border-2 table {
      font-size: 9px !important;
      border-collapse: collapse !important;
      width: 100% !important;
    }

    .mt-6.border-2 th,
    .mt-6.border-2 td {
      padding: 2px 4px !important;
      border: 1px solid #666 !important;
      font-size: 9px !important;
      line-height: 1.3 !important;
    }

    .mt-6.border-2 th {
      background-color: #e9ecef !important;
      font-weight: bold !important;
      font-size: 9px !important;
    }

    /* Info boxes in TestAdditionalDetails */
    .mt-6.border-2 .bg-blue-50,
    .mt-6.border-2 .bg-yellow-50 {
      padding: 4px !important;
    }

    .mt-6.border-2 .bg-blue-50 *,
    .mt-6.border-2 .bg-yellow-50 * {
      font-size: 9px !important;
    }

    /* Ensure proper spacing */
    .mt-6.border-2 .space-y-4 > * + * {
      margin-top: 6px !important;
    }
  }
`}</style>
    </div>
  );
};

export default TestAdditionalDetails;
