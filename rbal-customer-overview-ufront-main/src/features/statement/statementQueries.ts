import { HttpClientError } from "@rbal-modern-luka/luka-portal-shell";
import { useCallback } from "react";
import { useQuery } from "react-query";
import {
  fetchCheckIdExpireDate,
  fetchStatementList,
} from "~/api/statement/statementApi";
import {
  StatementFormFilterParams,
  StatementListResponse,
  ValidationResponseDto,
} from "~/api/statement/statementApi.types";

export function useStatementListQuery(
  filters: StatementFormFilterParams,
  isOldStatement: boolean
) {
  const isFiltersValid = !!(
    isOldStatement ||
    (filters.fromDate && filters.toDate && !isOldStatement)
  );

  const query = useQuery<StatementListResponse, HttpClientError>(
    ["StatementList", filters],
    () => fetchStatementList(filters, isOldStatement),
    { enabled: isFiltersValid, refetchOnWindowFocus: false, retry: 1 }
  );
  const data = query.data?.response ?? [];
  const isDataEmpty = data.length === 0;

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, isDataEmpty, refresh };
}

export function useCheckIdExpireDateQuery(partyId: number) {
  return useQuery<ValidationResponseDto, HttpClientError>(
    ["CheckIdExpireDate", partyId],
    () => fetchCheckIdExpireDate(partyId),
    { refetchOnWindowFocus: false, retry: 1 }
  );
}
