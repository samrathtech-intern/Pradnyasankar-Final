const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8081";

export type WishlistItem = {
  wishlistId: number;
  userId: number;
  variantId: number;
  productName: string;
  variantName: string;
  createdAt: string;
};

async function getHeaders() {
  const token = localStorage.getItem("ps_auth_token");

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// GET wishlist
export async function getWishlist(userId: number): Promise<WishlistItem[]> {
  const headers = await getHeaders();

  const response = await fetch(
    `${API_BASE}/api/wishlist/user/${userId}`,
    {
      method: "GET",
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch wishlist: ${response.status}`);
  }

  return response.json();
}

// Check whether product is already in wishlist
export async function checkWishlist(
  userId: number,
  variantId: number
): Promise<boolean> {
  const headers = await getHeaders();

  const response = await fetch(
    `${API_BASE}/api/wishlist/exists?userId=${userId}&variantId=${variantId}`,
    {
      method: "GET",
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to check wishlist: ${response.status}`);
  }

  return response.json();
}

// ADD to wishlist
export async function addToWishlist(
  userId: number,
  variantId: number
): Promise<WishlistItem> {
  const headers = await getHeaders();

  const response = await fetch(
    `${API_BASE}/api/wishlist`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        userId,
        variantId,
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Failed to add wishlist: ${response.status}`);
  }

  return response.json();
}

// REMOVE from wishlist
export async function removeFromWishlist(
  userId: number,
  variantId: number
): Promise<string> {
  const headers = await getHeaders();

  const response = await fetch(
    `${API_BASE}/api/wishlist?userId=${userId}&variantId=${variantId}`,
    {
      method: "DELETE",
      headers,
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Failed to remove wishlist: ${response.status}`);
  }

  return response.text();
}