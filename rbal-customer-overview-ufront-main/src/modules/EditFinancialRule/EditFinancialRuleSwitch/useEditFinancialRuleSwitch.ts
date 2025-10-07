import { yupResolver } from "@hookform/resolvers/yup";
import { TrFunction, useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { FinancialRuleType } from "../types";
import { getDebitCardRuleSchema } from "../validators/financialAutomationVaildation";
import { EditFinancialRulesForm } from "./types";
import * as yup from "yup";

const validationSchemas: Record<
  FinancialRuleType,
  (tr: TrFunction) => yup.ObjectSchema<yup.AnyObject>
> = {
  [FinancialRuleType.DebitCardPayment]: getDebitCardRuleSchema,
  [FinancialRuleType.SalarySavings]: () => yup.object().shape({}),
  [FinancialRuleType.AccountBalance]: () => yup.object().shape({}),
  [FinancialRuleType.EachTransaction]: () => yup.object().shape({}),
  [FinancialRuleType.UtilityPayments]: () => yup.object().shape({}),
};

export const useEditFinancialRuleSwitch = () => {
  const { tr } = useI18n();
  const [selectedRuleId, setSelectedRuleId] =
    useState<FinancialRuleType | null>(null);

  const editFinancialRulesForm = useForm<EditFinancialRulesForm>({
    resolver: selectedRuleId
      ? (yupResolver(
          validationSchemas[selectedRuleId as FinancialRuleType](tr)
        ) as unknown as Resolver<EditFinancialRulesForm>)
      : undefined,
    reValidateMode: "onChange",
    mode: "onSubmit",
  });

  return { editFinancialRulesForm, setSelectedRuleId };
};
