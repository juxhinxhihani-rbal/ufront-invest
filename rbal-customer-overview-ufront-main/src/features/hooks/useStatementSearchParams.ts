import { addYears, format, isBefore, subMonths, subYears } from "date-fns";
import { useCallback } from "react";
import {
  useBranchesQuery,
  useCurrentBranchQuery,
  useUsersQuery,
} from "../dictionaries/dictionariesQueries";
import { useRetailAccountNumberListQuery } from "../retailAccount/retailAccountQueries";

export function useStatementSearchParams(
  customerId: string,
  midasDate: string
) {
  const currentBranchQuery = useCurrentBranchQuery();
  const branchesQuery = useBranchesQuery();
  const retailAccountNumberListQuery = useRetailAccountNumberListQuery(
    Number(customerId)
  );
  const usersQuery = useUsersQuery(
    currentBranchQuery.data?.branchId,
    Boolean(currentBranchQuery.data?.branchId)
  );

  const toDate = format(midasDate, "yyyy-MM-dd");
  const fromDate = format(subYears(midasDate, 1), "yyyy-MM-dd");
  const fromDateForOld = format(subMonths(midasDate, 13), "yyyy-MM-dd");
  const branches = branchesQuery?.data ?? [];
  const users = usersQuery?.data ?? [];
  const retailAccountNumbers = retailAccountNumberListQuery?.data;
  const isLoadingRetailAccountNumbers = retailAccountNumberListQuery?.isLoading;

  const calculateFromDate = useCallback(
    (accountId: number, isOldStatement: boolean): string => {
      if (isLoadingRetailAccountNumbers || !retailAccountNumbers) {
        return isOldStatement ? fromDateForOld : fromDate;
      }

      const selectedRetailAccount = retailAccountNumbers?.find(
        (item) => item.productId === accountId
      );

      if (isOldStatement) {
        return format(
          selectedRetailAccount?.openDate ?? new Date(),
          "yyyy-MM-dd"
        );
      }
      const compareDate = addYears(new Date(toDate), -1);
      const createDateValue = new Date(selectedRetailAccount?.openDate ?? "");

      return isBefore(createDateValue, compareDate)
        ? fromDate
        : format(selectedRetailAccount?.openDate ?? new Date(), "yyyy-MM-dd");
    },
    [
      isLoadingRetailAccountNumbers,
      retailAccountNumbers,
      fromDate,
      fromDateForOld,
      toDate,
    ]
  );

  return {
    toDate,
    branches,
    retailAccountNumbers,
    isLoadingRetailAccountNumbers,
    users,
    calculateFromDate,
  };
}
