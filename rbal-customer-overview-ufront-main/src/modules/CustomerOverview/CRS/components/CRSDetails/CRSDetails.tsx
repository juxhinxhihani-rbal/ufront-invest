import {
  formatIntlLocalDate,
  useI18n,
} from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { crsDetailsI18n } from "./CRSDetails.i18n";
import { booleansI18n } from "~/features/i18n";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";
import { CrsDetailsDto } from "~/api/customer/customerApi.types";
import { useMemo } from "react";

interface CrsDetailsProps {
  crsDetails?: CrsDetailsDto;
}

export const CRSDetails: React.FC<CrsDetailsProps> = ({ crsDetails }) => {
  const { tr } = useI18n();

  const crsRows = useMemo(
    () => ({
      title: tr(crsDetailsI18n.header),
      data: [
        {
          label: tr(crsDetailsI18n.hasCureFlag),
          value: crsDetails?.crsCureFlag
            ? tr(booleansI18n.yes)
            : tr(booleansI18n.no),
        },
        {
          label: tr(crsDetailsI18n.scDate),
          value: formatIntlLocalDate(crsDetails?.crsSCDate),
        },
        {
          label: tr(crsDetailsI18n.action),
          value: crsDetails?.crsAction,
        },
        {
          label: tr(crsDetailsI18n.actionExpiryDate),
          value: formatIntlLocalDate(crsDetails?.crsActionExpireDate),
        },
        {
          label: tr(crsDetailsI18n.enhanceReviewDate),
          value: formatIntlLocalDate(crsDetails?.enhanceReviewDateCrs),
        },
        {
          label: tr(crsDetailsI18n.crsStatus),
          value: crsDetails?.crsStatus,
        },
      ],
    }),
    [crsDetails, tr]
  );

  return (
    <Stack gap="0">
      <RowHeader
        label={
          <Text size="16" weight="bold" text={tr(crsDetailsI18n.header)} />
        }
      />
      <InfoRows rows={crsRows} />
    </Stack>
  );
};
