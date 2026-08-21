"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";

export function LoginForm() {
  const {
    login,
    authLoading,
    authError,
    clearAuthError,
  } = useAuth();

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  // ============================================================
  // VALIDATION
  // ============================================================

  function validate() {
    const e: typeof errors = {};

    if (
      !email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      e.email = "Valid email is required.";
    }

    if (!password || password.length < 6) {
      e.password = "Password must be at least 6 characters.";
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  }

  // ============================================================
  // LOGIN
  // ============================================================

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();

    clearAuthError();

    if (!validate()) {
      return;
    }

    try {
      await login(email.trim(), password);

      // ========================================================
      // LOGIN SUCCESS → HOME PAGE
      // ========================================================

      router.push("/");
    } catch {
      // AuthContext already sets authError
    }
  }

  // ============================================================
  // INPUT CLASS
  // ============================================================

  const inputCls = (err?: string) =>
    `w-full rounded-[14px] border ${
      err
        ? "border-red-400 bg-red-50"
        : "border-[#E9E3EE] bg-white"
    } px-4 py-3 text-[14px] font-semibold text-[#2E0569] outline-none transition placeholder:text-[#9B93A1] focus:border-[#8C52FF] focus:shadow-[0_0_0_3px_rgba(140,82,255,.12)]`;

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md">

        <div className="rounded-[32px] border border-[#E9E3EE] bg-white p-8 shadow-[0_20px_60px_rgba(46,5,105,.08)]">

          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="mb-7 text-center">

            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#F2EBFF]">
              <Lock
                size={24}
                className="text-[#8C52FF]"
              />
            </span>

            <h1 className="mt-4 text-[26px] font-extrabold tracking-[-.04em] text-[#2E0569]">
              Sign in
            </h1>

            <p className="mt-1.5 text-[13px] text-[#716A78]">
              Welcome back to Pradnyasanskar
            </p>

          </div>

          {/* ==================================================
              AUTH ERROR
          ================================================== */}

          {authError && (
            <div className="mb-5 rounded-[14px] bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">
              {authError}
            </div>
          )}

          {/* ==================================================
              FORM
          ================================================== */}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5"
          >

            {/* =================================================
                EMAIL
            ================================================= */}

            <div>

              <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.1em] text-[#2E0569]">
                Email address
              </label>

              <div className="relative">

                <Mail
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C52FF]"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);

                    setErrors((v) => ({
                      ...v,
                      email: undefined,
                    }));

                    if (authError) {
                      clearAuthError();
                    }
                  }}
                  placeholder="you@example.com"
                  className={`${inputCls(errors.email)} pl-10`}
                  autoComplete="email"
                />

              </div>

              {errors.email && (
                <p className="mt-1 text-[11px] font-semibold text-red-500">
                  {errors.email}
                </p>
              )}

            </div>

            {/* =================================================
                PASSWORD
            ================================================= */}

            <div>

              <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.1em] text-[#2E0569]">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C52FF]"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);

                    setErrors((v) => ({
                      ...v,
                      password: undefined,
                    }));

                    if (authError) {
                      clearAuthError();
                    }
                  }}
                  placeholder="Your password"
                  className={`${inputCls(errors.password)} pl-10 pr-11`}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((v) => !v)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B8292] hover:text-[#2E0569]"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={15} />
                  ) : (
                    <Eye size={15} />
                  )}
                </button>

              </div>

              {errors.password && (
                <p className="mt-1 text-[11px] font-semibold text-red-500">
                  {errors.password}
                </p>
              )}

            </div>

            {/* =================================================
                LOGIN BUTTON
            ================================================= */}

            <button
              type="submit"
              disabled={authLoading}
              className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-full bg-[#8C52FF] text-[12px] font-extrabold uppercase tracking-[.1em] text-white transition hover:bg-[#2E0569] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {authLoading ? (
                <>
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>

          </form>

          {/* ==================================================
              REGISTER LINK
          ================================================== */}

          <p className="mt-6 text-center text-[13px] text-[#716A78]">
            Don&apos;t have an account?{" "}

            <Link
              href="/auth/register"
              className="font-extrabold text-[#8C52FF] hover:underline"
            >
              Create one
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
}