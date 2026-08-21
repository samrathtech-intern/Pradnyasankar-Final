import type {
  WishlistRequestDTO,
  WishlistResponseDTO,
} from "@/types/wishlist";

const WISHLIST_API_URL = "http://localhost:8080/api/wishlist";

// ============================================================
// HANDLE RESPONSE
// ============================================================

async function handleResponse<T>(
  response: Response
): Promise<T> {
  const contentType =
    response.headers.get("content-type") ?? "";

  const text = await response.text();

  if (!response.ok) {
    if (contentType.includes("application/json") && text) {
      try {
        const data = JSON.parse(text);

        throw new Error(
          data?.message ||
            data?.error ||
            "Wishlist request failed."
        );
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }

        throw new Error("Wishlist request failed.");
      }
    }

    throw new Error(
      text || "Wishlist request failed."
    );
  }

  // Backend returned no body
  if (!text.trim()) {
    return undefined as T;
  }

  if (contentType.includes("application/json")) {
    return JSON.parse(text) as T;
  }

  return text as T;
}

// ============================================================
// GET USER WISHLIST
// ============================================================

export async function getWishlist(
  userId: number,
  token: string
): Promise<WishlistResponseDTO[]> {
  const response = await fetch(
    `${WISHLIST_API_URL}/user/${userId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  return handleResponse<WishlistResponseDTO[]>(
    response
  );
}

// ============================================================
// CHECK WISHLIST
// ============================================================

export async function checkWishlist(
  userId: number,
  variantId: number,
  token: string
): Promise<boolean> {
  const response = await fetch(
    `${WISHLIST_API_URL}/exists?userId=${userId}&variantId=${variantId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  return handleResponse<boolean>(response);
}

// ============================================================
// ADD TO WISHLIST
// ============================================================

export async function addToWishlist(
  userId: number,
  variantId: number,
  token: string
): Promise<WishlistResponseDTO | undefined> {
  const body: WishlistRequestDTO = {
    userId,
    variantId,
  };

  const response = await fetch(
    WISHLIST_API_URL,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  return handleResponse<WishlistResponseDTO | undefined>(
    response
  );
}

// ============================================================
// REMOVE FROM WISHLIST
// ============================================================

export async function removeFromWishlist(
  userId: number,
  variantId: number,
  token: string
): Promise<void> {
  const response = await fetch(
    `${WISHLIST_API_URL}?userId=${userId}&variantId=${variantId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    const contentType =
      response.headers.get("content-type") ?? "";

    const text = await response.text();

    if (
      contentType.includes("application/json") &&
      text
    ) {
      try {
        const data = JSON.parse(text);

        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to remove item from wishlist."
        );
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
      }
    }

    throw new Error(
      text ||
        "Failed to remove item from wishlist."
    );
  }
}