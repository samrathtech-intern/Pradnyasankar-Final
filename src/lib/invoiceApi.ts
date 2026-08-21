/**
 * Invoice API service
 *
 * Browser -> Next.js proxy -> Spring Boot backend
 *
 * Frontend route:
 * GET /api/invoices/order/:orderId/pdf
 *
 * Backend route:
 * GET /api/invoices/order/:orderId/pdf
 */

export async function downloadInvoice(
  orderId: string,
  token: string
): Promise<void> {

  console.log(
    "======================================"
  );

  console.log(
    "INVOICE API"
  );

  console.log(
    "orderId:",
    orderId
  );

  console.log(
    "token exists:",
    !!token
  );

  console.log(
    "token length:",
    token?.length
  );

  console.log(
    "======================================"
  );

  const response =
    await fetch(
      `/api/invoices/${orderId}/pdf`,
      {
        method: "GET",

        headers: {
          Authorization:
            `Bearer ${token}`,

          Accept:
            "application/pdf",
        },

        cache: "no-store",
      }
    );

  console.log(
    "INVOICE API - status:",
    response.status
  );

  if (!response.ok) {

    const errorText =
      await response.text();

    console.error(
      "INVOICE API ERROR:",
      response.status,
      errorText
    );

    throw new Error(
      `Failed to download invoice: ${response.status} ${response.statusText}`
    );
  }

  const blob =
    await response.blob();

  console.log(
    "INVOICE API - PDF received:",
    blob.size,
    "bytes"
  );

  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    `invoice-${orderId}.pdf`;

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
}