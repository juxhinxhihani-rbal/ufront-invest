import React, { useState } from "react";
import { signIn } from "next-auth/react";

// Icon components
const AlertTriangle = (props: any) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3l-8.47-14.14a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);
const X = (props: any) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const Copy = (props: any) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
);
const Check = (props: any) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const RefreshCw = (props: any) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.13-3.36L23 10"/><path d="M1 14a9 9 0 0014.13 3.36L23 14"/></svg>
);
const ArrowLeft = (props: any) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
);

function getErrorMessage(errorType: string | null) {
    if (!errorType) return "Unknown error occurred.";
    switch (errorType) {
        case "OAuthCallback":
            return "There was a problem with the authentication callback. Please check your identity provider configuration.";
        case "InvalidCredentials":
            return "Invalid credentials. Please try again or contact support.";
        case "Configuration":
            return "Authentication configuration error. Please contact your administrator.";
        default:
            return "There was an issue with the authentication process. This usually indicates a configuration problem with the identity provider.";
    }
}

export default function AuthErrorScreen({ error, callbackUrl }: { error: string | null; callbackUrl: string }) {
    const [copied, setCopied] = useState(false);

    function handleCopyUrl() {
    navigator.clipboard.writeText(callbackUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
}
function handleRetry() {
    signIn("keycloak", { callbackUrl });
}
function handleGoBack() {
    window.location.href = callbackUrl;
}

return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">
                Authentication Error
            </h1>

            {/* Error Message */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 transition-colors duration-200">
                <div className="flex items-start">
                    <X className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-medium text-red-800">Error Type: {error}</p>
                        <p className="text-sm text-red-600 mt-1">{getErrorMessage(error)}</p>
                    </div>
                </div>
            </div>

            {/* Callback URL Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Return URL:</span>
                        </p>
                        <p className="text-sm text-gray-800 font-mono truncate mt-1">{callbackUrl}</p>
                    </div>
                    <button
                        onClick={handleCopyUrl}
                        className="ml-2 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        title="Copy URL"
                    >
                        {copied ? (
                            <Check className="w-4 h-4 text-green-600" />
                        ) : (
                            <Copy className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={handleRetry}
                    className="group flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
                >
                    <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                    Try Again
                </button>
                <button
                    onClick={handleGoBack}
                    className="group flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                    Go Back
                </button>
            </div>

            {/* Help Text */}
            <p className="text-xs text-gray-500 text-center mt-6">
                If this problem persists, please contact your system administrator.
            </p>

            {/* Additional Help Link */}
            <div className="text-center mt-4">
                <a
                    href="#"
                    className="text-xs text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
                    onClick={(e) => {
                        e.preventDefault();
                        // You can implement help/documentation link here
                    }}
                >
                    View troubleshooting guide
                </a>
            </div>
        </div>
    </div>
);
}