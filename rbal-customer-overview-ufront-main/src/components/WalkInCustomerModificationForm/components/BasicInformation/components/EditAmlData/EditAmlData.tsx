import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Input } from "~/components/Input/Input";
import { useContext } from "react";
import { Select } from "~/components/Select/Select";
import { useEducationLevelsQuery } from "~/features/dictionaries/dictionariesQueries";
import { editAmlDataI18n } from "./EditAmlData.i18n";
import { WalkInCustomerFormContext } from "~/components/WalkInCustomerModificationForm/context/WalkInCustomerFormContext";

export const EditAmlData = () => {
  const { tr } = useI18n();

  const walkInCustomerFormContext = useContext(WalkInCustomerFormContext);

  const {
    formState: { errors },
    control,
    register,
  } = walkInCustomerFormContext.form;

  const { data: educationLevelsData } = useEducationLevelsQuery();

  return (
    <>
      <Select
        id="educationLevel"
        label={tr(editAmlDataI18n.educationLevelId)}
        name={"basicInformation.amlInformation.educationLevelId"}
        control={control}
        errorMessage={
          errors.basicInformation?.amlInformation?.educationLevelId?.message
        }
        data={educationLevelsData}
        isRequired
      />
      <Input
        id="overallRiskRating"
        label={tr(editAmlDataI18n.overallRiskRating)}
        register={register("basicInformation.amlInformation.overallRiskRating")}
        errorMessage={
          errors.basicInformation?.amlInformation?.overallRiskRating?.message
        }
        disabled
      />
      <Input
        type="date"
        id="dateOfDeath"
        max="9999-12-31"
        label={tr(editAmlDataI18n.dateOfDeath)}
        register={register("basicInformation.amlInformation.deathDate")}
        errorMessage={
          errors.basicInformation?.amlInformation?.deathDate?.message
        }
      />
    </>
  );
};
