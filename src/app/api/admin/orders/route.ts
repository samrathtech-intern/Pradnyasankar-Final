import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8080";

export async function GET(request: NextRequest) {
  try {
    const backendUrl = new URL(
      "/api/admin/orders",
      BACKEND_URL,
    );

    request.nextUrl.searchParams.forEach((value, key) => {
      backendUrl.searchParams.set(key, value);
    });

    const authorization =
      request.headers.get("authorization");

    console.log(
      "ADMIN ORDERS PROXY: authorization:",
      authorization ? "EXISTS" : "MISSING",
    );

    const response = await fetch(
      backendUrl.toString(),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",

          ...(authorization
            ? {
                Authorization: authorization,
              }
            : {}),
        },
        cache: "no-store",
      },
    );

    const data = await response
      .json()
      .catch(() => ({}));

    console.log(
      "ADMIN ORDERS PROXY: backend status:",
      response.status,
    );

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error(
      "ADMIN ORDERS PROXY ERROR:",
      error,
    );

    return NextResponse.json(
      {
        message:
          "Could not connect to the backend.",
      },
      {
        status: 500,
      },
    );
  }
}