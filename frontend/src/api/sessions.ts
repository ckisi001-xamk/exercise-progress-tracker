export interface WorkoutSessionItem {
  id: string;
  activity_type_id: string;
  sort_order: number;
  notes?: string | null;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  plan_id?: string | null;
  name?: string | null;
  session_at: string;
  status: 'planned' | 'completed' | 'cancelled';
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

export async function fetchSessions(filters?: SessionFilters): Promise<WorkoutSession[]> {
  const token = localStorage.getItem('access_token');
  const params = new URLSearchParams();

  if (filters?.status) params.append('status', filters.status);
  if (filters?.from_date) params.append('from_date', filters.from_date);
  if (filters?.to_date) params.append('to_date', filters.to_date);

  const url = `http://localhost:8000/sessions${params.toString() ? `?${params.toString()}` : ''}`;
  
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Sessioiden haku epäonnistui: ${res.status}`);
  }

  return res.json();
}
