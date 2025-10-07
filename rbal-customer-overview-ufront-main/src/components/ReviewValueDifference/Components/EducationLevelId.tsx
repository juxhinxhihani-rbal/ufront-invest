import { getNameById } from "~/common/utils";
import { useEducationLevelsQuery } from "~/features/dictionaries/dictionariesQueries";
import { Change } from "~/common/utils";
import { ReviewRow } from "./ReviewRow";

interface EducationLevelIdProps {
  row: Change;
}

export const EducationLevelId = ({ row }: EducationLevelIdProps) => {
  const { data: educationLevels } = useEducationLevelsQuery();

  const oldValue = getNameById(educationLevels, Number(row.oldValue));
  const newValue = getNameById(educationLevels, Number(row.newValue));

  return (
    <ReviewRow oldValue={oldValue} newValue={newValue} fieldKey={row.key} />
  );
};
