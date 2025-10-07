import { advisedFetch } from "~rbal-luka-portal-shell/http/advisedFetch";
import { jsonErrorHandler } from "~rbal-luka-portal-shell/index";
import { CustomerListing, ListCustomersParams } from "./customerApi.types";

export function fetchCustomersListing(
  params: ListCustomersParams
): Promise<CustomerListing> {
  const queryParams = toListCustomersQueryParams(params);

  return advisedFetch(
    `/api/customer-overview/customers?${queryParams.toString()}`
  ).then(jsonErrorHandler<CustomerListing>());
}
function toListCustomersQueryParams(params: ListCustomersParams) {
  return Object.entries(params)
    .filter(([, value]) => Boolean(value))
    .reduce((target, [key, value]) => {
      target.append(key, value);
      return target;
    }, new URLSearchParams());
}
