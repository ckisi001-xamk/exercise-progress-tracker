export interface CalendarSessionItem {
  id: string;
  activity_type_id: string;
  sort_order: number;
  notes?: string | null;
}

export interface CalendarSession {
  id: string;
  user_id: string;
  plan_id?: string | null;
  name?: string | null;
  session_at: string;
  status: string;
  intensity?: number | null;
  notes?: string | null;
  items: CalendarSessionItem[];
}

const API_BASE = 'http://localhost:8000';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token') || localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchCalendarSessions(from: string, to: string, planId?: string): Promise<CalendarSession[]> {
  const params = new URLSearchParams({ from, to });
  if (planId) {
    params.append('plan_id', planId);
  }

  const res = await fetch(`${API_BASE}/calendar?${params.toString()}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Kalenterin haku epäonnistui: ${res.status}`);
  }

  return res.json();
}
