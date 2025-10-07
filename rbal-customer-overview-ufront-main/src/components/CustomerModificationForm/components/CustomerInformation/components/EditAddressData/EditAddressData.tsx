import { useContext } from "react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";
import { Input } from "~/components/Input/Input";
import { Select } from "~/components/Select/Select";
import {
  useCitiesQuery,
  useCountriesQuery,
} from "~/features/dictionaries/dictionariesQueries";
import { editAddressDataI18n } from "./EditAddressData.i18n";
import { Country } from "~/modules/EditCustomer/types";
import { showCrsAndFatcaNotification } from "~/modules/EditCustomer/utils";
import { toasterNotificationI18n } from "~/modules/EditCustomer/Translations/ToasterNotification.118n";
import { getCountryCodeMobileId } from "~/common/utils";

export const EditAddressData = () => {
  const { tr } = useI18n();

  const customerFormContext = useContext(CustomerFormContext);
  const { isCreateMode } = customerFormContext;
  const {
    formState: { errors },
    control,
    register,
    watch,
    getValues,
  } = customerFormContext.form;

  const formValues = watch();

  const watchCountryId = formValues?.customerInformation?.address?.countryId;
  const currentCountryId = getValues("customerInformation.address.countryId");
  const currentNationalityId = getValues(
    "customerInformation.personalInfo.nationalityId"
  );
  const currentCountryOfResidence = getValues(
    "customerInformation.address.countryId"
  );
  const currentCountryCodeMobile = getValues(
    "customerInformation.contact.countryCodeMobile"
  );

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
        register={register("customerInformation.address.address")}
        errorMessage={errors.customerInformation?.address?.address?.message}
      />

      <Input
        id="zipCode"
        isRequired
        label={tr(editAddressDataI18n.zipCode)}
        register={register("customerInformation.address.zipCode")}
        errorMessage={errors.customerInformation?.address?.zipCode?.message}
      />

      <Select
        id="countryOfResidence"
        label={tr(editAddressDataI18n.countryId)}
        isRequired
        name={"customerInformation.address.countryId"}
        control={control}
        errorMessage={errors.customerInformation?.address?.countryId?.message}
        customOnChange={(option) => {
          showCrsAndFatcaNotification({
            fatcaUsIndica: {
              newValue: option?.id,
              indicia: Country.Usa,
              currentValue: currentCountryId,
            },
            message: {
              fatcaMessage: tr(toasterNotificationI18n.fatcaUsIndicia),
              crsAndFatcaMessage: tr(
                toasterNotificationI18n.crsAndFatcaIndicia
              ),
              crsMessage: tr(toasterNotificationI18n.crsIndicia),
            },
            crsNotification: {
              isCreateMode,
              newValue: Number(option?.id),
              nationalityId: currentNationalityId,
              countryId: currentCountryOfResidence,
              countryMobileId: getCountryCodeMobileId(currentCountryCodeMobile),
            },
          });
        }}
        data={countriesQuery.data}
      />

      <Select
        id="cityOfResidence"
        isRequired
        label={tr(editAddressDataI18n.cityId)}
        name={"customerInformation.address.cityId"}
        control={control}
        errorMessage={errors.customerInformation?.address?.cityId?.message}
        data={citiesQuery.data}
      />
    </>
  );
};
