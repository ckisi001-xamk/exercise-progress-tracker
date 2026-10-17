import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPlans, type WorkoutPlan, type PlanSessionItem } from '../api/plans';

interface PlansPageProps {
  onSelectSession?: (sessionId: string) => void;
}

export const PlansPage: React.FC<PlansPageProps> = ({ onSelectSession }) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const { data: plans, isLoading, error } = useQuery<WorkoutPlan[]>({
    queryKey: ['plans'],
    queryFn: fetchPlans,
  });

  if (isLoading) return <div style={{ padding: '1rem' }}>Ladataan suunnitelmia...</div>;
  if (error) return <div style={{ padding: '1rem', color: 'red' }}>Virhe ladattaessa suunnitelmia.</div>;

  const currentPlan = plans?.find((p) => p.id === selectedPlanId) || plans?.[0];

  const sessions: PlanSessionItem[] = currentPlan?.sessions || [];
  const scheduledSessions = sessions
    .filter((s) => s.session_at)
    .sort((a, b) => new Date(a.session_at!).getTime() - new Date(b.session_at!).getTime());
  const unscheduledSessions = sessions.filter((s) => !s.session_at);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Harjoitussuunnitelmat (Plans)</h2>
      </div>

      {(!plans || plans.length === 0) ? (
        <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '6px', border: '1px solid #ddd' }}>
          Ei aktiivisia suunnitelmia kannassa.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <strong>Valitse suunnitelma:</strong>
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                style={{
                  textAlign: 'left',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  background: (currentPlan?.id === plan.id) ? '#e7f1ff' : '#fff',
                  borderColor: (currentPlan?.id === plan.id) ? '#0d6efd' : '#ccc',
                  cursor: 'pointer',
                  fontWeight: (currentPlan?.id === plan.id) ? 'bold' : 'normal',
                }}
              >
                <div>{plan.name}</div>
                <small style={{ color: '#666' }}>
                  {plan.length_weeks ? `${plan.length_weeks} vkoa` : 'Kesto avoin'}
                </small>
              </button>
            ))}
          </div>

          {currentPlan && (
            <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1.25rem', background: '#fff' }}>
              <div style={{ borderBottom: '1px solid #eee', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>{currentPlan.name}</h3>
                {currentPlan.notes && <p style={{ color: '#555', margin: '0.5rem 0 0' }}>{currentPlan.notes}</p>}
                <div style={{ fontSize: '0.85rem', color: '#777', marginTop: '0.5rem' }}>
                  <span>Alkaa: {currentPlan.start_date || 'Ei määritelty'}</span> | <span>Plan ID: {currentPlan.id}</span>
                </div>
              </div>

              <h4>Suunnitelman harjoitussessiot ({sessions.length})</h4>

              <div style={{ marginBottom: '1.5rem' }}>
                <h5 style={{ margin: '0.5rem 0', color: '#0d6efd' }}>Aikataulutetut (Ordered by session_at)</h5>
                {scheduledSessions.length === 0 ? (
                  <p style={{ fontSize: '0.9rem', color: '#888' }}>Ei aikataulutettuja sessioita.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {scheduledSessions.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => onSelectSession && onSelectSession(s.id)}
                        style={{
                          padding: '0.75rem',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: onSelectSession ? 'pointer' : 'default',
                          background: '#f8fafc',
                        }}
                      >
                        <div>
                          <strong>{s.name}</strong>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            {new Date(s.session_at!).toLocaleString('fi-FI')}
                          </div>
                        </div>
                        <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: '#e2e8f0' }}>
                          {s.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h5 style={{ margin: '0.5rem 0', color: '#6c757d' }}>Aikatauluttamattomat (Unscheduled)</h5>
                {unscheduledSessions.length === 0 ? (
                  <p style={{ fontSize: '0.9rem', color: '#888' }}>Ei aikatauluttamattomia sessioita.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {unscheduledSessions.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => onSelectSession && onSelectSession(s.id)}
                        style={{
                          padding: '0.75rem',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: onSelectSession ? 'pointer' : 'default',
                          background: '#fff',
                        }}
                      >
                        <div>
                          <strong>{s.name}</strong>
                          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Ei ajankohtaa</div>
                        </div>
                        <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: '#e2e8f0' }}>
                          {s.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
