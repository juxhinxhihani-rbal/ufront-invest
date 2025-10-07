import { createContext } from "react";
import { FinancialRuleType } from "../types";

export type FinancialRuleContextType = {
  setSelectedRuleId: (ruleId: FinancialRuleType) => void;
};

export const FinancialRuleContext = createContext(
  {} as FinancialRuleContextType
);
