"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail } from "lucide-react";
import { adminLogin, setAdminToken } from "@/lib/adminApi";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function validate() {
    const e: typeof errors = {};
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Valid email is required.";
    if (!password || password.length < 6) e.password = "Password must be at least 6 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const { token } = await adminLogin(email, password);
      setAdminToken(token);
      router.push("/admin/analytics");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  const inputCls = (err?: string) =>
    `w-full rounded-[14px] border ${err ? "border-red-400 bg-red-50" : "border-[#E9E3EE] bg-white"} px-4 py-3 pl-10 text-[14px] font-semibold text-[#2E0569] outline-none transition placeholder:text-[#9B93A1] focus:border-[#8C52FF] focus:shadow-[0_0_0_3px_rgba(140,82,255,.12)]`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-[32px] border border-[#E9E3EE] bg-white p-8 shadow-[0_20px_60px_rgba(46,5,105,.08)]">
          <div className="mb-7 text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#F2EBFF]">
              <Lock size={24} className="text-[#8C52FF]" />
            </span>
            <h1 className="mt-4 text-[22px] font-extrabold tracking-[-.04em] text-[#2E0569]">Admin sign in</h1>
            <p className="mt-1 text-[12px] text-[#716A78]">Pradnyasanskar admin panel</p>
          </div>

          {error && (
            <div className="mb-5 rounded-[14px] bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.1em] text-[#2E0569]">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C52FF]" />
                <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors((v) => ({ ...v, email: undefined })); }}
                  placeholder="admin@pradnyasanskar.com" className={inputCls(errors.email)} autoComplete="email" />
              </div>
              {errors.email && <p className="mt-1 text-[11px] text-red-500">{errors.email}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.1em] text-[#2E0569]">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C52FF]" />
                <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setErrors((v) => ({ ...v, password: undefined })); }}
                  placeholder="Your password" className={inputCls(errors.password)} autoComplete="current-password" />
              </div>
              {errors.password && <p className="mt-1 text-[11px] text-red-500">{errors.password}</p>}
            </div>
            <button type="submit" disabled={loading}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#8C52FF] text-[12px] font-extrabold uppercase tracking-[.1em] text-white transition hover:bg-[#2E0569] disabled:cursor-not-allowed disabled:opacity-60 mt-2">
              {loading ? <><Loader2 size={14} className="animate-spin" /> Signing in…</> : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
