import { css } from "@emotion/react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  useTabs,
  TabOrientation,
  Tab,
  Tabs,
} from "@rbal-modern-luka/ui-library";
import { Loader, Stack } from "@rbal-modern-luka/ui-library";
import { useParams } from "react-router";
import { CustomerDto } from "~/api/customer/customerApi.types";
import { useReadDigitalBankingQuery } from "~/features/customer/customerQueries";
import { BusinessInfo } from "./components/BusinessInfo/BusinessInfo";
import { businessInfoI18n } from "./components/BusinessInfo/BusinessInfo.i18n";
import { CustomerDetails } from "./components/CustomerDetail/CustomerDetails";
import { customerDetailsI18n } from "./components/CustomerDetail/CustomerDetails.i18n";
import { RetailInfo } from "./components/RetailInfo/RetailInfo";
import { retailInfoI18n } from "./components/RetailInfo/RetailInfo.i18n";
import { styles as globalStyles } from "~/common/styles";
import { printDigitalBankingDocumentsI18n } from "./components/PrintDigitalBankingDocuments/PrintDigitalBankingDocuments.i18n";
import { PrintDigitalBankingDocuments } from "./components/PrintDigitalBankingDocuments/PrintDigitalBankingDocuments";

interface DigitalBankingProps {
  customer: CustomerDto;
}

export enum DigitalBankingTabs {
  CustomerDetails = "customer-details",
  RetailInfo = "retail-info",
  BusinessInfo = "business-info",
  PrintDigitalBankingDocuments = "print-digital-banking-documents",
}

const styles = {
  container: css({
    marginTop: 32,
  }),
  tabs: {
    borderBottom: "unset",
  },
};

export const DigitalBanking = ({ customer }: DigitalBankingProps) => {
  const { customerId } = useParams();
  const { query: readDigitalBankingQuery } =
    useReadDigitalBankingQuery(customerId);
  const tabs = useTabs(DigitalBankingTabs.CustomerDetails);
  const { tr } = useI18n();
  const digitalBankingData = readDigitalBankingQuery.data;

  return (
    <Stack d="h" gap="40" customStyle={styles.container}>
      {readDigitalBankingQuery.isLoading ? (
        <Stack customStyle={globalStyles.fill}>
          <Loader linesNo={3} withContainer={false} />
        </Stack>
      ) : (
        <>
          <Stack>
            <Tabs
              tabs={tabs}
              style={styles.tabs}
              orientation={TabOrientation.Vertical}
            >
              <Tab
                text={tr(customerDetailsI18n.header)}
                tabId={DigitalBankingTabs.CustomerDetails}
              />
              <Tab
                text={tr(retailInfoI18n.header)}
                tabId={DigitalBankingTabs.RetailInfo}
              />
              <Tab
                text={tr(businessInfoI18n.header)}
                tabId={DigitalBankingTabs.BusinessInfo}
              />
              <Tab
                text={tr(printDigitalBankingDocumentsI18n.header)}
                tabId={DigitalBankingTabs.PrintDigitalBankingDocuments}
              />
            </Tabs>
          </Stack>
          <Stack customStyle={globalStyles.fill}>
            {(() => {
              switch (tabs.activeTabId) {
                case DigitalBankingTabs.CustomerDetails:
                  return (
                    <CustomerDetails
                      data={digitalBankingData}
                      customer={customer}
                    />
                  );
                case DigitalBankingTabs.RetailInfo:
                  return (
                    <RetailInfo
                      customerId={customer?.idParty}
                      data={digitalBankingData}
                    />
                  );
                case DigitalBankingTabs.BusinessInfo:
                  return (
                    <BusinessInfo
                      customerId={customer?.idParty}
                      data={digitalBankingData}
                    />
                  );
                case DigitalBankingTabs.PrintDigitalBankingDocuments:
                  return (
                    <PrintDigitalBankingDocuments
                      actions={digitalBankingData?.actions ?? []}
                    />
                  );
                default:
                  return null;
              }
            })()}
          </Stack>
        </>
      )}
    </Stack>
  );
};
