import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  DotsMenu,
  Icon,
  Stack,
  Table,
  Text,
  Tr,
} from "@rbal-modern-luka/ui-library";
import { Link, useParams } from "react-router-dom";
import { InfoBar } from "~/components/InfoBar/InfoBar";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { financialRuleTableI18n } from "./FinancialRuleTable.i18n";
import { styles } from "./FinancialRuleTable.styles";
import { FinancialRuleTableProps } from "./types";
import { useFinancialRuleTable } from "./useFinancialRuleTable";

export const FinancialRuleTable = ({ rule }: FinancialRuleTableProps) => {
  const { tr } = useI18n();
  const { customerId } = useParams();
  const {
    tableCols,
    tableHeaders,
    onEditAccountConfiguration,
    onDeleteAccountConfiguration,
  } = useFinancialRuleTable();

  const hasRuleAccounts = Boolean(rule?.ruleAccounts?.length);
  return (
    <Stack gap="12">
      <RowHeader
        withBorder={false}
        pb="12"
        label={<Text size="16" weight="bold" text={rule.ruleName} />}
        cta={
          <Link
            id="addAcccountLink"
            to={`/customers/${customerId}/create-account-rule`}
            css={styles.createNewCofiguration}
          >
            <Text
              id="addAcccountLabel"
              size="16"
              weight="medium"
              text={tr(financialRuleTableI18n.addAccount)}
            />
            <Icon
              id="createNewCofigurationIcon"
              type="add"
              css={styles.createNewCofigurationIcon}
            />
            &nbsp;
          </Link>
        }
      />

      {!hasRuleAccounts && (
        <InfoBar text={tr(financialRuleTableI18n.emptyList)} />
      )}

      {hasRuleAccounts && (
        <Table cols={tableCols} headers={tableHeaders}>
          {rule.ruleAccounts.map((account, index) => (
            <Tr key={`${index}-${account.creditAccountNumber}`}>
              <Text text={account.debitAccountNumber} />

              <Text text={account.creditAccountNumber} />

              <Text text={account.bandValue} />

              <Text text={account.currency} />

              <Stack customStyle={styles.dotsMenuWrapper}>
                <DotsMenu
                  elements={[
                    {
                      text: tr(financialRuleTableI18n.editAccountConfiguration),
                      onClick: onEditAccountConfiguration,
                    },
                    {
                      text: tr(
                        financialRuleTableI18n.deleteAccountConfiguration
                      ),
                      onClick: onDeleteAccountConfiguration,
                    },
                  ]}
                  item={account}
                  id={account.debitAccountNumber}
                />
              </Stack>
            </Tr>
          ))}
        </Table>
      )}
    </Stack>
  );
};
