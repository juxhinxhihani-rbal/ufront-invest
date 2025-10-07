import { createContext } from "react";
import { WalkInCustomerDto } from "~/api/walkInCustomer/walkInCustomerApi.types";

export const WalkInCustomerContext = createContext<WalkInCustomerDto>(
  {} as unknown as WalkInCustomerDto
);
