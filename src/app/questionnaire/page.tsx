'use client';

import { Suspense } from 'react';
import { useSession } from "next-auth/react";
import { AlertCircle } from 'lucide-react';
import InvestmentQuestionnaireScreen from "@/components/InvestmentQuestionnaireScreen";
import { useLanguage } from "@/context/languageContext";
import { LanguageProvider } from "@/context/languageContext";
import React from 'react';
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import MainLayout from "@/components/layout/MainLayout";
import { useHasQuestionnaireScreenPermission, useHasSSNQuestionnairePermission } from "@/hooks/useUserRoles";
import AccessDeniedScreen from "@/components/helper/AccessDeniedScreen";
import LoadingSpinner from "@/components/helper/LoadingSpinner";

function QuestionnaireContent() {
    const { data: session, status } = useSession();
    const [ssnParam, setSsnParam] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const {t} = useLanguage();
    const hasQuestionnairePermission = useHasQuestionnaireScreenPermission();
    const hasSSNQuestionnairePermission = useHasSSNQuestionnairePermission();

    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setSsnParam(urlParams.get('ssn'));
        setIsLoading(false);
    }, []);

    if (isLoading || status === "loading") {
        return <LoadingSpinner text={t("loading.questionnaire")} />;
    }

    // Show loading if permissions are still loading
    if (hasQuestionnairePermission === null || hasSSNQuestionnairePermission === null) {
        return <LoadingSpinner text={t("loading.questionnaire")} />;
    }

    const isLoggedIn = !!session;
    
    // If SSN parameter exists (even if empty), check if user has SSN questionnaire permission for SSN-based access
    if (ssnParam !== null && !hasSSNQuestionnairePermission) {
        return <AccessDeniedScreen />;
    }
    
    // If SSN parameter exists but is empty or just whitespace, show SSN required (but only for users with permission)
    if (ssnParam !== null && ssnParam.trim() === "") {
        return (
            <MainLayout hideSidebar={true}>
                <div className="min-h-screen bg-white flex flex-col">
                    {/* Content */}
                    <div className="flex-1 max-w-2xl mx-auto p-6 pb-20 mb-8">
                        {/* Header Icon */}
                        <div className="mb-8 flex justify-center">
                            <div className="bg-yellow-100 p-8 rounded-full">
                                <AlertCircle className="w-16 h-16 text-yellow-600"/>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-center mb-6">
                            {t("ssn.required") || "SSN Required"}
                        </h2>

                        <div className="space-y-6 bg-gray-50 p-6 rounded-xl shadow">
                            <div className="text-center">
                                <p className="text-gray-600 mb-6">
                                    {t("ssn.required.description") || "Please provide an SSN in the URL to access the questionnaire."}
                                </p>

                                <div className="bg-white border border-yellow-200 rounded-lg p-4">
                                    <p className="text-sm text-gray-700 font-medium mb-2">
                                        {t("required.url.format") || "Required URL format:"}
                                    </p>
                                    <code className="text-black text-sm bg-yellow-50 px-3 py-2 rounded border break-all">
                                        /questionnaire?ssn=A12345678B
                                    </code>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    const hasSsnInRoute = Boolean(ssnParam && ssnParam.trim() !== ""); // Check for non-empty SSN

    // If SSN is provided in route, check permission and then show standalone (no sidebar) regardless of login status
    if (hasSsnInRoute) {
        // Double-check permission for SSN-based access
        if (!hasSSNQuestionnairePermission) {
            return <AccessDeniedScreen />;
        }
        
        const isValidSsn = ssnParam ? /^[A-Za-z]\d{8}[A-Za-z]$/.test(ssnParam) : false;

        if (!isValidSsn) {
            return (
                <MainLayout hideSidebar={true}>
                    <div className="min-h-screen bg-white flex flex-col">
                        {/* Content */}
                        <div className="flex-1 max-w-2xl mx-auto p-6 pb-20 mb-8">
                            {/* Header Icon */}
                            <div className="mb-8 flex justify-center">
                                <div className="bg-gray-100 p-8 rounded-full">
                                    <AlertCircle className="w-16 h-16 text-gray-600"/>
                                </div>
                            </div>

                            <h2 className="text-3xl font-bold text-center mb-6">
                                {t("invalid.ssn.format") || "Invalid SSN Format"}
                            </h2>

                            <div className="space-y-6 bg-gray-50 p-6 rounded-xl shadow">
                                <div className="text-center">
                                    <p className="text-gray-600 mb-6">
                                        {t("invalid.ssn.description") || "The provided SSN format is invalid. Please use the correct format."}
                                    </p>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="bg-white border border-gray-300 rounded-lg p-4">
                                            <p className="text-sm text-gray-700 font-medium mb-2">
                                                {t("current.ssn") || "Current SSN:"}
                                            </p>
                                            <code className="text-black text-sm bg-gray-50 px-3 py-2 rounded border break-all">
                                                {ssnParam}
                                            </code>
                                        </div>

                                        <div className="bg-white border border-yellow-200 rounded-lg p-4">
                                            <p className="text-sm text-gray-700 font-medium mb-2">
                                                {t("required.format") || "Required format:"}
                                            </p>
                                            <p className="text-gray-600 text-sm mb-2">
                                                {t("format.description") || "Letter + 8 digits + Letter"}
                                            </p>
                                            <code className="text-black text-sm bg-yellow-50 px-3 py-2 rounded border">
                                                A12345678B
                                            </code>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </MainLayout>
            );
        }

        // Valid SSN in route - show questionnaire standalone (no sidebar) regardless of login status
        return <InvestmentQuestionnaireScreen standalone={true} initialSsn={ssnParam || ""}/>;
    }

    // If user is logged in and NO SSN in route, check if they have general questionnaire permission
    if (isLoggedIn) {
        // Users with only SSN questionnaire permission should not access general questionnaire
        if (!hasQuestionnairePermission) {
            return <AccessDeniedScreen />;
        }
        return <InvestmentQuestionnaireScreen standalone={false} initialSsn="" />;
    }

    // This should never happen since we handle all cases above, but keeping as fallback
    return (
        <MainLayout hideSidebar={true}>
            <div className="min-h-screen bg-white flex flex-col">
                {/* Content */}
                <div className="flex-1 max-w-2xl mx-auto p-6 pb-20 mb-8">
                    {/* Header Icon */}
                    <div className="mb-8 flex justify-center">
                        <div className="bg-yellow-100 p-8 rounded-full">
                            <AlertCircle className="w-16 h-16 text-yellow-600"/>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-center mb-6">
                        {t("ssn.required") || "SSN Required"}
                    </h2>

                    <div className="space-y-6 bg-gray-50 p-6 rounded-xl shadow">
                        <div className="text-center">
                            <p className="text-gray-600 mb-6">
                                {t("ssn.required.description") || "Please provide an SSN in the URL to access the questionnaire."}
                            </p>

                            <div className="bg-white border border-yellow-200 rounded-lg p-4">
                                <p className="text-sm text-gray-700 font-medium mb-2">
                                    {t("required.url.format") || "Required URL format:"}
                                </p>
                                <code className="text-black text-sm bg-yellow-50 px-3 py-2 rounded border break-all">
                                    /questionnaire?ssn=A12345678B
                                </code>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

function QuestionnairePage() {
    return (
        <ProtectedLayout>
        <LanguageProvider>
            <Suspense fallback={<LoadingSpinner text="Loading questionnaire..." />}>
                <QuestionnaireContent/>
            </Suspense>
        </LanguageProvider>
        </ProtectedLayout>
    );
}

export default QuestionnairePage;