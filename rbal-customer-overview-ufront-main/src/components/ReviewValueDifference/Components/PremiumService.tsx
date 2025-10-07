import { getNameById } from "~/common/utils";
import { useServicesQuery } from "~/features/dictionaries/dictionariesQueries";
import { Change } from "~/common/utils";
import { ReviewRow } from "./ReviewRow";

interface PremiumServiceProps {
  row: Change;
}

export const PremiumService = ({ row }: PremiumServiceProps) => {
  const { data: services } = useServicesQuery();

  const oldValue = getNameById(services, Number(row.oldValue));
  const newValue = getNameById(services, Number(row.newValue));

  return (
    <ReviewRow oldValue={oldValue} newValue={newValue} fieldKey={row.key} />
  );
};
