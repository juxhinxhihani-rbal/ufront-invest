import { useMemo, useState } from "react";
import { BankCertificateAccount } from "~/api/bankCertificate/bankCertificateApi.types";

interface UseSelectAccountsArgs {
  accounts: BankCertificateAccount[];
}

export const useSelectAccounts = ({ accounts }: UseSelectAccountsArgs) => {
  const [selectedAccountNumbers, setSelectedAccountNumbers] = useState<
    string[]
  >([]);

  const toggleSelectAccount = (accountNumber: string) => {
    setSelectedAccountNumbers((prevSelected) =>
      prevSelected.includes(accountNumber)
        ? prevSelected.filter((num) => num !== accountNumber)
        : [...prevSelected, accountNumber]
    );
  };

  const isAccountSelected = (accountNumber: string) =>
    selectedAccountNumbers.some(
      (activeAccountNumber) => activeAccountNumber === accountNumber
    );

  const isAllAccountsSelected = useMemo(
    () =>
      accounts.length > 0 && selectedAccountNumbers.length === accounts.length,
    [accounts, selectedAccountNumbers]
  );

  const toggleSelectAllAccounts = () => {
    setSelectedAccountNumbers(
      isAllAccountsSelected ? [] : accounts.map((acc) => acc.retailAccount)
    );
  };

  return {
    selectedAccountNumbers,
    toggleSelectAccount,
    isAccountSelected,
    isAllAccountsSelected,
    toggleSelectAllAccounts,
  };
};
