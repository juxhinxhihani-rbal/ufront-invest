import { RetailAccountFormValues } from "~/modules/CreateRetailAccount/types";
import { CreateRetailAccountRequestDto } from "./retailAccount.types";

export const toCreateRetailAccountRequestDto = (
  values: RetailAccountFormValues,
  customerId: string
): CreateRetailAccountRequestDto => {
  return {
    customerId: Number(customerId),
    productId: Number(values.productId),
    parameters: {
      currencyCode: values.currencyCode,
      accountName: values.accountName,
      accountStatementFrequency: "M",
    },
  };
};
