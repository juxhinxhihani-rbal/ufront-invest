export interface BankCertificateFormValues {
  paymentAccountId: number | undefined;
  certificateTypeId: number | undefined;
  addressedToId: number | undefined;
  branchAuthorizer: string;
  notes: string;
}
