import { HttpClientError } from "@rbal-modern-luka/luka-portal-shell";
import { useCallback } from "react";
import { useQuery } from "react-query";
import {
  fetchBankCertificateAccounts,
  fetchBankCertificateCommissionAccounts,
} from "~/api/bankCertificate/bankCertificateApi";
import { BankCertificateAccount } from "~/api/bankCertificate/bankCertificateApi.types";

export function useBankCertificateAccountsQuery(customerId?: string) {
  const query = useQuery<BankCertificateAccount[], HttpClientError>(
    ["BankCertificateAccount", customerId],
    () => fetchBankCertificateAccounts(customerId),
    { refetchOnWindowFocus: false, retry: 1, enabled: Boolean(customerId) }
  );

  const isDataEmpty = query.data?.length === 0;

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, isDataEmpty, refresh };
}

export function useBankCertificateCommissionAccountsQuery(customerId?: string) {
  return useQuery<BankCertificateAccount[], HttpClientError>(
    ["BankCertificateCommissionAccount", customerId],
    () => fetchBankCertificateCommissionAccounts(customerId),
    { refetchOnWindowFocus: false, retry: 1, enabled: Boolean(customerId) }
  );
}
