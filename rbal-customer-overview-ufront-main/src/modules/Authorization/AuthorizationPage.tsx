import { css } from "@emotion/react";
import { Loader } from "@rbal-modern-luka/ui-library";
import { useMemo } from "react";
import { AuthorizationStatusType } from "~/api/authorization/authorizationApi.types";
import { AuthorizationContext } from "~/context/AuthorizationContext";
import { useStatusesQuery } from "~/features/dictionaries/dictionariesQueries";
import { useAuthorizationSearchParams } from "~/features/hooks/useAuthorizationSearchParams";
import { AuthorizationView } from "./AuthorizationView";

export const AuthorizationPage = () => {
  const authorizationSearchParams = useAuthorizationSearchParams();
  const statusQuery = useStatusesQuery();

  const customerStatuses = useMemo(() => {
    return (
      statusQuery.data?.filter(
        (status) => status.statusType === AuthorizationStatusType.Customer
      ) ?? []
    );
  }, [statusQuery.data]);

  const specimenStatuses = useMemo(() => {
    return (
      statusQuery.data?.filter(
        (status) => status.statusType === AuthorizationStatusType.Signature
      ) ?? []
    );
  }, [statusQuery.data]);

  const accountStatuses = useMemo(() => {
    return (
      statusQuery.data?.filter(
        (status) => status.statusType === AuthorizationStatusType.Account
      ) ?? []
    );
  }, [statusQuery.data]);

  const accountRightsStatuses = useMemo(() => {
    return (
      statusQuery.data?.filter(
        (status) => status.statusType === AuthorizationStatusType.AccountRights
      ) ?? []
    );
  }, [statusQuery.data]);

  const digitalStatuses = useMemo(() => {
    return (
      statusQuery.data?.filter(
        (status) => status.statusType === AuthorizationStatusType.DigitalBanking
      ) ?? []
    );
  }, [statusQuery.data]);

  if (authorizationSearchParams.isLoading && statusQuery.isLoading) {
    return (
      <div
        css={css({
          margin: "10% 25%",
        })}
      >
        <Loader withContainer={false} />
      </div>
    );
  }

  return (
    <AuthorizationContext.Provider value={authorizationSearchParams}>
      <AuthorizationView
        customerStatuses={customerStatuses}
        specimenStatuses={specimenStatuses}
        accountStatuses={accountStatuses}
        accountRightsStatuses={accountRightsStatuses}
        digitalStatuses={digitalStatuses}
      />
    </AuthorizationContext.Provider>
  );
};
