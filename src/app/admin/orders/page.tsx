"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCw, Search } from "lucide-react";
import { fetchAdminOrders, updateOrderStatus } from "@/lib/adminApi";
import type { Order, OrderStatus } from "@/lib/orders";

const ALL_STATUSES: ("All" | OrderStatus)[] = [
  "All", "Confirmed", "Preparing", "Shipped", "Delivered",
  "Cancelled", "Return Requested", "Return Approved", "Refund Processing", "Refund Completed",
];

const STATUS_COLORS: Record<OrderStatus, string> = {
  Confirmed:           "bg-[#EAF4E4] text-[#315C20]",
  Preparing:           "bg-[#FFF3CD] text-[#7A5200]",
  Shipped:             "bg-[#E3EEFF] text-[#1A4F8A]",
  Delivered:           "bg-[#EAF4E4] text-[#315C20]",
  Cancelled:           "bg-[#FDECEA] text-[#8B1A1A]",
  "Return Requested":  "bg-[#FFF3CD] text-[#7A5200]",
  "Return Approved":   "bg-[#E3EEFF] text-[#1A4F8A]",
  "Refund Processing": "bg-[#FFF3CD] text-[#7A5200]",
  "Refund Completed":  "bg-[#EAF4E4] text-[#315C20]",
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | OrderStatus>("All");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetchAdminOrders({ status: statusFilter, search, limit: 50 });
      setOrders(res.orders);
      setTotal(res.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    setUpdatingId(orderId);
    try {
      const updated = await updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setUpdatingId(null);
    }
  }

  const displayed = search.trim()
    ? orders.filter((o) =>
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.contact.name.toLowerCase().includes(search.toLowerCase()) ||
        o.contact.email.toLowerCase().includes(search.toLowerCase()),
      )
    : orders;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-extrabold tracking-[-.04em] text-[#2E0569]">Orders</h1>
          <p className="mt-1 text-[13px] text-[#716A78]">{total} total orders</p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 rounded-full border border-[#E9E3EE] bg-white px-4 py-2 text-[12px] font-extrabold text-[#2E0569] transition hover:border-[#8C52FF] hover:text-[#8C52FF]">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Toolbar */}
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="flex min-h-10 flex-1 items-center gap-2 rounded-[12px] border border-[#E9E3EE] bg-white px-3">
          <Search size={14} className="shrink-0 text-[#8C52FF]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            placeholder="Search by order ID, name or email…"
            className="w-full bg-transparent text-[13px] font-semibold text-[#2E0569] outline-none placeholder:text-[#9B93A1]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="min-h-10 rounded-[12px] border border-[#E9E3EE] bg-white px-3 text-[12px] font-extrabold text-[#2E0569] outline-none"
        >
          {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading && (
        <div className="flex items-center gap-2 py-10 text-[13px] text-[#716A78]">
          <Loader2 size={16} className="animate-spin text-[#8C52FF]" /> Loading orders…
        </div>
      )}

      {error && (
        <div className="rounded-[14px] bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">
          {error}
          <p className="mt-1 text-[11px] font-normal text-red-400">Connect the backend API to manage orders.</p>
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-hidden rounded-[20px] border border-[#E9E3EE] bg-white">
          {displayed.length === 0 ? (
            <div className="py-16 text-center text-[14px] font-semibold text-[#716A78]">No orders found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="border-b border-[#E9E3EE] bg-[#FAFAFA]">
                  <tr>
                    {["Order ID", "Date", "Customer", "Items", "Total", "Status", "Update status"].map((h) => (
                      <th key={h} className="px-4 py-3 text-[10px] font-extrabold uppercase tracking-[.1em] text-[#8B8292]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EAF4]">
                  {displayed.map((order) => (
                    <tr key={order.id} className="hover:bg-[#FAFAFA]">
                      <td className="px-4 py-3 font-extrabold text-[#2E0569]">{order.id}</td>
                      <td className="px-4 py-3 text-[#716A78]">{fmt(order.placedAt)}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-[#2E0569]">{order.contact.name}</p>
                        <p className="text-[11px] text-[#8B8292]">{order.contact.email}</p>
                      </td>
                      <td className="px-4 py-3 text-[#716A78]">{order.items.length}</td>
                      <td className="px-4 py-3 font-extrabold text-[#2E0569]">₹{order.total.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${STATUS_COLORS[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {updatingId === order.id ? (
                          <Loader2 size={14} className="animate-spin text-[#8C52FF]" />
                        ) : (
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                            className="rounded-[10px] border border-[#E9E3EE] bg-white px-2 py-1.5 text-[11px] font-extrabold text-[#2E0569] outline-none hover:border-[#8C52FF]"
                          >
                            {ALL_STATUSES.filter((s) => s !== "All").map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
