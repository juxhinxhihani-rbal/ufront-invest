import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { useContext } from "react";
import { Select } from "~/components/Select/Select";
import { WalkInCustomerFormContext } from "~/components/WalkInCustomerModificationForm/context/WalkInCustomerFormContext";
import {
  useInstitutionsQuery,
  useMinistriesQuery,
  useProfessionsQuery,
} from "~/features/dictionaries/dictionariesQueries";
import { editEmploymentDataI18n } from "./EditEmploymentData.i18n";

export const EditEmploymentData = () => {
  const { tr } = useI18n();

  const walkInCustomerFormContext = useContext(WalkInCustomerFormContext);

  const {
    formState: { errors },
    control,
    watch,
  } = walkInCustomerFormContext.form;

  const watchMinistryId = watch(
    "additionalInformation.employmentData.ministryId"
  );

  const { data: professionsData } = useProfessionsQuery();
  const { data: ministriesData } = useMinistriesQuery();
  const { data: institutionsData } = useInstitutionsQuery(
    watchMinistryId?.toString()
  );

  return (
    <>
      <Select
        id="profession"
        label={tr(editEmploymentDataI18n.profession)}
        name={"additionalInformation.employmentData.professionId"}
        control={control}
        errorMessage={
          errors.additionalInformation?.employmentData?.professionId?.message
        }
        data={professionsData}
      />
      <Select
        id="ministry"
        label={tr(editEmploymentDataI18n.ministry)}
        name={"additionalInformation.employmentData.ministryId"}
        control={control}
        errorMessage={
          errors.additionalInformation?.employmentData?.ministryId?.message
        }
        data={ministriesData}
        disabled
      />
      <Select
        id="institution"
        label={tr(editEmploymentDataI18n.institution)}
        name={"additionalInformation.employmentData.dicasteryId"}
        control={control}
        errorMessage={
          errors.additionalInformation?.employmentData?.dicasteryId?.message
        }
        data={institutionsData}
      />
    </>
  );
};
