import { CustomerOverviewTabs } from "../types";
import {
  CustomerAuthorizedPersonsResponse,
  CustomerDto,
} from "~/api/customer/customerApi.types";
import { CustomerInformation } from "../CustomerInformation/CustomerInformation";
import { AdditionalInformation } from "../AdditionalInformation/AdditionalInformation";
import { CustomerDocumentsPage } from "~/modules/CustomerDocuments/CustomerDocumentsPage";
import { Fatca } from "../Fatca/Fatca";
import { DueDiligence } from "../DueDiligence/DueDiligence";
import { CRSData } from "../CRS/CRSData";
import { Specimen } from "../Specimen/Specimen";
import { DigitalBanking } from "../DigitalBanking/DigitalBanking";

interface CustomerOverviewSwitchProps {
  currentTab: string | undefined;
  customer: CustomerDto;
  authorizedPersons?: CustomerAuthorizedPersonsResponse[] | undefined;
}

export const CustomerOverviewSwitch: React.FC<CustomerOverviewSwitchProps> = (
  props
) => {
  const { currentTab, customer, authorizedPersons } = props;
  //TODO: Implement ContextAPI here
  switch (currentTab) {
    case CustomerOverviewTabs.CustomerInformation:
      return (
        <CustomerInformation
          customer={customer}
          authorizedPersons={authorizedPersons}
        />
      );
    case CustomerOverviewTabs.AdditionalInformation:
      return <AdditionalInformation customer={customer} />;
    case CustomerOverviewTabs.DigitalBanking:
      return <DigitalBanking customer={customer} />;
    case CustomerOverviewTabs.CustomerDocuments:
      return <CustomerDocumentsPage customer={customer} />;
    case CustomerOverviewTabs.DueDiligence:
      return <DueDiligence dueDiligence={customer.dueDiligence} />;
    case CustomerOverviewTabs.Specimen:
      return <Specimen customer={customer} />;
    case CustomerOverviewTabs.Crs:
      return <CRSData customer={customer} />;
    case CustomerOverviewTabs.Fatca:
      return <Fatca customer={customer} />;
    default:
      return (
        <CustomerInformation
          customer={customer}
          authorizedPersons={authorizedPersons}
        />
      );
  }
};
