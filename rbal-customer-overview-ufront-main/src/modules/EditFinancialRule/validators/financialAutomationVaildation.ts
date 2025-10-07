import { TrFunction } from "@rbal-modern-luka/luka-portal-shell";
import * as yup from "yup";
import { financialAutomationErrorsI18n } from "./financialAutomationErrors.i18n";

export const getDebitCardRuleSchema = (tr: TrFunction) => {
  return yup.object().shape({
    ruleId: yup.number().required(),
    cardsRoundUp: yup.object().shape({
      debitAccountId: yup.number().required(),
      savingAccountId: yup.number().required(),
      bandId: yup
        .number()
        .required(tr(financialAutomationErrorsI18n.requiredRoundupBand)),
      currency: yup
        .string()
        .required(tr(financialAutomationErrorsI18n.requiredRoundupCurrency)),
    }),
  });
};
