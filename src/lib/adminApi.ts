

/**
 * Admin API service — Pradnyasanskar
 *
 * Authentication:
 * JWT Bearer token returned by /api/auth/login
 *
 * IMPORTANT:
 * The backend currently exposes orders through:
 *
 *   GET /api/orders
 *   GET /api/orders/{orderId}
 *   GET /api/orders/number/{orderNumber}
 *   GET /api/orders/user/{userId}
 *   GET /api/orders/status/{status}
 *   GET /api/orders/payment-status/{status}
 *   PUT /api/orders/{orderId}/status/{status}
 *   PUT /api/orders/{orderId}/payment-status/{status}
 *   PUT /api/orders/{orderId}/cancel
 *   GET /api/orders/my-orders
 */

import type { OrderStatus } from "./orders";

/* -------------------------------------------------------------------------- */
/* Configuration                                                              */
/* -------------------------------------------------------------------------- */

const API_BASE = "";

const ADMIN_TOKEN_KEY = "ps_admin_token";

/* -------------------------------------------------------------------------- */
/* Login types                                                                */
/* -------------------------------------------------------------------------- */

export type AdminLoginUser = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  role: string;
};

export type AdminLoginResponse = {
  token: string;
  message?: string;
  user: AdminLoginUser;
};

/* -------------------------------------------------------------------------- */
/* Token helpers                                                              */
/* -------------------------------------------------------------------------- */

export function getAdminToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  } catch {
    // Ignore localStorage errors.
  }
}

export function clearAdminToken(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {
    // Ignore localStorage errors.
  }
}

/* -------------------------------------------------------------------------- */
/* Generic request                                                            */
/* -------------------------------------------------------------------------- */

async function adminRequest<T>(
  path: string,
  options: RequestInit = {},
  includeAuth = true,
): Promise<T> {
  const token = includeAuth ? getAdminToken() : null;

  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  const contentType =
    response.headers.get("content-type") ?? "";

  let data: unknown = null;

  if (contentType.includes("application/json")) {
    data = await response.json().catch(() => null);
  } else {
    const text = await response.text().catch(() => "");
    data = text || null;
  }

  /* ---------------------------------------------------------------------- */
  /* 401                                                                    */
  /* ---------------------------------------------------------------------- */

  if (response.status === 401) {
    clearAdminToken();

    throw new Error(
      "Your session has expired. Please log in again.",
    );
  }

  /* ---------------------------------------------------------------------- */
  /* 403                                                                    */
  /* ---------------------------------------------------------------------- */

  if (response.status === 403) {
    throw new Error(
      "You are not authorized to access this resource.",
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Other errors                                                           */
  /* ---------------------------------------------------------------------- */

  if (!response.ok) {
    const errorData = data as
      | {
          message?: string;
          error?: string;
        }
      | null;

    throw new Error(
      errorData?.message ??
        errorData?.error ??
        (typeof data === "string" && data
          ? data
          : `Request failed: ${response.status}`),
    );
  }

  return data as T;
}

/* -------------------------------------------------------------------------- */
/* Admin login                                                               */
/* -------------------------------------------------------------------------- */

export async function adminLogin(
  email: string,
  password: string,
): Promise<AdminLoginResponse> {
  const response =
    await adminRequest<AdminLoginResponse>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      },
      false,
    );

  if (!response) {
    throw new Error(
      "Invalid response from server.",
    );
  }

  if (!response.user) {
    throw new Error(
      "Invalid login response from server.",
    );
  }

  if (response.user.role !== "ADMIN") {
    throw new Error(
      "This account does not have admin access.",
    );
  }

  if (!response.token) {
    throw new Error(
      "Login succeeded but no authentication token was returned.",
    );
  }

  setAdminToken(response.token);

  return response;
}

/* -------------------------------------------------------------------------- */
/* Logout                                                                     */
/* -------------------------------------------------------------------------- */

export function adminLogout(): void {
  clearAdminToken();
}

/* -------------------------------------------------------------------------- */
/* Dashboard                                                                  */
/* -------------------------------------------------------------------------- */

export type AnalyticsSummary = {
  totalUsers: number;
  activeUsers: number;

  totalProducts: number;
  totalCategories: number;

  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;

  totalRevenue: number;

  totalCoupons: number;
  activeCoupons: number;

  totalReviews: number;
  averageRating: number;
};

export async function fetchAnalyticsSummary(): Promise<AnalyticsSummary> {
  return adminRequest<AnalyticsSummary>(
    "/api/admin/dashboard",
  );
}

/* -------------------------------------------------------------------------- */
/* Admin orders                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Backend OrderResponseDTO may contain more fields than these.
 *
 * These are the fields currently used by the admin orders page.
 */
export type AdminOrderItem = {
  orderItemId?: number;
  productId?: number;
  variantId?: number;

  productName?: string;
  variantName?: string | null;
  sku?: string | null;

  quantity?: number;

  unitPrice?: number;
  totalPrice?: number;
};

export type AdminOrder = {
  orderId: number;
  orderNumber: string;

  orderedAt: string | null;

  customerName: string;
  fullName: string;
  mobileNumber: string;

  totalAmount: number;

  orderStatus: OrderStatus;

  items: AdminOrderItem[];
};

export type AdminOrdersResponse = {
  orders: AdminOrder[];
  total: number;
};

export type FetchAdminOrdersParams = {
  status?: OrderStatus | "All";
  search?: string;
  page?: number;
  limit?: number;
};

/* -------------------------------------------------------------------------- */
/* Get all orders                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Backend:
 *
 * GET /api/orders
 *
 * The current Spring controller does not support:
 *
 *   ?status=
 *   ?search=
 *   ?page=
 *   ?limit=
 *
 * so those filters are performed on the frontend.
 */
