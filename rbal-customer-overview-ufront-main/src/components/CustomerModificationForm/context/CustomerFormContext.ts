import { createContext } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { CustomerDto } from "~/api/customer/customerApi.types";
import { ResegmentationStatusResponse } from "~/api/retailAccount/retailAccount.types";

export type CustomerFormContext = {
  form: UseFormReturn<CustomerDto>;
  submitHandler: SubmitHandler<CustomerDto>;
  isCreateMode: boolean;
  isResegmentation?: boolean;
  isEmailVerified: boolean;
  resegmentationStatusResponse?: ResegmentationStatusResponse;
  setResegmentationStatusResponse?: (
    value: ResegmentationStatusResponse
  ) => void;
  initialCustomerFormValues?: CustomerDto;
  setIsEmailVerified?: (value: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/naming-convention
};

export const CustomerFormContext = createContext<CustomerFormContext>({
  form: {} as UseFormReturn<CustomerDto>,
  isCreateMode: true,
  isEmailVerified: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  submitHandler: () => {},
});
