import { theme } from "@rbal-modern-luka/ui-library";
import { PortalContextValue } from "~rbal-luka-portal-shell/index";
import { createStore } from "zustand";

export const preferredLanguageKey = "preferredLanguage";

/* eslint-disable @typescript-eslint/no-empty-function */
export const store = createStore<PortalContextValue>(() => ({
  loggedUser: undefined,
  preferredLanguage: initialPreferredLanguage(),
  resourcePermissions: [],
  theme,
  microData: [],
  addMicroData: () => {},
  editMicroData: () => {},
  removeMicroData: () => {},
  removeAllMicroData: () => {},
}));

function initialPreferredLanguage(): string {
  const preferredLanguage = localStorage.getItem(preferredLanguageKey);

  if (preferredLanguage === "en" || preferredLanguage === "sq") {
    return preferredLanguage;
  }

  return "sq";
}
