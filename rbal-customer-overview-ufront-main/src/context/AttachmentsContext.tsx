import { createContext } from "react";
import { CustomerAttachmentsContextValues } from "~/modules/CreateRetailAccount/types";

export const CustomerAttachmentsContext =
  createContext<CustomerAttachmentsContextValues>(
    {} as unknown as CustomerAttachmentsContextValues
  );
