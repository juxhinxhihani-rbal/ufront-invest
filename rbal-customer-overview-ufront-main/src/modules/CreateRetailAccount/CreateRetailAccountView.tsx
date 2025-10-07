import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { css } from "@emotion/react";
import {
  Card,
  Container,
  Loader,
  Stack,
  Step,
  Stepper,
  StepperContext,
  Text,
  useStepper,
} from "@rbal-modern-luka/ui-library";
import { CreateRetailAccountSwitch } from "./CreateRetailAccountSwitch/CreateRetailAccountSwitch";
import { createRetailAccountViewI18n } from "./CreateRetailAccountView.i18n";
import { useReadCustomerQuery } from "~/features/customer/customerQueries";
import { useMemo } from "react";
import { ForbiddenPage } from "~/components/ForbiddenPage/ForbiddenPage";
import { useFatcaClientNotificationPopup } from "~/features/hooks/useFactaClientNotificationPopup/useFatcaClientNotificationPopup";

const styles = {
  container: css({
    // TODO: fix styles
    gap: "80px!important",
  }),
  navigationContainer: css({
    flexShrink: 0,
  }),
  contentContainer: css({
    flexGrow: 1,
  }),
};

export enum CreateRetailAccountSteps {
  AccountDetails,
  Attachments,
  ChargedAccount,
  Summary,
}

interface CreateRetailAccountViewProps {
  customerId: string;
}

export const CreateRetailAccountView: React.FC<CreateRetailAccountViewProps> = (
  props
) => {
  const { customerId } = props;

  const { tr } = useI18n();

  const steps = useStepper({
    stepsCount: 4,
    preventGoBack: true,
  });

  const { query: customerQuery } = useReadCustomerQuery(customerId);

  const canCreateAccount = useMemo(
    () =>
      customerQuery?.data?.actions.includes("customer.account.create") ?? false,
    [customerQuery?.data]
  );

  useFatcaClientNotificationPopup();

  if (customerQuery.isLoading || customerQuery.isFetching) {
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

  if (!canCreateAccount) {
    return <ForbiddenPage to={`/customers/${customerId}`} />;
  }

  return (
    <Container as="main">
      <Card>
        <Stack d="h" customStyle={styles.container}>
          <Stack gap="32" customStyle={styles.navigationContainer}>
            <Stack>
              <Text
                size="24"
                weight="bold"
                text={tr(createRetailAccountViewI18n.title)}
              />
            </Stack>

            <Stepper config={steps}>
              <Step
                icon="edit"
                stepIdx={CreateRetailAccountSteps.AccountDetails}
                text={tr(createRetailAccountViewI18n.accountDetails)}
              />
              <Step
                icon="drag"
                stepIdx={CreateRetailAccountSteps.Attachments}
                text={tr(createRetailAccountViewI18n.attachments)}
              />
              <Step
                icon="safe"
                stepIdx={CreateRetailAccountSteps.ChargedAccount}
                text={tr(createRetailAccountViewI18n.chargedAccount)}
              />
              <Step
                icon="doc-attachment"
                stepIdx={CreateRetailAccountSteps.Summary}
                text={tr(createRetailAccountViewI18n.summary)}
              />
            </Stepper>
          </Stack>

          <Stack customStyle={styles.contentContainer}>
            <StepperContext.Provider value={steps}>
              <CreateRetailAccountSwitch
                customerQuery={customerQuery}
                customerId={customerId}
              />
            </StepperContext.Provider>
          </Stack>
        </Stack>
      </Card>
    </Container>
  );
};
