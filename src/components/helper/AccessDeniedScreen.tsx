"use client";


import {Mail, Shield, RefreshCw, LogOut} from 'lucide-react';
import MainLayout from "../layout/MainLayout";
import { signOut } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/languageContext";

export default function AccessDenied() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { t } = useLanguage();
    const handleLogout = async () => {
        // Get current path to preserve the original URL after logout
        const currentPath = window.location.pathname + window.location.search;
        const callbackUrl = `/auth/signin?returnTo=${encodeURIComponent(currentPath)}`;
        await signOut({ callbackUrl });
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-100">
                    {/* Icon */}
                    <div className="mb-6">
                        <div
                            className="w-20 h-20 mx-auto bg-gradient-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center shadow-lg border-2 border-red-100">
                            <Shield className="w-12 h-12 text-red-500"/>
                        </div>
                    </div>
                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-800 mb-3 tracking-tight">
                        {t("access.denied.title") || "Access Denied"}
                    </h1>
                    <p className="text-gray-700 mb-3 leading-relaxed text-lg font-medium">
                        {t("access.denied.message") || "You don't have the required permissions to access this investment platform."}
                    </p>

                    <p className="text-gray-600 mb-8 text-sm leading-relaxed">
                        {t("access.denied.contact") || "If you believe this is an error or need access to the investment platform, please contact our team for assistance."}
                    </p>
                   
                    {/* Contact Section */}
                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200 p-5 shadow-sm">
                        <div className="flex items-center justify-center space-x-3 mb-2">
                            <Mail className="w-5 h-5 text-yellow-600"/>
                            <span className="text-sm font-medium text-gray-700">Need access?</span>
                        </div>
                        <a 
                            href="mailto:rbal_investments.fx@raiffeisen.al"
                            className="text-gray-800 font-semibold hover:text-yellow-700 transition-colors duration-200 break-all"
                        >
                            rbal_investments.fx@raiffeisen.al
                        </a>
                    </div>

                    <p className="text-xs text-gray-600 mt-8">
                    <div className="mb-6 space-y-3">                        
                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>{t("access.denied.logout") || "Logout"}</span>
                        </button>
                        <p className="text-xs text-gray-500">
                            {t("access.denied.logout.desc") || "Sign out and return to login page"}
                        </p>
                    </div>                    </p>
                </div>
            </div>
        </div>
    );
}