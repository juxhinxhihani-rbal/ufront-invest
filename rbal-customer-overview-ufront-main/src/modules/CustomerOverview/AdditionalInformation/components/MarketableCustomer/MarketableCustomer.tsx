import {
  formatIntlLocalDateTime,
  useI18n,
} from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import {
  ConsentStatus,
  MarketableCustomerDto,
} from "~/api/customer/customerApi.types";
import { consentStatusI18n } from "~/features/i18n/consentStatus.i18n";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { marketableCustomeri18n } from "./MarketableCustomer.i18n";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";

interface MarketableCustomerProps {
  marketableCustomer?: MarketableCustomerDto;
}

export const MarketableCustomer: React.FC<MarketableCustomerProps> = ({
  marketableCustomer,
}) => {
  const { tr } = useI18n();

  const infoRows = {
    title: tr(marketableCustomeri18n.header),
    data: [
      {
        label: tr(marketableCustomeri18n.branchDigital),
        value: tr(
          consentStatusI18n[
            marketableCustomer?.branchOrDigital ?? ConsentStatus.None
          ]
        ),
      },
      {
        label: tr(marketableCustomeri18n.marketableCustomerDate),
        value: formatIntlLocalDateTime(
          marketableCustomer?.marketableCustomerDateTime
        ),
      },
    ],
  };

  return (
    <Stack gap="0">
      <RowHeader
        label={
          <Text
            size="16"
            weight="bold"
            text={tr(marketableCustomeri18n.header)}
          />
        }
      />
      <InfoRows rows={infoRows} />
    </Stack>
  );
};
