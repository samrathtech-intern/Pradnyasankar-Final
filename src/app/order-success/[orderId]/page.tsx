"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OrderSuccessPage() {
  const params = useParams();
  const router = useRouter();

  const orderId = params?.orderId as string;

  useEffect(() => {
    console.log("========================================");
    console.log("ORDER SUCCESS PAGE");
    console.log("========================================");
    console.log("Order ID:", orderId);
  }, [orderId]);

  if (!orderId) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>
          <h1>Invalid Order</h1>
          <p>Order ID was not provided.</p>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          textAlign: "center",
          padding: "40px",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          background: "#ffffff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            width: "70px",
            height: "70px",
            margin: "0 auto 20px",
            borderRadius: "50%",
            background: "#16a34a",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "36px",
            fontWeight: "bold",
          }}
        >
          ✓
        </div>

        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            marginBottom: "12px",
          }}
        >
          Payment Successful
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "#555",
            marginBottom: "10px",
          }}
        >
          Your order has been placed successfully.
        </p>

        <p
          style={{
            fontSize: "16px",
            color: "#777",
            marginBottom: "30px",
          }}
        >
          Order ID: <strong>#{orderId}</strong>
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => router.push("/")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              background: "#8C52FF",
              color: "#ffffff",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Continue Shopping
          </button>

          <button
            onClick={() => router.push("/profile/orders")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "1px solid #8C52FF",
              background: "#ffffff",
              color: "#8C52FF",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            View My Orders
          </button>
        </div>
      </div>
    </main>
  );
}