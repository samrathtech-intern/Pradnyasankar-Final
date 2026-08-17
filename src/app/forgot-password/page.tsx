"use client";

import { useState } from "react";
import { forgotPassword } from "@/lib/authApi";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const result = await forgotPassword(email);

      console.log("Forgot password response:", result);

      setMessage("Reset token generated successfully.");

      // Go to reset password page
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error(error);
      setError("Unable to process forgot password request.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border p-6"
      >
        <h1 className="text-2xl font-bold">
          Forgot Password
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Enter your registered email address.
        </p>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-5 w-full rounded-lg border p-3"
          required
        />

        <button
          type="submit"
          className="mt-4 w-full rounded-lg bg-purple-600 p-3 text-white"
        >
          Send Reset Request
        </button>

        {message && (
          <p className="mt-4 text-green-600">
            {message}
          </p>
        )}

        {error && (
          <p className="mt-4 text-red-600">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}