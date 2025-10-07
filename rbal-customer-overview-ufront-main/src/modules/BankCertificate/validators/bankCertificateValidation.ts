import { TrFunction } from "@rbal-modern-luka/luka-portal-shell";
import * as yup from "yup";
import { bankCertificateI18n } from "../BankCertificatePage.i18n";

export const bankCertificateValidation = (tr: TrFunction) => {
  return yup.object({
    paymentAccountId: yup.number().notRequired(),
    certificateTypeId: yup
      .number()
      .required(tr(bankCertificateI18n.requiredField)),
    addressedToId: yup.number().required(tr(bankCertificateI18n.requiredField)),
    branchAuthorizer: yup.string().notRequired(),
    notes: yup.string().notRequired(),
  });
};
