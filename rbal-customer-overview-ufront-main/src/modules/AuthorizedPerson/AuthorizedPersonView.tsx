import { useParams } from "react-router";
import {
  Card,
  Container,
  Loader,
  Stack,
  Step,
  Stepper,
  StepperContext,
  useStepper,
} from "@rbal-modern-luka/ui-library";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { AuthorizedPersonSteps } from "./types";
import { addAuthorizedPersonPageI18n } from "./AuthorizedPersonView.i18n";
import { AuthorizedPersonSwitch } from "./AuthorizedPersonSwitch/AuthorizedPersonSwitch";
import { styles } from "./AuthorizedPersonView.styles";
import { useSearchParams } from "react-router-dom";
import {
  useCustomerAuthorizedPersonsQuery,
  useCustomerRetailAccountsAvailableForAuthorizationQuery,
  useReadCustomerQuery,
} from "~/features/customer/customerQueries";
import { useMemo } from "react";
import { ForbiddenPage } from "~/components/ForbiddenPage/ForbiddenPage";
import { css } from "@emotion/react";

export const AuthorizedPersonView = () => {
  const { tr } = useI18n();

  const { customerId, authorizedPersonId } = useParams();

  const [searchParams] = useSearchParams();
  const isPreviewOnly = searchParams.has("previewOnly");

  const { query: customerQuery } = useReadCustomerQuery(customerId);

  const { query: authorizedPersonsQuery } = useCustomerAuthorizedPersonsQuery(
    Number(customerId)
  );

  const { query: availableRetailAccountsQuery } =
    useCustomerRetailAccountsAvailableForAuthorizationQuery(
      Number(customerId),
      Number(authorizedPersonId)
    );

  const hasLessThanTwoAuthorizedPeople =
    (authorizedPersonsQuery.data?.length ?? 0) < 2;

  const hasAvailableAuthorizableAccounts = Boolean(
    availableRetailAccountsQuery.data?.length
  );

  const hasAuthorizedPersonAction = customerQuery?.data?.actions.includes(
    "customer.authorizedPerson.create"
  );

  const canAddAuthorizedPerson = useMemo(
    () =>
      (hasLessThanTwoAuthorizedPeople &&
        hasAvailableAuthorizableAccounts &&
        hasAuthorizedPersonAction) ??
      false,
    [
      hasLessThanTwoAuthorizedPeople,
      hasAvailableAuthorizableAccounts,
      hasAuthorizedPersonAction,
    ]
  );

  const steps = useStepper({
    initialStepIdx: authorizedPersonId
      ? AuthorizedPersonSteps.AccountRights
      : AuthorizedPersonSteps.SearchOrAdd,
    disabledSteps: isPreviewOnly
      ? [
          AuthorizedPersonSteps.SearchOrAdd,
          AuthorizedPersonSteps.ReviewData,
          AuthorizedPersonSteps.Attachments,
        ]
      : [],
    stepsCount: 4,
  });

  if (
    customerQuery.isLoading ||
    authorizedPersonsQuery.isFetching ||
    availableRetailAccountsQuery.isLoading
  ) {
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

  if (!canAddAuthorizedPerson && !isPreviewOnly && !authorizedPersonId) {
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
                stepIdx={AuthorizedPersonSteps.SearchOrAdd}
                text={tr(addAuthorizedPersonPageI18n.searchOrAdd)}
              />
              <Step
                icon="safe"
                stepIdx={AuthorizedPersonSteps.AccountRights}
                text={tr(addAuthorizedPersonPageI18n.accountRights)}
              />
              <Step
                icon="drag"
                stepIdx={AuthorizedPersonSteps.ReviewData}
                text={tr(addAuthorizedPersonPageI18n.reviewData)}
              />
              <Step
                icon="doc-attachment"
                stepIdx={AuthorizedPersonSteps.Attachments}
                text={tr(addAuthorizedPersonPageI18n.attachments)}
              />
            </Stepper>
          </Stack>

          <Stack customStyle={styles.contentContainer}>
            <StepperContext.Provider value={steps}>
              <AuthorizedPersonSwitch />
            </StepperContext.Provider>
          </Stack>
        </Stack>
      </Card>
    </Container>
  );
};
