import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://localhost:8080";

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get("authorization");

    if (!authorization) {
      return NextResponse.json(
        { message: "Authentication token is required." },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${BACKEND_URL}/api/orders/my-orders`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: authorization,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Orders API proxy error:", error);

    return NextResponse.json(
      { message: "Unable to connect to backend." },
      { status: 500 }
    );
  }
}