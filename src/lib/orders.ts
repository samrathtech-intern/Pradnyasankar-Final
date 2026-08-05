import { Product } from "@/data";

export type OrderStatus =
  | "Confirmed"
  | "Preparing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Return Requested"
  | "Return Approved"
  | "Refund Processing"
  | "Refund Completed";

export type ReturnRequest = {
  itemId: string;
  reason: string;
  comments: string;
  hasImage: boolean;
  requestedAt: string;
};

export type Order = {
  id: string;
  placedAt: string;
  items: Product[];
  subtotal: number;
  discount: number;
  shipping: number;
  gst: number;
  total: number;
  contact: { name: string; email: string; phone: string };
  address: { line1: string; line2: string; city: string; state: string; pincode: string };
  status: OrderStatus;
  returnRequest?: ReturnRequest;
};

const KEY = "ps_orders";

export function generateOrderId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PS-${ts}-${rand}`;
}

export function readOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

export function writeOrders(orders: Order[]): void {
  try { localStorage.setItem(KEY, JSON.stringify(orders)); } catch {}
}

export function saveOrder(order: Order): void {
  const existing = readOrders();
  // avoid duplicates if confirmation page re-mounts
  if (existing.some((o) => o.id === order.id)) return;
  writeOrders([order, ...existing]);
}

export function updateOrder(id: string, patch: Partial<Order>): void {
  writeOrders(readOrders().map((o) => (o.id === id ? { ...o, ...patch } : o)));
}

// Demo seed — only available in development so production users never see fake orders
export const DEMO_ORDERS: Order[] = process.env.NODE_ENV === "development" ? [
  {
    id: "PS-DEMO-0001",
    placedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    items: [
      {
        id: "ashwagandha-capsules",
        name: "Ashwagandha Capsules",
        range: "Ayurveda",
        format: "Capsules",
        image: "/images/ashwagandha-capsules.webp",
        descriptor: "A recognised Ayurvedic botanical in a convenient capsule format.",
        goals: ["Daily Wellness"],
        status: "Featured",
        mrp: 599,
        price: 499,
        isVeg: true,
        inStock: true,
      },
      {
        id: "triphala",
        name: "Triphala Capsules",
        range: "Ayurveda",
        format: "Capsules",
        image: "/images/triphala.webp",
        descriptor: "A traditional Ayurvedic combination presented in a modern format.",
        goals: ["Digestive Wellness"],
        status: "New",
        mrp: 449,
        price: 379,
        isVeg: true,
        inStock: true,
      },
    ],
    subtotal: 998,
    discount: 0,
    shipping: 0,
    gst: 120,
    total: 1118,
    contact: { name: "Demo User", email: "demo@example.com", phone: "9876543210" },
    address: { line1: "12, Wellness Lane", line2: "Near City Park", city: "Pune", state: "Maharashtra", pincode: "411001" },
    status: "Delivered",
  },
  {
    id: "PS-DEMO-0002",
    placedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    items: [
      {
        id: "multivitamin",
        name: "Multivitamin",
        range: "Nutraceuticals",
        format: "Capsules",
        image: "/images/multivitamin.webp",
        descriptor: "A familiar nutritional format for everyday wellness routines.",
        goals: ["Daily Wellness"],
        status: "Signature",
        mrp: 699,
        price: 599,
        isVeg: true,
        inStock: true,
      },
    ],
    subtotal: 499,
    discount: 0,
    shipping: 0,
    gst: 60,
    total: 559,
    contact: { name: "Demo User", email: "demo@example.com", phone: "9876543210" },
    address: { line1: "12, Wellness Lane", line2: "", city: "Pune", state: "Maharashtra", pincode: "411001" },
    status: "Confirmed",
  },
] : [];
