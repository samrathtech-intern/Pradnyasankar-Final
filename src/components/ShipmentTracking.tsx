"use client";

import {
  Check,
  Package,
  Truck,
  MapPin,
  Clock,
  ExternalLink,
} from "lucide-react";

import type {
  ShipmentResponseDTO,
  ShipmentStatus,
} from "@/types/shipment";

type Props = {
  shipment: ShipmentResponseDTO;
};

const steps: {
  status: ShipmentStatus;
  label: string;
  icon: typeof Package;
}[] = [
  {
    status: "PENDING",
    label: "Order confirmed",
    icon: Clock,
  },
  {
    status: "PACKED",
    label: "Packed",
    icon: Package,
  },
  {
    status: "SHIPPED",
    label: "Shipped",
    icon: Truck,
  },
  {
    status: "OUT_FOR_DELIVERY",
    label: "Out for delivery",
    icon: MapPin,
  },
  {
    status: "DELIVERED",
    label: "Delivered",
    icon: Check,
  },
];

const statusOrder: ShipmentStatus[] = [
  "PENDING",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

function getStatusIndex(status: ShipmentStatus) {
  return statusOrder.indexOf(status);
}

function formatDate(date: string | null) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function ShipmentTracking({
  shipment,
}: Props) {

  const currentIndex =
    getStatusIndex(shipment.shipmentStatus);

  return (
    <div className="mt-5 rounded-[20px] border border-[#E9E3EE] bg-[#FAF7FF] p-5">

      <div className="flex items-start justify-between gap-4">

        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#8C52FF]">
            Shipment Tracking
          </p>

          <h3 className="mt-1 text-[16px] font-extrabold text-[#2E0569]">
            {shipment.shipmentStatus.replaceAll("_", " ")}
          </h3>
        </div>

        {shipment.trackingNumber && (
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-[.08em] text-[#8B8292]">
              Tracking number
            </p>

            <p className="mt-1 text-[12px] font-extrabold text-[#2E0569]">
              {shipment.trackingNumber}
            </p>
          </div>
        )}

      </div>

      {/* STATUS TIMELINE */}

      <div className="mt-7">

        {steps.map((step, index) => {

          const Icon = step.icon;

          const completed =
            currentIndex >= index;

          const current =
            currentIndex === index;

          return (
            <div
              key={step.status}
              className="flex gap-4"
            >

              <div className="flex flex-col items-center">

                <div
                  className={`
                    grid h-9 w-9 shrink-0 place-items-center
                    rounded-full border
                    ${
                      completed
                        ? "border-[#8C52FF] bg-[#8C52FF] text-white"
                        : "border-[#DDD5E5] bg-white text-[#AAA2B0]"
                    }
                  `}
                >
                  <Icon size={16} />
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`
                      my-1 h-10 w-px
                      ${
                        currentIndex > index
                          ? "bg-[#8C52FF]"
                          : "bg-[#DDD5E5]"
                      }
                    `}
                  />
                )}

              </div>

              <div className="pb-6">

                <p
                  className={`
                    text-[13px] font-extrabold
                    ${
                      completed
                        ? "text-[#2E0569]"
                        : "text-[#9B939F]"
                    }
                  `}
                >
                  {step.label}
                </p>

                {current && (
                  <p className="mt-1 text-[11px] font-semibold text-[#8C52FF]">
                    Current status
                  </p>
                )}

              </div>

            </div>
          );
        })}

      </div>

      {/* SHIPMENT DETAILS */}

      <div className="grid gap-3 border-t border-[#E9E3EE] pt-5 sm:grid-cols-2">

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.08em] text-[#8B8292]">
            Courier
          </p>

          <p className="mt-1 text-[13px] font-extrabold text-[#2E0569]">
            {shipment.courierName || "Not assigned"}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.08em] text-[#8B8292]">
            Expected delivery
          </p>

          <p className="mt-1 text-[13px] font-extrabold text-[#2E0569]">
            {formatDate(shipment.expectedDeliveryDate)}
          </p>
        </div>

        {shipment.shippedAt && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.08em] text-[#8B8292]">
              Shipped on
            </p>

            <p className="mt-1 text-[13px] font-extrabold text-[#2E0569]">
              {formatDate(shipment.shippedAt)}
            </p>
          </div>
        )}

        {shipment.deliveredAt && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.08em] text-[#8B8292]">
              Delivered on
            </p>

            <p className="mt-1 text-[13px] font-extrabold text-[#2E0569]">
              {formatDate(shipment.deliveredAt)}
            </p>
          </div>
        )}

      </div>

    </div>
  );
}