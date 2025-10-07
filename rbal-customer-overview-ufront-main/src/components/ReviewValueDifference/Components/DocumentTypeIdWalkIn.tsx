import { getNameById } from "~/common/utils";
import { useCustomerDocumentType } from "~/features/dictionaries/dictionariesQueries";
import { ReviewRow } from "./ReviewRow";
import { Change } from "~/common/utils";

interface DocumentTypeIdWalkInProps {
  row: Change;
}

export const DocumentTypeIdWalkIn = ({ row }: DocumentTypeIdWalkInProps) => {
  const { data: documentTypes } = useCustomerDocumentType();

  const oldValue = getNameById(documentTypes, Number(row.oldValue));
  const newValue = getNameById(documentTypes, Number(row.newValue));

  return (
    <ReviewRow oldValue={oldValue} newValue={newValue} fieldKey={row.key} />
  );
};
