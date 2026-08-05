"use client";

import { useState } from "react";
import { Bell, Check } from "lucide-react";

function readNotify(): Record<string, string[]> {
  try {
    return JSON.parse(localStorage.getItem("ps_notify") ?? "{}");
  } catch {
    return {};
  }
}

function saveNotify(productId: string, email: string) {
  const data = readNotify();
  const existing = data[productId] ?? [];
  if (!existing.includes(email)) {
    data[productId] = [...existing, email];
    try { localStorage.setItem("ps_notify", JSON.stringify(data)); } catch {}
  }
}

function alreadyRegistered(productId: string, email: string) {
  return (readNotify()[productId] ?? []).includes(email);
}

/* ── compact variant: used inside product cards ── */
export function NotifyMeCompact({ productId }: { productId: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function submit() {
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Enter a valid email.");
      return;
    }
    saveNotify(productId, trimmed);
    setDone(true);
    setError("");
  }

  if (done) {
    return (
      <div className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#EAF4E4] text-[11px] font-extrabold uppercase tracking-[.1em] text-[#315C20]">
        <Check size={14} /> Registered
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => {
          if (alreadyRegistered(productId, "")) setDone(true);
          setOpen(true);
        }}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[#E9E3EE] bg-white text-[11px] font-extrabold uppercase tracking-[.1em] text-[#2E0569] transition hover:border-[#8C52FF] hover:text-[#8C52FF]"
      >
        <Bell size={14} /> Notify me
      </button>
    );
  }

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex gap-1.5">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Your email"
          autoFocus
          className="min-h-9 flex-1 rounded-full border border-[#E9E3EE] bg-white px-3 text-[11px] font-semibold text-[#2E0569] outline-none transition focus:border-[#8C52FF] placeholder:text-[#9B93A1]"
        />
        <button
          onClick={submit}
          className="min-h-9 rounded-full bg-[#8C52FF] px-3 text-[10px] font-extrabold uppercase tracking-[.1em] text-white transition hover:bg-[#2E0569]"
        >
          OK
        </button>
      </div>
      {error && <p className="px-1 text-[10px] text-red-500">{error}</p>}
    </div>
  );
}

/* ── full variant: used on product detail page ── */
export function NotifyMeFull({ productId, productName }: { productId: string; productName: string }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function submit() {
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Enter a valid email address.");
      return;
    }
    saveNotify(productId, trimmed);
    setDone(true);
    setError("");
  }

  if (done) {
    return (
      <div className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full bg-[#EAF4E4] text-[12px] font-extrabold uppercase tracking-[.1em] text-[#315C20]">
        <Check size={16} /> We&apos;ll notify you
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-2">
      <p className="text-[11px] font-semibold text-[#716A78]">
        <Bell size={12} className="mr-1 inline text-[#8C52FF]" />
        {productName} is out of stock. Enter your email to be notified when it&apos;s back.
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Your email address"
          className="min-h-[52px] flex-1 rounded-full border border-[#E9E3EE] bg-white px-4 text-[13px] font-semibold text-[#2E0569] outline-none transition focus:border-[#8C52FF] placeholder:text-[#9B93A1]"
        />
        <button
          onClick={submit}
          className="min-h-[52px] rounded-full bg-[#8C52FF] px-5 text-[11px] font-extrabold uppercase tracking-[.1em] text-white transition hover:bg-[#2E0569]"
        >
          Notify me
        </button>
      </div>
      {error && <p className="px-1 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}
