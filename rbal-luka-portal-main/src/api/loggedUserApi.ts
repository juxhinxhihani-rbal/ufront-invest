import { advisedFetch } from "~rbal-luka-portal-shell/http/advisedFetch";
import {
  LoggedUser,
  jsonErrorHandler,
  HttpClientError,
} from "~rbal-luka-portal-shell/index";
import { IResourcePermissionsResponseDto } from "./loggedUserApi.types";

export function fetchLoggedUser(isAlreadyLogged: boolean): Promise<LoggedUser> {
  return advisedFetch("/api/auth/user-details", undefined, {
    timeoutMs: 2000,
  })
    .then(fetchLoggedUserHandler(isAlreadyLogged))
    .then(jsonErrorHandler<LoggedUser>());
}

const fetchLoggedUserHandler = (isAlreadyLogged: boolean) => {
  return (response: Response): Response => {
    if (isAlreadyLogged && response.status === 401) {
      window.location.pathname = "/logout";
    }

    return response;
  };
};

export function refreshCredentials(): Promise<unknown> {
  return advisedFetch(
    "/api/auth/refresh",
    { method: "post" },
    { timeoutMs: 2000 }
  ).then((response) => {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve();
    }

    return Promise.reject(
      new HttpClientError("server-error", "/api/auth/refresh")
    );
  });
}

export function fetchUserPermissions(): Promise<
  IResourcePermissionsResponseDto[]
> {
  return advisedFetch(
    "/api/permission-svc/get-keycloak-permissions",
    {
      cache: "no-cache",
    },
    {
      timeoutMs: 3000,
    }
  ).then(jsonErrorHandler<IResourcePermissionsResponseDto[]>());
}
