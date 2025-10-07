import { HttpClientError } from "@rbal-modern-luka/luka-portal-shell";
import { useQuery } from "react-query";
import {
  FetchFinancialRulesResponse,
  FinanciallyAutoAccount,
  FinancialRuleBands,
} from "~/api/roundUpAccount/roundUpAccount.types";
import {
  fetchCustomerFinanciallyAutoAccounts,
  fetchFinancialRuleBands,
  fetchFinancialRules,
} from "~/api/roundUpAccount/roundUpAccountApi";

export const useCutomerFinanciallyAutoAccountsQuery = (ssn: string) => {
  return useQuery<FinanciallyAutoAccount[], HttpClientError>(
    ["FinanciallyAutoAccountsList", ssn],
    () => fetchCustomerFinanciallyAutoAccounts(ssn),
    { refetchOnWindowFocus: false, retry: 1, enabled: Boolean(ssn) }
  );
};

export const useFinancialRulesQuery = () => {
  return useQuery<FetchFinancialRulesResponse[], HttpClientError>(
    "FinancialRules",
    () => fetchFinancialRules(),
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};

export const useFinancialRuleBandsQuery = (ruleId: number) => {
  return useQuery<FinancialRuleBands[], HttpClientError>(
    ["FinancialRuleBands", ruleId],
    () => fetchFinancialRuleBands(ruleId),
    {
      refetchOnWindowFocus: false,
      retry: 1,
      enabled: Boolean(ruleId),
    }
  );
};
