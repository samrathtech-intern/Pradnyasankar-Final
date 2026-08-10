/**
 * Cart API service
 *
 * Backend endpoints:
 *
 * POST   /api/cart/add
 *        { variantId, quantity }
 *
 * GET    /api/cart
 *
 * PUT    /api/cart/item/{cartItemId}
 *        { quantity }
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
 * The browser calls the same-origin Next.js route:
 * /api/cart/...
 *
 * Next.js forwards the request to:
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
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes?: string;
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

  const res = await fetch(`${API_BASE}${path}`, {
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

  const data = await res.json().catch(() => null);

  // ==========================================================
  // ERROR HANDLING
  // ==========================================================

  if (!res.ok) {
    const message =
      data &&
      typeof data === "object" &&
      "message" in data &&
      typeof (data as { message: unknown }).message === "string"
        ? (data as { message: string }).message
        : `Cart request failed: ${res.status}`;

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
// CHECKOUT
// ============================================================

/**
 * POST /api/cart/checkout
 *
 * The backend expects CheckoutRequestDTO.
 */
export async function checkoutCart(
  checkoutData: CheckoutRequestDTO,
  token?: string,
): Promise<any> {
  return request<any>(
    "/api/cart/checkout",
    {
      method: "POST",
      body: checkoutData,
      token,
    },
  );
}