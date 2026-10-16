import React from 'react';
import type { ActivityType, MeasurementWrite } from '../api/sessions';

interface Props {
  activity: ActivityType;
  measurements: MeasurementWrite[];
  onChange: (measurements: MeasurementWrite[]) => void;
}

export const MeasurementEditor: React.FC<Props> = ({ activity, measurements, onChange }) => {
  const perSetUnits = activity.unit_links.filter((u) => u.per_set);
  const generalUnits = activity.unit_links.filter((u) => !u.per_set);

  const setIndexes = Array.from(
    new Set(
      measurements
        .filter((m) => m.set_index !== null && m.set_index !== undefined)
        .map((m) => m.set_index as number)
    )
  ).sort((a, b) => a - b);

  const activeSets = setIndexes.length > 0 ? setIndexes : (perSetUnits.length > 0 ? [0] : []);

  const updateMeasurement = (
    unitTypeId: string,
    setIndex: number | null,
    field: 'planned_value' | 'actual_value',
    rawVal: string
  ) => {
    const val = rawVal === '' ? null : Number(rawVal);
    const existingIndex = measurements.findIndex(
      (m) => m.unit_type_id === unitTypeId && m.set_index === setIndex
    );

    let updated = [...measurements];
    if (existingIndex >= 0) {
      updated[existingIndex] = {
        ...updated[existingIndex],
        [field]: val,
      };
    } else {
      updated.push({
        unit_type_id: unitTypeId,
        set_index: setIndex,
        planned_value: field === 'planned_value' ? val : null,
        actual_value: field === 'actual_value' ? val : null,
      });
    }
    onChange(updated);
  };

  const addSet = () => {
    const nextIdx = activeSets.length > 0 ? Math.max(...activeSets) + 1 : 0;
    const newItems = perSetUnits.map((u) => ({
      unit_type_id: u.unit_type_id,
      set_index: nextIdx,
      planned_value: null,
      actual_value: null,
    }));
    onChange([...measurements, ...newItems]);
  };

  const removeSet = (idxToRemove: number) => {
    const updated = measurements.filter((m) => m.set_index !== idxToRemove);
    onChange(updated);
  };

  const getValue = (unitTypeId: string, setIndex: number | null, field: 'planned_value' | 'actual_value') => {
    const m = measurements.find((item) => item.unit_type_id === unitTypeId && item.set_index === setIndex);
    if (!m || m[field] === null || m[field] === undefined) return '';
    return m[field];
  };

  return (
    <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#fafafa', borderRadius: 4 }}>
      {generalUnits.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <strong style={{ fontSize: '0.9rem', color: '#444' }}>Yleiset mittaukset:</strong>
          {generalUnits.map((u) => {
            const unitName = u.unit_type?.name || 'Määrite';
            const unitLabel = u.unit_type?.unit_label ? ` (${u.unit_type.unit_label})` : '';
            return (
              <div key={u.unit_type_id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.4rem' }}>
                <span style={{ width: 160, fontSize: '0.85rem' }}>{unitName}{unitLabel}:</span>
                <input
                  type="number"
                  placeholder="Suunniteltu"
                  value={getValue(u.unit_type_id, null, 'planned_value')}
                  onChange={(e) => updateMeasurement(u.unit_type_id, null, 'planned_value', e.target.value)}
                  style={{ width: 110, padding: 4 }}
                />
                <input
                  type="number"
                  placeholder="Toteutunut"
                  value={getValue(u.unit_type_id, null, 'actual_value')}
                  onChange={(e) => updateMeasurement(u.unit_type_id, null, 'actual_value', e.target.value)}
                  style={{ width: 110, padding: 4 }}
                />
              </div>
            );
          })}
        </div>
      )}

      {perSetUnits.length > 0 && (
        <div>
          <strong style={{ fontSize: '0.9rem', color: '#444' }}>Sarjat (Sets):</strong>
          {activeSets.map((sIdx, displayOrder) => (
            <div
              key={sIdx}
              style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
                marginTop: '0.4rem',
                padding: '0.25rem 0',
                borderBottom: '1px dashed #e0e0e0',
              }}
            >
              <span style={{ width: 70, fontWeight: 600, fontSize: '0.85rem' }}>Sarja {displayOrder + 1}:</span>
              {perSetUnits.map((u) => {
                const label = u.unit_type?.unit_label || u.unit_type?.name || '';
                return (
                  <div key={u.unit_type_id} style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                    <input
                      type="number"
                      placeholder={`Suun. ${label}`}
                      value={getValue(u.unit_type_id, sIdx, 'planned_value')}
                      onChange={(e) => updateMeasurement(u.unit_type_id, sIdx, 'planned_value', e.target.value)}
                      style={{ width: 95, padding: 4 }}
                    />
                    <input
                      type="number"
                      placeholder={`Tot. ${label}`}
                      value={getValue(u.unit_type_id, sIdx, 'actual_value')}
                      onChange={(e) => updateMeasurement(u.unit_type_id, sIdx, 'actual_value', e.target.value)}
                      style={{ width: 95, padding: 4 }}
                    />
                  </div>
                );
              })}
              {activeSets.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSet(sIdx)}
                  style={{ color: '#d32f2f', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  Poista
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addSet}
            style={{ marginTop: '0.5rem', padding: '4px 8px', fontSize: '0.85rem', cursor: 'pointer' }}
          >
            + Lisää sarja
          </button>
        </div>
      )}
    </div>
  );
};
