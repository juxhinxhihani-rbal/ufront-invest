import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  BackdropButton,
  Button,
  Card,
  Container,
  FeedbackView,
  Icon,
  Loader,
  Stack,
  Text,
} from "@rbal-modern-luka/ui-library";
import { Link } from "react-router-dom";
import { CustomerBasicInfo } from "~/components/CustomerBasicInfo/CustomerBasicInfo";
import { FinancialRuleTable } from "./components/FinancialRuleTable/FinancialRuleTable";
import { financialAutomationViewI18n } from "./FinancialAutomationView.i18n";
import { styles } from "./FinancialAutomationView.styles";
import { useFinancialAutomationView } from "./useFinancialAutomationView";

export const FinancialAutomationView = () => {
  const { tr } = useI18n();
  const {
    customer,
    isFetchingCustomer,
    financialAutoAccounts,
    hasFinacialAccounts,
    isFetchingFinanciallyAutoAccounts,
    errorFetchingAccounts,
    isRulesDataEmpty,
    refetchFinanciallyAutoAccounts,
    onGoBack,
  } = useFinancialAutomationView();

  if (isFetchingCustomer) {
    return (
      <Stack css={styles.loaderContainer}>
        <Loader withContainer={false} />
      </Stack>
    );
  }

  return (
    <Container as="main">
      <Stack gap={["16", "32"]}>
        <Stack gap="32">
          <Stack d="h" customStyle={styles.buttonsContainer}>
            <BackdropButton
              text={tr(financialAutomationViewI18n.backButton)}
              onClick={onGoBack}
            />

            <Link
              to={`/customers/${customer?.idParty}/edit-financial-rule`}
              css={styles.newConfigurationLink}
            >
              <Stack d="h" css={styles.buttonsContainer}>
                <Text
                  text={tr(financialAutomationViewI18n.newConfigurationLabel)}
                  size="16"
                  lineHeight="24"
                  weight="medium"
                />
                <Icon type="add" size="20" css={styles.newConfigurationIcon} />
              </Stack>
            </Link>
          </Stack>

          <CustomerBasicInfo customer={customer} />
        </Stack>

        <Card>
          <Stack gap="40">
            <Stack gap="6" customStyle={styles.header}>
              <Text
                text={tr(financialAutomationViewI18n.availableFinancialRules)}
                size="24"
                customStyle={styles.financialRulesTitle}
              />
              <Text
                text={tr(financialAutomationViewI18n.finacialRuleSubtitle)}
                size="20"
                fgColor="gray600"
              />
            </Stack>

            {isFetchingFinanciallyAutoAccounts && (
              <Loader withContainer={false} linesNo={3} />
            )}

            {errorFetchingAccounts && (
              <FeedbackView
                title={tr(financialAutomationViewI18n.errorTitle)}
                description={tr(financialAutomationViewI18n.errorDescription)}
                button1={
                  <Button
                    type="submit"
                    variant="solid"
                    colorScheme="yellow"
                    onClick={() => refetchFinanciallyAutoAccounts()}
                    text={tr(financialAutomationViewI18n.errorRefresh)}
                  />
                }
              />
            )}

            {isRulesDataEmpty && (
              <FeedbackView
                title={tr(financialAutomationViewI18n.listEmptyTitle)}
                description={tr(
                  financialAutomationViewI18n.listEmptyDescription
                )}
                icon={<Icon type="face-sad" size="56" />}
              />
            )}

            {hasFinacialAccounts &&
              financialAutoAccounts?.map((account) => (
                <FinancialRuleTable key={account.ruleId} rule={account} />
              ))}
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};
