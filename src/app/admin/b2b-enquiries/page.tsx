
"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Building2,
  Eye,
  Mail,
  Phone,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  deleteAdminB2BEnquiry,
  fetchAdminB2BEnquiries,
  updateAdminB2BEnquiryStatus,
} from "@/lib/adminApi";

import type {
  AdminB2BEnquiry,
  B2BEnquiryStatus,
} from "@/lib/adminApi";

const STATUS_OPTIONS: B2BEnquiryStatus[] = [
  "NEW",
  "IN_PROGRESS",
  "CONTACTED",
  "CLOSED",
];

type StatusFilter = B2BEnquiryStatus | "ALL";

function formatStatus(status: B2BEnquiryStatus): string {
  return status.replace(/_/g, " ");
}

function statusClass(status: B2BEnquiryStatus): string {
  switch (status) {
    case "NEW":
      return "bg-[#FDECEA] text-[#8B1A1A]";

    case "IN_PROGRESS":
      return "bg-[#FFF4D6] text-[#8A6200]";

    case "CONTACTED":
      return "bg-[#EAF0FF] text-[#3152A0]";

    case "CLOSED":
      return "bg-[#F0EAF4] text-[#716A78]";

    default:
      return "bg-[#F0EAF4] text-[#716A78]";
  }
}

function formatDate(value: string | Date | null | undefined): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-IN");
}

function formatDateTime(
  value: string | Date | null | undefined,
): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("en-IN");
}

