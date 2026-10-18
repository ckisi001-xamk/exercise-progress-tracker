const API_BASE = "http://localhost:8000";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token") || localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export interface Goal {
  id: string;
  user_id: string;
  unit_type_id: string;
  activity_type_id?: string | null;
  target_value: number;
  period: "week" | "month";
  active: boolean;
  created_at: string;
}

export interface GoalCreatePayload {
  unit_type_id: string;
  target_value: number;
  period: "week" | "month";
  active?: boolean;
}

export async function fetchGoals(): Promise<Goal[]> {
  const res = await fetch(`${API_BASE}/goals/`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Tavoitteiden haku epäonnistui: ${res.status}`);
  }
  return res.json();
}

export async function createGoal(data: GoalCreatePayload): Promise<Goal> {
  const res = await fetch(`${API_BASE}/goals/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Tavoitteen luonti epäonnistui: ${res.status}`);
  }
  return res.json();
}
