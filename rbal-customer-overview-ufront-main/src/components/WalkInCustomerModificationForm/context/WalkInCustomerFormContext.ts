import { createContext } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { WalkInCustomerDto } from "~/api/walkInCustomer/walkInCustomerApi.types";

export type WalkInCustomerFormContext = {
  form: UseFormReturn<WalkInCustomerDto>;
  submitHandler: SubmitHandler<WalkInCustomerDto>;
  isCreateMode: boolean;
  isEmailVerified: boolean;
  initialWalkInCustomerFormValues?: WalkInCustomerDto;
  setIsEmailVerified?: (value: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/naming-convention
};

export const WalkInCustomerFormContext =
  createContext<WalkInCustomerFormContext>({
    form: {} as UseFormReturn<WalkInCustomerDto>,
    isCreateMode: true,
    isEmailVerified: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    submitHandler: () => {},
  });
