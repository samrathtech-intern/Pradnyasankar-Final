"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Star,
  ChevronRight,
  User,
  Phone,
  X,
  Loader2,
  Home,
  Building2,
  MoreHorizontal,
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

type AddressType = "HOME" | "OFFICE" | "OTHER";

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

type Address = {
  addressId: number;
  userId: number;
  addressType: AddressType;
  fullName: string;
  mobileNumber: string;
  addressLine1: string;
  addressLine2: string | null;
  landmark: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

type AddressForm = {
  addressType: AddressType;
  fullName: string;
  mobileNumber: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

const API_BASE_URL = "http://localhost:8080/api";

const PROFILE_API_URL = `${API_BASE_URL}/profile`;
const ADDRESSES_API_URL = `${API_BASE_URL}/addresses`;

const EMPTY_FORM: AddressForm = {
  addressType: "HOME",
  fullName: "",
  mobileNumber: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false,
};

function AddressesContent() {
  const { token, logout } = useAuth();

  const [userId, setUserId] = useState<number | null>(null);

  const [addresses, setAddresses] = useState<Address[]>([]);

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [editingAddressId, setEditingAddressId] =
    useState<number | null>(null);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const [settingDefaultId, setSettingDefaultId] =
    useState<number | null>(null);

  const [form, setForm] = useState<AddressForm>(
    EMPTY_FORM
  );

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // ==========================================================
  // LOAD USER + ADDRESSES
  // ==========================================================

  useEffect(() => {
    if (!token) {
      return;
    }

    initializeAddresses();
  }, [token]);

  async function initializeAddresses() {
    if (!token) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      // ------------------------------------------------------
      // First get logged-in user's profile
      // ------------------------------------------------------

      const profileResponse = await fetch(
        PROFILE_API_URL,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (
        profileResponse.status === 401 ||
        profileResponse.status === 403
      ) {
        await logout();
        return;
      }

      if (!profileResponse.ok) {
        throw new Error(
          "Unable to load your profile."
        );
      }

      const profile =
        (await profileResponse.json()) as Profile;

      if (!profile.userId) {
        throw new Error(
          "User ID was not returned from the profile API."
        );
      }

      setUserId(profile.userId);

      // ------------------------------------------------------
      // Then load user's addresses
      // ------------------------------------------------------

      await loadAddresses(profile.userId);
    } catch (err) {
      console.error(
        "Address initialization error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your addresses."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================================
  // LOAD ADDRESSES
  // ==========================================================

  async function loadAddresses(
    currentUserId?: number
  ) {
    if (!token) {
      return;
    }

    const id = currentUserId ?? userId;

    if (!id) {
      return;
    }

    try {
      const response = await fetch(
        `${ADDRESSES_API_URL}/user/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        await logout();
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Failed to load addresses."
        );
      }

      const data =
        (await response.json()) as Address[];

      setAddresses(data);
    } catch (err) {
      console.error(
        "Address loading error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load addresses."
      );
    }
  }

  // ==========================================================
  // OPEN ADD FORM
  // ==========================================================

  function openAddForm() {
    setEditingAddressId(null);

    setForm({
      ...EMPTY_FORM,
      isDefault: addresses.length === 0,
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  // ==========================================================
  // OPEN EDIT FORM
  // ==========================================================

  function openEditForm(address: Address) {
    setEditingAddressId(address.addressId);

    setForm({
      addressType: address.addressType,
      fullName: address.fullName ?? "",
      mobileNumber: address.mobileNumber ?? "",
      addressLine1: address.addressLine1 ?? "",
      addressLine2: address.addressLine2 ?? "",
      landmark: address.landmark ?? "",
      city: address.city ?? "",
      state: address.state ?? "",
      postalCode: address.postalCode ?? "",
      country: address.country ?? "India",
      isDefault: address.isDefault ?? false,
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  // ==========================================================
  // FORM FIELD
  // ==========================================================

  function updateField(
    field: keyof AddressForm,
    value: string | boolean
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  // ==========================================================
  // SAVE ADDRESS
  // ==========================================================

  async function handleSaveAddress(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!token || !userId) {
      setError(
        "Your session has expired. Please login again."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const requestBody = {
        userId,
        addressType: form.addressType,
        fullName: form.fullName.trim(),
        mobileNumber: form.mobileNumber.trim(),
        addressLine1: form.addressLine1.trim(),
        addressLine2:
          form.addressLine2.trim() || null,
        landmark:
          form.landmark.trim() || null,
        city: form.city.trim(),
        state: form.state.trim(),
        postalCode: form.postalCode.trim(),
        country:
          form.country.trim() || "India",
        isDefault: form.isDefault,
      };

      const isEditing =
        editingAddressId !== null;

      const url = isEditing
        ? `${ADDRESSES_API_URL}/${editingAddressId}`
        : ADDRESSES_API_URL;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        await logout();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to save address."
        );
      }

      const savedAddress =
        data as Address;

      if (isEditing) {
        setAddresses((previous) =>
          previous.map((address) =>
            address.addressId ===
            savedAddress.addressId
              ? savedAddress
              : address
          )
        );

        setSuccess(
          "Address updated successfully."
        );
      } else {
        setAddresses((previous) => [
          ...previous,
          savedAddress,
        ]);

        setSuccess(
          "Address added successfully."
        );
      }

      setShowForm(false);
      setEditingAddressId(null);
      setForm(EMPTY_FORM);

      // Reload so default-address state is
      // always synchronized with backend.
      await loadAddresses(userId);

      window.setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "Address save error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save address."
      );
    } finally {
      setSaving(false);
    }
  }

  // ==========================================================
  // DELETE ADDRESS
  // ==========================================================

  async function handleDeleteAddress(
    addressId: number
  ) {
    if (!token) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(addressId);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${ADDRESSES_API_URL}/${addressId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        await logout();
        return;
      }

      const data = await response.text();

      if (!response.ok) {
        throw new Error(
          data || "Failed to delete address."
        );
      }

      setAddresses((previous) =>
        previous.filter(
          (address) =>
            address.addressId !== addressId
        )
      );

      setSuccess(
        "Address deleted successfully."
      );

      window.setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "Address delete error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete address."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // ==========================================================
  // SET DEFAULT ADDRESS
  // ==========================================================

  async function handleSetDefault(
    addressId: number
  ) {
    if (!token) {
      return;
    }

    try {
      setSettingDefaultId(addressId);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${ADDRESSES_API_URL}/${addressId}/default`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        await logout();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to set default address."
        );
      }

      const updatedAddress =
        data as Address;

      setAddresses((previous) =>
        previous.map((address) => ({
          ...address,
          isDefault:
            address.addressId ===
            updatedAddress.addressId,
        }))
      );

      setSuccess(
        "Default address updated."
      );

      window.setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "Default address error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to set default address."
      );
    } finally {
      setSettingDefaultId(null);
    }
  }

  // ==========================================================
  // ADDRESS TYPE ICON
  // ==========================================================

  function AddressTypeIcon({
    type,
  }: {
    type: AddressType;
  }) {
    if (type === "HOME") {
      return <Home size={18} />;
    }

    if (type === "OFFICE") {
      return <Building2 size={18} />;
    }

    return <MoreHorizontal size={18} />;
  }

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <Loader2
          size={30}
          className="animate-spin text-[#8C52FF]"
        />
      </div>
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#FFFDF7]">
      <div className="container-page py-10 lg:py-16">

        {/* PAGE HEADER */}

        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[.12em] text-[#8C52FF]">
                My Account
              </p>

              <h1 className="mt-2 text-[clamp(28px,4vw,44px)] font-extrabold tracking-[-.04em] text-[#2E0569]">
                My Addresses
              </h1>

              <p className="mt-2 text-[14px] text-[#716A78]">
                Manage your delivery addresses.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddForm}
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#8C52FF] to-[#2E0569] px-5 py-3 text-[12px] font-extrabold text-white transition hover:opacity-90"
            >
              <Plus size={15} />
              Add New Address
            </button>
          </div>
        </Reveal>

        {/* SUCCESS */}

        {success && (
          <div className="mt-5 rounded-[14px] border border-[#CFE8C4] bg-[#EAF4E4] px-4 py-3 text-[13px] font-semibold text-[#315C20]">
            {success}
          </div>
        )}

        {/* ERROR */}

        {error && !showForm && (
          <div className="mt-5 rounded-[14px] border border-[#F5C6C2] bg-[#FDECEA] px-4 py-3 text-[13px] font-semibold text-[#C0392B]">
            {error}
          </div>
        )}

        {/* CONTENT */}

        <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">

          {/* SIDEBAR */}

          <Reveal>
            <div className="overflow-hidden rounded-[24px] border border-[#E9E3EE] bg-white">

              <div className="border-b border-[#E9E3EE] px-5 py-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#F4EEFF]">
                    <User
                      size={22}
                      className="text-[#8C52FF]"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[14px] font-extrabold text-[#2E0569]">
                      My Account
                    </p>

                    <p className="mt-0.5 text-[11px] text-[#8B8292]">
                      Delivery addresses
                    </p>
                  </div>
                </div>
              </div>

              <nav className="p-2">

                <Link
                  href="/profile"
                  className="flex items-center gap-3 rounded-[14px] px-4 py-3 text-[13px] font-semibold text-[#716A78] transition hover:bg-[#FAF6FF] hover:text-[#2E0569]"
                >
                  <User size={16} />

                  <span className="flex-1">
                    My Profile
                  </span>

                  <ChevronRight size={15} />
                </Link>

                <Link
                  href="/profile/orders"
                  className="mt-1 flex items-center gap-3 rounded-[14px] px-4 py-3 text-[13px] font-semibold text-[#716A78] transition hover:bg-[#FAF6FF] hover:text-[#2E0569]"
                >
                  <span className="flex-1">
                    My Orders
                  </span>

                  <ChevronRight size={15} />
                </Link>

                <Link
                  href="/profile/addresses"
                  className="mt-1 flex items-center gap-3 rounded-[14px] bg-[#F4EEFF] px-4 py-3 text-[13px] font-extrabold text-[#2E0569]"
                >
                  <MapPin
                    size={16}
                    className="text-[#8C52FF]"
                  />

                  <span className="flex-1">
                    My Addresses
                  </span>

                  <ChevronRight size={15} />
                </Link>

                <Link
                  href="/wishlist"
                  className="mt-1 flex items-center gap-3 rounded-[14px] px-4 py-3 text-[13px] font-semibold text-[#716A78] transition hover:bg-[#FAF6FF] hover:text-[#2E0569]"
                >
                  <span className="flex-1">
                    Wishlist
                  </span>

                  <ChevronRight size={15} />
                </Link>
              </nav>
            </div>
          </Reveal>

          {/* ADDRESS LIST */}

          <Reveal>
            <div className="space-y-4">

              {addresses.length === 0 ? (
                <div className="rounded-[24px] border border-[#E9E3EE] bg-white px-6 py-14 text-center">

                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#F4EEFF]">
                    <MapPin
                      size={28}
                      className="text-[#8C52FF]"
                    />
                  </div>

                  <h2 className="mt-5 text-[18px] font-extrabold text-[#2E0569]">
                    No addresses yet
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-[13px] text-[#8B8292]">
                    Add a delivery address so you
                    can quickly use it during
                    checkout.
                  </p>

                  <button
                    type="button"
                    onClick={openAddForm}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8C52FF] to-[#2E0569] px-5 py-3 text-[12px] font-extrabold text-white"
                  >
                    <Plus size={15} />
                    Add Address
                  </button>
                </div>
              ) : (
                addresses.map((address) => (
                  <div
                    key={address.addressId}
                    className="rounded-[24px] border border-[#E9E3EE] bg-white p-5 sm:p-6"
                  >
                    {/* CARD HEADER */}

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                      <div className="flex items-start gap-4">

                        <div
                          className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${
                            address.addressType ===
                            "HOME"
                              ? "bg-[#EAF4E4] text-[#315C20]"
                              : address.addressType ===
                                "OFFICE"
                              ? "bg-[#E3EEFF] text-[#1A4F8A]"
                              : "bg-[#F4EEFF] text-[#8C52FF]"
                          }`}
                        >
                          <AddressTypeIcon
                            type={
                              address.addressType
                            }
                          />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-[15px] font-extrabold text-[#2E0569]">
                              {address.addressType}
                            </h2>

                            {address.isDefault && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF4E4] px-2.5 py-1 text-[10px] font-extrabold text-[#315C20]">
                                <Star
                                  size={10}
                                  fill="currentColor"
                                />
                                Default
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-[12px] text-[#8B8292]">
                            Address ID: #
                            {address.addressId}
                          </p>
                        </div>
                      </div>

                      {/* ACTIONS */}

                      <div className="flex items-center gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            openEditForm(
                              address
                            )
                          }
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#E9E3EE] px-3.5 py-2 text-[11px] font-extrabold text-[#2E0569] transition hover:bg-[#F4EEFF]"
                        >
                          <Pencil size={13} />
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={
                            deletingId ===
                            address.addressId
                          }
                          onClick={() =>
                            handleDeleteAddress(
                              address.addressId
                            )
                          }
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#F5C6C2] px-3.5 py-2 text-[11px] font-extrabold text-[#C0392B] transition hover:bg-[#FDECEA] disabled:opacity-50"
                        >
                          {deletingId ===
                          address.addressId ? (
                            <Loader2
                              size={13}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={13} />
                          )}

                          Delete
                        </button>

                      </div>
                    </div>

                    {/* ADDRESS */}

                    <div className="mt-5 border-t border-[#F0EBF2] pt-5">

                      <div className="grid gap-4 sm:grid-cols-2">

                        <div>
                          <div className="flex items-center gap-2">
                            <User
                              size={14}
                              className="text-[#8C52FF]"
                            />

                            <p className="text-[10px] font-extrabold uppercase tracking-[.08em] text-[#8B8292]">
                              Contact
                            </p>
                          </div>

                          <p className="mt-2 text-[14px] font-extrabold text-[#2E0569]">
                            {address.fullName}
                          </p>

                          <p className="mt-1 flex items-center gap-1.5 text-[12px] text-[#716A78]">
                            <Phone size={12} />
                            {address.mobileNumber}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <MapPin
                              size={14}
                              className="text-[#8C52FF]"
                            />

                            <p className="text-[10px] font-extrabold uppercase tracking-[.08em] text-[#8B8292]">
                              Delivery Address
                            </p>
                          </div>

                          <p className="mt-2 text-[13px] font-semibold leading-relaxed text-[#2E0569]">
                            {address.addressLine1}
                            {address.addressLine2 && (
                              <>
                                ,{" "}
                                {
                                  address.addressLine2
                                }
                              </>
                            )}
                            {address.landmark && (
                              <>
                                ,{" "}
                                {address.landmark}
                              </>
                            )}
                          </p>

                          <p className="mt-1 text-[12px] text-[#716A78]">
                            {address.city},{" "}
                            {address.state} -{" "}
                            {address.postalCode}
                          </p>

                          <p className="mt-1 text-[12px] text-[#716A78]">
                            {address.country ||
                              "India"}
                          </p>
                        </div>
                      </div>

                      {/* DEFAULT BUTTON */}

                      {!address.isDefault && (
                        <button
                          type="button"
                          disabled={
                            settingDefaultId ===
                            address.addressId
                          }
                          onClick={() =>
                            handleSetDefault(
                              address.addressId
                            )
                          }
                          className="mt-5 inline-flex items-center gap-2 text-[11px] font-extrabold text-[#8C52FF] transition hover:text-[#2E0569] disabled:opacity-50"
                        >
                          {settingDefaultId ===
                          address.addressId ? (
                            <Loader2
                              size={13}
                              className="animate-spin"
                            />
                          ) : (
                            <Star size={13} />
                          )}

                          Set as default address
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Reveal>
        </div>
      </div>

      {/* ======================================================
          ADD / EDIT ADDRESS MODAL
      ====================================================== */}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">

          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl sm:p-7">

            {/* MODAL HEADER */}

            <div className="flex items-start justify-between">

              <div>
                <h2 className="text-[19px] font-extrabold text-[#2E0569]">
                  {editingAddressId
                    ? "Edit Address"
                    : "Add New Address"}
                </h2>

                <p className="mt-1 text-[12px] text-[#8B8292]">
                  Enter your delivery address
                  details.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
                className="grid h-9 w-9 place-items-center rounded-full bg-[#F4EEFF] text-[#716A78] transition hover:text-[#2E0569]"
              >
                <X size={17} />
              </button>
            </div>

            {/* ERROR */}

            {error && (
              <div className="mt-5 rounded-[12px] border border-[#F5C6C2] bg-[#FDECEA] px-4 py-3 text-[12px] font-semibold text-[#C0392B]">
                {error}
              </div>
            )}

            {/* FORM */}

            <form
              onSubmit={handleSaveAddress}
              className="mt-6 space-y-4"
            >

              {/* ADDRESS TYPE */}

              <div>
                <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.08em] text-[#8B8292]">
                  Address Type
                </label>

                <div className="grid grid-cols-3 gap-2">

                  {(
                    [
                      "HOME",
                      "OFFICE",
                      "OTHER",
                    ] as AddressType[]
                  ).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        updateField(
                          "addressType",
                          type
                        )
                      }
                      className={`rounded-[12px] border px-3 py-3 text-[12px] font-extrabold transition ${
                        form.addressType ===
                        type
                          ? "border-[#8C52FF] bg-[#F4EEFF] text-[#2E0569]"
                          : "border-[#E9E3EE] text-[#716A78] hover:bg-[#FAF6FF]"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* NAME + MOBILE */}

              <div className="grid gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.08em] text-[#8B8292]">
                    Full Name
                  </label>

                  <input
                    required
                    type="text"
                    value={form.fullName}
                    onChange={(e) =>
                      updateField(
                        "fullName",
                        e.target.value
                      )
                    }
                    placeholder="Enter full name"
                    className="w-full rounded-[12px] border border-[#E9E3EE] px-4 py-2.5 text-[13px] text-[#2E0569] outline-none focus:ring-2 focus:ring-[#8C52FF]/30"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.08em] text-[#8B8292]">
                    Mobile Number
                  </label>

                  <input
                    required
                    type="tel"
                    value={form.mobileNumber}
                    onChange={(e) =>
                      updateField(
                        "mobileNumber",
                        e.target.value
                      )
                    }
                    placeholder="Enter mobile number"
                    className="w-full rounded-[12px] border border-[#E9E3EE] px-4 py-2.5 text-[13px] text-[#2E0569] outline-none focus:ring-2 focus:ring-[#8C52FF]/30"
                  />
                </div>
              </div>

              {/* ADDRESS LINE 1 */}

              <div>
                <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.08em] text-[#8B8292]">
                  Address Line 1
                </label>

                <input
                  required
                  type="text"
                  value={form.addressLine1}
                  onChange={(e) =>
                    updateField(
                      "addressLine1",
                      e.target.value
                    )
                  }
                  placeholder="House / Flat / Building / Street"
                  className="w-full rounded-[12px] border border-[#E9E3EE] px-4 py-2.5 text-[13px] text-[#2E0569] outline-none focus:ring-2 focus:ring-[#8C52FF]/30"
                />
              </div>

              {/* ADDRESS LINE 2 */}

              <div>
                <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.08em] text-[#8B8292]">
                  Address Line 2
                </label>

                <input
                  type="text"
                  value={form.addressLine2}
                  onChange={(e) =>
                    updateField(
                      "addressLine2",
                      e.target.value
                    )
                  }
                  placeholder="Area / Locality"
                  className="w-full rounded-[12px] border border-[#E9E3EE] px-4 py-2.5 text-[13px] text-[#2E0569] outline-none focus:ring-2 focus:ring-[#8C52FF]/30"
                />
              </div>

              {/* LANDMARK */}

              <div>
                <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.08em] text-[#8B8292]">
                  Landmark
                </label>

                <input
                  type="text"
                  value={form.landmark}
                  onChange={(e) =>
                    updateField(
                      "landmark",
                      e.target.value
                    )
                  }
                  placeholder="Nearby landmark"
                  className="w-full rounded-[12px] border border-[#E9E3EE] px-4 py-2.5 text-[13px] text-[#2E0569] outline-none focus:ring-2 focus:ring-[#8C52FF]/30"
                />
              </div>

              {/* CITY + STATE */}

              <div className="grid gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.08em] text-[#8B8292]">
                    City
                  </label>

                  <input
                    required
                    type="text"
                    value={form.city}
                    onChange={(e) =>
                      updateField(
                        "city",
                        e.target.value
                      )
                    }
                    placeholder="City"
                    className="w-full rounded-[12px] border border-[#E9E3EE] px-4 py-2.5 text-[13px] text-[#2E0569] outline-none focus:ring-2 focus:ring-[#8C52FF]/30"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.08em] text-[#8B8292]">
                    State
                  </label>

                  <input
                    required
                    type="text"
                    value={form.state}
                    onChange={(e) =>
                      updateField(
                        "state",
                        e.target.value
                      )
                    }
                    placeholder="State"
                    className="w-full rounded-[12px] border border-[#E9E3EE] px-4 py-2.5 text-[13px] text-[#2E0569] outline-none focus:ring-2 focus:ring-[#8C52FF]/30"
                  />
                </div>
              </div>

              {/* POSTAL + COUNTRY */}

              <div className="grid gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.08em] text-[#8B8292]">
                    Postal Code
                  </label>

                  <input
                    required
                    type="text"
                    value={form.postalCode}
                    onChange={(e) =>
                      updateField(
                        "postalCode",
                        e.target.value
                      )
                    }
                    placeholder="Postal code"
                    className="w-full rounded-[12px] border border-[#E9E3EE] px-4 py-2.5 text-[13px] text-[#2E0569] outline-none focus:ring-2 focus:ring-[#8C52FF]/30"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.08em] text-[#8B8292]">
                    Country
                  </label>

                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) =>
                      updateField(
                        "country",
                        e.target.value
                      )
                    }
                    className="w-full rounded-[12px] border border-[#E9E3EE] px-4 py-2.5 text-[13px] text-[#2E0569] outline-none focus:ring-2 focus:ring-[#8C52FF]/30"
                  />
                </div>
              </div>

              {/* DEFAULT */}

              <label className="flex cursor-pointer items-center gap-3 rounded-[14px] bg-[#FAF6FF] px-4 py-3">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) =>
                    updateField(
                      "isDefault",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 accent-[#8C52FF]"
                />

                <div>
                  <p className="text-[12px] font-extrabold text-[#2E0569]">
                    Set as default address
                  </p>

                  <p className="mt-0.5 text-[10px] text-[#8B8292]">
                    Use this address automatically
                    during checkout.
                  </p>
                </div>
              </label>

              {/* BUTTONS */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowForm(false)
                  }
                  className="flex-1 rounded-full border border-[#E9E3EE] py-2.5 text-[13px] font-extrabold text-[#2E0569] transition hover:bg-[#F4EEFF]"
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
                    : editingAddressId
                    ? "Update Address"
                    : "Save Address"}
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

export default function AddressesPage() {
  return (
    <AppProvider>
      <div className="min-h-screen overflow-x-clip bg-[#FFFDF7]">

        <AnnouncementBar />

        <Header />

        <main>
          <AuthGuard>
            <AddressesContent />
          </AuthGuard>
        </main>

        <MobileBottomNav />

      </div>
    </AppProvider>
  );
}