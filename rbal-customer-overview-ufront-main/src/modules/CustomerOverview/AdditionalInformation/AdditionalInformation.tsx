/* eslint-disable @typescript-eslint/naming-convention */
import {
  Stack,
  Tab,
  Tabs,
  useTabs,
  TabOrientation,
} from "@rbal-modern-luka/ui-library";
import { css } from "@emotion/react";
import { CustomerDto } from "~/api/customer/customerApi.types";
import { AddedInformation } from "./components/AddedInformation/AddedInformation";
import { AlternativeAddress } from "./components/AlternativeAddress/AlternativeAddress";
import { AMLData } from "./components/AMLData/AMLData";
import { BoaData } from "./components/BoaData/BoaData";
import { CBConsent } from "./components/CBConsent/CBConsent";
import { EmploymentData } from "./components/EmploymentData/EmploymentData";
import { MarketableCustomer } from "./components/MarketableCustomer/MarketableCustomer";
import { styles as globalStyles } from "~/common/styles";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { employmentDatai18n } from "./components/EmploymentData/EmploymentData.i18n";
import { amlDatai18n } from "./components/AMLData/AMLData.i18n";
import { boaDatai18n } from "./components/BoaData/BoaData.i18n";
import { alternativeAddressi18n } from "./components/AlternativeAddress/AlternativeAddress.i18n";
import { addedInformationi18n } from "./components/AddedInformation/AddedInformation.i18n";
import { marketableCustomeri18n } from "./components/MarketableCustomer/MarketableCustomer.i18n";
import { cbConsenti18n } from "./components/CBConsent/CBConsent.i18n";

interface AdditionalInformationProps {
  customer?: CustomerDto;
}

export enum AdditionalInformationTabs {
  EmploymentData = "employment-data",
  AMLData = "aml-data",
  BoaData = "boa-data",
  AlternativeAddress = "alternative-address",
  AddedInformation = "added-information",
  MarketableCustomer = "marketable-customer",
  CBConsent = "cb-consent",
}

const styles = {
  container: css({
    marginTop: 32,
  }),
  tabs: {
    borderBottom: "unset",
  },
};

export const AdditionalInformation: React.FC<AdditionalInformationProps> = (
  props
) => {
  const { customer } = props;
  const tabs = useTabs(AdditionalInformationTabs.EmploymentData);
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
            text={tr(employmentDatai18n.header)}
            tabId={AdditionalInformationTabs.EmploymentData}
          />
          <Tab
            text={tr(amlDatai18n.header)}
            tabId={AdditionalInformationTabs.AMLData}
          />
          <Tab
            text={tr(boaDatai18n.header)}
            tabId={AdditionalInformationTabs.BoaData}
          />
          <Tab
            text={tr(alternativeAddressi18n.header)}
            tabId={AdditionalInformationTabs.AlternativeAddress}
          />
          <Tab
            text={tr(addedInformationi18n.header)}
            tabId={AdditionalInformationTabs.AddedInformation}
          />
          <Tab
            text={tr(marketableCustomeri18n.header)}
            tabId={AdditionalInformationTabs.MarketableCustomer}
          />
          <Tab
            text={tr(cbConsenti18n.header)}
            tabId={AdditionalInformationTabs.CBConsent}
          />
        </Tabs>
      </Stack>
      <Stack customStyle={globalStyles.fill}>
        {(() => {
          switch (tabs.activeTabId) {
            case AdditionalInformationTabs.EmploymentData:
              return (
                <EmploymentData
                  employment={customer?.additionalInformation?.employment}
                />
              );
            case AdditionalInformationTabs.AMLData:
              return (
                <AMLData amlData={customer?.additionalInformation?.amlData} />
              );
            case AdditionalInformationTabs.BoaData:
              return (
                <BoaData boaData={customer?.additionalInformation?.boaData} />
              );
            case AdditionalInformationTabs.AlternativeAddress:
              return (
                <AlternativeAddress
                  alternativeAddress={
                    customer?.additionalInformation?.alternativeAddress
                  }
                />
              );
            case AdditionalInformationTabs.AddedInformation:
              return (
                <AddedInformation
                  addedInfo={customer?.additionalInformation?.addedInfo}
                />
              );
            case AdditionalInformationTabs.MarketableCustomer:
              return (
                <MarketableCustomer
                  marketableCustomer={
                    customer?.additionalInformation?.marketableCustomer
                  }
                />
              );
            case AdditionalInformationTabs.CBConsent:
              return (
                <CBConsent
                  cbConsent={customer?.additionalInformation?.cbConsent}
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
