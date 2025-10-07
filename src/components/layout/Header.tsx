import React, { useEffect, useState, useRef } from "react";
import { RefreshCw, Building2, Printer, User, ChevronDown, LogOut } from "lucide-react";
import { useLanguage } from "@/context/languageContext";
import { useUserRoles } from "@/hooks/useUserRoles";
import { signOut } from "next-auth/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import LanguageSwitch from "../helper/LanguageSwitch";

interface HeaderProps {
  bulletinInfo: { date: string };
  onRefresh?: () => void;
  isRefreshing?: boolean;
  subtitle?: string;
  showRefresh?: boolean;
  showDate?: boolean;
  showLanguageSwitch?: boolean;
  sidebarCollapsed?: boolean;
  hideSidebar?: boolean; // New prop to indicate if sidebar is hidden
  showSummaryActions?: boolean; // New prop to show summary actions
  onDownloadPDF?: () => void;
  onPrint?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  bulletinInfo,
  onRefresh,
  isRefreshing = false,
  subtitle,
  showRefresh = true,
  showDate = true,
  showLanguageSwitch = true,
  sidebarCollapsed = false,
  hideSidebar = false,
  showSummaryActions = false,
  onDownloadPDF,
  onPrint,
}) => {
  const { t } = useLanguage();
  const { userInfo, isLoading } = useUserRoles();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [scrolled, setScrolled] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [headerIsRefreshing, setHeaderIsRefreshing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if we're on questionnaire page with SSN parameter
  const isQuestionnaireWithSSN = pathname?.includes('/questionnaire') && searchParams?.has('ssn');

  // Handle navigation to dashboard (disabled for questionnaire with SSN)
  const handleLogoClick = () => {
    if (!isQuestionnaireWithSSN) {
      router.push('/');
    }
  };

  // Extract user name information from the token
  const userName = userInfo ? {
    firstName: userInfo.given_name || userInfo.name?.split(' ')[0] || '',
    lastName: userInfo.family_name || userInfo.name?.split(' ').slice(1).join(' ') || '',
    fullName: userInfo.name || `${userInfo.given_name || ''} ${userInfo.family_name || ''}`.trim(),
    preferredUsername: userInfo.preferred_username || userInfo.email || ''
  } : null;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setShowProfileDropdown(false);
    // Get current path to determine logout behavior
    const currentPath = window.location.pathname + window.location.search;
    // Pass current path as returnTo parameter so signin page can decide prompt behavior
    const callbackUrl = `/auth/signin?returnTo=${encodeURIComponent(currentPath)}`;
    await signOut({ callbackUrl });
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleRefresh = async () => {
    if (onRefresh) {
      setHeaderIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setHeaderIsRefreshing(false);
      }
    }
  };

  return (
    <header
      className={`bg-white shadow-sm border-b fixed top-0 z-50 transition-all duration-300
        ${scrolled ? "py-2" : "py-4"}
      `}
      style={{
        left: hideSidebar ? '0' : (sidebarCollapsed ? '64px' : '240px'),
        width: hideSidebar ? '100%' : `calc(100% - ${sidebarCollapsed ? '64px' : '240px'})`
      }}
    >
      <div className="flex items-center justify-between h-12 px-4 lg:px-8">
        {/* LEFT SIDE: Logo + Title */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <button 
            onClick={handleLogoClick}
            disabled={isQuestionnaireWithSSN}
            className={`flex items-center space-x-3 transition-opacity ${
              isQuestionnaireWithSSN 
                ? 'cursor-default' 
                : 'cursor-pointer hover:opacity-80'
            }`}
          >
            <div
              className={`bg-yellow-400 rounded-lg transition-all duration-300 ${
                scrolled ? "p-2" : "p-3"
              }`}
            >
              <Building2
                className={`text-gray-900 transition-all duration-300 ${
                  scrolled ? "w-6 h-6" : "w-8 h-8"
                }`}
              />
            </div>
            <div className="flex flex-col truncate text-left">
              <h1
                className={`font-bold text-gray-900 whitespace-nowrap transition-all duration-300 ${
                  scrolled ? "text-xl" : "text-2xl"
                }`}
              >
                RAIFFEISEN BANK sh.a
              </h1>
              {subtitle && (
                <p className="text-sm text-gray-600 leading-tight truncate text-left">
                  {subtitle}
                </p>
              )}
            </div>
          </button>
        </div>

        {/* RIGHT SIDE: Date + Refresh/Summary Actions + Language */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          {showDate && (
            <div className="text-right">
            <p className="text-sm text-gray-600 whitespace-nowrap">
              {bulletinInfo.date || ""}
            </p>
            </div>
          )}
          
          {/* Show either refresh button OR summary actions */}
          {showSummaryActions ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  console.log('Header Print button clicked');
                  if (onPrint) onPrint();
                }}
                className="flex items-center gap-2 px-3 py-2 bg-[#FFD700] text-black hover:bg-[#FFD700]/90 rounded-lg transition-colors font-medium text-sm"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
              </button>
            </div>
          ) : (
            showRefresh && (
              <div className="relative group">
                <button
                  onClick={handleRefresh}
                  disabled={headerIsRefreshing}
                  className="flex items-center justify-center w-8 h-8 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-full transition-colors duration-200 disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${headerIsRefreshing ? "animate-spin" : ""}`}
                  />
                </button>
                {/* Tooltip */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                  {headerIsRefreshing ? "Refreshing..." : "Refresh"}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-800"></div>
                </div>
              </div>
            )
          )}
          
          {showLanguageSwitch && <LanguageSwitch />}
          
          {/* User Profile Section - After Language Switch */}
          {!isLoading && userName && (
            <div className="relative group" ref={dropdownRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center justify-center w-8 h-8 bg-yellow-400 hover:bg-yellow-500 rounded-full transition-colors cursor-pointer"
              >
                {/* User initials only */}
                <span className="text-sm font-bold text-gray-900">
                  {userName.firstName.charAt(0)}{userName.lastName.charAt(0)}
                </span>
              </button>

              {/* Tooltip */}
              {!showProfileDropdown && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                  {userName.firstName} {userName.lastName}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-800"></div>
                </div>
              )}

              {/* Dropdown Menu with Full Details */}
              {showProfileDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {userName.firstName} {userName.lastName}
                    </p>
                    <p className="text-xs text-gray-600">
                      {userName.preferredUsername}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t("profile.logout")}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;