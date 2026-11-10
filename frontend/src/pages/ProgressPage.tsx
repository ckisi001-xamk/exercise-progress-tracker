import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const sampleData = [
  { period_label: '2026-W40', sessions: 2 },
  { period_label: '2026-W41', sessions: 4 },
  { period_label: '2026-W42', sessions: 3 },
  { period_label: '2026-W43', sessions: 1 },
];

export const ProgressPage: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Edistyminen ja analytiikka</h2>
      <p style={{ color: '#64748b' }}>
        S4-10: Alustus staattisella datalla (Recharts setup)
      </p>

      <div
        style={{
          width: '100%',
          maxWidth: '800px',
          height: 350,
          marginTop: '1.5rem',
          background: '#ffffff',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampleData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period_label" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sessions"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressPage;
