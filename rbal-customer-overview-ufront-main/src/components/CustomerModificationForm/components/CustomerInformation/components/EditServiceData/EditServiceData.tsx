import { useContext } from "react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Select } from "~/components/Select/Select";
import {
  useCustomerServicesQuery,
  useServicesQuery,
} from "~/features/dictionaries/dictionariesQueries";
import { editServiceDataI18n } from "./EditServiceData.i18n";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";

interface EditServiceDataProps {
  isPremium: boolean;
}

export const EditServiceData: React.FC<EditServiceDataProps> = ({
  isPremium,
}) => {
  const { tr } = useI18n();

  const customerFormContext = useContext(CustomerFormContext);

  const { control } = customerFormContext.form;

  const { data: services } = useServicesQuery();
  const { data: customerServices } = useCustomerServicesQuery();

  const data = isPremium ? services : customerServices;

  return (
    <>
      <Select
        id="service"
        label={tr(editServiceDataI18n.premiumService)}
        name={"customerInformation.serviceInformation.premiumServiceId"}
        control={control}
        data={data}
        shouldGrow={false}
      />
    </>
  );
};
