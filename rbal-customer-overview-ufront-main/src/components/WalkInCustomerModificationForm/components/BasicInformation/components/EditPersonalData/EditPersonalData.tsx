import { useContext } from "react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack } from "@rbal-modern-luka/ui-library";
import {
  useCountriesQuery,
  useGendersQuery,
  useMaritalStatusesQuery,
} from "~/features/dictionaries/dictionariesQueries";
import { editPersonalDataI18n } from "./EditPersonalData.i18n";
import { Input } from "~/components/Input/Input";
import { Select } from "~/components/Select/Select";
import { format } from "date-fns";
import { styles } from "~/components/WalkInCustomerModificationForm/WalkInCustomerModificationForm.styles";
import { WalkInCustomerFormContext } from "~/components/WalkInCustomerModificationForm/context/WalkInCustomerFormContext";
import { fatcaUsIndiciaNotification } from "~/modules/EditCustomer/utils";
import { Country, FatcaStatusType } from "~/modules/EditCustomer/types";
import { toasterNotificationI18n } from "~/modules/EditCustomer/Translations/ToasterNotification.118n";

export const EditPersonalData = () => {
  const { tr } = useI18n();

  const walkingCustomerFormContext = useContext(WalkInCustomerFormContext);
  const {
    control,
    formState: { errors },
    register,
    getValues,
    setValue,
  } = walkingCustomerFormContext.form;

  const currentNationalityId = getValues(
    "basicInformation.personalInformation.nationalityId"
  );

  const countriesQuery = useCountriesQuery();
  const gendersQuery = useGendersQuery();
  const maritalStatusesQuery = useMaritalStatusesQuery();

  return (
    <>
      <Stack d="h" customStyle={styles.row}>
        <Input
          id="firstName"
          label={tr(editPersonalDataI18n.firstName)}
          register={register("basicInformation.personalInformation.firstName")}
          errorMessage={
            errors.basicInformation?.personalInformation?.firstName?.message
          }
          isRequired
        />

        <Input
          id="lastName"
          label={tr(editPersonalDataI18n.lastName)}
          register={register("basicInformation.personalInformation.lastName")}
          errorMessage={
            errors.basicInformation?.personalInformation?.lastName?.message
          }
          isRequired
        />

        <Input
          id="fatherName"
          label={tr(editPersonalDataI18n.fatherName)}
          register={register("basicInformation.personalInformation.fatherName")}
          errorMessage={
            errors.basicInformation?.personalInformation?.fatherName?.message
          }
          isRequired
        />
      </Stack>

      <Stack d="h" customStyle={styles.row}>
        <Input
          id="motherName"
          label={tr(editPersonalDataI18n.motherName)}
          register={register("basicInformation.personalInformation.motherName")}
          errorMessage={
            errors.basicInformation?.personalInformation?.motherName?.message
          }
        />

        <Input
          type="date"
          id="birthdate"
          label={tr(editPersonalDataI18n.birthdate)}
          register={register("basicInformation.personalInformation.birthdate")}
          errorMessage={
            errors.basicInformation?.personalInformation?.birthdate?.message
          }
          isRequired
          max={format(new Date(), "yyyy-MM-dd")}
        />

        <Select
          id="nationality"
          label={tr(editPersonalDataI18n.nationalityId)}
          name={"basicInformation.personalInformation.nationalityId"}
          control={control}
          errorMessage={
            errors.basicInformation?.personalInformation?.nationalityId?.message
          }
          customOnChange={(option) => {
            fatcaUsIndiciaNotification({
              newValue: option?.id,
              indicia: Country.Usa,
              message: tr(toasterNotificationI18n.fatcaUsIndicia),
              currentValue: currentNationalityId,
            });
            if (option?.id == Country.Usa || option?.id == Country.Canada)
              setValue(
                "additionalInformation.fatcaInformation.fatcaStatusId",
                FatcaStatusType.SpecifiedUS
              );
          }}
          data={countriesQuery.data}
          isRequired
        />
      </Stack>

      <Stack d="h" customStyle={styles.row}>
        <Select
          id="countryOfBirthId"
          label={tr(editPersonalDataI18n.countryOfBirthId)}
          name={"basicInformation.personalInformation.countryOfBirthId"}
          control={control}
          errorMessage={
            errors.basicInformation?.personalInformation?.countryOfBirthId
              ?.message
          }
          customOnChange={(option) => {
            fatcaUsIndiciaNotification({
              newValue: option?.id,
              indicia: Country.Usa,
              message: tr(toasterNotificationI18n.fatcaUsIndicia),
              currentValue: currentNationalityId,
            });
            if (option?.id == Country.Usa || option?.id == Country.Canada)
              setValue(
                "additionalInformation.fatcaInformation.fatcaStatusId",
                FatcaStatusType.SpecifiedUS
              );
          }}
          data={countriesQuery.data}
          isRequired
        />

        <Input
          id="birthplace"
          label={tr(editPersonalDataI18n.birthplace)}
          name={"basicInformation.personalInformation.birthplace"}
          register={register("basicInformation.personalInformation.birthplace")}
          errorMessage={
            errors.basicInformation?.personalInformation?.birthplace?.message
          }
          isRequired
        />

        <Select
          id="genderId"
          label={tr(editPersonalDataI18n.genderId)}
          name={"basicInformation.personalInformation.genderId"}
          control={control}
          errorMessage={
            errors.basicInformation?.personalInformation?.genderId?.message
          }
          data={gendersQuery.data}
          isRequired
        />
      </Stack>

      <Stack d="h" customStyle={styles.row}>
        <Select
          id="civilStatus"
          label={tr(editPersonalDataI18n.martialStatusId)}
          name={"basicInformation.personalInformation.martialStatusId"}
          control={control}
          errorMessage={
            errors.basicInformation?.personalInformation?.martialStatusId
              ?.message
          }
          data={maritalStatusesQuery.data}
          shouldGrow
        />

        <Input
          id="otherLastName"
          label={tr(editPersonalDataI18n.additionalLastName)}
          register={register("basicInformation.personalInformation.maidenName")}
          shouldGrow
        />
      </Stack>
    </>
  );
};
