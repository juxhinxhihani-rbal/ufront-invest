import React, { useMemo } from "react";
import {
  formatIntlLocalDate,
  useI18n,
} from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { AmlDto } from "~/api/customer/customerApi.types";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { amlDatai18n } from "./AMLData.i18n";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";

interface AMLDataProps {
  amlData?: AmlDto;
}

export const AMLData: React.FC<AMLDataProps> = ({ amlData }) => {
  const { tr } = useI18n();

  const amlRows = useMemo(
    () => ({
      title: tr(amlDatai18n.header),
      data: [
        {
          label: tr(amlDatai18n.educationLevel),
          value: amlData?.educationLevel,
        },
        {
          label: tr(amlDatai18n.overallRiskRating),
          value: amlData?.overallRiskRating,
        },
        {
          label: tr(amlDatai18n.deathDate),
          value: formatIntlLocalDate(amlData?.deathDate),
        },
      ],
    }),
    [amlData, tr]
  );

  return (
    <Stack gap="0">
      <RowHeader
        label={<Text size="16" weight="bold" text={tr(amlDatai18n.header)} />}
      />
      <InfoRows rows={amlRows} />
    </Stack>
  );
};
