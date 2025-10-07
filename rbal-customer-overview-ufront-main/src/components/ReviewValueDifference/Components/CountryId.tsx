import { getNameById } from "~/common/utils";
import { useCountriesQuery } from "~/features/dictionaries/dictionariesQueries";
import { Change } from "~/common/utils";
import { ReviewRow } from "./ReviewRow";

interface CountryIdProps {
  row: Change;
}

export const CountryId = ({ row }: CountryIdProps) => {
  const { data: countries } = useCountriesQuery();

  const oldValue = getNameById(countries, Number(row.oldValue));
  const newValue = getNameById(countries, Number(row.newValue));

  return (
    <ReviewRow oldValue={oldValue} newValue={newValue} fieldKey={row.key} />
  );
};
