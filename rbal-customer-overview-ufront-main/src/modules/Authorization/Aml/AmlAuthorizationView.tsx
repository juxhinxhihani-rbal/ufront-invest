import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Stack,
  Tab,
  Tabs,
  Text,
  theme,
  tokens,
  useTabs,
} from "@rbal-modern-luka/ui-library";
import { AmlAuthorizationDetailsDto } from "~/api/authorization/authorizationApi.types";
import { AmlAuthorizationDetailsTabs } from "../types";
import { AmlAdditionalInformation } from "./AdditionalInformation/AmlAdditionalInformation";
import { amlAuthorizationDetailsi18n } from "./AmlAuthorization.i18n";
import { AmlCustomerInformation } from "./CustomerInformation/AmlCustomerInformation";
import { AmlDueDilligence } from "./DueDilligence/AmlDueDilligence";
import { AmlNotes } from "./Notes/AmlNotes";

interface AmlAuthorizationViewProps {
  aml: AmlAuthorizationDetailsDto | undefined;
}

export const AmlAuthorizationView = ({ aml }: AmlAuthorizationViewProps) => {
  const { tr } = useI18n();
  const searchParams = new URLSearchParams(location.search);
  const activeTabFromParams =
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    searchParams.get("aml") || AmlAuthorizationDetailsTabs.CustomerInformation;
  const tabs = useTabs(activeTabFromParams);

  return (
    <>
      <Stack customStyle={{ paddingBottom: "1rem" }}>
        <Text
          text={"Aml Details"}
          weight="bold"
          customStyle={{ fontSize: tokens.scale(theme, "18") }}
        />
        <Tabs tabs={tabs}>
          <Tab
            text={tr(amlAuthorizationDetailsi18n.tabs.customerInformation)}
            tabId={AmlAuthorizationDetailsTabs.CustomerInformation}
          />
          <Tab
            text={tr(amlAuthorizationDetailsi18n.tabs.additionalInformation)}
            tabId={AmlAuthorizationDetailsTabs.AdditionalInformation}
          />
          <Tab
            text={tr(amlAuthorizationDetailsi18n.tabs.dueDiligence)}
            tabId={AmlAuthorizationDetailsTabs.DueDiligence}
          />
          <Tab
            text={tr(amlAuthorizationDetailsi18n.tabs.notes)}
            tabId={AmlAuthorizationDetailsTabs.Notes}
          />
        </Tabs>
      </Stack>
      <Stack customStyle={{ paddingBottom: "2rem" }}>
        {(() => {
          switch (tabs.activeTabId) {
            case AmlAuthorizationDetailsTabs.CustomerInformation:
              return (
                <AmlCustomerInformation
                  amlCustomerInformationData={aml?.customerInformation}
                ></AmlCustomerInformation>
              );
            case AmlAuthorizationDetailsTabs.AdditionalInformation:
              return (
                <AmlAdditionalInformation
                  amlAdditionalInformationData={aml?.additionalInformation}
                ></AmlAdditionalInformation>
              );
            case AmlAuthorizationDetailsTabs.DueDiligence:
              return (
                <AmlDueDilligence amlDueDiligenceData={aml?.dueDiligence} />
              );
            case AmlAuthorizationDetailsTabs.Notes:
              return <AmlNotes amlNotes={aml?.notes} />;

            default:
              return null;
          }
        })()}
      </Stack>
    </>
  );
};
