const API_BASE = "http://localhost:8000";

export type RegisterPayload = {
  email: string;
  password: string;
  display_name: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type UserResponse = {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
};

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

export async function loginApi(data: LoginPayload): Promise<TokenResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: "Kirjautuminen epäonnistui" }));
    throw new Error(errorData.detail || `Virhe pyynnössä: ${res.status}`);
  }

  return res.json();
}

export async function getMeApi(token: string): Promise<UserResponse> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Istunto vanhentunut tai virheellinen");
  }

  return res.json();
}
