import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Input } from "~/components/Input/Input";
import { Select } from "~/components/Select/Select";
import { useContext } from "react";
import {
  useCitiesQuery,
  useCountriesQuery,
} from "~/features/dictionaries/dictionariesQueries";
import { editAlternativeAddressI18n } from "./EditAlternativeAddress.i18n";
import { WalkInCustomerFormContext } from "~/components/WalkInCustomerModificationForm/context/WalkInCustomerFormContext";

export const EditAlternativeAddress = () => {
  const { tr } = useI18n();

  const walkInCustomerFormContext = useContext(WalkInCustomerFormContext);

  const {
    formState: { errors },
    control,
    register,
    watch,
  } = walkInCustomerFormContext.form;

  const countriesQuery = useCountriesQuery();
  const watchCountryResidenceId = watch(
    "additionalInformation.alternativeAddress.countryResidenceId"
  );
  const countryName = countriesQuery.data?.find(
    (item) => item.id === Number(watchCountryResidenceId)
  )?.name;

  const citiesQuery = useCitiesQuery(countryName);

  return (
    <>
      <Input
        id="homeAddress"
        label={tr(editAlternativeAddressI18n.residentialAddress)}
        register={register(
          "additionalInformation.alternativeAddress.residentialAddress"
        )}
        errorMessage={
          errors.additionalInformation?.alternativeAddress?.residentialAddress
            ?.message
        }
      />
      <Select
        id="countryOfResidence"
        label={tr(editAlternativeAddressI18n.countryOfResidence)}
        name={"additionalInformation.alternativeAddress.countryResidenceId"}
        control={control}
        errorMessage={
          errors.additionalInformation?.alternativeAddress?.countryResidenceId
            ?.message
        }
        data={countriesQuery.data}
      />
      <Select
        id="nationality"
        label={tr(editAlternativeAddressI18n.citizenship)}
        name={"additionalInformation.alternativeAddress.citizenshipId"}
        control={control}
        errorMessage={
          errors.additionalInformation?.alternativeAddress?.citizenshipId
            ?.message
        }
        data={countriesQuery.data}
      />
      <Select
        id="cityOfResidence"
        label={tr(editAlternativeAddressI18n.cityOfResidence)}
        name={"additionalInformation.alternativeAddress.cityResidenceId"}
        control={control}
        errorMessage={
          errors.additionalInformation?.alternativeAddress?.cityResidenceId
            ?.message
        }
        data={citiesQuery.data}
      />
      <Select
        id="taxResidenceCountry"
        label={tr(editAlternativeAddressI18n.taxesState)}
        name={"additionalInformation.alternativeAddress.stateOfTaxPaymentId"}
        control={control}
        errorMessage={
          errors.additionalInformation?.alternativeAddress?.stateOfTaxPaymentId
            ?.message
        }
        data={countriesQuery.data}
      />
    </>
  );
};
