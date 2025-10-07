import { multiSelectValuesToString } from "~/common/utils";
import { useFetchPurposeOfBankRelationTypes } from "~/features/dictionaries/dictionariesQueries";
import { Change } from "~/common/utils";
import { ReviewRow } from "./ReviewRow";

interface PurposeOfBankRelationTypeIdsProps {
  row: Change;
}

export const PurposeOfBankRelationTypeIds = ({
  row,
}: PurposeOfBankRelationTypeIdsProps) => {
  const { data: purposeOfBankRelationTypes } =
    useFetchPurposeOfBankRelationTypes();

  const oldValue = multiSelectValuesToString(
    purposeOfBankRelationTypes,
    row.oldValue
  );
  const newValue = multiSelectValuesToString(
    purposeOfBankRelationTypes,
    row.newValue
  );

  return (
    <ReviewRow oldValue={oldValue} newValue={newValue} fieldKey={row.key} />
  );
};
