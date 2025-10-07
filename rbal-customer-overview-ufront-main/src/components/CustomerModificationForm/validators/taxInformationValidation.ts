import { TrFunction } from "@rbal-modern-luka/luka-portal-shell";
import * as yup from "yup";
import { editCustomerErrorsI18n } from "~/modules/EditCustomer/Translations/EditCustomerErrors.i18n";

export const getTaxInformationValidation = (tr: TrFunction) => {
  return yup.object().shape({
    countryId: yup.number().required(tr(editCustomerErrorsI18n.requiredField)),
    crsTaxResidenceId: yup
      .number()
      .required(tr(editCustomerErrorsI18n.requiredField)),
    residenceTin: yup
      .string()
      .required(tr(editCustomerErrorsI18n.requiredField)),
  });
};
