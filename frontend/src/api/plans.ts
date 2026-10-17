export interface PlanSessionItem {
  id: string;
  name: string;
  session_at?: string | null;
  status: string;
  plan_id?: string | null;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  notes?: string | null;
  start_date?: string | null;
  length_weeks?: number | null;
  created_at: string;
  updated_at: string;
  sessions: PlanSessionItem[];
}

const API_BASE = "http://localhost:8000";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token") || localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchPlans(): Promise<WorkoutPlan[]> {
  const res = await fetch(`${API_BASE}/plans`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Suunnitelmien haku epäonnistui: ${res.status}`);
  }
  return res.json();
}

export async function fetchPlan(id: string): Promise<WorkoutPlan> {
  const res = await fetch(`${API_BASE}/plans/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Suunnitelman haku epäonnistui: ${res.status}`);
  }
  return res.json();
}
