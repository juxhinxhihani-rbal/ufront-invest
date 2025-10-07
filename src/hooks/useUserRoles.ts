import { useSession } from "next-auth/react";
import { decodeAccessToken } from "@/utils/decodeAccessToken";
import { useMemo } from "react";

export interface UserRoleInfo {
    groups: string[];
    roles: string[];
    hasGroup: (group: string) => boolean;
    hasRole: (role: string) => boolean;
    hasAnyGroup: (groups: string[]) => boolean;
    hasAnyRole: (roles: string[]) => boolean;
    isLoading: boolean;
    userInfo: Record<string, any> | null;
    hasNoRoles: boolean; // True if user has none of the application-specific roles (upload, exchange, questionnaire)
}

export function useUserRoles(): UserRoleInfo {
    const { data: session, status } = useSession();

    const roleInfo = useMemo(() => {
        if (status === "loading" || !session) {
            return {
                groups: [],
                roles: [],
                hasGroup: () => false,
                hasRole: () => false,
                hasAnyGroup: () => false,
                hasAnyRole: () => false,
                isLoading: status === "loading",
                userInfo: null,
                hasNoRoles: true,
            };
        }

        // Try both access token and ID token to get groups
        const accessDecoded = session?.accessToken ? decodeAccessToken(session.accessToken) : null;

        // Extract all roles from different locations
        const realmRoles = (accessDecoded?.realm_access?.roles || []) as string[];
        const accountRoles = (accessDecoded?.resource_access?.account?.roles || []) as string[];
        const investmentWebRoles = (accessDecoded?.resource_access?.['investment-web']?.roles || []) as string[];
        const groups = (accessDecoded?.groups || []) as string[];

        // Combine all roles together
        const allRoles = [
            ...realmRoles,
            ...accountRoles,
            ...investmentWebRoles,
        ];
        const roles = Array.from(new Set(allRoles)); // Remove duplicates

        const hasGroup = (group: string): boolean => groups.includes(group);

        const hasRole = (role: string): boolean => {
            // Check if role exists directly in the roles array
            return roles.includes(role);
        };

        const hasAnyGroup = (groupsToCheck: string[]): boolean => {
            return groupsToCheck.some(group => hasGroup(group));
        };

        const hasAnyRole = (rolesToCheck: string[]): boolean => {
            return rolesToCheck.some(role => hasRole(role));
        };

        return {
            groups,
            roles, // Now contains all roles from all sources
            hasGroup,
            hasRole,
            hasAnyGroup,
            hasAnyRole,
            isLoading: false,
            userInfo: accessDecoded,
            hasNoRoles: !investmentWebRoles.some(role => {
                // Check for environment variable roles
                const hasEnvRoles = [UPLOAD_FILE_ROLE, EXCHANGE_SCREEN_ROLE, QUESTIONNAIRE_SCREEN_ROLE, FUND_PERFORMANCE_ROLE].includes(role);
                
                // Check for dynamic roles
                const hasSSNQuestionnaireRole = SSN_QUESTIONNAIRE_ROLE_KEYWORDS.some(keyword => 
                    role.toLowerCase().includes(keyword.toLowerCase())
                );
                const hasReportTableRole = REPORT_TABLE_ROLE_KEYWORDS.some(keyword => 
                    role.toLowerCase().includes(keyword.toLowerCase())
                );
                
                return hasEnvRoles || hasSSNQuestionnaireRole || hasReportTableRole;
            }),
        };
    }, [session, status]);

    return roleInfo;
}

// Get environment variables outside of hooks to avoid webpack issues
const UPLOAD_FILE_ROLE ='menu_invest_fx_rate_upload';
const EXCHANGE_SCREEN_ROLE = 'menu_invest_fx_rate_dashboard';
const QUESTIONNAIRE_SCREEN_ROLE = 'menu_invest_risk_questionnaire';
const MENU_INVEST_ADMIN_ROLE = 'menu_invest_admin';

// Hook to check if user can access fund configuration (admin)
export function useHasMenuInvestAdminPermission(): boolean | null {
    const { hasRole, isLoading } = useUserRoles();

    if (isLoading) {
        return null;
    }

    return MENU_INVEST_ADMIN_ROLE ? hasRole(MENU_INVEST_ADMIN_ROLE) : false;
}


