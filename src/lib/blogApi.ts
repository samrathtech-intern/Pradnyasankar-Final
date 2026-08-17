const API_BASE = "http://localhost:8081";

export interface Blog {
  blogId: number;
  title: string;
  slug: string;
  featuredImageUrl: string;
  summary: string;
  content: string;
  authorId: number;
  authorName: string;
  status: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export async function getBlogs(): Promise<Blog[]> {
  const res = await fetch(`${API_BASE}/api/blogs`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data?.message ?? `Request failed: ${res.status}`
    );
  }

  return data;
}