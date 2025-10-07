import { getNameById } from "~/common/utils";
import { useMaritalStatusesQuery } from "~/features/dictionaries/dictionariesQueries";
import { Change } from "~/common/utils";
import { ReviewRow } from "./ReviewRow";

interface MartialStatusIdProps {
  row: Change;
}

export const MartialStatusId = ({ row }: MartialStatusIdProps) => {
  const { data: martialStatuses } = useMaritalStatusesQuery();

  const oldValue = getNameById(martialStatuses, Number(row.oldValue));
  const newValue = getNameById(martialStatuses, Number(row.newValue));

  return (
    <ReviewRow oldValue={oldValue} newValue={newValue} fieldKey={row.key} />
  );
};
