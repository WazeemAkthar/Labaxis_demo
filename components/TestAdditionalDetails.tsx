import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TestAdditionalDetailsProps {
  testCode: string;
  className?: string;
}

const TestAdditionalDetails: React.FC<TestAdditionalDetailsProps> = ({ testCode, className = "" }) => {
  const getAdditionalDetails = (code: string) => {
    switch (code.toLowerCase()) {
      case 'lipid':
      case 'lipidprofile':
      case 'lipid profile':
        return {
          title: "Treatment Goals and Risk Categories",
          content: (
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-3 leading-relaxed">
                  Abnormalities of lipids are associated with increased risk of coronary artery disease (CAD) in patients with DM. This risk can be 
                  reduced by intensive treatment of lipid abnormalities. The usual pattern of lipid abnormalities in type 2 DM is elevated 
                  triglycerides, decreased HDL cholesterol and higher proportion of small, dense LDL particles. Cholesterol is a lipid found in all 
                  cell membranes and in blood plasma. It is an essential component of the cell membranes, and is necessary for synthesis of 
                  steroid hormones, and for the formation of bile acids. Cholesterol is synthesized by the liver and many other organs, and is also 
                  ingested in the diet. Triglycerides are lipids in which three long-chain fatty acids are attached to glycerol. They are present in 
                  dietary fat and also synthesized by liver and adipose tissue.
                </p>
                <p className="text-sm mb-4 font-medium">
                  Newer treatment goals and statin initiation thresholds based on the risk categories proposed by Lipid Association of India in 
                  2016.
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left font-semibold">Risk Category</th>
                      <th className="border border-gray-300 p-2 text-center font-semibold">Treatment Goal</th>
                      <th className="border border-gray-300 p-2 text-center font-semibold">Consider Therapy</th>
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
                      <td className="border border-gray-300 p-2 font-medium">Extreme Risk Group Category A</td>
                      <td className="border border-gray-300 p-2 text-center">&lt;50</td>
                      <td className="border border-gray-300 p-2 text-center">&lt;80</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">Extreme Risk Group Category A</td>
                      <td className="border border-gray-300 p-2 text-center">
                        <div>Optional Goal:&lt;30</div>
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        <div>Optional Goal:&lt;60</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">Very High</td>
                      <td className="border border-gray-300 p-2 text-center">&lt;50</td>
                      <td className="border border-gray-300 p-2 text-center">&lt;80</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">High</td>
                      <td className="border border-gray-300 p-2 text-center">&lt;70</td>
                      <td className="border border-gray-300 p-2 text-center">&lt;100</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )
        };

      case 'hba1c':
      case 'glycated hemoglobin':
        return {
          title: "HbA1c Interpretation Guidelines",
          content: (
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-3 leading-relaxed">
                  HbA1c reflects average blood glucose levels over the past 2-3 months. It is a key indicator for diabetes management 
                  and cardiovascular risk assessment.
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left font-semibold">HbA1c Level (%)</th>
                      <th className="border border-gray-300 p-2 text-left font-semibold">Interpretation</th>
                      <th className="border border-gray-300 p-2 text-left font-semibold">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">&lt;5.7%</td>
                      <td className="border border-gray-300 p-2">Normal</td>
                      <td className="border border-gray-300 p-2">Continue healthy lifestyle</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">5.7-6.4%</td>
                      <td className="border border-gray-300 p-2">Prediabetes</td>
                      <td className="border border-gray-300 p-2">Lifestyle modification, regular monitoring</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">≥6.5%</td>
                      <td className="border border-gray-300 p-2">Diabetes</td>
                      <td className="border border-gray-300 p-2">Medical management required</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">&lt;7.0%</td>
                      <td className="border border-gray-300 p-2">Good control (Adults)</td>
                      <td className="border border-gray-300 p-2">Target for most adults with diabetes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )
        };

      case 'thyroid':
      case 'tsh':
      case 'thyroid profile':
        return {
          title: "Thyroid Function Interpretation",
          content: (
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-3 leading-relaxed">
                  Thyroid function tests help evaluate thyroid gland activity and diagnose thyroid disorders. TSH is the primary 
                  screening test, with T3 and T4 providing additional information about thyroid hormone levels.
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left font-semibold">Condition</th>
                      <th className="border border-gray-300 p-2 text-center font-semibold">TSH</th>
                      <th className="border border-gray-300 p-2 text-center font-semibold">T4</th>
                      <th className="border border-gray-300 p-2 text-center font-semibold">T3</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">Normal</td>
                      <td className="border border-gray-300 p-2 text-center">Normal</td>
                      <td className="border border-gray-300 p-2 text-center">Normal</td>
                      <td className="border border-gray-300 p-2 text-center">Normal</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">Primary Hypothyroidism</td>
                      <td className="border border-gray-300 p-2 text-center">High</td>
                      <td className="border border-gray-300 p-2 text-center">Low</td>
                      <td className="border border-gray-300 p-2 text-center">Low</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">Subclinical Hypothyroidism</td>
                      <td className="border border-gray-300 p-2 text-center">High</td>
                      <td className="border border-gray-300 p-2 text-center">Normal</td>
                      <td className="border border-gray-300 p-2 text-center">Normal</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">Primary Hyperthyroidism</td>
                      <td className="border border-gray-300 p-2 text-center">Low</td>
                      <td className="border border-gray-300 p-2 text-center">High</td>
                      <td className="border border-gray-300 p-2 text-center">High</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">Subclinical Hyperthyroidism</td>
                      <td className="border border-gray-300 p-2 text-center">Low</td>
                      <td className="border border-gray-300 p-2 text-center">Normal</td>
                      <td className="border border-gray-300 p-2 text-center">Normal</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )
        };

      case 'liver':
      case 'lft':
      case 'liver function test':
        return {
          title: "Liver Function Test Guidelines",
          content: (
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-3 leading-relaxed">
                  Liver function tests assess the liver's ability to perform its normal biochemical functions. These tests help 
                  diagnose liver disease, monitor treatment progress, and assess liver damage.
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left font-semibold">Parameter</th>
                      <th className="border border-gray-300 p-2 text-left font-semibold">Clinical Significance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">ALT (SGPT)</td>
                      <td className="border border-gray-300 p-2">Most specific for liver cell damage. Elevated in hepatitis, fatty liver</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">AST (SGOT)</td>
                      <td className="border border-gray-300 p-2">Found in liver, heart, muscle. Elevated in liver damage, heart attack</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">ALP</td>
                      <td className="border border-gray-300 p-2">Elevated in bile duct obstruction, liver disease, bone disease</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">Bilirubin (Total)</td>
                      <td className="border border-gray-300 p-2">Elevated in liver dysfunction, bile duct obstruction, hemolysis</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">Albumin</td>
                      <td className="border border-gray-300 p-2">Decreased in chronic liver disease, malnutrition</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )
        };

      case 'kidney':
      case 'rft':
      case 'renal function test':
        return {
          title: "Kidney Function Assessment Guidelines",
          content: (
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-3 leading-relaxed">
                  Kidney function tests evaluate how well the kidneys filter waste from the blood. These tests help diagnose 
                  kidney disease and monitor kidney function over time.
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left font-semibold">eGFR (mL/min/1.73m²)</th>
                      <th className="border border-gray-300 p-2 text-left font-semibold">CKD Stage</th>
                      <th className="border border-gray-300 p-2 text-left font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">≥90</td>
                      <td className="border border-gray-300 p-2 font-medium">Stage 1</td>
                      <td className="border border-gray-300 p-2">Normal or high (with kidney damage)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">60-89</td>
                      <td className="border border-gray-300 p-2 font-medium">Stage 2</td>
                      <td className="border border-gray-300 p-2">Mildly decreased (with kidney damage)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">45-59</td>
                      <td className="border border-gray-300 p-2 font-medium">Stage 3a</td>
                      <td className="border border-gray-300 p-2">Mild to moderately decreased</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">30-44</td>
                      <td className="border border-gray-300 p-2 font-medium">Stage 3b</td>
                      <td className="border border-gray-300 p-2">Moderately to severely decreased</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">15-29</td>
                      <td className="border border-gray-300 p-2 font-medium">Stage 4</td>
                      <td className="border border-gray-300 p-2">Severely decreased</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">&lt;15</td>
                      <td className="border border-gray-300 p-2 font-medium">Stage 5</td>
                      <td className="border border-gray-300 p-2">Kidney failure</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )
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
    <div className={`mt-6 border-2 border-gray-200 rounded-lg p-4 bg-gray-50 ${className}`}>
      <h4 className="font-bold text-lg mb-4 text-gray-800 border-b-2 border-gray-300 pb-2">
        {details.title}
      </h4>
      <div className="text-gray-700">
        {details.content}
      </div>
      
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
          
          th, td {
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