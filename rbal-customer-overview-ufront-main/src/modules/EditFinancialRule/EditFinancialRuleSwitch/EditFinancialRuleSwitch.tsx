import { Stack, StepperContext } from "@rbal-modern-luka/ui-library";
import { useCallback, useContext } from "react";
import { FormProvider } from "react-hook-form";
import { ChooseRule } from "../ChooseRule/ChooseRule";
import { ConfigureData } from "../ConfigureData/ConfigureData";
import { FinancialRuleContext } from "../context/FinancialRuleContext";
import { SelectAccount } from "../SelectAccount/SelectAccount";
import { EditFinancialRuleSteps } from "../types";
import { useEditFinancialRuleSwitch } from "./useEditFinancialRuleSwitch";

export const EditFinancialRuleSwitch = () => {
  const { activeStepIdx } = useContext(StepperContext);
  const { editFinancialRulesForm, setSelectedRuleId } =
    useEditFinancialRuleSwitch();

  const renderContent = useCallback(() => {
    switch (activeStepIdx) {
      case EditFinancialRuleSteps.ChooseRule:
        return <ChooseRule />;
      case EditFinancialRuleSteps.SelectAccount:
        return <SelectAccount />;
      case EditFinancialRuleSteps.Configure:
        return <ConfigureData />;
      case EditFinancialRuleSteps.Review:
        return null;
      case EditFinancialRuleSteps.Summary:
        return null;
      default:
        return null;
    }
  }, [activeStepIdx]);

  return (
    <Stack gap="24">
      <FinancialRuleContext.Provider value={{ setSelectedRuleId }}>
        <FormProvider {...editFinancialRulesForm}>
          {renderContent()}
        </FormProvider>
      </FinancialRuleContext.Provider>
    </Stack>
  );
};
