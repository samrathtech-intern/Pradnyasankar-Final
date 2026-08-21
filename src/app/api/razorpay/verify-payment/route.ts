import {
  NextRequest,
  NextResponse,
} from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8080";

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const authorization =
      request.headers.get(
        "authorization"
      );

    console.log(
      "========================================"
    );

    console.log(
      "RAZORPAY VERIFY PAYMENT PROXY"
    );

    console.log(
      "========================================"
    );

    console.log(
      "Authorization present:",
      !!authorization
    );

    console.log(
      "Backend URL:",
      BACKEND_URL
    );

    console.log(
      "Request body:",
      body
    );

    if (!authorization) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Authorization token is required",
        },
        {
          status: 401,
        }
      );
    }

    const backendResponse =
      await fetch(
        `${BACKEND_URL}/api/razorpay/verify-payment`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",

            Authorization:
              authorization,
          },

          body: JSON.stringify(body),

          cache: "no-store",
        }
      );

    const responseText =
      await backendResponse.text();

    let data: unknown = {};

    try {
      data = responseText
        ? JSON.parse(responseText)
        : {};
    } catch {
      data = {
        success: false,
        message: responseText,
      };
    }

    console.log(
      "Spring Boot status:",
      backendResponse.status
    );

    console.log(
      "Spring Boot response:",
      data
    );

    return NextResponse.json(
      data,
      {
        status:
          backendResponse.status,
      }
    );

  } catch (error) {
    console.error(
      "Razorpay verification proxy error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to verify Razorpay payment",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message:
        "Method Not Allowed. Use POST.",
    },
    {
      status: 405,
    }
  );
}