import { css } from "@emotion/react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  BackdropButton,
  Container,
  Stack,
  Card,
  useStepper,
  Loader,
  Text,
  Stepper,
  Step,
  StepperContext,
} from "@rbal-modern-luka/ui-library";
import { useNavigate, useParams } from "react-router";
import { PERMISSIONS } from "~/common/permissions";
import { RESOURCES } from "~/common/resources";
import { ForbiddenPage } from "~/components/ForbiddenPage/ForbiddenPage";
import { useFeatureFlags } from "~/features/hooks/useFlags";
import { usePermission } from "~/features/hooks/useHasPermission";
import { useReadWalkInCustomerQuery } from "~/features/walkInCustomer/walkInCustomerQueries";
import { EditWalkInCustomerSwitch } from "./EditWalkInCustomerSwitch/EditWalkInCustomerSwitch";
import { editWalkInCustomerViewI18n } from "./EditWalkInCustomerView.i18n";
import { EditWalkInCustomerSteps } from "./types";

const styles = {
  container: css({
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

export const EditWalkInCustomerView: React.FC = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const { isUserAllowed } = usePermission();
  const { isFeatureEnabled } = useFeatureFlags();

  const handleOnBackClick = () => {
    customerId
      ? navigate(`/customers/walkIn/${customerId}`)
      : navigate(`/customers`);
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

  const { query: walkInCustomerQuery } = useReadWalkInCustomerQuery(customerId);
  const customer = walkInCustomerQuery.data;

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

  if (
    (!canCreateCustomer && !customerId) ||
    !isFeatureEnabled("walk_in_customer_create")
  ) {
    return <ForbiddenPage to={`/customers`} />;
  }

  return (
    <Container as="main">
      <Stack>
        <Stack d="h" customStyle={styles.menu}>
          <BackdropButton
            onClick={handleOnBackClick}
            text={tr(editWalkInCustomerViewI18n.back)}
          />

          {Boolean(customer) && (
            <Stack d="h" gap="8">
              <Text
                fgColor="gray550"
                text={tr(editWalkInCustomerViewI18n.customer)}
              />
              <Text
                text={`${customer?.basicInformation?.personalInformation?.firstName} ${customer?.basicInformation?.personalInformation?.lastName}`}
              />
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
                    stepIdx={EditWalkInCustomerSteps.EditData}
                    text={tr(
                      !customerId
                        ? editWalkInCustomerViewI18n.addData
                        : editWalkInCustomerViewI18n.editData
                    )}
                  />
                  <Step
                    icon="drag"
                    stepIdx={EditWalkInCustomerSteps.Summary}
                    text={tr(editWalkInCustomerViewI18n.reviewData)}
                  />
                </Stepper>
              </Stack>
            )}
            <Stack customStyle={styles.contentContainer}>
              <StepperContext.Provider value={steps}>
                <EditWalkInCustomerSwitch
                  walkInCustomerQuery={walkInCustomerQuery}
                />
              </StepperContext.Provider>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};
