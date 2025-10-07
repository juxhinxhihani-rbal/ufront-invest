/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";

export type Translation = ((...args: any) => ReactNode) | string;

export type Translations<T = Translation> = Record<string, T>;

type AnyFunction = (...args: any) => any;

export type TrFunction = {
  <T extends Translation>(
    translations: Translations<T>,
    ...args: T extends AnyFunction ? Parameters<T> : []
  ): T extends string ? string : ReactNode;
};

export function translationsFactory(lang: string): TrFunction {
  return (translations, ...args) => {
    const translationProp = Object.getOwnPropertyDescriptor(translations, lang);

    const localized: Translation | undefined = translationProp?.value;

    if (!localized) {
      return "???";
    }

    if (typeof localized === "string") {
      return localized;
    }

    if (typeof localized === "function") {
      const result = localized(args);
      return result as string;
    }

    return "???";
  };
}
