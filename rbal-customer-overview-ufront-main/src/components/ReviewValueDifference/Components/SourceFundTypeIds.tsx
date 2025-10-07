import { multiSelectValuesToString } from "~/common/utils";
import { useSourceFundsTypes } from "~/features/dictionaries/dictionariesQueries";
import { Change } from "~/common/utils";
import { ReviewRow } from "./ReviewRow";

interface SourceFundTypeIdsProps {
  row: Change;
}

export const SourceFundTypeIds = ({ row }: SourceFundTypeIdsProps) => {
  const { data: sourceFundsTypesQuery } = useSourceFundsTypes();

  const oldValue = multiSelectValuesToString(
    sourceFundsTypesQuery,
    row.oldValue
  );
  const newValue = multiSelectValuesToString(
    sourceFundsTypesQuery,
    row.newValue
  );

  return (
    <ReviewRow oldValue={oldValue} newValue={newValue} fieldKey={row.key} />
  );
};