export async function fetchAdminOrders(
  params: FetchAdminOrdersParams = {},
): Promise<AdminOrdersResponse> {
  const allOrders =
    await adminRequest<AdminOrder[]>(
      "/api/orders",
    );

  let filteredOrders = Array.isArray(allOrders)
    ? allOrders
    : [];

  /* ---------------------------------------------------------------------- */
  /* Status filter                                                          */
  /* ---------------------------------------------------------------------- */

  if (
    params.status &&
    params.status !== "All"
  ) {
    filteredOrders =
      filteredOrders.filter(
        (order) =>
          order.orderStatus ===
          params.status,
      );
  }

  /* ---------------------------------------------------------------------- */
  /* Search filter                                                          */
  /* ---------------------------------------------------------------------- */

  const search =
    params.search?.trim().toLowerCase();

  if (search) {
    filteredOrders =
      filteredOrders.filter((order) => {
        const orderNumber =
          String(
            order.orderNumber ?? "",
          ).toLowerCase();

        const customerName =
          String(
            order.customerName ?? "",
          ).toLowerCase();

        const fullName =
          String(
            order.fullName ?? "",
          ).toLowerCase();

        const mobileNumber =
          String(
            order.mobileNumber ?? "",
          ).toLowerCase();

        return (
          orderNumber.includes(search) ||
          customerName.includes(search) ||
          fullName.includes(search) ||
          mobileNumber.includes(search)
        );
      });
  }

  /* ---------------------------------------------------------------------- */
  /* Pagination                                                             */
  /* ---------------------------------------------------------------------- */

  const total = filteredOrders.length;

  const page =
    params.page !== undefined &&
    params.page > 0
      ? params.page
      : 1;

  const limit =
    params.limit !== undefined &&
    params.limit > 0
      ? params.limit
      : total || 50;

  const start =
    (page - 1) * limit;

  const paginatedOrders =
    filteredOrders.slice(
      start,
      start + limit,
    );

  return {
    orders: paginatedOrders,
    total,
  };
}

/* -------------------------------------------------------------------------- */
/* Get single order                                                           */
/* -------------------------------------------------------------------------- */

export async function fetchAdminOrder(
  orderId: number,
): Promise<AdminOrder> {
  if (!orderId) {
    throw new Error(
      "Order ID is required.",
    );
  }

  return adminRequest<AdminOrder>(
    `/api/orders/${encodeURIComponent(
      String(orderId),
    )}`,
  );
}

/* -------------------------------------------------------------------------- */
/* Update order status                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Backend:
 *
 * PUT /api/orders/{orderId}/status/{status}
 *
 * NOT:
 *
 * PATCH /api/admin/orders/{orderId}
 */
export async function updateOrderStatus(
  orderId: number,
  status: OrderStatus,
): Promise<AdminOrder> {
  if (!orderId) {
    throw new Error(
      "Order ID is required.",
    );
  }

  if (!status) {
    throw new Error(
      "Order status is required.",
    );
  }

  return adminRequest<AdminOrder>(
    `/api/orders/${encodeURIComponent(
      String(orderId),
    )}/status/${encodeURIComponent(status)}`,
    {
      method: "PUT",
    },
  );
}

/* -------------------------------------------------------------------------- */
/* Update payment status                                                      */
/* -------------------------------------------------------------------------- */

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED"
  | string;

export async function updatePaymentStatus(
  orderId: number,
  status: PaymentStatus,
): Promise<AdminOrder> {
  if (!orderId) {
    throw new Error(
      "Order ID is required.",
    );
  }

  if (!status) {
    throw new Error(
      "Payment status is required.",
    );
  }

  return adminRequest<AdminOrder>(
    `/api/orders/${encodeURIComponent(
      String(orderId),
    )}/payment-status/${encodeURIComponent(
      status,
    )}`,
    {
      method: "PUT",
    },
  );
}

/* -------------------------------------------------------------------------- */
/* Cancel order                                                               */
/* -------------------------------------------------------------------------- */

export async function cancelOrder(
  orderId: number,
): Promise<AdminOrder> {
  if (!orderId) {
    throw new Error(
      "Order ID is required.",
    );
  }

  return adminRequest<AdminOrder>(
    `/api/orders/${encodeURIComponent(
      String(orderId),
    )}/cancel`,
    {
      method: "PUT",
    },
  );
}

/* -------------------------------------------------------------------------- */
/* Products                                                                   */
/* -------------------------------------------------------------------------- */

export type ProductStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "DISCONTINUED";

export type AdminProduct = {
  productId: number;
  categoryId: number;
  categoryName: string;

  productName: string;
  slug: string;

  brand: string | null;
  manufacturer: string | null;

  description: string | null;
  composition: string | null;
  dosageForm: string | null;

  prescriptionRequired: boolean;
  productStatus: ProductStatus;
};

export type ProductRequest = {
  categoryId: number;

  productName: string;
  slug: string;

  brand?: string;
  manufacturer?: string;

  description?: string;
  composition?: string;
  dosageForm?: string;

  prescriptionRequired: boolean;
  productStatus: ProductStatus;
};

export async function fetchAdminProducts(): Promise<
  AdminProduct[]
> {
  return adminRequest<AdminProduct[]>(
    "/api/products",
  );
}

export async function fetchAdminProduct(
  productId: number,
): Promise<AdminProduct> {
  if (!productId) {
    throw new Error(
      "Product ID is required.",
    );
  }

  return adminRequest<AdminProduct>(
    `/api/products/${productId}`,
  );
}

export async function createAdminProduct(
  request: ProductRequest,
): Promise<AdminProduct> {
  return adminRequest<AdminProduct>(
    "/api/products",
    {
      method: "POST",
      body: JSON.stringify(request),
    },
  );
}

export async function updateAdminProduct(
  productId: number,
  request: ProductRequest,
): Promise<AdminProduct> {
  if (!productId) {
    throw new Error(
      "Product ID is required.",
    );
  }

  return adminRequest<AdminProduct>(
    `/api/products/${productId}`,
    {
      method: "PUT",
      body: JSON.stringify(request),
    },
  );
}

export async function deleteAdminProduct(
  productId: number,
): Promise<void> {
  if (!productId) {
    throw new Error(
      "Product ID is required.",
    );
  }

  await adminRequest<unknown>(
    `/api/products/${productId}`,
    {
      method: "DELETE",
    },
  );
}

/* -------------------------------------------------------------------------- */
/* Product variants                                                           */
/* -------------------------------------------------------------------------- */

