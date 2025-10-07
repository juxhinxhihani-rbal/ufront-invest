import React, { useMemo } from "react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { CustomerDto } from "~/api/customer/customerApi.types";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { customerDocumentsDetailsI18n } from "./CustomerDocumentsDetails.18n";

interface CustomerDocumentsDetailsProps {
  customer?: CustomerDto;
}

export const CustomerDocumentsDetails: React.FC<
  CustomerDocumentsDetailsProps
> = ({ customer }) => {
  const { tr } = useI18n();

  const documentRows = useMemo(
    () => ({
      title: tr(customerDocumentsDetailsI18n.title),
      data: [
        {
          label: tr(customerDocumentsDetailsI18n.customer),
          value: `${customer?.customerInformation.personalInfo.firstName} ${customer?.customerInformation.personalInfo.lastName}`,
        },
        {
          label: tr(customerDocumentsDetailsI18n.customerNumber),
          value: customer?.customerNumber,
        },
        {
          label: tr(customerDocumentsDetailsI18n.branch),
          value: customer?.customerInformation.branchCode,
        },
        {
          label: tr(customerDocumentsDetailsI18n.customerStatus),
          value: customer?.customerInformation.customerStatus?.status,
        },
        {
          label: tr(customerDocumentsDetailsI18n.amlRiskRating),
          value: customer?.additionalInformation?.amlData.riskRating,
        },
        {
          label: tr(customerDocumentsDetailsI18n.documentStatus),
          value: customer?.additionalInformation?.amlData.documentStatus,
        },
        {
          label: tr(customerDocumentsDetailsI18n.overallRiskRating),
          value: Number(
            customer?.additionalInformation?.amlData.overallRiskRating
          ),
        },
      ],
    }),
    [tr, customer]
  );

  return (
    <Stack gap="0">
      <RowHeader
        label={
          <Text
            size="16"
            weight="bold"
            text={tr(customerDocumentsDetailsI18n.title)}
          />
        }
      />
      <InfoRows rows={documentRows} />
    </Stack>
  );
};
