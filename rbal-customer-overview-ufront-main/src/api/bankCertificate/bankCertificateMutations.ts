import { HttpClientError } from "@rbal-modern-luka/luka-portal-shell";
import { useMutation } from "react-query";
import { bankCertificateCommission } from "./bankCertificateApi";
import { BankCertificateCommissionResponse } from "./bankCertificateApi.types";

export function useBankCertificateCommission() {
  return useMutation<
    BankCertificateCommissionResponse,
    HttpClientError,
    { productId: number; reportId: number }
  >({
    mutationFn: ({ productId, reportId }) =>
      bankCertificateCommission(productId, reportId),
  });
}
