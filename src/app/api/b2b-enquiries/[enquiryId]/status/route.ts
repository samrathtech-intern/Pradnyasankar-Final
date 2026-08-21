import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8080";

type RouteContext = {
  params: Promise<{
    enquiryId: string;
  }>;
};

function getBackendHeaders(request: NextRequest) {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  const authorization =
    request.headers.get("authorization");

  if (authorization) {
    headers.Authorization = authorization;
  }

  return headers;
}

/* -------------------------------------------------------------------------- */
/* UPDATE B2B ENQUIRY STATUS                                                  */
/*                                                                            */
/* Browser:                                                                   */
/* PUT /api/b2b-enquiries/{enquiryId}/status?status=NEW                       */
/*                                                                            */
/* Backend:                                                                   */
/* PUT /api/b2b-enquiries/{enquiryId}/status?status=NEW                       */
/* -------------------------------------------------------------------------- */

export async function PUT(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { enquiryId } = await context.params;

    if (!enquiryId) {
      return NextResponse.json(
        {
          message: "B2B enquiry ID is required.",
        },
        { status: 400 },
      );
    }

    const status =
      request.nextUrl.searchParams.get("status");

    if (!status) {
      return NextResponse.json(
        {
          message: "Status is required.",
        },
        { status: 400 },
      );
    }

    const backendUrl =
      `${BACKEND_URL}/api/b2b-enquiries/` +
      `${encodeURIComponent(enquiryId)}/status` +
      `?status=${encodeURIComponent(status)}`;

    const response = await fetch(
      backendUrl,
      {
        method: "PUT",
        headers: {
          ...getBackendHeaders(request),
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    const contentType =
      response.headers.get("content-type") ?? "";

    const data = contentType.includes(
      "application/json",
    )
      ? await response.json().catch(() => ({}))
      : await response.text().catch(() => "");

    if (typeof data === "string") {
      return new NextResponse(data, {
        status: response.status,
        headers: {
          "Content-Type":
            "text/plain; charset=utf-8",
        },
      });
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update B2B enquiry status.";

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message,
      },
      { status: 500 },
    );
  }
}