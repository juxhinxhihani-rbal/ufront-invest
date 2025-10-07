import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Button,
  Card,
  Container,
  Icon,
  Loader,
  Stack,
  Step,
  Stepper,
  Text,
  StepperContext,
  useStepper,
} from "@rbal-modern-luka/ui-library";
import { useLocation, useParams } from "react-router";
import { BackCustomerView } from "~/components/BackCustomer/BackCustomer";
import { useGetRetailAccountDetails } from "~/features/retailAccount/retailAccountQueries";
import {} from "../CustomerOverview/components/RowHeader/RowHeader";

import { editAccountViewStyles } from "./EditAccountView.styles";
import { editAccountViewI18n } from "./EditAccountView.i18n";
import { EditAccountSwitch } from "./EditAccountSwitch/EditAccountSwitch";
import { css } from "@emotion/react";
import { Link } from "react-router-dom";
import { FullPageFeedback } from "~/components/FullPageFeedback/FullPageFeedback";
import { editAccountViewDetailsI18n } from "./EditAccountViewDetails/EditAccountViewDetails.i18n";
import { editAccountViewDetailsStyles } from "./EditAccountViewDetails/EditAccountViewDetails.styles";
import { useFatcaClientNotificationPopup } from "~/features/hooks/useFactaClientNotificationPopup/useFatcaClientNotificationPopup";

export enum EditAccountSteps {
  EditData,
  Summary,
}
interface EditAccountViewProps {
  isAccountClosing: boolean;
}

export const EditAccountView: React.FC<EditAccountViewProps> = ({
  isAccountClosing,
}) => {
  const { customerNumber = "", accountId = "" } = useParams();
  const location = useLocation();
  const { customer, authorizedPersons } = location.state || {};
  const numericAccountId = parseInt(accountId);
  const { tr } = useI18n();
  useFatcaClientNotificationPopup();
  const { query: accountQuery } = useGetRetailAccountDetails(numericAccountId);
  const accountDetails = accountQuery.data;

  const steps = useStepper({
    stepsCount: 2,
    preventGoBack: true,
  });

  if (accountQuery.isLoading) {
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

  if (accountQuery.isError) {
    return (
      <FullPageFeedback
        title={tr(editAccountViewDetailsI18n.serverErrorTitle)}
        text={accountQuery.error.title}
        icon={<Icon type="retry-with-errors" size="56" />}
        cta={
          <Button
            css={editAccountViewDetailsStyles.errorButtonLink}
            as={Link}
            to={`/customers/${customerNumber}`}
            colorScheme="yellow"
            text={tr(editAccountViewDetailsI18n.goBack)}
          />
        }
      />
    );
  }

  return (
    <Container as="main">
      <Stack>
        <BackCustomerView
          to={`/customers/${customerNumber}/account-details/${numericAccountId}`}
          state={{ state: { customer, authorizedPersons } }}
          customerName={
            accountDetails?.customerDetails?.name +
              " " +
              accountDetails?.customerDetails?.surname ?? ""
          }
          customerNumber={accountDetails?.customerDetails?.customerNumber ?? ""}
          status={accountDetails?.accountStatus?.status}
          statusColor={accountDetails?.accountStatus?.color}
        />
        <Card>
          <Stack d="h" customStyle={editAccountViewStyles.container}>
            <Stack
              gap="32"
              customStyle={editAccountViewStyles.navigationContainer}
            >
              <Stepper config={steps}>
                <Step
                  icon="edit"
                  stepIdx={EditAccountSteps.EditData}
                  text={tr(editAccountViewI18n.editData)}
                />

                <Step
                  icon="drag"
                  stepIdx={EditAccountSteps.Summary}
                  text={tr(editAccountViewI18n.reviewData)}
                />
              </Stepper>
            </Stack>
            <Stack customStyle={editAccountViewStyles.contentContainer}>
              <StepperContext.Provider value={steps}>
                <Text
                  text={tr(editAccountViewI18n.editAccountDetailsTitle)}
                  size="24"
                  lineHeight="32"
                  weight="bold"
                  customStyle={{ marginBottom: "10px" }}
                />
                <EditAccountSwitch
                  accountQuery={accountQuery}
                  isAccountClosing={isAccountClosing}
                />
              </StepperContext.Provider>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};
