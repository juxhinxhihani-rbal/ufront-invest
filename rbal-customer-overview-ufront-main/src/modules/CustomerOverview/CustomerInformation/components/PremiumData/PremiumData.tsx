import { useMemo } from "react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { premiumDataI18n } from "./PremiumData.i18n";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { CustomerDto } from "~/api/customer/customerApi.types";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";

interface PremiumDataProps {
  customer?: CustomerDto;
}

export const PremiumData: React.FC<PremiumDataProps> = ({ customer }) => {
  const { tr } = useI18n();

  const infoRows = useMemo(
    () => ({
      title: tr(premiumDataI18n.header),
      data: [
        {
          label: tr(premiumDataI18n.accountOfficer),
          value: customer?.customerInformation.premiumData?.accountOfficerName,
        },
        {
          label: tr(premiumDataI18n.premiumCriteria),
          value: customer?.customerInformation.premiumData?.segmentCriteriaName,
        },
      ],
    }),
    [tr, customer]
  );

  return (
    <Stack gap="0">
      <RowHeader
        label={
          <Text size="16" weight="bold" text={tr(premiumDataI18n.header)} />
        }
      />
      <InfoRows
        rows={{
          title: infoRows.title,
          data: infoRows.data.map((row) => ({
            ...row,
            id: `info-detail-${row.label.toLowerCase().replace(/\s+/g, "-")}`,
          })),
        }}
      />
    </Stack>
  );
};
