export interface StatementFormFilterParams {
  retailAccountNumberId: number;
  fromDate: string;
  toDate: string;
  authorizedPersonId?: string | undefined;
  branchId?: number | undefined;
  userId?: number | undefined;
  pageNumber?: number | undefined;
  initialFromDate?: string;
}

export interface StatementListResponse {
  response: StatementListItem[];
  totalPagesNumber: number;
}

export interface StatementListItem {
  statementId: number;
  productId: number;
  startDate: string;
  endDate: string;
  user: string;
  branchCode: string;
  commissionValue: number;
  statementDatetime: string;
}

export interface GenerateStatementResponseDto {
  isSent: boolean;
  responseMessage: string;
  documentByte: string;
}

export interface StatementComissionResponseDto {
  numberOfStatement: number;
  commission: number;
  currency: string;
}

export interface OldStatementComissionResponseDto {
  commission: number;
  currency: string;
}

export enum ValidationResponseStatus {
  None,
  CustomerNotFound,
  IndividualNotFound,
  PepBlockList,
  MissingExpiryDate,
  ExpiredId,
  DeceasedDate,
  NearExpiryId,
  MonitoringExpiredBusiness,
  MonitoringExpiredIndividual,
  MonitoringNearExpiryBusiness,
  MonitoringNearExpiryIndividual,
  GeneralError,
}
export interface ValidationResponseDto {
  statuses: ValidationResponseStatus[];
  isExpired: boolean;
  mainSegment: number;
  codeMessage: number;
}

export interface GenerateOldStatementDto {
  customerId: number;
  productId: number;
  startDate: string;
  endDate: string;
  authorizedPersonId: number;
  customerNumber?: string;
  reportName?: string;
}

export interface GenerateOldStatementResponseDto {
  isSent: boolean;
  message: string[];
  pdfBytes: string;
}
export interface GenerateOldStatementPdfResponseDto {
  responseMessage: string;
  documentByte: string;
}
export interface GetOldStatementPdfDto {
  idStatement: number;
  idProduct: number;
}
