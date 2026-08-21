/**
 * Cart API service
 *
 * Backend endpoints:
 *
 * POST   /api/cart/add
 *        {
 *          variantId,
 *          quantity
 *        }
 *
 * GET    /api/cart
 *
 * PUT    /api/cart/item/{cartItemId}
 *        {
 *          quantity
 *        }
 *
 * DELETE /api/cart/item/{cartItemId}
 *
 * DELETE /api/cart/clear
 *
 * POST   /api/cart/checkout
 *        CheckoutRequestDTO
 *
 * The backend identifies the customer from the JWT token.
 *
 * The browser calls the same-origin Next.js routes:
 * /api/cart/...
 *
 * Next.js forwards these requests to:
 * http://localhost:8080
 */

export const API_BASE = "";

// ============================================================
// CART ITEM DTO
// ============================================================

export interface CartItemDTO {
  cartItemId: number;
  variantId: number;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

// ============================================================
// CART RESPONSE DTO
// ============================================================

export interface CartResponseDTO {
  cartId: number;
  userId: number;
  items: CartItemDTO[];
  totalAmount: number;
  totalItems: number;
}

// ============================================================
// CHECKOUT REQUEST DTO
// ============================================================

export interface CheckoutRequestDTO {
  fullName: string;
  mobileNumber: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes: string;
  couponCode: string | null;
}

// ============================================================
// GENERIC REQUEST FUNCTION
// ============================================================

async function request<T>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    token?: string;
  } = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // ==========================================================
  // JWT
  // ==========================================================

  if (options.token) {
    headers["Authorization"] = `Bearer ${options.token}`;
  }

  // ==========================================================
  // REQUEST
  // ==========================================================

  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? "GET",
    headers,
    body:
      options.body !== undefined
        ? JSON.stringify(options.body)
        : undefined,
  });

  // ==========================================================
  // RESPONSE
  // ==========================================================

  const data = await response.json().catch(() => null);

  // ==========================================================
  // ERROR HANDLING
  // ==========================================================

  if (!response.ok) {
    let message = `Cart request failed: ${response.status}`;

    if (
      data &&
      typeof data === "object" &&
      "message" in data &&
      typeof (data as { message: unknown }).message === "string"
    ) {
      message = (data as { message: string }).message;
    }

    throw new Error(message);
  }

  return data as T;
}

// ============================================================
// GET CURRENT USER CART
// ============================================================

/**
 * GET /api/cart
 *
 * The backend identifies the customer from the JWT.
 */
export async function getCart(
  token?: string,
): Promise<CartResponseDTO> {
  return request<CartResponseDTO>(
    "/api/cart",
    {
      method: "GET",
      token,
    },
  );
}

// ============================================================
// ADD TO CART
// ============================================================

/**
 * POST /api/cart/add
 *
 * Body:
 * {
 *   variantId: 22,
 *   quantity: 1
 * }
 */
export async function addToCart(
  variantId: number,
  quantity: number,
  token?: string,
): Promise<CartResponseDTO> {
  return request<CartResponseDTO>(
    "/api/cart/add",
    {
      method: "POST",
      body: {
        variantId,
        quantity,
      },
      token,
    },
  );
}

// ============================================================
// UPDATE CART ITEM
// ============================================================

/**
 * PUT /api/cart/item/{cartItemId}
 *
 * Body:
 * {
 *   quantity: 3
 * }
 */
export async function updateCartItem(
  cartItemId: number,
  quantity: number,
  token?: string,
): Promise<CartResponseDTO> {
  return request<CartResponseDTO>(
    `/api/cart/item/${cartItemId}`,
    {
      method: "PUT",
      body: {
        quantity,
      },
      token,
    },
  );
}

// ============================================================
// REMOVE CART ITEM
// ============================================================

/**
 * DELETE /api/cart/item/{cartItemId}
 */
export async function removeCartItem(
  cartItemId: number,
  token?: string,
): Promise<void> {
  await request<unknown>(
    `/api/cart/item/${cartItemId}`,
    {
      method: "DELETE",
      token,
    },
  );
}

// ============================================================
// CLEAR CART
// ============================================================

/**
 * DELETE /api/cart/clear
 */
export async function clearCart(
  token?: string,
): Promise<void> {
  await request<unknown>(
    "/api/cart/clear",
    {
      method: "DELETE",
      token,
    },
  );
}

// ============================================================
// CHECKOUT RESPONSE
// ============================================================

/**
 * This matches the OrderResponseDTO returned
 * by your backend checkout API.
 */

export interface CheckoutOrderItemDTO {
  orderItemId: number;
  variantId: number;
  productName: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  taxAmount: number;
  subtotal: number;
}

export interface CheckoutResponseDTO {
  orderId: number;
  orderNumber: string;
  userId: number;

  customerName: string;

  fullName: string;
  mobileNumber: string;

  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;

  orderStatus: string;
  paymentStatus: string;

  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingCharge: number;
  totalAmount: number;

  notes: string;

  orderedAt: string;

  items: CheckoutOrderItemDTO[];

  // Razorpay
  razorpayOrderId: string;
  amount: number;
  currency: string;
  status: string;
}

// ============================================================
// CHECKOUT
// ============================================================

/**
 * POST /api/cart/checkout
 *
 * The backend gets the logged-in user from JWT.
 *
 * IMPORTANT:
 * Do NOT send userId here.
 *
 * Example body:
 *
 * {
 *   "fullName": "Aishwarya",
 *   "mobileNumber": "9876543210",
 *   "addressLine1": "Flat 101, ABC Building",
 *   "addressLine2": "MG Road",
 *   "landmark": "Near XYZ",
 *   "city": "Pune",
 *   "state": "Maharashtra",
 *   "postalCode": "411001",
 *   "country": "India",
 *   "notes": "",
 *   "couponCode": null
 * }
 */
export async function checkoutCart(
  checkoutData: CheckoutRequestDTO,
  token?: string,
): Promise<CheckoutResponseDTO> {
  return request<CheckoutResponseDTO>(
    "/api/cart/checkout",
    {
      method: "POST",
      body: checkoutData,
      token,
    },
  );
}