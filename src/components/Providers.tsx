"use client";

import React from "react";
import { AuthProvider } from "@/components/AuthContext";
import { AppProvider } from "@/components/AppContext";
import { GTMProvider } from "@/components/GTMProvider";

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AppProvider>
        <GTMProvider />
        {children}
      </AppProvider>
    </AuthProvider>
  );
}