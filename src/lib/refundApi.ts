const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8081";

export type RefundRequest = {
  paymentId: number;
  refundAmount: number;
  refundReason: string;
};

export type RefundResponse = {
  refundId: number;
  paymentId: number;
  transactionId: string;
  refundAmount: number;
  refundReason: string;
  gatewayRefundId: string | null;
  refundStatus: string;
  refundedAt: string | null;
  createdAt: string;
};

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("ps_auth_token")
      : null;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.body
      ? { "Content-Type": "application/json" }
      : {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();

  let data: unknown;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new Error(
      typeof data === "object" &&
        data !== null &&
        "message" in data
        ? String((data as { message: unknown }).message)
        : `Request failed: ${response.status}`
    );
  }

  return data as T;
}

export async function createRefund(
  refund: RefundRequest
): Promise<RefundResponse> {
  return request<RefundResponse>("/api/refunds", {
    method: "POST",
    body: JSON.stringify(refund),
  });
}

export async function getAllRefunds(): Promise<RefundResponse[]> {
  return request<RefundResponse[]>("/api/refunds", {
    method: "GET",
  });
}

export async function getRefundById(
  refundId: number
): Promise<RefundResponse> {
  return request<RefundResponse>(`/api/refunds/${refundId}`, {
    method: "GET",
  });
}

export async function getRefundsByPayment(
  paymentId: number
): Promise<RefundResponse[]> {
  return request<RefundResponse[]>(
    `/api/refunds/payment/${paymentId}`,
    {
      method: "GET",
    }
  );
}

export async function updateRefundStatus(
  refundId: number,
  refundStatus: string
): Promise<RefundResponse> {
  return request<RefundResponse>(
    `/api/refunds/${refundId}/status?refundStatus=${encodeURIComponent(
      refundStatus
    )}`,
    {
      method: "PATCH",
    }
  );
}