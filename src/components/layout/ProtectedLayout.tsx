"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "@/components/helper/LoadingSpinner";

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return; // Still loading

        if (!session) {
            // Redirect to sign-in if not authenticated
            router.push("/auth/signin");
        }
    }, [session, status, router]);

    if (status === "loading") {
        return <LoadingSpinner text="Checking authentication..." />;
    }

    if (!session) {
        return <LoadingSpinner text="Redirecting to login..." />;
    }

    return <>{children}</>;
}