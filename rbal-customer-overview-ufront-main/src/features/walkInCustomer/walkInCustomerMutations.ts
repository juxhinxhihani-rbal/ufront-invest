import { HttpClientError } from "@rbal-modern-luka/luka-portal-shell";
import { useMutation } from "react-query";
import {
  createWalkInCustomer,
  updateWalkInCustomer,
} from "~/api/walkInCustomer/walkInCustomerApi";
import {
  CreateWalkInCustomerDto,
  CreateWalkInCustomerResponse,
} from "~/api/walkInCustomer/walkInCustomerApi.types";

export function useCreateWalkInCustomerMutation() {
  return useMutation<
    CreateWalkInCustomerResponse,
    HttpClientError,
    CreateWalkInCustomerDto
  >({
    mutationFn: (values) => createWalkInCustomer(values),
  });
}

export function useUpdateWalkInCustomerMutation(customerId?: string) {
  return useMutation<
    CreateWalkInCustomerResponse,
    HttpClientError,
    CreateWalkInCustomerDto
  >({
    mutationFn: (values) => updateWalkInCustomer(values, customerId),
  });
}
