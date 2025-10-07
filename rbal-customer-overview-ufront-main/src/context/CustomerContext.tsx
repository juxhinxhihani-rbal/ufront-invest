import { createContext } from "react";
import { CustomerDto } from "~/api/customer/customerApi.types";

export const CustomerContext = createContext<CustomerDto>(
  {} as unknown as CustomerDto
);
