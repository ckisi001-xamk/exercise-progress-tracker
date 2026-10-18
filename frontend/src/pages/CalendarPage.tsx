import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCalendarSessions, type CalendarSession } from '../api/calendar';

interface CalendarPageProps {
  onSelectSession?: (sessionId: string) => void;
}

export const CalendarPage: React.FC<CalendarPageProps> = ({ onSelectSession }) => {
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [currentDate] = useState<Date>(new Date(2026, 9, 1)); // Lokakuu 2026
  // Määritetään aikaväli koko kuukaudelle (tai viikolle)
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const fromDate = new Date(year, month, 1, 0, 0, 0).toISOString();
  const toDate = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

  const { data: sessions, isLoading, error } = useQuery<CalendarSession[]>({
    queryKey: ['calendar', { from: fromDate, to: toDate }],
    queryFn: () => fetchCalendarSessions(fromDate, toDate),
  });

  // Apufunktio: järjestetään sessiot päivämäärittäin (YYYY-MM-DD)
  const sessionsByDate: Record<string, CalendarSession[]> = {};
  if (sessions) {
    sessions.forEach((s) => {
      const dateKey = s.session_at.split('T')[0];
      if (!sessionsByDate[dateKey]) sessionsByDate[dateKey] = [];
      sessionsByDate[dateKey].push(s);
    });
  }

  // Päivät kuukausinäkymään
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Viikkonäkymä: näytetään lokakuun puolivälin viikko (12.10 - 18.10.2026) jossa testisessio on
  const weekDays = [12, 13, 14, 15, 16, 17, 18];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Harjoituskalenteri (Calendar)</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setViewMode('month')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid #0d6efd',
              background: viewMode === 'month' ? '#0d6efd' : '#fff',
              color: viewMode === 'month' ? '#fff' : '#0d6efd',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Kuukausinäkymä (Month)
          </button>
          <button
            onClick={() => setViewMode('week')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid #0d6efd',
              background: viewMode === 'week' ? '#0d6efd' : '#fff',
              color: viewMode === 'week' ? '#fff' : '#0d6efd',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Viikkonäkymä (Week)
          </button>
        </div>
      </div>

      <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#333' }}>
        {currentDate.toLocaleDateString('fi-FI', { month: 'long', year: 'numeric' })}
      </div>

      {isLoading && <div>Ladataan kalenteritapahtumia...</div>}
      {error && <div style={{ color: 'red' }}>Virhe ladattaessa kalenteritietoja.</div>}

      {viewMode === 'month' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
          {['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'].map((d) => (
            <div key={d} style={{ fontWeight: 'bold', textAlign: 'center', padding: '0.5rem', background: '#f1f5f9' }}>
              {d}
            </div>
          ))}
          {/* Lokakuu 2026 alkaa torstaina -> 3 tyhjää ruutua alkuun */}
          <div style={{ minHeight: '80px', background: '#fafafa', border: '1px dashed #e2e8f0' }} />
          <div style={{ minHeight: '80px', background: '#fafafa', border: '1px dashed #e2e8f0' }} />
          <div style={{ minHeight: '80px', background: '#fafafa', border: '1px dashed #e2e8f0' }} />

          {daysArray.map((day) => {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const daySessions = sessionsByDate[dateStr] || [];

            return (
              <div
                key={day}
                style={{
                  minHeight: '85px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  padding: '4px',
                  background: daySessions.length > 0 ? '#eff6ff' : '#fff',
                }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>{day}</div>
                {daySessions.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => onSelectSession && onSelectSession(s.id)}
                    style={{
                      marginTop: '4px',
                      padding: '2px 4px',
                      background: '#0d6efd',
                      color: '#fff',
                      fontSize: '0.75rem',
                      borderRadius: '3px',
                      cursor: onSelectSession ? 'pointer' : 'default',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={s.name || 'Harjoitussessio'}
                  >
                    {s.name || 'Sessio'} ({s.status})
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
          {weekDays.map((day) => {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const daySessions = sessionsByDate[dateStr] || [];

            return (
              <div
                key={day}
                style={{
                  minHeight: '220px',
                  border: '1px solid #0d6efd',
                  borderRadius: '6px',
                  padding: '8px',
                  background: '#fff',
                }}
              >
                <div style={{ fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '4px', marginBottom: '8px' }}>
                  {day}. lokakuuta
                </div>
                {daySessions.length === 0 ? (
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Ei sessioita</div>
                ) : (
                  daySessions.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => onSelectSession && onSelectSession(s.id)}
                      style={{
                        padding: '6px',
                        background: '#e7f1ff',
                        borderLeft: '4px solid #0d6efd',
                        borderRadius: '3px',
                        marginBottom: '6px',
                        cursor: onSelectSession ? 'pointer' : 'default',
                      }}
                    >
                      <strong style={{ fontSize: '0.85rem' }}>{s.name || 'Sessio'}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#555' }}>
                        {new Date(s.session_at).toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <span style={{ fontSize: '0.7rem', background: '#cbd5e1', padding: '1px 4px', borderRadius: '3px' }}>
                        {s.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
