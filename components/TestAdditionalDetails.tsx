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
            <div className="space-y-4">
              {/* Info Text */}
              <div>
                <p className="text-sm mb-4 font-medium">
                  Recommended and high-risk plasma lipid concentrations with
                  desirable, borderline, and high levels.
                </p>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Chemistry
                      </th>
                      <th className="border border-gray-300 p-2 text-center font-semibold">
                        Desirable Levels
                      </th>
                      <th className="border border-gray-300 p-2 text-center font-semibold">
                        Borderline Levels
                      </th>
                      <th className="border border-gray-300 p-2 text-center font-semibold">
                        High Levels
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">
                        Total Cholesterol
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &lt; 200 mg/dl
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        200 – 235 mg/dl
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &gt; 235 mg/dl
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">
                        HDL Cholesterol
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        ≥ 45 mg/dl
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        35 – 45 mg/dl
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &lt; 35 mg/dl
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">
                        Triglycerides
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &lt; 150 mg/dl
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        150 – 200 mg/dl
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &gt; 200 mg/dl
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">
                        LDL Cholesterol
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &lt; 150 mg/dl
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        150 – 190 mg/dl
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &gt; 190 mg/dl
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">
                        Total Cholesterol / HDL
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &lt; 3.5
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        3.5 – 6.0
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &gt; 6.0
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Note Section */}
              <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-400">
                <p className="text-xs font-medium">
                  Fully automated Biochemistry Analyzer –{" "}
                  <strong>SELECTRA ProM</strong>
                </p>
              </div>
            </div>
          ),
        };

      case "hba1c":
      case "glycated hemoglobin":
      case "glycosylated haemoglobin":
        return {
          title: "HbA1c Interpretation Guidelines",
          content: (
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-3 leading-relaxed">
                  HbA1c reflects average blood glucose levels over the past 2-3
                  months. It is a key indicator for diabetes management and
                  cardiovascular risk assessment.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        HbA1c Level (%)
                      </th>
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Interpretation
                      </th>
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Recommendation
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">&lt;5.7%</td>
                      <td className="border border-gray-300 p-2">Normal</td>
                      <td className="border border-gray-300 p-2">
                        Continue healthy lifestyle
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">5.7-6.4%</td>
                      <td className="border border-gray-300 p-2">
                        Prediabetes
                      </td>
                      <td className="border border-gray-300 p-2">
                        Lifestyle modification, regular monitoring
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">≥6.5%</td>
                      <td className="border border-gray-300 p-2">Diabetes</td>
                      <td className="border border-gray-300 p-2">
                        Medical management required
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">&lt;7.0%</td>
                      <td className="border border-gray-300 p-2">
                        Good control (Adults)
                      </td>
                      <td className="border border-gray-300 p-2">
                        Target for most adults with diabetes
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
          title: "Thyroid Function Interpretation",
          content: (
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-3 leading-relaxed">
                  Thyroid function tests help evaluate thyroid gland activity
                  and diagnose thyroid disorders. TSH is the primary screening
                  test, with T3 and T4 providing additional information about
                  thyroid hormone levels.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Condition
                      </th>
                      <th className="border border-gray-300 p-2 text-center font-semibold">
                        TSH
                      </th>
                      <th className="border border-gray-300 p-2 text-center font-semibold">
                        T4
                      </th>
                      <th className="border border-gray-300 p-2 text-center font-semibold">
                        T3
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">
                        Normal
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        Normal
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        Normal
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        Normal
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">
                        Primary Hypothyroidism
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        High
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        Low
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        Low
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">
                        Subclinical Hypothyroidism
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        High
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        Normal
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        Normal
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">
                        Primary Hyperthyroidism
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        Low
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        High
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        High
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">
                        Subclinical Hyperthyroidism
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        Low
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        Normal
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        Normal
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
                      <td className="border border-gray-300 p-2">60 - 110</td>
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
              <div>
                <p className="text-sm mb-3 leading-relaxed">
                  CRP is an acute-phase protein that rises rapidly during
                  inflammation, infection, or tissue injury. Values ≤ 6 mg/l are
                  considered negative, indicating minimal inflammation.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        CRP Level (mg/l)
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
                      <td className="border border-gray-300 p-2">≤ 6</td>
                      <td className="border border-gray-300 p-2 font-medium text-green-600">
                        NEGATIVE
                      </td>
                      <td className="border border-gray-300 p-2">
                        Normal - No significant inflammation
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">6-10</td>
                      <td className="border border-gray-300 p-2 font-medium text-yellow-600">
                        MILD ELEVATION
                      </td>
                      <td className="border border-gray-300 p-2">
                        Minor inflammation or infection
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">10-50</td>
                      <td className="border border-gray-300 p-2 font-medium text-orange-600">
                        MODERATE ELEVATION
                      </td>
                      <td className="border border-gray-300 p-2">
                        Active inflammation/infection
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">&gt; 50</td>
                      <td className="border border-gray-300 p-2 font-medium text-red-600">
                        SEVERE ELEVATION
                      </td>
                      <td className="border border-gray-300 p-2">
                        Severe infection/inflammation
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400">
                <p className="text-xs">
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
                      <td className="border border-gray-300 p-2">20 - 400</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        Adult Female (&lt;50 Years)
                      </td>
                      <td className="border border-gray-300 p-2">8 - 140</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        Adult Female (≥50 Years)
                      </td>
                      <td className="border border-gray-300 p-2">20 - 400</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">Newborn</td>
                      <td className="border border-gray-300 p-2">25 - 200</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">1 Month</td>
                      <td className="border border-gray-300 p-2">200 - 600</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        2 - 5 Months
                      </td>
                      <td className="border border-gray-300 p-2">50 - 200</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        6 - 15 Months
                      </td>
                      <td className="border border-gray-300 p-2">7 - 140</td>
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
                      <td className="border border-gray-300 p-2">
                        2.8 - 5.2
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        6 days - 3 months
                      </td>
                      <td className="border border-gray-300 p-2">
                        2.9 - 5.1
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        4 - 6 months
                      </td>
                      <td className="border border-gray-300 p-2">
                        2.9 - 4.7
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        7 - 11 months
                      </td>
                      <td className="border border-gray-300 p-2">
                        2.9 - 4.7
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        1 - 6 years
                      </td>
                      <td className="border border-gray-300 p-2">
                        2.9 - 4.4
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        7 - 11 years
                      </td>
                      <td className="border border-gray-300 p-2">
                        3.0 - 4.2
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        12 - 20 years
                      </td>
                      <td className="border border-gray-300 p-2">
                        3.1 - 4.3
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        Adults (21+ years)
                      </td>
                      <td className="border border-gray-300 p-2">
                        2.9 - 4.3
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
      <style jsx>{`
        @media print {
          /* Additional details section styling for print */
          .mt-6.border-2.border-gray-200 {
            margin-top: 8px !important;
            border: 1px solid #666 !important;
            background-color: #f8f9fa !important;
            padding: 8px !important;
            border-radius: 4px !important;
            page-break-inside: avoid !important;
          }

          /* Title styling */
          h4.font-bold.text-lg {
            font-size: 14px !important;
            margin-bottom: 6px !important;
            color: #333 !important;
            border-bottom: 1px solid #666 !important;
            padding-bottom: 3px !important;
          }

          /* Text content */
          .text-sm {
            font-size: 10px !important;
            line-height: 1.4 !important;
          }

          /* Table styling */
          table {
            font-size: 9px !important;
            border-collapse: collapse !important;
          }

          th,
          td {
            padding: 2px 4px !important;
            border: 1px solid #666 !important;
          }

          th {
            background-color: #e9ecef !important;
            font-weight: bold !important;
          }

          /* Ensure proper spacing */
          .space-y-4 > * + * {
            margin-top: 6px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TestAdditionalDetails;
