import { useFeatureFlagsQuery } from "../featureFlags/featureFlagQuery";

export const useFeatureFlags = () => {
  const featureQuery = useFeatureFlagsQuery();

  const isFeatureEnabled = (featureName: string): boolean => {
    const flag = featureQuery.data?.find((f) => f.feature.name === featureName);
    return flag?.enabled ?? false;
  };

  const getFeatureValue = (featureName: string): string | undefined => {
    const flag = featureQuery.data?.find((f) => f.feature.name === featureName);
    return flag?.value;
  };

  return {
    flags: featureQuery.data,
    isFeatureEnabled,
    getFeatureValue,
  };
};
