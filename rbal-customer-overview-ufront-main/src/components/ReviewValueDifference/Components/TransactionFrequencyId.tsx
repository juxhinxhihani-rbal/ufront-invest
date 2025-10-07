import { getNameById } from "~/common/utils";
import { useFrequencyTypes } from "~/features/dictionaries/dictionariesQueries";
import { Change } from "~/common/utils";
import { ReviewRow } from "./ReviewRow";

interface TransactionFrequencyIdProps {
  row: Change;
}

export const TransactionFrequencyId = ({
  row,
}: TransactionFrequencyIdProps) => {
  const { data: frequencyTypes } = useFrequencyTypes();
  const oldValue = getNameById(frequencyTypes, Number(row.oldValue));
  const newValue = getNameById(frequencyTypes, Number(row.newValue));

  return (
    <ReviewRow oldValue={oldValue} newValue={newValue} fieldKey={row.key} />
  );
};