export default function AdminB2BEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<AdminB2BEnquiry[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const [selectedEnquiry, setSelectedEnquiry] =
    useState<AdminB2BEnquiry | null>(null);

  const [selectedStatus, setSelectedStatus] =
    useState<B2BEnquiryStatus>("NEW");

  const [updating, setUpdating] = useState(false);

  const [deleting, setDeleting] = useState(false);

  async function loadEnquiries() {
    try {
      setLoading(true);
      setError("");

      const data = await fetchAdminB2BEnquiries();

      setEnquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load B2B enquiries:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load B2B enquiries.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadEnquiries();
  }, []);

  const displayedEnquiries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return enquiries.filter((enquiry) => {
      const searchableText = [
        enquiry.companyName,
        enquiry.contactPerson,
        enquiry.email,
        enquiry.mobileNumber,
        enquiry.gstNumber ?? "",
        enquiry.businessType ?? "",
        enquiry.message,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        enquiry.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [enquiries, search, statusFilter]);

  const totalCount = enquiries.length;

  const newCount = enquiries.filter(
    (item) => item.status === "NEW",
  ).length;

  const inProgressCount = enquiries.filter(
    (item) => item.status === "IN_PROGRESS",
  ).length;

  const contactedCount = enquiries.filter(
    (item) => item.status === "CONTACTED",
  ).length;

  function openEnquiry(enquiry: AdminB2BEnquiry) {
    setSelectedEnquiry(enquiry);
    setSelectedStatus(enquiry.status);
    setError("");
  }

  function closeModal() {
    if (updating || deleting) {
      return;
    }

    setSelectedEnquiry(null);
  }

  async function handleUpdateStatus() {
    if (!selectedEnquiry) {
      return;
    }

    try {
      setUpdating(true);
      setError("");

      const updated =
        await updateAdminB2BEnquiryStatus(
          selectedEnquiry.enquiryId,
          selectedStatus,
        );

      setEnquiries((previous) =>
        previous.map((enquiry) =>
          enquiry.enquiryId === updated.enquiryId
            ? updated
            : enquiry,
        ),
      );

      setSelectedEnquiry(updated);
      setSelectedStatus(updated.status);
    } catch (err) {
      console.error(
        "Failed to update B2B enquiry:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update enquiry status.",
      );
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    if (!selectedEnquiry) {
      return;
    }

    const confirmed = window.confirm(
      `Delete B2B enquiry #${selectedEnquiry.enquiryId}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteAdminB2BEnquiry(
        selectedEnquiry.enquiryId,
      );

      setEnquiries((previous) =>
        previous.filter(
          (enquiry) =>
            enquiry.enquiryId !==
            selectedEnquiry.enquiryId,
        ),
      );

      setSelectedEnquiry(null);
    } catch (err) {
      console.error(
        "Failed to delete B2B enquiry:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete enquiry.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="w-full">
      {/* HEADER */}

      <div className="mb-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-[12px] bg-[#F2EBFF] text-[#8C52FF]">
            <Building2 size={19} />
          </span>

          <div>
            <h1 className="text-[24px] font-extrabold tracking-[-.04em] text-[#2E0569]">
              B2B Enquiries
            </h1>

            <p className="mt-1 text-[13px] text-[#716A78]">
              Manage business enquiries and partnership
              requests.
            </p>
          </div>
        </div>
      </div>

      {/* SUMMARY */}

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[16px] border border-[#E9E3EE] bg-white p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[.1em] text-[#9B93A1]">
            Total
          </p>

          <p className="mt-1 text-[24px] font-extrabold text-[#2E0569]">
            {totalCount}
          </p>
        </div>

        <div className="rounded-[16px] border border-[#E9E3EE] bg-white p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[.1em] text-[#9B93A1]">
            New
          </p>

          <p className="mt-1 text-[24px] font-extrabold text-[#8B1A1A]">
            {newCount}
          </p>
        </div>

        <div className="rounded-[16px] border border-[#E9E3EE] bg-white p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[.1em] text-[#9B93A1]">
            In Progress
          </p>

          <p className="mt-1 text-[24px] font-extrabold text-[#8A6200]">
            {inProgressCount}
          </p>
        </div>

        <div className="rounded-[16px] border border-[#E9E3EE] bg-white p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[.1em] text-[#9B93A1]">
            Contacted
          </p>

          <p className="mt-1 text-[24px] font-extrabold text-[#3152A0]">
            {contactedCount}
          </p>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-5 flex items-center justify-between gap-4 rounded-[12px] bg-[#FDECEA] px-4 py-3 text-[13px] font-semibold text-[#8B1A1A]">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            className="shrink-0"
            aria-label="Dismiss error"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* SEARCH + FILTER */}

      <div className="mb-5 flex flex-wrap gap-3">
        <div className="flex min-h-10 w-full max-w-sm items-center gap-2 rounded-[12px] border border-[#E9E3EE] bg-white px-3">
          <Search
            size={14}
            className="shrink-0 text-[#8C52FF]"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, contact, email..."
            className="w-full bg-transparent text-[13px] font-semibold text-[#2E0569] outline-none placeholder:text-[#9B93A1]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value as StatusFilter,
            )
          }
          className="rounded-[12px] border border-[#E9E3EE] bg-white px-3 py-2 text-[13px] font-semibold text-[#2E0569] outline-none"
        >
          <option value="ALL">All statuses</option>

          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {formatStatus(status)}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}

      <div className="overflow-hidden rounded-[20px] border border-[#E9E3EE] bg-white">
        {loading ? (
          <div className="px-4 py-12 text-center text-[13px] font-semibold text-[#9B93A1]">
            Loading B2B enquiries...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="border-b border-[#E9E3EE] bg-[#FAFAFA]">
                <tr>
                  {[
                    "Company",
                    "Contact",
                    "Business Type",
                    "Message",
                    "Status",
                    "Date",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="whitespace-nowrap px-4 py-3 text-[10px] font-extrabold uppercase tracking-[.1em] text-[#8B8292]"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F0EAF4]">
                {displayedEnquiries.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-10 text-center text-[13px] font-semibold text-[#9B93A1]"
                    >
                      No B2B enquiries found.
                    </td>
                  </tr>
                )}

                {displayedEnquiries.map((enquiry) => (
                  <tr
                    key={enquiry.enquiryId}
                    className="transition-colors hover:bg-[#FAFAFA]"
                  >
                    {/* COMPANY */}

                    <td className="px-4 py-3">
                      <p className="font-extrabold text-[#2E0569]">
                        {enquiry.companyName}
                      </p>

                      <p className="text-[11px] text-[#9B93A1]">
                        Enquiry #{enquiry.enquiryId}
                      </p>

                      {enquiry.gstNumber && (
                        <p className="text-[11px] text-[#9B93A1]">
                          GST: {enquiry.gstNumber}
                        </p>
                      )}
                    </td>

                    {/* CONTACT */}

                    <td className="px-4 py-3">
                      <p className="font-extrabold text-[#2E0569]">
                        {enquiry.contactPerson}
                      </p>

                      <p className="text-[11px] text-[#9B93A1]">
                        {enquiry.email}
                      </p>

                      <p className="text-[11px] text-[#9B93A1]">
                        {enquiry.mobileNumber}
                      </p>
                    </td>

                    {/* BUSINESS TYPE */}

                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="rounded-full bg-[#F2EBFF] px-2.5 py-1 text-[10px] font-extrabold text-[#8C52FF]">
                        {enquiry.businessType ?? "-"}
                      </span>
                    </td>

                    {/* MESSAGE */}

                    <td className="max-w-[280px] px-4 py-3 text-[#716A78]">
                      <p className="line-clamp-2">
                        {enquiry.message}
                      </p>
                    </td>

                    {/* STATUS */}

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-extrabold ${statusClass(
                          enquiry.status,
                        )}`}
                      >
                        {formatStatus(enquiry.status)}
                      </span>
                    </td>

                    {/* DATE */}

                    <td className="whitespace-nowrap px-4 py-3 text-[11px] text-[#716A78]">
                      {formatDate(enquiry.createdAt)}
                    </td>

                    {/* ACTION */}

                    <td className="px-4 py-3">
                      <button
                        type="button"
                        title="View enquiry"
                        aria-label="View enquiry"
                        onClick={() =>
                          openEnquiry(enquiry)
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-[8px] text-[#8C52FF] hover:bg-[#F4EEFF]"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}

      {selectedEnquiry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[24px] bg-white shadow-2xl">
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-[#E9E3EE] px-6 py-4">
              <div>
                <h2 className="text-[16px] font-extrabold text-[#2E0569]">
                  B2B Enquiry
                </h2>

                <p className="text-[11px] text-[#9B93A1]">
                  Enquiry #{selectedEnquiry.enquiryId}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={updating || deleting}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4EEFF] text-[#8C52FF] disabled:opacity-50"
                aria-label="Close modal"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              {/* COMPANY */}

              <div>
                <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF]">
                  Company
                </p>

                <p className="text-[15px] font-extrabold text-[#2E0569]">
                  {selectedEnquiry.companyName}
                </p>

                <p className="mt-1 text-[12px] text-[#716A78]">
                  {selectedEnquiry.contactPerson}
                </p>
              </div>

              {/* CONTACT DETAILS */}

              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href={`mailto:${selectedEnquiry.email}`}
                  className="rounded-[12px] border border-[#E9E3EE] bg-[#FAFAFA] p-3 hover:bg-[#F4EEFF]"
                >
                  <div className="flex items-center gap-2">
                    <Mail
                      size={14}
                      className="text-[#8C52FF]"
                    />

                    <p className="text-[10px] font-extrabold uppercase text-[#9B93A1]">
                      Email
                    </p>
                  </div>

                  <p className="mt-1 break-all text-[12px] font-semibold text-[#2E0569]">
                    {selectedEnquiry.email}
                  </p>
                </a>

                <a
                  href={`tel:${selectedEnquiry.mobileNumber}`}
                  className="rounded-[12px] border border-[#E9E3EE] bg-[#FAFAFA] p-3 hover:bg-[#F4EEFF]"
                >
                  <div className="flex items-center gap-2">
                    <Phone
                      size={14}
                      className="text-[#8C52FF]"
                    />

                    <p className="text-[10px] font-extrabold uppercase text-[#9B93A1]">
                      Mobile
                    </p>
                  </div>

                  <p className="mt-1 text-[12px] font-semibold text-[#2E0569]">
                    {selectedEnquiry.mobileNumber}
                  </p>
                </a>
              </div>

              {/* COMPANY DETAILS */}

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[12px] border border-[#E9E3EE] bg-[#FAFAFA] p-3">
                  <p className="text-[10px] font-extrabold uppercase text-[#9B93A1]">
                    Business Type
                  </p>

                  <p className="mt-1 text-[13px] font-extrabold text-[#2E0569]">
                    {selectedEnquiry.businessType ?? "-"}
                  </p>
                </div>

                <div className="rounded-[12px] border border-[#E9E3EE] bg-[#FAFAFA] p-3">
                  <p className="text-[10px] font-extrabold uppercase text-[#9B93A1]">
                    GST Number
                  </p>

                  <p className="mt-1 text-[13px] font-extrabold text-[#2E0569]">
                    {selectedEnquiry.gstNumber ?? "-"}
                  </p>
                </div>
              </div>

              {/* MESSAGE */}

              <div>
                <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF]">
                  Requirement / Message
                </p>

                <div className="rounded-[12px] bg-[#FAFAFA] p-4 text-[13px] leading-6 text-[#716A78]">
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* CREATED / UPDATED */}

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[12px] border border-[#E9E3EE] p-3">
                  <p className="text-[10px] font-extrabold uppercase text-[#9B93A1]">
                    Created
                  </p>

                  <p className="mt-1 text-[12px] font-semibold text-[#2E0569]">
                    {formatDateTime(
                      selectedEnquiry.createdAt,
                    )}
                  </p>
                </div>

                <div className="rounded-[12px] border border-[#E9E3EE] p-3">
                  <p className="text-[10px] font-extrabold uppercase text-[#9B93A1]">
                    Updated
                  </p>

                  <p className="mt-1 text-[12px] font-semibold text-[#2E0569]">
                    {formatDateTime(
                      selectedEnquiry.updatedAt,
                    )}
                  </p>
                </div>
              </div>

              {/* STATUS */}

              <div>
                <label
                  htmlFor="b2b-status"
                  className="mb-1 block text-[10px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF]"
                >
                  Status
                </label>

                <select
                  id="b2b-status"
                  value={selectedStatus}
                  onChange={(event) =>
                    setSelectedStatus(
                      event.target.value as B2BEnquiryStatus,
                    )
                  }
                  disabled={updating || deleting}
                  className="w-full rounded-[12px] border border-[#E9E3EE] bg-white px-3 py-2.5 text-[13px] font-semibold text-[#2E0569] outline-none disabled:opacity-50"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {formatStatus(status)}
                    </option>
                  ))}
                </select>
              </div>

              {/* BUTTONS */}

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={updating || deleting}
                  onClick={closeModal}
                  className="flex-1 rounded-[12px] border border-[#E9E3EE] py-2.5 text-[13px] font-extrabold text-[#716A78] disabled:opacity-50"
                >
                  Close
                </button>

                <button
                  type="button"
                  disabled={updating || deleting}
                  onClick={handleUpdateStatus}
                  className="flex-1 rounded-[12px] bg-[#8C52FF] py-2.5 text-[13px] font-extrabold text-white disabled:opacity-50"
                >
                  {updating
                    ? "Saving..."
                    : "Save Status"}
                </button>
              </div>

              {/* DELETE */}

              <button
                type="button"
                disabled={updating || deleting}
                onClick={handleDelete}
                className="flex w-full items-center justify-center gap-2 rounded-[12px] border border-[#F3C7C2] py-2.5 text-[13px] font-extrabold text-[#C0392B] hover:bg-[#FDECEA] disabled:opacity-50"
              >
                <Trash2 size={14} />

                {deleting
                  ? "Deleting..."
                  : "Delete Enquiry"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// "use client";

// import {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import {
//   Building2,
//   Eye,
//   Mail,
//   Phone,
//   Search,
//   Trash2,
//   X,
// } from "lucide-react";

// import {
//   deleteAdminB2BEnquiry,
//   fetchAdminB2BEnquiries,
//   updateAdminB2BEnquiryStatus,
// } from "@/lib/adminApi";

// import type {
//   AdminB2BEnquiry,
//   B2BEnquiryStatus,
// } from "@/lib/adminApi";

// const STATUS_OPTIONS: B2BEnquiryStatus[] = [
//   "NEW",
//   "IN_PROGRESS",
//   "CONTACTED",
//   "CLOSED",
// ];

// function formatStatus(
//   status: B2BEnquiryStatus,
// ) {
//   return status.replace("_", " ");
// }

// function statusClass(
//   status: B2BEnquiryStatus,
// ) {
//   switch (status) {
//     case "NEW":
//       return "bg-[#FDECEA] text-[#8B1A1A]";

//     case "IN_PROGRESS":
//       return "bg-[#FFF4D6] text-[#8A6200]";

//     case "CONTACTED":
//       return "bg-[#EAF0FF] text-[#3152A0]";

//     case "CLOSED":
//       return "bg-[#F0EAF4] text-[#716A78]";

//     default:
//       return "bg-[#F0EAF4] text-[#716A78]";
//   }
// }

// export default function AdminB2BEnquiriesPage() {
//   const [enquiries, setEnquiries] =
//     useState<AdminB2BEnquiry[]>([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [error, setError] =
//     useState("");

//   const [search, setSearch] =
//     useState("");

//   const [statusFilter, setStatusFilter] =
//     useState<
//       B2BEnquiryStatus | "ALL"
//     >("ALL");

//   const [selectedEnquiry, setSelectedEnquiry] =
//     useState<AdminB2BEnquiry | null>(null);

//   const [selectedStatus, setSelectedStatus] =
//     useState<B2BEnquiryStatus>("NEW");

//   const [updating, setUpdating] =
//     useState(false);

//   const [deleting, setDeleting] =
//     useState(false);

//   async function loadEnquiries() {
//     try {
//       setLoading(true);
//       setError("");

//       const data =
//         await fetchAdminB2BEnquiries();

//       setEnquiries(
//         Array.isArray(data)
//           ? data
//           : [],
//       );
//     } catch (err) {
//       console.error(err);

//       setError(
//         err instanceof Error
//           ? err.message
//           : "Failed to load B2B enquiries.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadEnquiries();
//   }, []);

//   const displayedEnquiries =
//     useMemo(() => {
//       const query = search
//         .trim()
//         .toLowerCase();

//       return enquiries.filter(
//         (enquiry) => {
//           const matchesSearch =
//             !query ||
//             [
//               enquiry.companyName,
//               enquiry.contactPerson,
//               enquiry.email,
//               enquiry.mobileNumber,
//               enquiry.gstNumber ?? "",
//               enquiry.businessType ?? "",
//               enquiry.message,
//             ]
//               .join(" ")
//               .toLowerCase()
//               .includes(query);

//           const matchesStatus =
//             statusFilter === "ALL" ||
//             enquiry.status ===
//               statusFilter;

//           return (
//             matchesSearch &&
//             matchesStatus
//           );
//         },
//       );
//     }, [
//       enquiries,
//       search,
//       statusFilter,
//     ]);

//   function openEnquiry(
//     enquiry: AdminB2BEnquiry,
//   ) {
//     setSelectedEnquiry(enquiry);
//     setSelectedStatus(
//       enquiry.status,
//     );
//   }

//   async function handleUpdateStatus() {
//     if (!selectedEnquiry) {
//       return;
//     }

//     try {
//       setUpdating(true);
//       setError("");

//       const updated =
//         await updateAdminB2BEnquiryStatus(
//           selectedEnquiry.enquiryId,
//           selectedStatus,
//         );

//       setEnquiries((previous) =>
//         previous.map((enquiry) =>
//           enquiry.enquiryId ===
//           updated.enquiryId
//             ? updated
//             : enquiry,
//         ),
//       );

//       setSelectedEnquiry(updated);
//     } catch (err) {
//       console.error(err);

//       setError(
//         err instanceof Error
//           ? err.message
//           : "Failed to update enquiry status.",
//       );
//     } finally {
//       setUpdating(false);
//     }
//   }

//   async function handleDelete() {
//     if (!selectedEnquiry) {
//       return;
//     }

//     const confirmed =
//       window.confirm(
//         `Delete B2B enquiry #${selectedEnquiry.enquiryId}?`,
//       );

//     if (!confirmed) {
//       return;
//     }

//     try {
//       setDeleting(true);
//       setError("");

//       await deleteAdminB2BEnquiry(
//         selectedEnquiry.enquiryId,
//       );

//       setEnquiries((previous) =>
//         previous.filter(
//           (enquiry) =>
//             enquiry.enquiryId !==
//             selectedEnquiry.enquiryId,
//         ),
//       );

//       setSelectedEnquiry(null);
//     } catch (err) {
//       console.error(err);

//       setError(
//         err instanceof Error
//           ? err.message
//           : "Failed to delete enquiry.",
//       );
//     } finally {
//       setDeleting(false);
//     }
//   }

//   return (
//     <div>
//       {/* HEADER */}

//       <div className="mb-6">
//         <div className="flex items-center gap-3">
//           <span className="grid h-10 w-10 place-items-center rounded-[12px] bg-[#F2EBFF] text-[#8C52FF]">
//             <Building2 size={19} />
//           </span>

//           <div>
//             <h1 className="text-[24px] font-extrabold tracking-[-.04em] text-[#2E0569]">
//               B2B Enquiries
//             </h1>

//             <p className="mt-1 text-[13px] text-[#716A78]">
//               Manage business enquiries and partnership requests.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* SUMMARY */}

//       <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
//         <div className="rounded-[16px] border border-[#E9E3EE] bg-white p-4">
//           <p className="text-[10px] font-extrabold uppercase tracking-[.1em] text-[#9B93A1]">
//             Total
//           </p>

//           <p className="mt-1 text-[24px] font-extrabold text-[#2E0569]">
//             {enquiries.length}
//           </p>
//         </div>

//         <div className="rounded-[16px] border border-[#E9E3EE] bg-white p-4">
//           <p className="text-[10px] font-extrabold uppercase tracking-[.1em] text-[#9B93A1]">
//             New
//           </p>

//           <p className="mt-1 text-[24px] font-extrabold text-[#8B1A1A]">
//             {
//               enquiries.filter(
//                 (item) =>
//                   item.status === "NEW",
//               ).length
//             }
//           </p>
//         </div>

//         <div className="rounded-[16px] border border-[#E9E3EE] bg-white p-4">
//           <p className="text-[10px] font-extrabold uppercase tracking-[.1em] text-[#9B93A1]">
//             In Progress
//           </p>

//           <p className="mt-1 text-[24px] font-extrabold text-[#8A6200]">
//             {
//               enquiries.filter(
//                 (item) =>
//                   item.status ===
//                   "IN_PROGRESS",
//               ).length
//             }
//           </p>
//         </div>

//         <div className="rounded-[16px] border border-[#E9E3EE] bg-white p-4">
//           <p className="text-[10px] font-extrabold uppercase tracking-[.1em] text-[#9B93A1]">
//             Contacted
//           </p>

//           <p className="mt-1 text-[24px] font-extrabold text-[#3152A0]">
//             {
//               enquiries.filter(
//                 (item) =>
//                   item.status ===
//                   "CONTACTED",
//               ).length
//             }
//           </p>
//         </div>
//       </div>

//       {/* ERROR */}

//       {error && (
//         <div className="mb-5 flex items-center justify-between rounded-[12px] bg-[#FDECEA] px-4 py-3 text-[13px] font-semibold text-[#8B1A1A]">
//           <span>{error}</span>

//           <button
//             type="button"
//             onClick={() => setError("")}
//           >
//             <X size={16} />
//           </button>
//         </div>
//       )}

//       {/* SEARCH + FILTER */}

//       <div className="mb-5 flex flex-wrap gap-3">
//         <div className="flex min-h-10 w-full max-w-sm items-center gap-2 rounded-[12px] border border-[#E9E3EE] bg-white px-3">
//           <Search
//             size={14}
//             className="shrink-0 text-[#8C52FF]"
//           />

//           <input
//             value={search}
//             onChange={(e) =>
//               setSearch(e.target.value)
//             }
//             placeholder="Search company, contact, email..."
//             className="w-full bg-transparent text-[13px] font-semibold text-[#2E0569] outline-none placeholder:text-[#9B93A1]"
//           />
//         </div>

//         <select
//           value={statusFilter}
//           onChange={(e) =>
//             setStatusFilter(
//               e.target.value as
//                 | B2BEnquiryStatus
//                 | "ALL",
//             )
//           }
//           className="rounded-[12px] border border-[#E9E3EE] bg-white px-3 py-2 text-[13px] font-semibold text-[#2E0569] outline-none"
//         >
//           <option value="ALL">
//             All statuses
//           </option>

//           {STATUS_OPTIONS.map(
//             (status) => (
//               <option
//                 key={status}
//                 value={status}
//               >
//                 {formatStatus(status)}
//               </option>
//             ),
//           )}
//         </select>
//       </div>

//       {/* TABLE */}

//       <div className="overflow-hidden rounded-[20px] border border-[#E9E3EE] bg-white">
//         {loading ? (
//           <div className="px-4 py-12 text-center text-[13px] font-semibold text-[#9B93A1]">
//             Loading B2B enquiries...
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left text-[13px]">
//               <thead className="border-b border-[#E9E3EE] bg-[#FAFAFA]">
//                 <tr>
//                   {[
//                     "Company",
//                     "Contact",
//                     "Business Type",
//                     "Message",
//                     "Status",
//                     "Date",
//                     "Actions",
//                   ].map((heading) => (
//                     <th
//                       key={heading}
//                       className="whitespace-nowrap px-4 py-3 text-[10px] font-extrabold uppercase tracking-[.1em] text-[#8B8292]"
//                     >
//                       {heading}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-[#F0EAF4]">
//                 {displayedEnquiries.length ===
//                   0 && (
//                   <tr>
//                     <td
//                       colSpan={7}
//                       className="px-4 py-10 text-center text-[13px] font-semibold text-[#9B93A1]"
//                     >
//                       No B2B enquiries found.
//                     </td>
//                   </tr>
//                 )}

//                 {displayedEnquiries.map(
//                   (enquiry) => (
//                     <tr
//                       key={
//                         enquiry.enquiryId
//                       }
//                       className="transition-colors hover:bg-[#FAFAFA]"
//                     >
//                       {/* COMPANY */}

//                       <td className="px-4 py-3">
//                         <p className="font-extrabold text-[#2E0569]">
//                           {
//                             enquiry.companyName
//                           }
//                         </p>

//                         <p className="text-[11px] text-[#9B93A1]">
//                           Enquiry #
//                           {
//                             enquiry.enquiryId
//                           }
//                         </p>

//                         {enquiry.gstNumber && (
//                           <p className="text-[11px] text-[#9B93A1]">
//                             GST:{" "}
//                             {
//                               enquiry.gstNumber
//                             }
//                           </p>
//                         )}
//                       </td>

//                       {/* CONTACT */}

//                       <td className="px-4 py-3">
//                         <p className="font-extrabold text-[#2E0569]">
//                           {
//                             enquiry.contactPerson
//                           }
//                         </p>

//                         <p className="text-[11px] text-[#9B93A1]">
//                           {
//                             enquiry.email
//                           }
//                         </p>

//                         <p className="text-[11px] text-[#9B93A1]">
//                           {
//                             enquiry.mobileNumber
//                           }
//                         </p>
//                       </td>

//                       {/* BUSINESS TYPE */}

//                       <td className="whitespace-nowrap px-4 py-3">
//                         <span className="rounded-full bg-[#F2EBFF] px-2.5 py-1 text-[10px] font-extrabold text-[#8C52FF]">
//                           {
//                             enquiry.businessType ??
//                             "-"
//                           }
//                         </span>
//                       </td>

//                       {/* MESSAGE */}

//                       <td className="max-w-[280px] px-4 py-3 text-[#716A78]">
//                         <p className="line-clamp-2">
//                           {
//                             enquiry.message
//                           }
//                         </p>
//                       </td>

//                       {/* STATUS */}

//                       <td className="px-4 py-3">
//                         <span
//                           className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-extrabold ${statusClass(
//                             enquiry.status,
//                           )}`}
//                         >
//                           {formatStatus(
//                             enquiry.status,
//                           )}
//                         </span>
//                       </td>

//                       {/* DATE */}

//                       <td className="whitespace-nowrap px-4 py-3 text-[11px] text-[#716A78]">
//                         {new Date(
//                           enquiry.createdAt,
//                         ).toLocaleDateString(
//                           "en-IN",
//                         )}
//                       </td>

//                       {/* ACTIONS */}

//                       <td className="px-4 py-3">
//                         <button
//                           type="button"
//                           title="View enquiry"
//                           onClick={() =>
//                             openEnquiry(
//                               enquiry,
//                             )
//                           }
//                           className="flex h-7 w-7 items-center justify-center rounded-[8px] text-[#8C52FF] hover:bg-[#F4EEFF]"
//                         >
//                           <Eye size={14} />
//                         </button>
//                       </td>
//                     </tr>
//                   ),
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* MODAL */}

//       {selectedEnquiry && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
//           onClick={(e) => {
//             if (
//               e.target ===
//               e.currentTarget
//             ) {
//               setSelectedEnquiry(null);
//             }
//           }}
//         >
//           <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[24px] bg-white shadow-2xl">
//             {/* MODAL HEADER */}

//             <div className="flex items-center justify-between border-b border-[#E9E3EE] px-6 py-4">
//               <div>
//                 <h2 className="text-[16px] font-extrabold text-[#2E0569]">
//                   B2B Enquiry
//                 </h2>

//                 <p className="text-[11px] text-[#9B93A1]">
//                   Enquiry #
//                   {
//                     selectedEnquiry.enquiryId
//                   }
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setSelectedEnquiry(null)
//                 }
//                 className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4EEFF] text-[#8C52FF]"
//               >
//                 <X size={15} />
//               </button>
//             </div>

//             <div className="space-y-5 p-6">
//               {/* COMPANY */}

//               <div>
//                 <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF]">
//                   Company
//                 </p>

//                 <p className="text-[15px] font-extrabold text-[#2E0569]">
//                   {
//                     selectedEnquiry.companyName
//                   }
//                 </p>

//                 <p className="mt-1 text-[12px] text-[#716A78]">
//                   {
//                     selectedEnquiry.contactPerson
//                   }
//                 </p>
//               </div>

//               {/* CONTACT DETAILS */}

//               <div className="grid gap-3 sm:grid-cols-2">
//                 <a
//                   href={`mailto:${selectedEnquiry.email}`}
//                   className="rounded-[12px] border border-[#E9E3EE] bg-[#FAFAFA] p-3 hover:bg-[#F4EEFF]"
//                 >
//                   <div className="flex items-center gap-2">
//                     <Mail
//                       size={14}
//                       className="text-[#8C52FF]"
//                     />

//                     <p className="text-[10px] font-extrabold uppercase text-[#9B93A1]">
//                       Email
//                     </p>
//                   </div>

//                   <p className="mt-1 break-all text-[12px] font-semibold text-[#2E0569]">
//                     {
//                       selectedEnquiry.email
//                     }
//                   </p>
//                 </a>

//                 <a
//                   href={`tel:${selectedEnquiry.mobileNumber}`}
//                   className="rounded-[12px] border border-[#E9E3EE] bg-[#FAFAFA] p-3 hover:bg-[#F4EEFF]"
//                 >
//                   <div className="flex items-center gap-2">
//                     <Phone
//                       size={14}
//                       className="text-[#8C52FF]"
//                     />

//                     <p className="text-[10px] font-extrabold uppercase text-[#9B93A1]">
//                       Mobile
//                     </p>
//                   </div>

//                   <p className="mt-1 text-[12px] font-semibold text-[#2E0569]">
//                     {
//                       selectedEnquiry.mobileNumber
//                     }
//                   </p>
//                 </a>
//               </div>

//               {/* COMPANY DETAILS */}

//               <div className="grid grid-cols-2 gap-3">
//                 <div className="rounded-[12px] border border-[#E9E3EE] bg-[#FAFAFA] p-3">
//                   <p className="text-[10px] font-extrabold uppercase text-[#9B93A1]">
//                     Business Type
//                   </p>

//                   <p className="mt-1 text-[13px] font-extrabold text-[#2E0569]">
//                     {
//                       selectedEnquiry.businessType ??
//                       "-"
//                     }
//                   </p>
//                 </div>

//                 <div className="rounded-[12px] border border-[#E9E3EE] bg-[#FAFAFA] p-3">
//                   <p className="text-[10px] font-extrabold uppercase text-[#9B93A1]">
//                     GST Number
//                   </p>

//                   <p className="mt-1 text-[13px] font-extrabold text-[#2E0569]">
//                     {
//                       selectedEnquiry.gstNumber ??
//                       "-"
//                     }
//                   </p>
//                 </div>
//               </div>

//               {/* MESSAGE */}

//               <div>
//                 <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF]">
//                   Requirement / Message
//                 </p>

//                 <div className="rounded-[12px] bg-[#FAFAFA] p-4 text-[13px] leading-6 text-[#716A78]">
//                   {
//                     selectedEnquiry.message
//                   }
//                 </div>
//               </div>

//               {/* CREATED */}

//               <div className="grid grid-cols-2 gap-3">
//                 <div className="rounded-[12px] border border-[#E9E3EE] p-3">
//                   <p className="text-[10px] font-extrabold uppercase text-[#9B93A1]">
//                     Created
//                   </p>

//                   <p className="mt-1 text-[12px] font-semibold text-[#2E0569]">
//                     {new Date(
//                       selectedEnquiry.createdAt,
//                     ).toLocaleString(
//                       "en-IN",
//                     )}
//                   </p>
//                 </div>

//                 <div className="rounded-[12px] border border-[#E9E3EE] p-3">
//                   <p className="text-[10px] font-extrabold uppercase text-[#9B93A1]">
//                     Updated
//                   </p>

//                   <p className="mt-1 text-[12px] font-semibold text-[#2E0569]">
//                     {new Date(
//                       selectedEnquiry.updatedAt,
//                     ).toLocaleString(
//                       "en-IN",
//                     )}
//                   </p>
//                 </div>
//               </div>

//               {/* STATUS */}

//               <div>
//                 <label className="mb-1 block text-[10px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF]">
//                   Status
//                 </label>

//                 <select
//                   value={selectedStatus}
//                   onChange={(e) =>
//                     setSelectedStatus(
//                       e.target.value as B2BEnquiryStatus,
//                     )
//                   }
//                   className="w-full rounded-[12px] border border-[#E9E3EE] bg-white px-3 py-2.5 text-[13px] font-semibold text-[#2E0569] outline-none"
//                 >
//                   {STATUS_OPTIONS.map(
//                     (status) => (
//                       <option
//                         key={status}
//                         value={status}
//                       >
//                         {formatStatus(
//                           status,
//                         )}
//                       </option>
//                     ),
//                   )}
//                 </select>
//               </div>

//               {/* BUTTONS */}

//               <div className="flex gap-3">
//                 <button
//                   type="button"
//                   disabled={
//                     updating ||
//                     deleting
//                   }
//                   onClick={() =>
//                     setSelectedEnquiry(
//                       null,
//                     )
//                   }
//                   className="flex-1 rounded-[12px] border border-[#E9E3EE] py-2.5 text-[13px] font-extrabold text-[#716A78]"
//                 >
//                   Close
//                 </button>

//                 <button
//                   type="button"
//                   disabled={
//                     updating ||
//                     deleting
//                   }
//                   onClick={
//                     handleUpdateStatus
//                   }
//                   className="flex-1 rounded-[12px] bg-[#8C52FF] py-2.5 text-[13px] font-extrabold text-white disabled:opacity-50"
//                 >
//                   {updating
//                     ? "Saving..."
//                     : "Save Status"}
//                 </button>
//               </div>

//               {/* DELETE */}

//               <button
//                 type="button"
//                 disabled={
//                   updating ||
//                   deleting
//                 }
//                 onClick={handleDelete}
//                 className="flex w-full items-center justify-center gap-2 rounded-[12px] border border-[#F3C7C2] py-2.5 text-[13px] font-extrabold text-[#C0392B] hover:bg-[#FDECEA] disabled:opacity-50"
//               >
//                 <Trash2 size={14} />

//                 {deleting
//                   ? "Deleting..."
//                   : "Delete Enquiry"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }