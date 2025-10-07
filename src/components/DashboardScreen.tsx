"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, Upload, Table, FileQuestion, ArrowRight, FolderKanban } from "lucide-react";
import { useLanguage } from "@/context/languageContext";
import { useHasNoRoles } from '@/hooks/useUserRoles';
import FundPerformanceGraph from './FundPerformanceGraph';

interface DashboardScreenProps {
    canUploadFile?: boolean;
    canViewExchange?: boolean;
    canViewReportsTable?: boolean;
    canViewQuestionnaire?: boolean;
}

interface MenuCard {
    href: string;
    labelKey: string;
    subtitleKey: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    borderColor: string;
    hoverBg: string;
    enabled: boolean;
}

interface Fund {
    id: number;
    fundId: string;
    fundName: string;
    volume: string;
    currency: string;
}

interface FundPerformanceData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
    }[];
}

export default function DashboardScreen({
    canUploadFile = true,
    canViewExchange = true,
    canViewReportsTable = true,
    canViewQuestionnaire = true
}: DashboardScreenProps) {
    const { t } = useLanguage();
    const [fundPerformanceData, setFundPerformanceData] = useState<FundPerformanceData | null>(null);
    const hasFundPerformanceRole = !useHasNoRoles();

    // Define menu cards with all their properties
    const menuCards: MenuCard[] = [
        {
            href: "/exchangeRate",
            labelKey: "sidebar.exchange.rate",
            subtitleKey: "subtitle.exchangeRate",
            icon: TrendingUp,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
            borderColor: "border-yellow-200",
            hoverBg: "hover:bg-yellow-100",
            enabled: canViewExchange
        },
        {
            href: "/uploadFile",
            labelKey: "sidebar.upload.file",
            subtitleKey: "subtitle.uploadFile",
            icon: Upload,
            color: "text-green-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-200",
            hoverBg: "hover:bg-green-100",
            enabled: canUploadFile
        },
        {
            href: "/reportsTable",
            labelKey: "sidebar.reports.table",
            subtitleKey: "subtitle.reports",
            icon: Table,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
            hoverBg: "hover:bg-blue-100",
            enabled: canViewReportsTable
        },
        {
            href: "/questionnaire",
            labelKey: "sidebar.investment.questionnaire",
            subtitleKey: "subtitle.default",
            icon: FileQuestion,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-200",
            hoverBg: "hover:bg-purple-100",
            enabled: canViewQuestionnaire
        }
        ,
        {
            href: "/fundConfiguration",
            labelKey: "sidebar.fund.configuration",
            subtitleKey: "subtitle.fundConfiguration",
            icon: FolderKanban,
            color: "text-gray-600",
            bgColor: "bg-gray-50",
            borderColor: "border-gray-200",
            hoverBg: "hover:bg-gray-100",
            enabled: true // Add role/permission logic if needed
        }
    ];

    // Filter cards based on permissions
    const availableCards = menuCards.filter(card => card.enabled);

    useEffect(() => {
        if (hasFundPerformanceRole) {
            fetch('/api/fund-performance?startDate=2025-07-19T07:53:38.248Z&endDate=2025-09-19T07:53:38.248Z')
                .then((response) => response.json())
                .then((data: { funds: Fund[]; currency: string }) => {
                    console.log('Raw API Response:', data); // Debugging log for raw API response
                    if (!data.funds || !Array.isArray(data.funds)) {
                        console.error('Invalid API response:', data); // Log invalid response
                        return;
                    }
                    const chartData: FundPerformanceData = {
                        labels: data.funds.map((fund) => fund.fundName),
                        datasets: [
                            {
                                label: `Volume (${data.currency})`,
                                data: data.funds.map((fund) => parseFloat(fund.volume)),
                                backgroundColor: [
                                    '#FF6384', // Red
                                    '#36A2EB', // Blue
                                    '#FFCE56', // Yellow
                                    '#4BC0C0', // Teal
                                    '#9966FF', // Purple
                                    '#FF9F40', // Orange
                                ],
                            },
                        ],
                    };
                    console.log('Fund Performance Data:', chartData); // Debugging log for chart data
                    setFundPerformanceData(chartData);
                });
        }
    }, [hasFundPerformanceRole]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {t("dashboard.title") || "Dashboard"}
                    </h1>
                    <p className="text-gray-600">
                        {t("dashboard.subtitle") || "Welcome to your investment management platform. Select an option below to get started."}
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {availableCards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <Link
                                key={card.href}
                                href={card.href}
                                className={`
                                    block p-6 rounded-xl border-2 transition-all duration-200 
                                    ${card.bgColor} ${card.borderColor} ${card.hoverBg}
                                    hover:shadow-lg hover:scale-105 transform
                                `}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`
                                        p-3 rounded-lg ${card.bgColor.replace('50', '100')}
                                    `}>
                                        <Icon className={`w-6 h-6 ${card.color}`} />
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                </div>

                                <h3 className={`text-xl font-semibold mb-2 ${card.color}`}>
                                    {t(card.labelKey)}
                                </h3>

                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {t(card.subtitleKey)}
                                </p>
                            </Link>
                        );
                    })}
                </div>

                {/* Quick Stats or Additional Info */}
                <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        {t("dashboard.quick.access") || "Quick Access"}
                    </h2>
                    <div className={`grid grid-cols-1 ${availableCards.length === 2 ? 'md:grid-cols-2' : availableCards.length >= 3 ? 'md:grid-cols-3' : ''} gap-4`}>
                        {canViewExchange && (
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <TrendingUp className="w-6 h-6 text-yellow-600" />
                                </div>
                                <h3 className="font-medium text-gray-900">
                                    {t("dashboard.live.rates") || "Live Rates"}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {t("dashboard.live.rates.desc") || "Real-time exchange rates"}
                                </p>
                            </div>
                        )}

                        {canViewReportsTable && (
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Table className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="font-medium text-gray-900">
                                    {t("dashboard.reports") || "Reports"}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {t("dashboard.reports.desc") || "Investment analytics"}
                                </p>
                            </div>
                        )}

                        {canUploadFile && (
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Upload className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="font-medium text-gray-900">
                                    {t("dashboard.upload") || "Upload Files"}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {t("dashboard.upload.desc") || "Process and manage files"}
                                </p>
                            </div>
                        )}

                        {canViewQuestionnaire && (
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <FileQuestion className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="font-medium text-gray-900">
                                    {t("dashboard.assessment") || "Assessment"}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {t("dashboard.assessment.desc") || "Risk evaluation tool"}
                                </p>
                            </div>
                        )}
                        {/* Fund Configuration Quick Access Card */}
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <FolderKanban className="w-6 h-6 text-gray-600" />
                            </div>
                            <h3 className="font-medium text-gray-900">
                                {t("sidebar.fund.configuration") || "Fund Configuration"}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                {t("dashboard.fund.configuration.desc") || "Menaxho llojet dhe cilësimet e fondeve / Manage fund types and settings"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Fund Performance Graph - Conditional Rendering */}
                {hasFundPerformanceRole && fundPerformanceData && (
                    <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Fund Performance
                        </h2>
                        <FundPerformanceGraph data={fundPerformanceData} />
                    </div>
                )}

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Raiffeisen Bank sh.a</p>
                </div>
            </div>
        </div>
    );
}