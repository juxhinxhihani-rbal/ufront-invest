import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import MainLayout from "./layout/MainLayout";
import { TrendingUp, TrendingDown, Building2, Minus } from 'lucide-react';
import { useLanguage } from '@/context/languageContext';
import LoadingSpinner from './helper/LoadingSpinner';

import  {ExchangeRateService, ExchangeRate } from '@/service/ExchangeRateService';

export interface ExchangeRateScreenRef {
  refresh: () => Promise<void>;
}

const ExchangeRateScreen = forwardRef<ExchangeRateScreenRef>((props, ref) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'individual' | 'corporate'>('individual');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bulletinInfo, setBulletinInfo] = useState({ date: ''});
  const [retryCount, setRetryCount] = useState(0);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const [individualRates, setIndividualRates] = useState<ExchangeRate[]>([]);
  const [businessRates, setBusinessRates] = useState<ExchangeRate[]>([]);

  // Force re-render when language changes
  useEffect(() => {
    // This effect will trigger when language changes
    console.log('Language changed to:', language);
    console.log('Sample translation test:', t('exchange.rates.title'));
  }, [language]);

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchExchangeRates = async () => {
    try {
      setError(null);

      const data = await ExchangeRateService.fetchExchangeRates();
      
      // Store both rate types directly (no processing needed)
      setIndividualRates(data.individualRates);
      setBusinessRates(data.businessRates);
      setExchangeRates(activeTab === 'individual' ? data.individualRates : data.businessRates);
      
      const lastUpdateDate = new Date();
      setBulletinInfo({
        date: lastUpdateDate.toLocaleDateString(),
      });
      setLastUpdated(lastUpdateDate);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('error.occurred');
      setError(errorMessage);
      console.error('Error fetching exchange rates:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setRetryCount(prev => prev + 1);
    await fetchExchangeRates();
  };

  // Expose refresh function to parent components
  useImperativeHandle(ref, () => ({
    refresh: handleRefresh
  }));

  // Auto-retry logic
  useEffect(() => {
    if (error && retryCount < 3 && !isOffline) {
      const timer = setTimeout(() => {
        console.log(`Auto-retry attempt ${retryCount + 1}`);
        handleRefresh();
      }, 5000 * Math.pow(2, retryCount)); 
      
      return () => clearTimeout(timer);
    }
  }, [error, retryCount, isOffline]);

  // Update rates when tab changes
  useEffect(() => {
    if (individualRates.length > 0 && businessRates.length > 0) {
      setExchangeRates(activeTab === 'individual' ? individualRates : businessRates);
    }
  }, [activeTab, individualRates, businessRates]);

  const formatRate = (rate: number) => {
    return rate.toFixed(4);
  };

  const getTrendIcon = (trend: 'UP' | 'DOWN' | 'SAME') => {
    switch (trend) {
      case 'UP':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'DOWN':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'SAME':
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: 'UP' | 'DOWN' | 'SAME') => {
    switch (trend) {
      case 'UP':
        return 'text-green-600';
      case 'DOWN':
        return 'text-red-600';
      case 'SAME':
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
        <LoadingSpinner text={t('loading.exchange.rates')} />
    );
  }

  if (error) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="mb-8 flex justify-center">
              <div className="bg-red-100 p-8 rounded-full">
                <Building2 className="w-16 h-16 text-red-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('connection.error')}</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            {isOffline && (
              <div className="mb-4 p-3 bg-orange-100 border border-orange-200 rounded-lg">
                <p className="text-orange-800 text-sm">
                  {t('offline.message')}
                </p>
              </div>
            )}
            {retryCount > 0 && retryCount < 3 && (
              <div className="mb-4 p-3 bg-blue-100 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  {t('auto.retry.message').replace('{count}', retryCount.toString())}
                </p>
              </div>
            )}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              {isRefreshing ? t('retrying') : t('try.again')}
            </button>
            <p className="text-xs text-gray-500 mt-4">
              Last successful update: {lastUpdated.toLocaleString()}
            </p>
          </div>
        </div>
    );
  }

  return (
        <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
  
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('individual')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'individual'
                    ? 'border-yellow-400 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('individual')}
              </button>
              <button
                onClick={() => setActiveTab('corporate')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'corporate'
                    ? 'border-yellow-400 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('corporate')}
              </button>
            </nav>
          </div>
        </div>

        {/* Exchange Rates Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-yellow-400 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {activeTab === 'individual' ? t('individual') : t('corporate')}
            </h2>
            <p className="text-sm text-gray-700">{t('individual.description')}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('nr')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('currency.type')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('code')}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('buy.rate')}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('trend')}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('sell.rate')}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('trend')}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('average')}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('trend')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {exchangeRates && exchangeRates.length > 0 ? exchangeRates.map((rate, index) => (
                  <tr
                    key={rate.code}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{rate.currencyType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {rate.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`text-sm font-semibold ${getTrendColor(rate.trendBuy)}`}>
                        {formatRate(rate.buyInLeke)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getTrendIcon(rate.trendBuy)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`text-sm font-semibold ${getTrendColor(rate.trendSell)}`}>
                        {formatRate(rate.sellInLeke)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getTrendIcon(rate.trendSell)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatRate(rate.average)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getTrendIcon(rate.trendAvg)}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                      {t('loading.exchange.rates')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('important.notes')}</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <span className="font-medium">{t('individual')}:</span> {t('individual.note')}
            </div>
            <div>
              <span className="font-medium">{t('corporate')}:</span> {t('corporate.note')}
            </div>
          </div>
        </div>
      </div>
      </div>
  );
});

ExchangeRateScreen.displayName = 'ExchangeRateScreen';

export default ExchangeRateScreen;