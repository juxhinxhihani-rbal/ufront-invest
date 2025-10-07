import { HttpClientError } from "@rbal-modern-luka/luka-portal-shell";
import { useQuery } from "react-query";
import { CacheExpiration } from "~/api/enums/CacheExpiration";
import { fetchFeatureFlags } from "~/api/featureFlags/featureFlagsApi";
import { Flag } from "~/api/featureFlags/featureFlagsApi.types";

export function useFeatureFlagsQuery() {
  return useQuery<Flag[], HttpClientError>(
    ["featureFlags"],
    fetchFeatureFlags,
    {
      refetchOnWindowFocus: true,
      retry: 3,
      staleTime: CacheExpiration.FiveMinutes,
    }
  );
}
