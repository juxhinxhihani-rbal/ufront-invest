import { getNameById } from "~/common/utils";
import { useDiligenceBandTypes } from "~/features/dictionaries/dictionariesQueries";
import { ReviewRow } from "./ReviewRow";
import { Change } from "~/common/utils";

interface BandIdProps {
  row: Change;
}

export const BandId = ({ row }: BandIdProps) => {
  const { data: diligenceBandTypes } = useDiligenceBandTypes();
  const oldValue = getNameById(diligenceBandTypes, Number(row.oldValue));
  const newValue = getNameById(diligenceBandTypes, Number(row.newValue));

  return (
    <ReviewRow oldValue={oldValue} newValue={newValue} fieldKey={row.key} />
  );
};
