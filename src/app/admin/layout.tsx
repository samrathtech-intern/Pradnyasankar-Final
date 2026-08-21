
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  BarChart2,
  Building2,
  Headphones,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
} from "lucide-react";

import { clearAdminToken } from "@/lib/adminApi";
import { AdminAuthGuard } from "@/components/AdminAuthGuard";

const NAV = [
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: BarChart2,
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: ShoppingBag,
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: Package,
  },
  {
    href: "/admin/customer-support",
    label: "Customer Support",
    icon: Headphones,
  },
  {
    href: "/admin/b2b-enquiries",
    label: "B2B Enquiries",
    icon: Building2,
  },
];
function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleSignOut() {
    clearAdminToken();
    router.replace("/admin/login");
  }

  return (
    <aside className="flex h-screen w-[220px] shrink-0 flex-col border-r border-[#E9E3EE] bg-white">
      {/* HEADER */}
      <div className="flex h-[64px] items-center gap-2 border-b border-[#E9E3EE] px-5">
        <LayoutDashboard
          size={18}
          className="text-[#8C52FF]"
        />

        <span className="text-[13px] font-extrabold tracking-[-.02em] text-[#2E0569]">
          Admin Panel
        </span>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-[13px] font-extrabold transition ${
                active
                  ? "bg-[#F2EBFF] text-[#8C52FF]"
                  : "text-[#716A78] hover:bg-[#FAFAFA] hover:text-[#2E0569]"
              }`}
            >
              <Icon size={16} />

              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* SIGN OUT */}
      <div className="border-t border-[#E9E3EE] p-3">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-[13px] font-extrabold text-[#716A78] transition hover:bg-[#FDECEA] hover:text-[#C0392B]"
        >
          <LogOut size={16} />

          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen bg-[#FAFAFA]">
        <Sidebar />

        <main className="min-w-0 flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </AdminAuthGuard>
  );
}


// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";

// import {
//   BarChart2,
//   Building2,
//   Headphones,
//   LayoutDashboard,
//   LogOut,
//   Package,
//   ShoppingBag,
// } from "lucide-react";

// import { clearAdminToken } from "@/lib/adminApi";
// import { AdminAuthGuard } from "@/components/AdminAuthGuard";

// const NAV = [
//   {
//     href: "/admin/analytics",
//     label: "Analytics",
//     icon: BarChart2,
//   },
//   {
//     href: "/admin/orders",
//     label: "Orders",
//     icon: ShoppingBag,
//   },
//   {
//     href: "/admin/products",
//     label: "Products",
//     icon: Package,
//   },
//   {
//     href: "/admin/customer-support",
//     label: "Customer Support",
//     icon: Headphones,
//   },
//   ,
//   {
//     href: "/admin/b2b-enquiries",
//     label: "B2B Enquiries",
//     icon: Building2,
//   },
// ];

// function Sidebar() {
//   const pathname = usePathname();
//   const router = useRouter();

//   function handleSignOut() {
//     clearAdminToken();
//     router.replace("/admin/login");
//   }

//   return (
//     <aside className="flex h-screen w-[220px] shrink-0 flex-col border-r border-[#E9E3EE] bg-white">
//       {/* HEADER */}
//       <div className="flex h-[64px] items-center gap-2 border-b border-[#E9E3EE] px-5">
//         <LayoutDashboard
//           size={18}
//           className="text-[#8C52FF]"
//         />

//         <span className="text-[13px] font-extrabold tracking-[-.02em] text-[#2E0569]">
//           Admin Panel
//         </span>
//       </div>

//       {/* NAV */}
//       <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
//         {NAV.map(({ href, label, icon: Icon }) => {
//           const active =
//             pathname === href ||
//             pathname.startsWith(`${href}/`);

//           return (
//             <Link
//               key={href}
//               href={href}
//               className={`flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-[13px] font-extrabold transition ${
//                 active
//                   ? "bg-[#F2EBFF] text-[#8C52FF]"
//                   : "text-[#716A78] hover:bg-[#FAFAFA] hover:text-[#2E0569]"
//               }`}
//             >
//               <Icon size={16} />
//               <span>{label}</span>
//             </Link>
//           );
//         })}
//       </nav>

//       {/* SIGN OUT */}
//       <div className="border-t border-[#E9E3EE] p-3">
//         <button
//           type="button"
//           onClick={handleSignOut}
//           className="flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-[13px] font-extrabold text-[#716A78] transition hover:bg-[#FDECEA] hover:text-[#C0392B]"
//         >
//           <LogOut size={16} />
//           <span>Sign out</span>
//         </button>
//       </div>
//     </aside>
//   );
// }

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <AdminAuthGuard>
//       <div className="flex min-h-screen bg-[#FAFAFA]">
//         <Sidebar />

//         <main className="min-w-0 flex-1 overflow-y-auto p-8">
//           {children}
//         </main>
//       </div>
//     </AdminAuthGuard>
//   );
// }

// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";

// import {
//   BarChart2,
//   LayoutDashboard,
//   LogOut,
//   Package,
//   ShoppingBag,
//   Headphones,
// } from "lucide-react";

// import { clearAdminToken } from "@/lib/adminApi";
// import { AdminAuthGuard } from "@/components/AdminAuthGuard";

// const NAV = [
//   {
//     href: "/admin/analytics",
//     label: "Analytics",
//     icon: BarChart2,
//   },
//   {
//     href: "/admin/orders",
//     label: "Orders",
//     icon: ShoppingBag,
//   },
//   {
//     href: "/admin/products",
//     label: "Products",
//     icon: Package,
//   },
//   {
//     href: "/admin/customer-support",
//     label: "Customer Support",
//     icon: Headphones,
//   },
// ];

// function Sidebar() {
//   const pathname = usePathname();
//   const router = useRouter();

//   function handleSignOut() {
//     clearAdminToken();
//     router.replace("/admin/login");
//   }

//   return (
//     <aside className="flex h-screen w-[220px] shrink-0 flex-col border-r border-[#E9E3EE] bg-white">
//       <div className="flex h-[64px] items-center gap-2 border-b border-[#E9E3EE] px-5">
//         <LayoutDashboard
//           size={18}
//           className="text-[#8C52FF]"
//         />

//         <span className="text-[13px] font-extrabold tracking-[-.02em] text-[#2E0569]">
//           Admin Panel
//         </span>
//       </div>

//       <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
//         {NAV.map(({ href, label, icon: Icon }) => {
//           const active = pathname.startsWith(href);

//           return (
//             <Link
//               key={href}
//               href={href}
//               className={`flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-[13px] font-extrabold transition ${
//                 active
//                   ? "bg-[#F2EBFF] text-[#8C52FF]"
//                   : "text-[#716A78] hover:bg-[#FAFAFA] hover:text-[#2E0569]"
//               }`}
//             >
//               <Icon size={16} />
//               {label}
//             </Link>
//           );
//         })}
//       </nav>

//       <div className="border-t border-[#E9E3EE] p-3">
//         <button
//           type="button"
//           onClick={handleSignOut}
//           className="flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-[13px] font-extrabold text-[#716A78] transition hover:bg-[#FDECEA] hover:text-[#C0392B]"
//         >
//           <LogOut size={16} />
//           Sign out
//         </button>
//       </div>
//     </aside>
//   );
// }

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <AdminAuthGuard>
//       <div className="flex min-h-screen bg-[#FAFAFA]">
//         <Sidebar />

//         <main className="flex-1 overflow-y-auto p-8">
//           {children}
//         </main>
//       </div>
//     </AdminAuthGuard>
//   );
// }

// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { BarChart2, LayoutDashboard, LogOut, Package, ShoppingBag } from "lucide-react";
// import { clearAdminToken } from "@/lib/adminApi";
// import { AdminAuthGuard } from "@/components/AdminAuthGuard";

// const NAV = [
//   { href: "/admin/analytics", label: "Analytics", icon: BarChart2 },
//   { href: "/admin/orders",    label: "Orders",    icon: ShoppingBag },
//   { href: "/admin/products",  label: "Products",  icon: Package },
// ];

// function Sidebar() {
//   const pathname = usePathname();
//   const router = useRouter();

//   function handleSignOut() {
//     clearAdminToken();
//     router.push("/admin/login");
//   }

//   return (
//     <aside className="flex h-screen w-[220px] shrink-0 flex-col border-r border-[#E9E3EE] bg-white">
//       <div className="flex h-[64px] items-center gap-2 border-b border-[#E9E3EE] px-5">
//         <LayoutDashboard size={18} className="text-[#8C52FF]" />
//         <span className="text-[13px] font-extrabold tracking-[-.02em] text-[#2E0569]">Admin Panel</span>
//       </div>
//       <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
//         {NAV.map(({ href, label, icon: Icon }) => {
//           const active = pathname.startsWith(href);
//           return (
//             <Link
//               key={href}
//               href={href}
//               className={`flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-[13px] font-extrabold transition ${
//                 active
//                   ? "bg-[#F2EBFF] text-[#8C52FF]"
//                   : "text-[#716A78] hover:bg-[#FAFAFA] hover:text-[#2E0569]"
//               }`}
//             >
//               <Icon size={16} />
//               {label}
//             </Link>
//           );
//         })}
//       </nav>
//       <div className="border-t border-[#E9E3EE] p-3">
//         <button
//           onClick={handleSignOut}
//           className="flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-[13px] font-extrabold text-[#716A78] transition hover:bg-[#FDECEA] hover:text-[#C0392B]"
//         >
//           <LogOut size={16} /> Sign out
//         </button>
//       </div>
//     </aside>
//   );
// }

// export default function AdminLayout({ children }: { children: React.ReactNode }) {
//   // Login page is excluded from this layout via Next.js route groups.
//   // AdminAuthGuard is applied per-page (analytics, orders, products) not here,
//   // so the login page is never wrapped by the guard.
//   const pathname = usePathname();
//   const isLoginPage = pathname === "/admin/login";

//   if (isLoginPage) return <>{children}</>;

//   return (
//     <AdminAuthGuard>
//       <div className="flex min-h-screen bg-[#FAFAFA]">
//         <Sidebar />
//         <main className="flex-1 overflow-y-auto p-8">{children}</main>
//       </div>
//     </AdminAuthGuard>
//   );
// }
