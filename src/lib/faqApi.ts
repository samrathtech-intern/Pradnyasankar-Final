/**
 * FAQ API service
 *
 * Integration point for the backend team:
 * - GET /api/faqs — returns frequently asked questions
 *   Expected response shape:
 *   { faqs: [{ id, question, answer }] }  OR  [{ id, question, answer }]
 *
 * Set NEXT_PUBLIC_API_BASE_URL in .env.local to point to the backend.
 */

// The browser calls the same-origin Next.js rewrite path (`/api/faqs`),
// which forwards the request server-to-server to the backend at
// NEXT_PUBLIC_API_BASE_URL. This avoids CORS blocking.
const API_BASE = "";

export type Faq = {
  id: number;
  question: string;
  answer: string;
};

/**
 * Fetches the FAQ list from the backend.
 * Normalises both a wrapped `{ faqs: [...] }` response and a bare array.
 * Throws a descriptive error when the request fails.
 */
export async function fetchFAQs(): Promise<Faq[]> {
  const res = await fetch(`${API_BASE}/api/faqs`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch FAQs: ${res.status}`);
  }

  const data = await res.json().catch(() => ({}));

  const list: unknown = Array.isArray(data) ? data : data?.faqs;

  if (!Array.isArray(list)) {
    throw new Error("Unexpected FAQ response shape");
  }

  return list.map((item, index) => {
    if (item && typeof item === "object") {
      const record = item as Record<string, unknown>;
      return {
        id: typeof record.id === "number" ? record.id : index,
        question: String(record.question ?? ""),
        answer: String(record.answer ?? ""),
      };
    }
    return { id: index, question: "", answer: "" };
  });
}
