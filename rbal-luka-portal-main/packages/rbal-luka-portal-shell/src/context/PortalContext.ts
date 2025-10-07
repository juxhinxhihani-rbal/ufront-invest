/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/naming-convention */
import { Theme } from "@emotion/react";
import { createContext } from "react";
import { MicroFunction } from "./usePortalContextValue";

export interface PortalContextValue {
  loggedUser?: LoggedUser;
  resourcePermissions: {
    permissions: string[];
    resourceName: string;
  }[];
  preferredLanguage: string;
  theme?: Theme;
  microData: MicroFunction[] | undefined;
  addMicroData: (newMicroData: MicroFunction) => void;
  editMicroData: (
    key: string,
    propertiesToUpdate: Partial<MicroFunction>
  ) => void;
  removeMicroData: (key: string) => void;
  removeAllMicroData: () => void;
}

export interface LoggedUser {
  at_hash: string;
  sub: string;
  "cognito:groups": string[];
  email_verified: boolean;
  iss: string;
  phone_number_verified: boolean;
  "cognito:username": string;
  preferred_username: string;
  origin_jti: string;
  aud: string;
  event_id: string;
  token_use: string;
  auth_time: number;
  phone_number: string;
  exp: number;
  iat: number;
  jti: string;
  email: string;
  sid: string;
}

export const PortalContext = createContext<PortalContextValue>({
  loggedUser: undefined,
  preferredLanguage: "en",
  resourcePermissions: [],
  theme: {} as unknown as Theme,
  microData: [],
  addMicroData: () => {},
  editMicroData: () => {},
  removeMicroData: () => {},
  removeAllMicroData: () => {},
});
