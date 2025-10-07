import { css } from "@emotion/react";
import {
  formatIntlLocalDateTime,
  useI18n,
} from "@rbal-modern-luka/luka-portal-shell";
import { Icon, Stack, Table, Text, Tr } from "@rbal-modern-luka/ui-library";
import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { TemporaryUnblockRequestItem } from "~/api/manageAccounts/manageAccountsApi.types";
import { booleansI18n } from "~/features/i18n/booleans.i18n";
import { temporaryUnblockRequestsTableI18n } from "./TemporaryUnblockRequestsTable.i18n";
import { styles } from "./TemporaryUnblockRequestsTable.styles";

interface TemporaryUnblockRequestsTableProps {
  accounts: TemporaryUnblockRequestItem[];
  toggleSelectAccount: (idRequest: number) => void;
  isAccountSelected: (idRequest: number) => boolean;
  isAllAccountsSelected: boolean;
  toggleSelectAllAccounts: () => void;
}

export const TemporaryUnblockRequestsTable = ({
  accounts,
  toggleSelectAccount,
  isAccountSelected,
  isAllAccountsSelected,
  toggleSelectAllAccounts,
}: TemporaryUnblockRequestsTableProps) => {
  const { tr } = useI18n();

  const temporaryUnblockRequestsTableConfig = useMemo(
    () => ({
      cols: [
        "80px",
        "120px",
        "120px",
        "90px",
        "130px",
        "100px",
        "140px",
        "120px",
        "160px",
        "160px",
        "160px",
        "160px",
        "140px",
        "140px",
        "140px",
        "180px",
        "160px",
        "160px",
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
        tr(temporaryUnblockRequestsTableI18n.customerNumber),
        tr(temporaryUnblockRequestsTableI18n.retailAccountNumber),
        tr(temporaryUnblockRequestsTableI18n.currency),
        tr(temporaryUnblockRequestsTableI18n.accountCode),
        tr(temporaryUnblockRequestsTableI18n.blockType),
        tr(temporaryUnblockRequestsTableI18n.blockAuthority),
        tr(temporaryUnblockRequestsTableI18n.blockingReason),
        tr(temporaryUnblockRequestsTableI18n.blockStartDate),
        tr(temporaryUnblockRequestsTableI18n.blockEndDate),
        tr(temporaryUnblockRequestsTableI18n.cardUnitNotification),
        tr(temporaryUnblockRequestsTableI18n.amlUnitNotification),
        tr(temporaryUnblockRequestsTableI18n.executionOrder),
        tr(temporaryUnblockRequestsTableI18n.blockUserRequested),
        tr(temporaryUnblockRequestsTableI18n.unblockUserRequested),
        tr(temporaryUnblockRequestsTableI18n.unblockDescription),
        tr(temporaryUnblockRequestsTableI18n.unblockAuthority),
        tr(temporaryUnblockRequestsTableI18n.isTemporary),
      ],
    }),
    [tr, toggleSelectAllAccounts, isAllAccountsSelected]
  );
  return (
    <Stack>
      <Stack d="h" customStyle={styles.accountItem}>
        <Stack d="h">
          <Text
            text={tr(temporaryUnblockRequestsTableI18n.selectAccount)}
            customStyle={styles.itemLabel}
          />
        </Stack>
      </Stack>
      <Stack customStyle={css({ overflowX: "auto" })}>
        <Table
          cols={temporaryUnblockRequestsTableConfig.cols}
          headers={temporaryUnblockRequestsTableConfig.headers}
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
                key={`nrp_${account.idRequest.toString()}`}
                text={account.nrp}
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
                key={`userRequested${account.idRequest.toString()}`}
                text={account.userRequested}
              />
              <Text
                key={`userReq${account.idRequest.toString()}`}
                text={account.userReq}
              />

              <Text
                key={`unblockDescription_${account.idRequest.toString()}`}
                text={account.unblockDescription}
              />
              <Text
                key={`unblockAuthority_${account.idRequest.toString()}`}
                text={account.unblockAuthority}
              />
              <Text
                key={`isTemporary_${account.idRequest.toString()}`}
                text={
                  account.isTemporary
                    ? tr(booleansI18n.yes)
                    : tr(booleansI18n.no)
                }
              />
            </Tr>
          ))}
        </Table>
      </Stack>
    </Stack>
  );
};
