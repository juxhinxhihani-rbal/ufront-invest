import { useEffect } from "react";
import { LoggedUser } from "~rbal-luka-portal-shell/index";
import {
  useReadLoggedUserQuery,
  useRefreshCredentialsMutation,
} from "./loggedUserQueries";

const _2_SECONDS = 2 * 1000;
const _3_MINUTES = 3 * 60 * 1000;

export function useRefreshCredentials(loggedUserContext?: LoggedUser) {
  const refreshCredentialsMutation = useRefreshCredentialsMutation({});

  const isAlreadyLogged = !!loggedUserContext;

  const userQuery = useReadLoggedUserQuery(
    {
      enabled: isAlreadyLogged && window.location.pathname !== "/logout",
    },
    isAlreadyLogged
  );

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!loggedUserContext?.exp) return;

      const isExpiring = credentialsExpireWithin(
        loggedUserContext?.exp ?? 0,
        _3_MINUTES
      );

      if (isExpiring) {
        try {
          await refreshCredentialsMutation.mutation.mutateAsync({});
        } catch (error) {
          console.log({ error });
        }
        await userQuery.query.refetch();
      }
    }, _2_SECONDS);

    return () => clearInterval(interval);
  }, [
    loggedUserContext?.exp,
    refreshCredentialsMutation.mutation,
    userQuery.query,
  ]);
}

function credentialsExpireWithin(
  credentialsExpiryTime: number,
  timeLeftToExpire: number
): boolean {
  return credentialsExpiryTime * 1000 - Date.now() < timeLeftToExpire;
}
