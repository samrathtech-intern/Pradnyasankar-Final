const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8081";

export type ReturnRequest = {
  returnRequestId: number;
  orderItemId: number;
  orderId: number;
  returnType: string;
  returnStatus: string;
  reason: string;
  customerComments: string | null;
  adminComments: string | null;
  refundAmount: number | null;
  requestedAt: string;
  processedAt: string | null;
  createdBy: number | null;
  processedBy: number | null;
};

export type CreateReturnRequest = {
  orderItemId: number;
  returnType: string;
  reason: string;
  customerComments?: string;
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

// GET ALL RETURN REQUESTS
export async function getAllReturnRequests(): Promise<
  ReturnRequest[]
> {
  return request<ReturnRequest[]>("/api/return-requests", {
    method: "GET",
  });
}

// GET RETURN REQUEST BY ID
export async function getReturnRequestById(
  returnRequestId: number
): Promise<ReturnRequest> {
  return request<ReturnRequest>(
    `/api/return-requests/${returnRequestId}`,
    {
      method: "GET",
    }
  );
}

// CREATE RETURN REQUEST
export async function createReturnRequest(
  requestData: CreateReturnRequest
): Promise<ReturnRequest> {
  return request<ReturnRequest>("/api/return-requests", {
    method: "POST",
    body: JSON.stringify(requestData),
  });
}

// UPDATE RETURN REQUEST STATUS
export async function updateReturnRequestStatus(
  returnRequestId: number,
  status: "REQUESTED" | "APPROVED" | "REJECTED" | "COMPLETED"
): Promise<ReturnRequest> {
  return request<ReturnRequest>(
    `/api/return-requests/${returnRequestId}/status/${status}`,
    {
      method: "PUT",
    }
  );
}