"use client";

import React, { useEffect, useState, Suspense } from "react";
import { signIn, getProviders } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import AuthErrorScreen from "@/components/helper/AuthErrorScreen";

// Simple loading spinner to avoid context issues
function SimpleLoadingSpinner({ text }: { text?: string }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <div className="mt-4 text-lg text-gray-700">{text || "Loading..."}</div>
            </div>
        </div>
    );
}

function SignInContent() {
    const searchParams = useSearchParams();
    const returnTo = searchParams.get("returnTo");
    const callbackUrl = returnTo || searchParams.get("callbackUrl") || "/";
    const error = searchParams.get("error");
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [debugInfo, setDebugInfo] = useState<string>("");
    const [configurationReady, setConfigurationReady] = useState(false);
    const [configError, setConfigError] = useState<string | null>(null);

    // Check if configuration is ready first
    useEffect(() => {
        const checkConfiguration = async () => {
            if (process.env.NODE_ENV === 'development') {
                setConfigurationReady(true);
                return;
            }

            try {
                setDebugInfo("Checking configuration...");
                const response = await fetch('/api/config/ready');
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Configuration not ready');
                }
                
                setConfigurationReady(true);
                setDebugInfo("Configuration ready");
            } catch (err) {
                console.error('Configuration check failed:', err);
                setConfigError(err instanceof Error ? err.message : 'Configuration failed');
                setDebugInfo(`Configuration error: ${err}`);
                
                // Retry after 3 seconds
                setTimeout(checkConfiguration, 3000);
            }
        };

        checkConfiguration();
    }, []);

    useEffect(() => {
        if (!configurationReady || error) return;
        
        const handleSignIn = async () => {
            
            try {
                console.log("Starting sign-in process...");
                setDebugInfo("Getting providers...");
                
                const providers = await getProviders();
                console.log("Available providers:", providers);
                
                if (!providers?.keycloak) {
                    setDebugInfo("Keycloak provider not available");
                    console.error("Keycloak provider not found");
                    return;
                }
                
                // Check if the callback URL is for questionnaire with SSN
                const isQuestionnaireWithSSN = callbackUrl.includes('/questionnaire') && callbackUrl.includes('ssn=');
                
                setDebugInfo(isQuestionnaireWithSSN ? "Redirecting to Keycloak (SSO)..." : "Redirecting to Keycloak (Fresh login)...");
                console.log("Calling signIn with callbackUrl:", callbackUrl, "isQuestionnaireWithSSN:", isQuestionnaireWithSSN);
                
                const signInOptions: any = {
                    callbackUrl,
                    redirect: true,
                };
                
                // Override prompt parameter for questionnaire with SSN (remove forced login)
                if (isQuestionnaireWithSSN) {
                    signInOptions.prompt = 'none'; // Override the global prompt=login
                    console.log("Overriding prompt=login with prompt=none for questionnaire with SSN");
                }
                
                const result = await signIn("keycloak", signInOptions);
                
                console.log("SignIn result:", result);
                
            } catch (err) {
                console.error("Error during sign-in:", err);
                setDebugInfo(`Error: ${err}`);
            }
        };

        handleSignIn();
    }, [error, callbackUrl, configurationReady]);

    if (error) {
        return <AuthErrorScreen error={error} callbackUrl={callbackUrl} />;
    }

    if (configError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
                    <div className="text-red-600 text-xl mb-4">Configuration Error</div>
                    <div className="text-gray-700 mb-4">{configError}</div>
                    <div className="text-sm text-gray-500 mb-4">
                        Retrying automatically every 3 seconds...
                    </div>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Retry Now
                    </button>
                </div>
            </div>
        );
    }

    if (!configurationReady) {
        return (
            <div>
                <SimpleLoadingSpinner text="Loading configuration..." />
                {debugInfo && (
                    <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}>
                        Debug: {debugInfo}
                    </div>
                )}
            </div>
        );
    }

    // Show loading spinner while redirecting
    return (
        <div>
            <SimpleLoadingSpinner text="Redirecting to login..." />
            {debugInfo && (
                <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}>
                    Debug: {debugInfo}
                </div>
            )}
        </div>
    );
}

export default function SignInPage() {
    return (
        <Suspense fallback={<SimpleLoadingSpinner text="Loading..." />}>
            <SignInContent />
        </Suspense>
    );
}