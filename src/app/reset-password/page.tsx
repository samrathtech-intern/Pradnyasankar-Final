"use client";

import { useState } from "react";
import { resetPassword } from "@/lib/authApi";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const result = await resetPassword(
        token,
        newPassword
      );

      console.log("Reset password response:", result);

      setMessage("Password reset successfully.");

      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (error) {
      console.error(error);
      setError("Invalid or expired reset token.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border p-6"
      >
        <h1 className="text-2xl font-bold">
          Reset Password
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Enter the reset token and your new password.
        </p>

        <input
          type="text"
          placeholder="Reset token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="mt-5 w-full rounded-lg border p-3"
          required
        />

        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mt-3 w-full rounded-lg border p-3"
          required
        />

        <button
          type="submit"
          className="mt-4 w-full rounded-lg bg-purple-600 p-3 text-white"
        >
          Reset Password
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