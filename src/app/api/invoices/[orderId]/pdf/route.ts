import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8080";

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = params;

  console.log("");
  console.log("==============================================");
  console.log("          NEXT.JS INVOICE PROXY");
  console.log("==============================================");

  console.log("ORDER ID:", orderId);

  // Get Authorization header from browser request
  const authorization =
    request.headers.get("authorization");

  console.log(
    "AUTHORIZATION HEADER EXISTS:",
    !!authorization
  );

  console.log(
    "AUTHORIZATION HEADER LENGTH:",
    authorization?.length ?? 0
  );

  console.log(
    "AUTHORIZATION STARTS BEARER:",
    authorization?.startsWith("Bearer ") ?? false
  );

  console.log(
    "BACKEND URL:",
    `${BACKEND_URL}/api/invoices/order/${orderId}/pdf`
  );

  console.log("==============================================");

  // ----------------------------------------------------------
  // NO TOKEN
  // ----------------------------------------------------------

  if (!authorization) {
    console.error(
      "❌ NEXT.JS PROXY: AUTHORIZATION HEADER MISSING"
    );

    return NextResponse.json(
      {
        message: "Authorization header missing",
        source: "nextjs-invoice-proxy",
      },
      {
        status: 401,
      }
    );
  }

  try {

    // --------------------------------------------------------
    // FORWARD REQUEST TO SPRING BOOT
    // --------------------------------------------------------

    console.log(
      "➡️ Forwarding request to Spring Boot..."
    );

    const backendResponse = await fetch(
      `${BACKEND_URL}/api/invoices/order/${orderId}/pdf`,
      {
        method: "GET",

        headers: {
          Authorization: authorization,
          Accept: "application/pdf",
        },

        cache: "no-store",
      }
    );

    console.log(
      "⬅️ BACKEND STATUS:",
      backendResponse.status
    );

    console.log(
      "⬅️ BACKEND CONTENT TYPE:",
      backendResponse.headers.get("content-type")
    );

    // --------------------------------------------------------
    // BACKEND ERROR
    // --------------------------------------------------------

    if (!backendResponse.ok) {

      const errorText =
        await backendResponse.text();

      console.error(
        "❌ BACKEND ERROR STATUS:",
        backendResponse.status
      );

      console.error(
        "❌ BACKEND ERROR BODY:",
        errorText
      );

      return NextResponse.json(
        {
          message: "Backend returned an error",
          status: backendResponse.status,
          error: errorText,
        },
        {
          status: backendResponse.status,
        }
      );
    }

    // --------------------------------------------------------
    // PDF SUCCESS
    // --------------------------------------------------------

    console.log(
      "✅ BACKEND PDF SUCCESS"
    );

    const pdf =
      await backendResponse.arrayBuffer();

    console.log(
      "PDF SIZE:",
      pdf.byteLength,
      "bytes"
    );

    const contentDisposition =
      backendResponse.headers.get(
        "Content-Disposition"
      );

    return new NextResponse(pdf, {
      status: 200,

      headers: {
        "Content-Type":
          "application/pdf",

        "Content-Disposition":
          contentDisposition ??
          `attachment; filename="invoice-${orderId}.pdf"`,

        "Content-Length":
          pdf.byteLength.toString(),
      },
    });

  } catch (error) {

    console.error(
      "❌ NEXT.JS INVOICE PROXY ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Invoice proxy failed",
      },
      {
        status: 500,
      }
    );
  }
}