import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Input } from "~/components/Input/Input";
import { useContext } from "react";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";
import { editAdditionalInformationI18n } from "../../EditAdditionalInformation.i18n";
import { Select } from "~/components/Select/Select";
import { useEducationLevelsQuery } from "~/features/dictionaries/dictionariesQueries";

export const Aml = () => {
  const { tr } = useI18n();

  const customerFormContext = useContext(CustomerFormContext);

  const {
    formState: { errors },
    control,
    register,
  } = customerFormContext.form;

  const { data: educationLevelsData } = useEducationLevelsQuery();

  return (
    <>
      <Select
        id="educationLevel"
        label={tr(editAdditionalInformationI18n.educationLevelId)}
        name={"additionalInformation.amlData.educationLevelId"}
        control={control}
        errorMessage={
          errors.additionalInformation?.amlData?.educationLevelId?.message
        }
        data={educationLevelsData}
        isRequired
      />
      <Input
        id="overallRiskRating"
        label={tr(editAdditionalInformationI18n.overallRiskRating)}
        register={register("additionalInformation.amlData.overallRiskRating")}
        errorMessage={
          errors.additionalInformation?.amlData?.overallRiskRating?.message
        }
        disabled
      />
      <Input
        type="date"
        id="dateOfDeath"
        max="9999-12-31"
        label={tr(editAdditionalInformationI18n.dateOfDeath)}
        register={register("additionalInformation.amlData.deathDate")}
        errorMessage={errors.additionalInformation?.amlData?.deathDate?.message}
      />
    </>
  );
};
