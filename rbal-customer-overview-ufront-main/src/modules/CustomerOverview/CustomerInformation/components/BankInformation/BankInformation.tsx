import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { CustomerDto } from "~/api/customer/customerApi.types";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { useMemo } from "react";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";
import { bankInformationI18n } from "./BankInformation.i18n";
import { additionalInformationi18n } from "~/modules/WalkInCustomerOverview/AdditionalInformation/AdditionalInformation.i18n";
import { booleansI18n } from "~/features/i18n";

interface BankInformationProps {
  customer?: CustomerDto;
}

export const BankInformation: React.FC<BankInformationProps> = ({
  customer,
}) => {
  const { tr } = useI18n();

  const bankInformationRows = useMemo(
    () => ({
      title: tr(bankInformationI18n.header),
      data: [
        {
          label: tr(bankInformationI18n.marketingGroup1),
          value: customer?.customerInformation.marketingGroup1,
        },
        {
          label: tr(bankInformationI18n.marketingGroup2),
          value: customer?.customerInformation.marketingGroup2,
        },
        {
          label: tr(bankInformationI18n.marketingGroup3),
          value: customer?.customerInformation.marketingGroup3,
        },
        {
          label: tr(bankInformationI18n.profitCenter),
          value: customer?.customerInformation.profitCenter,
        },
        {
          label: tr(bankInformationI18n.institutionCode),
          value: customer?.customerInformation?.institutionCode,
        },
        {
          label: tr(bankInformationI18n.lineOfBusiness),
          value: customer?.customerInformation?.lineOfBusiness,
        },
        {
          label: tr(bankInformationI18n.coconutType),
          value: customer?.customerInformation.coconutType,
        },
        {
          label: tr(bankInformationI18n.retCustGr),
          value: customer?.customerInformation.retCustGr,
        },
        {
          label: tr(bankInformationI18n.taxIndicator),
          value: customer?.customerInformation.isTaxIndicator
            ? tr(booleansI18n.yes)
            : tr(booleansI18n.no),
        },
        {
          label: tr(additionalInformationi18n.addedInfo.naceCode),
          value: customer?.additionalInformation.addedInfo.naceCode,
        },

        {
          label: tr(additionalInformationi18n.addedInfo.custRiskClassification),
          value:
            customer?.additionalInformation.addedInfo.custRiskClassification,
        },
        {
          label: tr(additionalInformationi18n.addedInfo.planProduct),
          value: customer?.additionalInformation.addedInfo.planProduct,
        },
        {
          label: tr(additionalInformationi18n.amlData.overallRiskRating),
          value: customer?.additionalInformation.amlData.overallRiskRating,
        },
        {
          label: tr(additionalInformationi18n.amlData.riskRating),
          value: customer?.additionalInformation.amlData.riskRating,
        },
        {
          label: tr(bankInformationI18n.accountOfficer),
          value: customer?.customerInformation?.premiumData?.accountOfficerName,
        },
      ],
    }),
    [tr, customer]
  );

  return (
    <Stack gap="0">
      <RowHeader
        label={
          <Text size="16" weight="bold" text={tr(bankInformationI18n.header)} />
        }
      />
      <InfoRows
        rows={{
          title: bankInformationRows.title,
          data: bankInformationRows.data.map((row) => ({
            ...row,
            id: `bank-information-${row.label
              .toLowerCase()
              .replace(/\s+/g, "-")}`,
          })),
        }}
      />
    </Stack>
  );
};
