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
  const [granularity, setGranularity] = useState<'week' | 'month'>('week');
  const [metric, setMetric] = useState<'sessions' | 'duration_min' | 'distance_km'>('sessions');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isInvalidRange = Boolean(dateFrom && dateTo && dateFrom > dateTo);

  useEffect(() => {
    if (isInvalidRange) {
      setError('Virheellinen aikaväli: alkupäivämäärä ei voi olla loppupäivämäärän jälkeen.');
      setData([]);
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          metric,
          granularity,
        });

        if (dateFrom) params.append('from', `${dateFrom}T00:00:00`);
        if (dateTo) params.append('to', `${dateTo}T23:59:59`);

        const token = localStorage.getItem('token') || localStorage.getItem('access_token');
        const res = await fetch(`http://localhost:8000/stats/progress?${params.toString()}`, {
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
  }, [granularity, metric, dateFrom, dateTo, isInvalidRange]);

  const metricLabels: Record<string, string> = {
    sessions: 'Sessiot (kpl)',
    duration_min: 'Kesto (min)',
    distance_km: 'Matka (km)',
  };

  return (
    <div style={{ padding: '1rem 0' }}>
      <h2 style={{ marginBottom: '1rem' }}>Edistyminen ja analytiikka</h2>

      {/* Kontrollipaneeli (S4-12) */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'flex-end',
          marginBottom: '1.5rem',
          padding: '1rem',
          background: '#f8f9fa',
          borderRadius: 8,
          border: '1px solid #dee2e6',
        }}
      >
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 4, fontWeight: 600 }}>
            Tarkkuus (Granularity)
          </label>
          <select
            value={granularity}
            onChange={(e) => setGranularity(e.target.value as 'week' | 'month')}
            style={{ padding: '0.4rem 0.6rem', borderRadius: 4, border: '1px solid #ced4da' }}
          >
            <option value="week">Viikko (Week)</option>
            <option value="month">Kuukausi (Month)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 4, fontWeight: 600 }}>
            Metriikka
          </label>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value as 'sessions' | 'duration_min' | 'distance_km')}
            style={{ padding: '0.4rem 0.6rem', borderRadius: 4, border: '1px solid #ced4da' }}
          >
            <option value="sessions">Sessiot (kpl)</option>
            <option value="duration_min">Kesto (min)</option>
            <option value="distance_km">Matka (km)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 4, fontWeight: 600 }}>
            Alkaen (From)
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            style={{ padding: '0.35rem 0.6rem', borderRadius: 4, border: '1px solid #ced4da' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 4, fontWeight: 600 }}>
            Päättyen (To)
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            style={{ padding: '0.35rem 0.6rem', borderRadius: 4, border: '1px solid #ced4da' }}
          />
        </div>

        {(dateFrom || dateTo) && (
          <button
            type="button"
            onClick={() => {
              setDateFrom('');
              setDateTo('');
            }}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: 4,
              border: '1px solid #adb5bd',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            Tyhjennä rajaus
          </button>
        )}
      </div>

      {loading && <p>Ladataan edistymistietoja...</p>}
      {error && <p style={{ color: '#dc3545', fontWeight: 500 }}>{error}</p>}

      {!loading && !error && data.length === 0 && (
        <p style={{ color: '#6c757d' }}>Ei harjoitusmerkintöjä valitulla aikavälillä.</p>
      )}

      {!loading && !error && data.length > 0 && (
        <div style={{ width: '100%', height: 350, background: '#fff', padding: '1rem', borderRadius: 8 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 45, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="period_label" />
              <YAxis allowDecimals={metric !== 'sessions'} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0d6efd"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name={metricLabels[metric]}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};