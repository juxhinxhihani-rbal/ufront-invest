import { multiSelectValuesToString } from "~/common/utils";
import { useTransactionCurrencyTypes } from "~/features/dictionaries/dictionariesQueries";
import { Change } from "~/common/utils";
import { ReviewRow } from "./ReviewRow";

interface CurrencyIdsProps {
  row: Change;
}

export const CurrencyIds = ({ row }: CurrencyIdsProps) => {
  const { data: transactionCurrencyTypes } = useTransactionCurrencyTypes();

  const oldValue = multiSelectValuesToString(
    transactionCurrencyTypes,
    row.oldValue
  );
  const newValue = multiSelectValuesToString(
    transactionCurrencyTypes,
    row.newValue
  );

  return (
    <ReviewRow oldValue={oldValue} newValue={newValue} fieldKey={row.key} />
  );
};
