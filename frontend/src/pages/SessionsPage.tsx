import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSessions, type WorkoutSession } from '../api/sessions';

interface Props {
  onSelectSession?: (id: string) => void;
  onCreateSession?: () => void;
}

export const SessionsPage: React.FC<Props> = ({ onSelectSession, onCreateSession }) => {
  const [statusFilter, setStatusFilter] = useState<string>('');

  const {
    data: sessions,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['sessions', { status: statusFilter }],
    queryFn: () => fetchSessions(statusFilter ? { status: statusFilter } : undefined),
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>Harjoitussessiot</h2>
        {onCreateSession && (
          <button
            onClick={onCreateSession}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1a73e8',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            + Luo uusi sessio
          </button>
        )}
      </div>

      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          padding: '1rem',
          borderRadius: 6,
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        <label htmlFor="status-filter" style={{ fontWeight: 600, color: '#334155' }}>
          Tila:
        </label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid #cbd5e1' }}
        >
          <option value="">Kaikki tilat</option>
          <option value="planned">Suunniteltu (planned)</option>
          <option value="in_progress">Käynnissä (in_progress)</option>
          <option value="completed">Suoritettu (completed)</option>
        </select>
      </div>

      {isLoading && <p>Ladataan harjoitussessioita...</p>}

      {/* ERROR / RETRY STATE */}
      {isError && (
        <div
          style={{
            padding: '1.25rem',
            background: '#fef2f2',
            border: '1px solid #f87171',
            borderRadius: 6,
            marginBottom: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            alignItems: 'flex-start',
          }}
        >
          <strong style={{ color: '#991b1b', fontSize: '1rem' }}>Sessioiden lataaminen epäonnistui</strong>
          <span style={{ color: '#b91c1c', fontSize: '0.9rem' }}>
            Virhe: {(error as Error)?.message || 'Yhteysvirhe taustapalvelimeen'}
          </span>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            style={{
              padding: '6px 14px',
              background: '#dc2626',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: isFetching ? 'not-allowed' : 'pointer',
              fontWeight: 500,
            }}
          >
            {isFetching ? 'Yritetään uudelleen...' : 'Yritä uudelleen (Retry)'}
          </button>
        </div>
      )}

      {/* EMPTY STATE */}
      {!isLoading && !isError && sessions && sessions.length === 0 && (
        <div
          style={{
            padding: '2.5rem',
            textAlign: 'center',
            background: '#f8fafc',
            border: '1px dashed #cbd5e1',
            borderRadius: 8,
          }}
        >
          <p style={{ margin: 0, color: '#64748b', fontSize: '1rem' }}>
            {statusFilter
              ? `Ei löytynyt harjoitussessioita valitulla tilalla "${statusFilter}".`
              : 'Ei vielä yhtään harjoitussessiota järjestelmässä.'}
          </p>
          {onCreateSession && (
            <button
              onClick={onCreateSession}
              style={{
                marginTop: '1rem',
                padding: '8px 16px',
                background: '#0d6efd',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              Luo ensimmäinen harjoitus
            </button>
          )}
        </div>
      )}

      {/* LISTA */}
      {!isLoading && !isError && sessions && sessions.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {sessions.map((s: WorkoutSession) => (
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
              {s.notes && (
                <p style={{ margin: '0.25rem 0 0 0', color: '#888', fontStyle: 'italic', fontSize: '0.85rem' }}>
                  {s.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};