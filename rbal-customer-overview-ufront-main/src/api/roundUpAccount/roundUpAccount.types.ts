export type AccountItem = {
  paymentCategory: string | null;
  contractNumber: string | null;
  personalNumber: string;
  creditAccountNumber: string;
  debitAccountNumber: string;
  bandValue: string;
  bandId: number;
  roundUpDate: string;
  amountOfSalary: string | null;
  currency: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  active: boolean;
};

export type FinanciallyAutoAccount = {
  ruleId: number;
  ruleName: string;
  ruleAccounts: AccountItem[];
};

export type FetchFinancialRulesResponse = {
  id: number;
  name: string;
};

export type FetchFinancialRuleBandsResponse = {
  id: number;
  value: string;
};

export type FinancialRuleBands = {
  id: number;
  name: string;
};
