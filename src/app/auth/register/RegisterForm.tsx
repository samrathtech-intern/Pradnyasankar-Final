"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
  Phone
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";

export function RegisterForm() {
  const { register, authLoading, authError, clearAuthError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/orders";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");   
  const [showPassword, setShowPassword] = useState(false);


  const [errors, setErrors] = useState<{
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
  password?: string;
  confirm?: string;
  }>({}); 




function validate() {
  const e: typeof errors = {};

  if (!firstName.trim())
    e.firstName = "First name is required.";

  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    e.email = "Valid email is required.";

  if (!mobileNumber.trim() || !/^[0-9]{10}$/.test(mobileNumber))
    e.mobileNumber = "Valid 10-digit mobile number is required.";

  if (!password || password.length < 6)
    e.password = "Password must be at least 6 characters.";

  if (password !== confirm)
    e.confirm = "Passwords do not match.";

  setErrors(e);

  return Object.keys(e).length === 0;
}

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    clearAuthError();
    if (!validate()) return;
    try {
      await register(
    firstName,
    lastName,
    email,
    mobileNumber,
    password
);
      router.push(redirect);
    } catch {}
  }

  const inputCls = (err?: string) =>
    `w-full rounded-[14px] border ${err ? "border-red-400 bg-red-50" : "border-[#E9E3EE] bg-white"} px-4 py-3 text-[14px] font-semibold text-[#2E0569] outline-none transition placeholder:text-[#9B93A1] focus:border-[#8C52FF] focus:shadow-[0_0_0_3px_rgba(140,82,255,.12)]`;

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="rounded-[32px] border border-[#E9E3EE] bg-white p-8 shadow-[0_20px_60px_rgba(46,5,105,.08)]">
          <div className="mb-7 text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#F2EBFF]">
              <User size={24} className="text-[#8C52FF]" />
            </span>
            <h1 className="mt-4 text-[26px] font-extrabold tracking-[-.04em] text-[#2E0569]">Create account</h1>
            <p className="mt-1.5 text-[13px] text-[#716A78]">Join Pradnyasanskar to track your orders</p>
          </div>

          {authError && (
            <div className="mb-5 rounded-[14px] bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* First & Last name row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.1em] text-[#2E0569]">First name</label>
                <div className="relative">
                  <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C52FF]" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => { setFirstName(e.target.value); setErrors((v) => ({ ...v, firstName: undefined })); }}
                    placeholder="First name"
                    className={`${inputCls(errors.firstName)} pl-10`}
                    autoComplete="given-name"
                  />
                </div>
                {errors.firstName && <p className="mt-1 text-[11px] font-semibold text-red-500">{errors.firstName}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.1em] text-[#2E0569]">Last name</label>
                <div className="relative">
                  <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C52FF]" />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => { setLastName(e.target.value); setErrors((v) => ({ ...v, lastName: undefined })); }}
                    placeholder="Last name"
                    className={`${inputCls(errors.lastName)} pl-10`}
                    autoComplete="family-name"
                  />
                </div>
                {errors.lastName && <p className="mt-1 text-[11px] font-semibold text-red-500">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.1em] text-[#2E0569]">Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C52FF]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((v) => ({ ...v, email: undefined })); }}
                  placeholder="you@example.com"
                  className={`${inputCls(errors.email)} pl-10`}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="mt-1 text-[11px] font-semibold text-red-500">{errors.email}</p>}
            </div>
            {/* mobile number */}
            <div>
  <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.1em] text-[#2E0569]">
    Mobile Number
  </label>

  <div className="relative">
    <Phone
    size={15}
    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C52FF]"
/>

    <input
      type="tel"
      value={mobileNumber}
      onChange={(e) => {
    const value = e.target.value.replace(/\D/g, "");

    setMobileNumber(value);

    setErrors(v => ({
        ...v,
        mobileNumber: undefined
    }));
    
    }}
      placeholder="9876543210"
      className={`${inputCls(errors.mobileNumber)} pl-10`}
      autoComplete="tel"
      maxLength={10}
    />
  </div>

  {errors.mobileNumber && (
    <p className="mt-1 text-[11px] font-semibold text-red-500">
      {errors.mobileNumber}
    </p>
  )}
</div>
            {/* Password field */}
            <div>
              <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.1em] text-[#2E0569]">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C52FF]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((v) => ({ ...v, password: undefined })); }}
                  placeholder="Min. 6 characters"
                  className={`${inputCls(errors.password)} pl-10 pr-11`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B8292] hover:text-[#2E0569]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-[11px] font-semibold text-red-500">{errors.password}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.1em] text-[#2E0569]">Confirm password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C52FF]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => { setConfirm(e.target.value); setErrors((v) => ({ ...v, confirm: undefined })); }}
                  placeholder="Repeat your password"
                  className={`${inputCls(errors.confirm)} pl-10`}
                  autoComplete="new-password"
                />
              </div>
              {errors.confirm && <p className="mt-1 text-[11px] font-semibold text-red-500">{errors.confirm}</p>}
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-full bg-[#8C52FF] text-[12px] font-extrabold uppercase tracking-[.1em] text-white transition hover:bg-[#2E0569] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {authLoading ? <><Loader2 size={15} className="animate-spin" /> Creating account…</> : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-[13px] text-[#716A78]">
            Already have an account?{" "}
            <Link href={`/auth/login?redirect=${encodeURIComponent(redirect)}`} className="font-extrabold text-[#8C52FF] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

