"use client";

import { useEffect, useState } from "react";
import {
  getAllReturnRequests,
  updateReturnRequestStatus,
  type ReturnRequest,
} from "@/lib/returnRequestApi";

export default function ReturnRequestsPage() {
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==============================
  // LOAD RETURN REQUESTS
  // ==============================

  async function loadReturnRequests() {
    try {
      setLoading(true);
      setError("");

      const data = await getAllReturnRequests();

      setReturnRequests(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load return requests."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==============================
  // LOAD ON PAGE OPEN
  // ==============================

  useEffect(() => {
    loadReturnRequests();
  }, []);

  // ==============================
  // UPDATE STATUS
  // ==============================

  async function handleStatusUpdate(
    returnRequestId: number,
    status: "APPROVED" | "REJECTED" | "COMPLETED"
  ) {
    try {
      setError("");

      const updatedRequest =
        await updateReturnRequestStatus(
          returnRequestId,
          status
        );

      setReturnRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.returnRequestId === returnRequestId
            ? updatedRequest
            : request
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update return request."
      );
    }
  }

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">
          Return Requests
        </h1>

        <p className="mt-4">
          Loading return requests...
        </p>
      </div>
    );
  }

  // ==============================
  // PAGE
  // ==============================

  return (
    <div className="p-8">

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Return Requests
        </h1>

        <button
          onClick={loadReturnRequests}
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          Refresh
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mt-4 rounded-lg bg-red-100 p-4 text-red-700">
          Error: {error}
        </div>
      )}

      {/* NO DATA */}

      {returnRequests.length === 0 ? (
        <div className="mt-6 rounded-lg border p-6">
          No return requests found.
        </div>
      ) : (
        <div className="mt-6 space-y-4">

          {returnRequests.map((request) => (
            <div
              key={request.returnRequestId}
              className="rounded-xl border p-6 shadow-sm"
            >

              {/* HEADER */}

              <div className="flex items-center justify-between">

                <h2 className="text-lg font-semibold">
                  Return Request #{request.returnRequestId}
                </h2>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium">
                  {request.returnStatus}
                </span>

              </div>

              {/* DETAILS */}

              <div className="mt-4 grid gap-2">

                <p>
                  <strong>Order ID:</strong>{" "}
                  {request.orderId}
                </p>

                <p>
                  <strong>Order Item ID:</strong>{" "}
                  {request.orderItemId}
                </p>

                <p>
                  <strong>Return Type:</strong>{" "}
                  {request.returnType}
                </p>

                <p>
                  <strong>Reason:</strong>{" "}
                  {request.reason}
                </p>

                <p>
                  <strong>Customer Comments:</strong>{" "}
                  {request.customerComments || "N/A"}
                </p>

                <p>
                  <strong>Refund Amount:</strong>{" "}
                  ₹{request.refundAmount ?? 0}
                </p>

                <p>
                  <strong>Requested At:</strong>{" "}
                  {request.requestedAt}
                </p>

                <p>
                  <strong>Processed At:</strong>{" "}
                  {request.processedAt || "Not processed"}
                </p>

              </div>

              {/* ACTION BUTTONS */}

              <div className="mt-5 flex gap-3">

                {request.returnStatus === "REQUESTED" && (
                  <>
                    <button
                      onClick={() =>
                        handleStatusUpdate(
                          request.returnRequestId,
                          "APPROVED"
                        )
                      }
                      className="rounded-lg bg-green-600 px-4 py-2 text-white"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        handleStatusUpdate(
                          request.returnRequestId,
                          "REJECTED"
                        )
                      }
                      className="rounded-lg bg-red-600 px-4 py-2 text-white"
                    >
                      Reject
                    </button>
                  </>
                )}

                {request.returnStatus === "APPROVED" && (
                  <button
                    onClick={() =>
                      handleStatusUpdate(
                        request.returnRequestId,
                        "COMPLETED"
                      )
                    }
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                  >
                    Complete
                  </button>
                )}

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}