import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { useContext } from "react";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";
import { Select } from "~/components/Select/Select";
import {
  useInstitutionsQuery,
  useMinistriesQuery,
  useProfessionsQuery,
} from "~/features/dictionaries/dictionariesQueries";
import { editAdditionalInformationI18n } from "../../EditAdditionalInformation.i18n";

export const Employment = () => {
  const { tr } = useI18n();

  const customerFormContext = useContext(CustomerFormContext);

  const {
    formState: { errors },
    control,
    watch,
  } = customerFormContext.form;

  const watchMinistryId = watch(
    "additionalInformation.employment.ministry.ministryId"
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
        label={tr(editAdditionalInformationI18n.professionId)}
        name={"additionalInformation.employment.profession.professionId"}
        control={control}
        errorMessage={
          errors.additionalInformation?.employment?.profession?.professionId
            ?.message
        }
        data={professionsData}
      />
      <Select
        id="ministry"
        label={tr(editAdditionalInformationI18n.ministryId)}
        name={"additionalInformation.employment.ministry.ministryId"}
        control={control}
        data={ministriesData}
        disabled
      />
      <Select
        id="institution"
        label={tr(editAdditionalInformationI18n.dicasteryId)}
        name={"additionalInformation.employment.institution.dicasteryId"}
        control={control}
        errorMessage={
          errors.additionalInformation?.employment?.institution?.dicasteryId
            ?.message
        }
        data={institutionsData}
      />
    </>
  );
};
