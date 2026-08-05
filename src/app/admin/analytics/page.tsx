"use client";

import { useEffect, useState } from "react";
import { BarChart2, IndianRupee, Loader2, Package, ShoppingBag, Truck } from "lucide-react";
import { fetchAnalyticsSummary, type AnalyticsSummary } from "@/lib/adminApi";

type CardProps = { label: string; value: string; icon: React.ReactNode; color: string };

function StatCard({ label, value, icon, color }: CardProps) {
  return (
    <div className="rounded-[20px] border border-[#E9E3EE] bg-white p-6">
      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-[14px] ${color}`}>
        {icon}
      </div>
      <p className="mt-4 text-[28px] font-extrabold tracking-[-.04em] text-[#2E0569]">{value}</p>
      <p className="mt-1 text-[12px] font-semibold text-[#716A78]">{label}</p>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalyticsSummary()
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load analytics."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[24px] font-extrabold tracking-[-.04em] text-[#2E0569]">Analytics</h1>
        <p className="mt-1 text-[13px] text-[#716A78]">Overview of store performance.</p>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-[13px] text-[#716A78]">
          <Loader2 size={16} className="animate-spin text-[#8C52FF]" /> Loading analytics…
        </div>
      )}

      {error && (
        <div className="rounded-[14px] bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">
          {error}
          <p className="mt-1 text-[11px] font-normal text-red-400">
            This data will be available once the backend API is connected.
          </p>
        </div>
      )}

      {data && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total orders"
            value={data.totalOrders.toLocaleString("en-IN")}
            icon={<ShoppingBag size={20} className="text-[#8C52FF]" />}
            color="bg-[#F2EBFF]"
          />
          <StatCard
            label="Total revenue"
            value={`₹${data.totalRevenue.toLocaleString("en-IN")}`}
            icon={<IndianRupee size={20} className="text-[#315C20]" />}
            color="bg-[#EAF4E4]"
          />
          <StatCard
            label="Pending orders"
            value={data.pendingOrders.toLocaleString("en-IN")}
            icon={<Package size={20} className="text-[#7A5200]" />}
            color="bg-[#FFF3CD]"
          />
          <StatCard
            label="Delivered orders"
            value={data.deliveredOrders.toLocaleString("en-IN")}
            icon={<Truck size={20} className="text-[#1A4F8A]" />}
            color="bg-[#E3EEFF]"
          />
        </div>
      )}

      {!loading && !error && !data && (
        <div className="flex flex-col items-center gap-3 rounded-[20px] border border-dashed border-[#CDBAF1] bg-[#F2EBFF] py-16 text-center">
          <BarChart2 size={32} className="text-[#8C52FF]" />
          <p className="text-[15px] font-extrabold text-[#2E0569]">No analytics data yet</p>
          <p className="text-[13px] text-[#716A78]">Connect the backend API to see live metrics.</p>
        </div>
      )}
    </div>
  );
}
