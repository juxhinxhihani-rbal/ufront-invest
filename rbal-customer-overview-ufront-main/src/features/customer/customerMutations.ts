import { HttpClientError } from "@rbal-modern-luka/luka-portal-shell";
import { useMutation } from "react-query";
import {
  convertCustomer,
  createCustomer,
  createCustomerV2,
  deleteCustomerDocument,
  fetchCustomerDocumentUrl,
  fetchCustomerFshuContracts,
  sendCustomerDocumentByMail,
  updateCustomer,
} from "~/api/customer/customerApi";
import {
  CreateCustomerDto,
  CreateCustomerResponse,
  CustomerUpdateDto,
  FshuContractDto,
  GetCustomerDocumentDto,
  SendCustomerDocumentResponse,
} from "~/api/customer/customerApi.types";
import { ErrorCode } from "~/api/enums/ErrorCode";
import { CreateRetailAccountResponse } from "~/api/retailAccount/retailAccount.types";
import { LegalValidationErrors } from "~/modules/EditCustomer/types";
import { useFeatureFlags } from "../hooks/useFlags";

export function useCreateCustomerMutation() {
  const { isFeatureEnabled } = useFeatureFlags();

  return useMutation<
    CreateCustomerResponse,
    HttpClientError,
    CreateCustomerDto
  >({
    mutationFn: isFeatureEnabled("customer_create_v2")
      ? (values) => createCustomerV2(values)
      : (values) => createCustomer(values),
  });
}

export function useUpdateCustomerMutation(
  customerId?: string,
  isForResegmentation = false
) {
  return useMutation<
    CreateRetailAccountResponse,
    HttpClientError & { code: ErrorCode | LegalValidationErrors },
    CustomerUpdateDto
  >({
    mutationFn: (values) =>
      updateCustomer(values, isForResegmentation, customerId),
  });
}

export function useConvertCustomerMutation(customerId?: string) {
  return useMutation<
    CreateCustomerResponse,
    HttpClientError,
    CreateCustomerDto
  >({
    mutationFn: (values) => convertCustomer(values, customerId),
  });
}

export function useDeleteCustomerDocumentsMutation(customerId?: string) {
  return useMutation<
    Response,
    HttpClientError,
    { attachmentId: number; fileCorrelationId: string }
  >({
    mutationFn: (values) =>
      deleteCustomerDocument(
        values.attachmentId,
        values.fileCorrelationId,
        customerId
      ),
  });
}

export function useGetCustomerDocumentUrlMutation({
  customerId,
  authorizedPersonId,
  retailAccountId,
}: GetCustomerDocumentDto) {
  return useMutation<
    { url: string },
    HttpClientError,
    { documentTemplateCode: string }
  >({
    mutationFn: (values) =>
      fetchCustomerDocumentUrl({
        customerId,
        authorizedPersonId,
        retailAccountId,
        documentTemplateCode: values.documentTemplateCode,
      }),
  });
}

export function useSendCustomerDocumentsMutation() {
  return useMutation<SendCustomerDocumentResponse, HttpClientError, number>({
    mutationFn: (attachmentId) => sendCustomerDocumentByMail(attachmentId),
  });
}

export function useGetCustomerFshuContractsMutation() {
  return useMutation<FshuContractDto[], HttpClientError, { ssn?: string }>({
    mutationFn: (values) => fetchCustomerFshuContracts(values.ssn),
  });
}
