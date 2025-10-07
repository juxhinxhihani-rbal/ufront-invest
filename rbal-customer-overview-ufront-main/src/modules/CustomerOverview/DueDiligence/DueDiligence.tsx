import {
  Stack,
  Tab,
  Tabs,
  useTabs,
  TabOrientation,
} from "@rbal-modern-luka/ui-library";
import { DueDiligenceDto } from "~/api/customer/customerApi.types";
import { BankingProducts } from "./components/BankingProducts/BankingProducts";
import { CashTransactionsData } from "./components/CashTransactionsData/CashTransactionsData";
import { EmploymentData } from "./components/EmploymentData/EmploymentData";
import { SourceOfIncome } from "./components/SourceOfIncome/SourceOfIncome";
import { employmentDataI18n } from "./components/EmploymentData/EmploymentData.i18n";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { sourceOfIncomeI18n } from "./components/SourceOfIncome/SourceOfIncome.i18n";
import { bankingProductsI18n } from "./components/BankingProducts/BankingProducts.i18n";
import { cashTransactionsDataI18n } from "./components/CashTransactionsData/CashTransactionsData.i18n";
import { styles as globalStyles } from "~/common/styles";
import { css } from "@emotion/react";

interface DueDiligenceProps {
  dueDiligence?: DueDiligenceDto;
}

export enum DueDiligenceTabs {
  EmploymentData = "employment-data",
  SourceOfIncome = "source-of-income",
  BankingProducts = "banking-products",
  CashTransactionsData = "cash-transactions-data",
}

const styles = {
  container: css({
    marginTop: 32,
  }),
  tabs: {
    borderBottom: "unset",
  },
};

export const DueDiligence: React.FC<DueDiligenceProps> = (props) => {
  const { dueDiligence } = props;
  const tabs = useTabs(DueDiligenceTabs.EmploymentData);
  const { tr } = useI18n();
  return (
    <Stack d="h" gap="40" customStyle={styles.container}>
      <Stack>
        <Tabs
          tabs={tabs}
          style={styles.tabs}
          orientation={TabOrientation.Vertical}
        >
          <Tab
            text={tr(employmentDataI18n.header)}
            tabId={DueDiligenceTabs.EmploymentData}
          />
          <Tab
            text={tr(sourceOfIncomeI18n.header)}
            tabId={DueDiligenceTabs.SourceOfIncome}
          />
          <Tab
            text={tr(bankingProductsI18n.header)}
            tabId={DueDiligenceTabs.BankingProducts}
          />
          <Tab
            text={tr(cashTransactionsDataI18n.header)}
            tabId={DueDiligenceTabs.CashTransactionsData}
          />
        </Tabs>
      </Stack>
      <Stack customStyle={globalStyles.fill}>
        {(() => {
          switch (tabs.activeTabId) {
            case DueDiligenceTabs.EmploymentData:
              return <EmploymentData employment={dueDiligence?.employment} />;
            case DueDiligenceTabs.SourceOfIncome:
              return (
                <SourceOfIncome sourceOfIncome={dueDiligence?.sourceOfIncome} />
              );
            case DueDiligenceTabs.BankingProducts:
              return (
                <BankingProducts
                  bankingProducts={dueDiligence?.bankingProducts}
                />
              );
            case DueDiligenceTabs.CashTransactionsData:
              return (
                <CashTransactionsData
                  cashTransactions={dueDiligence?.cashTransactions}
                />
              );
            default:
              return null;
          }
        })()}
      </Stack>
    </Stack>
  );
};
