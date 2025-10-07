import {
  formatIntlLocalDateTime,
  useI18n,
} from "@rbal-modern-luka/luka-portal-shell";
import { Icon, Stack, Table, Text, Tr } from "@rbal-modern-luka/ui-library";
import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { ReverseHeldItemsList } from "~/api/manageAccounts/manageAccountsApi.types";
import { booleansI18n } from "~/features/i18n/booleans.i18n";
import { revertHeldItemTableI18n } from "./ReverseHeldItemTable.i18n";
import { styles } from "./ReverseHeldItemTable.styles";

interface ReverseHeldItemTableProps {
  accounts: ReverseHeldItemsList[];
  toggleSelectAccount: (idRequest: number) => void;
  isAccountSelected: (idRequest: number) => boolean;
  isAllAccountsSelected: boolean;
  toggleSelectAllAccounts: () => void;
}

export const ReverseHeldItemTable = ({
  accounts,
  toggleSelectAccount,
  isAccountSelected,
  isAllAccountsSelected,
  toggleSelectAllAccounts,
}: ReverseHeldItemTableProps) => {
  const { tr } = useI18n();

  const inputRequestTableConfig = useMemo(
    () => ({
      cols: [
        "50px",
        "200px",
        "100px",
        "100px",
        "80px",
        "80px",
        "100px",
        "80px",
        "120px",
        "160px",
        "120px",
        "120px",
        "120px",
        "120px",
        "120px",
        "120px",
        "120px",
        "120px",
        "120px",
        "130px",
        "100px",
        "100px",
      ],
      headers: [
        <label
          key={uuidv4()}
          css={[
            styles.checkboxWrapper,
            isAllAccountsSelected && styles.checkboxChecked,
          ]}
          htmlFor="checkbox"
        >
          <input
            name="allRequestsSelected"
            type="checkbox"
            id="checkbox"
            checked={isAllAccountsSelected}
            onChange={toggleSelectAllAccounts}
          />
          {isAllAccountsSelected && (
            <Icon type="checkmark" css={styles.checkmark} fgColor="white" />
          )}
        </label>,
        tr(revertHeldItemTableI18n.customerName),
        tr(revertHeldItemTableI18n.customerNumber),
        tr(revertHeldItemTableI18n.retailAccountNumber),
        tr(revertHeldItemTableI18n.currency),
        tr(revertHeldItemTableI18n.accountCode),
        tr(revertHeldItemTableI18n.heldType),
        tr(revertHeldItemTableI18n.actionType),
        tr(revertHeldItemTableI18n.creditor),
        tr(revertHeldItemTableI18n.heldAuthority),
        tr(revertHeldItemTableI18n.heldReason),
        tr(revertHeldItemTableI18n.heldAmount),
        tr(revertHeldItemTableI18n.heldAmountUserInput),
        tr(revertHeldItemTableI18n.currencyOrder),
        tr(revertHeldItemTableI18n.heldStartDate),
        tr(revertHeldItemTableI18n.cardUnitNotification),
        tr(revertHeldItemTableI18n.amUnitNotificationEmail),
        tr(revertHeldItemTableI18n.requestStatus),
        tr(revertHeldItemTableI18n.userRequested),
        tr(revertHeldItemTableI18n.dateTimeInserted),
        tr(revertHeldItemTableI18n.heldItemReference),
        tr(revertHeldItemTableI18n.comment),
      ],
    }),
    [tr, toggleSelectAllAccounts, isAllAccountsSelected]
  );

  return (
    <Stack>
      <Stack d="h" customStyle={styles.accountItem}>
        <Stack d="h">
          <Text
            text={tr(revertHeldItemTableI18n.selectRequest)}
            customStyle={styles.itemLabel}
          />
        </Stack>
      </Stack>
      <Stack customStyle={styles.table}>
        <Table
          cols={inputRequestTableConfig.cols}
          headers={inputRequestTableConfig.headers}
          withGrayHeaderBorder
        >
          {accounts.map((account) => (
            <Tr key={account.requestId.toString()}>
              <label
                css={[
                  styles.checkboxWrapper,
                  isAccountSelected(account.requestId) &&
                    styles.checkboxChecked,
                ]}
              >
                <input
                  type="checkbox"
                  checked={isAccountSelected(account.requestId)}
                  onChange={() => toggleSelectAccount(account.requestId)}
                />
                {isAccountSelected(account.requestId) && (
                  <Icon
                    type="checkmark"
                    css={styles.checkmark}
                    fgColor="white"
                  />
                )}
              </label>
              <Text
                key={`customerName_${account.requestId.toString()}`}
                text={account.customerName}
              />
              <Text
                key={`customerNumber_${account.requestId.toString()}`}
                text={account.customerNumber}
              />

              <Text
                key={`retailAccountNumber_${account.requestId.toString()}`}
                text={account.retailAccountNumber.toString()}
              />

              <Text
                key={`currencyCode_${account.requestId.toString()}`}
                text={account.currencyCode}
              />

              <Text
                key={`accountCode_${account.requestId.toString()}`}
                text={account.accountCode}
              />
              <Text
                key={`heldType_${account.requestId.toString()}`}
                text={account.heldType}
              />
              <Text
                key={`actionType_${account.requestId.toString()}`}
                text={account.actionType}
              />
              <Text
                key={`creditor_${account.requestId.toString()}`}
                text={account.creditor}
              />
              <Text
                key={`heldAuthority_${account.requestId.toString()}`}
                text={account.heldAuthority}
              />
              <Text
                key={`heldReason_${account.requestId.toString()}`}
                text={account.heldReason}
              />
              <Text
                key={`heldAmount_${account.requestId.toString()}`}
                text={account.heldAmount}
              />
              <Text
                key={`heldAmountUserInput_${account.requestId.toString()}`}
                text={account.heldAmountUserInput}
              />
              <Text
                key={`currencyOrder_${account.requestId.toString()}`}
                text={account.currencyOrder}
              />
              <Text
                key={`heldStartDate_${account.requestId.toString()}`}
                text={formatIntlLocalDateTime(account.heldStartDate)}
              />
              <Text
                key={`shouldNotifyCardUnit_${account.requestId.toString()}`}
                text={
                  account.shouldNotifyCardUnit
                    ? tr(booleansI18n.yes)
                    : tr(booleansI18n.no)
                }
              />

              <Text
                key={`amNotificationUnitEmail_${account.requestId.toString()}`}
                text={account.amNotificationUnitEmail}
              />
              <Text
                key={`requestStatus_${account.requestId.toString()}`}
                text={account.requestStatus}
              />

              <Text
                key={`userRequested_${account.requestId.toString()}`}
                text={account.userRequested}
              />

              <Text
                key={`dateTimeInserted_${account.requestId.toString()}`}
                text={formatIntlLocalDateTime(account.dateTimeInput)}
              />
              <Text
                key={`heldItemReference_${account.requestId.toString()}`}
                text={account.heldItemReference}
              />
              <Text
                key={`comment_${account.requestId.toString()}`}
                text={account.comment}
              />
            </Tr>
          ))}
        </Table>
      </Stack>
    </Stack>
  );
};
