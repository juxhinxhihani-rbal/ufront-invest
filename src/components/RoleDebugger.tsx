'use client';

import { 
    useUserRoles, 
    useHasSSNQuestionnairePermission, 
    useHasReportTablePermission,
    useHasUploadPermission,
    useHasExchangeScreenPermission,
    useHasQuestionnaireScreenPermission 
} from '@/hooks/useUserRoles';

export function RoleDebugger() {
    const { roles, isLoading } = useUserRoles();
    const hasSSNPermission = useHasSSNQuestionnairePermission();
    const hasReportTablePermission = useHasReportTablePermission();
    const hasUploadPermission = useHasUploadPermission();
    const hasExchangePermission = useHasExchangeScreenPermission();
    const hasQuestionnairePermission = useHasQuestionnaireScreenPermission();

    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    if (isLoading) {
        return (
            <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs">
                Loading roles...
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 bg-black text-white p-3 rounded text-xs max-w-sm overflow-auto max-h-48 z-50">
            <div className="font-bold mb-2">🔍 Permissions Debug:</div>
            
            <div className="grid grid-cols-2 gap-1 mb-2 text-xs">
                <div>Upload File: {hasUploadPermission ? '✅' : '❌'}</div>
                <div>Exchange Rate: {hasExchangePermission ? '✅' : '❌'}</div>
                <div>Questionnaire: {hasQuestionnairePermission ? '✅' : '❌'}</div>
                <div>SSN Quest.: {hasSSNPermission ? '✅' : '❌'}</div>
                <div>Report Table: {hasReportTablePermission ? '✅' : '❌'}</div>
            </div>
            
            <div>
                <strong>All Roles:</strong>
                <div className="mt-1 max-h-24 overflow-auto">
                    {roles.length > 0 ? (
                        roles.map((role, index) => (
                            <div key={index} className="text-xs text-gray-300 break-all">
                                • {role}
                            </div>
                        ))
                    ) : (
                        <div className="text-xs text-gray-400">No roles found</div>
                    )}
                </div>
            </div>
        </div>
    );
}