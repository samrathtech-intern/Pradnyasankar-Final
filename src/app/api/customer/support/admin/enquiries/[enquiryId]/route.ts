import {
  NextRequest,
  NextResponse,
} from "next/server";

const BACKEND_URL = "http://localhost:8080";

type RouteContext = {
  params: Promise<{
    enquiryId: string;
  }>;
};

export async function PUT(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const authorization =
      request.headers.get("authorization");

    if (!authorization) {
      return NextResponse.json(
        {
          message: "Authorization token is missing.",
        },
        {
          status: 401,
        },
      );
    }

    const { enquiryId } = await context.params;

    if (!enquiryId) {
      return NextResponse.json(
        {
          message: "Enquiry ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const body = await request.json();

    const backendResponse = await fetch(
      `${BACKEND_URL}/api/customer/support/admin/enquiries/${encodeURIComponent(
        enquiryId,
      )}`,
      {
        method: "PUT",
        headers: {
          Authorization: authorization,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      },
    );

    const contentType =
      backendResponse.headers.get("content-type") ?? "";

    let responseBody: unknown;

    if (contentType.includes("application/json")) {
      responseBody =
        await backendResponse.json().catch(() => null);
    } else {
      responseBody =
        await backendResponse.text().catch(() => "");
    }

    if (!backendResponse.ok) {
      if (
        typeof responseBody === "object" &&
        responseBody !== null
      ) {
        return NextResponse.json(responseBody, {
          status: backendResponse.status,
        });
      }

      return NextResponse.json(
        {
          message:
            typeof responseBody === "string" &&
            responseBody.trim()
              ? responseBody
              : "Unable to update enquiry.",
        },
        {
          status: backendResponse.status,
        },
      );
    }

    if (
      typeof responseBody === "object" &&
      responseBody !== null
    ) {
      return NextResponse.json(responseBody, {
        status: backendResponse.status,
      });
    }

    return NextResponse.json(
      {
        message: responseBody,
      },
      {
        status: backendResponse.status,
      },
    );
  } catch (error) {
    console.error(
      "Customer support admin PUT proxy error:",
      error,
    );

    return NextResponse.json(
      {
        message:
          "Unable to connect to the support server.",
      },
      {
        status: 502,
      },
    );
  }
}