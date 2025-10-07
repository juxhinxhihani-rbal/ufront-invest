import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Icon, Stack, Text } from "@rbal-modern-luka/ui-library";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { DigitalBankingDto } from "~/api/customer/customerApi.types";
import { DigitalBankingSecurityProfile } from "~/api/digitalBanking/digitalBankingApi.types";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { digitalBankingI18n } from "../../DigitalBanking.i18n";
import { styles } from "../../DigitalBanking.styles";
import { retailInfoI18n } from "./RetailInfo.i18n";

interface RetailInfoProps {
  customerId?: number;
  data?: DigitalBankingDto;
}

export const getAction = (
  profileId: DigitalBankingSecurityProfile | undefined
) => {
  switch (profileId) {
    case DigitalBankingSecurityProfile.FullDefault:
      return digitalBankingI18n.edit;
    case DigitalBankingSecurityProfile.LimitedDefault:
      return digitalBankingI18n.upgrade;
    default:
      return digitalBankingI18n.register;
  }
};

export const getActionIcon = (
  profileId: DigitalBankingSecurityProfile | undefined
) => {
  switch (profileId) {
    case DigitalBankingSecurityProfile.FullDefault:
      return "edit";
    case DigitalBankingSecurityProfile.LimitedDefault:
      return "up";
    default:
      return "add";
  }
};

const getChannels = (
  isWeb?: boolean,
  isMobile?: boolean
): { sq: string; en: string }[] | [] => {
  const channels = [];
  if (isWeb) {
    channels.push(retailInfoI18n.web);
  }

  if (isMobile) {
    channels.push(retailInfoI18n.mobile);
  }
  return channels;
};

export const RetailInfo: React.FC<RetailInfoProps> = (props) => {
  const { data, customerId } = props;
  const { tr } = useI18n();

  const retailInfoRows = useMemo(
    () => ({
      title: tr(retailInfoI18n.header),
      data: [
        {
          label: tr(retailInfoI18n.status),
          value: data?.individualInformation.status,
        },
        {
          label: tr(retailInfoI18n.channel),
          value: getChannels(
            data?.individualInformation.isWeb,
            data?.individualInformation.isMobile
          )
            .map((channel) => tr(channel))
            .join(", "),
        },
        {
          label: tr(retailInfoI18n.registrationType),
          value: data?.individualInformation.registrationType,
        },
        {
          label: tr(retailInfoI18n.profile),
          value: data?.individualInformation.profile,
        },
        {
          label: tr(retailInfoI18n.packages),
          value: data?.individualInformation.package,
        },
        {
          label: tr(retailInfoI18n.securityElemnt),
          value: data?.individualInformation.securityElement,
        },
      ],
    }),
    [data, tr]
  );

  return (
    <Stack gap="0">
      <RowHeader
        label={
          <Text size="16" weight="bold" text={tr(retailInfoI18n.header)} />
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
      <InfoRows rows={retailInfoRows} />
    </Stack>
  );
};
