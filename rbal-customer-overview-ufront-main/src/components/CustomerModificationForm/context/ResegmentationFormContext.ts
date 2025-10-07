import { createContext } from "react";
import { UseFormReturn } from "react-hook-form";
import { CustomerUpdateDto } from "~/api/customer/customerApi.types";

export const ResegmentationFormContext = createContext<
  UseFormReturn<CustomerUpdateDto>
>({} as unknown as UseFormReturn<CustomerUpdateDto>);
