import {
  Card,
  Container,
  Loader,
  Stack,
  Step,
  Stepper,
  StepperContext,
  SubStep,
  useStepper,
} from "@rbal-modern-luka/ui-library";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { resegmentCustomerPageI18n } from "./ResegmentCustomer.i18n";
import { ResegmentCustomerSteps } from "./types";
import { ResegmentCustomerSwitch } from "./ResegmentCustomerSwitch/ResegmentCustomerSwitch";
import { styles } from "./ResegmentCustomerView.styles";
import { useReadCustomerQuery } from "~/features/customer/customerQueries";
import { useParams } from "react-router";
import { useMemo } from "react";
import { ForbiddenPage } from "~/components/ForbiddenPage/ForbiddenPage";
import { css } from "@emotion/react";
import { useFatcaClientNotificationPopup } from "~/features/hooks/useFactaClientNotificationPopup/useFatcaClientNotificationPopup";

export const ResegmentCustomerView: React.FC = () => {
  const { customerId = "" } = useParams();
  const { tr } = useI18n();

  const steps = useStepper({
    stepsCount: 5,
    preventGoBack: true,
  });

  const { query: customerQuery } = useReadCustomerQuery(customerId);

  useFatcaClientNotificationPopup();

  const canResegment = useMemo(
    () => customerQuery?.data?.actions.includes("customer.resegment") ?? false,
    [customerQuery?.data]
  );

  if (customerQuery.isLoading) {
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

  if (!canResegment) {
    return <ForbiddenPage to={`/customers/${customerId}`} />;
  }

  return (
    <Container as="main">
      <Card>
        <Stack d="h" customStyle={styles.container}>
          <Stack gap="32" customStyle={styles.navigationContainer}>
            <Stepper config={steps}>
              <Step
                icon="filter"
                stepIdx={ResegmentCustomerSteps.Resegmentation}
                text={tr(resegmentCustomerPageI18n.resegmentation)}
                subSteps={
                  <>
                    <SubStep
                      stepIdx={ResegmentCustomerSteps.EditData}
                      text={tr(resegmentCustomerPageI18n.editData)}
                    />
                    <SubStep
                      stepIdx={ResegmentCustomerSteps.ChargedAccount}
                      text={tr(resegmentCustomerPageI18n.chargedAccount)}
                    />
                  </>
                }
              />
              <Step
                icon="drag"
                stepIdx={ResegmentCustomerSteps.Review}
                text={tr(resegmentCustomerPageI18n.reviewdata)}
              />
              <Step
                icon="doc-attachment"
                stepIdx={ResegmentCustomerSteps.Attachments}
                text={tr(resegmentCustomerPageI18n.attachments)}
              />
            </Stepper>
          </Stack>

          <Stack customStyle={styles.contentContainer}>
            <StepperContext.Provider value={steps}>
              <ResegmentCustomerSwitch customerQuery={customerQuery} />
            </StepperContext.Provider>
          </Stack>
        </Stack>
      </Card>
    </Container>
  );
};
