import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { useContext, useMemo } from "react";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";
import { editAdditionalInformationI18n } from "../../EditAdditionalInformation.i18n";
import { Select } from "~/components/Select/Select";
import { useChoosingReasonsQuery } from "~/features/dictionaries/dictionariesQueries";

export const ChoosingReason = () => {
  const { tr } = useI18n();

  const customerFormContext = useContext(CustomerFormContext);

  const {
    formState: { errors },
    control,
    getValues,
  } = customerFormContext.form;

  const { data: choosingReasonsData } = useChoosingReasonsQuery();

  const isChoosingReasonNotNull = useMemo(
    () => !getValues("additionalInformation.choosingReason.choosingReasonId"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <>
      <Select
        id="choosingReason"
        label={tr(editAdditionalInformationI18n.choosingReasonId)}
        name={"additionalInformation.choosingReason.choosingReasonId"}
        control={control}
        errorMessage={
          errors.additionalInformation?.choosingReason?.choosingReasonId
            ?.message
        }
        isRequired
        data={choosingReasonsData}
        disabled={!customerFormContext.isCreateMode && isChoosingReasonNotNull}
      />
    </>
  );
};
