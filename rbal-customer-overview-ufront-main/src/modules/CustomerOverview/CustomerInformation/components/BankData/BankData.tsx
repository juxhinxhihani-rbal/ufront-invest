import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Icon, Stack, Text } from "@rbal-modern-luka/ui-library";
import { bankDataI18n } from "./BankData.i18n";
import {
  CustomerAuthorizedPersonsResponse,
  CustomerDto,
} from "~/api/customer/customerApi.types";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { Link } from "react-router-dom";
import { styles } from "./BankData.styles";
import { useMemo } from "react";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";
import { booleansI18n } from "~/features/i18n";
import { hasAtLeastOneUsaIndicaPerson } from "~/modules/EditCustomer/utils";

interface BankDataProps {
  customer?: CustomerDto;
  authorizedPersons?: CustomerAuthorizedPersonsResponse[];
}

export const BankData: React.FC<BankDataProps> = ({
  customer,
  authorizedPersons,
}) => {
  const canResegment = useMemo(
    () => customer?.actions.includes("customer.resegment") ?? false,
    [customer]
  );
  const { tr } = useI18n();

  const infoRows = useMemo(
    () => ({
      title: tr(bankDataI18n.header),
      data: [
        {
          label: tr(bankDataI18n.mainSegment),
          value: customer?.customerInformation.mainSegment,
        },
        {
          label: tr(bankDataI18n.customerNumber),
          value: customer?.customerNumber,
        },
        {
          label: tr(bankDataI18n.customerSegment),
          value: customer?.customerInformation.customerSegment,
        },
        {
          label: tr(bankDataI18n.reportName),
          value: customer?.customerInformation.reportName,
        },
        {
          label: tr(bankDataI18n.premiumService),
          value: customer?.customerInformation.premiumData.premiumService,
        },
        {
          label: tr(bankDataI18n.isRial),
          value: customer?.customerInformation.isRial
            ? tr(booleansI18n.yes)
            : tr(booleansI18n.no),
        },
      ],
    }),
    [customer, tr]
  );

  return (
    <Stack gap="0">
      <RowHeader
        label={<Text size="16" weight="bold" text={tr(bankDataI18n.header)} />}
        cta={
          <Link
            id="bank-data-cta"
            to={`/customers/${customer?.idParty}/resegment-customer`}
            state={{
              customer,
              authorizedPersons,
              shouldShowFactaPopup: hasAtLeastOneUsaIndicaPerson({
                customer,
                authorizedPersons,
              }),
            }}
            css={
              canResegment
                ? styles.resegmentCustomerLink
                : styles.disabledResegmentCustomerLink
            }
          >
            <Stack d="h" customStyle={styles.buttonsContainer}>
              <Text
                id="bank-data-cta-text"
                text={tr(bankDataI18n.cta)}
                size="16"
                lineHeight="24"
                weight="medium"
              />
              <Icon
                id="bank-data-cta-icon"
                type="edit"
                size="16"
                css={
                  canResegment
                    ? styles.resegmentCustomerIcon
                    : styles.disabledResegmentCustomerIcon
                }
              />
            </Stack>
          </Link>
        }
      />
      <InfoRows
        rows={{
          title: infoRows.title,
          data: infoRows.data.map((row) => ({
            ...row,
            id: `bank-detail-${row.label.toLowerCase().replace(/\s+/g, "-")}`,
          })),
        }}
      />
    </Stack>
  );
};
