import { getNameById } from "~/common/utils";
import { useFatcaStatusTypes } from "~/features/dictionaries/dictionariesQueries";
import { Change } from "~/common/utils";
import { ReviewRow } from "./ReviewRow";

interface FatcaStatusTypeProps {
  row: Change;
}

export const FatcaStatusType = ({ row }: FatcaStatusTypeProps) => {
  const { data: fatcaStatuses } = useFatcaStatusTypes();

  const oldValue = getNameById(fatcaStatuses, Number(row.oldValue));
  const newValue = getNameById(fatcaStatuses, Number(row.newValue));

  return (
    <ReviewRow oldValue={oldValue} newValue={newValue} fieldKey={row.key} />
  );
};
