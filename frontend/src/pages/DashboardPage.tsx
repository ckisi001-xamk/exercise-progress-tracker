import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSessions, type WorkoutSession } from '../api/sessions';

interface DashboardPageProps {
  onSelectSession: (id: string) => void;
  onCreateSession: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onSelectSession, onCreateSession }) => {
  const { data: sessions, isLoading, error } = useQuery<WorkoutSession[]>({
    queryKey: ['sessions'],
    queryFn: () => fetchSessions(),
  });

  const recentSessions = Array.isArray(sessions)
    ? [...sessions]
        .sort((a, b) => {
          const timeA = a.session_at ? new Date(a.session_at).getTime() : 0;
          const timeB = b.session_at ? new Date(b.session_at).getTime() : 0;
          return timeB - timeA;
        })
        .slice(0, 5)
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0 }}>Kojelauta (Dashboard)</h2>
          <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
            Yhteenveto ja viimeisimmät harjoituskirjaukset
          </p>
        </div>
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
      </div>

      <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', background: '#fff' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.1rem' }}>Viimeisimmät sessiot (Recent sessions)</h3>

        {isLoading && <div>Ladataan viimeisimpiä harjoituksia...</div>}
        {error && <div style={{ color: 'red' }}>Virhe haettaessa harjoituksia.</div>}

        {!isLoading && recentSessions.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '6px' }}>
            <p style={{ margin: 0, color: '#64748b' }}>Ei aiempia harjoitussessioita.</p>
            <button
              onClick={onCreateSession}
              style={{
                marginTop: '0.75rem',
                padding: '6px 12px',
                background: '#0d6efd',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Kirjaa ensimmäinen harjoitus
            </button>
          </div>
        )}

        {!isLoading && recentSessions.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentSessions.map((s) => (
              <div
                key={s.id}
                onClick={() => onSelectSession(s.id)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  background: '#f8fafc',
                  cursor: 'pointer',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{s.name || 'Nimetön sessio'}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {s.session_at
                      ? new Date(s.session_at).toLocaleString('fi-FI', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })
                      : 'Ei ajankohtaa'}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: s.status === 'completed' ? '#dcfce7' : '#e0e7ff',
                    color: s.status === 'completed' ? '#166534' : '#3730a3',
                    fontWeight: 600,
                  }}
                >
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};