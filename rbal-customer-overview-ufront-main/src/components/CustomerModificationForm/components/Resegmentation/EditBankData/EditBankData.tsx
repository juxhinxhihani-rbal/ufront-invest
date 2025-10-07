import { useContext } from "react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { editBankDataI18n } from "./EditBankData.i18n";
import {
  useMainCustomerSegment,
  useCustomerSegment,
} from "~/features/dictionaries/dictionariesQueries";
import { Select } from "~/components/Select/Select";
import { Input } from "~/components/Input/Input";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";

export const EditBankData = () => {
  const { tr } = useI18n();

  const customerFormContext = useContext(CustomerFormContext);
  const { isCreateMode, isResegmentation } = customerFormContext;
  const {
    control,
    register,
    watch,
    formState: { errors, isSubmitted },
    trigger,
  } = customerFormContext.form;

  const formValues = watch();
  const mainCustomerSegmentQuery = useMainCustomerSegment();
  const customerSegmentQuery = useCustomerSegment(
    formValues?.customerInformation?.mainSegmentId
  );

  const filteredCustomerSegmentData = customerSegmentQuery.data
    ?.filter((segment) => {
      if (isCreateMode) {
        return !segment.isRetired;
      }
      return true;
    })
    .map((segment) => ({
      ...segment,
      isOptionDisabled: isResegmentation && segment.isRetired,
    }));

  return (
    <>
      <Select
        id="mainSegmentId"
        label={tr(editBankDataI18n.mainSegmentId)}
        isRequired
        name={"customerInformation.mainSegmentId"}
        control={control}
        errorMessage={errors.customerInformation?.mainSegmentId?.message}
        data={mainCustomerSegmentQuery.data}
      />

      <Select
        id="customerSegment"
        label={tr(editBankDataI18n.customerSegmentId)}
        isRequired
        name={"customerInformation.customerSegmentId"}
        control={control}
        data={filteredCustomerSegmentData}
        customOnChange={() => {
          isSubmitted &&
            void trigger("additionalInformation.cbConsent.cbConsentAgreed");
        }}
        errorMessage={errors.customerInformation?.customerSegmentId?.message}
      />

      <Input
        id="customerNumber"
        label={tr(editBankDataI18n.customerNumber)}
        register={register("customerNumber")}
        disabled
      />

      <Input
        id="reportName"
        label={tr(editBankDataI18n.reportName)}
        register={register("customerInformation.reportName")}
        disabled
      />
    </>
  );
};
