"use client";

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Download, Calendar, Filter, RefreshCw, FileSpreadsheet, Search, X, Eye, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { CustomerPotentialService, CustomerPotential, PaginatedResponse } from '@/service/CustomerPotentialService';
import { useLanguage } from '@/context/languageContext';
import { useSidebar } from '@/context/sidebarContext';
import LoadingSpinner from './helper/LoadingSpinner';

export interface ReportTableScreenRef {
  refresh: () => Promise<void>;
}

const InvestmentReportsScreen = forwardRef<ReportTableScreenRef>((props, ref) => {
  const { t } = useLanguage();
  const { sidebarCollapsed, hideSidebar } = useSidebar();
  const [reportData, setReportData] = useState<CustomerPotential[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingDocs, setDownloadingDocs] = useState<string[]>([]);
  const [previewDocument, setPreviewDocument] = useState<{
    documents: { fileName: string; contentData: string }[];
    currentIndex: number;
  } | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const [showEmptyTable] = useState(false);

  const bulletinInfo = {
    date: new Date().toLocaleDateString(),
    number: 'R-001'
  };

  const columns = [
    { title: "ssn", dataIndex: "ssn" },
    { title: "Client ID Primera", dataIndex: "clientIdPrimera" },
    { title: "Primera Order ID", dataIndex: "primeraOrderId" },
    { title: "Risk Profile", dataIndex: "riskProfile" },
    { title: "Flow", dataIndex: "flow" },
    { title: t('status'), dataIndex: "status" },
    { title: "Document Status", dataIndex: "documentStatus" },
    { title: "Fund ID", dataIndex: "fundId" },
    { title: "Date Inserted", dataIndex: "dateInserted" },
    { title: "Date Updated", dataIndex: "dateUpdated" },
    { title: "Transaction ID", dataIndex: "transactionID" },
    { title: "Evrotrust Transaction ID", dataIndex: "evrotrustTransactionId" },
    { title: "Is Group Of Documents", dataIndex: "isGroupOfDocuments" },
    { title: "Order ID", dataIndex: "orderId" },
    { title: "Amount To Invest", dataIndex: "amountToInvest" },
    { title: "Currency Code", dataIndex: "currencyCode" },
    { title: "Debit Account", dataIndex: "debitAccount" },
    { title: "Investment Account Code", dataIndex: "investmentAccountCode" },
    { title: "Source Of Fund", dataIndex: "sourceOfFund" },
    { title: "Channel", dataIndex: "channel" },
    { title: "Payment Error Description", dataIndex: "paymentErrorDescription" },
    { title: "Application Code", dataIndex: "applicationCode" },
    { title: "Referral", dataIndex: "referral" },
    { title: "Document", dataIndex: "actions" }
  ];

  const fetchReports = async (page: number = currentPage, size: number = pageSize, search: string = searchTerm, isPagination: boolean = false, status: string = selectedStatus) => {

    if (showEmptyTable) {
      setLoading(false);
      setIsRefreshing(false);
      setPaginationLoading(false);
      return;
    }
    try {
      setError(null);

      // Only show full loading on initial load, use pagination loading for user interactions
      if (isPagination) {
        setPaginationLoading(true);
      }

      const paginatedData = await CustomerPotentialService.fetchCustomerPotentialsPaginated({
        searchKey: search,
        pageNumber: page,
        pageSize: size,
        status: status !== 'all' ? status : undefined
      });

      setReportData(paginatedData.items);
      setCurrentPage(paginatedData.pageNumber);
      setTotalPages(paginatedData.totalPages);
      setTotalCount(paginatedData.totalCount);
      setHasPreviousPage(paginatedData.hasPreviousPage);
      setHasNextPage(paginatedData.hasNextPage);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('error.occurred');
      setError(errorMessage);
      console.error('Error fetching customer potentials:', err);
      // Reset pagination on error
      setReportData([]);
      setTotalPages(0);
      setTotalCount(0);
      setHasPreviousPage(false);
      setHasNextPage(false);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
      setPaginationLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Cleanup search timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchReports(currentPage, pageSize, searchTerm, false, selectedStatus);
  };

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      fetchReports(newPage, pageSize, searchTerm, true, selectedStatus);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
    fetchReports(1, newPageSize, searchTerm, true, selectedStatus);
  };

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for debounced search
    const timeout = setTimeout(() => {
      setCurrentPage(1); // Reset to first page
      fetchReports(1, pageSize, newSearchTerm, true, selectedStatus);
    }, 500); // Wait 500ms before searching

    setSearchTimeout(timeout);
  };

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
    setCurrentPage(1); // Reset to first page when status changes
    fetchReports(1, pageSize, searchTerm, true, newStatus);
  };

  // Expose refresh function to parent components
  useImperativeHandle(ref, () => ({
    refresh: handleRefresh
  }));

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if invalid date

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${month}/${day}/${year} ${hours}:${minutes}`;
  };

  const formatBoolean = (value: boolean): string => {
    return value ? 'Yes' : 'No';
  };

  const formatAmount = (amount: number): string => {
    if (amount === null || amount === undefined) return '0.00';
    return Number(amount).toFixed(2);
  };

  const getCellValue = (item: CustomerPotential, dataIndex: string): string => {
    const value = item[dataIndex as keyof CustomerPotential];

    if (dataIndex === 'dateInserted' || dataIndex === 'dateUpdated') {
      return formatDate(value as string);
    }

    if (dataIndex === 'isGroupOfDocuments') {
      return formatBoolean(value as boolean);
    }

    if (dataIndex === 'amountToInvest') {
      return formatAmount(value as number);
    }

    return String(value || '');
  };

  const previewDocuments = async (ssn: string, fundId: string, primeraOrderId: string) => {
    const requestKey = `${ssn}-${primeraOrderId}`;

    try {
      setDownloadingDocs(prev => [...prev, requestKey]);

      // Use the CustomerPotentialService method instead of direct fetch
      const documents = await CustomerPotentialService.fetchCustomerDocuments(ssn, fundId, primeraOrderId);

      if (!documents || documents.length === 0) {
        alert('No documents found for this record.');
        return;
      }

      console.log(`Found ${documents.length} document(s) for ${ssn}`);

      setPreviewDocument({
        documents: documents.map((doc, index) => ({
          fileName: `document-${ssn}-${fundId}-${primeraOrderId}-${index + 1}.pdf`,
          contentData: window.URL.createObjectURL(doc),
        })),
        currentIndex: 0,
      });

    } catch (error) {
      console.error('Error fetching documents for preview:', error);
      alert(`Failed to fetch documents: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setDownloadingDocs(prev => prev.filter(key => key !== requestKey));
    }
  };

  const downloadDocuments = async (ssn: string, fundId: string, primeraOrderId: string) => {
    const requestKey = `${ssn}-${primeraOrderId}`;

    try {
      setDownloadingDocs(prev => [...prev, requestKey]);

      // Use the CustomerPotentialService method instead of direct fetch
      const documents = await CustomerPotentialService.fetchCustomerDocuments(ssn, fundId, primeraOrderId);

      if (!documents || documents.length === 0) {
        alert('No documents found for this record.');
        return;
      }

      // Check if single document or multiple
      console.log(`Found ${documents.length} document(s) for ${ssn}`);

      // Download all documents
      documents.forEach((blob, index) => {
        try {
          // Check if it's a valid blob with content
          if (!blob || blob.size === 0) {
            console.warn(`Document ${index + 1} is empty, skipping download`);
            return;
          }

          // Create download link
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `document-${ssn}-${fundId}-${primeraOrderId}-${index + 1}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          console.log(`Downloaded document ${index + 1} successfully`);
        } catch (err) {
          console.error(`Error downloading document ${index + 1}:`, err);
          alert(`Failed to download document ${index + 1}. Please try again.`);
        }
      });

    } catch (error) {
      console.error('Error fetching documents:', error);
      alert(`Failed to fetch documents: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setDownloadingDocs(prev => prev.filter(key => key !== requestKey));
    }
  };

  const handleDownloadExcel = () => {
    try {
      CustomerPotentialService.exportToExcel(filteredData);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  // Since we're doing server-side filtering, filteredData is just the reportData
  const filteredData = reportData;

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-8 flex justify-center">
            <div className="bg-red-100 p-8 rounded-full">
              <RefreshCw className="w-16 h-16 text-red-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('connection.error')}</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            {isRefreshing ? t('retrying') : t('try.again')}
          </button>
        </div>
      </div>
    );
  }
  if (loading) {
    return <LoadingSpinner text={t('loading.reports')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('investment.reports')}</h1>
          <p className="text-gray-600">{t('detailed.investment.data')}</p>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">{t('date')}:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">{t('status')}:</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={paginationLoading}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="all">All Statuses</option>
                  <option value="PaymentProcessed">Payment Processed</option>
                  <option value="UserCancelled">User Cancelled</option>
                  <option value="ApplicationExpired">Application Expired</option>
                  <option value="PaymentFailed">Payment Failed</option>
                </select>
              </div>

              {/* Search Bar */}
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">{t('search')}:</label>
                <div className="flex-1 max-w-md">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder={t('search.placeholder')}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                {searchTerm && (
                  <button
                    onClick={() => handleSearchChange('')}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    title={t('clear.search')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>


            <button
              onClick={handleDownloadExcel}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{t('download.excel')}</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-yellow-400 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('investment.report')}
            </h2>
            <p className="text-sm text-gray-700">
              {totalCount} {t('records.total')}, {filteredData.length} {t('records.displayed')}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={column.dataIndex}
                      className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-r border-gray-100 ${index === 0 ? 'sticky left-0 z-30 shadow-lg border-r border-gray-200' : ''
                        } ${column.dataIndex === 'actions' ? 'w-24 min-w-24 max-w-24 sticky right-0 z-30 border-r-0 shadow-lg border-l border-gray-200' : ''
                        }`}
                      style={{
                        backgroundColor: index === 0 || column.dataIndex === 'actions'
                          ? '#ffffff'
                          : undefined
                      }}
                    >
                      {column.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((row, rowIndex) => (
                  <tr
                    key={`${row.ssn}-${rowIndex}`}
                    className={`hover:bg-gray-50 transition-colors duration-150 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                      }`}
                  >
                    {columns.map((column, colIndex) => (
                      <td
                        key={column.dataIndex}
                        className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-100 ${colIndex === 0 ? `sticky left-0 z-30 font-medium shadow-lg border-r border-gray-200` : ''
                          } ${column.dataIndex === 'actions' ? `w-24 min-w-24 max-w-24 sticky right-0 z-30 border-r-0 shadow-lg border-l border-gray-200` : ''
                          }`}
                        style={{
                          backgroundColor: colIndex === 0 || column.dataIndex === 'actions'
                            ? '#ffffff'
                            : undefined
                        }}
                      >
                        {column.dataIndex === 'status' && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCellValue(row, column.dataIndex) === 'PaymentProcessed' ? 'bg-green-100 text-green-800' :
                            ['UserCancelled', 'ApplicationExpired', 'PaymentFailed'].includes(getCellValue(row, column.dataIndex)) ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                            {getCellValue(row, column.dataIndex)}
                          </span>
                        )}
                        {column.dataIndex === 'actions' && row.primeraOrderId && row.fundId && row.documentStatus === "DocumentDownloaded" && (
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => previewDocuments(row.ssn, row.fundId, row.primeraOrderId)}
                              disabled={downloadingDocs.includes(`${row.ssn}-${row.primeraOrderId}`)}
                              className="inline-flex items-center p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Preview Document"
                            >
                              {downloadingDocs.includes(`${row.ssn}-${row.primeraOrderId}`) ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        )}
                        {column.dataIndex !== 'status' && column.dataIndex !== 'actions' && (
                          <span className={`${column.dataIndex === 'amountToInvest' ? 'font-mono text-right block' : ''
                            } ${column.dataIndex === 'isGroupOfDocuments' ? 'font-medium' : ''
                            }`}>
                            {getCellValue(row, column.dataIndex)}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-gray-50 border-t border-gray-200">
            {/* Page Size Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Show:</span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                disabled={paginationLoading}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-700">per page</span>
              {paginationLoading && (
                <RefreshCw className="w-4 h-4 animate-spin text-gray-500" />
              )}
            </div>

            {/* Pagination Info */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700 flex items-center">
                {paginationLoading && (
                  <RefreshCw className="w-3 h-3 animate-spin mr-2 text-gray-500" />
                )}
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} results
              </span>

              {/* Page Navigation */}
              <div className="flex items-center space-x-1">
                {/* First Page */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={!hasPreviousPage || paginationLoading}
                  className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  title="First Page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>

                {/* Previous Page */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!hasPreviousPage || paginationLoading}
                  className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const startPage = Math.max(1, currentPage - 2);
                  const endPage = Math.min(totalPages, startPage + 4);
                  const pageNumber = Math.max(1, endPage - 4) + i;

                  if (pageNumber > totalPages) return null;

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      disabled={paginationLoading}
                      className={`px-3 py-2 rounded-md border text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed ${pageNumber === currentPage
                        ? 'border-yellow-500 bg-yellow-500 text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                {/* Next Page */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!hasNextPage || paginationLoading}
                  className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Last Page */}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={!hasNextPage || paginationLoading}
                  className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  title="Last Page"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('summary')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total Records</p>
              <p className="text-2xl font-bold text-blue-900">{totalCount}</p>
              <p className="text-xs text-blue-500">Current page: {filteredData.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Payment Processed</p>
              <p className="text-2xl font-bold text-green-900">
                {filteredData.filter(item => item.status === 'PaymentProcessed').length}
              </p>
              <p className="text-xs text-green-500">Current page</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-orange-600 font-medium">Plan</p>
              <p className="text-2xl font-bold text-orange-900">
                {filteredData.filter(item => item.flow === 'Plan').length}
              </p>
              <p className="text-xs text-orange-500">Current page</p>
            </div>
            <div className="bg-cyan-50 p-4 rounded-lg">
              <p className="text-sm text-cyan-600 font-medium">NewInvest</p>
              <p className="text-2xl font-bold text-cyan-900">
                {filteredData.filter(item => item.flow === 'NewInvest').length}
              </p>
              <p className="text-xs text-cyan-500">Current page</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-sm text-indigo-600 font-medium">BuyQuota</p>
              <p className="text-2xl font-bold text-indigo-900">
                {filteredData.filter(item => item.flow === 'BuyQuota').length}
              </p>
              <p className="text-xs text-indigo-500">Current page</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">{t('total.amount')}</p>
              <p className="text-2xl font-bold text-purple-900">
                {filteredData.reduce((sum, item) => sum + item.amountToInvest, 0).toFixed(2)}
              </p>
              <p className="text-xs text-purple-500">Current page</p>
            </div>
          </div>
        </div>
      </div>
      {previewDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-2 sm:p-4">
          <div
            className="bg-white rounded-lg shadow-xl flex flex-col
        w-[98vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] xl:w-[75vw]
        h-[90vh] sm:h-[85vh] md:h-[80vh]
        max-w-6xl
        mt-10 sm:mt-12"
            style={{
              marginLeft: hideSidebar ? '20px' : (sidebarCollapsed ? '100px' : '276px'),
              marginRight: '20px'
            }}
          >
            <div className="flex items-center justify-between p-2 sm:p-3 md:p-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-xs sm:text-sm md:text-lg font-medium text-gray-900 truncate pr-2">
                <span className="hidden md:inline">Document Preview: </span>
                <span className="md:hidden">Preview: </span>
                {previewDocument.documents[previewDocument.currentIndex].fileName}
              </h3>
              <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                <button
                  onClick={() => {
                    // Download the current document
                    try {
                      const link = document.createElement('a');
                      link.href = previewDocument.documents[previewDocument.currentIndex].contentData;
                      link.download = previewDocument.documents[previewDocument.currentIndex].fileName;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    } catch (err) {
                      console.error('Error downloading document:', err);
                      alert('Error downloading document');
                    }
                  }}
                  className="inline-flex items-center px-1 py-1 sm:px-2 sm:py-1 md:px-3 md:py-2 border border-gray-300 shadow-sm text-xs sm:text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 md:mr-2" />
                  <span className="hidden md:inline">Download</span>
                </button>
                <button
                  onClick={() => {
                    // Clean up blob URLs when closing modal
                    previewDocument.documents.forEach(doc => {
                      if (doc.contentData.startsWith('blob:')) {
                        window.URL.revokeObjectURL(doc.contentData);
                      }
                    });
                    setPreviewDocument(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-1 sm:p-2 md:p-4 min-h-0">
              <iframe
                src={previewDocument.documents[previewDocument.currentIndex].contentData}
                className="w-full h-full border border-gray-300 rounded"
                title="Document Preview"
              />
            </div>
            <div className="flex items-center justify-between p-2 sm:p-3 md:p-4 border-t border-gray-200">
              <button
                onClick={() => setPreviewDocument(prev => {
                  if (!prev) return null; // Handle null case
                  return {
                    ...prev,
                    currentIndex: Math.max(prev.currentIndex - 1, 0),
                  };
                })}
                disabled={previewDocument.currentIndex === 0}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Document {previewDocument.currentIndex + 1} of {previewDocument.documents.length}
              </span>
              <button
                onClick={() => setPreviewDocument(prev => {
                  if (!prev) return null; // Handle null case
                  return {
                    ...prev,
                    currentIndex: Math.min(prev.currentIndex + 1, prev.documents.length - 1),
                  };
                })}
                disabled={previewDocument.currentIndex === previewDocument.documents.length - 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
});

InvestmentReportsScreen.displayName = 'InvestmentReportsScreen';

export default InvestmentReportsScreen;