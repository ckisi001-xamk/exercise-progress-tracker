import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSessions, type WorkoutSession } from '../api/sessions';

interface Props {
  onSelectSession?: (id: string) => void;
}

export const SessionsPage: React.FC<Props> = ({ onSelectSession }) => {
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data: sessions, isLoading, isError, error } = useQuery({
    queryKey: ['sessions', { status: statusFilter }],
    queryFn: () => fetchSessions(statusFilter ? { status: statusFilter } : undefined),
  });

  return (
    <div>
      <h2>Harjoitussessiot</h2>
      <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: 6, marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <label htmlFor="status-filter" style={{ fontWeight: 600 }}>Tila:</label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '4px 8px', borderRadius: 4 }}
        >
          <option value="">Kaikki tilat</option>
          <option value="planned">Suunniteltu (planned)</option>
          <option value="in_progress">Käynnissä (in_progress)</option>
          <option value="completed">Suoritettu (completed)</option>
        </select>
      </div>

      {isLoading && <p>Ladataan harjoitussessioita...</p>}
      {isError && <p style={{ color: 'red' }}>Virhe ladattaessa: {(error as Error).message}</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {sessions?.map((s: WorkoutSession) => (
          <div
            key={s.id}
            onClick={() => onSelectSession && onSelectSession(s.id)}
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: 6,
              padding: '1rem',
              background: '#fff',
              cursor: onSelectSession ? 'pointer' : 'default',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '1.1rem' }}>{s.name}</strong>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: s.status === 'completed' ? '#e8f5e9' : '#e3f2fd',
                  color: s.status === 'completed' ? '#2e7d32' : '#1565c0',
                }}
              >
                {s.status.toUpperCase()}
              </span>
            </div>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
              Ajankohta: {s.session_at ? new Date(s.session_at).toLocaleString('fi-FI') : 'Aikatauluttamaton'}
            </p>
            {s.notes && <p style={{ margin: '0.25rem 0 0 0', color: '#888', fontStyle: 'italic', fontSize: '0.85rem' }}>{s.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};
