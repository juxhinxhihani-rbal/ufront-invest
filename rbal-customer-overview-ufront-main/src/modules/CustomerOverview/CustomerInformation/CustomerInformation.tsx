import { css } from "@emotion/react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Stack,
  Tab,
  TabOrientation,
  Tabs,
  useTabs,
} from "@rbal-modern-luka/ui-library";
import {
  CustomerAuthorizedPersonsResponse,
  CustomerDto,
} from "~/api/customer/customerApi.types";
import { styles as globalStyles } from "~/common/styles";
import { isPremiumUserCheck } from "~/common/utils";
import { AddressData } from "./components/AddressData/AddressData";
import { addressDataI18n } from "./components/AddressData/AddressData.i18n";
import { BankData } from "./components/BankData/BankData";
import { bankDataI18n } from "./components/BankData/BankData.i18n";
import { ContactData } from "./components/ContactData/ContactData";
import { contactDataI18n } from "./components/ContactData/ContactData.i18n";
import { CustomerDetail } from "./components/CustomerDetail/CustomerDetail";
import { customerDetailI18n } from "./components/CustomerDetail/CustomerDetail.i18n";
import { PersonalDocumentData } from "./components/PersonalDocumentData/PersonalDocumentData";
import { personalDocumentDataI18n } from "./components/PersonalDocumentData/PersonalDocumentData.i18n";
import { PremiumData } from "./components/PremiumData/PremiumData";
import { premiumDataI18n } from "./components/PremiumData/PremiumData.i18n";
import { bankInformationI18n } from "./components/BankInformation/BankInformation.i18n";
import { BankInformation } from "./components/BankInformation/BankInformation";

interface CustomerInformationProps {
  customer: CustomerDto;
  authorizedPersons?: CustomerAuthorizedPersonsResponse[];
}

export enum CustomerInformationTabs {
  PremiumData = "premium-data",
  BankData = "bank-data",
  AddressData = "address-data",
  CustomerDetail = "customer-detail",
  PersonalDocumentData = "personal-document-data",
  ContactData = "contact-data",
  BankInformation = "bank-information",
}

const styles = {
  container: css({
    marginTop: 32,
  }),
  tabs: {
    borderBottom: "unset",
  },
};

export const CustomerInformation = ({
  customer,
  authorizedPersons,
}: CustomerInformationProps) => {
  const tabs = useTabs(CustomerInformationTabs.BankData);
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
            text={tr(bankDataI18n.header)}
            tabId={CustomerInformationTabs.BankData}
          />
          {isPremiumUserCheck(customer) && (
            <Tab
              text={tr(premiumDataI18n.header)}
              tabId={CustomerInformationTabs.PremiumData}
            />
          )}
          <Tab
            text={tr(addressDataI18n.header)}
            tabId={CustomerInformationTabs.AddressData}
          />
          <Tab
            text={tr(customerDetailI18n.header)}
            tabId={CustomerInformationTabs.CustomerDetail}
          />
          <Tab
            text={tr(personalDocumentDataI18n.header)}
            tabId={CustomerInformationTabs.PersonalDocumentData}
          />
          <Tab
            text={tr(contactDataI18n.header)}
            tabId={CustomerInformationTabs.ContactData}
          />
          <Tab
            text={tr(bankInformationI18n.header)}
            tabId={CustomerInformationTabs.BankInformation}
          />
        </Tabs>
      </Stack>
      <Stack customStyle={globalStyles.fill}>
        {(() => {
          switch (tabs.activeTabId) {
            case CustomerInformationTabs.PremiumData:
              return <PremiumData customer={customer} />;
            case CustomerInformationTabs.BankData:
              return (
                <BankData
                  customer={customer}
                  authorizedPersons={authorizedPersons}
                />
              );
            case CustomerInformationTabs.AddressData:
              return <AddressData customer={customer} />;
            case CustomerInformationTabs.CustomerDetail:
              return <CustomerDetail customer={customer} />;
            case CustomerInformationTabs.PersonalDocumentData:
              return <PersonalDocumentData customer={customer} />;
            case CustomerInformationTabs.ContactData:
              return <ContactData customer={customer} />;
            case CustomerInformationTabs.BankInformation:
              return <BankInformation customer={customer} />;
            default:
              return null;
          }
        })()}
      </Stack>
    </Stack>
  );
};
