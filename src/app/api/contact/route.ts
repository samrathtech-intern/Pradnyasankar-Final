import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(request: NextRequest) {
  try {
    if (!BACKEND_URL) {
      console.error("BACKEND_URL is not configured");

      return NextResponse.json(
        {
          message: "Backend URL is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    // ------------------------------------------------------------
    // Read incoming multipart/form-data
    // ------------------------------------------------------------

    const incomingFormData = await request.formData();

    const backendFormData = new FormData();

    // ------------------------------------------------------------
    // Get JSON request part
    //
    // IMPORTANT:
    // Frontend sends "data"
    // Backend expects @RequestPart("data")
    // ------------------------------------------------------------

    const dataPart = incomingFormData.get("data");

    if (!(dataPart instanceof Blob)) {
      return NextResponse.json(
        {
          message: "Missing data part.",
        },
        {
          status: 400,
        }
      );
    }

    backendFormData.append(
      "data",
      dataPart,
      "data.json"
    );

    // ------------------------------------------------------------
    // Optional image
    // ------------------------------------------------------------

    const image = incomingFormData.get("image");

    if (image instanceof File && image.size > 0) {
      backendFormData.append(
        "image",
        image,
        image.name
      );
    }

    // ------------------------------------------------------------
    // Forward authentication
    // ------------------------------------------------------------

    const headers = new Headers();

    const authorization =
      request.headers.get("authorization");

    if (authorization) {
      headers.set(
        "Authorization",
        authorization
      );
    }

    const cookie =
      request.headers.get("cookie");

    if (cookie) {
      headers.set(
        "Cookie",
        cookie
      );
    }

    // ------------------------------------------------------------
    // Send request to Spring Boot
    // ------------------------------------------------------------

    const backendResponse = await fetch(
      `${BACKEND_URL}/api/customer/support/enquiries`,
      {
        method: "POST",

        headers,

        body: backendFormData,

        cache: "no-store",
      }
    );

    // ------------------------------------------------------------
    // Read backend response
    // ------------------------------------------------------------

    const contentType =
      backendResponse.headers.get(
        "content-type"
      ) || "";

    let responseBody: unknown;

    if (
      contentType.includes(
        "application/json"
      )
    ) {
      responseBody =
        await backendResponse.json();
    } else {
      responseBody =
        await backendResponse.text();
    }

    // ------------------------------------------------------------
    // Backend error
    // ------------------------------------------------------------

    if (!backendResponse.ok) {
      console.error(
        "Customer support backend error:",
        backendResponse.status,
        responseBody
      );

      let message =
        "Unable to submit enquiry.";

      if (
        typeof responseBody === "object" &&
        responseBody !== null &&
        "message" in responseBody
      ) {
        message = String(
          (
            responseBody as {
              message?: unknown;
            }
          ).message ??
            message
        );
      } else if (
        typeof responseBody === "string" &&
        responseBody.trim()
      ) {
        message = responseBody;
      }

      return NextResponse.json(
        {
          message,
        },
        {
          status:
            backendResponse.status,
        }
      );
    }

    // ------------------------------------------------------------
    // Success
    // ------------------------------------------------------------

    return NextResponse.json(
      responseBody,
      {
        status: backendResponse.status,
      }
    );
  } catch (error) {
    console.error(
      "Contact proxy error:",
      error
    );

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to connect to the support server.",
      },
      {
        status: 502,
      }
    );
  }
}