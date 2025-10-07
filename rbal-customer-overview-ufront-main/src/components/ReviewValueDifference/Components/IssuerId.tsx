import { getNameById } from "~/common/utils";
import { useCustomerDocumentIssuer } from "~/features/dictionaries/dictionariesQueries";
import { Change } from "~/common/utils";
import { ReviewRow } from "./ReviewRow";

interface IssuerIdProps {
  row: Change;
}

export const IssuerId = ({ row }: IssuerIdProps) => {
  const { data: documentIssuer } = useCustomerDocumentIssuer();

  const oldValue = getNameById(documentIssuer, Number(row.oldValue));
  const newValue = getNameById(documentIssuer, Number(row.newValue));

  return (
    <ReviewRow oldValue={oldValue} newValue={newValue} fieldKey={row.key} />
  );
};
