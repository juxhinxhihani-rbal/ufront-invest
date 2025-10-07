import {
  advisedFetch,
  jsonErrorHandler,
} from "@rbal-modern-luka/luka-portal-shell";
import {
  BankCertificateAccount,
  BankCertificateCommissionResponse,
} from "./bankCertificateApi.types";

export function bankCertificateCommission(
  productId: number,
  reportId: number
): Promise<BankCertificateCommissionResponse> {
  return advisedFetch(
    `/api/customer-overview/bankStatements/${reportId}/${productId}/process-commission`,
    {
      method: "POST",
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}

export function fetchBankCertificateAccounts(
  customerId?: string
): Promise<BankCertificateAccount[]> {
  return advisedFetch(
    `/api/customer-overview/bankStatements/${customerId}/accounts`
  ).then(jsonErrorHandler());
}

export function fetchBankCertificateCommissionAccounts(
  customerId?: string
): Promise<BankCertificateAccount[]> {
  return advisedFetch(
    `/api/customer-overview/bankStatements/${customerId}/commission/accounts`
  ).then(jsonErrorHandler());
}
