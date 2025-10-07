import { useMemo } from "react";
import { Loader } from "@rbal-modern-luka/ui-library";
import { Routes, Route, Navigate } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { css } from "@emotion/react";
import {
  useReadLoggedUserQuery,
  LoggedUserContext,
  useGetPermissionsQuery,
} from "~/features/loggedUser";
import { NavbarLayout } from "./NavbarLayout";
import { LogoutPage } from "./LogoutPage";
import { UnauthorizedPage } from "./UnauthorizedPage";
import { MicroFront } from "~/features/MicroFront";
import {
  I18nContext,
  I18nContextValue,
  translationsFactory,
} from "~rbal-luka-portal-shell/index";
import { useStore } from "zustand";
import { store } from "~/features/store";
import { PageNotFound } from "./PageNotFound/PageNotFound";
import { UseQueryResult } from "react-query";
import { ForbiddenPage } from "./ForbiddenPage";
import { useRefreshCredentials } from "~/features/loggedUser/useRefreshCredentials";
import { Home } from "~/components/Home/Home";
import { useAppSettings } from "~/features/appSettings/appSettingsQueries";
import { Module } from "moduleConfigs.types";

const styles = {
  loaderContainer: css({
    margin: "12.5% 25%",
  }),
};

export const Root = () => {
  const loggedUser = useStore(store, (state) => state.loggedUser);

  const isAlreadyLogged = !!loggedUser;

  const userQuery = useReadLoggedUserQuery(
    {
      enabled: window.location.pathname !== "/logout",
    },
    isAlreadyLogged
  );

  const permissionsQuery = useGetPermissionsQuery({
    enabled:
      Boolean(userQuery.query.data) &&
      userQuery.query.isFetched &&
      userQuery.query.isSuccess,
    retry: true,
    retryDelay: 1500,
  });

  const preferredLanguage = useStore(store, (state) => state.preferredLanguage);
  const i18nContext: I18nContextValue = useMemo(
    () => ({
      tr: translationsFactory(preferredLanguage),
      lang: preferredLanguage,
    }),
    [preferredLanguage]
  );

  const { data: appSettings } = useAppSettings();

  const modules = Object.values(appSettings?.modules ?? {});

  // TODO: May find better way to differentiate in-app modules and external ones.
  const inAppModules = modules.filter((module) => module.path.startsWith("/"));

  const hasPermissionForThisModule = (module: Module): boolean =>
    loggedUserContext.resourcePermissions.some(
      (resourcePermission) =>
        resourcePermission.resourceName == `module.${module.id}` &&
        resourcePermission.permissions.includes("access")
    );

  const loggedUserContext = useMemo(() => {
    const resourcePermissions = permissionsQuery.query.data ?? [];

    return {
      isLoading: userQuery.isLoading,
      resourcePermissions,
      loggedUser: userQuery.query.data,
    };
  }, [userQuery.isLoading, permissionsQuery.query.data, userQuery.query.data]);

  useRefreshCredentials(loggedUserContext.loggedUser);

  if (
    isInitialQueryLoad(userQuery.query) ||
    isInitialQueryLoad(permissionsQuery.query)
  ) {
    return (
      <div css={styles.loaderContainer}>
        <Loader withContainer={false} />
      </div>
    );
  }

  return (
    <LoggedUserContext.Provider value={loggedUserContext}>
      <I18nContext.Provider value={i18nContext}>
        <BrowserRouter>
          <Routes>
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="/" element={<Navigate to="/portal" />} />

            <Route
              path="/portal"
              element={
                <NavbarLayout>
                  <Home />
                </NavbarLayout>
              }
            />

            {inAppModules.map((module) => (
              <Route
                key={module.id}
                path={`${module.path}/*`}
                element={
                  module.requiresAuthentication ? (
                    userQuery.query.isSuccess &&
                    hasPermissionForThisModule(module) ? (
                      <NavbarLayout>
                        <MicroFront name={module.id} />
                      </NavbarLayout>
                    ) : (
                      <UnauthorizedPage />
                    )
                  ) : (
                    <NavbarLayout>
                      <MicroFront name={module.id} />
                    </NavbarLayout>
                  )
                }
              />
            ))}

            <Route path="/forbidden" element={<ForbiddenPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </I18nContext.Provider>
    </LoggedUserContext.Provider>
  );
};

function isInitialQueryLoad(query: UseQueryResult) {
  return query.isLoading && !query.isFetchedAfterMount;
}
