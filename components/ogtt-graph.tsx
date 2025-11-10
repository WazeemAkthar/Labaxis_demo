import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OGTTGraphProps {
  fasting: string;
  afterOneHour: string;
  afterTwoHours: string;
}

export const OGTTGraph: React.FC<OGTTGraphProps> = ({ fasting, afterOneHour, afterTwoHours }) => {
  const fastingVal = parseFloat(fasting) || 0;
  const oneHourVal = parseFloat(afterOneHour) || 0;
  const twoHourVal = parseFloat(afterTwoHours) || 0;

  const data = [
    { 
      time: 'Fasting', 
      findings: fastingVal,
      minRange: 70,
      maxRange: 110,
      label: 0
    },
    { 
      time: '1', 
      findings: oneHourVal,
      minRange: 90,
      maxRange: 170,
      label: 1
    },
    { 
      time: '2', 
      findings: twoHourVal,
      minRange: 80,
      maxRange: 160,
      label: 2
    }
  ];

  const getStatus = () => {
    if (twoHourVal >= 200 || fastingVal >= 126) return { text: 'Diabetic', color: '#ef4444' };
    if (twoHourVal >= 140 || fastingVal >= 100) return { text: 'Prediabetic', color: '#f59e0b' };
    return { text: 'Normal', color: '#10b981' };
  };

  const status = getStatus();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold mb-1">
            {payload[0].payload.time === 'Fasting' ? 'Fasting' : `${payload[0].payload.time} Hour`}
          </p>
          <p className="text-blue-600 font-medium">
            Findings: {payload[0].payload.findings} mg/dl
          </p>
          <p className="text-red-500 text-sm">
            Range: {payload[0].payload.minRange} - {payload[0].payload.maxRange} mg/dl
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = (props: any) => {
    const { x, y, value } = props;
    return (
      <g>
        <rect 
          x={x - 20} 
          y={y - 25} 
          width={40} 
          height={20} 
          fill="white" 
          stroke="#3b82f6" 
          strokeWidth={1}
          rx={3}
        />
        <text 
          x={x} 
          y={y - 12} 
          fill="#3b82f6" 
          textAnchor="middle" 
          fontSize={12}
          fontWeight="bold"
        >
          {value}
        </text>
      </g>
    );
  };

  return (
    <div className="w-full ogtt-graph-container print-preserve">
      <div>
        <div className="flex items-center justify-between">
          <span>Oral Glucose Tolerance Test (OGTT)</span>
          <span className="text-sm font-normal px-3 py-1 rounded-full" style={{ backgroundColor: status.color, color: 'white' }}>
            {status.text}
          </span>
        </div>
      </div>
      <div>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={data} margin={{ top: 40, right: 30, left: 20, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            
            <XAxis 
              dataKey="time" 
              label={{ 
                value: 'time after glucose dose (hours)', 
                position: 'insideBottom', 
                offset: -15,
                style: { fontSize: 14, fill: '#666' }
              }}
              tick={{ fontSize: 12 }}
            />
            
            <YAxis 
              label={{ 
                value: 'blood sugar (mg/dl)', 
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: 14, fill: '#666' }
              }}
              domain={[0, 200]}
              ticks={[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200]}
              tick={{ fontSize: 12 }}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="line"
              wrapperStyle={{ fontSize: 14 }}
            />
            
            <Area 
              type="monotone" 
              dataKey="maxRange" 
              fill="#dc2626" 
              stroke="#dc2626"
              strokeWidth={2}
              fillOpacity={0.3}
              name="Min - Max Range"
              dot={{ fill: '#dc2626', r: 5, strokeWidth: 2, stroke: 'white' }}
            />
            
            <Area 
              type="monotone" 
              dataKey="minRange" 
              fill="white" 
              stroke="#dc2626"
              strokeWidth={2}
              name=""
              dot={{ fill: '#dc2626', r: 5, strokeWidth: 2, stroke: 'white' }}
            />
            
            <Line 
              type="monotone" 
              dataKey="findings" 
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 6, strokeWidth: 2, stroke: 'white' }}
              name="Findings"
              label={<CustomLabel />}
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded text-sm">
          <div className="font-semibold mb-2 text-blue-900">Interpretation:</div>
          <div className="text-gray-700">
            {twoHourVal < 140 && fastingVal < 100 && "✓ Normal glucose tolerance. No diabetes indicated."}
            {(twoHourVal >= 140 && twoHourVal < 200) || (fastingVal >= 100 && fastingVal < 126) && 
              "⚠ Impaired glucose tolerance (Prediabetes). Lifestyle modifications recommended. Consult with physician for management plan."}
            {(twoHourVal >= 200 || fastingVal >= 126) && 
              "⚠ Diabetes mellitus indicated. Further evaluation and treatment required. Please consult with physician immediately."}
          </div>
        </div> */}
      </div>
    </div>
  );
};