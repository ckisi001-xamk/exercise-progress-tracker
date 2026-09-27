const API_BASE = "http://localhost:8000";

export interface RegisterPayload {
  email: string;
  password: string;
  display_name: string;
}

export interface UserResponse {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
}

export async function registerApi(data: RegisterPayload): Promise<UserResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: "Rekisteröinti epäonnistui" }));
    throw new Error(errorData.detail || `Virhe pyynnössä: ${res.status}`);
  }

  return res.json();
}
