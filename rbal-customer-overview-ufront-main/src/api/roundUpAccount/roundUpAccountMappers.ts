import {
  FetchFinancialRuleBandsResponse,
  FinancialRuleBands,
} from "./roundUpAccount.types";

export const financialRuleBandsMapper = (
  data: FetchFinancialRuleBandsResponse[]
): FinancialRuleBands[] => {
  return data.map((item) => ({
    id: item.id,
    name: item.value,
  }));
};
