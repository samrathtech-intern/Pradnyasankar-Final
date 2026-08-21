

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

function getBackendHeaders(request: NextRequest): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  const authorization = request.headers.get("authorization");

  if (authorization) {
    headers.Authorization = authorization;
  }

  return headers;
}

async function parseBackendResponse(response: Response): Promise<unknown> {
  const contentType =
    response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json().catch(() => null);
  }

  const text = await response.text().catch(() => "");

  return text || null;
}

/* -------------------------------------------------------------------------- */
/* GET ALL B2B ENQUIRIES                                                      */
/* -------------------------------------------------------------------------- */

export async function GET(
  request: NextRequest,
): Promise<NextResponse> {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/b2b-enquiries`,
      {
        method: "GET",
        headers: getBackendHeaders(request),
        cache: "no-store",
      },
    );

    const data = await parseBackendResponse(response);

    if (!response.ok) {
      return NextResponse.json(
        data ?? {
          message: `Backend request failed: ${response.status}`,
        },
        {
          status: response.status,
        },
      );
    }

    return NextResponse.json(
      Array.isArray(data) ? data : [],
      {
        status: 200,
      },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch B2B enquiries.";

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message,
      },
      {
        status: 500,
      },
    );
  }
}

/* -------------------------------------------------------------------------- */
/* CREATE B2B ENQUIRY                                                         */
/* -------------------------------------------------------------------------- */

export async function POST(
  request: NextRequest,
): Promise<NextResponse> {
  try {
    const body = await request
      .json()
      .catch(() => null);

    if (!body) {
      return NextResponse.json(
        {
          message: "Request body is required.",
        },
        {
          status: 400,
        },
      );
    }

    const response = await fetch(
      `${BACKEND_URL}/api/b2b-enquiries`,
      {
        method: "POST",
        headers: {
          ...getBackendHeaders(request),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      },
    );

    const data = await parseBackendResponse(response);

    return NextResponse.json(
      data ?? {},
      {
        status: response.status,
      },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create B2B enquiry.";

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message,
      },
      {
        status: 500,
      },
    );
  }
}

// import { NextRequest, NextResponse } from "next/server";

// /**
//  * B2B enquiry proxy.
//  *
//  * Browser:
//  *   /api/b2b-enquiries
//  *
//  * Backend:
//  *   ${NEXT_PUBLIC_API_BASE_URL}/api/b2b-enquiries
//  */

// const BACKEND_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL ??
//   "http://localhost:8080";

// function getBackendHeaders(request: NextRequest) {
//   const headers: Record<string, string> = {
//     Accept: "application/json",
//   };

//   const authorization =
//     request.headers.get("authorization");

//   if (authorization) {
//     headers.Authorization = authorization;
//   }

//   return headers;
// }

// /* -------------------------------------------------------------------------- */
// /* GET ALL B2B ENQUIRIES                                                      */
// /* -------------------------------------------------------------------------- */

// export async function GET(request: NextRequest) {
//   try {
//     const response = await fetch(
//       `${BACKEND_URL}/api/b2b-enquiries`,
//       {
//         method: "GET",
//         headers: getBackendHeaders(request),
//         cache: "no-store",
//       },
//     );

//     const contentType =
//       response.headers.get("content-type") ?? "";

//     const data = contentType.includes(
//       "application/json",
//     )
//       ? await response.json().catch(() => [])
//       : await response.text().catch(() => "");

//     return NextResponse.json(data, {
//       status: response.status,
//     });
//   } catch (error) {
//     const message =
//       error instanceof Error
//         ? error.message
//         : "Failed to fetch B2B enquiries.";

//     return NextResponse.json(
//       {
//         error: "Internal Server Error",
//         message,
//       },
//       { status: 500 },
//     );
//   }
// }

// /* -------------------------------------------------------------------------- */
// /* CREATE B2B ENQUIRY                                                         */
// /* -------------------------------------------------------------------------- */

// export async function POST(
//   request: NextRequest,
// ) {
//   try {
//     const body = await request
//       .json()
//       .catch(() => ({}));

//     const response = await fetch(
//       `${BACKEND_URL}/api/b2b-enquiries`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         body: JSON.stringify(body),
//       },
//     );

//     const data = await response
//       .json()
//       .catch(() => ({}));

//     return NextResponse.json(data, {
//       status: response.status,
//     });
//   } catch (error) {
//     const message =
//       error instanceof Error
//         ? error.message
//         : "Failed to forward enquiry.";

//     return NextResponse.json(
//       {
//         error: "Internal Server Error",
//         message,
//       },
//       { status: 500 },
//     );
//   }
// }

// import { NextRequest, NextResponse } from "next/server";

// /**
//  * B2B enquiry proxy route.
//  *
//  * The browser calls the same-origin endpoint `/api/b2b-enquiries` and this
//  * route forwards the request server-to-server to the backend at
//  * `NEXT_PUBLIC_API_BASE_URL` (default http://localhost:8080).
//  *
//  * This avoids CORS restrictions — the backend does not allow cross-origin
//  * browser requests from http://localhost:3000 (its preflight returns 403).
//  */

// const BACKEND_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json().catch(() => ({}));

//     const res = await fetch(`${BACKEND_URL}/api/b2b-enquiries`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//       body: JSON.stringify(body),
//     });

//     const data = await res.json().catch(() => ({}));

//     return NextResponse.json(data, { status: res.status });
//   } catch (error) {
//     const message =
//       error instanceof Error ? error.message : "Failed to forward enquiry";

//     return NextResponse.json(
//       { error: "Internal Server Error", message },
//       { status: 500 }
//     );
//   }
// }

