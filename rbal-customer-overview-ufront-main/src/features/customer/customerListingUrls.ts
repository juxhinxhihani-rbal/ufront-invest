import { toQueryParams } from "~/api/customer/customerApi";
import { ListCustomersParams } from "~/modules/CustomerListingPage/types";

const LISTING_PARAMS_ITEM_KEY = "listCustomersParams";

export function toCustomerListingUrl(search: string | undefined) {
  if (!search) {
    return "/customers/search";
  }

  const listingParams = new URLSearchParams(search);

  return `/customers/search?${listingParams.toString()}`;
}

export function saveListCustomersParams(
  listCustomersParams: ListCustomersParams
) {
  const queryParams = toQueryParams(listCustomersParams);
  sessionStorage.setItem(LISTING_PARAMS_ITEM_KEY, queryParams.toString());
}

export function findSavedListCustomersParams(): string | undefined {
  return sessionStorage.getItem(LISTING_PARAMS_ITEM_KEY) ?? undefined;
}
