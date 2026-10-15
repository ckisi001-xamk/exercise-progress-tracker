import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import { fetchSessions, type SessionFilters } from '../api/sessions';

export const SessionsPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('');

  const filters: SessionFilters = {
    status: statusFilter || undefined,
  };

  const { data: sessions, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.sessions.list(filters as Record<string, unknown>),
    queryFn: () => fetchSessions(filters),
  });

  return (
    <div style={{ maxWidth: 900, margin: '1rem auto', padding: '1rem' }}>
      <h2>Harjoitussessiot</h2>

      {/* Suodatinkontrollit */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', background: '#f5f5f5', padding: '1rem', borderRadius: 6 }}>
        <label htmlFor="status-select" style={{ fontWeight: 600 }}>Tila:</label>
        <select
          id="status-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc' }}
        >
          <option value="">Kaikki tilat</option>
          <option value="planned">Suunniteltu (planned)</option>
          <option value="completed">Suoritettu (completed)</option>
          <option value="cancelled">Peruttu (cancelled)</option>
        </select>
        {isLoading && <span style={{ color: '#666', fontSize: '0.9rem' }}>Päivitetään...</span>}
      </div>

      {/* Virhe- ja lataustilat */}
      {isLoading && !sessions && <p>Ladataan harjoituksia...</p>}
      {isError && <p style={{ color: '#d32f2f' }}>Virhe ladattaessa: {(error as Error).message}</p>}

      {/* Datalistaus */}
      {sessions && sessions.length === 0 && (
        <p style={{ color: '#666' }}>Ei löytynyt sessioita valituilla ehdoilla.</p>
      )}

      {sessions && sessions.length > 0 && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {sessions.map((s) => (
            <div
              key={s.id}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: 6,
                padding: '1rem',
                backgroundColor: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '1.1rem' }}>{s.name || 'Nimetön harjoitus'}</strong>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: '0.85rem',
                    backgroundColor: s.status === 'completed' ? '#e8f5e9' : s.status === 'planned' ? '#e3f2fd' : '#ffebee',
                    color: s.status === 'completed' ? '#2e7d32' : s.status === 'planned' ? '#1565c0' : '#c62828',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  }}
                >
                  {s.status}
                </span>
              </div>
              <p style={{ margin: '0.5rem 0', color: '#555', fontSize: '0.9rem' }}>
                Ajankohta: {new Date(s.session_at).toLocaleString('fi-FI')}
              </p>
              {s.notes && <p style={{ margin: '0.5rem 0', fontStyle: 'italic', color: '#666' }}>{s.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
