import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Icon, Stack, Text } from "@rbal-modern-luka/ui-library";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  CustomerDto,
  DigitalBankingDto,
} from "~/api/customer/customerApi.types";
import { DigitalBankingSecurityProfile } from "~/api/digitalBanking/digitalBankingApi.types";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { styles } from "../../DigitalBanking.styles";
import { getAction, getActionIcon } from "../RetailInfo/RetailInfo";
import { customerDetailsI18n } from "./CustomerDetails.i18n";

interface CustomerDetailsProp {
  customer?: CustomerDto;
  data?: DigitalBankingDto;
}

export const CustomerDetails: React.FC<CustomerDetailsProp> = (props) => {
  const { customer, data } = props;
  const { tr } = useI18n();

  const customerDetailRows = useMemo(
    () => ({
      title: tr(customerDetailsI18n.header),
      data: [
        {
          label: tr(customerDetailsI18n.customerNumber),
          value: customer?.customerNumber,
        },
        {
          label: tr(customerDetailsI18n.firstName),
          value: customer?.customerInformation.personalInfo.firstName,
        },
        {
          label: tr(customerDetailsI18n.lastName),
          value: customer?.customerInformation.personalInfo.lastName,
        },
        {
          label: tr(customerDetailsI18n.fatherName),
          value: customer?.customerInformation.personalInfo.fatherName,
        },
        {
          label: tr(customerDetailsI18n.personalNumber),
          value: customer?.customerInformation.document.ssn,
        },
        {
          label: tr(customerDetailsI18n.mobile),
          value: customer?.customerInformation.contact.mobileNumber,
        },
        {
          label: tr(customerDetailsI18n.email),
          value: customer?.customerInformation.contact.email,
        },
        {
          label: tr(customerDetailsI18n.issueDate),
          value: customer?.customerInformation.document.issueDate,
        },
      ],
    }),
    [customer, tr]
  );

  return (
    <Stack gap="0">
      <RowHeader
        label={
          <Text size="16" weight="bold" text={tr(customerDetailsI18n.header)} />
        }
        cta={
          <Link
            to={`/customers/${customer?.idParty}/modify-digital`}
            css={styles.link}
          >
            <Stack d="h" customStyle={styles.buttonsContainer}>
              <Text
                text={tr(
                  getAction(
                    data?.individualInformation
                      .profileId as DigitalBankingSecurityProfile
                  )
                )}
                size="16"
                lineHeight="24"
                weight="medium"
              />
              <Icon
                type={getActionIcon(
                  data?.individualInformation
                    .profileId as DigitalBankingSecurityProfile
                )}
                size="16"
                css={styles.digitalBankingIcon}
              />
            </Stack>
          </Link>
        }
      />
      <InfoRows rows={customerDetailRows} />
    </Stack>
  );
};
