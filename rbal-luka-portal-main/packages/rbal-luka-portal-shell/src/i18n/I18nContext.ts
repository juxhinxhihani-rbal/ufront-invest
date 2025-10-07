import { createContext, useContext } from "react";
import { TrFunction } from "./translations";

export interface I18nContextValue {
  tr: TrFunction;
  lang: string;
}

export const I18nContext = createContext<I18nContextValue>({
  tr: () => "???",
  lang: "sq",
});

export function useI18n(): I18nContextValue {
  return useContext(I18nContext);
}