export type ProductVariant = {
  variantId: number;
  productId: number;
  productName: string;

  sku: string;
  variantName: string | null;
  strength: string | null;
  packSize: string | null;
  unitOfMeasure: string | null;

  mrp: number;
  sellingPrice: number;
  gstPercentage: number;

  reorderLevel: number;

  weight: number | null;
  dimensions: string | null;

  isActive: boolean;
};

export type ProductVariantRequest = {
  productId: number;

  sku: string;

  variantName?: string;
  strength?: string;
  packSize?: string;
  unitOfMeasure?: string;

  mrp: number;
  sellingPrice: number;
  gstPercentage: number;

  reorderLevel: number;

  weight?: number;
  dimensions?: string;

  isActive: boolean;
};

export async function fetchAdminVariants(): Promise<
  ProductVariant[]
> {
  return adminRequest<ProductVariant[]>(
    "/api/product-variants",
  );
}

export async function fetchAdminVariant(
  variantId: number,
): Promise<ProductVariant> {
  if (!variantId) {
    throw new Error(
      "Variant ID is required.",
    );
  }

  return adminRequest<ProductVariant>(
    `/api/product-variants/${variantId}`,
  );
}

export async function fetchVariantsByProduct(
  productId: number,
): Promise<ProductVariant[]> {
  if (!productId) {
    throw new Error(
      "Product ID is required.",
    );
  }

  return adminRequest<ProductVariant[]>(
    `/api/product-variants/product/${productId}`,
  );
}

export async function createAdminVariant(
  request: ProductVariantRequest,
): Promise<ProductVariant> {
  return adminRequest<ProductVariant>(
    "/api/product-variants",
    {
      method: "POST",
      body: JSON.stringify(request),
    },
  );
}

export async function updateAdminVariant(
  variantId: number,
  request: ProductVariantRequest,
): Promise<ProductVariant> {
  if (!variantId) {
    throw new Error(
      "Variant ID is required.",
    );
  }

  return adminRequest<ProductVariant>(
    `/api/product-variants/${variantId}`,
    {
      method: "PUT",
      body: JSON.stringify(request),
    },
  );
}

export async function deleteAdminVariant(
  variantId: number,
): Promise<void> {
  if (!variantId) {
    throw new Error(
      "Variant ID is required.",
    );
  }

  await adminRequest<unknown>(
    `/api/product-variants/${variantId}`,
    {
      method: "DELETE",
    },
  );
}
/* -------------------------------------------------------------------------- */
/* Customer Support                                                           */
/* -------------------------------------------------------------------------- */

export type CustomerSupportStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED"
  | string;

export type CustomerSupportEnquiry = {
  enquiryId: number;

  customerName: string;
  customerEmail: string;
  customerPhone: string;

  topic: string;
  orderNumber: string | null;

  message: string;
  imageUrl: string | null;

  status: CustomerSupportStatus;

  adminResponse: string | null;

  createdAt: string;
  updatedAt: string;
};


/* -------------------------------------------------------------------------- */
/* Customer Support API                                                       */
/* -------------------------------------------------------------------------- */

export type UpdateCustomerSupportEnquiryRequest = {
  status: CustomerSupportStatus;
  adminResponse: string;
};

/**
 * GET /api/customer/support/admin/enquiries
 */
export async function fetchAdminCustomerSupportEnquiries(): Promise<
  CustomerSupportEnquiry[]
> {
  const response =
    await adminRequest<CustomerSupportEnquiry[]>(
      "/api/customer/support/admin/enquiries",
    );

  return Array.isArray(response) ? response : [];
}

/**
 * PUT /api/customer/support/admin/enquiries/{enquiryId}
 */
export async function updateAdminCustomerSupportEnquiry(
  enquiryId: number,
  request: UpdateCustomerSupportEnquiryRequest,
): Promise<CustomerSupportEnquiry> {
  if (!enquiryId) {
    throw new Error("Enquiry ID is required.");
  }

  return adminRequest<CustomerSupportEnquiry>(
    `/api/customer/support/admin/enquiries/${enquiryId}`,
    {
      method: "PUT",
      body: JSON.stringify(request),
    },
  );
}
/* -------------------------------------------------------------------------- */
/* B2B Enquiries                                                              */
/* -------------------------------------------------------------------------- */

export type B2BEnquiryStatus =
  | "NEW"
  | "IN_PROGRESS"
  | "CONTACTED"
  | "CLOSED";

export type AdminB2BEnquiry = {
  enquiryId: number;

  companyName: string;
  contactPerson: string;

  email: string;
  mobileNumber: string;

  gstNumber: string | null;

  businessType: string | null;

  message: string;

  status: B2BEnquiryStatus;

  createdAt: string;
  updatedAt: string;
};

/* -------------------------------------------------------------------------- */
/* Get all B2B enquiries                                                      */
/*                                                                            */
/* Backend:                                                                   */
/* GET /api/b2b-enquiries                                                      */
/* -------------------------------------------------------------------------- */

export async function fetchAdminB2BEnquiries(): Promise<
  AdminB2BEnquiry[]
> {
  const response = await adminRequest<AdminB2BEnquiry[]>(
    "/api/b2b-enquiries",
    {
      method: "GET",
    },
  );

  return Array.isArray(response) ? response : [];
}

/* -------------------------------------------------------------------------- */
/* Get single B2B enquiry                                                     */
/*                                                                            */
/* Backend:                                                                   */
/* GET /api/b2b-enquiries/{enquiryId}                                          */
/* -------------------------------------------------------------------------- */

export async function fetchAdminB2BEnquiry(
  enquiryId: number,
): Promise<AdminB2BEnquiry> {
  if (!enquiryId) {
    throw new Error("B2B enquiry ID is required.");
  }

  return adminRequest<AdminB2BEnquiry>(
    `/api/b2b-enquiries/${encodeURIComponent(
      String(enquiryId),
    )}`,
    {
      method: "GET",
    },
  );
}

/* -------------------------------------------------------------------------- */
/* Update B2B enquiry status                                                  */
/*                                                                            */
/* Backend:                                                                   */
/* PUT /api/b2b-enquiries/{enquiryId}/status?status=IN_PROGRESS                */
/*                                                                            */
/* IMPORTANT: The Spring controller uses @RequestParam EnquiryStatus status.  */
/* It does NOT accept { status: "IN_PROGRESS" } as a JSON body.               */
/* -------------------------------------------------------------------------- */

