
interface ExchangeRate {
  currencyType: string;
  code: string;
  buyInLeke: number;
  sellInLeke: number;
  average: number;
  trendBuy: 'UP' | 'DOWN' | 'SAME';
  trendSell: 'UP' | 'DOWN' | 'SAME';
  trendAvg: 'UP' | 'DOWN' | 'SAME';
}

interface ApiResponse {
  individualRates: ExchangeRate[];
  businessRates: ExchangeRate[];
  lastUpdate: string;
}

export const ExchangeRateService = {
  async fetchExchangeRates(): Promise<ApiResponse> {
    try {
      console.log('Fetching exchange rates...');

      const response = await fetch('/api/exchange-rates', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();

        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error);
        } catch (parseError) {
          throw new Error(errorText);
        }
      }

      // Get response as text first to log it
      const responseText = await response.text();

      // Parse the JSON
      const data = JSON.parse(responseText);

      return data;
    } catch (error) {
      console.error('Failed to get exchange rates:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to get exchange rates!`);
      }
      throw new Error('Failed to get exchange rates: Unknown error');
    }
  },

  async insertExchangeRates(file: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/exchange-rates', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        } catch (parseError) {
          throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
        }
      }

      const responseText = await response.text();
      const data = JSON.parse(responseText);

      return data;
    } catch (error) {
      console.error('Failed to insert exchange rates:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to insert exchange rates: ${error.message}`);
      }
      throw new Error('Failed to insert exchange rates: Unknown error');
    }
  }
}

export type { ExchangeRate, ApiResponse };