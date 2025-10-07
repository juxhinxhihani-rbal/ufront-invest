import { css, Theme } from "@emotion/react";
import {
  Button,
  Card,
  Stack,
  Text,
  tokens,
} from "@rbal-modern-luka/ui-library";
import {
  formatIntlLocalDateTime,
  useI18n,
} from "@rbal-modern-luka/luka-portal-shell";
import { WalkInCustomerDto } from "~/api/walkInCustomer/walkInCustomerApi.types";
import { walkInCustomerBasicInfoI18n } from "./WalkInCustomerBasicInfo.i18n";
import { useNavigate } from "react-router";
import { useFeatureFlags } from "~/features/hooks/useFlags";
import { CustomerBadge } from "~/components/CustomerBadge/CustomerBadge";

const styles = {
  headerWrapper: (t: Theme) =>
    css({
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: `2px solid ${tokens.color(t, "gray200")}`,
    }),
  walkInCustomer: css({
    color: "#19B18C",
    borderBottom: "2px solid #19B18C",
  }),
  informationsWrapper: (t: Theme) =>
    css({
      width: "100%",
      gap: tokens.scale(t, "40"),
      paddingTop: tokens.scale(t, "12"),
    }),
};

interface WalkInCustomerBasicInfoProps {
  customer?: WalkInCustomerDto;
}

const toEventInfoLine = (date?: string, by?: string) => {
  return [formatIntlLocalDateTime(date), by]
    .filter((value) => Boolean(value))
    .join(" ");
};

export const WalkInCustomerBasicInfo: React.FC<WalkInCustomerBasicInfoProps> = (
  props
) => {
  const { customer } = props;

  const { tr } = useI18n();
  const navigate = useNavigate();
  const { isFeatureEnabled } = useFeatureFlags();

  const handleConvertNavigate = () => {
    navigate(`/customers/${customer?.idParty}/convert-customer`);
  };

  return (
    <Card isFullPage={false}>
      <Stack gap="0">
        <CustomerBadge isWalkInCustomer />

        <Stack
          d="h"
          customStyle={[styles.headerWrapper, styles.walkInCustomer]}
        >
          <Text
            size="32"
            lineHeight="48"
            weight="bold"
            text={`${customer?.basicInformation?.personalInformation.firstName} ${customer?.basicInformation?.personalInformation.lastName}`}
          />
          <Button
            variant="solid"
            colorScheme="yellow"
            text={tr(walkInCustomerBasicInfoI18n.convertButton)}
            onClick={() => handleConvertNavigate()}
            disabled={!isFeatureEnabled("walk_in_customer_convert")}
          />
        </Stack>

        <Stack d={["v", "h"]} customStyle={styles.informationsWrapper}>
          <Stack d="h" gap="8">
            <Text
              fgColor="gray550"
              text={tr(walkInCustomerBasicInfoI18n.created)}
            />

            <Text
              text={toEventInfoLine(
                customer?.basicInformation?.personalInformation.openDate,
                customer?.basicInformation?.personalInformation.userCreated
              )}
            />
          </Stack>

          <Stack d="h" gap="8">
            <Text
              fgColor="gray550"
              text={tr(walkInCustomerBasicInfoI18n.modified)}
            />

            <Text
              text={toEventInfoLine(
                customer?.basicInformation?.personalInformation
                  .lastModifiedDate,
                customer?.basicInformation?.personalInformation.userModified
              )}
            />
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};
