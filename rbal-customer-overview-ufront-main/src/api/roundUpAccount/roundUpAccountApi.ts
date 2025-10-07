import {
  advisedFetch,
  jsonErrorHandler,
} from "@rbal-modern-luka/luka-portal-shell";
import {
  FetchFinancialRuleBandsResponse,
  FetchFinancialRulesResponse,
  FinanciallyAutoAccount,
} from "./roundUpAccount.types";
import { financialRuleBandsMapper } from "./roundUpAccountMappers";

export const fetchCustomerFinanciallyAutoAccounts = (
  ssn: string
): Promise<FinanciallyAutoAccount[]> => {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/RoundUp/customer/${ssn}/rules`
  ).then(jsonErrorHandler<FinanciallyAutoAccount[]>());
};

export const fetchFinancialRules = () => {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/RoundUp/rules`
  ).then(jsonErrorHandler<FetchFinancialRulesResponse[]>());
};

export const fetchFinancialRuleBands = (ruleId: number) => {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/RoundUp/band/${ruleId}`
  )
    .then(jsonErrorHandler<FetchFinancialRuleBandsResponse[]>())
    .then((data) => financialRuleBandsMapper(data));
};
