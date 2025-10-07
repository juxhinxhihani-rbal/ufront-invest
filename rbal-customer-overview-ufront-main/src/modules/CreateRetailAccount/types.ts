import { CreateRetailAccountResponse } from "~/api/retailAccount/retailAccount.types";

export interface RetailAccountFormValues {
  productId: string;
  currencyCode: string;
  accountName: string;
}

export interface CustomerAttachmentsContextValues {
  response: CreateRetailAccountResponse | undefined;
  setResponse: (response: CreateRetailAccountResponse) => void;
  attachmentNames: string[];
  setAttachmentNames: (attachmentNames: string[]) => void;
  shouldRefetchDocuments?: boolean;
  setShouldRefetchDocuments?: (shouldRefetch: boolean) => void;
}
