import {
  Stack,
  Tab,
  Tabs,
  Text,
  theme,
  tokens,
  useTabs,
} from "@rbal-modern-luka/ui-library";
import { CrsAuthorizationDetailsTabs } from "../types";
import { crsAuthorizationDetailsi18n } from "./CrsAuthorizationDetails.i18n";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { CrsCustomerInformation } from "./CrsCustomerInformation/CrsCustomerInformation";
import { CrsAdditionalInformation } from "./CrsAdditionalInformation/CrsAdditionalInformation";
import { CrsNotes } from "./CrsNotes/CrsNotes";
import { CrsDetails } from "./CrsDetails/CrsDetails";
import { CrsFatca } from "./CrsFatca/CrsFatca";
import { CrsAuthorizationDetailsDto } from "~/api/authorization/authorizationApi.types";

interface CrsAuthorizationViewProps {
  crs: CrsAuthorizationDetailsDto | undefined;
}

export const CrsAuthorizationView = ({ crs }: CrsAuthorizationViewProps) => {
  const { tr } = useI18n();
  const searchParams = new URLSearchParams(location.search);
  const activeTabFromParams =
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    searchParams.get("crs") || CrsAuthorizationDetailsTabs.CustomerInformation;
  const tabs = useTabs(activeTabFromParams);

  return (
    <>
      <Stack customStyle={{ paddingBottom: "1rem" }}>
        <Text
          text={"Crs Details"}
          weight="bold"
          customStyle={{ fontSize: tokens.scale(theme, "18") }}
        />
        <Tabs tabs={tabs}>
          <Tab
            text={tr(crsAuthorizationDetailsi18n.tabs.customerInformation)}
            tabId={CrsAuthorizationDetailsTabs.CustomerInformation}
          />
          <Tab
            text={tr(crsAuthorizationDetailsi18n.tabs.additionalInformation)}
            tabId={CrsAuthorizationDetailsTabs.AdditionalInformation}
          />
          <Tab
            text={tr(crsAuthorizationDetailsi18n.tabs.notes)}
            tabId={CrsAuthorizationDetailsTabs.Notes}
          />
          <Tab
            text={tr(crsAuthorizationDetailsi18n.tabs.crs)}
            tabId={CrsAuthorizationDetailsTabs.Crs}
          />
          <Tab
            text={tr(crsAuthorizationDetailsi18n.tabs.fatca)}
            tabId={CrsAuthorizationDetailsTabs.Fatca}
          />
        </Tabs>
      </Stack>
      <Stack customStyle={{ paddingBottom: "2rem" }}>
        {(() => {
          switch (tabs.activeTabId) {
            case CrsAuthorizationDetailsTabs.CustomerInformation:
              return (
                <CrsCustomerInformation
                  crsCustomerInformationData={crs?.customerInformation}
                />
              );
            case CrsAuthorizationDetailsTabs.AdditionalInformation:
              return (
                <CrsAdditionalInformation
                  crsAdditionalInformationData={crs?.additionalInformation}
                />
              );
            case CrsAuthorizationDetailsTabs.Notes:
              return <CrsNotes crsNotesData={crs?.notes} />;
            case CrsAuthorizationDetailsTabs.Crs:
              return <CrsDetails crsDetailsData={crs?.crs} />;
            case CrsAuthorizationDetailsTabs.Fatca:
              return <CrsFatca crsFatcaData={crs?.facta} />;
            default:
              return null;
          }
        })()}
      </Stack>
    </>
  );
};
