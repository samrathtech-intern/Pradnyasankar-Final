"use client";

import { useEffect, useState } from "react";
import {
  BarChart2,
  CircleDollarSign,
  Folder,
  Loader2,
  Package,
  Percent,
  ShoppingBag,
  Star,
  Truck,
  Users,
} from "lucide-react";

import {
  fetchAnalyticsSummary,
  type AnalyticsSummary,
} from "@/lib/adminApi";

type CardProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
};

function StatCard({
  label,
  value,
  icon,
  color,
}: CardProps) {
  return (
    <div className="rounded-[20px] border border-[#E9E3EE] bg-white p-6">
      <div
        className={`inline-flex h-11 w-11 items-center justify-center rounded-[14px] ${color}`}
      >
        {icon}
      </div>

      <p className="mt-4 text-[28px] font-extrabold tracking-[-.04em] text-[#2E0569]">
        {value}
      </p>

      <p className="mt-1 text-[12px] font-semibold text-[#716A78]">
        {label}
      </p>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [data, setData] =
    useState<AnalyticsSummary | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAnalytics() {
      try {
        setLoading(true);
        setError("");

        const result =
          await fetchAnalyticsSummary();

        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (cancelled) return;

        const message =
          err instanceof Error
            ? err.message
            : "Failed to load analytics.";

        setError(message);

        /*
         * If JWT expired or admin is unauthorized,
         * send them back to admin login.
         */
        if (
          message === "UNAUTHORIZED"
        ) {
          window.location.href =
            "/admin/login";
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      {/* ---------------------------------------------------------------- */}
      {/* Header                                                           */}
      {/* ---------------------------------------------------------------- */}

      <div className="mb-8">
        <h1 className="text-[24px] font-extrabold tracking-[-.04em] text-[#2E0569]">
          Analytics
        </h1>

        <p className="mt-1 text-[13px] text-[#716A78]">
          Overview of store performance.
        </p>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Loading                                                          */}
      {/* ---------------------------------------------------------------- */}

      {loading && (
        <div className="flex items-center gap-2 text-[13px] text-[#716A78]">
          <Loader2
            size={16}
            className="animate-spin text-[#8C52FF]"
          />

          Loading analytics…
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Error                                                            */}
      {/* ---------------------------------------------------------------- */}

      {!loading && error && (
        <div className="rounded-[14px] bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">
          {error}

          <p className="mt-1 text-[11px] font-normal text-red-400">
            Make sure you are logged in with an
            administrator account.
          </p>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Dashboard                                                        */}
      {/* ---------------------------------------------------------------- */}

      {!loading && !error && data && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {/* Users */}

          <StatCard
            label="Total users"
            value={data.totalUsers.toLocaleString("en-IN")}
            icon={
              <Users
                size={20}
                className="text-[#8C52FF]"
              />
            }
            color="bg-[#F2EBFF]"
          />

          <StatCard
            label="Active users"
            value={data.activeUsers.toLocaleString("en-IN")}
            icon={
              <Users
                size={20}
                className="text-[#315C20]"
              />
            }
            color="bg-[#EAF4E4]"
          />

          {/* Products */}

          <StatCard
            label="Total products"
            value={data.totalProducts.toLocaleString("en-IN")}
            icon={
              <Package
                size={20}
                className="text-[#7A5200]"
              />
            }
            color="bg-[#FFF3CD]"
          />

          <StatCard
            label="Categories"
            value={data.totalCategories.toLocaleString("en-IN")}
            icon={
              <Folder
                size={20}
                className="text-[#1A4F8A]"
              />
            }
            color="bg-[#E3EEFF]"
          />

          {/* Orders */}

          <StatCard
            label="Total orders"
            value={data.totalOrders.toLocaleString("en-IN")}
            icon={
              <ShoppingBag
                size={20}
                className="text-[#8C52FF]"
              />
            }
            color="bg-[#F2EBFF]"
          />

          <StatCard
            label="Pending orders"
            value={data.pendingOrders.toLocaleString("en-IN")}
            icon={
              <Package
                size={20}
                className="text-[#7A5200]"
              />
            }
            color="bg-[#FFF3CD]"
          />

<StatCard
  label="Completed orders"
  value={data.completedOrders.toLocaleString("en-IN")}
  icon={
    <Truck
      size={20}
      className="text-[#1A4F8A]"
    />
  }
  color="bg-[#E3EEFF]"
/>

          <StatCard
            label="Cancelled orders"
            value={data.cancelledOrders.toLocaleString("en-IN")}
            icon={
              <ShoppingBag
                size={20}
                className="text-red-500"
              />
            }
            color="bg-red-50"
          />

          {/* Revenue */}

          <StatCard
            label="Total revenue"
            value={`₹${Number(
              data.totalRevenue,
            ).toLocaleString("en-IN")}`}
            icon={
              <CircleDollarSign
                size={20}
                className="text-[#315C20]"
              />
            }
            color="bg-[#EAF4E4]"
          />

          {/* Coupons */}

          <StatCard
            label="Total coupons"
            value={data.totalCoupons.toLocaleString("en-IN")}
            icon={
              <Percent
                size={20}
                className="text-[#8C52FF]"
              />
            }
            color="bg-[#F2EBFF]"
          />

          <StatCard
            label="Active coupons"
            value={data.activeCoupons.toLocaleString("en-IN")}
            icon={
              <Percent
                size={20}
                className="text-[#315C20]"
              />
            }
            color="bg-[#EAF4E4]"
          />

          {/* Reviews */}

          <StatCard
            label="Total reviews"
            value={data.totalReviews.toLocaleString("en-IN")}
            icon={
              <Star
                size={20}
                className="text-[#7A5200]"
              />
            }
            color="bg-[#FFF3CD]"
          />

          <StatCard
            label="Average rating"
            value={Number(
              data.averageRating,
            ).toFixed(1)}
            icon={
              <Star
                size={20}
                className="text-[#8C52FF]"
              />
            }
            color="bg-[#F2EBFF]"
          />
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Empty state                                                      */}
      {/* ---------------------------------------------------------------- */}

      {!loading && !error && !data && (
        <div className="flex flex-col items-center gap-3 rounded-[20px] border border-dashed border-[#CDBAF1] bg-[#F2EBFF] py-16 text-center">
          <BarChart2
            size={32}
            className="text-[#8C52FF]"
          />

          <p className="text-[15px] font-extrabold text-[#2E0569]">
            No analytics data yet
          </p>

          <p className="text-[13px] text-[#716A78]">
            No dashboard data was returned by the
            backend.
          </p>
        </div>
      )}
    </div>
  );
}