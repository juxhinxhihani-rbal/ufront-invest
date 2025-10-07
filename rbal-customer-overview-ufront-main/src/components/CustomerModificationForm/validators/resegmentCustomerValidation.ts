import { TrFunction } from "@rbal-modern-luka/luka-portal-shell";
import * as yup from "yup";
import { editCustomerErrorsI18n } from "~/modules/EditCustomer/Translations/EditCustomerErrors.i18n";

export const validateResegmentCustomer = (tr: TrFunction) => {
  return yup.object().shape({
    customerInformation: yup.object().shape({
      mainSegmentId: yup
        .number()
        .typeError(tr(editCustomerErrorsI18n.requiredField)),
      customerSegmentId: yup
        .number()
        .typeError(tr(editCustomerErrorsI18n.requiredField)),
    }),
  });
};
