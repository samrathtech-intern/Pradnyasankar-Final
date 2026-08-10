/**
 * Admin API service
 *
 * Integration points for the backend team:
 * - POST /api/admin/auth/login        — { email, password } → { token }
 * - GET  /api/admin/orders            — query: ?status=&search=&page=&limit= → { orders, total }
 * - PATCH /api/admin/orders/:id       — { status } → updated Order
 * - GET  /api/admin/analytics/summary — → { totalOrders, totalRevenue, pendingOrders, deliveredOrders }
 *
 * Set NEXT_PUBLIC_API_BASE_URL in .env.local to point to the backend.
 */

import type { Order, OrderStatus } from "./orders";

// The browser calls the same-origin Next.js rewrite path (`/api/admin/...`),
// which forwards the request server-to-server to the backend at
// NEXT_PUBLIC_API_BASE_URL. This avoids CORS blocking.
const API_BASE = "";
const ADMIN_TOKEN_KEY = "ps_admin_token";

export function getAdminToken(): string | null {
  try { return localStorage.getItem(ADMIN_TOKEN_KEY); } catch { return null; }
}

export function setAdminToken(token: string): void {
  try { localStorage.setItem(ADMIN_TOKEN_KEY, token); } catch {}
}

export function clearAdminToken(): void {
  try { localStorage.removeItem(ADMIN_TOKEN_KEY); } catch {}
}

async function adminRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error(data?.message ?? `Request failed: ${res.status}`);

  return data as T;
}

export type AdminLoginResponse = { token: string };

export async function adminLogin(email: string, password: string): Promise<AdminLoginResponse> {
  return adminRequest<AdminLoginResponse>("/api/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export type AdminOrdersResponse = { orders: Order[]; total: number };

export async function fetchAdminOrders(params: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<AdminOrdersResponse> {
  const q = new URLSearchParams();
  if (params.status && params.status !== "All") q.set("status", params.status);
  if (params.search) q.set("search", params.search);
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  return adminRequest<AdminOrdersResponse>(`/api/admin/orders?${q.toString()}`);
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
  return adminRequest<Order>(`/api/admin/orders/${orderId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export type AnalyticsSummary = {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  deliveredOrders: number;
};

export async function fetchAnalyticsSummary(): Promise<AnalyticsSummary> {
  return adminRequest<AnalyticsSummary>("/api/admin/analytics/summary");
}
