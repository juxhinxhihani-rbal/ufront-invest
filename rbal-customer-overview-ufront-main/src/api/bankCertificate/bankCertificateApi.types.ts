export interface RetailAccountsDto {
  retailAccount: string;
  accountNumber: string;
  type: string;
  currency: string;
  iban: string;
  isActive: boolean;
  status: string;
  openDate: string;
}

export interface BankCertificateCommissionResponse {
  message: string;
  isSuccess: boolean;
}

export interface BankCertificateAccount {
  productId: number;
  retailAccount: string;
  accountNumber: string;
  type: string;
  segment: string;
  ccy: string;
  iban: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  active: boolean;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  status: boolean;
  openDate: string;
}
