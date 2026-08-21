import type {
  ShipmentResponseDTO,
} from "@/types/shipment";

const SHIPMENT_API_URL =
  "http://localhost:8080/api/shipments";

async function handleResponse<T>(
  response: Response
): Promise<T> {

  if (!response.ok) {

    const contentType =
      response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {

      const data = await response.json();

      throw new Error(
        data?.message ||
        data?.error ||
        "Shipment request failed."
      );
    }

    const text = await response.text();

    throw new Error(
      text || "Shipment request failed."
    );
  }

  return response.json() as Promise<T>;
}


// ============================================================
// GET USER SHIPMENTS
// ============================================================

export async function getUserShipments(
  userId: number,
  token: string
): Promise<ShipmentResponseDTO[]> {

  const response = await fetch(
    `${SHIPMENT_API_URL}/user/${userId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  return handleResponse<ShipmentResponseDTO[]>(
    response
  );
}


// ============================================================
// GET SHIPMENT BY ORDER
// ============================================================

export async function getShipmentByOrder(
  orderId: number,
  token: string
): Promise<ShipmentResponseDTO> {

  const response = await fetch(
    `${SHIPMENT_API_URL}/order/${orderId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  return handleResponse<ShipmentResponseDTO>(
    response
  );
}


// ============================================================
// GET SHIPMENT BY TRACKING NUMBER
// ============================================================

export async function getShipmentByTrackingNumber(
  trackingNumber: string,
  token: string
): Promise<ShipmentResponseDTO> {

  const response = await fetch(
    `${SHIPMENT_API_URL}/tracking/${encodeURIComponent(
      trackingNumber
    )}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  return handleResponse<ShipmentResponseDTO>(
    response
  );
}