import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Stack,
  Text,
  FeedbackView,
  Button,
  Loader,
  Icon,
  tokens,
} from "@rbal-modern-luka/ui-library";
import { useCustomerRetailAccountsAvailableForAuthorizationQuery } from "~/features/customer/customerQueries";
import { authorizedPersonsI18n } from "./AuthorizedPersons.i18n";
import { AuthorizedPersonsTable } from "../AuthorizedPersonsTable/AuthorizedPersonsTable";
import { InfoBar } from "~/components/InfoBar/InfoBar";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { Theme, css } from "@emotion/react";
import { Link } from "react-router-dom";
import { useHasAction } from "../../../../../features/hooks/useHasAction";
import { usePermission } from "~/features/hooks/useHasPermission";
import { RESOURCES } from "~/common/resources";
import {
  AuthorizedPersonsQuery,
  CustomerDto,
} from "~/api/customer/customerApi.types";

interface AuthorizedPersonsProps {
  customer: CustomerDto;
  authorizedPersonsQuery: AuthorizedPersonsQuery;
}

const styles = {
  addAuthorizedPersonLink: css({
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    justifyContent: "space-between",
    width: "fit-content",
    color: "#131416",
  }),
  addAuthorizedPersonLinkDisabled: (t: Theme) =>
    css({
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      justifyContent: "space-between",
      width: "fit-content",
      color: tokens.color(t, "gray550"),
      pointerEvents: "none",
      cursor: "default",
    }),
  addAuthorizedPersonIcon: (t: Theme) =>
    css({
      background: tokens.color(t, "yellow300"),
      padding: tokens.scale(t, "6"),
      marginLeft: tokens.scale(t, "8"),
    }),
  addAuthorizedPersonIconDisabled: (t: Theme) =>
    css({
      background: tokens.color(t, "gray150"),
      padding: tokens.scale(t, "6"),
      marginLeft: tokens.scale(t, "8"),
    }),
};

export const AuthorizedPersons: React.FC<AuthorizedPersonsProps> = (props) => {
  const { customer, authorizedPersonsQuery } = props;

  const { tr } = useI18n();
  const { isViewOnlyUser } = usePermission();

  const { query: availableRetailAccountsQuery } =
    useCustomerRetailAccountsAvailableForAuthorizationQuery(customer.idParty);

  const hasLessThanTwoAuthorizedPeople =
    (authorizedPersonsQuery.query.data?.length ?? 0) < 2;

  const hasAvailableAuthorizableAccounts = Boolean(
    availableRetailAccountsQuery.data?.length
  );

  const hasAuthorizedPersonAction = useHasAction(
    "customer.authorizedPerson.create"
  );

  const addAuthorizedButtonShouldBeEnabled =
    hasLessThanTwoAuthorizedPeople &&
    hasAvailableAuthorizableAccounts &&
    hasAuthorizedPersonAction &&
    !isViewOnlyUser(RESOURCES.AUTHORISED_PERSONS);

  const addAuthorizedPersonLinkStyle = addAuthorizedButtonShouldBeEnabled
    ? styles.addAuthorizedPersonLink
    : styles.addAuthorizedPersonLinkDisabled;

  const addAuthorizedPersonIconStyle = addAuthorizedButtonShouldBeEnabled
    ? styles.addAuthorizedPersonIcon
    : styles.addAuthorizedPersonIconDisabled;

  return (
    <Stack gap={authorizedPersonsQuery.isDataEmpty ? "0" : "12"}>
      <RowHeader
        withBorder={false}
        pb="12"
        label={
          <Text
            size="16"
            weight="bold"
            text={tr(authorizedPersonsI18n.title)}
          />
        }
        cta={
          <Link
            to={`/customers/${customer.idParty}/authorized-person`}
            css={addAuthorizedPersonLinkStyle}
          >
            <Text
              size="16"
              weight="medium"
              text={tr(authorizedPersonsI18n.addAuthorizedPerson)}
            />
            <Icon type="add" size="20" css={addAuthorizedPersonIconStyle} />
            &nbsp;
          </Link>
        }
      />
      {authorizedPersonsQuery.query.isLoading && (
        <Loader linesNo={2} withContainer={false} />
      )}

      {authorizedPersonsQuery.query.error && (
        <FeedbackView
          title={tr(authorizedPersonsI18n.errorTitle)}
          description={tr(authorizedPersonsI18n.errorDescription)}
          button1={
            <Button
              type="submit"
              variant="solid"
              colorScheme="yellow"
              onClick={authorizedPersonsQuery.refresh}
              text={tr(authorizedPersonsI18n.errorRefresh)}
            />
          }
        />
      )}

      {authorizedPersonsQuery.query.isSuccess &&
        authorizedPersonsQuery.isDataEmpty && (
          <InfoBar
            text={tr(authorizedPersonsI18n.warningText)}
            icon="warning-ring"
          />
        )}

      {authorizedPersonsQuery.query.isSuccess &&
        !authorizedPersonsQuery.isDataEmpty && (
          <AuthorizedPersonsTable
            authorizedPersons={authorizedPersonsQuery.query.data.slice(0, 2)}
            customer={customer}
          />
        )}
    </Stack>
  );
};
