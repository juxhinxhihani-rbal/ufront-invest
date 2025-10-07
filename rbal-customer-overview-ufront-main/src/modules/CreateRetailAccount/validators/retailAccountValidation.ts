import { TrFunction } from "@rbal-modern-luka/luka-portal-shell";
import * as yup from "yup";
import { editCustomerErrorsI18n } from "~/modules/EditCustomer/Translations/EditCustomerErrors.i18n";

export const getRetailAccountValidation = (tr: TrFunction) => {
  return yup.object({
    productId: yup.string().required(tr(editCustomerErrorsI18n.requiredField)),
    currencyCode: yup
      .string()
      .typeError(tr(editCustomerErrorsI18n.requiredField)),
  });
};
