import { getNameById } from "~/common/utils";
import { useGendersQuery } from "~/features/dictionaries/dictionariesQueries";
import { Change } from "~/common/utils";
import { ReviewRow } from "./ReviewRow";

interface GenderIdProps {
  row: Change;
}

export const GenderId = ({ row }: GenderIdProps) => {
  const { data: genders } = useGendersQuery();

  const oldValue = getNameById(genders, Number(row.oldValue));
  const newValue = getNameById(genders, Number(row.newValue));

  return (
    <ReviewRow oldValue={oldValue} newValue={newValue} fieldKey={row.key} />
  );
};
