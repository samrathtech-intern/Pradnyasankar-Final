const API_BASE = "http://localhost:8081";

export interface ContentPage {
  pageId: number;
  title: string;
  slug: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  status: string;
  updatedBy: number;
  updatedByName: string;
  createdAt: string;
  updatedAt: string;
}

export async function getContentPageBySlug(
  slug: string
): Promise<ContentPage> {
  const res = await fetch(
    `${API_BASE}/api/content-pages/slug/${slug}`
  );

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      data?.message ?? `Request failed: ${res.status}`
    );
  }

  return data;
}