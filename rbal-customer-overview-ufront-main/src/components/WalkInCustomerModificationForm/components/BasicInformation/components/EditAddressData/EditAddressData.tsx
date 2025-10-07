import { useContext } from "react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Input } from "~/components/Input/Input";
import { Select } from "~/components/Select/Select";
import {
  useCitiesQuery,
  useCountriesQuery,
} from "~/features/dictionaries/dictionariesQueries";
import { editAddressDataI18n } from "./EditAddressData.i18n";
import { WalkInCustomerFormContext } from "~/components/WalkInCustomerModificationForm/context/WalkInCustomerFormContext";

export const EditAddressData = () => {
  const { tr } = useI18n();

  const walkInCustomerFormContext = useContext(WalkInCustomerFormContext);
  const {
    formState: { errors },
    control,
    register,
    watch,
  } = walkInCustomerFormContext.form;

  const formValues = watch();

  const watchCountryId =
    formValues?.basicInformation?.addressInformation?.countryId;

  const countriesQuery = useCountriesQuery();

  const countryName = countriesQuery.data?.find(
    (item) => item.id === Number(watchCountryId)
  )?.name;

  const citiesQuery = useCitiesQuery(countryName);

  return (
    <>
      <Input
        id="address"
        label={tr(editAddressDataI18n.address)}
        isFullWidth
        isRequired
        register={register("basicInformation.addressInformation.address")}
        errorMessage={
          errors.basicInformation?.addressInformation?.address?.message
        }
      />

      <Select
        id="countryOfResidence"
        label={tr(editAddressDataI18n.countryId)}
        isRequired
        name={"basicInformation.addressInformation.countryId"}
        control={control}
        errorMessage={
          errors.basicInformation?.addressInformation?.countryId?.message
        }
        data={countriesQuery.data}
      />

      <Select
        id="cityOfResidence"
        isRequired
        label={tr(editAddressDataI18n.cityId)}
        name={"basicInformation.addressInformation.cityId"}
        control={control}
        errorMessage={
          errors.basicInformation?.addressInformation?.cityId?.message
        }
        data={citiesQuery.data}
      />
    </>
  );
};
