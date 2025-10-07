import { StepperContext } from "@rbal-modern-luka/ui-library";
import { useContext } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useFinancialRuleBandsQuery } from "~/features/roundUpAccount/roundUpAccountQueries";
import { EditFinancialRulesForm } from "../../EditFinancialRuleSwitch/types";

export const useRoundsupCardsConfig = () => {
  const {
    control,
    formState: { errors },
    register,
    handleSubmit,
  } = useFormContext<EditFinancialRulesForm>();
  const { gotoNextStep } = useContext(StepperContext);
  const financialRuleId = useWatch({ control, name: "ruleId" });
  const { data: financialRuleBands, isFetching: isFetchingRuleBands } =
    useFinancialRuleBandsQuery(financialRuleId);

  const onContinue = () => {
    gotoNextStep();
  };

  return {
    control,
    errors,
    financialRuleBands,
    isFetching: isFetchingRuleBands,
    register,
    handleSubmit,
    onContinue,
  };
};
