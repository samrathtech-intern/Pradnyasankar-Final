
"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Eye,
  MessageCircle,
  Search,
  X,
} from "lucide-react";

import {
  fetchAdminCustomerSupportEnquiries,
  updateAdminCustomerSupportEnquiry,
} from "@/lib/adminApi";

import type {
  CustomerSupportEnquiry,
  CustomerSupportStatus,
} from "@/lib/adminApi";

const STATUS_OPTIONS: CustomerSupportStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
];

export default function AdminCustomerSupportPage() {
  const [enquiries, setEnquiries] = useState<
    CustomerSupportEnquiry[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<CustomerSupportStatus>("ALL");

  const [selectedEnquiry, setSelectedEnquiry] =
    useState<CustomerSupportEnquiry | null>(null);

  const [updating, setUpdating] = useState(false);

  const [adminResponse, setAdminResponse] =
    useState("");

  const [selectedStatus, setSelectedStatus] =
    useState<CustomerSupportStatus>("OPEN");

  async function loadEnquiries() {
    try {
      setLoading(true);
      setError("");

      const data =
        await fetchAdminCustomerSupportEnquiries();

      setEnquiries(
        Array.isArray(data) ? data : [],
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load customer support enquiries.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEnquiries();
  }, []);

  const displayedEnquiries = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return enquiries.filter((enquiry) => {
      const matchesSearch =
        !query ||
        [
          enquiry.customerName,
          enquiry.customerEmail,
          enquiry.customerPhone,
          enquiry.topic,
          enquiry.orderNumber ?? "",
          enquiry.message,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        enquiry.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    enquiries,
    search,
    statusFilter,
  ]);

  function openUpdateModal(
    enquiry: CustomerSupportEnquiry,
  ) {
    setSelectedEnquiry(enquiry);

    setSelectedStatus(
      enquiry.status,
    );

    setAdminResponse(
      enquiry.adminResponse ?? "",
    );
  }

  async function handleUpdate() {
    if (!selectedEnquiry) {
      return;
    }

    try {
      setUpdating(true);
      setError("");

      const updated =
        await updateAdminCustomerSupportEnquiry(
          selectedEnquiry.enquiryId,
          {
            status: selectedStatus,
            adminResponse:
              adminResponse.trim(),
          },
        );

      setEnquiries((previous) =>
        previous.map((enquiry) =>
          enquiry.enquiryId ===
          updated.enquiryId
            ? updated
            : enquiry,
        ),
      );

      setSelectedEnquiry(null);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update enquiry.",
      );
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div>
      {/* HEADER */}

      <div className="mb-6">
        <h1 className="text-[24px] font-extrabold tracking-[-.04em] text-[#2E0569]">
          Customer Support
        </h1>

        <p className="mt-1 text-[13px] text-[#716A78]">
          Manage customer enquiries and support requests.
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-5 flex items-center justify-between rounded-[12px] bg-[#FDECEA] px-4 py-3 text-[13px] font-semibold text-[#8B1A1A]">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
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
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search enquiries..."
            className="w-full bg-transparent text-[13px] font-semibold text-[#2E0569] outline-none placeholder:text-[#9B93A1]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value as CustomerSupportStatus,
            )
          }
          className="rounded-[12px] border border-[#E9E3EE] bg-white px-3 py-2 text-[13px] font-semibold text-[#2E0569] outline-none"
        >
          <option value="ALL">
            All statuses
          </option>

          {STATUS_OPTIONS.map(
            (status) => (
              <option
                key={status}
                value={status}
              >
                {status.replace("_", " ")}
              </option>
            ),
          )}
        </select>
      </div>

      {/* TABLE */}

      <div className="overflow-hidden rounded-[20px] border border-[#E9E3EE] bg-white">
        {loading ? (
          <div className="px-4 py-12 text-center text-[13px] font-semibold text-[#9B93A1]">
            Loading enquiries...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="border-b border-[#E9E3EE] bg-[#FAFAFA]">
                <tr>
                  {[
                    "Customer",
                    "Topic",
                    "Order",
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
                {displayedEnquiries.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-10 text-center text-[13px] font-semibold text-[#9B93A1]"
                    >
                      No customer enquiries found.
                    </td>
                  </tr>
                )}

                {displayedEnquiries.map(
                  (enquiry) => (
                    <tr
                      key={
                        enquiry.enquiryId
                      }
                      className="transition-colors hover:bg-[#FAFAFA]"
                    >
                      {/* CUSTOMER */}

                      <td className="px-4 py-3">
                        <div>
                          <p className="font-extrabold text-[#2E0569]">
                            {
                              enquiry.customerName
                            }
                          </p>

                          <p className="text-[11px] text-[#9B93A1]">
                            {
                              enquiry.customerEmail
                            }
                          </p>

                          <p className="text-[11px] text-[#9B93A1]">
                            {
                              enquiry.customerPhone
                            }
                          </p>
                        </div>
                      </td>

                      {/* TOPIC */}

                      <td className="whitespace-nowrap px-4 py-3 font-semibold text-[#8C52FF]">
                        {enquiry.topic}
                      </td>

                      {/* ORDER */}

                      <td className="whitespace-nowrap px-4 py-3 font-semibold text-[#2E0569]">
                        {enquiry.orderNumber ??
                          "-"}
                      </td>

                      {/* MESSAGE */}

                      <td className="max-w-[280px] px-4 py-3 text-[#716A78]">
                        <p className="line-clamp-2">
                          {
                            enquiry.message
                          }
                        </p>
                      </td>

                      {/* STATUS */}

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
                            enquiry.status ===
                            "OPEN"
                              ? "bg-[#FDECEA] text-[#8B1A1A]"
                              : enquiry.status ===
                                  "IN_PROGRESS"
                                ? "bg-[#FFF4D6] text-[#8A6200]"
                                : enquiry.status ===
                                    "RESOLVED"
                                  ? "bg-[#EAF4E4] text-[#315C20]"
                                  : "bg-[#F0EAF4] text-[#716A78]"
                          }`}
                        >
                          {enquiry.status.replace(
                            "_",
                            " ",
                          )}
                        </span>
                      </td>

                      {/* DATE */}

                      <td className="whitespace-nowrap px-4 py-3 text-[11px] text-[#716A78]">
                        {new Date(
                          enquiry.createdAt,
                        ).toLocaleDateString(
                          "en-IN",
                        )}
                      </td>

                      {/* ACTIONS */}

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            title="View enquiry"
                            onClick={() =>
                              openUpdateModal(
                                enquiry,
                              )
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-[8px] text-[#8C52FF] hover:bg-[#F4EEFF]"
                          >
                            <Eye size={14} />
                          </button>

                          <button
                            type="button"
                            title="Reply"
                            onClick={() =>
                              openUpdateModal(
                                enquiry,
                              )
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-[8px] text-[#2E0569] hover:bg-[#F4EEFF]"
                          >
                            <MessageCircle
                              size={14}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* UPDATE MODAL */}

      {selectedEnquiry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
          onClick={(e) => {
            if (
              e.target ===
              e.currentTarget
            ) {
              setSelectedEnquiry(null);
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[24px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E9E3EE] px-6 py-4">
              <div>
                <h2 className="text-[16px] font-extrabold text-[#2E0569]">
                  Customer Enquiry
                </h2>

                <p className="text-[11px] text-[#9B93A1]">
                  Enquiry #
                  {
                    selectedEnquiry.enquiryId
                  }
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedEnquiry(null)
                }
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4EEFF] text-[#8C52FF]"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              {/* CUSTOMER */}

              <div>
                <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF]">
                  Customer
                </p>

                <p className="text-[14px] font-extrabold text-[#2E0569]">
                  {
                    selectedEnquiry.customerName
                  }
                </p>

                <p className="text-[12px] text-[#716A78]">
                  {
                    selectedEnquiry.customerEmail
                  }
                </p>

                <p className="text-[12px] text-[#716A78]">
                  {
                    selectedEnquiry.customerPhone
                  }
                </p>
              </div>

              {/* DETAILS */}

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[12px] border border-[#E9E3EE] bg-[#FAFAFA] p-3">
                  <p className="text-[10px] font-extrabold uppercase text-[#9B93A1]">
                    Topic
                  </p>

                  <p className="mt-1 text-[13px] font-extrabold text-[#2E0569]">
                    {
                      selectedEnquiry.topic
                    }
                  </p>
                </div>

                <div className="rounded-[12px] border border-[#E9E3EE] bg-[#FAFAFA] p-3">
                  <p className="text-[10px] font-extrabold uppercase text-[#9B93A1]">
                    Order
                  </p>

                  <p className="mt-1 text-[13px] font-extrabold text-[#2E0569]">
                    {
                      selectedEnquiry.orderNumber ??
                      "-"
                    }
                  </p>
                </div>
              </div>

              {/* MESSAGE */}

              <div>
                <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF]">
                  Customer Message
                </p>

                <div className="rounded-[12px] bg-[#FAFAFA] p-3 text-[13px] leading-5 text-[#716A78]">
                  {
                    selectedEnquiry.message
                  }
                </div>
              </div>

              {/* IMAGE */}

              {selectedEnquiry.imageUrl && (
                <div>
                  <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF]">
                    Attachment
                  </p>

                  <img
                    src={
                      selectedEnquiry.imageUrl
                    }
                    alt="Customer attachment"
                    className="max-h-48 rounded-[12px] border border-[#E9E3EE] object-contain"
                  />
                </div>
              )}

              {/* STATUS */}

              <div>
                <label className="mb-1 block text-[10px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF]">
                  Status
                </label>

                <select
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(
                      e.target
                        .value as CustomerSupportStatus,
                    )
                  }
                  className="w-full rounded-[12px] border border-[#E9E3EE] bg-white px-3 py-2.5 text-[13px] font-semibold text-[#2E0569] outline-none"
                >
                  {STATUS_OPTIONS.map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status.replace(
                          "_",
                          " ",
                        )}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* RESPONSE */}

              <div>
                <label className="mb-1 block text-[10px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF]">
                  Admin Response
                </label>

                <textarea
                  value={adminResponse}
                  onChange={(e) =>
                    setAdminResponse(
                      e.target.value,
                    )
                  }
                  rows={5}
                  placeholder="Write a response to the customer..."
                  className="w-full resize-none rounded-[12px] border border-[#E9E3EE] px-3 py-2.5 text-[13px] font-semibold text-[#2E0569] outline-none placeholder:text-[#9B93A1]"
                />
              </div>

              {/* BUTTONS */}

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={updating}
                  onClick={() =>
                    setSelectedEnquiry(null)
                  }
                  className="flex-1 rounded-[12px] border border-[#E9E3EE] py-2.5 text-[13px] font-extrabold text-[#716A78]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={updating}
                  onClick={handleUpdate}
                  className="flex-1 rounded-[12px] bg-[#8C52FF] py-2.5 text-[13px] font-extrabold text-white disabled:opacity-50"
                >
                  {updating
                    ? "Saving..."
                    : "Save Response"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// "use client";

// import { useEffect, useMemo, useState } from "react";

// import {
//   Eye,
//   MessageCircle,
//   Search,
//   X,
// } from "lucide-react";

// import {
//   fetchAdminCustomerSupportEnquiries,
//   updateAdminCustomerSupportEnquiry,
// } from "@/lib/adminApi";

// import type {
//   CustomerSupportEnquiry,
//   CustomerSupportStatus,
// } from "@/lib/adminApi";

// /* -------------------------------------------------------------------------- */
// /* View Modal                                                                 */
// /* -------------------------------------------------------------------------- */

// function ViewEnquiryModal({
//   enquiry,
//   onClose,
//   onUpdate,
// }: {
//   enquiry: CustomerSupportEnquiry;
//   onClose: () => void;
//   onUpdate: () => void;
// }) {
//   const [status, setStatus] =
//     useState<CustomerSupportStatus>(
//       enquiry.status,
//     );

//   const [adminResponse, setAdminResponse] =
//     useState(enquiry.adminResponse ?? "");

//   const [saving, setSaving] =
//     useState(false);

//   const [error, setError] =
//     useState("");

//   async function handleSave() {
//     try {
//       setSaving(true);
//       setError("");

//       await updateAdminCustomerSupportEnquiry(
//         enquiry.enquiryId,
//         {
//           status,
//           adminResponse,
//         },
//       );

//       onUpdate();
//       onClose();
//     } catch (err) {
//       console.error(err);

//       setError(
//         err instanceof Error
//           ? err.message
//           : "Failed to update enquiry.",
//       );
//     } finally {
//       setSaving(false);
//     }
//   }

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
//       onClick={(e) => {
//         if (e.target === e.currentTarget) {
//           onClose();
//         }
//       }}
//     >
//       <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[24px] bg-white shadow-2xl">
//         {/* HEADER */}

//         <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E9E3EE] bg-white px-6 py-4">
//           <div>
//             <h2 className="text-[16px] font-extrabold text-[#2E0569]">
//               Customer Support Enquiry
//             </h2>

//             <p className="mt-0.5 text-[11px] font-semibold text-[#9B93A1]">
//               Enquiry #{enquiry.enquiryId}
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4EEFF] text-[#8C52FF]"
//           >
//             <X size={15} />
//           </button>
//         </div>

//         {/* CONTENT */}

//         <div className="space-y-5 p-6">
//           {/* CUSTOMER */}

//           <div>
//             <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF]">
//               Customer
//             </p>

//             <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
//               <InfoTile
//                 label="Name"
//                 value={enquiry.customerName}
//               />

//               <InfoTile
//                 label="Email"
//                 value={enquiry.customerEmail}
//               />

//               <InfoTile
//                 label="Phone"
//                 value={enquiry.customerPhone}
//               />
//             </div>
//           </div>

//           {/* ENQUIRY */}

//           <div>
//             <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF]">
//               Enquiry
//             </p>

//             <div className="space-y-3">
//               <InfoTile
//                 label="Topic"
//                 value={enquiry.topic}
//               />

//               <InfoTile
//                 label="Order Number"
//                 value={
//                   enquiry.orderNumber ??
//                   "-"
//                 }
//               />

//               <div className="rounded-[12px] border border-[#E9E3EE] bg-[#FAFAFA] px-3 py-3">
//                 <p className="text-[10px] font-extrabold uppercase tracking-[.08em] text-[#9B93A1]">
//                   Message
//                 </p>

//                 <p className="mt-1 whitespace-pre-wrap text-[13px] font-semibold leading-5 text-[#2E0569]">
//                   {enquiry.message}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* IMAGE */}

//           {enquiry.imageUrl && (
//             <div>
//               <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF]">
//                 Attachment
//               </p>

//               <div className="overflow-hidden rounded-[14px] border border-[#E9E3EE] bg-[#FAFAFA]">
//                 <img
//                   src={enquiry.imageUrl}
//                   alt="Customer attachment"
//                   className="max-h-64 w-full object-contain"
//                 />
//               </div>
//             </div>
//           )}

//           {/* STATUS */}

//           <div>
//             <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF]">
//               Status
//             </label>

//             <select
//               value={status}
//               onChange={(e) =>
//                 setStatus(
//                   e.target.value as CustomerSupportStatus,
//                 )
//               }
//               className="w-full rounded-[12px] border border-[#E9E3EE] bg-white px-3 py-2.5 text-[13px] font-semibold text-[#2E0569] outline-none focus:border-[#8C52FF]"
//             >
//               <option value="OPEN">
//                 Open
//               </option>

//               <option value="IN_PROGRESS">
//                 In Progress
//               </option>

//               <option value="RESOLVED">
//                 Resolved
//               </option>

//               <option value="CLOSED">
//                 Closed
//               </option>
//             </select>
//           </div>

//           {/* ADMIN RESPONSE */}

//           <div>
//             <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF]">
//               Admin Response
//             </label>

//             <textarea
//               value={adminResponse}
//               onChange={(e) =>
//                 setAdminResponse(e.target.value)
//               }
//               rows={5}
//               placeholder="Write a response to the customer..."
//               className="w-full resize-none rounded-[12px] border border-[#E9E3EE] bg-white px-3 py-3 text-[13px] font-semibold text-[#2E0569] outline-none placeholder:text-[#9B93A1] focus:border-[#8C52FF]"
//             />
//           </div>

//           {/* ERROR */}

//           {error && (
//             <div className="rounded-[12px] bg-[#FDECEA] px-4 py-3 text-[13px] font-semibold text-[#8B1A1A]">
//               {error}
//             </div>
//           )}

//           {/* ACTIONS */}

//           <div className="flex gap-3 border-t border-[#E9E3EE] pt-5">
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={saving}
//               className="flex-1 rounded-[12px] border border-[#E9E3EE] py-2.5 text-[13px] font-extrabold text-[#716A78] disabled:opacity-50"
//             >
//               Cancel
//             </button>

//             <button
//               type="button"
//               onClick={handleSave}
//               disabled={saving}
//               className="flex-1 rounded-[12px] bg-[#8C52FF] py-2.5 text-[13px] font-extrabold text-white disabled:opacity-50"
//             >
//               {saving
//                 ? "Saving..."
//                 : "Save Changes"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /* Info Tile                                                                  */
// /* -------------------------------------------------------------------------- */

// function InfoTile({
//   label,
//   value,
// }: {
//   label: string;
//   value: string;
// }) {
//   return (
//     <div className="rounded-[12px] border border-[#E9E3EE] bg-[#FAFAFA] px-3 py-2.5">
//       <p className="text-[10px] font-extrabold uppercase tracking-[.08em] text-[#9B93A1]">
//         {label}
//       </p>

//       <p className="mt-0.5 break-words text-[13px] font-extrabold text-[#2E0569]">
//         {value}
//       </p>
//     </div>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /* Status Badge                                                               */
// /* -------------------------------------------------------------------------- */

// function StatusBadge({
//   status,
// }: {
//   status: CustomerSupportStatus;
// }) {
//   const normalized =
//     status.toUpperCase();

//   let className =
//     "bg-[#F4EEFF] text-[#6F35D8]";

//   let dotClass =
//     "bg-[#8C52FF]";

//   if (normalized === "OPEN") {
//     className =
//       "bg-[#FFF4D6] text-[#8A6500]";

//     dotClass =
//       "bg-[#E0A800]";
//   }

//   if (normalized === "IN_PROGRESS") {
//     className =
//       "bg-[#E8F0FF] text-[#2457A6]";

//     dotClass =
//       "bg-[#3578E5]";
//   }

//   if (normalized === "RESOLVED") {
//     className =
//       "bg-[#EAF4E4] text-[#315C20]";

//     dotClass =
//       "bg-[#4CAF50]";
//   }

//   if (normalized === "CLOSED") {
//     className =
//       "bg-[#F0F0F0] text-[#555555]";

//     dotClass =
//       "bg-[#777777]";
//   }

//   return (
//     <span
//       className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold ${className}`}
//     >
//       <span
//         className={`h-1.5 w-1.5 rounded-full ${dotClass}`}
//       />

//       {normalized.replace(
//         "_",
//         " ",
//       )}
//     </span>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /* Main Page                                                                  */
// /* -------------------------------------------------------------------------- */

// export default function AdminCustomerSupportPage() {
//   const [enquiries, setEnquiries] =
//     useState<CustomerSupportEnquiry[]>([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [error, setError] =
//     useState("");

//   const [search, setSearch] =
//     useState("");

//   const [statusFilter, setStatusFilter] =
//     useState("ALL");

//   const [selectedEnquiry, setSelectedEnquiry] =
//     useState<CustomerSupportEnquiry | null>(
//       null,
//     );

//   /* ---------------------------------------------------------------------- */
//   /* Load enquiries                                                         */
//   /* ---------------------------------------------------------------------- */

//   async function loadEnquiries() {
//     try {
//       setLoading(true);
//       setError("");

//       const data =
//         await fetchAdminCustomerSupportEnquiries();

//       setEnquiries(data);
//     } catch (err) {
//       console.error(err);

//       setError(
//         err instanceof Error
//           ? err.message
//           : "Failed to load customer support enquiries.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadEnquiries();
//   }, []);

//   /* ---------------------------------------------------------------------- */
//   /* Filter                                                                 */
//   /* ---------------------------------------------------------------------- */

//   const displayed = useMemo(() => {
//     const query =
//       search.trim().toLowerCase();

//     return enquiries.filter(
//       (enquiry) => {
//         const matchesSearch =
//           !query ||
//           [
//             enquiry.customerName,
//             enquiry.customerEmail,
//             enquiry.customerPhone,
//             enquiry.topic,
//             enquiry.orderNumber ?? "",
//             enquiry.message,
//           ]
//             .join(" ")
//             .toLowerCase()
//             .includes(query);

//         const matchesStatus =
//           statusFilter === "ALL" ||
//           enquiry.status ===
//             statusFilter;

//         return (
//           matchesSearch &&
//           matchesStatus
//         );
//       },
//     );
//   }, [
//     enquiries,
//     search,
//     statusFilter,
//   ]);

//   /* ---------------------------------------------------------------------- */
//   /* UI                                                                      */
//   /* ---------------------------------------------------------------------- */

//   return (
//     <div>
//       {/* HEADER */}

//       <div className="mb-6">
//         <h1 className="text-[24px] font-extrabold tracking-[-.04em] text-[#2E0569]">
//           Customer Support
//         </h1>

//         <p className="mt-1 text-[13px] text-[#716A78]">
//           Manage customer enquiries and respond to support requests.
//         </p>
//       </div>

//       {/* ERROR */}

//       {error && (
//         <div className="mb-5 flex items-center justify-between rounded-[12px] bg-[#FDECEA] px-4 py-3 text-[13px] font-semibold text-[#8B1A1A]">
//           <span>{error}</span>

//           <button
//             type="button"
//             onClick={() => setError("")}
//             className="ml-3"
//           >
//             <X size={16} />
//           </button>
//         </div>
//       )}

//       {/* SEARCH + FILTER */}

//       <div className="mb-5 flex flex-wrap gap-3">
//         <div className="flex min-h-10 max-w-sm flex-1 items-center gap-2 rounded-[12px] border border-[#E9E3EE] bg-white px-3">
//           <Search
//             size={14}
//             className="shrink-0 text-[#8C52FF]"
//           />

//           <input
//             value={search}
//             onChange={(e) =>
//               setSearch(e.target.value)
//             }
//             placeholder="Search customer, topic, order..."
//             className="w-full bg-transparent text-[13px] font-semibold text-[#2E0569] outline-none placeholder:text-[#9B93A1]"
//           />
//         </div>

//         <select
//           value={statusFilter}
//           onChange={(e) =>
//             setStatusFilter(
//               e.target.value,
//             )
//           }
//           className="min-h-10 rounded-[12px] border border-[#E9E3EE] bg-white px-3 text-[13px] font-semibold text-[#2E0569] outline-none focus:border-[#8C52FF]"
//         >
//           <option value="ALL">
//             All Statuses
//           </option>

//           <option value="OPEN">
//             Open
//           </option>

//           <option value="IN_PROGRESS">
//             In Progress
//           </option>

//           <option value="RESOLVED">
//             Resolved
//           </option>

//           <option value="CLOSED">
//             Closed
//           </option>
//         </select>
//       </div>

//       {/* TABLE */}

//       <div className="overflow-hidden rounded-[20px] border border-[#E9E3EE] bg-white">
//         {loading ? (
//           <div className="px-4 py-12 text-center text-[13px] font-semibold text-[#9B93A1]">
//             Loading customer support enquiries...
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left text-[13px]">
//               <thead className="border-b border-[#E9E3EE] bg-[#FAFAFA]">
//                 <tr>
//                   {[
//                     "Customer",
//                     "Topic",
//                     "Order",
//                     "Message",
//                     "Status",
//                     "Created",
//                     "Actions",
//                   ].map(
//                     (heading) => (
//                       <th
//                         key={heading}
//                         className="whitespace-nowrap px-4 py-3 text-[10px] font-extrabold uppercase tracking-[.1em] text-[#8B8292]"
//                       >
//                         {heading}
//                       </th>
//                     ),
//                   )}
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-[#F0EAF4]">
//                 {displayed.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan={7}
//                       className="px-4 py-10 text-center text-[13px] font-semibold text-[#9B93A1]"
//                     >
//                       No customer support enquiries found.
//                     </td>
//                   </tr>
//                 )}

//                 {displayed.map(
//                   (enquiry) => (
//                     <tr
//                       key={
//                         enquiry.enquiryId
//                       }
//                       className="transition-colors hover:bg-[#FAFAFA]"
//                     >
//                       {/* CUSTOMER */}

//                       <td className="px-4 py-3">
//                         <div>
//                           <p className="whitespace-nowrap font-extrabold text-[#2E0569]">
//                             {
//                               enquiry.customerName
//                             }
//                           </p>

//                           <p className="mt-0.5 whitespace-nowrap text-[11px] font-semibold text-[#9B93A1]">
//                             {
//                               enquiry.customerEmail
//                             }
//                           </p>
//                         </div>
//                       </td>

//                       {/* TOPIC */}

//                       <td className="whitespace-nowrap px-4 py-3 font-semibold text-[#8C52FF]">
//                         {enquiry.topic}
//                       </td>

//                       {/* ORDER */}

//                       <td className="whitespace-nowrap px-4 py-3 font-semibold text-[#2E0569]">
//                         {enquiry.orderNumber ??
//                           "-"}
//                       </td>

//                       {/* MESSAGE */}

//                       <td className="max-w-[280px] px-4 py-3">
//                         <p className="truncate font-semibold text-[#716A78]">
//                           {
//                             enquiry.message
//                           }
//                         </p>
//                       </td>

//                       {/* STATUS */}

//                       <td className="px-4 py-3">
//                         <StatusBadge
//                           status={
//                             enquiry.status
//                           }
//                         />
//                       </td>

//                       {/* CREATED */}

//                       <td className="whitespace-nowrap px-4 py-3 text-[11px] font-semibold text-[#716A78]">
//                         {enquiry.createdAt
//                           ? new Date(
//                               enquiry.createdAt,
//                             ).toLocaleDateString(
//                               "en-IN",
//                             )
//                           : "-"}
//                       </td>

//                       {/* ACTIONS */}

//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-1.5">
//                           <button
//                             type="button"
//                             title="View enquiry"
//                             onClick={() =>
//                               setSelectedEnquiry(
//                                 enquiry,
//                               )
//                             }
//                             className="flex h-7 w-7 items-center justify-center rounded-[8px] text-[#8C52FF] transition hover:bg-[#F4EEFF]"
//                           >
//                             <Eye
//                               size={14}
//                             />
//                           </button>

//                           <button
//                             type="button"
//                             title="Respond"
//                             onClick={() =>
//                               setSelectedEnquiry(
//                                 enquiry,
//                               )
//                             }
//                             className="flex h-7 w-7 items-center justify-center rounded-[8px] text-[#2E0569] transition hover:bg-[#F4EEFF]"
//                           >
//                             <MessageCircle
//                               size={14}
//                             />
//                           </button>
//                         </div>
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
//         <ViewEnquiryModal
//           enquiry={selectedEnquiry}
//           onClose={() =>
//             setSelectedEnquiry(null)
//           }
//           onUpdate={loadEnquiries}
//         />
//       )}
//     </div>
//   );
// }