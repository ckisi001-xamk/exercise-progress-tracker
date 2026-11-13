import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface SummaryStats {
  session_count?: number;
  total_sessions?: number;
  total_duration_min?: number;
  total_distance_km?: number;
  avg_intensity?: number | null;
}

const fetchSummary = async (dateFrom: string, dateTo: string): Promise<SummaryStats> => {
  const params = new URLSearchParams();
  if (dateFrom) params.append('from', `${dateFrom}T00:00:00`);
  if (dateTo) params.append('to', `${dateTo}T23:59:59`);

  const queryString = params.toString();
  const url = `http://localhost:8000/stats/summary${queryString ? `?${queryString}` : ''}`;

  const token = localStorage.getItem('token') || localStorage.getItem('access_token');
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    throw new Error(`Yhteenvedon haku epäonnistui (${res.status})`);
  }

  return res.json();
};

const formatDuration = (minutes: number): string => {
  if (!minutes || minutes <= 0) return '0 min';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m} min`;
  return m > 0 ? `${h} h ${m} min` : `${h} h`;
};

export const StatWidgets: React.FC = () => {
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  const { data, isLoading, error } = useQuery<SummaryStats>({
    queryKey: ['stats', 'summary', dateFrom, dateTo],
    queryFn: () => fetchSummary(dateFrom, dateTo),
  });

  const sessionCount = data?.session_count ?? data?.total_sessions ?? 0;
  const totalDuration = data?.total_duration_min ?? 0;
  const totalDistance = data?.total_distance_km ?? 0;
  const avgIntensity = data?.avg_intensity;

  const cardStyle: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '1rem 1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Yhteinen aikavälikontrolli kaikille widgeteille */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem 1rem',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
        }}
      >
        <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0f172a' }}>
          Suorituskykyyhteenveto (/stats/summary)
        </span>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
          <label style={{ fontSize: '0.8rem', color: '#475569' }}>Alkaen:</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
          />
          <label style={{ fontSize: '0.8rem', color: '#475569' }}>Päättyen:</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
          />
          {(dateFrom || dateTo) && (
            <button
              type="button"
              onClick={() => {
                setDateFrom('');
                setDateTo('');
              }}
              style={{
                padding: '4px 10px',
                borderRadius: 4,
                border: '1px solid #cbd5e1',
                background: '#fff',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              Tyhjennä
            </button>
          )}
        </div>
      </div>

      {isLoading && (
        <div style={{ padding: '1rem', color: '#64748b', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          Ladataan yhteenvetotilastoja...
        </div>
      )}

      {error && (
        <div style={{ padding: '1rem', color: '#dc2626', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
          Virhe ladattaessa yhteenvetotilastoja.
        </div>
      )}

      {!isLoading && !error && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
          }}
        >
          <div style={cardStyle}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Sessiot yhteensä</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a' }}>{sessionCount} kpl</span>
          </div>

          <div style={cardStyle}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Kokonaiskesto</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a' }}>
              {formatDuration(totalDuration)}
            </span>
          </div>

          <div style={cardStyle}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Kokonaismatka</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a' }}>
              {totalDistance.toFixed(1)} km
            </span>
          </div>

          <div style={cardStyle}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Keski-intensiteetti</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a' }}>
              {avgIntensity !== null && avgIntensity !== undefined && avgIntensity > 0
                ? `${avgIntensity.toFixed(1)} / 10`
                : '—'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};