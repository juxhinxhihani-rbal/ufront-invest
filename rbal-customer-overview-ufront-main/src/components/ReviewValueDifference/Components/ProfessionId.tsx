import { getNameById } from "~/common/utils";
import { useProfessionsQuery } from "~/features/dictionaries/dictionariesQueries";
import { Change } from "~/common/utils";
import { ReviewRow } from "./ReviewRow";

interface ProffesionIdProps {
  row: Change;
}

export const ProffesionId = ({ row }: ProffesionIdProps) => {
  const { data: professions } = useProfessionsQuery();

  const oldValue = getNameById(professions, Number(row.oldValue));
  const newValue = getNameById(professions, Number(row.newValue));

  return (
    <ReviewRow oldValue={oldValue} newValue={newValue} fieldKey={row.key} />
  );
};
