import { TrFunction } from "@rbal-modern-luka/luka-portal-shell";
import { isAfter, parse } from "date-fns";
import * as yup from "yup";
import { reverseHeldItemI18n } from "../HeldItem/ReverseHeldItem/ReverseHeldItem.i18n";
import { manageAccountsViewI18n } from "../ManageAccounts.i18n";

export const blockInputRequestValidation = (tr: TrFunction) => {
  return yup.object({
    blockActionId: yup.number().required(manageAccountsViewI18n.requiredField),
    blockAuthority: yup.string().notRequired(),
    blockingOrder: yup
      .string()
      .required(tr(manageAccountsViewI18n.requiredField)),
    blockStartDate: yup
      .string()
      .required(tr(manageAccountsViewI18n.requiredField)),
    blockEndDate: yup
      .string()
      .required()
      .test("is-end-date-after-start-date", function (blockEndDate) {
        const { blockStartDate } = this.parent;
        if (!blockStartDate || !blockEndDate) {
          return true;
        }

        const parsedStartDate = parse(blockStartDate, "yyyy-MM-dd", new Date());
        const parsedEndDate = parse(blockEndDate, "yyyy-MM-dd", new Date());

        return isAfter(parsedEndDate, parsedStartDate);
      }),
    blockDescription: yup
      .string()
      .required(tr(manageAccountsViewI18n.requiredField)),
  });
};

export const unblockInputRequestValidation = (tr: TrFunction) => {
  return yup.object({
    unblockActionId: yup
      .number()
      .required(manageAccountsViewI18n.requiredField),
    unblockingOrder: yup
      .string()
      .required(tr(manageAccountsViewI18n.requiredField)),
    unblockDescription: yup
      .string()
      .required(tr(manageAccountsViewI18n.requiredField)),
  });
};

export const reverseHeldItemRequestValidation = (tr: TrFunction) => {
  return yup.object({
    amEmail: yup
      .string()
      .matches(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/, {
        message: tr(reverseHeldItemI18n.emailError),
        excludeEmptyString: true,
      })
      .notRequired(),
    isTemporary: yup.boolean().notRequired(),
    isCardUnitNotification: yup.boolean().notRequired(),
    reverseDescription: yup
      .string()
      .required(tr(manageAccountsViewI18n.requiredField)),
  });
};
