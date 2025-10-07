import { getNameById } from "~/common/utils";
import { useSegmentCriteriasQuery } from "~/features/dictionaries/dictionariesQueries";
import { Change } from "~/common/utils";
import { ReviewRow } from "./ReviewRow";

interface SegmentCriteriaIdProps {
  row: Change;
}

export const SegmentCriteriaId = ({ row }: SegmentCriteriaIdProps) => {
  const { data: segmentCriterias } = useSegmentCriteriasQuery();

  const oldValue = getNameById(segmentCriterias, Number(row.oldValue));
  const newValue = getNameById(segmentCriterias, Number(row.newValue));

  return (
    <ReviewRow oldValue={oldValue} newValue={newValue} fieldKey={row.key} />
  );
};
