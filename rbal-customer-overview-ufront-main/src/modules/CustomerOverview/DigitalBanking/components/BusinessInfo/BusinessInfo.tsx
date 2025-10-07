import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Icon, Stack, Text } from "@rbal-modern-luka/ui-library";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { DigitalBankingDto } from "~/api/customer/customerApi.types";
import { DigitalBankingSecurityProfile } from "~/api/digitalBanking/digitalBankingApi.types";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { styles } from "../../DigitalBanking.styles";
import { getAction, getActionIcon } from "../RetailInfo/RetailInfo";
import { businessInfoI18n } from "./BusinessInfo.i18n";

interface BusinessInfoProps {
  customerId?: number;
  data?: DigitalBankingDto;
}

export const BusinessInfo: React.FC<BusinessInfoProps> = (props) => {
  const { data, customerId } = props;

  const { tr } = useI18n();

  const businessInfoRows = useMemo(
    () => ({
      title: tr(businessInfoI18n.header),
      data: [
        {
          label: tr(businessInfoI18n.status),
          value: data?.businessInformation.status,
        },
        {
          label: tr(businessInfoI18n.channel),
          value: data?.businessInformation.channel,
        },
      ],
    }),
    [data, tr]
  );

  return (
    <Stack gap="0">
      <RowHeader
        label={
          <Text size="16" weight="bold" text={tr(businessInfoI18n.header)} />
        }
        cta={
          <Link
            to={`/customers/${customerId}/modify-digital`}
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
      <InfoRows rows={businessInfoRows} />
    </Stack>
  );
};
