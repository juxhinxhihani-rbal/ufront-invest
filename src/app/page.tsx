"use client";

import MainLayout from "@/components/layout/MainLayout";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import DashboardScreen from "@/components/DashboardScreen";
import LoadingSpinner from "@/components/helper/LoadingSpinner";
import {useHasExchangeScreenPermission, useHasUploadPermission, useHasReportTablePermission, useHasQuestionnaireScreenPermission} from "@/hooks/useUserRoles";

export default function HomePage() {
    const canUploadFile = useHasUploadPermission();
    const canViewExchange = useHasExchangeScreenPermission();
    const canViewReportsTable = useHasReportTablePermission();
    const canViewQuestionnaire = useHasQuestionnaireScreenPermission();

    // Show loading if any permissions are still loading
    if (canUploadFile === null || canViewExchange === null || canViewReportsTable === null || canViewQuestionnaire === null) {
        return <LoadingSpinner text="Loading..." />;
    }

    return (
        <ProtectedLayout>
            <MainLayout>
                <DashboardScreen 
                    canUploadFile={canUploadFile ?? undefined}
                    canViewExchange={canViewExchange ?? undefined}
                    canViewReportsTable={canViewReportsTable ?? undefined}
                    canViewQuestionnaire={canViewQuestionnaire ?? undefined}
                />
            </MainLayout>
        </ProtectedLayout>
    );
}