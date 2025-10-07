import { getNameById } from "~/common/utils";
import {
  useCustomerServicesQuery,
  useServicesQuery,
} from "~/features/dictionaries/dictionariesQueries";
import { Change } from "~/common/utils";
import { ReviewRow } from "./ReviewRow";
interface ServiceIdProps {
  row: Change;
}

export const ServiceId = ({ row }: ServiceIdProps) => {
  const { data: services } = useServicesQuery();
  const { data: customerServices } = useCustomerServicesQuery();

  const currentServices = [...(services ?? []), ...(customerServices ?? [])];
  const oldValue = getNameById(currentServices, Number(row.oldValue));
  const newValue = getNameById(currentServices, Number(row.newValue));

  return (
    <ReviewRow oldValue={oldValue} newValue={newValue} fieldKey={row.key} />
  );
};
