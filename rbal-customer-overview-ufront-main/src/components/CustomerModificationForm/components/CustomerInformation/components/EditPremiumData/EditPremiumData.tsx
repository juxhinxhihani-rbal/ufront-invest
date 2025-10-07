import { useContext } from "react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Select } from "~/components/Select/Select";
import {
  useAccountOfficersQuery,
  useSegmentCriteriasQuery,
} from "~/features/dictionaries/dictionariesQueries";
import { editPremiumDataI18n } from "./EditPremiumData.i18n";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";

export const EditPremiumData = () => {
  const { tr } = useI18n();

  const customerFormContext = useContext(CustomerFormContext);

  const {
    watch,
    control,
    formState: { errors },
  } = customerFormContext.form;

  const watchCustomerSegmentId = watch("customerInformation.customerSegmentId");

  const accountOfficersQuery = useAccountOfficersQuery(watchCustomerSegmentId);
  const segmentCriteriasQuery = useSegmentCriteriasQuery();

  return (
    <>
      <Select
        id="accountOfficer"
        label={tr(editPremiumDataI18n.accountOfficerId)}
        isRequired
        name={"customerInformation.premiumData.accountOfficerId"}
        control={control}
        data={accountOfficersQuery.data}
        errorMessage={
          errors.customerInformation?.premiumData?.accountOfficerId?.message
        }
      />

      <Select
        id="premiumCriteria"
        label={tr(editPremiumDataI18n.segmentCriteriaId)}
        isRequired
        name={"customerInformation.premiumData.segmentCriteriaId"}
        control={control}
        data={segmentCriteriasQuery.data}
        errorMessage={
          errors.customerInformation?.premiumData?.segmentCriteriaId?.message
        }
      />
    </>
  );
};
