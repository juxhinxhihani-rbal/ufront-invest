import {
  advisedFetch,
  jsonErrorHandler,
} from "@rbal-modern-luka/luka-portal-shell";
import { Flag } from "./featureFlagsApi.types";

export function fetchFeatureFlags(): Promise<Flag[]> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/featureFlags`,
    {
      method: "GET",
    },
    { timeoutMs: 20000 }
  ).then(jsonErrorHandler());
}
