import {
  advisedFetch,
  jsonErrorHandler,
} from "@rbal-modern-luka/luka-portal-shell";
import {
  BlockMobileResponse,
  RegisterDigitalBankingResponse,
  UnblockResponseDto,
  UpgradeDigitalBankingResponse,
  BlockDigitalUserResponse,
  SsnDigitalBankingResponse,
} from "./digitalBankingApi.types";

export function blockMobile(
  customerId: number,
  isTokenChecked: boolean,
  isCrontoChecked: boolean
): Promise<BlockMobileResponse> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/digitalBanking/block/mobile/${customerId}?isTokenChecked=${isTokenChecked}&isCrontoChecked=${isCrontoChecked}`,
    {
      method: "PUT",
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}

export function fetchValidSsnDigitalBanking(
  cutomerId: number
): Promise<SsnDigitalBankingResponse> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/digitalBanking/valid-personal-number/${cutomerId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    },
    { timeoutMs: 60000 }
  )
    .then(jsonErrorHandler<SsnDigitalBankingResponse>())
    .then((json) => json);
}

export function fetchNonValidSsnDigitalBanking(
  cutomerId: number
): Promise<SsnDigitalBankingResponse> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/digitalBanking/invalid-personal-number/${cutomerId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    },
    { timeoutMs: 60000 }
  )
    .then(jsonErrorHandler<SsnDigitalBankingResponse>())
    .then((json) => json);
}

export function fetchRegisterDigitalBanking(
  customerId: number
): Promise<RegisterDigitalBankingResponse> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/digitalBanking/register/${customerId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
    { timeoutMs: 60000 }
  )
    .then(jsonErrorHandler<RegisterDigitalBankingResponse>())
    .then((json) => json);
}

export function fetchupgradeDigitalBanking(
  customerId: number
): Promise<UpgradeDigitalBankingResponse> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/digitalBanking/upgrade/${customerId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    },
    { timeoutMs: 60000 }
  )
    .then(jsonErrorHandler<UpgradeDigitalBankingResponse>())
    .then((json) => json);
}

export function fetchBlockDigitalBanking(
  customerId: number,
  isForBlock: boolean
): Promise<BlockDigitalUserResponse> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/digitalBanking/block/${customerId}?isForBlock=${isForBlock}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    },
    { timeoutMs: 60000 }
  )
    .then(jsonErrorHandler<BlockDigitalUserResponse>())
    .then((json) => json);
}

export function fetchUnblockDigitalBanking(
  customerId: number
): Promise<UnblockResponseDto> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/digitalBanking/unblock/${customerId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    },
    { timeoutMs: 60000 }
  )
    .then(jsonErrorHandler<UnblockResponseDto>())
    .then((json) => json);
}
