import { useContext } from "react";
import { CustomerContext } from "~/context/CustomerContext";

export const useHasAction = (action: string) => {
  const customer = useContext(CustomerContext);
  return customer?.actions?.includes(action) ?? false;
};
