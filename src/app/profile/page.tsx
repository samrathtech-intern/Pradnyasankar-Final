"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  User,
  Package,
  MapPin,
  LogOut,
  ChevronRight,
  Mail,
  Phone,
  CalendarDays,
  Pencil,
  X,
  Loader2,
} from "lucide-react";

import { AppProvider } from "@/components/AppContext";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/components/AuthContext";
import {
  AnnouncementBar,
  Header,
} from "@/components/Header";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Reveal } from "@/components/Reveal";

type Profile = {
  userId: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  mobileNumber: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  profileImageUrl: string | null;
};

type UpdateProfileRequest = {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  dateOfBirth: string;
  gender: string;
  profileImageUrl: string;
};

const PROFILE_API_URL = "http://localhost:8080/api/profile";

function ProfileContent() {
  const { token, logout } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [showEdit, setShowEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<UpdateProfileRequest>({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    dateOfBirth: "",
    gender: "",
    profileImageUrl: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================================
  // LOAD PROFILE
  // ==========================================================

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    void loadProfile();
  }, [token]);

  async function loadProfile() {
    if (!token) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      console.log("Calling profile API:", PROFILE_API_URL);

      const response = await fetch(PROFILE_API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        cache: "no-store",
      });

      console.log(
        "Profile API response:",
        response.status,
        response.statusText
      );

      // Token invalid/expired
      if (response.status === 401 || response.status === 403) {
        console.error("Profile API authentication failed.");

        await logout();
        return;
      }

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message || "Failed to load profile."
        );
      }

      const data = (await response.json()) as Profile;

      console.log("Profile API data:", data);

      setProfile(data);

      setForm({
        firstName: data.firstName ?? "",
        lastName: data.lastName ?? "",
        mobileNumber: data.mobileNumber ?? "",
        dateOfBirth: data.dateOfBirth ?? "",
        gender: data.gender ?? "",
        profileImageUrl: data.profileImageUrl ?? "",
      });
    } catch (err) {
      console.error("Profile loading error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================================
  // OPEN EDIT PROFILE
  // ==========================================================

  function openEditProfile() {
    if (!profile) {
      return;
    }

    setForm({
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      mobileNumber: profile.mobileNumber ?? "",
      dateOfBirth: profile.dateOfBirth ?? "",
      gender: profile.gender ?? "",
      profileImageUrl: profile.profileImageUrl ?? "",
    });

    setError("");
    setSuccess("");
    setShowEdit(true);
  }

  // ==========================================================
  // UPDATE FORM FIELD
  // ==========================================================

  function updateField(
    field: keyof UpdateProfileRequest,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  // ==========================================================
  // UPDATE PROFILE
  // ==========================================================

  async function handleUpdateProfile(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!token) {
      await logout();
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      console.log(
        "Updating profile:",
        PROFILE_API_URL
      );

      const response = await fetch(PROFILE_API_URL, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      console.log(
        "Profile update response:",
        response.status,
        response.statusText
      );

      // Token invalid/expired
      if (response.status === 401 || response.status === 403) {
        await logout();
        return;
      }

      const contentType =
        response.headers.get("content-type") ?? "";

      let data: Profile | { message?: string };

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();

        if (!response.ok) {
          throw new Error(
            text || "Failed to update profile."
          );
        }

        throw new Error(
          "The server returned an invalid profile response."
        );
      }

      if (!response.ok) {
        const message =
          "message" in data && data.message
            ? data.message
            : "Failed to update profile.";

        throw new Error(message);
      }

      const updatedProfile = data as Profile;

      setProfile(updatedProfile);

      setForm({
        firstName: updatedProfile.firstName ?? "",
        lastName: updatedProfile.lastName ?? "",
        mobileNumber:
          updatedProfile.mobileNumber ?? "",
        dateOfBirth:
          updatedProfile.dateOfBirth ?? "",
        gender: updatedProfile.gender ?? "",
        profileImageUrl:
          updatedProfile.profileImageUrl ?? "",
      });

      setShowEdit(false);
      setSuccess("Profile updated successfully.");

      window.setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Profile update error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  }

  // ==========================================================
  // LOGOUT
  // ==========================================================

  async function handleLogout() {
    await logout();
  }

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <Loader2
          size={28}
          className="animate-spin text-[#8C52FF]"
        />
      </div>
    );
  }

  // ==========================================================
  // PROFILE UI
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#FFFDF7]">
      <div className="container-page py-10 lg:py-16">

        {/* ==================================================
            PAGE HEADER
        ================================================== */}

        <Reveal>
          <p className="text-[11px] font-extrabold uppercase tracking-[.12em] text-[#8C52FF]">
            My Account
          </p>

          <h1 className="mt-2 text-[clamp(28px,4vw,44px)] font-extrabold tracking-[-.04em] text-[#2E0569]">
            Profile
          </h1>

          <p className="mt-2 text-[14px] text-[#716A78]">
            Manage your profile, orders and addresses.
          </p>
        </Reveal>

        {/* ==================================================
            SUCCESS MESSAGE
        ================================================== */}

        {success && (
          <div className="mt-5 rounded-[14px] border border-[#CFE8C4] bg-[#EAF4E4] px-4 py-3 text-[13px] font-semibold text-[#315C20]">
            {success}
          </div>
        )}

        {/* ==================================================
            ERROR MESSAGE
        ================================================== */}

        {error && !showEdit && (
          <div className="mt-5 rounded-[14px] border border-[#F5C6C2] bg-[#FDECEA] px-4 py-3 text-[13px] font-semibold text-[#C0392B]">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">

          {/* ==================================================
              SIDEBAR
          ================================================== */}

          <Reveal>
            <div className="overflow-hidden rounded-[24px] border border-[#E9E3EE] bg-white">

              {/* User information */}

              <div className="border-b border-[#E9E3EE] px-5 py-5">
                <div className="flex items-center gap-3">

                  <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-[#F4EEFF]">

                    {profile?.profileImageUrl ? (
                      <img
                        src={profile.profileImageUrl}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User
                        size={22}
                        className="text-[#8C52FF]"
                      />
                    )}

                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-extrabold text-[#2E0569]">
                      {profile?.firstName || "My Account"}
                    </p>

                    <p className="mt-0.5 truncate text-[11px] text-[#8B8292]">
                      {profile?.email}
                    </p>
                  </div>

                </div>
              </div>

              {/* Navigation */}

              <nav className="p-2">

                {/* My Profile */}

                <Link
                  href="/profile"
                  className="flex items-center gap-3 rounded-[14px] bg-[#F4EEFF] px-4 py-3 text-[13px] font-extrabold text-[#2E0569]"
                >
                  <User
                    size={16}
                    className="text-[#8C52FF]"
                  />

                  <span className="flex-1">
                    My Profile
                  </span>

                  <ChevronRight size={15} />
                </Link>

                {/* My Orders */}

                <Link
                  href="/profile/orders"
                  className="mt-1 flex items-center gap-3 rounded-[14px] px-4 py-3 text-[13px] font-semibold text-[#716A78] transition hover:bg-[#FAF6FF] hover:text-[#2E0569]"
                >
                  <Package size={16} />

                  <span className="flex-1">
                    My Orders
                  </span>

                  <ChevronRight size={15} />
                </Link>

                {/* My Addresses */}

                <Link
                  href="/profile/addresses"
                  className="mt-1 flex items-center gap-3 rounded-[14px] px-4 py-3 text-[13px] font-semibold text-[#716A78] transition hover:bg-[#FAF6FF] hover:text-[#2E0569]"
                >
                  <MapPin size={16} />

                  <span className="flex-1">
                    My Addresses
                  </span>

                  <ChevronRight size={15} />
                </Link>

                {/* ==================================================
                    WISHLIST REMOVED
                    Wishlist is already available in Header.
                ================================================== */}

                <div className="my-2 border-t border-[#E9E3EE]" />

                {/* Logout */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-[14px] px-4 py-3 text-left text-[13px] font-semibold text-[#C0392B] transition hover:bg-[#FDECEA]"
                >
                  <LogOut size={16} />

                  <span className="flex-1">
                    Logout
                  </span>
                </button>

              </nav>
            </div>
          </Reveal>

          {/* ==================================================
              MAIN PROFILE
          ================================================== */}

          <Reveal>
            <div className="space-y-5">

              {/* ==================================================
                  PROFILE INFORMATION
              ================================================== */}

              <section className="rounded-[24px] border border-[#E9E3EE] bg-white p-6 lg:p-7">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <h2 className="text-[18px] font-extrabold text-[#2E0569]">
                      My Profile
                    </h2>

                    <p className="mt-1 text-[12px] text-[#8B8292]">
                      View and manage your personal information.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={openEditProfile}
                    className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#8C52FF] to-[#2E0569] px-5 py-2.5 text-[12px] font-extrabold text-white transition hover:opacity-90"
                  >
                    <Pencil size={13} />

                    Edit Profile
                  </button>

                </div>

                {/* Profile details */}

                <div className="mt-6 grid gap-4 sm:grid-cols-2">

                  {/* Full Name */}

                  <div className="rounded-[16px] bg-[#FAFAFA] p-4">
                    <div className="flex items-center gap-2">

                      <User
                        size={15}
                        className="text-[#8C52FF]"
                      />

                      <p className="text-[10px] font-extrabold uppercase tracking-[.08em] text-[#8B8292]">
                        Full Name
                      </p>

                    </div>

                    <p className="mt-2 text-[14px] font-extrabold text-[#2E0569]">
                      {profile?.firstName ||
                      profile?.lastName
                        ? `${profile?.firstName ?? ""} ${
                            profile?.lastName ?? ""
                          }`.trim()
                        : "Not added"}
                    </p>
                  </div>

                  {/* Email */}

                  <div className="rounded-[16px] bg-[#FAFAFA] p-4">
                    <div className="flex items-center gap-2">

                      <Mail
                        size={15}
                        className="text-[#8C52FF]"
                      />

                      <p className="text-[10px] font-extrabold uppercase tracking-[.08em] text-[#8B8292]">
                        Email
                      </p>

                    </div>

                    <p className="mt-2 truncate text-[14px] font-extrabold text-[#2E0569]">
                      {profile?.email || "Not available"}
                    </p>
                  </div>

                  {/* Mobile */}

                  <div className="rounded-[16px] bg-[#FAFAFA] p-4">
                    <div className="flex items-center gap-2">

                      <Phone
                        size={15}
                        className="text-[#8C52FF]"
                      />

                      <p className="text-[10px] font-extrabold uppercase tracking-[.08em] text-[#8B8292]">
                        Mobile Number
                      </p>

                    </div>

                    <p className="mt-2 text-[14px] font-extrabold text-[#2E0569]">
                      {profile?.mobileNumber || "Not added"}
                    </p>
                  </div>

                  {/* Date of Birth */}

                  <div className="rounded-[16px] bg-[#FAFAFA] p-4">
                    <div className="flex items-center gap-2">

                      <CalendarDays
                        size={15}
                        className="text-[#8C52FF]"
                      />

                      <p className="text-[10px] font-extrabold uppercase tracking-[.08em] text-[#8B8292]">
                        Date of Birth
                      </p>

                    </div>

                    <p className="mt-2 text-[14px] font-extrabold text-[#2E0569]">
                      {profile?.dateOfBirth || "Not added"}
                    </p>
                  </div>

                </div>
              </section>

              {/* ==================================================
                  QUICK ACCESS
                  Wishlist removed.
                  Only Orders + Addresses remain.
              ================================================== */}

              <section className="grid gap-4 sm:grid-cols-2">

                {/* My Orders */}

                <Link
                  href="/profile/orders"
                  className="group rounded-[20px] border border-[#E9E3EE] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-[#EAF4E4]">
                    <Package
                      size={20}
                      className="text-[#315C20]"
                    />
                  </span>

                  <h3 className="mt-4 text-[14px] font-extrabold text-[#2E0569]">
                    My Orders
                  </h3>

                  <p className="mt-1 text-[11px] leading-relaxed text-[#8B8292]">
                    View orders, track shipments and manage returns.
                  </p>
                </Link>

                {/* My Addresses */}

                <Link
                  href="/profile/addresses"
                  className="group rounded-[20px] border border-[#E9E3EE] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-[#E3EEFF]">
                    <MapPin
                      size={20}
                      className="text-[#1A4F8A]"
                    />
                  </span>

                  <h3 className="mt-4 text-[14px] font-extrabold text-[#2E0569]">
                    My Addresses
                  </h3>

                  <p className="mt-1 text-[11px] leading-relaxed text-[#8B8292]">
                    Add, edit and manage your delivery addresses.
                  </p>
                </Link>

              </section>

            </div>
          </Reveal>

        </div>
      </div>

      {/* ======================================================
          EDIT PROFILE MODAL
      ====================================================== */}

      {showEdit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowEdit(false);
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl sm:p-7">

            {/* Modal Header */}

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-[19px] font-extrabold text-[#2E0569]">
                  Edit Profile
                </h2>

                <p className="mt-1 text-[12px] text-[#8B8292]">
                  Update your personal information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowEdit(false)}
                className="grid h-9 w-9 place-items-center rounded-full bg-[#F4EEFF] text-[#716A78] transition hover:text-[#2E0569]"
                aria-label="Close"
              >
                <X size={17} />
              </button>

            </div>

            {/* Modal Error */}

            {error && (
              <div className="mt-5 rounded-[12px] border border-[#F5C6C2] bg-[#FDECEA] px-4 py-3 text-[12px] font-semibold text-[#C0392B]">
                {error}
              </div>
            )}

            {/* Form */}

            <form
              onSubmit={handleUpdateProfile}
              className="mt-6 space-y-4"
            >

              {/* First + Last */}

              <div className="grid gap-4 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.08em] text-[#8B8292]"
                  >
                    First Name
                  </label>

                  <input
                    id="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={(event) =>
                      updateField(
                        "firstName",
                        event.target.value
                      )
                    }
                    autoComplete="given-name"
                    className="w-full rounded-[12px] border border-[#E9E3EE] px-4 py-2.5 text-[13px] text-[#2E0569] outline-none focus:ring-2 focus:ring-[#8C52FF]/30"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.08em] text-[#8B8292]"
                  >
                    Last Name
                  </label>

                  <input
                    id="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={(event) =>
                      updateField(
                        "lastName",
                        event.target.value
                      )
                    }
                    autoComplete="family-name"
                    className="w-full rounded-[12px] border border-[#E9E3EE] px-4 py-2.5 text-[13px] text-[#2E0569] outline-none focus:ring-2 focus:ring-[#8C52FF]/30"
                  />
                </div>

              </div>

              {/* Mobile */}

              <div>
                <label
                  htmlFor="mobileNumber"
                  className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.08em] text-[#8B8292]"
                >
                  Mobile Number
                </label>

                <input
                  id="mobileNumber"
                  type="tel"
                  value={form.mobileNumber}
                  onChange={(event) =>
                    updateField(
                      "mobileNumber",
                      event.target.value
                    )
                  }
                  placeholder="Enter mobile number"
                  autoComplete="tel"
                  className="w-full rounded-[12px] border border-[#E9E3EE] px-4 py-2.5 text-[13px] text-[#2E0569] outline-none focus:ring-2 focus:ring-[#8C52FF]/30"
                />
              </div>

              {/* DOB */}

              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.08em] text-[#8B8292]"
                >
                  Date of Birth
                </label>

                <input
                  id="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(event) =>
                    updateField(
                      "dateOfBirth",
                      event.target.value
                    )
                  }
                  className="w-full rounded-[12px] border border-[#E9E3EE] px-4 py-2.5 text-[13px] text-[#2E0569] outline-none focus:ring-2 focus:ring-[#8C52FF]/30"
                />
              </div>

              {/* Gender */}

              <div>
                <label
                  htmlFor="gender"
                  className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.08em] text-[#8B8292]"
                >
                  Gender
                </label>

                <select
                  id="gender"
                  value={form.gender}
                  onChange={(event) =>
                    updateField(
                      "gender",
                      event.target.value
                    )
                  }
                  className="w-full rounded-[12px] border border-[#E9E3EE] bg-white px-4 py-2.5 text-[13px] text-[#2E0569] outline-none focus:ring-2 focus:ring-[#8C52FF]/30"
                >
                  <option value="">
                    Select gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>

                  <option value="Prefer not to say">
                    Prefer not to say
                  </option>
                </select>
              </div>

              {/* Profile Image */}

              <div>
                <label
                  htmlFor="profileImageUrl"
                  className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.08em] text-[#8B8292]"
                >
                  Profile Image URL
                </label>

                <input
                  id="profileImageUrl"
                  type="url"
                  value={form.profileImageUrl}
                  onChange={(event) =>
                    updateField(
                      "profileImageUrl",
                      event.target.value
                    )
                  }
                  placeholder="https://..."
                  className="w-full rounded-[12px] border border-[#E9E3EE] px-4 py-2.5 text-[13px] text-[#2E0569] outline-none focus:ring-2 focus:ring-[#8C52FF]/30"
                />
              </div>

              {/* Buttons */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setShowEdit(false)}
                  disabled={saving}
                  className="flex-1 rounded-full border border-[#E9E3EE] py-2.5 text-[13px] font-extrabold text-[#2E0569] transition hover:bg-[#F4EEFF] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#8C52FF] to-[#2E0569] py-2.5 text-[13px] font-extrabold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />
                  )}

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PAGE
// ============================================================

export default function ProfilePage() {
  return (
    <AppProvider>
      <div className="min-h-screen overflow-x-clip bg-[#FFFDF7]">

        <AnnouncementBar />

        <Header />

        <main>
          <AuthGuard>
            <ProfileContent />
          </AuthGuard>
        </main>

        <MobileBottomNav />

      </div>
    </AppProvider>
  );
}