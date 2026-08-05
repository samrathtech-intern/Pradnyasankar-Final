"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { downloadInvoice } from "@/lib/invoiceApi";

type Props = {
  orderId: string;
  variant?: "primary" | "ghost";
};

export function DownloadInvoiceButton({ orderId, variant = "ghost" }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleClick() {
    setStatus("loading");
    setErrorMsg("");
    try {
      await downloadInvoice(orderId);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Could not download invoice.");
    }
  }

  const base =
    variant === "primary"
      ? "inline-flex items-center gap-2 rounded-full bg-[#8C52FF] px-5 py-2.5 text-[11px] font-extrabold uppercase tracking-[.1em] text-white transition hover:bg-[#2E0569] disabled:cursor-not-allowed disabled:opacity-60"
      : "inline-flex items-center gap-2 rounded-full border border-[#E9E3EE] bg-white px-4 py-2 text-[11px] font-extrabold uppercase tracking-[.1em] text-[#2E0569] transition hover:border-[#8C52FF] hover:text-[#8C52FF] disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="flex flex-col gap-1">
      <button onClick={handleClick} disabled={status === "loading"} className={base}>
        {status === "loading" ? (
          <><Loader2 size={13} className="animate-spin" /> Downloading…</>
        ) : (
          <><Download size={13} /> Download invoice</>
        )}
      </button>
      {status === "error" && (
        <p className="text-[11px] font-semibold text-red-500">{errorMsg}</p>
      )}
    </div>
  );
}
