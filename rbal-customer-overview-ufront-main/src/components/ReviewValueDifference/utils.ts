/* eslint-disable @typescript-eslint/no-unused-vars */
import { editCustomerValuesI18n } from "~/modules/EditCustomer/Translations/EditCustomerValues.i18n";

export const getLabel = (key: string) => {
  //tab.segment.field
  const keySplit = key.split(".");
  const field = keySplit[keySplit.length - 1];
  return Object.prototype.hasOwnProperty.call(editCustomerValuesI18n, field)
    ? editCustomerValuesI18n[field as keyof typeof editCustomerValuesI18n]
    : editCustomerValuesI18n.default;
};
