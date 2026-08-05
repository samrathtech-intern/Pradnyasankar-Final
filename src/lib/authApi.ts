/**
 * Auth API service
 *
 * Integration points for the backend team:
 * - // POST /api/auth/register
// {
//   firstName,
//   lastName,
//   email,
//   mobileNumber,
//   password
// }
 * - POST /api/auth/login     — { email, password }       → { user, token }
 * - POST /api/auth/logout    — (bearer token in header)  → 200 OK
 *
 * Set NEXT_PUBLIC_API_BASE_URL in .env.local to point to the backend.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

console.log("API_BASE =", API_BASE);

export type AuthUser = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  role: string;
};


export type AuthResponse = {
  token: string;
  message: string;
  user: AuthUser;
};

async function request<T>(path: string, body: object, token?: string): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message ?? `Request failed: ${res.status}`);
  }

  return data as T;
}

export async function apiRegister(
  firstName: string,
  lastName: string,
  email: string,
  mobileNumber: string,
  password: string
): Promise<AuthResponse> {

  return request<AuthResponse>(
    "/api/auth/register",
    {
      firstName,
      lastName,
      email,
      mobileNumber,
      password,
    }
  );
}

export async function apiLogin(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/login", { email, password });
}

export async function apiLogout(token: string): Promise<void> {
  await request<void>("/api/auth/logout", {}, token);
}

