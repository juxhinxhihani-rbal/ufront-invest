import { preloadFonts } from "./features/fonts";
import { createRoot } from "react-dom/client";
import { start } from "single-spa";
import {
  generateGlobalCss,
  RbalTheme,
  tokens,
} from "@rbal-modern-luka/ui-library";
import { QueryClient, QueryClientProvider } from "react-query";
import { Root } from "./modules/Root";
import { Global, Theme } from "@emotion/react";
import { findFont } from "~/features/fonts";

preloadFonts();

const container = document.getElementById("root");
if (!container) {
  throw new Error("Missing container");
}

const root = createRoot(container);
const globalCss = generateGlobalCss(findFont);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const globalStylesInterpolation = (t: Theme) => [
  globalCss,
  {
    body: {
      color: tokens.color(t, "gray800"),
    },
  },
];

root.render(
  <QueryClientProvider client={queryClient}>
    <Global styles={globalStylesInterpolation} />
    <Root />
  </QueryClientProvider>
);

start();

declare module "@emotion/react" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends RbalTheme {}
}
