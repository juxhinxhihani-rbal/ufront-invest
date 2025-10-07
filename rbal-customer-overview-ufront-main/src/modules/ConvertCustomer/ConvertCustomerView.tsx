import {
  BackdropButton,
  Card,
  Container,
  Loader,
  Stack,
  Text,
} from "@rbal-modern-luka/ui-library";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { styles } from "./ConvertCustomerView.styles";
import { useNavigate, useParams } from "react-router";
import { ForbiddenPage } from "~/components/ForbiddenPage/ForbiddenPage";
import { css } from "@emotion/react";
import { useReadWalkInCustomerQuery } from "~/features/walkInCustomer/walkInCustomerQueries";
import { convertCustomerViewI18n } from "./ConvertCustomer.i18n";
import { useFeatureFlags } from "~/features/hooks/useFlags";
import { ConvertCustomerSwitch } from "./ConvertCustomerSwitch/ConvertCustomerSwitch";

export const ConvertCustomerView: React.FC = () => {
  const { customerId = "" } = useParams();
  const navigate = useNavigate();
  const { tr } = useI18n();
  const { isFeatureEnabled } = useFeatureFlags();

  const handleOnBackClick = () => {
    navigate(`/customers/walkIn/${customerId}`);
  };

  const { query: walkInCustomerQuery } = useReadWalkInCustomerQuery(customerId);
  const walkInCustomer = walkInCustomerQuery.data;

  if (walkInCustomerQuery.isLoading) {
    return (
      <div
        css={css({
          margin: "10% 25%",
        })}
      >
        <Loader withContainer={false} />
      </div>
    );
  }

  if (!customerId || !isFeatureEnabled("walk_in_customer_convert")) {
    return <ForbiddenPage to={`/customers/walkIn/${customerId}`} />;
  }

  return (
    <Container as="main">
      <Stack>
        <Stack d="h" customStyle={styles.menu}>
          <BackdropButton
            onClick={handleOnBackClick}
            text={tr(convertCustomerViewI18n.back)}
          />

          {Boolean(walkInCustomer) && (
            <Stack d="h" gap="8">
              <Text
                fgColor="gray550"
                text={tr(convertCustomerViewI18n.customer)}
              />
              <Text
                text={`${walkInCustomer?.basicInformation?.personalInformation?.firstName} ${walkInCustomer?.basicInformation?.personalInformation?.lastName}`}
              />
            </Stack>
          )}
        </Stack>
        <Card>
          <Stack d="h" customStyle={styles.container}>
            <Stack customStyle={styles.contentContainer}>
              <ConvertCustomerSwitch
                walkInCustomerQuery={walkInCustomerQuery}
              />
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};
