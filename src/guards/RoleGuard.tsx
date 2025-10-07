import React from 'react';
import { useHasUploadPermission, useHasExchangeScreenPermission, useHasQuestionnaireScreenPermission, useHasNoRoles, useHasMenuInvestAdminPermission } from '@/hooks/useUserRoles';
import AccessDenied from '@/components/helper/AccessDeniedScreen';

// Simple role-based components - no complex RoleGuard needed
export function UploadFileOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
    const hasUploadPermission = useHasUploadPermission();

    if (!hasUploadPermission) {
        return fallback || <AccessDenied />;
    }

    return <>{children}</>;
}

export function ExchangeScreenOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
    const hasExchangePermission = useHasExchangeScreenPermission();

    if (!hasExchangePermission) {
        return fallback || <AccessDenied />;
    }

    return <>{children}</>;
}

export function QuestionnaireScreenOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
    const hasQuestionnairePermission = useHasQuestionnaireScreenPermission();

    if (!hasQuestionnairePermission) {
        return fallback || <AccessDenied />;
    }

    return <>{children}</>;
}

// Component to check if user has any roles at all
export function RequiresAnyRole({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
    const hasNoRoles = useHasNoRoles();

    if (hasNoRoles) {
        return fallback || <AccessDenied />;
    }

    return <>{children}</>;
}

export function FundConfigurationOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
    const hasAdminPermission = useHasMenuInvestAdminPermission();

    if (!hasAdminPermission) {
        return fallback || <AccessDenied />;
    }

    return <>{children}</>;
}

// You can add more simple role components like this:
// export function AdminOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
//   const { hasRole } = useUserRoles();
//
//   if (!hasRole('admin')) {
//     return fallback || <AccessDenied />;
//   }
//
//   return <>{children}</>;
// }