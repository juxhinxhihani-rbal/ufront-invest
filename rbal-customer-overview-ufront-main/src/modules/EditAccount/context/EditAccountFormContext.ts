import { createContext } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { AccountDetailsDto } from "~/api/retailAccount/retailAccount.types";

export type EditAccountFormContext = {
  form: UseFormReturn<AccountDetailsDto>;
  isAccountClosing: boolean;
  initialCustomerFormValues: AccountDetailsDto;
  submitHandler: SubmitHandler<AccountDetailsDto>;
};

export const EditAccountFormContext = createContext<EditAccountFormContext>({
  form: {} as UseFormReturn<AccountDetailsDto>,
  isAccountClosing: false,
  initialCustomerFormValues: {} as AccountDetailsDto,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  submitHandler: () => {},
});
