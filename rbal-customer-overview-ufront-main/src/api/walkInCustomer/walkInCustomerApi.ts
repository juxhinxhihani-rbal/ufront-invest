import {
  jsonErrorHandler,
  advisedFetch,
} from "@rbal-modern-luka/luka-portal-shell";
import {
  CreateWalkInCustomerDto,
  CreateWalkInCustomerResponse,
  WalkInCustomerDto,
  WalkInCustomerResponseDto,
} from "./walkInCustomerApi.types";
import { toWalkInCustomerItem } from "./walkInCustomerDto";

export function fetchWalkInCustomer(
  customerId: string
): Promise<WalkInCustomerDto> {
  return advisedFetch(`/api/customer-overview/customer/walkIn/${customerId}`)
    .then(jsonErrorHandler<WalkInCustomerResponseDto>())
    .then((json) => toWalkInCustomerItem(json));
}

export function createWalkInCustomer(
  values: CreateWalkInCustomerDto
): Promise<CreateWalkInCustomerResponse> {
  return advisedFetch(
    `/api/customer-overview/customer/walkIn/create`,
    {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}

export function updateWalkInCustomer(
  values: CreateWalkInCustomerDto,
  customerId?: string
): Promise<CreateWalkInCustomerResponse> {
  return advisedFetch(
    `/api/customer-overview/customer/walkIn/${customerId}`,
    {
      method: "PUT",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}
