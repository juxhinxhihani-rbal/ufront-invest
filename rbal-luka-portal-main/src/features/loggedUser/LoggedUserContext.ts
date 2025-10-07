import React from "react";
import { LoggedUser } from "~rbal-luka-portal-shell/index";

export interface LoggedUserContextValue {
  loggedUser?: LoggedUser;
  resourcePermissions: {
    permissions: string[];
    resourceName: string;
  }[];
  isLoading: boolean;
}

export const LoggedUserContext = React.createContext<LoggedUserContextValue>({
  isLoading: false,
  resourcePermissions: [],
});
