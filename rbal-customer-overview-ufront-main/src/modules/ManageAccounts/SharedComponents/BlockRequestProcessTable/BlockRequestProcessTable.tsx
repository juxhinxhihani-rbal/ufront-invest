import { Stack, Text, Table, Tr, Icon } from "@rbal-modern-luka/ui-library";
import {
  formatIntlLocalDateTime,
  useI18n,
} from "@rbal-modern-luka/luka-portal-shell";
import { useMemo } from "react";
import { RequestsStatusListItem } from "~/api/manageAccounts/manageAccountsApi.types";
import { booleansI18n } from "~/features/i18n";
import { blockRequestProcessTableI18n } from "./BlockRequestProcessTable.i18n";
import { styles } from "./BlockRequestProcessTable.styles";
import { v4 as uuidv4 } from "uuid";
import { css } from "@emotion/react";

interface BlockRequestProcessTableProps {
  accounts: RequestsStatusListItem[];
  toggleSelectAccount: (idRequest: number) => void;
  isAccountSelected: (idRequest: number) => boolean;
  isAllAccountsSelected: boolean;
  toggleSelectAllAccounts: () => void;
}

export const BlockRequestProcessTable = ({
  accounts,
  toggleSelectAccount,
  isAccountSelected,
  isAllAccountsSelected,
  toggleSelectAllAccounts,
}: BlockRequestProcessTableProps) => {
  const { tr } = useI18n();

  const blockRequestsProcessTableConfig = useMemo(
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
        tr(blockRequestProcessTableI18n.customerNumber),
        tr(blockRequestProcessTableI18n.retailAccountNumber),
        tr(blockRequestProcessTableI18n.currency),
        tr(blockRequestProcessTableI18n.accountCode),
        tr(blockRequestProcessTableI18n.blockType),
        tr(blockRequestProcessTableI18n.blockAuthority),
        tr(blockRequestProcessTableI18n.blockingReason),
        tr(blockRequestProcessTableI18n.blockStartDate),
        tr(blockRequestProcessTableI18n.blockEndDate),
        tr(blockRequestProcessTableI18n.cardUnitNotification),
        tr(blockRequestProcessTableI18n.amlUnitNotification),
        tr(blockRequestProcessTableI18n.executionOrder),
        tr(blockRequestProcessTableI18n.requestStatus),
        tr(blockRequestProcessTableI18n.userRequested),
        tr(blockRequestProcessTableI18n.dateTimeInserted),
      ],
    }),
    [tr, toggleSelectAllAccounts, isAllAccountsSelected]
  );

  return (
    <Stack>
      <Stack d="h" customStyle={styles.accountItem}>
        <Stack d="h">
          <Text
            text={tr(blockRequestProcessTableI18n.selectAccount)}
            customStyle={styles.itemLabel}
          />
        </Stack>
      </Stack>
      <Stack customStyle={css({ overflowX: "auto" })}>
        <Table
          cols={blockRequestsProcessTableConfig.cols}
          headers={blockRequestsProcessTableConfig.headers}
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
                key={`blockAuthority_${account.idRequest.toString()}`}
                text={account.blockAuthority}
              />
              <Text
                key={`blockingReason_${account.idRequest.toString()}`}
                text={account.blockingReason}
              />
              <Text
                key={`blockStartDate_${account.idRequest.toString()}`}
                text={formatIntlLocalDateTime(account.blockStartDate)}
              />
              <Text
                key={`blockEndDate_${account.idRequest.toString()}`}
                text={formatIntlLocalDateTime(account.blockEndDate)}
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
