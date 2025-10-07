import { getNameById } from "~/common/utils";
import { useFatcaDocumentTypes } from "~/features/dictionaries/dictionariesQueries";
import { Change } from "~/common/utils";
import { ReviewRow } from "./ReviewRow";

interface FatcaDocumentTypeProps {
  row: Change;
}

export const FatcaDocumentType = ({ row }: FatcaDocumentTypeProps) => {
  const { data: fatcaDocumentTypes } = useFatcaDocumentTypes();

  const oldValue = getNameById(fatcaDocumentTypes, Number(row.oldValue));
  const newValue = getNameById(fatcaDocumentTypes, Number(row.newValue));

  return (
    <ReviewRow oldValue={oldValue} newValue={newValue} fieldKey={row.key} />
  );
};
