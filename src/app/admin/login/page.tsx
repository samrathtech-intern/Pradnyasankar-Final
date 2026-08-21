"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail } from "lucide-react";

import {
  adminLogin,
  setAdminToken,
} from "@/lib/adminApi";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  function validate() {
    const validationErrors: typeof errors = {};

    if (
      !email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      validationErrors.email = "Valid email is required.";
    }

    if (!password) {
      validationErrors.password = "Password is required.";
    } else if (password.length < 6) {
      validationErrors.password =
        "Password must be at least 6 characters.";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const response = await adminLogin(
        email.trim(),
        password
      );

      /*
       * adminLogin() should reject non-admin users.
       * The JWT returned by the existing backend contains
       * the user's role.
       */
      setAdminToken(response.token);

      console.log(
  "ADMIN AUTH: token saved:",
  !!localStorage.getItem("ps_admin_token")
);

console.log(
  "ADMIN AUTH: token:",
  localStorage.getItem("ps_admin_token")
    ? "exists"
    : "missing"
);

      router.replace("/admin/analytics");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Login failed.";

      if (message === "UNAUTHORIZED") {
        setError(
          "Invalid email/password or you do not have admin access."
        );
      } else if (message === "FORBIDDEN") {
        setError(
          "You do not have permission to access the admin panel."
        );
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  function inputClass(errorMessage?: string) {
    return [
      "w-full",
      "rounded-[14px]",
      "border",
      errorMessage
        ? "border-red-400 bg-red-50"
        : "border-[#E9E3EE] bg-white",
      "px-4",
      "py-3",
      "pl-10",
      "text-[14px]",
      "font-semibold",
      "text-[#2E0569]",
      "outline-none",
      "transition",
      "placeholder:text-[#9B93A1]",
      "focus:border-[#8C52FF]",
      "focus:shadow-[0_0_0_3px_rgba(140,82,255,.12)]",
    ].join(" ");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-[32px] border border-[#E9E3EE] bg-white p-8 shadow-[0_20px_60px_rgba(46,5,105,.08)]">

          {/* Header */}
          <div className="mb-7 text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#F2EBFF]">
              <Lock
                size={24}
                className="text-[#8C52FF]"
              />
            </span>

            <h1 className="mt-4 text-[22px] font-extrabold tracking-[-.04em] text-[#2E0569]">
              Admin sign in
            </h1>

            <p className="mt-1 text-[12px] text-[#716A78]">
              Pradnyasanskar admin panel
            </p>
          </div>

          {/* General error */}
          {error && (
            <div className="mb-5 rounded-[14px] bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-4"
          >

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.1em] text-[#2E0569]">
                Email
              </label>

              <div className="relative">
                <Mail
                  size={14}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C52FF]"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);

                    setErrors((current) => ({
                      ...current,
                      email: undefined,
                    }));

                    setError("");
                  }}
                  placeholder="admin@gmail.com"
                  className={inputClass(errors.email)}
                  autoComplete="username"
                  disabled={loading}
                />
              </div>

              {errors.email && (
                <p className="mt-1 text-[11px] text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.1em] text-[#2E0569]">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={14}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C52FF]"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);

                    setErrors((current) => ({
                      ...current,
                      password: undefined,
                    }));

                    setError("");
                  }}
                  placeholder="Your password"
                  className={inputClass(errors.password)}
                  autoComplete="current-password"
                  disabled={loading}
                />
              </div>

              {errors.password && (
                <p className="mt-1 text-[11px] text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#8C52FF] text-[12px] font-extrabold uppercase tracking-[.1em] text-white transition hover:bg-[#2E0569] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}