import { NextRequest, NextResponse } from "next/server";

/**
 * B2B enquiry proxy route.
 *
 * The browser calls the same-origin endpoint `/api/b2b-enquiries` and this
 * route forwards the request server-to-server to the backend at
 * `NEXT_PUBLIC_API_BASE_URL` (default http://localhost:8080).
 *
 * This avoids CORS restrictions — the backend does not allow cross-origin
 * browser requests from http://localhost:3000 (its preflight returns 403).
 */

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    const res = await fetch(`${BACKEND_URL}/api/b2b-enquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to forward enquiry";

    return NextResponse.json(
      { error: "Internal Server Error", message },
      { status: 500 }
    );
  }
}

