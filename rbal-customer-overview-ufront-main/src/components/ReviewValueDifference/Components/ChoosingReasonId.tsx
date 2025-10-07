import { getNameById } from "~/common/utils";
import { useChoosingReasonsQuery } from "~/features/dictionaries/dictionariesQueries";
import { Change } from "~/common/utils";
import { ReviewRow } from "./ReviewRow";

interface ChoosingReasonIdProps {
  row: Change;
}

export const ChoosingReasonId = ({ row }: ChoosingReasonIdProps) => {
  const { data: choosingReasonsData } = useChoosingReasonsQuery();
  const oldValue = getNameById(choosingReasonsData, Number(row.oldValue));
  const newValue = getNameById(choosingReasonsData, Number(row.newValue));

  return (
    <ReviewRow oldValue={oldValue} newValue={newValue} fieldKey={row.key} />
  );
};
