import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchActivityTypes,
  createSession,
  type SessionWrite,
  type SessionItemWrite,
} from '../api/sessions';
import { MeasurementEditor } from '../components/MeasurementEditor';

interface Props {
  onSaved: () => void;
  onCancel: () => void;
}

export const SessionFormPage: React.FC<Props> = ({ onSaved, onCancel }) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [sessionAt, setSessionAt] = useState('');
  const [status, setStatus] = useState<'planned' | 'in_progress' | 'completed'>('planned');
  const [intensity, setIntensity] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<SessionItemWrite[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['activity-types'],
    queryFn: fetchActivityTypes,
  });

  const mutation = useMutation({
    mutationFn: (payload: SessionWrite) => createSession(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
      onSaved();
    },
    onError: (err: Error) => {
      setErrorMessage(err.message);
    },
  });

  const addExercise = (activityId: string) => {
    if (!activityId) return;
    const newItem: SessionItemWrite = {
      activity_type_id: activityId,
      sort_order: items.length,
      notes: '',
      measurements: [],
    };
    setItems([...items, newItem]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItemMeasurements = (index: number, measurements: any[]) => {
    const updated = [...items];
    updated[index].measurements = measurements;
    setItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Siivotaan tyhjät mittaukset pois (molemmat arvot null) jotta API ei heitä 422
    const cleanedItems = items.map((item, idx) => ({
      ...item,
      sort_order: idx,
      measurements: item.measurements.filter(
        (m) =>
          (m.planned_value !== null && !isNaN(m.planned_value as number)) ||
          (m.actual_value !== null && !isNaN(m.actual_value as number))
      ),
    }));

    const payload: SessionWrite = {
      name,
      session_at: sessionAt ? new Date(sessionAt).toISOString() : null,
      status,
      intensity: intensity === '' ? null : Number(intensity),
      notes: notes || null,
      items: cleanedItems,
    };

    mutation.mutate(payload);
  };

  if (activitiesLoading) return <p>Ladataan harjoituslajeja...</p>;

  return (
    <div style={{ maxWidth: 800, margin: '1rem auto', padding: '1.5rem', background: '#fff', border: '1px solid #ccc', borderRadius: 8 }}>
      <h3>Luo uusi harjoitussessio (Session Designer)</h3>
      {errorMessage && (
        <div style={{ padding: '0.75rem', background: '#ffebee', color: '#c62828', borderRadius: 4, marginBottom: '1rem' }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600 }}>Harjoituksen nimi *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="esim. Voimatreeni A"
              style={{ width: '100%', padding: '6px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600 }}>Ajankohta</label>
            <input
              type="datetime-local"
              value={sessionAt}
              onChange={(e) => setSessionAt(e.target.value)}
              style={{ width: '100%', padding: '6px' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600 }}>Tila</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              style={{ width: '100%', padding: '6px' }}
            >
              <option value="planned">Suunniteltu (planned)</option>
              <option value="in_progress">Käynnissä (in_progress)</option>
              <option value="completed">Suoritettu (completed)</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600 }}>Intensiteetti (1-10)</label>
            <input
              type="number"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(e.target.value === '' ? '' : Number(e.target.value))}
              style={{ width: '100%', padding: '6px' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 600 }}>Muistiinpanot</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ width: '100%', padding: '6px', minHeight: 60 }}
          />
        </div>

        <hr style={{ margin: '1.5rem 0' }} />
        <h4>Harjoitteet ja mittaukset</h4>

        {items.map((item, idx) => {
          const act = activities?.find((a) => a.id === item.activity_type_id);
          if (!act) return null;
          return (
            <div key={idx} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: 6, marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '1rem' }}>{idx + 1}. {act.name}</strong>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  style={{ color: '#d32f2f', border: '1px solid #d32f2f', background: 'transparent', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}
                >
                  Poista harjoite
                </button>
              </div>
              <MeasurementEditor
                activity={act}
                measurements={item.measurements}
                onChange={(m) => updateItemMeasurements(idx, m)}
              />
            </div>
          );
        })}

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '1rem' }}>
          <select
            id="activity-selector"
            defaultValue=""
            onChange={(e) => {
              addExercise(e.target.value);
              e.target.value = '';
            }}
            style={{ padding: '6px 12px' }}
          >
            <option value="" disabled>+ Lisää harjoite katalogista...</option>
            {activities?.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button
            type="submit"
            disabled={mutation.isPending}
            style={{ padding: '8px 20px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
          >
            {mutation.isPending ? 'Tallennetaan...' : 'Tallenna sessio'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{ padding: '8px 16px', background: '#eee', border: '1px solid #ccc', borderRadius: 4, cursor: 'pointer' }}
          >
            Peruuta
          </button>
        </div>
      </form>
    </div>
  );
};
