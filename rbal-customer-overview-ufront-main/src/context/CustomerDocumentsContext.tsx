import { createContext } from "react";

type CustomerDocumentContextProps = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  enableOsheConsent: boolean;
  setEnableOsheConsent: (value: boolean) => void;
};

export const CustomerDocumentsContext =
  createContext<CustomerDocumentContextProps>(
    {} as unknown as CustomerDocumentContextProps
  );
