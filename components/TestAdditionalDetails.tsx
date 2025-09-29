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
          title: "Treatment Goals and Risk Categories",
          content: (
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-3 leading-relaxed">
                  Abnormalities of lipids are associated with increased risk of
                  coronary artery disease (CAD) in patients with DM. This risk
                  can be reduced by intensive treatment of lipid abnormalities.
                  The usual pattern of lipid abnormalities in type 2 DM is
                  elevated triglycerides, decreased HDL cholesterol and higher
                  proportion of small, dense LDL particles. Cholesterol is a
                  lipid found in all cell membranes and in blood plasma. It is
                  an essential component of the cell membranes, and is necessary
                  for synthesis of steroid hormones, and for the formation of
                  bile acids. Cholesterol is synthesized by the liver and many
                  other organs, and is also ingested in the diet. Triglycerides
                  are lipids in which three long-chain fatty acids are attached
                  to glycerol. They are present in dietary fat and also
                  synthesized by liver and adipose tissue.
                </p>
                <p className="text-sm mb-4 font-medium">
                  Newer treatment goals and statin initiation thresholds based
                  on the risk categories proposed by Lipid Association of India
                  in 2016.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Risk Category
                      </th>
                      <th className="border border-gray-300 p-2 text-center font-semibold">
                        Treatment Goal
                      </th>
                      <th className="border border-gray-300 p-2 text-center font-semibold">
                        Consider Therapy
                      </th>
                    </tr>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-1 text-center text-xs"></th>
                      <th className="border border-gray-300 p-1 text-center text-xs">
                        <div>LDL Cholesterol</div>
                        <div>(LDL-C) (Mg/dl)</div>
                      </th>
                      <th className="border border-gray-300 p-1 text-center text-xs">
                        <div>Non-HDL Cholesterol</div>
                        <div>(Non HDL-C) (Mg/dl)</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">
                        Extreme Risk Group Category A
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &lt;50
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &lt;80
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">
                        Extreme Risk Group Category A
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        <div>Optional Goal:&lt;30</div>
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        <div>Optional Goal:&lt;60</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">
                        Very High
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &lt;50
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &lt;80
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">
                        High
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &lt;70
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &lt;100
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ),
        };

      case "hba1c":
      case "glycated hemoglobin":
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
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">
                        Albumin
                      </td>
                      <td className="border border-gray-300 p-2">
                        Decreased in chronic liver disease, malnutrition
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ),
        };

      case "kidney":
      case "rft":
      case "renal function test":
        return {
          title: "Kidney Function Assessment Guidelines",
          content: (
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-3 leading-relaxed">
                  Kidney function tests evaluate how well the kidneys filter
                  waste from the blood. These tests help diagnose kidney disease
                  and monitor kidney function over time.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        eGFR (mL/min/1.73m²)
                      </th>
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        CKD Stage
                      </th>
                      <th className="border border-gray-300 p-2 text-left font-semibold">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">≥90</td>
                      <td className="border border-gray-300 p-2 font-medium">
                        Stage 1
                      </td>
                      <td className="border border-gray-300 p-2">
                        Normal or high (with kidney damage)
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">60-89</td>
                      <td className="border border-gray-300 p-2 font-medium">
                        Stage 2
                      </td>
                      <td className="border border-gray-300 p-2">
                        Mildly decreased (with kidney damage)
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">45-59</td>
                      <td className="border border-gray-300 p-2 font-medium">
                        Stage 3a
                      </td>
                      <td className="border border-gray-300 p-2">
                        Mild to moderately decreased
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">30-44</td>
                      <td className="border border-gray-300 p-2 font-medium">
                        Stage 3b
                      </td>
                      <td className="border border-gray-300 p-2">
                        Moderately to severely decreased
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">15-29</td>
                      <td className="border border-gray-300 p-2 font-medium">
                        Stage 4
                      </td>
                      <td className="border border-gray-300 p-2">
                        Severely decreased
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">&lt;15</td>
                      <td className="border border-gray-300 p-2 font-medium">
                        Stage 5
                      </td>
                      <td className="border border-gray-300 p-2">
                        Kidney failure
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Raised ESR Section */}
                <div>
                  <h5 className="font-bold text-sm mb-3 underline">
                    Raised ESR can be found in:
                  </h5>
                  <ol className="text-xs space-y-1 list-decimal list-inside">
                    <li>Connective tissue disorders</li>
                    <li>Infections e.g., TB, acute hepatitis, bacterial</li>
                    <li>
                      Hematological disease e.g., multiple myeloma, anemia of
                      acute or chronic disease, along or combined with iron
                      deficiency anemia
                    </li>
                    <li>Malignancy e.g., lymphoma, breast or colon cancer</li>
                    <li>Pregnancy</li>
                    <li>Increasing age and years</li>
                    <li>Obesity can cause a moderately raised ESR</li>
                  </ol>
                </div>

                {/* Low ESR Section */}
                <div>
                  <h5 className="font-bold text-sm mb-3 underline">
                    Low ESR is found in:
                  </h5>
                  <ol className="text-xs space-y-1 list-decimal list-inside">
                    <li>Heart failure</li>
                    <li>Cachexia</li>
                    <li>Hypofibrinogenemia</li>
                    <li>Sickle cell disease</li>
                    <li>Conditions featuring abnormal blood cells</li>
                    <li>Polycythemia vera</li>
                    <li>Leucocytosis</li>
                    <li>Hypofibrinogenemia e.g. DIC</li>
                    <li>Massive hepatic necrosis</li>
                    <li>High white cell count</li>
                    <li>Treatment with steroids</li>
                  </ol>
                </div>
              </div>

              {/* Important Note */}
              <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
                <p className="text-xs font-medium">
                  <strong>NB:</strong> Very high (&gt;100) ESR is found in
                  autoimmune disease, malignancy, acute post trauma, and serious
                  infection. A false high ESR can occur if the ambient
                  temperature is unusually high.
                </p>
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
            <div className="space-y-4">
              {/* <div>
                <p className="text-sm mb-3 leading-relaxed">
                  Elevated glucose levels (hyperglycemia) are most often
                  encountered clinically in the setting of diabetes mellitus,
                  but they may also occur with pancreatic neoplasms,
                  hyperthyroidism, and adrenocortical dysfunction. Decreased
                  glucose levels (hypoglycemia) may result from endogenous or
                  exogenous insulin excess, prolonged starvation, or liver
                  disease.
                </p>
              </div> */}

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
                  <strong>For Cardiovascular Risk:</strong> &lt;1.0 mg/l (Low
                  risk), 1.0-3.0 mg/l (Average risk), &gt;3.0 mg/l (High risk).
                  CRP rises within 4-6 hours of inflammation onset.
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

              <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400">
                <p className="text-xs">
                  <strong>Note:</strong> RF can be positive in other conditions
                  including Sjögren's syndrome, systemic lupus erythematosus,
                  chronic infections, and in 5-10% of healthy individuals,
                  especially elderly.
                </p>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400">
                  <h5 className="font-semibold text-xs mb-2">
                    Associated Conditions:
                  </h5>
                  <ul className="text-xs space-y-1 list-disc list-inside">
                    <li>Rheumatic fever</li>
                    <li>Post-streptococcal glomerulonephritis</li>
                    <li>PANDAS syndrome</li>
                    <li>Scarlet fever</li>
                  </ul>
                </div>
                <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
                  <h5 className="font-semibold text-xs mb-2">
                    Clinical Notes:
                  </h5>
                  <ul className="text-xs space-y-1 list-disc list-inside">
                    <li>Peaks 3-6 weeks after infection</li>
                    <li>Gradually declines over months</li>
                    <li>Children have higher normal values</li>
                    <li>Serial testing may be needed</li>
                  </ul>
                </div>
              </div>
            </div>
          ),
        };

        
  case "hba1c":
  case "glycosylated haemoglobin":
    return {
      title: "Glycosylated Haemoglobin (HbA1c) Clinical Guidelines",
      content: (
        <div className="space-y-4">
          <div>
            <p className="text-sm mb-3 leading-relaxed">
              HbA1c measures the average blood glucose level over the past 2-3
              months, used to diagnose and monitor diabetes.
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
                    Result
                  </th>
                  <th className="border border-gray-300 p-2 text-left font-semibold">
                    Clinical Significance
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2">&lt; 5.7</td>
                  <td className="border border-gray-300 p-2 font-medium text-green-600">
                    NORMAL
                  </td>
                  <td className="border border-gray-300 p-2">
                    No diabetes
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">5.7-6.4</td>
                  <td className="border border-gray-300 p-2 font-medium text-yellow-600">
                    PREDIABETES
                  </td>
                  <td className="border border-gray-300 p-2">
                    Increased risk of diabetes
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">&gt;= 6.5</td>
                  <td className="border border-gray-300 p-2 font-medium text-red-600">
                    DIABETES
                  </td>
                  <td className="border border-gray-300 p-2">
                    Confirms diabetes diagnosis
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400">
            <p className="text-xs">
              <strong>Note:</strong> HbA1c may be affected by conditions like
              anemia or hemoglobin variants.
            </p>
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
          <div>
            <p className="text-sm mb-3 leading-relaxed">
              Serum Electrolytes measure levels of sodium, potassium, and
              chloride to assess fluid balance and kidney function.
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
                  <td className="border border-gray-300 p-2">Serum Sodium</td>
                  <td className="border border-gray-300 p-2">135.0-155.0 mEq/l</td>
                  <td className="border border-gray-300 p-2">
                    Outside range may indicate dehydration or hyponatremia
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Serum Potassium</td>
                  <td className="border border-gray-300 p-2">3.5-5.5 mEq/l</td>
                  <td className="border border-gray-300 p-2">
                    Abnormal levels may suggest hypokalemia or hyperkalemia
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Serum Chloride</td>
                  <td className="border border-gray-300 p-2">95.0-110.0 mEq/l</td>
                  <td className="border border-gray-300 p-2">
                    Deviations may indicate acid-base imbalances
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400">
            <p className="text-xs">
              <strong>Note:</strong> Results should be interpreted with clinical
              correlation, especially in renal or cardiac conditions.
            </p>
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
              Blood Uric Acid measures uric acid levels to detect gout or kidney
              dysfunction.
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
                  <td className="border border-gray-300 p-2">3.5-7.2 (Male)</td>
                  <td className="border border-gray-300 p-2 font-medium text-green-600">
                    NORMAL
                  </td>
                  <td className="border border-gray-300 p-2">
                    No evidence of hyperuricemia
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">2.6-6.0 (Female)</td>
                  <td className="border border-gray-300 p-2 font-medium text-green-600">
                    NORMAL
                  </td>
                  <td className="border border-gray-300 p-2">
                    No evidence of hyperuricemia
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">&gt; 7.2 (Male)</td>
                  <td className="border border-gray-300 p-2 font-medium text-red-600">
                    HIGH
                  </td>
                  <td className="border border-gray-300 p-2">
                    Risk of gout or kidney stones
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">&gt; 6.0 (Female)</td>
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
              Seminal Fluid Analysis assesses sperm health and male fertility.
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
                  <td className="border border-gray-300 p-2">Concentration</td>
                  <td className="border border-gray-300 p-2">15-200 million/mL</td>
                  <td className="border border-gray-300 p-2">
                    Below range suggests oligospermia
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Total Motility</td>
                  <td className="border border-gray-300 p-2">≥40%</td>
                  <td className="border border-gray-300 p-2">
                    Reduced motility may affect fertility
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Morphology</td>
                  <td className="border border-gray-300 p-2">≥4% normal forms</td>
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
  
}

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
