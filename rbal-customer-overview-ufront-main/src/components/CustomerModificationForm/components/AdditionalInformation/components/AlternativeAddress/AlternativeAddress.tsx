import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Input } from "~/components/Input/Input";
import { Select } from "~/components/Select/Select";
import { useContext } from "react";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";
import { editAdditionalInformationI18n } from "../../EditAdditionalInformation.i18n";
import {
  useCitiesQuery,
  useCountriesQuery,
} from "~/features/dictionaries/dictionariesQueries";

export const AlternativeAddress = () => {
  const { tr } = useI18n();

  const customerFormContext = useContext(CustomerFormContext);

  const {
    formState: { errors },
    control,
    register,
    watch,
  } = customerFormContext.form;

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
        label={tr(editAdditionalInformationI18n.residentialAddress)}
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
        label={tr(editAdditionalInformationI18n.countryResidenceId)}
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
        label={tr(editAdditionalInformationI18n.citizenshipId)}
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
        label={tr(editAdditionalInformationI18n.cityResidenceId)}
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
        label={tr(editAdditionalInformationI18n.stateOfTaxPaymentId)}
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
