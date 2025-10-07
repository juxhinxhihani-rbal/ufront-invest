import {
  BackdropButton,
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
import { css } from "@emotion/react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { editCustomerPageI18n } from "./EditCustomer.i18n";
import { EditUserSteps } from "./types";
import { EditCustomerSwitch } from "./EditCustomerSwitch/EditCustomerSwitch";
import { useNavigate, useParams } from "react-router";
import { useReadCustomerQuery } from "~/features/customer/customerQueries";
import { useMemo } from "react";
import { ForbiddenPage } from "~/components/ForbiddenPage/ForbiddenPage";
import { PERMISSIONS } from "~/common/permissions";
import { RESOURCES } from "~/common/resources";
import { usePermission } from "~/features/hooks/useHasPermission";
import { useFatcaClientNotificationPopup } from "~/features/hooks/useFactaClientNotificationPopup/useFatcaClientNotificationPopup";
const styles = {
  container: css({
    // TODO: fix styles
    gap: "80px!important",
  }),
  menu: css({
    justifyContent: "space-between",
    alignItems: "center",
  }),
  navigationContainer: css({
    flexShrink: 0,
  }),
  contentContainer: css({
    flexGrow: 1,
  }),
};

export const EditCustomerView: React.FC = () => {
  const { customerId = "" } = useParams();
  const navigate = useNavigate();
  const { isUserAllowed } = usePermission();

  const handleOnBackClick = () => {
    navigate(`/customers/${customerId}`);
  };

  const { tr } = useI18n();

  const steps = useStepper({
    stepsCount: 3,
    preventGoBack: true,
  });

  const canCreateCustomer = isUserAllowed(
    RESOURCES.CUSTOMER,
    PERMISSIONS.CREATE
  );

  const { query: customerQuery } = useReadCustomerQuery(customerId);
  const customer = customerQuery.data;

  const canUpdate = useMemo(
    () => customerQuery?.data?.actions.includes("customer.update") ?? false,
    [customerQuery?.data]
  );

  useFatcaClientNotificationPopup();

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

  if (!canUpdate && customerId) {
    return <ForbiddenPage to={`/customers/${customerId}`} />;
  }

  if (!canCreateCustomer && !customerId) {
    return <ForbiddenPage to={`/customers`} />;
  }

  return (
    <Container as="main">
      <Stack>
        <Stack d="h" customStyle={styles.menu}>
          <BackdropButton
            onClick={handleOnBackClick}
            text={tr(editCustomerPageI18n.back)}
          />

          {Boolean(customer) && (
            <Stack d="h">
              <Stack d="h" gap="8">
                <Text
                  fgColor="gray550"
                  text={tr(editCustomerPageI18n.customer)}
                />
                <Text
                  text={`${customer?.customerInformation?.personalInfo?.firstName} ${customer?.customerInformation?.personalInfo?.lastName}`}
                />
              </Stack>

              <Stack d="h" gap="8">
                <Text
                  fgColor="gray550"
                  text={tr(editCustomerPageI18n.customerNo)}
                />
                <Text text={`${customer?.customerNumber}`} />
              </Stack>
            </Stack>
          )}
        </Stack>

        <Card>
          <Stack d="h" customStyle={styles.container}>
            {customerId && (
              <Stack gap="32" customStyle={styles.navigationContainer}>
                <Stepper config={steps}>
                  <Step
                    icon={customerId ? "edit" : "add-person"}
                    stepIdx={EditUserSteps.EditData}
                    text={tr(
                      !customerId
                        ? editCustomerPageI18n.addData
                        : editCustomerPageI18n.editData
                    )}
                  />
                  <Step
                    icon="drag"
                    stepIdx={EditUserSteps.Summary}
                    text={tr(editCustomerPageI18n.reviewData)}
                  />
                  <Step
                    icon="doc-attachment"
                    stepIdx={EditUserSteps.Attachments}
                    text={tr(editCustomerPageI18n.attachments)}
                  />
                </Stepper>
              </Stack>
            )}

            <Stack customStyle={styles.contentContainer}>
              <StepperContext.Provider value={steps}>
                <EditCustomerSwitch customerQuery={customerQuery} />
              </StepperContext.Provider>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};
