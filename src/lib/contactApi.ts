export type ContactEnquiryPayload = {
  name: string;
  email: string;
  phone: string;
  topic: string;
  orderNumber: string;
  message: string;
  image: File | null;
};

const TOKEN_KEY = "ps_auth_token";

export async function submitContactEnquiry(
  payload: ContactEnquiryPayload
) {
  // ============================================================
  // GET JWT
  // ============================================================

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(TOKEN_KEY)
      : null;

  console.log(
    "CONTACT API: JWT exists:",
    !!token
  );

  if (!token) {
    throw new Error(
      "Authorization token is missing. Please log in again."
    );
  }

  // ============================================================
  // CREATE MULTIPART FORM DATA
  // ============================================================

  const formData = new FormData();

  const data = {
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    topic: payload.topic,
    orderNumber: payload.orderNumber,
    message: payload.message,
  };

  // Spring @RequestPart("data") expects JSON
  const jsonBlob = new Blob(
    [JSON.stringify(data)],
    {
      type: "application/json",
    }
  );

  formData.append(
    "data",
    jsonBlob,
    "data.json"
  );

  // ============================================================
  // OPTIONAL IMAGE
  // ============================================================

  if (
    payload.image &&
    payload.image.size > 0
  ) {
    formData.append(
      "image",
      payload.image,
      payload.image.name
    );
  }

  // ============================================================
  // SEND REQUEST
  // ============================================================

  const response = await fetch(
    "/api/customer/support/enquiries",
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
      },

      body: formData,

      cache: "no-store",

      // Keep this if your application also uses cookies.
      credentials: "include",
    }
  );

  // ============================================================
  // READ RESPONSE
  // ============================================================

  const contentType =
    response.headers.get("content-type") || "";

  let body: unknown;

  if (
    contentType.includes(
      "application/json"
    )
  ) {
    body = await response.json();
  } else {
    body = await response.text();
  }

  console.log(
    "CONTACT API: status:",
    response.status
  );

  console.log(
    "CONTACT API: response:",
    body
  );

  // ============================================================
  // HANDLE ERROR
  // ============================================================

  if (!response.ok) {
    console.error(
      "Contact enquiry API error:",
      response.status,
      body
    );

    let message =
      `Unable to submit enquiry (${response.status}).`;

    if (
      typeof body === "object" &&
      body !== null &&
      "message" in body
    ) {
      const responseMessage = (
        body as {
          message?: unknown;
        }
      ).message;

      if (
        typeof responseMessage === "string" &&
        responseMessage.trim()
      ) {
        message = responseMessage;
      }
    } else if (
      typeof body === "string" &&
      body.trim()
    ) {
      message = body;
    }

    // If backend says unauthorized, make the message clear.
    if (
      response.status === 401
    ) {
      message =
        "Your login session is invalid or expired. Please log in again.";
    }

    if (
      response.status === 403
    ) {
      message =
        "You are not authorized to submit a customer enquiry.";
    }

    throw new Error(message);
  }

  // ============================================================
  // SUCCESS
  // ============================================================

  return body;
}