"use client";
import UploadFileScreen from "@/components/UploadFileScreen";
import MainLayout from "@/components/layout/MainLayout";
import { useSession } from "next-auth/react";
import { decodeAccessToken } from "@/utils/decodeAccessToken";
import AccessDenied from "@/components/helper/AccessDeniedScreen";
import LoadingSpinner from "@/components/helper/LoadingSpinner";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { UploadFileOnly } from "@/guards/RoleGuard";

export default function UploadFilePage() {
  const { data: session, status } = useSession();
  return (
      <ProtectedLayout>
        <MainLayout>
          <UploadFileOnly>
            <UploadFileScreen />
          </UploadFileOnly>
        </MainLayout>
      </ProtectedLayout>
  );
}

