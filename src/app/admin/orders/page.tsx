"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";

import {
  fetchAdminOrders,
  updateOrderStatus,
} from "@/lib/adminApi";

import type { AdminOrder } from "@/lib/adminApi";
import type { OrderStatus } from "@/lib/orders";

/* -------------------------------------------------------------------------- */
/* Statuses                                                                   */
/* -------------------------------------------------------------------------- */

const ORDER_STATUSES: OrderStatus[] = [
  "CONFIRMED",
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURN_REQUESTED",
  "RETURN_APPROVED",
  "REFUND_PROCESSING",
  "REFUND_COMPLETED",
];

type StatusFilter = "All" | OrderStatus;

const STATUS_FILTERS: StatusFilter[] = [
  "All",
  ...ORDER_STATUSES,
];

/* -------------------------------------------------------------------------- */
/* Status colors                                                              */
/* -------------------------------------------------------------------------- */

const STATUS_COLORS: Record<OrderStatus, string> = {
  CONFIRMED: "bg-[#EAF4E4] text-[#315C20]",
  PREPARING: "bg-[#FFF3CD] text-[#7A5200]",
  SHIPPED: "bg-[#E3EEFF] text-[#1A4F8A]",
  DELIVERED: "bg-[#EAF4E4] text-[#315C20]",
  CANCELLED: "bg-[#FDECEA] text-[#8B1A1A]",
  RETURN_REQUESTED: "bg-[#FFF3CD] text-[#7A5200]",
  RETURN_APPROVED: "bg-[#E3EEFF] text-[#1A4F8A]",
  REFUND_PROCESSING: "bg-[#FFF3CD] text-[#7A5200]",
  REFUND_COMPLETED: "bg-[#EAF4E4] text-[#315C20]",
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatDate(
  value: string | null | undefined,
): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatStatus(
  status: OrderStatus,
): string {
  const words: string[] = status
    .toLowerCase()
    .split("_");

  return words
    .map(
      (word: string) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}

function formatCurrency(
  value: unknown,
): string {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "-";
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<
    AdminOrder[]
  >([]);

  const [total, setTotal] = useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("All");

  const [updatingId, setUpdatingId] =
    useState<number | null>(null);

  /* ------------------------------------------------------------------------ */
  /* Load orders                                                              */
  /* ------------------------------------------------------------------------ */

  const loadOrders = useCallback(
    async (searchValue?: string) => {
      setLoading(true);
      setError("");

      try {
        const currentSearch =
          searchValue !== undefined
            ? searchValue
            : search;

        const response =
          await fetchAdminOrders({
            status: statusFilter,
            search:
              currentSearch.trim() ||
              undefined,
            limit: 50,
          });

        setOrders(response.orders);
        setTotal(response.total);
      } catch (err) {
        console.error(
          "Failed to load orders:",
          err,
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load orders.",
        );
      } finally {
        setLoading(false);
      }
    },
    [search, statusFilter],
  );

  /* ------------------------------------------------------------------------ */
  /* Initial load / status change                                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    loadOrders();
  }, [statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ------------------------------------------------------------------------ */
  /* Refresh                                                                  */
  /* ------------------------------------------------------------------------ */

  function handleRefresh() {
    loadOrders();
  }

  /* ------------------------------------------------------------------------ */
  /* Search                                                                   */
  /* ------------------------------------------------------------------------ */

  function handleSearch() {
    loadOrders(search);
  }

  /* ------------------------------------------------------------------------ */
  /* Update order status                                                       */
  /* ------------------------------------------------------------------------ */

  async function handleStatusChange(
    orderId: number,
    status: OrderStatus,
  ) {
    setUpdatingId(orderId);
    setError("");

    try {
      const updatedOrder =
        await updateOrderStatus(
          orderId,
          status,
        );

      setOrders((previous) =>
        previous.map((order) =>
          order.orderId === orderId
            ? updatedOrder
            : order,
        ),
      );
    } catch (err) {
      console.error(
        "Failed to update order status:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update order status.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* UI                                                                       */
  /* ------------------------------------------------------------------------ */

  return (
    <div>
      {/* HEADER */}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-extrabold tracking-[-.04em] text-[#2E0569]">
            Orders
          </h1>

          <p className="mt-1 text-[13px] text-[#716A78]">
            {total} total orders
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full border border-[#E9E3EE] bg-white px-4 py-2 text-[12px] font-extrabold text-[#2E0569] transition hover:border-[#8C52FF] hover:text-[#8C52FF] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={13}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>
      </div>

      {/* TOOLBAR */}

      <div className="mb-5 flex flex-wrap gap-3">
        {/* SEARCH */}

        <div className="flex min-h-10 flex-1 items-center gap-2 rounded-[12px] border border-[#E9E3EE] bg-white px-3">
          <Search
            size={14}
            className="shrink-0 text-[#8C52FF]"
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Search by order number, customer or mobile..."
            className="w-full bg-transparent text-[13px] font-semibold text-[#2E0569] outline-none placeholder:text-[#9B93A1]"
          />
        </div>

        {/* STATUS */}

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target
                .value as StatusFilter,
            )
          }
          className="min-h-10 rounded-[12px] border border-[#E9E3EE] bg-white px-3 text-[12px] font-extrabold text-[#2E0569] outline-none"
        >
          {STATUS_FILTERS.map(
            (status) => (
              <option
                key={status}
                value={status}
              >
                {status === "All"
                  ? "All"
                  : formatStatus(status)}
              </option>
            ),
          )}
        </select>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-5 flex items-start justify-between gap-3 rounded-[14px] bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">
          <div>
            <p>{error}</p>

            <p className="mt-1 text-[11px] font-normal text-red-400">
              Check that the backend API is
              running and that the admin token
              is valid.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setError("")}
            className="shrink-0 text-red-400 hover:text-red-600"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {/* LOADING */}

      {loading && (
        <div className="flex items-center gap-2 py-10 text-[13px] text-[#716A78]">
          <Loader2
            size={16}
            className="animate-spin text-[#8C52FF]"
          />

          Loading orders...
        </div>
      )}

      {/* TABLE */}

      {!loading && (
        <div className="overflow-hidden rounded-[20px] border border-[#E9E3EE] bg-white">
          {orders.length === 0 ? (
            <div className="py-16 text-center text-[14px] font-semibold text-[#716A78]">
              No orders found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="border-b border-[#E9E3EE] bg-[#FAFAFA]">
                  <tr>
                    {[
                      "Order",
                      "Date",
                      "Customer",
                      "Items",
                      "Total",
                      "Status",
                      "Update Status",
                    ].map(
                      (heading) => (
                        <th
                          key={heading}
                          className="whitespace-nowrap px-4 py-3 text-[10px] font-extrabold uppercase tracking-[.1em] text-[#8B8292]"
                        >
                          {heading}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F0EAF4]">
                  {orders.map(
                    (order) => {
                      const customerName =
                        order.customerName ||
                        order.fullName ||
                        "-";

                      return (
                        <tr
                          key={
                            order.orderId
                          }
                          className="transition-colors hover:bg-[#FAFAFA]"
                        >
                          {/* ORDER */}

                          <td className="px-4 py-3">
                            <p className="whitespace-nowrap font-extrabold text-[#2E0569]">
                              {
                                order.orderNumber
                              }
                            </p>

                            <p className="text-[10px] text-[#9B93A1]">
                              ID #
                              {
                                order.orderId
                              }
                            </p>
                          </td>

                          {/* DATE */}

                          <td className="whitespace-nowrap px-4 py-3 text-[#716A78]">
                            {formatDate(
                              order.orderedAt,
                            )}
                          </td>

                          {/* CUSTOMER */}

                          <td className="px-4 py-3">
                            <p className="whitespace-nowrap font-semibold text-[#2E0569]">
                              {
                                customerName
                              }
                            </p>

                            <p className="text-[11px] text-[#8B8292]">
                              {order.mobileNumber ||
                                "-"}
                            </p>
                          </td>

                          {/* ITEMS */}

                          <td className="px-4 py-3 text-[#716A78]">
                            {Array.isArray(
                              order.items,
                            )
                              ? order.items
                                  .length
                              : 0}
                          </td>

                          {/* TOTAL */}

                          <td className="whitespace-nowrap px-4 py-3 font-extrabold text-[#2E0569]">
                            {formatCurrency(
                              order.totalAmount,
                            )}
                          </td>

                          {/* STATUS */}

                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
                                STATUS_COLORS[
                                  order
                                    .orderStatus
                                ]
                              }`}
                            >
                              {formatStatus(
                                order.orderStatus,
                              )}
                            </span>
                          </td>

                          {/* UPDATE STATUS */}

                          <td className="px-4 py-3">
                            {updatingId ===
                            order.orderId ? (
                              <div className="flex h-8 items-center justify-center px-3">
                                <Loader2
                                  size={14}
                                  className="animate-spin text-[#8C52FF]"
                                />
                              </div>
                            ) : (
                              <select
                                value={
                                  order.orderStatus
                                }
                                disabled={
                                  updatingId !==
                                  null
                                }
                                onChange={(
                                  event,
                                ) =>
                                  handleStatusChange(
                                    order.orderId,
                                    event
                                      .target
                                      .value as OrderStatus,
                                  )
                                }
                                className="rounded-[10px] border border-[#E9E3EE] bg-white px-2 py-1.5 text-[11px] font-extrabold text-[#2E0569] outline-none transition hover:border-[#8C52FF] disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {ORDER_STATUSES.map(
                                  (
                                    status,
                                  ) => (
                                    <option
                                      key={
                                        status
                                      }
                                      value={
                                        status
                                      }
                                    >
                                      {formatStatus(
                                        status,
                                      )}
                                    </option>
                                  ),
                                )}
                              </select>
                            )}
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


// "use client";

// import { useCallback, useEffect, useState } from "react";
// import {
//   Loader2,
//   RefreshCw,
//   Search,
// } from "lucide-react";

// import {
//   fetchAdminOrders,
//   updateOrderStatus,
// } from "@/lib/adminApi";

// import type {
//   AdminOrder,
//   OrderStatus,
// } from "@/lib/adminApi";

// /* -------------------------------------------------------------------------- */
// /* Statuses                                                                   */
// /* -------------------------------------------------------------------------- */

// const ORDER_STATUSES: OrderStatus[] = [
//   "CONFIRMED",
//   "PREPARING",
//   "SHIPPED",
//   "DELIVERED",
//   "CANCELLED",
//   "RETURN_REQUESTED",
//   "RETURN_APPROVED",
//   "REFUND_PROCESSING",
//   "REFUND_COMPLETED",
// ];

// type StatusFilter = "All" | OrderStatus;

// const STATUS_FILTERS: StatusFilter[] = [
//   "All",
//   ...ORDER_STATUSES,
// ];

// /* -------------------------------------------------------------------------- */
// /* Status colors                                                              */
// /* -------------------------------------------------------------------------- */

// const STATUS_COLORS: Record<OrderStatus, string> = {
//   CONFIRMED: "bg-[#EAF4E4] text-[#315C20]",
//   PREPARING: "bg-[#FFF3CD] text-[#7A5200]",
//   SHIPPED: "bg-[#E3EEFF] text-[#1A4F8A]",
//   DELIVERED: "bg-[#EAF4E4] text-[#315C20]",
//   CANCELLED: "bg-[#FDECEA] text-[#8B1A1A]",
//   RETURN_REQUESTED: "bg-[#FFF3CD] text-[#7A5200]",
//   RETURN_APPROVED: "bg-[#E3EEFF] text-[#1A4F8A]",
//   REFUND_PROCESSING: "bg-[#FFF3CD] text-[#7A5200]",
//   REFUND_COMPLETED: "bg-[#EAF4E4] text-[#315C20]",
// };

// /* -------------------------------------------------------------------------- */
// /* Helpers                                                                    */
// /* -------------------------------------------------------------------------- */

// function formatDate(value: string | null | undefined) {
//   if (!value) {
//     return "-";
//   }

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) {
//     return "-";
//   }

//   return date.toLocaleDateString("en-IN", {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   });
// }

// function formatStatus(status: OrderStatus): string {
//   const words: string[] = status
//     .toLowerCase()
//     .split("_");

//   return words
//     .map((word: string) =>
//       word.charAt(0).toUpperCase() +
//       word.slice(1),
//     )
//     .join(" ");
// }

// function formatCurrency(value: unknown) {
//   const amount = Number(value);

//   if (!Number.isFinite(amount)) {
//     return "-";
//   }

//   return `₹${amount.toLocaleString("en-IN")}`;
// }

// /* -------------------------------------------------------------------------- */
// /* Page                                                                       */
// /* -------------------------------------------------------------------------- */

// export default function AdminOrdersPage() {
//   const [orders, setOrders] = useState<AdminOrder[]>([]);
//   const [total, setTotal] = useState(0);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [search, setSearch] = useState("");

//   const [statusFilter, setStatusFilter] =
//     useState<StatusFilter>("All");

//   const [updatingId, setUpdatingId] =
//     useState<number | null>(null);

//   /* ------------------------------------------------------------------------ */
//   /* Load orders                                                              */
//   /* ------------------------------------------------------------------------ */

//   const loadOrders = useCallback(
//     async (searchValue?: string) => {
//       setLoading(true);
//       setError("");

//       try {
//         const currentSearch =
//           searchValue !== undefined
//             ? searchValue
//             : search;

//         const response = await fetchAdminOrders({
//           status: statusFilter,
//           search:
//             currentSearch.trim() || undefined,
//           limit: 50,
//         });

//         setOrders(response.orders);
//         setTotal(response.total);
//       } catch (err) {
//         console.error("Failed to load orders:", err);

//         setError(
//           err instanceof Error
//             ? err.message
//             : "Failed to load orders.",
//         );
//       } finally {
//         setLoading(false);
//       }
//     },
//     [search, statusFilter],
//   );

//   /* ------------------------------------------------------------------------ */
//   /* Initial load / status change                                             */
//   /* ------------------------------------------------------------------------ */

//   useEffect(() => {
//     loadOrders();
//   }, [statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

//   /* ------------------------------------------------------------------------ */
//   /* Refresh                                                                  */
//   /* ------------------------------------------------------------------------ */

//   function handleRefresh() {
//     loadOrders();
//   }

//   /* ------------------------------------------------------------------------ */
//   /* Search                                                                   */
//   /* ------------------------------------------------------------------------ */

//   function handleSearch() {
//     loadOrders(search);
//   }

//   /* ------------------------------------------------------------------------ */
//   /* Update order status                                                       */
//   /* ------------------------------------------------------------------------ */

//   async function handleStatusChange(
//     orderId: number,
//     status: OrderStatus,
//   ) {
//     setUpdatingId(orderId);
//     setError("");

//     try {
//       const updatedOrder =
//         await updateOrderStatus(
//           orderId,
//           status,
//         );

//       setOrders((previous) =>
//         previous.map((order) =>
//           order.orderId === orderId
//             ? updatedOrder
//             : order,
//         ),
//       );
//     } catch (err) {
//       console.error(
//         "Failed to update order status:",
//         err,
//       );

//       setError(
//         err instanceof Error
//           ? err.message
//           : "Failed to update order status.",
//       );
//     } finally {
//       setUpdatingId(null);
//     }
//   }

//   /* ------------------------------------------------------------------------ */
//   /* UI                                                                       */
//   /* ------------------------------------------------------------------------ */

//   return (
//     <div>
//       {/* HEADER */}

//       <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
//         <div>
//           <h1 className="text-[24px] font-extrabold tracking-[-.04em] text-[#2E0569]">
//             Orders
//           </h1>

//           <p className="mt-1 text-[13px] text-[#716A78]">
//             {total} total orders
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={handleRefresh}
//           disabled={loading}
//           className="inline-flex items-center gap-2 rounded-full border border-[#E9E3EE] bg-white px-4 py-2 text-[12px] font-extrabold text-[#2E0569] transition hover:border-[#8C52FF] hover:text-[#8C52FF] disabled:cursor-not-allowed disabled:opacity-50"
//         >
//           <RefreshCw
//             size={13}
//             className={
//               loading
//                 ? "animate-spin"
//                 : ""
//             }
//           />

//           Refresh
//         </button>
//       </div>

//       {/* TOOLBAR */}

//       <div className="mb-5 flex flex-wrap gap-3">
//         {/* SEARCH */}

//         <div className="flex min-h-10 flex-1 items-center gap-2 rounded-[12px] border border-[#E9E3EE] bg-white px-3">
//           <Search
//             size={14}
//             className="shrink-0 text-[#8C52FF]"
//           />

//           <input
//             type="search"
//             value={search}
//             onChange={(event) =>
//               setSearch(event.target.value)
//             }
//             onKeyDown={(event) => {
//               if (event.key === "Enter") {
//                 handleSearch();
//               }
//             }}
//             placeholder="Search by order number, customer or mobile..."
//             className="w-full bg-transparent text-[13px] font-semibold text-[#2E0569] outline-none placeholder:text-[#9B93A1]"
//           />
//         </div>

//         {/* STATUS */}

//         <select
//           value={statusFilter}
//           onChange={(event) =>
//             setStatusFilter(
//               event.target.value as StatusFilter,
//             )
//           }
//           className="min-h-10 rounded-[12px] border border-[#E9E3EE] bg-white px-3 text-[12px] font-extrabold text-[#2E0569] outline-none"
//         >
//           {STATUS_FILTERS.map((status) => (
//             <option
//               key={status}
//               value={status}
//             >
//               {status === "All"
//                 ? "All"
//                 : formatStatus(status)}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* ERROR */}

//       {error && (
//         <div className="mb-5 flex items-start justify-between gap-3 rounded-[14px] bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">
//           <div>
//             <p>{error}</p>

//             <p className="mt-1 text-[11px] font-normal text-red-400">
//               Check that the backend API is running
//               and that the admin token is valid.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={() => setError("")}
//             className="shrink-0 text-red-400 hover:text-red-600"
//             aria-label="Dismiss error"
//           >
//             ×
//           </button>
//         </div>
//       )}

//       {/* LOADING */}

//       {loading && (
//         <div className="flex items-center gap-2 py-10 text-[13px] text-[#716A78]">
//           <Loader2
//             size={16}
//             className="animate-spin text-[#8C52FF]"
//           />

//           Loading orders...
//         </div>
//       )}

//       {/* TABLE */}

//       {!loading && (
//         <div className="overflow-hidden rounded-[20px] border border-[#E9E3EE] bg-white">
//           {orders.length === 0 ? (
//             <div className="py-16 text-center text-[14px] font-semibold text-[#716A78]">
//               No orders found.
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left text-[13px]">
//                 <thead className="border-b border-[#E9E3EE] bg-[#FAFAFA]">
//                   <tr>
//                     {[
//                       "Order",
//                       "Date",
//                       "Customer",
//                       "Items",
//                       "Total",
//                       "Status",
//                       "Update Status",
//                     ].map((heading) => (
//                       <th
//                         key={heading}
//                         className="whitespace-nowrap px-4 py-3 text-[10px] font-extrabold uppercase tracking-[.1em] text-[#8B8292]"
//                       >
//                         {heading}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-[#F0EAF4]">
//                   {orders.map((order) => {
//                     const customerName =
//                       order.customerName ||
//                       order.fullName ||
//                       "-";

//                     return (
//                       <tr
//                         key={order.orderId}
//                         className="transition-colors hover:bg-[#FAFAFA]"
//                       >
//                         {/* ORDER */}

//                         <td className="px-4 py-3">
//                           <p className="whitespace-nowrap font-extrabold text-[#2E0569]">
//                             {order.orderNumber}
//                           </p>

//                           <p className="text-[10px] text-[#9B93A1]">
//                             ID #{order.orderId}
//                           </p>
//                         </td>

//                         {/* DATE */}

//                         <td className="whitespace-nowrap px-4 py-3 text-[#716A78]">
//                           {formatDate(
//                             order.orderedAt,
//                           )}
//                         </td>

//                         {/* CUSTOMER */}

//                         <td className="px-4 py-3">
//                           <p className="whitespace-nowrap font-semibold text-[#2E0569]">
//                             {customerName}
//                           </p>

//                           <p className="text-[11px] text-[#8B8292]">
//                             {order.mobileNumber ||
//                               "-"}
//                           </p>
//                         </td>

//                         {/* ITEMS */}

//                         <td className="px-4 py-3 text-[#716A78]">
//                           {Array.isArray(
//                             order.items,
//                           )
//                             ? order.items.length
//                             : 0}
//                         </td>

//                         {/* TOTAL */}

//                         <td className="whitespace-nowrap px-4 py-3 font-extrabold text-[#2E0569]">
//                           {formatCurrency(
//                             order.totalAmount,
//                           )}
//                         </td>

//                         {/* STATUS */}

//                         <td className="px-4 py-3">
//                           <span
//                             className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
//                               STATUS_COLORS[
//                                 order.orderStatus
//                               ]
//                             }`}
//                           >
//                             {formatStatus(
//                               order.orderStatus,
//                             )}
//                           </span>
//                         </td>

//                         {/* UPDATE STATUS */}

//                         <td className="px-4 py-3">
//                           {updatingId ===
//                           order.orderId ? (
//                             <div className="flex h-8 items-center justify-center px-3">
//                               <Loader2
//                                 size={14}
//                                 className="animate-spin text-[#8C52FF]"
//                               />
//                             </div>
//                           ) : (
//                             <select
//                               value={
//                                 order.orderStatus
//                               }
//                               disabled={
//                                 updatingId !== null
//                               }
//                               onChange={(event) =>
//                                 handleStatusChange(
//                                   order.orderId,
//                                   event.target
//                                     .value as OrderStatus,
//                                 )
//                               }
//                               className="rounded-[10px] border border-[#E9E3EE] bg-white px-2 py-1.5 text-[11px] font-extrabold text-[#2E0569] outline-none transition hover:border-[#8C52FF] disabled:cursor-not-allowed disabled:opacity-50"
//                             >
//                               {ORDER_STATUSES.map(
//                                 (status) => (
//                                   <option
//                                     key={status}
//                                     value={status}
//                                   >
//                                     {formatStatus(
//                                       status,
//                                     )}
//                                   </option>
//                                 ),
//                               )}
//                             </select>
//                           )}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }