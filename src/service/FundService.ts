export type FundDto = {
  id: number;
  PrimeraFundId: string; // mapped from API 'primeraFundId' (string)
  Name: string;
  Code: string;
  Account: string;
  InsertDate: string;
  IsActive: boolean;
  // some backends return percentages as strings like "1%"; allow both
  ExitFee: number | string;
  MinAmountNew: number;
  MinimumInvestmentPeriodInYears: number;
  OngoingCharges: number | string;
  RiskLevelAL: string;
  RiskLevelEN: string;
  Currency: string;
  MinAmountExisting: number;
  MaxTransactionAmountLimit: number;
  [key: string]: any;
};

export const FundService = {
  async fetchFunds(): Promise<FundDto[]> {
    // Always use API route for funds
    const url = '/api/funds';

    const parsePercent = (v: any) => {
      if (v == null) return 0;
      if (typeof v === 'number') return v;
      const s = String(v).replace('%', '').replace(',', '.');
      const n = parseFloat(s);
      return isNaN(n) ? v : n;
    };

    try {
      const res = await fetch(url, {
        method: 'GET',
        // avoid any browser or intermediate caching for fund list requests
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      });

      if (!res.ok) {
        const text = await res.text();
        try {
          const json = JSON.parse(text);
          throw new Error(json.error || `HTTP ${res.status}`);
        } catch {
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
      }

  const text = await res.text();
  const apiData = text ? JSON.parse(text) : [];

      // Map backend fields to FundDto expected by the UI
      const mapped: FundDto[] = Array.isArray(apiData)
        ? apiData.map((a: any) => ({
            id: a.id,
            PrimeraFundId: String(a.primeraFundId ?? ''),
            Name: a.name ?? '',
            Code: a.code ?? '',
            Account: a.account ?? '',
            InsertDate: a.insertDate ?? a.insertDateUtc ?? '',
            IsActive: !!a.isActive,
            ExitFee: parsePercent(a.exitFee),
            MinAmountNew: a.minAmountNew ?? 0,
            MinimumInvestmentPeriodInYears: a.minimumInvestmentPeriodInYears ?? 0,
            OngoingCharges: parsePercent(a.ongoingCharges),
            RiskLevelAL: a.riskLevelAL ?? a.riskLevel ?? '',
            RiskLevelEN: a.riskLevelEN ?? a.riskLevel ?? '',
            Currency: a.currency ?? '',
            MinAmountExisting: a.minAmountExisting ?? 0,
            MaxTransactionAmountLimit: a.maxTransactionAmountLimit ?? 0,
            __raw: a,
          }))
        : [];

      return mapped;
    } catch (error) {
      console.error('FundService.fetchFunds error:', error);
      throw error;
    }
  },

  async updateFund(id: number, payload: Partial<FundDto>): Promise<FundDto> {
    // Always use API route for update
    const url = `/api/funds?id=${id}`;
    
    const makePercentString = (v: any) => {
      if (v == null) return undefined;
      if (typeof v === 'number') return `${v}%`;
      return String(v);
    };

    const body: any = {
      isActive: payload.IsActive,
      exitFee: makePercentString(payload.ExitFee),
      minAmountNew: payload.MinAmountNew,
      minimumInvestmentPeriodInYears: payload.MinimumInvestmentPeriodInYears,
      ongoingCharges: makePercentString(payload.OngoingCharges),
      riskLevelAL: payload.RiskLevelAL,
      riskLevelEN: payload.RiskLevelEN,
      currency: payload.Currency,
      minAmountExisting: payload.MinAmountExisting,
      maxTransactionAmountLimit: payload.MaxTransactionAmountLimit,
    };
    
    
    try {
      const res = await fetch(url, {
        method: 'PUT',
        // ensure we bypass any caches for this update call
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body),
      });
      
      console.log(res);
      
      if (!res.ok) {
        const text = await res.text();
        try {
          const json = JSON.parse(text);
          throw new Error(json.error || `HTTP ${res.status}`);
        } catch {
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
      }

      const text = await res.text();
      const apiObj = text ? JSON.parse(text) : null;

      // map response back to FundDto shape
      const updated: FundDto = {
        id: apiObj?.id ?? (payload as any)?.id ?? id,
        PrimeraFundId: String(apiObj?.primeraFundId ?? apiObj?.id ?? payload.PrimeraFundId ?? ''),
        Name: apiObj?.name ?? payload.Name ?? '',
        Code: apiObj?.code ?? payload.Code ?? '',
        Account: apiObj?.account ?? payload.Account ?? '',
        InsertDate: apiObj?.insertDate ?? payload.InsertDate ?? '',
        IsActive: apiObj?.isActive ?? payload.IsActive ?? false,
        ExitFee: apiObj?.exitFee ?? payload.ExitFee,
        MinAmountNew: apiObj?.minAmountNew ?? payload.MinAmountNew ?? 0,
        MinimumInvestmentPeriodInYears: apiObj?.minimumInvestmentPeriodInYears ?? payload.MinimumInvestmentPeriodInYears ?? 0,
        OngoingCharges: apiObj?.ongoingCharges ?? payload.OngoingCharges,
        RiskLevelAL: apiObj?.riskLevelAL ?? payload.RiskLevelAL ?? '',
        RiskLevelEN: apiObj?.riskLevelEN ?? payload.RiskLevelEN ?? '',
        Currency: apiObj?.currency ?? payload.Currency ?? '',
        MinAmountExisting: apiObj?.minAmountExisting ?? payload.MinAmountExisting ?? 0,
        MaxTransactionAmountLimit: apiObj?.maxTransactionAmountLimit ?? payload.MaxTransactionAmountLimit ?? 0,
        __raw: apiObj,
      };

      return updated;
    } catch (error) {
      console.error('FundService.updateFund error:', error);
      throw error;
    }
  },
};

export default FundService;
