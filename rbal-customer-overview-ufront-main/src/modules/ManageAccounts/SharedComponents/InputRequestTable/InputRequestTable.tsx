import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Icon, Stack, Table, Text, Tr } from "@rbal-modern-luka/ui-library";
import { useMemo } from "react";
import { styles } from "./InputRequestTable.styles";
import { v4 as uuidv4 } from "uuid";
import { AccountForInputRequest } from "~/api/manageAccounts/manageAccountsApi.types";
import { inputRequestTableI18n } from "./InputRequestTable.i18n";
import { booleansI18n } from "~/features/i18n/booleans.i18n";

interface InputRequestTableProps {
  accounts: AccountForInputRequest[];
  toggleSelectAccount: (accountNumber: string) => void;
  isAccountSelected: (accountNumber: string) => boolean;
  isAllAccountsSelected: boolean;
  toggleSelectAllAccounts: () => void;
}

export const InputRequestTable = ({
  accounts,
  toggleSelectAccount,
  isAccountSelected,
  isAllAccountsSelected,
  toggleSelectAllAccounts,
}: InputRequestTableProps) => {
  const { tr } = useI18n();

  const inputRequestTableConfig = useMemo(
    () => ({
      cols: [
        "50px",
        "120px",
        "150px",
        "100px",
        "120px",
        "120px",
        "120px",
        "120px",
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
            css={styles.checkbox}
            name="allAccountsSelected"
            type="checkbox"
            id="checkbox"
            checked={isAllAccountsSelected}
            onChange={toggleSelectAllAccounts}
          />
          {isAllAccountsSelected && (
            <Icon type="checkmark" css={styles.checkmark} fgColor="white" />
          )}
        </label>,
        tr(inputRequestTableI18n.customerName),
        tr(inputRequestTableI18n.retailAccountNumber),
        tr(inputRequestTableI18n.currency),
        tr(inputRequestTableI18n.accountCode),
        tr(inputRequestTableI18n.isBlockedDebit),
        tr(inputRequestTableI18n.isBlockedCredit),
        tr(inputRequestTableI18n.heldItem),
      ],
    }),
    [tr, toggleSelectAllAccounts, isAllAccountsSelected]
  );

  return (
    <Stack>
      <Stack d="h" customStyle={styles.accountItem}>
        <Stack d="h">
          <Text
            text={tr(inputRequestTableI18n.selectAccount)}
            customStyle={styles.itemLabel}
          />
        </Stack>
      </Stack>
      <Table
        cols={inputRequestTableConfig.cols}
        headers={inputRequestTableConfig.headers}
        withGrayHeaderBorder
      >
        {accounts.map((account) => (
          <Tr key={account.retailAccountNumber}>
            <label
              css={[
                styles.checkboxWrapper,
                isAccountSelected(account.retailAccountNumber) &&
                  styles.checkboxChecked,
              ]}
            >
              <input
                css={styles.checkbox}
                type="checkbox"
                checked={isAccountSelected(account.retailAccountNumber)}
                onChange={() =>
                  toggleSelectAccount(account.retailAccountNumber)
                }
              />
              {isAccountSelected(account.retailAccountNumber) && (
                <Icon type="checkmark" css={styles.checkmark} fgColor="white" />
              )}
            </label>

            <Text
              key={`customerName_${account.retailAccountNumber}`}
              text={account.customerName}
            />

            <Text
              key={`retailAccountNumber_${account.retailAccountNumber}`}
              text={account.retailAccountNumber}
            />

            <Text
              key={`currency_${account.retailAccountNumber}`}
              text={account.currency}
            />

            <Text
              key={`accountCode_${account.retailAccountNumber}`}
              text={account.accountCode}
            />

            <Text
              key={`isBlockDebit_${account.retailAccountNumber}`}
              text={
                account.isBlockDebit
                  ? tr(booleansI18n.yes)
                  : tr(booleansI18n.no)
              }
            />

            <Text
              key={`isBlockCredit_${account.retailAccountNumber}`}
              text={
                account.isBlockCredit
                  ? tr(booleansI18n.yes)
                  : tr(booleansI18n.no)
              }
            />

            <Text
              key={`heldItem_${account.retailAccountNumber}`}
              text={account.heldItem}
            />
          </Tr>
        ))}
      </Table>
    </Stack>
  );
};
