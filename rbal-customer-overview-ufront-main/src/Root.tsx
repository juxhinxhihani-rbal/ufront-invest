import React, { useEffect, useMemo } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  I18nContext,
  I18nContextValue,
  PortalContext,
  PortalStore,
  translationsFactory,
  usePortalContext,
} from "@rbal-modern-luka/luka-portal-shell";
import { ToastContainer } from "./components/Toast/ToastContainer";
import { injectStyle } from "react-toastify/dist/inject-style";
import { injectCropImageStyles } from "./components/CropPdfModal/injectCropImageStyles";
import AppRoutes from "./AppRoutes";

export interface RootProps {
  store: PortalStore;
}

const queryClient = new QueryClient();

export const Root: React.FunctionComponent<RootProps> = (props) => {
  useEffect(() => {
    injectStyle();
    injectCropImageStyles();
  }, []);

  const portalContext = usePortalContext(props.store);

  const i18nContext: I18nContextValue = useMemo(() => {
    const { preferredLanguage } = portalContext;

    return {
      tr: translationsFactory(preferredLanguage),
      lang: preferredLanguage,
    };
  }, [portalContext]);

  return (
    <QueryClientProvider client={queryClient}>
      <PortalContext.Provider value={portalContext}>
        <I18nContext.Provider value={i18nContext}>
          <BrowserRouter>
            <AppRoutes />
            <ToastContainer />
          </BrowserRouter>
        </I18nContext.Provider>
      </PortalContext.Provider>
    </QueryClientProvider>
  );
};
