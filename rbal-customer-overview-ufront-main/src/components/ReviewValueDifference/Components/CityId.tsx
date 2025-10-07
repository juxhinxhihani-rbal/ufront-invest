import { useContext } from "react";
import { getNameById } from "~/common/utils";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";
import {
  useCitiesQuery,
  useCountriesQuery,
} from "~/features/dictionaries/dictionariesQueries";
import { Change } from "~/common/utils";
import { ReviewRow } from "./ReviewRow";

interface CityIdProps {
  segment: "personalInfo" | "address";
  row: Change;
}

const getFieldName = (segment: "personalInfo" | "address") => {
  switch (segment) {
    case "personalInfo":
      return "customerInformation.personalInfo.countryOfBirthId";
    case "address":
      return "customerInformation.address.countryId";
    default:
      throw new Error("Invalid segment");
  }
};

export const CityId = ({ segment, row }: CityIdProps) => {
  const { getValues } = useContext(CustomerFormContext).form;

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