export async function updateAdminB2BEnquiryStatus(
  enquiryId: number,
  status: B2BEnquiryStatus,
): Promise<AdminB2BEnquiry> {
  if (!enquiryId) {
    throw new Error("B2B enquiry ID is required.");
  }

  if (!status) {
    throw new Error("B2B enquiry status is required.");
  }

  return adminRequest<AdminB2BEnquiry>(
    `/api/b2b-enquiries/${encodeURIComponent(
      String(enquiryId),
    )}/status?status=${encodeURIComponent(status)}`,
    {
      method: "PUT",
    },
  );
}

/* -------------------------------------------------------------------------- */
/* Delete B2B enquiry                                                         */
/*                                                                            */
/* Backend:                                                                   */
/* DELETE /api/b2b-enquiries/{enquiryId}                                       */
/* -------------------------------------------------------------------------- */

export async function deleteAdminB2BEnquiry(
  enquiryId: number,
): Promise<void> {
  if (!enquiryId) {
    throw new Error("B2B enquiry ID is required.");
  }

  await adminRequest<unknown>(
    `/api/b2b-enquiries/${encodeURIComponent(
      String(enquiryId),
    )}`,
    {
      method: "DELETE",
    },
  );
}

// /* -------------------------------------------------------------------------- */
// /* B2B Enquiries                                                              */
// /* -------------------------------------------------------------------------- */

// export type B2BEnquiryStatus =
//   | "NEW"
//   | "IN_PROGRESS"
//   | "CONTACTED"
//   | "CLOSED";

// export type AdminB2BEnquiry = {
//   enquiryId: number;

//   companyName: string;
//   contactPerson: string;

//   email: string;
//   mobileNumber: string;

//   gstNumber: string | null;

//   businessType: string | null;

//   message: string;

//   status: B2BEnquiryStatus;

//   createdAt: string;
//   updatedAt: string;
// };

// export type UpdateB2BEnquiryStatusRequest = {
//   status: B2BEnquiryStatus;
// };

// /* -------------------------------------------------------------------------- */
// /* Get all B2B enquiries                                                      */
// /* -------------------------------------------------------------------------- */

// export async function fetchAdminB2BEnquiries(): Promise<
//   AdminB2BEnquiry[]
// > {
//   const response =
//     await adminRequest<AdminB2BEnquiry[]>(
//       "/api/b2b-enquiries",
//     );

//   return Array.isArray(response)
//     ? response
//     : [];
// }

// /* -------------------------------------------------------------------------- */
// /* Get single B2B enquiry                                                     */
// /* -------------------------------------------------------------------------- */

// export async function fetchAdminB2BEnquiry(
//   enquiryId: number,
// ): Promise<AdminB2BEnquiry> {
//   if (!enquiryId) {
//     throw new Error(
//       "B2B enquiry ID is required.",
//     );
//   }

//   return adminRequest<AdminB2BEnquiry>(
//     `/api/b2b-enquiries/${encodeURIComponent(
//       String(enquiryId),
//     )}`,
//   );
// }

// /* -------------------------------------------------------------------------- */
// /* Update B2B enquiry status                                                  */
// /* -------------------------------------------------------------------------- */

// export async function updateAdminB2BEnquiryStatus(
//   enquiryId: number,
//   status: B2BEnquiryStatus,
// ): Promise<AdminB2BEnquiry> {
//   if (!enquiryId) {
//     throw new Error(
//       "B2B enquiry ID is required.",
//     );
//   }

//   if (!status) {
//     throw new Error(
//       "B2B enquiry status is required.",
//     );
//   }

//   return adminRequest<AdminB2BEnquiry>(
//     `/api/b2b-enquiries/${encodeURIComponent(
//       String(enquiryId),
//     )}`,
//     {
//       method: "PUT",
//       body: JSON.stringify({
//         status,
//       }),
//     },
//   );
// }

// /* -------------------------------------------------------------------------- */
// /* Delete B2B enquiry                                                         */
// /* -------------------------------------------------------------------------- */

// export async function deleteAdminB2BEnquiry(
//   enquiryId: number,
// ): Promise<void> {
//   if (!enquiryId) {
//     throw new Error(
//       "B2B enquiry ID is required.",
//     );
//   }

//   await adminRequest<unknown>(
//     `/api/b2b-enquiries/${encodeURIComponent(
//       String(enquiryId),
//     )}`,
//     {
//       method: "DELETE",
//     },
//   );
// }




// /**
//  * Admin API service — Pradnyasanskar
//  *
//  * Authentication:
//  * JWT Bearer token returned by /api/auth/login
//  */

// import type { OrderStatus } from "./orders";

// /* -------------------------------------------------------------------------- */
// /* Configuration                                                              */
// /* -------------------------------------------------------------------------- */

// const API_BASE = "";

// const ADMIN_TOKEN_KEY = "ps_admin_token";

// /* -------------------------------------------------------------------------- */
// /* Login types                                                                */
// /* -------------------------------------------------------------------------- */

// export type AdminLoginUser = {
//   userId: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   mobileNumber: string;
//   role: string;
// };

// export type AdminLoginResponse = {
//   token: string;
//   message?: string;
//   user: AdminLoginUser;
// };

// /* -------------------------------------------------------------------------- */
// /* Token helpers                                                              */
// /* -------------------------------------------------------------------------- */

// export function getAdminToken(): string | null {
//   if (typeof window === "undefined") {
//     return null;
//   }

//   try {
//     return localStorage.getItem(ADMIN_TOKEN_KEY);
//   } catch {
//     return null;
//   }
// }

// export function setAdminToken(token: string): void {
//   if (typeof window === "undefined") {
//     return;
//   }

//   try {
//     localStorage.setItem(ADMIN_TOKEN_KEY, token);
//   } catch {
//     // Ignore localStorage errors.
//   }
// }

// export function clearAdminToken(): void {
//   if (typeof window === "undefined") {
//     return;
//   }

//   try {
//     localStorage.removeItem(ADMIN_TOKEN_KEY);
//   } catch {
//     // Ignore localStorage errors.
//   }
// }

// /* -------------------------------------------------------------------------- */
// /* Generic request                                                            */
// /* -------------------------------------------------------------------------- */

