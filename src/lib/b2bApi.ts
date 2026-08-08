/**
 * B2B enquiry API service
 *
 * Integration point with the backend (confirmed live at NEXT_PUBLIC_API_BASE_URL):
 * - POST /api/b2b-enquiries
 *   Body:
 *   {
 *     companyName,
 *     contactPerson,
 *     designation,        // job title (optional)
 *     email,
 *     mobileNumber,
 *     alternateMobile,    // second contact number (optional)
 *     website,            // company website (optional)
 *     businessType,       // Retailer / Distributor / etc. (optional)
 *     turnover,           // annual turnover range (optional)
 *     enquiryType,
 *     gstNumber,          // optional
 *     city,               // optional
 *     state,              // optional
 *     message,
 *     category,           // optional
 *     quantity            // optional
 *   }
 *   Expected success response: 2xx with { enquiryId, status, ... }
 *
 * Set NEXT_PUBLIC_API_BASE_URL in .env.local to point to the backend.
 */

/**
 * B2B Enquiry API Service
 */

// The browser calls the same-origin Next.js proxy route ("/api/b2b-enquiries"),
// which forwards the request server-to-server to the backend. This avoids CORS
// blocking, since the backend at NEXT_PUBLIC_API_BASE_URL does not allow
// cross-origin requests from the frontend origin.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
const ENQUIRY_URL = "/api/b2b-enquiries";

export interface B2BEnquiry {
  companyName: string;
  contactPerson: string;
  designation?: string;
  email: string;
  mobileNumber: string;
  alternateMobile?: string;
  website?: string;
  businessType?: string;
  turnover?: string;
  enquiryType: string;
  gstNumber?: string;
  city?: string;
  state?: string;
  message: string;
  category?: string;
  quantity?: string;
}

export interface B2BEnquiryResponse {
  enquiryId: number;
  companyName: string;
  contactPerson: string;
  email: string;
  mobileNumber: string;
  gstNumber?: string;
  businessType?: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export async function submitB2BEnquiry(
  data: B2BEnquiry
): Promise<B2BEnquiryResponse> {

  const response = await fetch(ENQUIRY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to submit B2B enquiry.");
  }

  return await response.json();
}