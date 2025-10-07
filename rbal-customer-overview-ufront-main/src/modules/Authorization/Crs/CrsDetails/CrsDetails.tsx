import {
  formatIntlLocalDate,
  useI18n,
} from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { useMemo } from "react";
import { CrsData } from "~/api/authorization/authorizationApi.types";
import { booleansI18n } from "~/features/i18n";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { TaxInformationTable } from "~/modules/CustomerOverview/CRS/components/TaxInformation/TaxInformationTable";
import { crsDetailsi18n } from "./CrsDetails.i18n";
import { styles } from "./CrsDetails.styles";

interface CrsDetailsDataProps {
  crsDetailsData?: CrsData;
}

export const CrsDetails = ({ crsDetailsData }: CrsDetailsDataProps) => {
  const { tr } = useI18n();

  const crsDetailsInfoRows = useMemo(
    () => ({
      title: tr(crsDetailsi18n.crsDetails),
      data: [
        {
          label: tr(crsDetailsi18n.scDate),
          value: formatIntlLocalDate(crsDetailsData?.crsDetails.crsSCDate),
        },
        {
          label: tr(crsDetailsi18n.cureFlag),
          value: crsDetailsData?.crsDetails.crsCureFlag
            ? tr(booleansI18n.yes)
            : tr(booleansI18n.no),
        },
        {
          label: tr(crsDetailsi18n.businessEntityStatus),
          value: crsDetailsData?.crsDetails.crsBusinessEntityStatus,
        },
        {
          label: tr(crsDetailsi18n.action),
          value: crsDetailsData?.crsDetails.crsAction,
        },
        {
          label: tr(crsDetailsi18n.actionExpireDate),
          value: formatIntlLocalDate(
            crsDetailsData?.crsDetails.crsActionExpireDate
          ),
        },
        {
          label: tr(crsDetailsi18n.enhanceReviewDate),
          value: formatIntlLocalDate(
            crsDetailsData?.crsDetails.enhanceReviewDateCrs
          ),
        },
        {
          label: tr(crsDetailsi18n.crsStatus),
          value: crsDetailsData?.crsDetails.crsStatus,
        },
      ],
    }),
    [tr, crsDetailsData]
  );

  return (
    <Stack>
      <Stack gap="0" customStyle={styles.content}>
        <RowHeader
          label={
            <Text
              size="16"
              weight="bold"
              text={tr(crsDetailsi18n.crsDetails)}
            />
          }
        />
        <InfoRows rows={crsDetailsInfoRows} />
      </Stack>
      <Stack
        customStyle={styles.tableContainer}
        gap={!crsDetailsData?.crsTaxInformation ? "0" : "12"}
      >
        <RowHeader
          withBorder={false}
          label={
            <Text
              size="16"
              weight="bold"
              text={tr(crsDetailsi18n.taxInformation)}
            />
          }
        />
        <TaxInformationTable
          taxInformations={crsDetailsData?.crsTaxInformation}
        />
      </Stack>
    </Stack>
  );
};
