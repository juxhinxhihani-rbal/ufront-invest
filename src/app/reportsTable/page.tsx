'use client';

import React, { useRef, Suspense } from 'react';
import ReportsTableScreen, { ReportTableScreenRef } from "@/components/ReportTableScreen";
import MainLayout from "@/components/layout/MainLayout";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useHasReportTablePermission } from "@/hooks/useUserRoles";
import AccessDeniedScreen from "@/components/helper/AccessDeniedScreen";
import LoadingSpinner from "@/components/helper/LoadingSpinner";

export default function ReportTablePage() {
    const hasReportTablePermission = useHasReportTablePermission();
    const reportTableRef = useRef<ReportTableScreenRef>(null);

    const handleRefresh = async () => {
        if (reportTableRef.current) {
            await reportTableRef.current.refresh();
        }
    };

    // Show loading spinner while checking permissions (prevents SSR issues)
    if (hasReportTablePermission === null || hasReportTablePermission === undefined) {
        return <LoadingSpinner text="Loading..." />;
    }

    // Show access denied if user doesn't have the required role
    if (!hasReportTablePermission) {
        return (
            <Suspense fallback={<LoadingSpinner text="Loading..." />}>
                <AccessDeniedScreen />
            </Suspense>
        );
    }

    return (
        <ProtectedLayout>
            <Suspense fallback={<LoadingSpinner text="Loading..." />}>
                <MainLayout onRefresh={handleRefresh}>
                    <ReportsTableScreen ref={reportTableRef} />
                </MainLayout>
            </Suspense>
        </ProtectedLayout>
    );
}