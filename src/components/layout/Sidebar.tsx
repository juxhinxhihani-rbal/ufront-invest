import React from "react";
import {X, Menu, Table, ChevronLeft} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/context/languageContext";

interface SidebarProps {

    collapsed: boolean;
    onToggle: () => void;
    canUploadFile?: boolean;
    canViewExchange?: boolean;
    canViewReportsTable?: boolean;
    canViewQuestionnaire?: boolean;
    canViewFundConfiguration?: boolean;

}

import {TrendingUp, FileText, Upload, FileQuestion, FolderKanban} from "lucide-react";

export default function Sidebar({collapsed, onToggle, canUploadFile, canViewExchange, canViewReportsTable, canViewQuestionnaire, canViewFundConfiguration }: SidebarProps) {
    const location = useLocation();
    const { t, language, setLanguage } = useLanguage();
    
    // Define links with translation keys
    const links = [
        {href: "/exchangeRate", labelKey: "sidebar.exchange.rate", icon: TrendingUp, color: "text-yellow-500"},
        {href: "/uploadFile", labelKey: "sidebar.upload.file", icon: Upload, color: "text-green-500"},
        {href: "/reportsTable", labelKey: "sidebar.reports.table", icon: Table, color: "text-blue-500"},
        {href: "/questionnaire", labelKey: "sidebar.investment.questionnaire", icon: FileQuestion, color: "text-purple-500"},
        {href: "/fundConfiguration", labelKey: "sidebar.fund.configuration", icon: FolderKanban, color: "text-gray-500"},
    ];
    
    let filteredLinks = links;

    if (!canUploadFile) {
        filteredLinks = filteredLinks.filter(link => link.href !== "/uploadFile");
    }

    if (!canViewExchange) {
        filteredLinks = filteredLinks.filter(link => link.href !== "/exchangeRate");
    }

    if (!canViewReportsTable) {
        filteredLinks = filteredLinks.filter(link => link.href !== "/reportsTable");
    }

    if (!canViewQuestionnaire) {
        filteredLinks = filteredLinks.filter(link => link.href !== "/questionnaire");
    }

    if (!canViewFundConfiguration) {
        filteredLinks = filteredLinks.filter(link => link.href !== "/fundConfiguration");
    }

    const pathname = location.pathname;
    return (
        <>
            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full bg-white shadow-lg z-40 transition-all duration-300 ${
                    collapsed ? "w-16" : "w-60"
                }`}
                role="navigation"
                aria-label="Sidebar"
            >
                {/* Header */}
                <div className={`flex items-center justify-between px-4 py-4 border-b bg-gray-50 h-20`}>

                    <button
                        onClick={onToggle}
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        className="flex items-center space-x-2 p-1 p-1 rounded hover:bg-gray-200"
                    >
                        <Menu className="w-6 h-6 text-yellow-500"/>
                        {!collapsed && (
                            <span className="text-lg text-gray-800 font-bold">Menu</span>
                        )}
                    </button>
                </div>


                {/* Navigation */}
                <nav className="mt-6 flex flex-col gap-2 px-3">
                    {filteredLinks.map(link => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;

                        if (collapsed) {
                            return (
                                <div key={link.href} className="relative group">
                                    <Link
                                        to={link.href}
                                        className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                                            isActive
                                                ? 'bg-yellow-100 text-yellow-600'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        <Icon className={`w-5 h-5 ${isActive ? 'text-yellow-600' : link.color}`}/>
                                    </Link>
                                    {/* Tooltip */}
                                    <div
                                        className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                                        {t(link.labelKey)}
                                        <div
                                            className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-800"></div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={link.href}
                                to={link.href}
                                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors font-medium ${
                                    isActive
                                        ? 'bg-yellow-100 text-yellow-600'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-yellow-600' : link.color}`}/>
                                <span>{t(link.labelKey)}</span>
                            </Link>
                        );
                    })}
                </nav>

                {!collapsed && (
                    <div className="absolute bottom-0 left-0 right-0 px-5 py-4 text-xs text-gray-400 border-t bg-white">
                        &copy; {new Date().getFullYear()} Raiffeisen Bank sh.a
                    </div>
                )}
            </div>
        </>
    );
}