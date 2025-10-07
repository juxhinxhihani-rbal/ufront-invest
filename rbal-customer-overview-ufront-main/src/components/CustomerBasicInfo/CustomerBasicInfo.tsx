import { css, Theme } from "@emotion/react";
import { Card, Stack, Text, tokens } from "@rbal-modern-luka/ui-library";
import {
  formatIntlLocalDateTime,
  useI18n,
} from "@rbal-modern-luka/luka-portal-shell";
import { customerBasicInfoI18n } from "./CustomerBasicInfo.i18n";
import { CustomerDto } from "~/api/customer/customerApi.types";
import { CustomerStatus } from "~/components/CustomerStatus/CustomerStatus";
import { isPremiumUserCheck } from "~/common/utils";
import { CustomerBadge } from "../CustomerBadge/CustomerBadge";

const styles = {
  headerWrapper: (t: Theme) =>
    css({
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: `2px solid ${tokens.color(t, "gray200")}`,
    }),
  premiumUser: css({
    color: "#AB8507",
    borderBottom: "2px solid #AB8507",
  }),
  informationsWrapper: (t: Theme) =>
    css({
      width: "100%",
      justifyContent: "space-between",
      paddingTop: tokens.scale(t, "12"),
    }),
};

interface CustomerBasicInfoProps {
  customer?: CustomerDto;
}

const toEventInfoLine = (date?: string, by?: string) => {
  return [formatIntlLocalDateTime(date), by]
    .filter((value) => Boolean(value))
    .join(" ");
};

export const CustomerBasicInfo: React.FC<CustomerBasicInfoProps> = (props) => {
  const { customer } = props;

  const { tr } = useI18n();

  const isPremiumUser = isPremiumUserCheck(customer);

  return (
    <Card isFullPage={false}>
      <Stack gap="0">
        <CustomerBadge isPremiumUser={isPremiumUser} />

        <Stack
          d="h"
          customStyle={[
            styles.headerWrapper,
            isPremiumUser && styles.premiumUser,
          ]}
        >
          <Text
            size="32"
            lineHeight="48"
            weight="bold"
            text={`${customer?.customerInformation.personalInfo.firstName} ${customer?.customerInformation.personalInfo.lastName}`}
          />
          <CustomerStatus
            status={customer?.customerInformation.customerStatus?.status}
            description={
              customer?.customerInformation.customerStatus?.customerDescription
            }
            color={customer?.customerInformation.customerStatus?.color}
          />
        </Stack>

        <Stack d={["v", "h"]} customStyle={styles.informationsWrapper}>
          <Stack d="h" gap="8">
            <Text fgColor="gray550" text={tr(customerBasicInfoI18n.created)} />

            <Text
              text={toEventInfoLine(
                customer?.customerInformation.auditInfo.createdDate,
                customer?.customerInformation.auditInfo.createdBy
              )}
            />
          </Stack>

          <Stack d="h" gap="8">
            <Text fgColor="gray550" text={tr(customerBasicInfoI18n.modified)} />

            <Text
              text={toEventInfoLine(
                customer?.customerInformation.auditInfo.modifiedDate,
                customer?.customerInformation.auditInfo.modifiedBy
              )}
            />
          </Stack>

          <Stack d="h" gap="8">
            <Text
              fgColor="gray550"
              text={tr(customerBasicInfoI18n.authorized)}
            />

            <Text
              text={toEventInfoLine(
                customer?.customerInformation.auditInfo.authorizationDate,
                customer?.customerInformation.auditInfo.authorizedBy
              )}
            />
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};
