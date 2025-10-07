import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useLanguage } from "@/context/languageContext";
import { useSidebar } from "@/context/sidebarContext";

interface MainLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  showRefresh?: boolean;
  showDate?: boolean;
  hideSidebar?: boolean; // New prop to hide sidebar while keeping header
  showSummaryActions?: boolean; // New prop to show summary actions in header
  onDownloadPDF?: () => void;
  onPrint?: () => void;
  onRefresh?: () => void; // New prop for refresh function
}

export default function MainLayout({
  children,
  showNavbar = false,
  showRefresh = true,
  showDate = true,
  hideSidebar = false,
  showSummaryActions = false,
  onDownloadPDF,
  onPrint,
  onRefresh
}: MainLayoutProps) {
  const { sidebarCollapsed, setSidebarCollapsed, setHideSidebar } = useSidebar();

  // Update the context when hideSidebar prop changes
  useEffect(() => {
    setHideSidebar(hideSidebar);
  }, [hideSidebar, setHideSidebar]);

  const location = useLocation();
  const pathname = location.pathname;
  const { t } = useLanguage();
  const isUploadFile = pathname?.includes('uploadFile');
  const isQuestionnaire = pathname?.includes('questionnaire');
  const isDashboard = pathname === "/";
  const isFundConfig = pathname?.includes("/fundConfiguration");
  const subtitleMap: Record<string, string> = {
    "/questionnaire": 'subtitle.default',
    "/exchangeRate": 'subtitle.exchangeRate',
    "/uploadFile": "subtitle.uploadFile",
    "/reportsTable": "subtitle.reports",
    "/fundConfiguration": "subtitle.fundConfiguration",
    "/": 'dashboard.title'
  };

  const canUploadFile = true;
  const canViewExchange = true;
  const canViewReportsTable = true;
  const canViewQuestionnaire = true;
  const canViewFundConfiguration = true;

  const matchedRoute = Object.keys(subtitleMap).find((route) => {
    if (route === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(route);
  });

  const currentSubtitleKey = matchedRoute
    ? subtitleMap[matchedRoute]
    : "subtitle.default";

  // 🔹 Translate key -> string
  const currentSubtitle = t(currentSubtitleKey);

  return (
    <div
      className={`min-h-screen ${isUploadFile
        ? "bg-gradient-to-br from-yellow-50 to-amber-50"
        : "bg-gray-50"
        }`}
    >
      <Header
        bulletinInfo={{
          date: new Date().toLocaleDateString("sq-AL").replace(/\./g, "/"),
        }}
        showDate={pathname !== "/questionnaire" && !isUploadFile && !isQuestionnaire}
        showRefresh={pathname !== "/questionnaire" && !isUploadFile && !isQuestionnaire && !showSummaryActions && !isDashboard && !isFundConfig}
        showLanguageSwitch
        sidebarCollapsed={sidebarCollapsed}
        subtitle={currentSubtitle}
        hideSidebar={hideSidebar}
        showSummaryActions={showSummaryActions}
        onDownloadPDF={onDownloadPDF}
        onPrint={onPrint}
        onRefresh={onRefresh}
      />
      {!hideSidebar && (
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          canUploadFile={canUploadFile ?? undefined}
          canViewExchange={canViewExchange ?? undefined}
          canViewReportsTable={canViewReportsTable ?? undefined}
          canViewQuestionnaire={canViewQuestionnaire ?? undefined}
          canViewFundConfiguration={canViewFundConfiguration ?? undefined}
        />
      )}
      <main
        className={`relative z-0 transition-all duration-300 pt-20 ${hideSidebar ? "ml-0" : (sidebarCollapsed ? "ml-16" : "ml-60")
          }`}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}