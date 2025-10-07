import { useMemo, useState } from "react";

interface UseSelectAccountsProps<T, K extends string | number> {
  accounts: T[];
  getId: (account: T) => K;
}

export const useSelectAccounts = <T, K extends string | number>({
  accounts,
  getId,
}: UseSelectAccountsProps<T, K>) => {
  const [selectedIds, setSelectedIds] = useState<K[]>([]);

  const toggleSelectAccount = (id: K) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const isAccountSelected = (id: K) => selectedIds.includes(id);

  const isAllAccountsSelected = useMemo(
    () => accounts.length > 0 && selectedIds.length === accounts.length,
    [accounts, selectedIds]
  );

  const toggleSelectAllAccounts = () => {
    setSelectedIds(isAllAccountsSelected ? [] : accounts.map(getId));
  };

  return {
    selectedIds,
    toggleSelectAccount,
    isAccountSelected,
    isAllAccountsSelected,
    toggleSelectAllAccounts,
  };
};