// async function adminRequest<T>(
//   path: string,
//   options: RequestInit = {},
//   includeAuth = true,
// ): Promise<T> {
//   const token = includeAuth ? getAdminToken() : null;

//   const headers = new Headers(options.headers);

//   if (!headers.has("Content-Type")) {
//     headers.set("Content-Type", "application/json");
//   }

//   if (token) {
//     headers.set("Authorization", `Bearer ${token}`);
//   }

//   const response = await fetch(`${API_BASE}${path}`, {
//     ...options,
//     headers,
//     cache: "no-store",
//   });

//   const contentType =
//     response.headers.get("content-type") ?? "";

//   let data: unknown = null;

//   if (contentType.includes("application/json")) {
//     data = await response.json().catch(() => null);
//   } else {
//     const text = await response.text().catch(() => "");
//     data = text || null;
//   }

//   /* ---------------------------------------------------------------------- */
//   /* 401                                                                    */
//   /* ---------------------------------------------------------------------- */

//   if (response.status === 401) {
//     clearAdminToken();
//     throw new Error("UNAUTHORIZED");
//   }

//   /* ---------------------------------------------------------------------- */
//   /* 403                                                                    */
//   /* ---------------------------------------------------------------------- */

//   if (response.status === 403) {
//     throw new Error(
//       "You are not authorized to access the admin panel.",
//     );
//   }

//   /* ---------------------------------------------------------------------- */
//   /* Other errors                                                           */
//   /* ---------------------------------------------------------------------- */

//   if (!response.ok) {
//     const errorData = data as
//       | {
//           message?: string;
//           error?: string;
//         }
//       | null;

//     throw new Error(
//       errorData?.message ??
//         errorData?.error ??
//         (typeof data === "string" && data
//           ? data
//           : `Request failed: ${response.status}`),
//     );
//   }

//   return data as T;
// }

// /* -------------------------------------------------------------------------- */
// /* Admin login                                                               */
// /* -------------------------------------------------------------------------- */

// export async function adminLogin(
//   email: string,
//   password: string,
// ): Promise<AdminLoginResponse> {
//   const response =
//     await adminRequest<AdminLoginResponse>(
//       "/api/auth/login",
//       {
//         method: "POST",
//         body: JSON.stringify({
//           email: email.trim(),
//           password,
//         }),
//       },
//       false,
//     );

//   if (!response) {
//     throw new Error("Invalid response from server.");
//   }

//   if (!response.user) {
//     throw new Error(
//       "Invalid login response from server.",
//     );
//   }

//   if (response.user.role !== "ADMIN") {
//     throw new Error(
//       "This account does not have admin access.",
//     );
//   }

//   if (!response.token) {
//     throw new Error(
//       "Login succeeded but no authentication token was returned.",
//     );
//   }

//   setAdminToken(response.token);

//   return response;
// }

// /* -------------------------------------------------------------------------- */
// /* Logout                                                                     */
// /* -------------------------------------------------------------------------- */

// export function adminLogout(): void {
//   clearAdminToken();
// }

// /* -------------------------------------------------------------------------- */
// /* Dashboard                                                                  */
// /* -------------------------------------------------------------------------- */

// export type AnalyticsSummary = {
//   totalUsers: number;
//   activeUsers: number;

//   totalProducts: number;
//   totalCategories: number;

//   totalOrders: number;
//   pendingOrders: number;
//   completedOrders: number;
//   cancelledOrders: number;

//   totalRevenue: number;

//   totalCoupons: number;
//   activeCoupons: number;

//   totalReviews: number;
//   averageRating: number;
// };

// export async function fetchAnalyticsSummary(): Promise<AnalyticsSummary> {
//   return adminRequest<AnalyticsSummary>(
//     "/api/admin/dashboard",
//   );
// }

// /* -------------------------------------------------------------------------- */
// /* Admin orders                                                               */
// /* -------------------------------------------------------------------------- */

// /**
//  * Keep the admin order type here because the admin API response
//  * has a different shape from the frontend checkout/order model.
//  */
// export type AdminOrderItem = {
//   orderItemId?: number;
//   productId?: number;
//   variantId?: number;

//   productName?: string;
//   variantName?: string | null;
//   sku?: string | null;

//   quantity?: number;

//   unitPrice?: number;
//   totalPrice?: number;
// };

// export type AdminOrder = {
//   orderId: number;

//   orderNumber: string;

//   orderedAt: string;

//   customerName: string;
//   fullName: string;
//   mobileNumber: string;

//   totalAmount: number;

//   orderStatus: OrderStatus;

//   items: AdminOrderItem[];
// };

// export type AdminOrdersResponse = {
//   orders: AdminOrder[];
//   total: number;
// };

// export type FetchAdminOrdersParams = {
//   status?: OrderStatus | "All";
//   search?: string;
//   page?: number;
//   limit?: number;
// };

// export async function fetchAdminOrders(
//   params: FetchAdminOrdersParams = {},
// ): Promise<AdminOrdersResponse> {
//   const query = new URLSearchParams();

//   if (
//     params.status &&
//     params.status !== "All"
//   ) {
//     query.set("status", params.status);
//   }

//   if (params.search?.trim()) {
//     query.set("search", params.search.trim());
//   }

//   if (params.page !== undefined) {
//     query.set("page", String(params.page));
//   }

//   if (params.limit !== undefined) {
//     query.set("limit", String(params.limit));
//   }

//   const queryString = query.toString();

//   const path = queryString
//     ? `/api/admin/orders?${queryString}`
//     : "/api/admin/orders";

//   return adminRequest<AdminOrdersResponse>(path);
// }

// /* -------------------------------------------------------------------------- */
// /* Update order status                                                        */
// /* -------------------------------------------------------------------------- */

// export async function updateOrderStatus(
//   orderId: number,
//   status: OrderStatus,
// ): Promise<AdminOrder> {
//   if (!orderId) {
//     throw new Error("Order ID is required.");
//   }

//   return adminRequest<AdminOrder>(
//     `/api/admin/orders/${encodeURIComponent(
//       String(orderId),
//     )}`,
//     {
//       method: "PATCH",
//       body: JSON.stringify({
//         status,
//       }),
//     },
//   );
// }