const FUND_PERFORMANCE_ROLE = 'menu_invest_fund_performance';
const SSN_QUESTIONNAIRE_ROLE_KEYWORDS = [
    'menu_invest_risk_questionnaire_ssn',
];
const REPORT_TABLE_ROLE_KEYWORDS = [
    'menu_invest_report_table'
];

// Example convenience hook - you can create specific ones for your needs
export function useHasUploadPermission(): boolean | null {
    const { hasRole, isLoading } = useUserRoles();

    if (isLoading) {
        return null;
    }

    return UPLOAD_FILE_ROLE ? hasRole(UPLOAD_FILE_ROLE) : false;
}

// Hook to check if user can access exchange screen
export function useHasExchangeScreenPermission(): boolean | null {
    const { hasRole, isLoading } = useUserRoles();

    if (isLoading) {
        return null;
    }

    return EXCHANGE_SCREEN_ROLE ? hasRole(EXCHANGE_SCREEN_ROLE) : false;
}

// Hook to check if user can access questionnaire screen
export function useHasQuestionnaireScreenPermission(): boolean | null {
    const { hasRole, isLoading } = useUserRoles();

    if (isLoading) {
        return null;
    }

    return QUESTIONNAIRE_SCREEN_ROLE ? hasRole(QUESTIONNAIRE_SCREEN_ROLE) : false;
}

// Hook to check if user can access SSN-based questionnaire routes (dynamic)
export function useHasSSNQuestionnairePermission(): boolean | null {
    const { roles, isLoading } = useUserRoles();

    if (isLoading) {
        return null;
    }

    // Check if user has any role that contains SSN questionnaire keywords
    const hasSSNQuestionnaireRole = roles.some(role => 
        SSN_QUESTIONNAIRE_ROLE_KEYWORDS.some(keyword => 
            role.toLowerCase().includes(keyword.toLowerCase())
        )
    );

    return hasSSNQuestionnaireRole;
}

// Hook to check if user can access report table screen (dynamic)
export function useHasReportTablePermission(): boolean | null {
    const { roles, isLoading } = useUserRoles();

    if (isLoading) {
        return null;
    }

    // Check if user has any role that contains report table keywords
    const hasReportTableRole = roles.some(role => 
        REPORT_TABLE_ROLE_KEYWORDS.some(keyword => 
            role.toLowerCase().includes(keyword.toLowerCase())
        )
    );

    return hasReportTableRole;
}

// Hook to check if user has no investment-web roles
export function useHasNoRoles(): boolean {
    const { hasNoRoles, isLoading } = useUserRoles();

    // Don't show access denied while still loading
    if (isLoading) return false;

    return hasNoRoles;
}

// Hook to check if user should see Access Denied directly
// This includes users with no roles OR users with only SSN questionnaire role
// BUT excludes SSN questionnaire routes where the route itself handles permissions
export function useShouldShowAccessDenied(): boolean {
    const { hasNoRoles, isLoading, roles } = useUserRoles();
    const hasUploadPermission = useHasUploadPermission();
    const hasExchangePermission = useHasExchangeScreenPermission();
    const hasQuestionnairePermission = useHasQuestionnaireScreenPermission();
    const hasReportTablePermission = useHasReportTablePermission();

    // Don't show access denied while still loading
    if (isLoading) return false;

    // Check if we're on a questionnaire route with SSN parameter (let questionnaire page handle it)
    if (typeof window !== 'undefined') {
        const currentUrl = new URL(window.location.href);
        // Check for both /questionnaire and /questionnaire/ (with trailing slash)
        const isQuestionnaireRoute = currentUrl.pathname === '/questionnaire' || currentUrl.pathname === '/questionnaire/';
        
        if (isQuestionnaireRoute && currentUrl.searchParams.has('ssn')) {
            // On SSN questionnaire route - let the questionnaire component handle permissions
            return false;
        }
    }

    // If user has no roles at all
    if (hasNoRoles) return true;

    // Check if user only has SSN questionnaire role (no other dashboard access)
    const hasAnyDashboardAccess = hasUploadPermission || hasExchangePermission || hasQuestionnairePermission || hasReportTablePermission;
    
    // If user has no dashboard access, they should see Access Denied
    return !hasAnyDashboardAccess;
}