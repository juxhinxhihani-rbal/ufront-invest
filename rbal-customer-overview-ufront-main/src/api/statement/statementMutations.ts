import { HttpClientError } from "@rbal-modern-luka/luka-portal-shell";
import { useMutation } from "react-query";
import {
  fetchGenerateStatement,
  fetchStatementCommission,
  generateOldStatement,
  getOldStatementPdf,
} from "./statementApi";
import {
  GenerateOldStatementDto,
  GenerateOldStatementResponseDto,
  GenerateStatementResponseDto,
  StatementComissionResponseDto,
  StatementFormFilterParams,
  GenerateOldStatementPdfResponseDto,
  GetOldStatementPdfDto,
} from "./statementApi.types";

export function useGenerateStatement() {
  return useMutation<
    GenerateStatementResponseDto,
    HttpClientError,
    { filters: StatementFormFilterParams; isSendEmail: boolean }
  >({
    mutationFn: ({ filters, isSendEmail }) =>
      fetchGenerateStatement(filters, isSendEmail),
  });
}

export function useGetStatementComission() {
  return useMutation<
    StatementComissionResponseDto,
    HttpClientError,
    { filters: StatementFormFilterParams; isOldStatement: boolean }
  >({
    mutationFn: ({ filters, isOldStatement }) =>
      fetchStatementCommission(filters, isOldStatement),
  });
}

export function useGenerateOldStatement() {
  return useMutation<
    GenerateOldStatementResponseDto,
    HttpClientError,
    GenerateOldStatementDto
  >({
    mutationFn: (filters) => generateOldStatement(filters),
  });
}
export function useGenerateOldStatementPdf() {
  return useMutation<
    GenerateOldStatementPdfResponseDto,
    HttpClientError,
    GetOldStatementPdfDto
  >({
    mutationFn: (filters) => getOldStatementPdf(filters),
  });
}
