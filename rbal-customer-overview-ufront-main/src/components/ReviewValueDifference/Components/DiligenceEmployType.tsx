import { getNameById } from "~/common/utils";
import { useDiligenceEmployTypes } from "~/features/dictionaries/dictionariesQueries";
import { Change } from "~/common/utils";
import { ReviewRow } from "./ReviewRow";

interface DiligenceEmployTypeProps {
  row: Change;
}

export const DiligenceEmployType = ({ row }: DiligenceEmployTypeProps) => {
  const { data: diligenceEmployTypes } = useDiligenceEmployTypes();

  const oldValue = getNameById(diligenceEmployTypes, Number(row.oldValue));
  const newValue = getNameById(diligenceEmployTypes, Number(row.newValue));

  return (
    <ReviewRow oldValue={oldValue} newValue={newValue} fieldKey={row.key} />
  );
};
