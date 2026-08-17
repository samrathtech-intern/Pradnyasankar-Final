/**
 * Auth API service
 *
 * Backend APIs:
 * POST /api/auth/register
 * POST /api/auth/login
 * POST /api/auth/logout
 * POST /api/auth/forgot-password
 * POST /api/auth/reset-password
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8081";

export type AuthUser = {
  userId: string | number;
  firstName: string;
  lastName?: string | null;
  email: string;
  mobileNumber: string;
  role: string;
};

export type AuthResponse = {
  user: AuthUser;
  token: string;
};

async function request<T>(
  path: string,
  body: object,
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      data?.message ?? `Request failed: ${res.status}`
    );
  }

  return data as T;
}


// ==========================
// REGISTER
// ==========================

export async function apiRegister(
  firstName: string,
  email: string,
  mobileNumber: string,
  password: string
): Promise<AuthResponse> {
  return request<AuthResponse>(
    "/api/auth/register",
    {
      firstName,
      email,
      mobileNumber,
      password,
    }
  );
}


// ==========================
// LOGIN
// ==========================

export async function apiLogin(
  email: string,
  password: string
): Promise<AuthResponse> {
  return request<AuthResponse>(
    "/api/auth/login",
    {
      email,
      password,
    }
  );
}


// ==========================
// LOGOUT
// ==========================

export async function apiLogout(
  token: string
): Promise<void> {
  await request<void>(
    "/api/auth/logout",
    {},
    token
  );
}


// ==========================
// FORGOT PASSWORD
// ==========================

export async function forgotPassword(
  email: string
) {
  const response = await fetch(
    `${API_BASE}/api/auth/forgot-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    }
  );

  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      text || "Failed to generate reset token"
    );
  }

  return text;
}


// ==========================
// RESET PASSWORD
// ==========================

export async function resetPassword(
  token: string,
  newPassword: string
) {
  const response = await fetch(
    `${API_BASE}/api/auth/reset-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        token,
        newPassword,
      }),
    }
  );

  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      text || "Failed to reset password"
    );
  }

  return text;
}