// /* -------------------------------------------------------------------------- */
// /* Products                                                                   */
// /* -------------------------------------------------------------------------- */

// export type ProductStatus =
//   | "ACTIVE"
//   | "INACTIVE"
//   | "DISCONTINUED";

// export type AdminProduct = {
//   productId: number;
//   categoryId: number;
//   categoryName: string;

//   productName: string;
//   slug: string;

//   brand: string | null;
//   manufacturer: string | null;

//   description: string | null;
//   composition: string | null;
//   dosageForm: string | null;

//   prescriptionRequired: boolean;
//   productStatus: ProductStatus;
// };

// export type ProductRequest = {
//   categoryId: number;

//   productName: string;
//   slug: string;

//   brand?: string;
//   manufacturer?: string;

//   description?: string;
//   composition?: string;
//   dosageForm?: string;

//   prescriptionRequired: boolean;
//   productStatus: ProductStatus;
// };

// export async function fetchAdminProducts(): Promise<AdminProduct[]> {
//   return adminRequest<AdminProduct[]>(
//     "/api/products",
//   );
// }

// export async function fetchAdminProduct(
//   productId: number,
// ): Promise<AdminProduct> {
//   return adminRequest<AdminProduct>(
//     `/api/products/${productId}`,
//   );
// }

// export async function createAdminProduct(
//   request: ProductRequest,
// ): Promise<AdminProduct> {
//   return adminRequest<AdminProduct>(
//     "/api/products",
//     {
//       method: "POST",
//       body: JSON.stringify(request),
//     },
//   );
// }

// export async function updateAdminProduct(
//   productId: number,
//   request: ProductRequest,
// ): Promise<AdminProduct> {
//   return adminRequest<AdminProduct>(
//     `/api/products/${productId}`,
//     {
//       method: "PUT",
//       body: JSON.stringify(request),
//     },
//   );
// }

// export async function deleteAdminProduct(
//   productId: number,
// ): Promise<void> {
//   await adminRequest<unknown>(
//     `/api/products/${productId}`,
//     {
//       method: "DELETE",
//     },
//   );
// }

// /* -------------------------------------------------------------------------- */
// /* Product variants                                                           */
// /* -------------------------------------------------------------------------- */

// export type ProductVariant = {
//   variantId: number;
//   productId: number;
//   productName: string;

//   sku: string;
//   variantName: string | null;
//   strength: string | null;
//   packSize: string | null;
//   unitOfMeasure: string | null;

//   mrp: number;
//   sellingPrice: number;
//   gstPercentage: number;

//   reorderLevel: number;

//   weight: number | null;
//   dimensions: string | null;

//   isActive: boolean;
// };

// export type ProductVariantRequest = {
//   productId: number;

//   sku: string;

//   variantName?: string;
//   strength?: string;
//   packSize?: string;
//   unitOfMeasure?: string;

//   mrp: number;
//   sellingPrice: number;
//   gstPercentage: number;

//   reorderLevel: number;

//   weight?: number;
//   dimensions?: string;

//   isActive: boolean;
// };

// export async function fetchAdminVariants(): Promise<ProductVariant[]> {
//   return adminRequest<ProductVariant[]>(
//     "/api/product-variants",
//   );
// }

// export async function fetchAdminVariant(
//   variantId: number,
// ): Promise<ProductVariant> {
//   return adminRequest<ProductVariant>(
//     `/api/product-variants/${variantId}`,
//   );
// }

// export async function fetchVariantsByProduct(
//   productId: number,
// ): Promise<ProductVariant[]> {
//   return adminRequest<ProductVariant[]>(
//     `/api/product-variants/product/${productId}`,
//   );
// }

// export async function createAdminVariant(
//   request: ProductVariantRequest,
// ): Promise<ProductVariant> {
//   return adminRequest<ProductVariant>(
//     "/api/product-variants",
//     {
//       method: "POST",
//       body: JSON.stringify(request),
//     },
//   );
// }

// export async function updateAdminVariant(
//   variantId: number,
//   request: ProductVariantRequest,
// ): Promise<ProductVariant> {
//   return adminRequest<ProductVariant>(
//     `/api/product-variants/${variantId}`,
//     {
//       method: "PUT",
//       body: JSON.stringify(request),
//     },
//   );
// }

// export async function deleteAdminVariant(
//   variantId: number,
// ): Promise<void> {
//   await adminRequest<unknown>(
//     `/api/product-variants/${variantId}`,
//     {
//       method: "DELETE",
//     },
//   );
// }



// // /**
// //  * Admin API service — Pradnyasanskar
// //  *
// //  * Authentication:
// //  * JWT Bearer token returned by /api/auth/login
// //  */

// // import type {
// //   Order,
// //   OrderStatus,
// // } from "./orders";

// // /* -------------------------------------------------------------------------- */
// // /* Configuration                                                              */
// // /* -------------------------------------------------------------------------- */

// // const API_BASE = "";

// // const ADMIN_TOKEN_KEY = "ps_admin_token";

// // /* -------------------------------------------------------------------------- */
// // /* Login types                                                                */
// // /* -------------------------------------------------------------------------- */

// // export type AdminLoginUser = {
// //   userId: number;
// //   firstName: string;
// //   lastName: string;
// //   email: string;
// //   mobileNumber: string;
// //   role: string;
// // };

// // export type AdminLoginResponse = {
// //   token: string;
// //   message?: string;
// //   user: AdminLoginUser;
// // };

// // /* -------------------------------------------------------------------------- */
// // /* Token helpers                                                              */
// // /* -------------------------------------------------------------------------- */

// // export function getAdminToken(): string | null {
// //   if (typeof window === "undefined") {
// //     return null;
// //   }

// //   try {
// //     return localStorage.getItem(ADMIN_TOKEN_KEY);
// //   } catch {
// //     return null;
// //   }
// // }

// // export function setAdminToken(token: string): void {
// //   if (typeof window === "undefined") {
// //     return;
// //   }

// //   try {
// //     localStorage.setItem(ADMIN_TOKEN_KEY, token);
// //   } catch {
// //     // Ignore localStorage errors.
// //   }
// // }

