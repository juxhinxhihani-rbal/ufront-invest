import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { useContext } from "react";
import { useFatcaStatusTypes } from "~/features/dictionaries/dictionariesQueries";
import { Input } from "~/components/Input/Input";
import { Select } from "~/components/Select/Select";
import { editFatcaInformationI18n } from "./EditFatcaInformation.i18n";
import { WalkInCustomerFormContext } from "~/components/WalkInCustomerModificationForm/context/WalkInCustomerFormContext";
import { FatcaStatusType } from "~/modules/EditCustomer/types";

export const EditFatcaInformation = () => {
  const { tr } = useI18n();
  const walkInCustomerFormContext = useContext(WalkInCustomerFormContext);

  const {
    control,
    formState: { errors },
    register,
    watch,
  } = walkInCustomerFormContext.form;

  const currentFatcaStatusId = watch(
    "additionalInformation.fatcaInformation.fatcaStatusId"
  );
  const fatcaStatusTypesQuery = useFatcaStatusTypes();

  return (
    <>
      <Input
        type="date"
        id="documentaryDate"
        max="9999-12-31"
        label={tr(editFatcaInformationI18n.documentaryDate)}
        register={register(
          "additionalInformation.fatcaInformation.documentaryDate"
        )}
        errorMessage={
          errors.additionalInformation?.fatcaInformation?.documentaryDate
            ?.message
        }
        disabled={currentFatcaStatusId != FatcaStatusType.SpecifiedUS}
      />

      <Input
        type="date"
        id="documentaryDeadline"
        max="9999-12-31"
        label={tr(editFatcaInformationI18n.documentaryDeadline)}
        register={register(
          "additionalInformation.fatcaInformation.documentaryDeadline"
        )}
        disabled={currentFatcaStatusId != FatcaStatusType.SpecifiedUS}
      />

      <Select
        id="status"
        label={tr(editFatcaInformationI18n.status)}
        name={"additionalInformation.fatcaInformation.fatcaStatusId"}
        control={control}
        data={fatcaStatusTypesQuery.data}
        disabled
      />
    </>
  );
};
