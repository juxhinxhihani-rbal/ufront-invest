import { useContext } from "react";
import { getNameById } from "~/common/utils";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";
import { useCustomerDocumentType } from "~/features/dictionaries/dictionariesQueries";
import { ReviewRow } from "./ReviewRow";
import { Change } from "~/common/utils";

interface DocumentTypeIdProps {
  row: Change;
}

export const DocumentTypeId = ({ row }: DocumentTypeIdProps) => {
  const { getValues } = useContext(CustomerFormContext).form;

  const { data: documentTypes } = useCustomerDocumentType(
    getValues("customerInformation.customerSegmentId")
  );

  const oldValue = getNameById(documentTypes, Number(row.oldValue));
  const newValue = getNameById(documentTypes, Number(row.newValue));

  return (
    <ReviewRow oldValue={oldValue} newValue={newValue} fieldKey={row.key} />
  );
};
