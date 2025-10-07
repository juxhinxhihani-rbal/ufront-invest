import { useFormContext, useWatch } from "react-hook-form";
import { EditFinancialRulesForm } from "../EditFinancialRuleSwitch/types";
import { FinancialRuleType } from "../types";
import { RoundupCardsSelectAccounts } from "./RoundupCardsSelectAccount/RoundupCardsSelectAccounts";

const contentMap: Record<FinancialRuleType, () => React.JSX.Element> = {
  [FinancialRuleType.DebitCardPayment]: RoundupCardsSelectAccounts,
  [FinancialRuleType.SalarySavings]: () => <></>,
  [FinancialRuleType.AccountBalance]: () => <></>,
  [FinancialRuleType.EachTransaction]: () => <></>,
  [FinancialRuleType.UtilityPayments]: () => <></>,
};

export const SelectAccount = () => {
  const { control } = useFormContext<EditFinancialRulesForm>();
  const financialRuleId = useWatch({ control, name: "ruleId" });
  const Component = contentMap[financialRuleId as FinancialRuleType];

  return <Component />;
};
