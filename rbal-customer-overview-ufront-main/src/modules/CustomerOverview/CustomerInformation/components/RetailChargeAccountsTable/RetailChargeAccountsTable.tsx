import { Fragment, useCallback, useMemo } from "react";
import {
  CollapseButton,
  CollapsibleTr,
  Icon,
  Stack,
  Table,
  Text,
  Tr,
} from "@rbal-modern-luka/ui-library";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { useCollapseRow } from "~/features/hooks/useCollapseRow";
import { InfoItem } from "~/components/InfoItem";
import { booleansI18n } from "~/features/i18n";
import { retailAccountsTableI18n } from "../RetailAccountsTable/RetailAccountsTable.i18n";
import { CustomerRetailAccount } from "~/api/customer/customerApi.types";
import { styles } from "./RetailChargeAccountsTable.styles";

interface RetailChargeAccountsTableProps {
  retailAccounts: CustomerRetailAccount[];
  selectedChargedAccount?: CustomerRetailAccount;
  setSelectedChargedAccount: (
    selectedChargedAccount: CustomerRetailAccount
  ) => void;
}

export const RetailChargeAccountsTable = ({
  retailAccounts,
  selectedChargedAccount,
  setSelectedChargedAccount,
}: RetailChargeAccountsTableProps) => {
  const { tr } = useI18n();

  const { openedRows, handleToggleRow } = useCollapseRow();

  const customerTableSelectConfig = useMemo(
    () => ({
      cols: [
        "50px",
        "160px",
        "190px",
        "250px",
        "75px",
        { w: "105px", isAlignedRight: true },
        "77px",
      ],
      headers: [
        "",
        tr(retailAccountsTableI18n.retailAccount),
        tr(retailAccountsTableI18n.type),
        tr(retailAccountsTableI18n.status),
        tr(retailAccountsTableI18n.active),
        tr(retailAccountsTableI18n.commision),
        "",
      ],
    }),
    [tr]
  );

  const isChecked = useCallback(
    (account: CustomerRetailAccount) => {
      if (selectedChargedAccount) {
        return selectedChargedAccount?.productId === account.productId;
      }

      if (account.isChargedAccount) {
        setSelectedChargedAccount(account);
        return true;
      }

      return false;
    },
    [selectedChargedAccount, setSelectedChargedAccount]
  );

  return (
    <Table
      style={styles.table}
      cols={customerTableSelectConfig.cols}
      headers={customerTableSelectConfig.headers}
    >
      {retailAccounts.map((account) => (
        <Fragment key={account.productId}>
          <Tr>
            <input
              css={styles.radio}
              name="isChargedAccount"
              type="radio"
              checked={isChecked(account)}
              onClick={() => setSelectedChargedAccount(account)}
            />

            <Text text={account.retailAccountNumber} />

            <Text text={account.segment} />

            <Text text={account.status} />

            <Text
              text={
                account.isActive ? (
                  <Icon type="checkmark-ring" size="24" fgColor="green400" />
                ) : (
                  <Icon type="clear-ring" size="24" fgColor="red600" />
                )
              }
              style={{ marginLeft: "6px" }}
            />

            <td css={styles.alignRight}>
              <Text
                text={formatCurrency(account.commission, account.currency)}
              />
            </td>

            <div css={styles.collapseButtonWrapper}>
              <CollapseButton
                css={styles.arrowDown}
                aria-controls={`account-row:${account.productId}`}
                isOpen={Boolean(openedRows[account.productId])}
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => handleToggleRow(account.productId)}
              />
            </div>
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
};

function formatCurrency(money: number | undefined, currency?: string) {
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
