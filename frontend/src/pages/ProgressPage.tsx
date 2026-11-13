import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface ProgressPoint {
  period_label: string;
  value: number;
}

interface ProgressResponse {
  metric: string;
  granularity: string;
  series: ProgressPoint[];
}

export const ProgressPage: React.FC = () => {
  const [data, setData] = useState<ProgressPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('access_token');
        const res = await fetch('http://localhost:8000/stats/progress?metric=sessions&granularity=week', {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) {
          throw new Error(`Rajapintavirhe: ${res.status}`);
        }

        const json: ProgressResponse = await res.json();
        setData(json.series || []);
      } catch (err: any) {
        setError(err.message || 'Datan lataus epäonnistui');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  return (
    <div style={{ padding: '1rem 0' }}>
      <h2 style={{ marginBottom: '1rem' }}>Edistyminen ja analytiikka</h2>

      {loading && <p>Ladataan edistymistietoja...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <div style={{ width: '100%', height: 350, background: '#fff', padding: '1rem', borderRadius: 8 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 40, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="period_label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0d6efd"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Sessiot"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};