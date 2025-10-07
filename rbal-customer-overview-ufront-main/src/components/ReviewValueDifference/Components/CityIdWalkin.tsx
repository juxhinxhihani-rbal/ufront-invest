import { useContext } from "react";
import { getNameById } from "~/common/utils";
import {
  useCitiesQuery,
  useCountriesQuery,
} from "~/features/dictionaries/dictionariesQueries";
import { Change } from "~/common/utils";
import { ReviewRow } from "./ReviewRow";
import { WalkInCustomerFormContext } from "~/components/WalkInCustomerModificationForm/context/WalkInCustomerFormContext";

interface CityIdProps {
  segment: "personalInformation" | "addressInformation";
  row: Change;
}

const getFieldName = (
  segment: "personalInformation" | "addressInformation"
) => {
  switch (segment) {
    case "personalInformation":
      return "basicInformation.personalInformation.countryOfBirthId";
    case "addressInformation":
      return "basicInformation.addressInformation.countryId";
    default:
      throw new Error("Invalid segment");
  }
};

export const CityIdWalkin = ({ segment, row }: CityIdProps) => {
  const { getValues } = useContext(WalkInCustomerFormContext).form;

  const countriesQuery = useCountriesQuery();
  const field = getFieldName(segment);
  const countryName = countriesQuery.data?.find(
    (item) => item.id === Number(getValues(field))
  )?.name;

  const { data: cities } = useCitiesQuery(countryName);
  const oldValue = getNameById(cities, Number(row.oldValue));
  const newValue = getNameById(cities, Number(row.newValue));

  return (
    <ReviewRow oldValue={oldValue} newValue={newValue} fieldKey={row.key} />
  );
};
