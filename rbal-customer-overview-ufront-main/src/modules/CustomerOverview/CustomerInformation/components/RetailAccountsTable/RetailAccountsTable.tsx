import { Fragment, useMemo, memo } from "react";
import { css, Theme } from "@emotion/react";
import {
  CollapseButton,
  CollapsibleTr,
  ColorToken,
  DotsMenu,
  Icon,
  Stack,
  Table,
  Text,
  tokens,
  Tr,
} from "@rbal-modern-luka/ui-library";
import { TrFunction, useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { useCollapseRow } from "~/features/hooks/useCollapseRow";
import { InfoItem } from "~/components/InfoItem";
import { booleansI18n } from "~/features/i18n";
import { retailAccountsTableI18n } from "./RetailAccountsTable.i18n";
import {
  CustomerAuthorizedPersonsResponse,
  CustomerDto,
  CustomerRetailAccount,
} from "~/api/customer/customerApi.types";
import type { BalanceItem } from "~/features/customer/customerQueries";
import { useNavigate } from "react-router";
import { useHasAction } from "~/features/hooks/useHasAction";
import { useFeatureFlags } from "~/features/hooks/useFlags";
import { showMultipleError } from "~/components/Toast/ToastContainer";
import { statementPageI18n } from "~/modules/Statement/StatementPage.i18n";
import { lowerFirst } from "lodash";
import { useCheckIdExpireDateQuery } from "~/features/statement/statementQueries";
import { usePermission } from "~/features/hooks/useHasPermission";
import { RESOURCES } from "~/common/resources";

interface RetailAccountsTableProps {
  withBalancesLoading?: boolean;
  balances: { [key: string]: BalanceItem };
  retailAccounts: CustomerRetailAccount[];
  customer?: CustomerDto;
  authorizedPersons?: CustomerAuthorizedPersonsResponse[];
  hasCardApplicationAction: boolean;
}

const styles = {
  collapsibleRow: (t: Theme) =>
    css({
      paddingTop: tokens.scale(t, "10"),
      paddingBottom: tokens.scale(t, "10"),
    }),
  // TODO: remove after implementing number-like columns in ui-lib
  alignRight: (t: Theme) =>
    css({
      [tokens.mediaQueries(t, "xl")]: {
        textAlign: "right",
      },
    }),
  collapseButtonWrapper: css({
    display: "flex",
    justifyContent: "end",
  }),
  collapseButton: css({
    position: "unset",
  }),
  clickableRow: css({
    cursor: "pointer",
  }),
  disableRow: css({
    color: "grey",
  }),
  dotsMenuWrapper: (t: Theme) =>
    css({
      paddingTop: tokens.scale(t, "4"),
    }),
};

const customerTableConfig = {
  cols: [
    "150px",
    "250px",
    "175px",
    "125px",
    "80px",
    { w: "95px", isAlignedRight: true },
    { w: "145px", isAlignedRight: true },
    "62px",
  ],
  headers: (tr: TrFunction) => [
    tr(retailAccountsTableI18n.retailAccount),
    tr(retailAccountsTableI18n.accountNumber),
    tr(retailAccountsTableI18n.type),
    tr(retailAccountsTableI18n.status),
    tr(retailAccountsTableI18n.active),
    tr(retailAccountsTableI18n.commision),
    tr(retailAccountsTableI18n.balance),
    "",
  ],
};

export const RetailAccountsTable: React.FC<RetailAccountsTableProps> = memo(
  (props) => {
    const {
      retailAccounts,
      balances,
      hasCardApplicationAction,
      customer,
      authorizedPersons,
    } = props;

    const customerId = customer?.idParty as number;

    const { tr } = useI18n();
    const { isFeatureEnabled } = useFeatureFlags();
    const { isViewOnlyUser } = usePermission();
    const { openedRows, handleToggleRow } = useCollapseRow();
    const tableHeaders = useMemo(() => customerTableConfig.headers(tr), [tr]);
    const navigate = useNavigate();
    const hasViewAccountAction = useHasAction("customer.account.view");
    const { data: validationDataId } = useCheckIdExpireDateQuery(
      Number(customerId)
    );

    const isViewOnly = isViewOnlyUser(RESOURCES.ACCOUNT);

    const handleDetailsNavigation = (account: CustomerRetailAccount) => {
      if (hasViewAccountAction && !isViewOnly) {
        navigate(
          `/customers/${customerId}/account-details/${account.productId}`,
          {
            state: {
              customer,
              authorizedPersons,
            },
          }
        );
      }
    };

    const handleStatementNavigation = (
      account: CustomerRetailAccount,
      isOldStatement: boolean
    ) => {
      if (validationDataId && validationDataId.statuses.length !== 0) {
        const errorMessages = validationDataId.statuses.map((status) => {
          const statusKey = lowerFirst(
            status.toString()
          ) as keyof typeof statementPageI18n.validationResponseStatus;
          return tr(statementPageI18n.validationResponseStatus[statusKey]);
        });
        showMultipleError(errorMessages);
        return;
      }
      navigate(
        `/customers/${customerId}/statement/${account.productId}${
          isOldStatement ? "?isOldStatement" : ""
        }`
      );
    };

    const handleBankCertificateNavigation = () => {
      navigate(`/customers/${customerId}/bankCertificate`);
    };

    const handleApplyForCardNavigation = (account: CustomerRetailAccount) => {
      navigate(
        `/cards/debit/${account.productId}/idParty/${customerId}/create`
      );
    };

    return (
      <Table cols={customerTableConfig.cols} headers={tableHeaders}>
        {retailAccounts
          .map(
            (account) =>
              [account, balances[account.retailAccountNumber]] as const
          )
          .map(([account, balance]) => (
            <Fragment key={account.productId}>
              <Tr
                css={
                  hasViewAccountAction && !isViewOnly
                    ? styles.clickableRow
                    : styles.disableRow
                }
                onClick={() => handleDetailsNavigation(account)}
              >
                <Text text={account.retailAccountNumber} />

                <Text text={account.accountNumber} />

                <Text text={account.segment} />

                <Text text={account.status} />

                <Text
                  text={
                    account.isActiveInMidas ? (
                      <Icon
                        type="checkmark-ring"
                        size="16"
                        fgColor="green700"
                      />
                    ) : (
                      <Icon type="clear-ring" size="16" fgColor="red600" />
                    )
                  }
                />

                <td css={styles.alignRight}>
                  <Text
                    text={formatCurrency(account.commission, account.currency)}
                  />
                </td>

                <td css={styles.alignRight}>
                  <Text
                    fgColor={toBalanceFgColor(balance)}
                    text={
                      balance?.status === "loading"
                        ? tr(retailAccountsTableI18n.balanceLoading)
                        : formatCurrency(balance?.balance, account.currency)
                    }
                  />
                </td>

                <div
                  css={styles.collapseButtonWrapper}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleToggleRow(account.productId);
                  }}
                >
                  <CollapseButton
                    aria-controls={`account-row:${account.productId}`}
                    isOpen={Boolean(openedRows[account.productId])}
                    customStyle={styles.collapseButton}
                  />
                </div>
                <Stack customStyle={styles.dotsMenuWrapper}>
                  <DotsMenu
                    elements={[
                      {
                        text: "Statement",
                        onClick: (_item, event) => {
                          event.stopPropagation();
                          handleStatementNavigation(account, false);
                        },
                        disabled:
                          !isFeatureEnabled("statement") ||
                          !account.shouldGenerateStatement ||
                          isViewOnly,
                      },
                      {
                        text: "Old Statement",
                        onClick: (_item, event) => {
                          event.stopPropagation();
                          handleStatementNavigation(account, true);
                        },
                        disabled:
                          !isFeatureEnabled("old_statement") ||
                          !account.shouldGenerateStatement ||
                          isViewOnly,
                      },
                      {
                        text: tr(retailAccountsTableI18n.bankCertificate),
                        onClick: (_item, event) => {
                          event.stopPropagation();
                          handleBankCertificateNavigation();
                        },
                        disabled:
                          !isFeatureEnabled("bank_certificate") || isViewOnly,
                      },
                      {
                        text: tr(retailAccountsTableI18n.applyForCard),
                        onClick: (_item, event) => {
                          event.stopPropagation();
                          handleApplyForCardNavigation(account);
                        },
                        disabled:
                          !hasCardApplicationAction ||
                          !account.shouldApplyForCard ||
                          isViewOnly,
                      },
                    ]}
                    item={account}
                    id={account.retailAccountNumber.toString()}
                  />
                </Stack>
              </Tr>

              <CollapsibleTr
                id={`account-row:${account.productId}`}
                isOpen={Boolean(openedRows[account.productId])}
              >
                <Stack gap="12" customStyle={styles.collapsibleRow}>
                  <InfoItem
                    label={tr(retailAccountsTableI18n.isBlockDebit)}
                    value={
                      account.isBlockDebit
                        ? tr(booleansI18n.yes)
                        : tr(booleansI18n.no)
                    }
                  />

                  <InfoItem
                    label={tr(retailAccountsTableI18n.isBlockCredit)}
                    value={
                      account.isBlockCredit
                        ? tr(booleansI18n.yes)
                        : tr(booleansI18n.no)
                    }
                  />

                  <InfoItem
                    label={tr(retailAccountsTableI18n.heldItem)}
                    value={account.heldItem}
                  />
                </Stack>
              </CollapsibleTr>
            </Fragment>
          ))}
      </Table>
    );
  }
);

function toBalanceFgColor(item: BalanceItem | undefined): ColorToken {
  if (item?.balance === undefined) {
    return "gray200";
  }

  return item.balance >= 0 ? "gray800" : "red600";
}

export function formatCurrency(money: number | undefined, currency?: string) {
  if (money === undefined) {
    return undefined;
  }

  // Albanian group separators match polish ones
  const numberFormat = new Intl.NumberFormat("pl-PL", {
    style: "decimal",
    minimumFractionDigits: 2,
    useGrouping: true,
  });

  if (!currency) {
    return numberFormat.format(money);
  }

  return numberFormat.format(money) + " " + currency;
}
