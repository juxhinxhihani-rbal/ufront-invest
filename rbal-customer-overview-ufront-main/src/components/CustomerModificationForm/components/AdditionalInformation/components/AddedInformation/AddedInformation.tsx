import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Select } from "~/components/Select/Select";
import { useContext } from "react";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";
import { editAdditionalInformationI18n } from "../../EditAdditionalInformation.i18n";
import { Stack } from "@rbal-modern-luka/ui-library";
import { styles } from "./AddedInformation.styles";
import {
  useCustomerRiskClassificationsQuery,
  useNaceCodesQuery,
  usePlanProductsQuery,
  useRiskRatingsQuery,
} from "~/features/dictionaries/dictionariesQueries";
import { Checkbox } from "~/components/Checkbox/Checkbox";

export const AddedInformation = () => {
  const { tr } = useI18n();

  const customerFormContext = useContext(CustomerFormContext);

  const {
    formState: { errors },
    control,
  } = customerFormContext.form;

  const { data: planProductsData } = usePlanProductsQuery();
  const { data: customerRiskClassificationsData } =
    useCustomerRiskClassificationsQuery();
  const { data: riskRatingsData } = useRiskRatingsQuery();
  const { data: naceCodesData } = useNaceCodesQuery();

  return (
    <Stack customStyle={styles.fill} d="v">
      <Stack d="h">
        <Select
          id="planProduct"
          label={tr(editAdditionalInformationI18n.planProductId)}
          name={"additionalInformation.addedInfo.planProductId"}
          control={control}
          errorMessage={
            errors.additionalInformation?.addedInfo?.planProductId?.message
          }
          data={planProductsData}
          shouldGrow
          disabled
        />
        <Select
          id="customerRiskClassification"
          label={tr(editAdditionalInformationI18n.custRiskClassificationId)}
          name={"additionalInformation.addedInfo.custRiskClassificationId"}
          control={control}
          errorMessage={
            errors.additionalInformation?.addedInfo?.custRiskClassificationId
              ?.message
          }
          disabled
          data={customerRiskClassificationsData}
          shouldGrow
        />
      </Stack>
      <Stack d="h">
        <Select
          id="naceCode"
          label={tr(editAdditionalInformationI18n.naceCodeId)}
          name={"additionalInformation.addedInfo.naceCodeId"}
          control={control}
          errorMessage={
            errors.additionalInformation?.addedInfo?.naceCodeId?.message
          }
          data={naceCodesData}
          disabled
          shouldGrow
        />
        <Select
          id="amlExemption"
          label={tr(editAdditionalInformationI18n.amlExemptionId)}
          name={"additionalInformation.addedInfo.amlExemptionId"}
          control={control}
          errorMessage={
            errors.additionalInformation?.addedInfo?.amlExemptionId?.message
          }
          data={riskRatingsData}
          shouldGrow
          disabled
        />
      </Stack>
      <Stack d="h">
        <Checkbox
          name={"additionalInformation.addedInfo.isPep"}
          text={tr(editAdditionalInformationI18n.isPep)}
          control={control}
          disabled
        />
        <Checkbox
          name={"additionalInformation.addedInfo.isFisa"}
          text={tr(editAdditionalInformationI18n.isFisa)}
          control={control}
          disabled
        />
      </Stack>
    </Stack>
  );
};
