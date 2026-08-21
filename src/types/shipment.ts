export type ShipmentStatus =
  | "PENDING"
  | "PACKED"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "RETURNED";

export type ShipmentResponseDTO = {
  shipmentId: number;
  orderId: number;
  orderNumber: string;
  courierName: string | null;
  trackingNumber: string | null;
  shipmentStatus: ShipmentStatus;
  expectedDeliveryDate: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  remarks: string | null;
  createdAt: string;
};