// // export function clearAdminToken(): void {
// //   if (typeof window === "undefined") {
// //     return;
// //   }

// //   try {
// //     localStorage.removeItem(ADMIN_TOKEN_KEY);
// //   } catch {
// //     // Ignore localStorage errors.
// //   }
// // }

// // /* -------------------------------------------------------------------------- */
// // /* Generic request                                                            */
// // /* -------------------------------------------------------------------------- */

// // async function adminRequest<T>(
// //   path: string,
// //   options: RequestInit = {},
// //   includeAuth = true,
// // ): Promise<T> {
// //   const token = includeAuth ? getAdminToken() : null;

// //   const headers = new Headers(options.headers);

// //   if (!headers.has("Content-Type")) {
// //     headers.set("Content-Type", "application/json");
// //   }

// //   if (token) {
// //     headers.set("Authorization", `Bearer ${token}`);
// //   }

// //   const response = await fetch(`${API_BASE}${path}`, {
// //     ...options,
// //     headers,
// //     cache: "no-store",
// //   });

// //   const contentType =
// //     response.headers.get("content-type") ?? "";

// //   let data: unknown = null;

// //   if (contentType.includes("application/json")) {
// //     data = await response.json().catch(() => null);
// //   } else {
// //     const text = await response.text().catch(() => "");
// //     data = text || null;
// //   }

// //   /* ---------------------------------------------------------------------- */
// //   /* 401                                                                    */
// //   /* ---------------------------------------------------------------------- */

// //   if (response.status === 401) {
// //     clearAdminToken();
// //     throw new Error("UNAUTHORIZED");
// //   }

// //   /* ---------------------------------------------------------------------- */
// //   /* 403                                                                    */
// //   /* ---------------------------------------------------------------------- */

// //   if (response.status === 403) {
// //     throw new Error(
// //       "You are not authorized to access the admin panel.",
// //     );
// //   }

// //   /* ---------------------------------------------------------------------- */
// //   /* Other errors                                                           */
// //   /* ---------------------------------------------------------------------- */

// //   if (!response.ok) {
// //     const errorData = data as
// //       | {
// //           message?: string;
// //           error?: string;
// //         }
// //       | null;

// //     throw new Error(
// //       errorData?.message ??
// //         errorData?.error ??
// //         (typeof data === "string" && data
// //           ? data
// //           : `Request failed: ${response.status}`),
// //     );
// //   }

// //   return data as T;
// // }

// // /* -------------------------------------------------------------------------- */
// // /* Admin login                                                               */
// // /* -------------------------------------------------------------------------- */

// // export async function adminLogin(
// //   email: string,
// //   password: string,
// // ): Promise<AdminLoginResponse> {
// //   const response =
// //     await adminRequest<AdminLoginResponse>(
// //       "/api/auth/login",
// //       {
// //         method: "POST",
// //         body: JSON.stringify({
// //           email: email.trim(),
// //           password,
// //         }),
// //       },
// //       false,
// //     );

// //   if (!response) {
// //     throw new Error("Invalid response from server.");
// //   }

// //   if (!response.user) {
// //     throw new Error(
// //       "Invalid login response from server.",
// //     );
// //   }

// //   if (response.user.role !== "ADMIN") {
// //     throw new Error(
// //       "This account does not have admin access.",
// //     );
// //   }

// //   if (!response.token) {
// //     throw new Error(
// //       "Login succeeded but no authentication token was returned.",
// //     );
// //   }

// //   setAdminToken(response.token);

// //   return response;
// // }

// // /* -------------------------------------------------------------------------- */
// // /* Logout                                                                     */
// // /* -------------------------------------------------------------------------- */

// // export function adminLogout(): void {
// //   clearAdminToken();
// // }

// // /* -------------------------------------------------------------------------- */
// // /* Dashboard                                                                  */
// // /* -------------------------------------------------------------------------- */

// // export type AnalyticsSummary = {
// //   totalUsers: number;
// //   activeUsers: number;

// //   totalProducts: number;
// //   totalCategories: number;

// //   totalOrders: number;
// //   pendingOrders: number;
// //   completedOrders: number;
// //   cancelledOrders: number;

// //   totalRevenue: number;

// //   totalCoupons: number;
// //   activeCoupons: number;

// //   totalReviews: number;
// //   averageRating: number;
// // };

// // export async function fetchAnalyticsSummary(): Promise<AnalyticsSummary> {
// //   return adminRequest<AnalyticsSummary>(
// //     "/api/admin/dashboard",
// //   );
// // }

// // /* -------------------------------------------------------------------------- */
// // /* Admin orders                                                               */
// // /* -------------------------------------------------------------------------- */

// // /**
// //  * Your orders.ts already has `Order`.
// //  *
// //  * We use Order as the canonical type and keep AdminOrder as an alias
// //  * so existing admin pages do not break.
// //  */
// // export type AdminOrder = Order;

// // export type AdminOrdersResponse = {
// //   orders: AdminOrder[];
// //   total: number;
// // };

// // export type FetchAdminOrdersParams = {
// //   status?: OrderStatus | "All";
// //   search?: string;
// //   page?: number;
// //   limit?: number;
// // };

// // export async function fetchAdminOrders(
// //   params: FetchAdminOrdersParams = {},
// // ): Promise<AdminOrdersResponse> {
// //   const query = new URLSearchParams();

// //   if (
// //     params.status &&
// //     params.status !== "All"
// //   ) {
// //     query.set("status", params.status);
// //   }

// //   if (params.search?.trim()) {
// //     query.set(
// //       "search",
// //       params.search.trim(),
// //     );
// //   }

// //   if (params.page !== undefined) {
// //     query.set(
// //       "page",
// //       String(params.page),
// //     );
// //   }

// //   if (params.limit !== undefined) {
// //     query.set(
// //       "limit",
// //       String(params.limit),
// //     );
// //   }

// //   const queryString = query.toString();

// //   const path = queryString
// //     ? `/api/admin/orders?${queryString}`
// //     : "/api/admin/orders";

// //   return adminRequest<AdminOrdersResponse>(path);
// // }

// // /* -------------------------------------------------------------------------- */
// // /* Update order status                                                        */
// // /* -------------------------------------------------------------------------- */

