import { Stack, Text, Table, Tr, Icon } from "@rbal-modern-luka/ui-library";
import {
  formatIntlLocalDateTime,
  useI18n,
} from "@rbal-modern-luka/luka-portal-shell";
import { useMemo } from "react";
import { UnblockRequestsForProcessItem } from "~/api/manageAccounts/manageAccountsApi.types";
import { booleansI18n } from "~/features/i18n";
import { unblockRequestProcessTableI18n } from "./UnblockRequestProcessTable.i18n";
import { styles } from "./UnblockRequestProcessTable.styles";
import { v4 as uuidv4 } from "uuid";
import { css } from "@emotion/react";

interface UnblockRequestProcessTableProps {
  accounts: UnblockRequestsForProcessItem[];
  toggleSelectAccount: (idRequest: number) => void;
  isAccountSelected: (idRequest: number) => boolean;
  isAllAccountsSelected: boolean;
  toggleSelectAllAccounts: () => void;
}

export const UnblockRequestProcessTable = ({
  accounts,
  toggleSelectAccount,
  isAccountSelected,
  isAllAccountsSelected,
  toggleSelectAllAccounts,
}: UnblockRequestProcessTableProps) => {
  const { tr } = useI18n();

  const unblockRequestsProcessTableConfig = useMemo(
    () => ({
      cols: [
        "80px",
        "140px",
        "150px",
        "90px",
        "130px",
        "100px",
        "120px",
        "120px",
        "140px",
        "160px",
        "140px",
        "150px",
        "140px",
        "140px",
        "140px",
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
        tr(unblockRequestProcessTableI18n.customerName),
        tr(unblockRequestProcessTableI18n.customerNumber),
        tr(unblockRequestProcessTableI18n.retailAccountNumber),
        tr(unblockRequestProcessTableI18n.currency),
        tr(unblockRequestProcessTableI18n.accountCode),
        tr(unblockRequestProcessTableI18n.blockType),
        tr(unblockRequestProcessTableI18n.unblockAuthority),
        tr(unblockRequestProcessTableI18n.unblockDescription),
        tr(unblockRequestProcessTableI18n.cardUnitNotification),
        tr(unblockRequestProcessTableI18n.amlUnitNotification),
        tr(unblockRequestProcessTableI18n.executionOrder),
        tr(unblockRequestProcessTableI18n.requestStatus),
        tr(unblockRequestProcessTableI18n.userRequested),
        tr(unblockRequestProcessTableI18n.dateTimeInserted),
      ],
    }),
    [tr, toggleSelectAllAccounts, isAllAccountsSelected]
  );

  return (
    <Stack>
      <Stack d="h" customStyle={styles.accountItem}>
        <Stack d="h">
          <Text
            text={tr(unblockRequestProcessTableI18n.selectAccount)}
            customStyle={styles.itemLabel}
          />
        </Stack>
      </Stack>
      <Stack customStyle={css({ overflowX: "auto" })}>
        <Table
          cols={unblockRequestsProcessTableConfig.cols}
          headers={unblockRequestsProcessTableConfig.headers}
          withGrayHeaderBorder
        >
          {accounts.map((account) => (
            <Tr key={account.idRequest.toString()}>
              <label
                css={[
                  styles.checkboxWrapper,
                  isAccountSelected(account.idRequest) &&
                    styles.checkboxChecked,
                ]}
              >
                <input
                  css={styles.checkbox}
                  type="checkbox"
                  checked={isAccountSelected(account.idRequest)}
                  onChange={() => toggleSelectAccount(account.idRequest)}
                />
                {isAccountSelected(account.idRequest) && (
                  <Icon
                    type="checkmark"
                    css={styles.checkmark}
                    fgColor="white"
                  />
                )}
              </label>

              <Text
                key={`customerName_${account.idRequest.toString()}`}
                text={account.customerName}
              />

              <Text
                key={`customerNumber_${account.idRequest.toString()}`}
                text={account.customerNumber}
              />

              <Text
                key={`retailAccountNumber_${account.idRequest.toString()}`}
                text={account.retailAccountNumber.toString()}
              />

              <Text
                key={`currencyCode_${account.idRequest.toString()}`}
                text={account.currencyCode}
              />

              <Text
                key={`accountCode_${account.idRequest.toString()}`}
                text={account.accountCode}
              />
              <Text
                key={`blockType_${account.idRequest.toString()}`}
                text={account.blockType}
              />
              <Text
                key={`unblockAuthority_${account.idRequest.toString()}`}
                text={account.unblockAuthority}
              />
              <Text
                key={`unblockDescription_${account.idRequest.toString()}`}
                text={account.unblockDescription}
              />

              <Text
                key={`shouldNotifyCardUnit_${account.idRequest.toString()}`}
                text={
                  account.shouldNotifyCardUnit
                    ? tr(booleansI18n.yes)
                    : tr(booleansI18n.no)
                }
              />

              <Text
                key={`shouldNotifyAmlUnit_${account.idRequest.toString()}`}
                text={
                  account.shouldNotifyAmlUnit
                    ? tr(booleansI18n.yes)
                    : tr(booleansI18n.no)
                }
              />

              <Text
                key={`executionOrder_${account.idRequest.toString()}`}
                text={account.executionOrder}
              />

              <Text
                key={`requestStatus_${account.idRequest.toString()}`}
                text={account.requestStatus}
              />

              <Text
                key={`userRequested_${account.idRequest.toString()}`}
                text={account.userRequested}
              />

              <Text
                key={`dateTimeInserted_${account.idRequest.toString()}`}
                text={formatIntlLocalDateTime(account.dateTimeInserted)}
              />
            </Tr>
          ))}
        </Table>
      </Stack>
    </Stack>
  );
};
