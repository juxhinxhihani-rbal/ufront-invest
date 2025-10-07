"use client";
import MainLayout from "@/components/layout/MainLayout";
import dynamic from "next/dynamic";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { FundConfigurationOnly } from "@/guards/RoleGuard";
import FundConfigurationPage from "../../components/FundConfigurationTable";


export default function FundConfigurationsPage() {
  return (
    <ProtectedLayout>
      <MainLayout>
        <FundConfigurationOnly>
          <FundConfigurationPage />
        </FundConfigurationOnly>
      </MainLayout>
    </ProtectedLayout>
  );
}
