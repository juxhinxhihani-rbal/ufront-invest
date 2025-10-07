'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useRef } from 'react';
import { Building2, TrendingUp, RefreshCw } from 'lucide-react';
import ExchangeRateScreen, { ExchangeRateScreenRef } from "@/components/ExchangeRateScreen";
import { useLanguage } from "@/context/languageContext";
import LanguageSwitch from "@/components/helper/LanguageSwitch";
import MainLayout from '@/components/layout/MainLayout';
import ProtectedLayout from '@/components/layout/ProtectedLayout';

function ExchangeRateContent() {
    const searchParams = useSearchParams();
    const { t } = useLanguage();
    const exchangeRateRef = useRef<ExchangeRateScreenRef>(null);

    const handleRefresh = async () => {
        if (exchangeRateRef.current) {
            await exchangeRateRef.current.refresh();
        }
    };

    return (
        <MainLayout onRefresh={handleRefresh}>
            <ExchangeRateScreen ref={exchangeRateRef} />
        </MainLayout>
    );
}

function ExchangeRatePage() {
    return (
        <ProtectedLayout>
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="bg-yellow-100 p-8 rounded-full">
                            <RefreshCw className="w-16 h-16 text-yellow-500 animate-spin" />
                        </div>
                    </div>
                    <p className="text-gray-600">Loading exchange rates...</p>
                </div>
            </div>
        }>
                <ExchangeRateContent />
        </Suspense>
        </ProtectedLayout>
    );
}

export default ExchangeRatePage;