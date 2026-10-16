export interface UnitType {
  id: string;
  name: string;
  slug: string;
  unit_label?: string | null;
  is_system: boolean;
}

export interface UnitLink {
  id: string;
  unit_type_id: string;
  sort_order: number;
  is_required: boolean;
  per_set: boolean;
  unit_type: UnitType;
}

export interface ActivityType {
  id: string;
  name: string;
  slug: string;
  is_system: boolean;
  unit_links: UnitLink[];
}

export interface MeasurementWrite {
  unit_type_id: string;
  planned_value: number | null;
  actual_value: number | null;
  set_index?: number | null;
}

export interface SessionItemWrite {
  activity_type_id: string;
  sort_order: number;
  notes?: string | null;
  measurements: MeasurementWrite[];
}

export interface SessionWrite {
  name: string;
  session_at: string | null;
  status: 'planned' | 'in_progress' | 'completed';
  intensity: number | null;
  notes?: string | null;
  plan_id?: string | null;
  items: SessionItemWrite[];
}

export interface WorkoutSessionItem {
  id: string;
  activity_type_id: string;
  sort_order: number;
  notes?: string | null;
  measurements?: Array<{
    id: string;
    unit_type_id: string;
    planned_value: number | null;
    actual_value: number | null;
    set_index: number | null;
  }>;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  plan_id?: string | null;
  name: string;
  session_at: string | null;
  status: 'planned' | 'in_progress' | 'completed';
  intensity?: number | null;
  notes?: string | null;
  items?: WorkoutSessionItem[];
  created_at: string;
}

export interface SessionFilters {
  status?: string;
  from_date?: string;
  to_date?: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
};

export async function fetchSessions(filters?: SessionFilters): Promise<WorkoutSession[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.from_date) params.append('from_date', filters.from_date);
  if (filters?.to_date) params.append('to_date', filters.to_date);

  const url = `http://localhost:8000/sessions${params.toString() ? `?${params.toString()}` : ''}`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Sessioiden haku epäonnistui: ${res.status}`);
  return res.json();
}

export async function fetchActivityTypes(): Promise<ActivityType[]> {
  const res = await fetch('http://localhost:8000/activity-types', { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Lajityyppien haku epäonnistui: ${res.status}`);
  return res.json();
}

export async function fetchSession(id: string): Promise<WorkoutSession> {
  const res = await fetch(`http://localhost:8000/sessions/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Session haku epäonnistui: ${res.status}`);
  return res.json();
}

export async function createSession(data: SessionWrite): Promise<WorkoutSession> {
  const res = await fetch('http://localhost:8000/sessions', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.detail || `Tallennus epäonnistui: ${res.status}`);
  }
  return res.json();
}

export async function updateSession(id: string, data: SessionWrite): Promise<WorkoutSession> {
  const res = await fetch(`http://localhost:8000/sessions/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.detail || `Päivitys epäonnistui: ${res.status}`);
  }
  return res.json();
}
