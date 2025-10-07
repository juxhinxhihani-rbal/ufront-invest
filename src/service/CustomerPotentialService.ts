
import { safeJsonParse, safeErrorParse } from '@/utils/safe-json';

export interface CustomerPotentialParams {
  searchKey?: string;
  pageNumber?: number;
  pageSize?: number;
  status?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CustomerPotential {
  ssn: string;
  clientIdPrimera: string;
  primeraOrderId: string;
  riskProfile: string;
  flow: string;
  status: string;
  documentStatus: string;
  fundId: string;
  dateInserted: string;
  dateUpdated: string;
  transactionID: string;
  evrotrustTransactionId: string;
  isGroupOfDocuments: boolean;
  orderId: string;
  amountToInvest: number;
  currencyCode: string;
  debitAccount: string;
  investmentAccountCode: string;
  sourceOfFund: string;
  channel: string;
  paymentErrorDescription: string;
  applicationCode: string;
  referral: string;
}

export const CustomerPotentialService = {
  async fetchCustomerPotentials(params?: CustomerPotentialParams): Promise<CustomerPotential[]> {
    try {
      console.log('Fetching customer potentials...');

      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('_t', timestamp.toString());
      
      if (params?.searchKey) {
        queryParams.append('SearchKey', params.searchKey);
      }
      if (params?.pageNumber) {
        queryParams.append('PageNumber', params.pageNumber.toString());
      }
      if (params?.pageSize) {
        queryParams.append('PageSize', params.pageSize.toString());
      }
      
      const url = `/api/customer-potentials?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Validate response content before parsing JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response format: Expected JSON');
      }

      const responseText = await response.text();
      if (!responseText || responseText.trim() === '') {
        console.warn('Empty response received from customer potentials API');
        return []; // Return empty array instead of failing
      }

      let json;
      try {
        json = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse customer potentials response:', parseError);
        throw new Error('Invalid JSON response from server');
      }

      type Paginated<T> = {
        items: T[];
        pageNumber: number;
        totalPages: number;
        totalCount: number;
        hasPreviousPage: boolean;
        hasNextPage: boolean;
      };

      const result: Paginated<CustomerPotential> = json;
      const items = Array.isArray(result?.items) ? result.items : [];
      return items;
    } catch (error) {
      console.error('Failed to fetch customer potentials:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch customer potentials: ${error.message}`);
      }
      throw new Error('Failed to fetch customer potentials: Unknown error');
    }
  },

  async fetchCustomerPotentialsPaginated(params?: CustomerPotentialParams): Promise<PaginatedResponse<CustomerPotential>> {
    try {
      console.log('Fetching customer potentials with pagination...');

      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('_t', timestamp.toString());
      
      if (params?.searchKey) {
        queryParams.append('SearchKey', params.searchKey);
      }
      if (params?.pageNumber) {
        queryParams.append('PageNumber', params.pageNumber.toString());
      }
      if (params?.pageSize) {
        queryParams.append('PageSize', params.pageSize.toString());
      }
      if (params?.status) {
        queryParams.append('Status', params.status);
      }
      
      const url = `/api/customer-potentials?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        },
      });

      if (!response.ok) {
        const errorData = await safeErrorParse(response);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const parseResult = await safeJsonParse<PaginatedResponse<CustomerPotential>>(response);
      if (!parseResult.success) {
        throw new Error(`Failed to parse response: ${parseResult.error}`);
      }

      const json = parseResult.data!;
      
      // Ensure items is an array
      if (!json.items || !Array.isArray(json.items)) {
        json.items = [];
      }
      
      return json;
    } catch (error) {
      console.error('Failed to fetch customer potentials with pagination:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch customer potentials: ${error.message}`);
      }
      throw new Error('Failed to fetch customer potentials: Unknown error');
    }
  },

  async fetchCustomerDocuments(ssn: string, fundId: string, primeraOrderId: string): Promise<Blob[]> {
    try {
      console.log(`Fetching customer documents for SSN: ${ssn}, Fund ID: ${fundId}, Order ID: ${primeraOrderId}`);

      const response = await fetch(`/api/customer-documents/${ssn}?fundId=${fundId}&orderId=${primeraOrderId}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await safeErrorParse(response);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // The API now always returns JSON with base64 document(s)
      const parseResult = await safeJsonParse<any>(response);
      if (!parseResult.success) {
        throw new Error(`Failed to parse documents response: ${parseResult.error}`);
      }

      const jsonData = parseResult.data;
      
      if (jsonData.error) {
        throw new Error(jsonData.error);
      }

      // Convert base64 data to blobs
      const documents: Blob[] = [];
      
      // Handle different response formats
      if (Array.isArray(jsonData)) {
        // Multiple documents in array format
        for (const docData of jsonData) {
          const base64Content = docData.contentData || docData.content;
          if (base64Content && base64Content.trim()) {
            try {
              // Decode base64 to binary data
              const binaryString = atob(base64Content);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              const blob = new Blob([bytes], { type: 'application/pdf' });
              documents.push(blob);
            } catch (error) {
              console.error('Error decoding base64 document:', error);
            }
          }
        }
      } else if (jsonData.contentData && jsonData.contentData.trim()) {
        // Single document with contentData property
        try {
          const binaryString = atob(jsonData.contentData);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: 'application/pdf' });
          documents.push(blob);
        } catch (error) {
          console.error('Error decoding base64 document:', error);
          throw new Error('Invalid document format received');
        }
      } else if (jsonData.content && jsonData.content.trim()) {
        // Single document with content property (fallback)
        try {
          const binaryString = atob(jsonData.content);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: 'application/pdf' });
          documents.push(blob);
        } catch (error) {
          console.error('Error decoding base64 document:', error);
          throw new Error('Invalid document format received');
        }
      } else if (typeof jsonData === 'string' && jsonData.trim()) {
        // Single document as direct base64 string
        try {
          const binaryString = atob(jsonData);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: 'application/pdf' });
          documents.push(blob);
        } catch (error) {
          console.error('Error decoding base64 document:', error);
          throw new Error('Invalid document format received');
        }
      } else {
        throw new Error('No valid document data found in response');
      }

      console.log(`Successfully processed ${documents.length} document(s)`);
      return documents;
      
    } catch (error) {
      console.error('Failed to fetch customer documents:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch customer documents: ${error.message}`);
      }
      throw new Error('Failed to fetch customer documents: Unknown error');
    }
  },

  async exportToExcel(data: CustomerPotential[]): Promise<void> {
    try {
      // Create CSV content
      const headers = [
        'SSN', 'Client ID Primera', 'Primera Order ID', 'Risk Profile', 'Flow',
        'Status', 'Document Status', 'Fund ID', 'Date Inserted', 'Date Updated',
        'Transaction ID', 'Evrotrust Transaction ID', 'Is Group Of Documents',
        'Order ID', 'Amount To Invest', 'Currency Code', 'Debit Account',
        'Investment Account Code', 'Source Of Fund', 'Channel',
        'Payment Error Description', 'Application Code', 'Referral'
      ];

      const csvContent = [
        headers.join(','),
        ...data.map(row => [
          row.ssn,
          row.clientIdPrimera,
          row.primeraOrderId,
          row.riskProfile,
          row.flow,
          row.status,
          row.documentStatus,
          row.fundId,
          row.dateInserted,
          row.dateUpdated,
          row.transactionID,
          row.evrotrustTransactionId,
          row.isGroupOfDocuments ? 'Yes' : 'No',
          row.orderId,
          row.amountToInvest?.toFixed(2) || '0.00',
          row.currencyCode,
          row.debitAccount,
          row.investmentAccountCode,
          row.sourceOfFund,
          row.channel,
          row.paymentErrorDescription,
          row.applicationCode,
          row.referral
        ].map(field => `"${field || ''}"`).join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `customer-potentials-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to export to Excel:', error);
      throw new Error('Failed to export data');
    }
  }
};