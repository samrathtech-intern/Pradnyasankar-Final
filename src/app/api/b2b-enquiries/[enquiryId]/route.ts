
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

type RouteContext = {
  params: {
    enquiryId: string;
  };
};

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
/* GET SINGLE ENQUIRY                                                         */
/* -------------------------------------------------------------------------- */

export async function GET(
  request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  try {
    const { enquiryId } = context.params;

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

    const response = await fetch(
      `${BACKEND_URL}/api/b2b-enquiries/${encodeURIComponent(
        enquiryId,
      )}`,
      {
        method: "GET",
        headers: getBackendHeaders(request),
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
        : "Failed to fetch B2B enquiry.";

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
/* UPDATE STATUS                                                              */
/* -------------------------------------------------------------------------- */

export async function PUT(
  request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  try {
    const { enquiryId } = context.params;

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

    const body = await request
      .json()
      .catch(() => null);

    const status = body?.status;

    if (!status) {
      return NextResponse.json(
        {
          message: "Status is required.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Spring controller:
     *
     * @PutMapping("/{enquiryId}/status")
     * @RequestParam EnquiryStatus status
     *
     * Therefore the backend URL MUST be:
     *
     * /api/b2b-enquiries/{id}/status?status=NEW
     */

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
        : "Failed to update B2B enquiry.";

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
/* DELETE ENQUIRY                                                             */
/* -------------------------------------------------------------------------- */

export async function DELETE(
  request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  try {
    const { enquiryId } = context.params;

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

    const response = await fetch(
      `${BACKEND_URL}/api/b2b-enquiries/${encodeURIComponent(
        enquiryId,
      )}`,
      {
        method: "DELETE",
        headers: getBackendHeaders(request),
        cache: "no-store",
      },
    );

    const data = await parseBackendResponse(response);

    if (typeof data === "string") {
      return new NextResponse(data, {
        status: response.status,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

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
        : "Failed to delete B2B enquiry.";

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

// const BACKEND_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL ??
//   "http://localhost:8080";

// type RouteContext = {
//   params: Promise<{
//     enquiryId: string;
//   }>;
// };

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
// /* GET SINGLE ENQUIRY                                                         */
// /* -------------------------------------------------------------------------- */

// export async function GET(
//   request: NextRequest,
//   context: RouteContext,
// ) {
//   try {
//     const { enquiryId } = await context.params;

//     const response = await fetch(
//       `${BACKEND_URL}/api/b2b-enquiries/${encodeURIComponent(
//         enquiryId,
//       )}`,
//       {
//         method: "GET",
//         headers: getBackendHeaders(request),
//         cache: "no-store",
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
//         : "Failed to fetch B2B enquiry.";

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
// /* UPDATE STATUS                                                              */
// /* -------------------------------------------------------------------------- */

// export async function PUT(
//   request: NextRequest,
//   context: RouteContext,
// ) {
//   try {
//     const { enquiryId } = await context.params;

//     const body = await request
//       .json()
//       .catch(() => ({}));

//     const status = body?.status;

//     if (!status) {
//       return NextResponse.json(
//         {
//           message: "Status is required.",
//         },
//         { status: 400 },
//       );
//     }

//     const url =
//       `${BACKEND_URL}/api/b2b-enquiries/` +
//       `${encodeURIComponent(enquiryId)}/status` +
//       `?status=${encodeURIComponent(status)}`;

//     const response = await fetch(url, {
//       method: "PUT",
//       headers: {
//         ...getBackendHeaders(request),
//         "Content-Type": "application/json",
//       },
//       cache: "no-store",
//     });

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
//         : "Failed to update B2B enquiry.";

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
// /* DELETE ENQUIRY                                                             */
// /* -------------------------------------------------------------------------- */

// export async function DELETE(
//   request: NextRequest,
//   context: RouteContext,
// ) {
//   try {
//     const { enquiryId } = await context.params;

//     const response = await fetch(
//       `${BACKEND_URL}/api/b2b-enquiries/${encodeURIComponent(
//         enquiryId,
//       )}`,
//       {
//         method: "DELETE",
//         headers: getBackendHeaders(request),
//         cache: "no-store",
//       },
//     );

//     const contentType =
//       response.headers.get("content-type") ?? "";

//     const data = contentType.includes(
//       "application/json",
//     )
//       ? await response.json().catch(() => ({}))
//       : await response.text().catch(() => "");

//     if (
//       typeof data === "string" &&
//       data
//     ) {
//       return new NextResponse(data, {
//         status: response.status,
//         headers: {
//           "Content-Type":
//             "text/plain; charset=utf-8",
//         },
//       });
//     }

//     return NextResponse.json(data, {
//       status: response.status,
//     });
//   } catch (error) {
//     const message =
//       error instanceof Error
//         ? error.message
//         : "Failed to delete B2B enquiry.";

//     return NextResponse.json(
//       {
//         error: "Internal Server Error",
//         message,
//       },
//       { status: 500 },
//     );
//   }
// }