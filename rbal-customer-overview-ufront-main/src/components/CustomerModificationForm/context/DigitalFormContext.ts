import { createContext } from "react";
import { UseFormReturn } from "react-hook-form";
import { DigitalBankingDto } from "~/api/customer/customerApi.types";

export type DigitalFormContext = {
  form: UseFormReturn<DigitalBankingDto>;
  initialCustomerFormValues: DigitalBankingDto;
};

export const DigitalFormContext = createContext<DigitalFormContext>({
  form: {} as UseFormReturn<DigitalBankingDto>,
  initialCustomerFormValues: {} as DigitalBankingDto,
});
