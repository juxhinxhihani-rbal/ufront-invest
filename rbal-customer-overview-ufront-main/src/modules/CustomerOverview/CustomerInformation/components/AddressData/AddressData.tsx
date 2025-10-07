import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { addressDataI18n } from "./AddressData.i18n";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { CustomerDto } from "~/api/customer/customerApi.types";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";
import { useMemo } from "react";

interface AddressDataProps {
  customer?: CustomerDto;
}

export const AddressData: React.FC<AddressDataProps> = ({ customer }) => {
  const { tr } = useI18n();

  const addressRows = useMemo(
    () => ({
      title: tr(addressDataI18n.header),
      data: [
        {
          label: tr(addressDataI18n.residentialAddress),
          value: customer?.customerInformation.address.address,
        },
        {
          label: tr(addressDataI18n.stateOfResidence),
          value: customer?.customerInformation.address.country,
        },
        {
          label: tr(addressDataI18n.cityOfResidence),
          value: customer?.customerInformation.address.city,
        },
        {
          label: tr(addressDataI18n.zipCode),
          value: customer?.customerInformation.address.zipCode,
        },
      ],
    }),
    [customer, tr]
  );

  return (
    <Stack gap="0">
      <RowHeader
        label={
          <Text size="16" weight="bold" text={tr(addressDataI18n.header)} />
        }
      />
      <InfoRows
        rows={{
          title: addressRows.title,
          data: addressRows.data.map((row) => ({
            ...row,
            id: `address-detail-${row.label
              .toLowerCase()
              .replace(/\s+/g, "-")}`,
          })),
        }}
      />
    </Stack>
  );
};
