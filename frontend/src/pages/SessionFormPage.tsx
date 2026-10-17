import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchActivityTypes,
  fetchSession,
  createSession,
  updateSession,
  deleteSession,
  cloneSession,
  type SessionWrite,
  type SessionItemWrite,
} from '../api/sessions';
import { MeasurementEditor } from '../components/MeasurementEditor';

interface Props {
  sessionId?: string | null;
  onSaved: () => void;
  onCancel: () => void;
  onDeleted?: () => void;
  onCloned?: (newSessionId: string) => void;
}

export const SessionFormPage: React.FC<Props> = ({
  sessionId,
  onSaved,
  onCancel,
  onDeleted,
  onCloned,
}) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [sessionAt, setSessionAt] = useState('');
  const [status, setStatus] = useState<'planned' | 'in_progress' | 'completed'>('planned');
  const [intensity, setIntensity] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<SessionItemWrite[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Kloonauskortin tilat
  const [cloneName, setCloneName] = useState('');
  const [cloneDate, setCloneDate] = useState('');

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['activity-types'],
    queryFn: fetchActivityTypes,
  });

  const { data: existingSession, isLoading: sessionLoading } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => fetchSession(sessionId!),
    enabled: Boolean(sessionId),
  });

  useEffect(() => {
    if (existingSession) {
      setName(existingSession.name || '');
      setCloneName(`${existingSession.name} (Kopio)`);
      if (existingSession.session_at) {
        const d = new Date(existingSession.session_at);
        const pad = (n: number) => String(n).padStart(2, '0');
        setSessionAt(
          `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
        );
      } else {
        setSessionAt('');
      }
      setStatus(existingSession.status);
      setIntensity(existingSession.intensity ?? '');
      setNotes(existingSession.notes || '');

      if (existingSession.items) {
        setItems(
          existingSession.items.map((it) => ({
            activity_type_id: it.activity_type_id,
            sort_order: it.sort_order,
            notes: it.notes || '',
            measurements: (it.measurements || []).map((m) => ({
              unit_type_id: m.unit_type_id,
              set_index: m.set_index,
              planned_value: m.planned_value !== null ? Number(m.planned_value) : null,
              actual_value: m.actual_value !== null ? Number(m.actual_value) : null,
            })),
          }))
        );
      }
    }
  }, [existingSession]);

  const saveMutation = useMutation({
    mutationFn: (payload: SessionWrite) =>
      sessionId ? updateSession(sessionId, payload) : createSession(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
      if (sessionId) {
        queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
      }
      onSaved();
    },
    onError: (err: Error) => setErrorMessage(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteSession(sessionId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
      if (onDeleted) onDeleted();
      else onSaved();
    },
    onError: (err: Error) => setErrorMessage(err.message),
  });

  const cloneMutation = useMutation({
    mutationFn: () =>
      cloneSession(sessionId!, {
        name: cloneName || undefined,
        session_at: cloneDate ? new Date(cloneDate).toISOString() : null,
      }),
    onSuccess: (newSession) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      if (onCloned) {
        onCloned(newSession.id);
      } else if (onCancel) {
        onCancel();
      }
    },
    onError: (err: Error) => setErrorMessage(err.message),
  });

  const addExercise = (activityId: string) => {
    if (!activityId) return;
    setItems([
      ...items,
      {
        activity_type_id: activityId,
        sort_order: items.length,
        notes: '',
        measurements: [],
      },
    ]);
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

    const cleanedItems = items.map((item, idx) => ({
      ...item,
      sort_order: idx,
      measurements: item.measurements.filter(
        (m) =>
          (m.planned_value !== null && !isNaN(m.planned_value as number)) ||
          (m.actual_value !== null && !isNaN(m.actual_value as number))
      ),
    }));

    saveMutation.mutate({
      name,
      session_at: sessionAt ? new Date(sessionAt).toISOString() : null,
      status,
      intensity: intensity === '' ? null : Number(intensity),
      notes: notes || null,
      items: cleanedItems,
    });
  };

  const handleDelete = () => {
    if (window.confirm(`Haluatko varmasti poistaa session "${name}"? Tätä ei voi perua.`)) {
      deleteMutation.mutate();
    }
  };

  if (activitiesLoading || (sessionId && sessionLoading)) {
    return <p>Ladataan tietoja...</p>;
  }

  return (
    <div style={{ maxWidth: 850, margin: '1rem auto', padding: '1.5rem', background: '#fff', border: '1px solid #ccc', borderRadius: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>{sessionId ? 'Muokkaa sessiota' : 'Luo uusi harjoitussessio'}</h3>
        {sessionId && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            style={{ padding: '6px 12px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
          >
            {deleteMutation.isPending ? 'Poistetaan...' : 'Poista sessio'}
          </button>
        )}
      </div>

      {errorMessage && (
        <div style={{ padding: '0.75rem', background: '#ffebee', color: '#c62828', borderRadius: 4, margin: '1rem 0' }}>
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
            disabled={saveMutation.isPending}
            style={{ padding: '8px 20px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
          >
            {saveMutation.isPending ? 'Tallennetaan...' : 'Tallenna muutokset'}
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

      {/* S3-16: Kloonauspaneeli olemassa olevalle sessiolle */}
      {sessionId && (
        <div style={{ marginTop: '2.5rem', padding: '1.25rem', border: '1px solid #90caf9', background: '#e3f2fd', borderRadius: 6 }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#0d47a1' }}>Kloonaa sessio uudelle päivälle (Clone snapshot)</h4>
          <p style={{ fontSize: '0.85rem', color: '#333', margin: '0 0 1rem 0' }}>
            Kloonaus luo itsenäisen tilannevedoksen. Suunnitellut arvot kopioidaan, toteutuneet nollataan ja tila palaa arvoon <em>planned</em>.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.75rem', alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600 }}>Kopion nimi</label>
              <input
                type="text"
                value={cloneName}
                onChange={(e) => setCloneName(e.target.value)}
                style={{ width: '100%', padding: '6px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600 }}>Uusi ajankohta (vapaaehtoinen)</label>
              <input
                type="datetime-local"
                value={cloneDate}
                onChange={(e) => setCloneDate(e.target.value)}
                style={{ width: '100%', padding: '6px' }}
              />
            </div>
            <button
              type="button"
              onClick={() => cloneMutation.mutate()}
              disabled={cloneMutation.isPending}
              style={{ padding: '7px 16px', background: '#0288d1', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}
            >
              {cloneMutation.isPending ? 'Kloonataan...' : 'Kloonaa'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
