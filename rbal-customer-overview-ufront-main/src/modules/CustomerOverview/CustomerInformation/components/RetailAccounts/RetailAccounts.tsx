import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Theme, css } from "@emotion/react";
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
import {
  useCustomerRetailAccountsQuery,
  useReadCustomerRetailAccountsBalancesQuery,
} from "~/features/customer/customerQueries";
import { retailAccountsI18n } from "./RetailAccounts.i18n";
import { RetailAccountsTable } from "../RetailAccountsTable/RetailAccountsTable";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { InfoBar } from "~/components/InfoBar/InfoBar";
import { useHasAction } from "~/features/hooks/useHasAction";
import { usePermission } from "~/features/hooks/useHasPermission";
import { RESOURCES } from "~/common/resources";
import {
  CustomerAuthorizedPersonsResponse,
  CustomerDto,
} from "~/api/customer/customerApi.types";
import { hasAtLeastOneUsaIndicaPerson } from "~/modules/EditCustomer/utils";

const styles = {
  createAccountLink: css({
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    justifyContent: "space-between",
    width: "fit-content",
    color: "#131416",
  }),
  createAccountLinkDisabled: (t: Theme) =>
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
  financialAutomationLink: css({
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    justifyContent: "space-between",
    width: "fit-content",
    color: "#131416",
  }),
  createAccountIcon: (t: Theme) =>
    css({
      background: tokens.color(t, "yellow300"),
      padding: tokens.scale(t, "6"),
      marginLeft: tokens.scale(t, "8"),
    }),
  createAccountIconDisabled: (t: Theme) =>
    css({
      background: tokens.color(t, "gray150"),
      padding: tokens.scale(t, "6"),
      marginLeft: tokens.scale(t, "8"),
    }),
  financialAutomationIcon: (t: Theme) =>
    css({
      background: tokens.color(t, "yellow300"),
      padding: tokens.scale(t, "6"),
      marginLeft: tokens.scale(t, "8"),
    }),
  refetchBalancesContainer: css({
    display: "flex",
    justifyContent: "flex-end",
  }),
};

interface RetailAccountsProps {
  customer?: CustomerDto;
  shouldShowIntelligentBanking?: boolean;
  shouldShowAddRetailAccount?: boolean;
  authorizedPersons?: CustomerAuthorizedPersonsResponse[];
}

export const RetailAccounts = ({
  customer,
  authorizedPersons,
  shouldShowIntelligentBanking = true,
  shouldShowAddRetailAccount = true,
}: RetailAccountsProps) => {
  const { tr } = useI18n();
  const { isViewOnlyUser } = usePermission();
  const customerId = customer?.idParty as number;
  const retailAccountsQuery = useCustomerRetailAccountsQuery(customerId);

  const allAccountNumbers = useMemo(
    () =>
      retailAccountsQuery.query.data?.map((item) => item.retailAccountNumber) ??
      [],
    [retailAccountsQuery.query.data]
  );
  const hasCreateAccountAction = useHasAction("customer.account.create");
  const hasCardApplicationAction = useHasAction("customer.account.card.apply");

  const createAccountLinkStyle =
    !hasCreateAccountAction || isViewOnlyUser(RESOURCES.ACCOUNT)
      ? styles.createAccountLinkDisabled
      : styles.createAccountLink;
  const createAccountIconStyle =
    !hasCreateAccountAction || isViewOnlyUser(RESOURCES.ACCOUNT)
      ? styles.createAccountIconDisabled
      : styles.createAccountIcon;

  const balancesQuery = useReadCustomerRetailAccountsBalancesQuery(
    customerId,
    allAccountNumbers
  );

  return (
    <Stack gap={retailAccountsQuery.isDataEmpty ? "0" : "12"}>
      <RowHeader
        withBorder={false}
        pb="12"
        label={
          <Text size="16" weight="bold" text={tr(retailAccountsI18n.title)} />
        }
        cta={
          <Stack d="h" gap="8">
            {shouldShowAddRetailAccount && (
              <Link
                id="createAccountLink"
                to={`/customers/${customerId}/create-retail-account`}
                css={createAccountLinkStyle}
                state={{
                  customer,
                  authorizedPersons,
                  shouldShowFactaPopup: hasAtLeastOneUsaIndicaPerson({
                    customer,
                    authorizedPersons,
                  }),
                }}
              >
                <Text
                  id="createAccountIcon"
                  size="16"
                  weight="medium"
                  text={tr(retailAccountsI18n.createAccount)}
                />
                <Icon
                  id="createAccountIconStyle"
                  type="add"
                  css={createAccountIconStyle}
                />
                &nbsp;
              </Link>
            )}

            {shouldShowIntelligentBanking && (
              <Link
                id="intelligentBankingLink"
                to={`/customers/${customerId}/financial-automation`}
                css={styles.financialAutomationLink}
              >
                <Text
                  id="intelligentBankingLabel"
                  size="16"
                  weight="medium"
                  text={tr(retailAccountsI18n.intelligentBanking)}
                />
                <Icon
                  id="intelligentBankingIcon"
                  type="edit"
                  css={styles.financialAutomationIcon}
                />
                &nbsp;
              </Link>
            )}
          </Stack>
        }
      />

      {retailAccountsQuery.query.isLoading && (
        <Loader withContainer={false} linesNo={2} />
      )}

      {retailAccountsQuery.query.error && (
        <FeedbackView
          title={tr(retailAccountsI18n.errorTitle)}
          description={tr(retailAccountsI18n.errorDescription)}
          button1={
            <Button
              type="submit"
              variant="solid"
              colorScheme="yellow"
              onClick={retailAccountsQuery.refresh}
              text={tr(retailAccountsI18n.errorRefresh)}
            />
          }
        />
      )}

      {retailAccountsQuery.query.isSuccess &&
        retailAccountsQuery.isDataEmpty && (
          <InfoBar text={tr(retailAccountsI18n.warningText)} />
        )}

      <div>
        {retailAccountsQuery.query.isSuccess &&
          !retailAccountsQuery.isDataEmpty && (
            <RetailAccountsTable
              retailAccounts={retailAccountsQuery.query.data}
              balances={balancesQuery.balances}
              customer={customer}
              authorizedPersons={authorizedPersons}
              hasCardApplicationAction={hasCardApplicationAction}
            />
          )}

        {balancesQuery.query.error?.code === "aborted" && (
          <InfoBar
            icon="retry-2"
            text={tr(retailAccountsI18n.balances.timeout.description)}
          />
        )}

        {balancesQuery.query.error &&
          balancesQuery.query.error.code !== "aborted" && (
            <InfoBar
              icon="close"
              bgColor="red500"
              text={tr(retailAccountsI18n.balances.error.description)}
            />
          )}
      </div>

      {balancesQuery.missingBalances.length > 0 && (
        <div css={styles.refetchBalancesContainer}>
          <Button
            id="refetchBalancesButton"
            variant="ghost"
            onClick={balancesQuery.fetchMissingBalances}
            isLoading={balancesQuery.query.isLoading}
          >
            <Icon type="retry-1" />
            &nbsp;
            <Text
              size="16"
              weight="medium"
              text={tr(
                retailAccountsI18n.loadBalances,
                balancesQuery.missingBalances.length
              )}
            />
          </Button>
        </div>
      )}
    </Stack>
  );
};
