import { useContext } from "react";
import { getNameById } from "~/common/utils";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";
import { useAccountOfficersQuery } from "~/features/dictionaries/dictionariesQueries";
import { Change } from "~/common/utils";
import { ReviewRow } from "./ReviewRow";

interface AccountOfficerIdProps {
  row: Change;
}

export const AccountOfficerId = ({ row }: AccountOfficerIdProps) => {
  const customerFormContext = useContext(CustomerFormContext);

  const { data: accountOfficers } = useAccountOfficersQuery(
    customerFormContext.form.getValues().customerInformation.customerSegmentId
  );

  const oldValue = getNameById(accountOfficers, Number(row.oldValue));
  const newValue = getNameById(accountOfficers, Number(row.newValue));

  return (
    <ReviewRow oldValue={oldValue} newValue={newValue} fieldKey={row.key} />
  );
};
