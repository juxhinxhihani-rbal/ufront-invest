import { createContext } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { AccountDetailsDto } from "~/api/retailAccount/retailAccount.types";

export type EditAccountFormContext = {
  form: UseFormReturn<AccountDetailsDto>;
  submitHandler: SubmitHandler<AccountDetailsDto>;
  initialCustomerFormValues?: AccountDetailsDto;
};

export const EditAccountFormContext = createContext<EditAccountFormContext>({
  form: {} as UseFormReturn<AccountDetailsDto>,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  submitHandler: () => {},
});
