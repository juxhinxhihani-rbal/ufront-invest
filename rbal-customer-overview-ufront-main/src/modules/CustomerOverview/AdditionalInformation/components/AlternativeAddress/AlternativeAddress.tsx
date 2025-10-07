import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { AlternativeAddressDto } from "~/api/customer/customerApi.types";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { alternativeAddressi18n } from "./AlternativeAddress.i18n";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";
import { useMemo } from "react";

interface AlternativeAddressProps {
  alternativeAddress?: AlternativeAddressDto;
}

export const AlternativeAddress: React.FC<AlternativeAddressProps> = ({
  alternativeAddress,
}) => {
  const { tr } = useI18n();

  const addressRows = useMemo(
    () => ({
      title: tr(alternativeAddressi18n.header),
      data: [
        {
          label: tr(alternativeAddressi18n.residentialAddress),
          value: alternativeAddress?.residentialAddress,
        },
        {
          label: tr(alternativeAddressi18n.countryOfResidence),
          value: alternativeAddress?.countryResidence,
        },
        {
          label: tr(alternativeAddressi18n.citizenship),
          value: alternativeAddress?.citizenship,
        },
        {
          label: tr(alternativeAddressi18n.cityOfResidence),
          value: alternativeAddress?.cityResidence,
        },
        {
          label: tr(alternativeAddressi18n.taxesState),
          value: alternativeAddress?.stateOfTaxPayment,
        },
      ],
    }),
    [tr, alternativeAddress]
  );

  return (
    <Stack gap="0">
      <RowHeader
        label={
          <Text
            size="16"
            weight="bold"
            text={tr(alternativeAddressi18n.header)}
          />
        }
      />
      <InfoRows rows={addressRows} />
    </Stack>
  );
};
