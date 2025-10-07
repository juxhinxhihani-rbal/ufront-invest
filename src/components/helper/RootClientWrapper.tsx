"use client";

import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/context/languageContext";
import { SidebarProvider } from "@/context/sidebarContext";
import ConfigurationLoading from "./ConfigurationLoading";

export default function RootClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigurationLoading>
      <SessionProvider
        // Disable automatic refetch on window focus to prevent premature auth calls
        refetchOnWindowFocus={false}
        // Increase refetch interval to give time for initialization
        refetchInterval={60}
      >
        <LanguageProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </LanguageProvider>
      </SessionProvider>
    </ConfigurationLoading>
  );
}