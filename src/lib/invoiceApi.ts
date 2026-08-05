/**
 * Invoice API service
 *
 * Integration point for the backend team:
 * - Endpoint: GET /api/orders/:orderId/invoice
 * - Expected response: PDF blob (Content-Type: application/pdf)
 * - Auth: attach bearer token here once customer auth is implemented
 * - Set NEXT_PUBLIC_API_BASE_URL in .env.local to point to the backend
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export async function downloadInvoice(orderId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/api/orders/${orderId}/invoice`, {
    method: "GET",
    headers: {
      Accept: "application/pdf",
      // Authorization: `Bearer ${getAuthToken()}`, // uncomment when auth is ready
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch invoice: ${response.status} ${response.statusText}`);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `invoice-${orderId}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
