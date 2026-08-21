import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://localhost:8080";

export async function POST(request: NextRequest) {
  try {
    console.log("==============================================");
    console.log("CONTACT PROXY: POST /api/customer/support/enquiries");
    console.log("CONTACT PROXY: BACKEND_URL =", BACKEND_URL);

    // ============================================================
    // 1. CHECK BACKEND URL
    // ============================================================

    if (!BACKEND_URL) {
      console.error(
        "CONTACT PROXY: BACKEND_URL is not configured"
      );

      return NextResponse.json(
        {
          message: "Backend URL is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    // ============================================================
    // 2. GET AUTHORIZATION HEADER
    // ============================================================

    const authorization =
      request.headers.get("authorization");

    console.log(
      "CONTACT PROXY: Authorization exists:",
      !!authorization
    );

    if (authorization) {
      console.log(
        "CONTACT PROXY: Authorization starts with Bearer:",
        authorization.startsWith("Bearer ")
      );
    }

    if (!authorization) {
      console.error(
        "CONTACT PROXY: No Authorization header received from frontend"
      );

      return NextResponse.json(
        {
          message:
            "Authorization token is missing.",
        },
        {
          status: 401,
        }
      );
    }

    // ============================================================
    // 3. READ FRONTEND MULTIPART FORM DATA
    // ============================================================

    const incomingFormData =
      await request.formData();

    console.log(
      "CONTACT PROXY: Incoming form data received"
    );

    const data =
      incomingFormData.get("data");

    if (!(data instanceof Blob)) {
      console.error(
        "CONTACT PROXY: Missing 'data' multipart part"
      );

      return NextResponse.json(
        {
          message:
            "Missing enquiry data.",
        },
        {
          status: 400,
        }
      );
    }

    // ============================================================
    // 4. CREATE NEW FORM DATA FOR SPRING BOOT
    // ============================================================

    const backendFormData =
      new FormData();

    backendFormData.append(
      "data",
      data,
      "data.json"
    );

    console.log(
      "CONTACT PROXY: 'data' part added"
    );

    // ============================================================
    // 5. OPTIONAL IMAGE
    // ============================================================

    const image =
      incomingFormData.get("image");

    if (
      image instanceof File &&
      image.size > 0
    ) {
      backendFormData.append(
        "image",
        image,
        image.name
      );

      console.log(
        "CONTACT PROXY: Image attached:",
        image.name,
        image.size,
        "bytes"
      );
    } else {
      console.log(
        "CONTACT PROXY: No image attached"
      );
    }

    // ============================================================
    // 6. FORWARD REQUEST TO SPRING BOOT
    // ============================================================

    const backendUrl =
      `${BACKEND_URL}/api/customer/support/enquiries`;

    console.log(
      "CONTACT PROXY: Calling backend:",
      backendUrl
    );

    const backendResponse =
      await fetch(
        backendUrl,
        {
          method: "POST",

          headers: {
            // IMPORTANT:
            // Do NOT manually set Content-Type.
            // fetch() will generate the multipart
            // boundary automatically.
            Authorization: authorization,
          },

          body: backendFormData,

          cache: "no-store",
        }
      );

    // ============================================================
    // 7. READ SPRING BOOT RESPONSE
    // ============================================================

    const contentType =
      backendResponse.headers.get(
        "content-type"
      ) || "";

    let body: unknown;

    if (
      contentType.includes(
        "application/json"
      )
    ) {
      body =
        await backendResponse.json();
    } else {
      body =
        await backendResponse.text();
    }

    console.log(
      "CONTACT PROXY: Backend status:",
      backendResponse.status
    );

    console.log(
      "CONTACT PROXY: Backend response:",
      body
    );

    // ============================================================
    // 8. BACKEND ERROR
    // ============================================================

    if (!backendResponse.ok) {
      console.error(
        "CONTACT PROXY: Backend request failed:",
        backendResponse.status
      );

      if (
        typeof body === "object" &&
        body !== null
      ) {
        return NextResponse.json(
          body,
          {
            status:
              backendResponse.status,
          }
        );
      }

      return NextResponse.json(
        {
          message:
            typeof body === "string" &&
            body.trim()
              ? body
              : "Unable to submit enquiry.",
        },
        {
          status:
            backendResponse.status,
        }
      );
    }

    // ============================================================
    // 9. SUCCESS
    // ============================================================

    console.log(
      "CONTACT PROXY: Enquiry submitted successfully"
    );

    console.log("==============================================");

    if (
      typeof body === "object" &&
      body !== null
    ) {
      return NextResponse.json(
        body,
        {
          status:
            backendResponse.status,
        }
      );
    }

    return NextResponse.json(
      {
        message: body,
      },
      {
        status:
          backendResponse.status,
      }
    );
  } catch (error) {
    console.error(
      "=============================================="
    );

    console.error(
      "CONTACT PROXY ERROR:",
      error
    );

    console.error(
      "=============================================="
    );

    return NextResponse.json(
      {
        message:
          "Unable to connect to the support server.",
      },
      {
        status: 502,
      }
    );
  }
}