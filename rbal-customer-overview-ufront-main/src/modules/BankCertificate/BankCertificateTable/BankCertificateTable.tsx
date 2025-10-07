import {
  formatIntlLocalDate,
  useI18n,
} from "@rbal-modern-luka/luka-portal-shell";
import { Icon, Stack, Table, Tr, Text } from "@rbal-modern-luka/ui-library";
import { useMemo } from "react";
import { booleansI18n } from "~/features/i18n";
import { bankCertificateTable18n } from "./BankCertificateTable.i18n";
import { styles } from "./BankCertificateTable.styles";
import { v4 as uuidv4 } from "uuid";
import { BankCertificateAccount } from "~/api/bankCertificate/bankCertificateApi.types";

interface BankCertificateTableProps {
  accounts: BankCertificateAccount[];
  toggleSelectAccount: (accountNumber: string) => void;
  isAccountSelected: (accountNumber: string) => boolean;
  isAllAccountsSelected: boolean;
  toggleSelectAllAccounts: () => void;
}

export const BankCertificateTable = ({
  accounts,
  toggleSelectAccount,
  isAccountSelected,
  isAllAccountsSelected,
  toggleSelectAllAccounts,
}: BankCertificateTableProps) => {
  const { tr } = useI18n();

  const bankCertificateTableConfig = useMemo(
    () => ({
      cols: [
        "24px",
        "90px",
        "170px",
        "100px",
        "80px",
        "200px",
        "80px",
        "90px",
        "90px",
        "90px",
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
            name="allRightsAuthorized"
            type="checkbox"
            id="checkbox"
            checked={isAllAccountsSelected}
            onChange={toggleSelectAllAccounts}
          />
          {isAllAccountsSelected && (
            <Icon type="checkmark" css={styles.checkmark} fgColor="white" />
          )}
        </label>,
        tr(bankCertificateTable18n.retailAccount),
        tr(bankCertificateTable18n.accountNumber),
        tr(bankCertificateTable18n.type),
        tr(bankCertificateTable18n.currency),
        tr(bankCertificateTable18n.iban),
        tr(bankCertificateTable18n.active),
        tr(bankCertificateTable18n.status),
        tr(bankCertificateTable18n.openDate),
        tr(bankCertificateTable18n.segment),
      ],
    }),
    [tr, toggleSelectAllAccounts, isAllAccountsSelected]
  );

  return (
    <Stack>
      <Stack d="h" customStyle={styles.accountItem}>
        <Stack d="h">
          <Text
            text={tr(bankCertificateTable18n.selectAccount)}
            customStyle={styles.itemLabel}
          />
        </Stack>
      </Stack>
      <Table
        cols={bankCertificateTableConfig.cols}
        headers={bankCertificateTableConfig.headers}
        withGrayHeaderBorder
      >
        {accounts.map((account) => (
          <Tr key={account.retailAccount}>
            <label
              css={[
                styles.checkboxWrapper,
                isAccountSelected(account.retailAccount) &&
                  styles.checkboxChecked,
              ]}
            >
              <input
                css={styles.checkbox}
                type="checkbox"
                checked={isAccountSelected(account.retailAccount)}
                onChange={() => toggleSelectAccount(account.retailAccount)}
              />
              {isAccountSelected(account.retailAccount) && (
                <Icon type="checkmark" css={styles.checkmark} fgColor="white" />
              )}
            </label>

            <Text
              key={`retailAccount_${account.accountNumber}`}
              text={account.retailAccount}
            />

            <Text
              key={`accountNumber_${account.accountNumber}`}
              text={account.accountNumber}
            />

            <Text key={`type_${account.accountNumber}`} text={account.type} />

            <Text key={`ccy_${account.accountNumber}`} text={account.ccy} />

            <Text key={`iban_${account.accountNumber}`} text={account.iban} />

            <Text
              key={`active${account.accountNumber}`}
              text={account.active ? tr(booleansI18n.yes) : tr(booleansI18n.no)}
            />

            <Text
              key={`status_${account.accountNumber}`}
              text={account.status ? tr(booleansI18n.yes) : tr(booleansI18n.no)}
            />

            <Text
              key={`openDate_${account.accountNumber}`}
              text={formatIntlLocalDate(account.openDate)}
            />

            <Text
              key={`segment_${account.accountNumber}`}
              text={account.segment}
            />
          </Tr>
        ))}
      </Table>
    </Stack>
  );
};
