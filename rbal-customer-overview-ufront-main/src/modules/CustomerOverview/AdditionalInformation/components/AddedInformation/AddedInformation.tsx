import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { AddedInfoDto } from "~/api/customer/customerApi.types";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { addedInformationi18n } from "./AddedInformation.i18n";
import { booleansI18n } from "~/features/i18n";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";
import { useMemo } from "react";

interface AddedInformationProps {
  addedInfo?: AddedInfoDto;
}

export const AddedInformation: React.FC<AddedInformationProps> = ({
  addedInfo,
}) => {
  const { tr } = useI18n();

  const addedInfoRows = useMemo(
    () => ({
      title: tr(addedInformationi18n.header),
      data: [
        {
          label: tr(addedInformationi18n.planProduct),
          value: addedInfo?.planProduct,
        },
        {
          label: tr(addedInformationi18n.custRiskClassification),
          value: addedInfo?.custRiskClassification,
        },
        {
          label: tr(addedInformationi18n.naceCode),
          value: addedInfo?.naceCode,
        },
        {
          label: tr(addedInformationi18n.amlExemption),
          value: addedInfo?.amlExemption,
        },
        {
          label: tr(addedInformationi18n.isPep),
          value: addedInfo?.isPep ? tr(booleansI18n.yes) : tr(booleansI18n.no),
        },
        {
          label: tr(addedInformationi18n.isFisa),
          value: addedInfo?.isFisa ? tr(booleansI18n.yes) : tr(booleansI18n.no),
        },
      ],
    }),
    [tr, addedInfo]
  );

  return (
    <Stack gap="0">
      <RowHeader
        label={
          <Text
            size="16"
            weight="bold"
            text={tr(addedInformationi18n.header)}
          />
        }
      />
      <InfoRows rows={addedInfoRows} />
    </Stack>
  );
};
