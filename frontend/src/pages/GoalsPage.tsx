import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchGoals, createGoal, type Goal } from '../api/goals';

const UNIT_OPTIONS = [
  { id: '2a9e467e-a5fd-4796-8956-b2bda2454025', name: 'Matka (Distance / km)' },
  { id: '4e7082eb-a39e-4603-9ab4-a9c2904967e0', name: 'Kesto (Duration / min)' },
  { id: 'ba2e6022-572d-48c1-a885-7fc9077f8929', name: 'Toistot (Reps)' },
  { id: 'ff14ad17-22fe-4be7-891d-106de4128feb', name: 'Paino (Weight / kg)' },
];

export const GoalsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [unitTypeId, setUnitTypeId] = useState(UNIT_OPTIONS[0].id);
  const [targetValue, setTargetValue] = useState<number | ''>(5);
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  const { data: goals, isLoading, isError } = useQuery<Goal[]>({
    queryKey: ['goals'],
    queryFn: () => fetchGoals(),
  });

  const mutation = useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setTargetValue('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetValue || Number(targetValue) <= 0) return;
    mutation.mutate({
      unit_type_id: unitTypeId,
      target_value: Number(targetValue),
      period,
      active: true,
    });
  };

  const getUnitName = (id: string) => {
    return UNIT_OPTIONS.find((u) => u.id === id)?.name || id;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ margin: 0 }}>Tavoitteet (Goals)</h2>
        <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
          Aseta ja seuraa harjoitustavoitteitasi
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          background: '#f8fafc',
          padding: '1rem',
          borderRadius: 8,
          border: '1px solid #e2e8f0',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>Mittayksikkö</label>
          <select
            value={unitTypeId}
            onChange={(e) => setUnitTypeId(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid #cbd5e1' }}
          >
            {UNIT_OPTIONS.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>Tavoitearvo</label>
          <input
            type="number"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="esim. 10"
            style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid #cbd5e1', width: 120 }}
            required
            min="1"
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>Jakso</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as 'week' | 'month')}
            style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid #cbd5e1' }}
          >
            <option value="week">Viikko (week)</option>
            <option value="month">Kuukausi (month)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          style={{
            padding: '8px 16px',
            background: '#1a73e8',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          {mutation.isPending ? 'Tallennetaan...' : '+ Lisää tavoite'}
        </button>
      </form>

      {isLoading && <p>Ladataan tavoitteita...</p>}
      {isError && <p style={{ color: 'red' }}>Virhe ladattaessa tavoitteita.</p>}

      {!isLoading && goals && goals.length === 0 && (
        <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: 6 }}>
          <p style={{ margin: 0, color: '#64748b' }}>Ei asetettuja tavoitteita. Luo ensimmäinen yllä olevalla lomakkeella.</p>
        </div>
      )}

      {!isLoading && goals && goals.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {goals.map((g) => (
            <div
              key={g.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 6,
              }}
            >
              <div>
                <strong>{getUnitName(g.unit_type_id)}</strong>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 4 }}>
                  Tavoite: {g.target_value} / jakso: {g.period === 'week' ? 'viikko' : 'kuukausi'}
                </div>
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: g.active ? '#e0f2fe' : '#f1f5f9',
                  color: g.active ? '#0369a1' : '#64748b',
                  fontWeight: 600,
                }}
              >
                {g.active ? 'active' : 'inactive'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
