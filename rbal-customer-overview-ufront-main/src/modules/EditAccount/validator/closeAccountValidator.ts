import { TrFunction } from "@rbal-modern-luka/luka-portal-shell";
import * as yup from "yup";
import { editAccountViewI18n } from "../EditAccountView.i18n";

export const validateCloseAccount = (tr: TrFunction) => {
  return yup.object({
    accountClosureReasons: yup.object({
      reasonId: yup
        .number()
        .required(tr(editAccountViewI18n.validationError.closingReasonError)),
    }),
    accountCommissions: yup.object({
      maintainance: yup
        .number()
        .test(
          "is-zero",
          tr(editAccountViewI18n.validationError.maintainanceError),
          (value) => value === 0
        ),
      minimumBalance: yup
        .number()
        .test(
          "is-zero",
          tr(editAccountViewI18n.validationError.minimumBalanceError),
          (value) => value === 0
        ),
      closeCommission: yup
        .number()
        .test(
          "is-zero",
          tr(editAccountViewI18n.validationError.closeCommissionError),
          (value) => value === 0
        ),
      accountToPostInterest: yup
        .string()
        .notRequired()
        .test(
          "is-empty",
          tr(editAccountViewI18n.validationError.accountToPostInterestError),
          (value) => value === "" || value === null || value === undefined
        ),
    }),
  });
};

export const updateAccountValidationSchema = yup.object().shape({});
