"use client";

import { useEffect, useState } from "react";
import {
  getAllRefunds,
  type RefundResponse,
} from "@/lib/refundApi";

export default function RefundsPage() {
  const [refunds, setRefunds] = useState<RefundResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRefunds() {
      try {
        const data = await getAllRefunds();
        setRefunds(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load refunds."
        );
      } finally {
        setLoading(false);
      }
    }

    loadRefunds();
  }, []);

  if (loading) {
    return <div>Loading refunds...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">
        Refunds
      </h1>

      <pre className="mt-6 rounded-lg bg-gray-100 p-4">
        {JSON.stringify(refunds, null, 2)}
      </pre>
    </div>
  );
}