// // export async function updateOrderStatus(
// //   orderId: string,
// //   status: OrderStatus,
// // ): Promise<AdminOrder> {
// //   if (!orderId.trim()) {
// //     throw new Error("Order ID is required.");
// //   }

// //   return adminRequest<AdminOrder>(
// //     `/api/admin/orders/${encodeURIComponent(orderId)}`,
// //     {
// //       method: "PATCH",
// //       body: JSON.stringify({
// //         status,
// //       }),
// //     },
// //   );
// // }

// // /* -------------------------------------------------------------------------- */
// // /* Products                                                                   */
// // /* -------------------------------------------------------------------------- */

// // export type ProductStatus =
// //   | "ACTIVE"
// //   | "INACTIVE"
// //   | "DISCONTINUED";

// // export type AdminProduct = {
// //   productId: number;
// //   categoryId: number;
// //   categoryName: string;

// //   productName: string;
// //   slug: string;

// //   brand: string | null;
// //   manufacturer: string | null;

// //   description: string | null;
// //   composition: string | null;
// //   dosageForm: string | null;

// //   prescriptionRequired: boolean;
// //   productStatus: ProductStatus;
// // };

// // /**
// //  * Compatibility alias.
// //  *
// //  * Some of your existing admin pages import `Product` from adminApi.ts.
// //  * Keep that working without creating a second product type.
// //  */
// // export type Product = AdminProduct;

// // export type ProductRequest = {
// //   categoryId: number;

// //   productName: string;
// //   slug: string;

// //   brand?: string;
// //   manufacturer?: string;

// //   description?: string;
// //   composition?: string;
// //   dosageForm?: string;

// //   prescriptionRequired: boolean;
// //   productStatus: ProductStatus;
// // };

// // export async function fetchAdminProducts(): Promise<AdminProduct[]> {
// //   return adminRequest<AdminProduct[]>(
// //     "/api/products",
// //   );
// // }

// // export async function fetchAdminProduct(
// //   productId: number,
// // ): Promise<AdminProduct> {
// //   if (!productId) {
// //     throw new Error("Product ID is required.");
// //   }

// //   return adminRequest<AdminProduct>(
// //     `/api/products/${productId}`,
// //   );
// // }

// // export async function createAdminProduct(
// //   request: ProductRequest,
// // ): Promise<AdminProduct> {
// //   return adminRequest<AdminProduct>(
// //     "/api/products",
// //     {
// //       method: "POST",
// //       body: JSON.stringify(request),
// //     },
// //   );
// // }

// // export async function updateAdminProduct(
// //   productId: number,
// //   request: ProductRequest,
// // ): Promise<AdminProduct> {
// //   if (!productId) {
// //     throw new Error("Product ID is required.");
// //   }

// //   return adminRequest<AdminProduct>(
// //     `/api/products/${productId}`,
// //     {
// //       method: "PUT",
// //       body: JSON.stringify(request),
// //     },
// //   );
// // }

// // export async function deleteAdminProduct(
// //   productId: number,
// // ): Promise<void> {
// //   if (!productId) {
// //     throw new Error("Product ID is required.");
// //   }

// //   await adminRequest<unknown>(
// //     `/api/products/${productId}`,
// //     {
// //       method: "DELETE",
// //     },
// //   );
// // }

// // /* -------------------------------------------------------------------------- */
// // /* Product variants                                                           */
// // /* -------------------------------------------------------------------------- */

// // export type ProductVariant = {
// //   variantId: number;
// //   productId: number;
// //   productName: string;

// //   sku: string;
// //   variantName: string | null;
// //   strength: string | null;
// //   packSize: string | null;
// //   unitOfMeasure: string | null;

// //   mrp: number;
// //   sellingPrice: number;
// //   gstPercentage: number;

// //   reorderLevel: number;

// //   weight: number | null;
// //   dimensions: string | null;

// //   isActive: boolean;
// // };

// // export type ProductVariantRequest = {
// //   productId: number;

// //   sku: string;

// //   variantName?: string;
// //   strength?: string;
// //   packSize?: string;
// //   unitOfMeasure?: string;

// //   mrp: number;
// //   sellingPrice: number;
// //   gstPercentage: number;

// //   reorderLevel: number;

// //   weight?: number;
// //   dimensions?: string;

// //   isActive: boolean;
// // };

// // export async function fetchAdminVariants(): Promise<ProductVariant[]> {
// //   return adminRequest<ProductVariant[]>(
// //     "/api/product-variants",
// //   );
// // }

// // export async function fetchAdminVariant(
// //   variantId: number,
// // ): Promise<ProductVariant> {
// //   if (!variantId) {
// //     throw new Error("Variant ID is required.");
// //   }

// //   return adminRequest<ProductVariant>(
// //     `/api/product-variants/${variantId}`,
// //   );
// // }

// // export async function fetchVariantsByProduct(
// //   productId: number,
// // ): Promise<ProductVariant[]> {
// //   if (!productId) {
// //     throw new Error("Product ID is required.");
// //   }

// //   return adminRequest<ProductVariant[]>(
// //     `/api/product-variants/product/${productId}`,
// //   );
// // }

// // export async function createAdminVariant(
// //   request: ProductVariantRequest,
// // ): Promise<ProductVariant> {
// //   return adminRequest<ProductVariant>(
// //     "/api/product-variants",
// //     {
// //       method: "POST",
// //       body: JSON.stringify(request),
// //     },
// //   );
// // }

// // export async function updateAdminVariant(
// //   variantId: number,
// //   request: ProductVariantRequest,
// // ): Promise<ProductVariant> {
// //   if (!variantId) {
// //     throw new Error("Variant ID is required.");
// //   }

// //   return adminRequest<ProductVariant>(
// //     `/api/product-variants/${variantId}`,
// //     {
// //       method: "PUT",
// //       body: JSON.stringify(request),
// //     },
// //   );
// // }

// // export async function deleteAdminVariant(
// //   variantId: number,
// // ): Promise<void> {
// //   if (!variantId) {
// //     throw new Error("Variant ID is required.");
// //   }

// //   await adminRequest<unknown>(
// //     `/api/product-variants/${variantId}`,
// //     {
// //       method: "DELETE",
// //     },
// //   );
// // }