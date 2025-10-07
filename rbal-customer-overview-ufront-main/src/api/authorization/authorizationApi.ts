import {
  advisedFetch,
  jsonErrorHandler,
} from "@rbal-modern-luka/luka-portal-shell";
import {
  CustomerAuthorizeResponse,
  AuthorizationChangesResponse,
  RejectCustomerChangesResponse,
  ActivateMidasCustomerResponse,
  AuthorizeSpecimenResponse,
  AuthorizableAccountDto,
  AccountAuthorizationResponse,
  AccountRejectionResponse,
  AccountRightsAuthorizationResponse,
  AccountRightsRejectionResponse,
  AccountRightsApprovedResponse,
  AmlAuthorizationResponse,
  AmlRejectionResponse,
  mapAmlDataFromAuthorizationAmlCustomerDetailsDto,
  AuthorizationAmlCustomerDetailsDto,
  AmlAuthorizationDetailsDto,
  CrsAuthorizationResponse,
  CrsRejectionResponse,
  CrsAuthorizationDetailsDto,
  AuthorizationCrsCustomerDetailsDto,
  mapCrsDataFromAuthorizationCrsCustomerDetailsDto,
} from "./authorizationApi.types";

export function fetchCustomerChanges(
  customerId: string
): Promise<AuthorizationChangesResponse> {
  return advisedFetch(
    `/api/customer-overview/authorization/changes/${customerId}`
  ).then(jsonErrorHandler());
}

export function rejectCustomerChanges(
  customerId: string
): Promise<RejectCustomerChangesResponse> {
  return advisedFetch(
    `/api/customer-overview/authorization/changes/${customerId}/reject`,
    {
      method: "PUT",
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}

export function approveCustomerChanges(
  customerId: string
): Promise<CustomerAuthorizeResponse> {
  return advisedFetch(
    `/api/customer-overview/authorization/changes/${customerId}/approve`,
    {
      method: "PUT",
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}

export function fetchAuthorizationAccount(
  accountId: string
): Promise<AuthorizableAccountDto> {
  return advisedFetch(
    `/api/customer-overview/authorization/accounts/${accountId}`,
    {
      method: "GET",
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}

export function fetchAmlDetails(
  customerId: string
): Promise<AmlAuthorizationDetailsDto> {
  return advisedFetch(
    `/api/customer-overview/authorization/aml/${customerId}`,
    {
      method: "GET",
    },
    { timeoutMs: 60000 }
  )
    .then(jsonErrorHandler())
    .then((json) => {
      const amlCustomerDetailsDto = json as AuthorizationAmlCustomerDetailsDto;
      return mapAmlDataFromAuthorizationAmlCustomerDetailsDto(
        amlCustomerDetailsDto
      );
    });
}

export function fetchCrsDetails(
  customerId: string
): Promise<CrsAuthorizationDetailsDto> {
  return advisedFetch(
    `/api/customer-overview/authorization/crs/${customerId}`,
    {
      method: "GET",
    },
    { timeoutMs: 60000 }
  )
    .then(jsonErrorHandler())
    .then((json) => {
      const crsCustomerDetailsDto = json as AuthorizationCrsCustomerDetailsDto;
      return mapCrsDataFromAuthorizationCrsCustomerDetailsDto(
        crsCustomerDetailsDto
      );
    });
}

export function approveAccountChanges(
  accountId: string
): Promise<AccountAuthorizationResponse> {
  return advisedFetch(
    `/api/customer-overview/authorization/accounts/${accountId}/approve`,
    {
      method: "PUT",
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}

export function rejectAccountChanges(
  accountId: string
): Promise<AccountRejectionResponse> {
  return advisedFetch(
    `/api/customer-overview/authorization/accounts/${accountId}/reject`,
    {
      method: "PUT",
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}

export function approveAmlChanges(
  customerId: string,
  description: string,
  expireDate: string
): Promise<AmlAuthorizationResponse> {
  const params = new URLSearchParams({
    description: description,
  });

  if (expireDate !== undefined) {
    params.append("expireDate", expireDate);
  }
  return advisedFetch(
    `/api/customer-overview/authorization/aml/${customerId}/approve?${params.toString()}`,
    {
      method: "PUT",
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}

export function rejectAmlChanges(
  customerId: string,
  description: string
): Promise<AmlRejectionResponse> {
  return advisedFetch(
    `/api/customer-overview/authorization/aml/${customerId}/reject?description=${description}`,
    {
      method: "PUT",
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}

export function approveCrsChanges(
  customerId: string
): Promise<CrsAuthorizationResponse> {
  return advisedFetch(
    `/api/customer-overview/authorization/crs/${customerId}/approve`,
    {
      method: "PUT",
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}

export function rejectCrsChanges(
  customerId: string,
  description: string
): Promise<CrsRejectionResponse> {
  return advisedFetch(
    `/api/customer-overview/authorization/crs/${customerId}/reject`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description }),
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}

export function activateMidasCustomer(
  customerId: string,
  isActivated: boolean
): Promise<ActivateMidasCustomerResponse> {
  return advisedFetch(
    `/api/customer-overview/authorization/changes/activate?idParty=${customerId}&isActivated=${isActivated}`,
    {
      method: "PUT",
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}

export function authorizeOrRejectSpecimenSignature(
  customerId: string,
  isApproved: boolean
): Promise<AuthorizeSpecimenResponse> {
  return advisedFetch(
    `/api/customer-overview/specimen-authorization/${customerId}/signature-approval/${isApproved}`,
    {
      method: "PUT",
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}

export function fetchAccountRightsChanges(
  authorizationRightListId: string
): Promise<AccountRightsAuthorizationResponse> {
  return advisedFetch(
    `/api/customer-overview/authorization/account-rights/${authorizationRightListId}`,
    {
      method: "GET",
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}

export function approveAccountRightsChanges(
  authorizationRightListId: string
): Promise<AccountRightsApprovedResponse> {
  return advisedFetch(
    `/api/customer-overview/authorization/account-rights/${authorizationRightListId}/approve`,
    {
      method: "PUT",
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}

export function rejectAccountRightsChanges(
  authorizationRightListId: string
): Promise<AccountRightsRejectionResponse> {
  return advisedFetch(
    `/api/customer-overview/authorization/account-rights/${authorizationRightListId}/reject`,
    {
      method: "PUT",
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}

export function approveDigitalBankingChanges(
  applicationId: string,
  customerId: string
): Promise<boolean> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/digitalBanking/approve/${applicationId}?partyId=${customerId}`,
    {
      method: "POST",
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}

export function rejectDigitalBankingChanges(
  applicationId: string
): Promise<boolean> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/digitalBanking/reject/${applicationId}`,
    {
      method: "DELETE",
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}
