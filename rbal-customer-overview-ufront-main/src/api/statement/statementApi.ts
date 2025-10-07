import {
  advisedFetch,
  jsonErrorHandler,
} from "@rbal-modern-luka/luka-portal-shell";
import {
  GenerateOldStatementDto,
  GenerateOldStatementResponseDto,
  GenerateStatementResponseDto,
  StatementComissionResponseDto,
  StatementFormFilterParams,
  StatementListResponse,
  ValidationResponseDto,
  GetOldStatementPdfDto,
  GenerateOldStatementPdfResponseDto,
} from "./statementApi.types";

export function fetchStatementList(
  filters: StatementFormFilterParams,
  isOldStatement: boolean
): Promise<StatementListResponse> {
  const params = new URLSearchParams();
  if (filters.retailAccountNumberId) {
    params.append("AccountNumber", filters.retailAccountNumberId.toString());
  }
  if (filters.fromDate) {
    params.append("FromDate", filters.fromDate);
  }
  if (filters.toDate) params.append("ToDate", filters.toDate);
  if (filters.userId !== undefined)
    params.append("UserId", filters.userId.toString());
  if (filters.branchId !== undefined)
    params.append("BranchId", filters.branchId.toString());
  if (filters.pageNumber !== undefined)
    params.append("PageNumber", filters.pageNumber.toString());
  if (filters.authorizedPersonId !== undefined)
    params.append("AuthorizedPersonId", filters.authorizedPersonId.toString());

  params.append("IsOldStatement", isOldStatement.toString());

  return advisedFetch(`/api/customer-overview/statement?${params.toString()}`)
    .then(jsonErrorHandler<StatementListResponse>())
    .then((json) => json);
}

export function fetchGenerateStatement(
  filters: StatementFormFilterParams,
  isSendEmail: boolean
): Promise<GenerateStatementResponseDto> {
  const params = new URLSearchParams();
  if (isSendEmail) {
    params.append("SendEmail", isSendEmail.toString());
  }
  if (filters.retailAccountNumberId) {
    params.append("AccountNumber", filters.retailAccountNumberId.toString());
  }
  if (filters.fromDate) {
    params.append("FromDate", filters.fromDate);
  }
  if (filters.toDate) params.append("ToDate", filters.toDate);
  if (filters.userId !== undefined)
    params.append("UserId", filters.userId.toString());
  if (filters.branchId !== undefined)
    params.append("BranchId", filters.branchId.toString());
  if (filters.pageNumber !== undefined)
    params.append("PageNumber", filters.pageNumber.toString());
  if (filters.authorizedPersonId !== undefined)
    params.append("AuthorizedPersonId", filters.authorizedPersonId.toString());

  return advisedFetch(
    `/api/customer-overview/statement/GenerateStatement?${params.toString()}`
  )
    .then(jsonErrorHandler<GenerateStatementResponseDto>())
    .then((json) => json);
}

export function fetchStatementCommission(
  filters: StatementFormFilterParams,
  isOldStatement: boolean
): Promise<StatementComissionResponseDto> {
  const params = new URLSearchParams();
  if (filters.retailAccountNumberId) {
    params.append("AccountNumber", filters.retailAccountNumberId.toString());
  }
  if (filters.fromDate) {
    params.append("FromDate", filters.fromDate);
  }
  if (filters.toDate) params.append("ToDate", filters.toDate);
  if (filters.userId !== undefined)
    params.append("UserId", filters.userId.toString());
  if (filters.branchId !== undefined)
    params.append("BranchId", filters.branchId.toString());
  if (filters.pageNumber !== undefined)
    params.append("PageNumber", filters.pageNumber.toString());
  if (filters.authorizedPersonId !== undefined)
    params.append("AuthorizedPersonId", filters.authorizedPersonId.toString());

  params.append("IsOldStatement", isOldStatement.toString());

  return advisedFetch(
    `/api/customer-overview/statement/commission?${params.toString()}`
  ).then(jsonErrorHandler<StatementComissionResponseDto>());
}

export function fetchCheckIdExpireDate(
  partyId: number
): Promise<ValidationResponseDto> {
  return advisedFetch(
    `/api/customer-overview/statement/CheckIdExpireDate/${partyId}`
  ).then(jsonErrorHandler<ValidationResponseDto>());
}

export function generateOldStatement(
  values: GenerateOldStatementDto
): Promise<GenerateOldStatementResponseDto> {
  return advisedFetch(
    `/api/customer-overview/statement/generate-old-statement`,
    {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    },
    { timeoutMs: 100000 }
  ).then(jsonErrorHandler());
}
export function getOldStatementPdf(
  values: GetOldStatementPdfDto
): Promise<GenerateOldStatementPdfResponseDto> {
  const params = new URLSearchParams({
    idStatement: values.idStatement.toString(),
    idProduct: values.idProduct.toString(),
  });
  return advisedFetch(
    `/api/customer-overview/statement/old-statement?${params.toString()}`
  ).then(jsonErrorHandler());
}
