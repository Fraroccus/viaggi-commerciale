import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { BudgetBreakdown } from '../types';
import { Language, translations } from '../lib/translations';

interface CostChartProps {
  breakdown: BudgetBreakdown;
  lang: Language;
}

export const CostChart: React.FC<CostChartProps> = ({ breakdown, lang }) => {
  const t = translations[lang];
  
  const data = [
    { name: t.accommodation, value: breakdown.accommodation, color: '#6366f1' },
    { name: t.transport, value: breakdown.transport, color: '#10b981' },
    { name: t.food, value: breakdown.food, color: '#f59e0b' },
    { name: t.activities, value: breakdown.activities, color: '#ec4899' },
    { name: t.extra, value: breakdown.extra, color: '#6b7280' },
  ].filter(d => d.value > 0);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
