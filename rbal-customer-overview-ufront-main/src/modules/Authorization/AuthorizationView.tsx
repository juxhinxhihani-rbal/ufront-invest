import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Card,
  Container,
  Stack,
  tokens,
  useCurrentBreakpoint,
  Tabs,
  Tab,
  useTabs,
} from "@rbal-modern-luka/ui-library";
import { useLocation } from "react-router";
import { StatusResponse } from "~/features/dictionaries/dictionariesQueries";
import { authorizationI18n } from "./Authorization.i18n";
import { AccountAuthorization } from "./components/AccountAuthorization/AccountAuthorization";
import { AmlAuthorization } from "./components/AmlAuthorization/AmlAuthorization";
import { AccountRightsAuthorization } from "./components/AuthorizedPersonAuthorization/AccountRightsAuthorization";
import { CustomerAuthorization } from "./components/CustomerAuthorization";
import { DigitalAuthorization } from "./components/DigitalAuthorization/DigitalAuthorization";
import { SpecimenAuthorization } from "./components/SpecimenAuthorization";
import { AuthorizationTabs } from "./types";
import { useFeatureFlags } from "~/features/hooks/useFlags";
import { css, Theme } from "@emotion/react";
import { CrsAuthorization } from "./components/CrsAuthorization/CrsAuthorization";
import { FLAGSMITH_FEATURES } from "~/common/flagsmith_features";
import { RESOURCES } from "~/common/resources";
import { PERMISSIONS } from "~/common/permissions";
import { usePermission } from "~/features/hooks/useHasPermission";

const styles = {
  card: (theme: Theme) =>
    css({ maxWidth: `calc(${tokens.containers(theme, "xl")}px - 4rem)` }),
};

interface AuthorizationViewProps {
  customerStatuses: StatusResponse[];
  specimenStatuses: StatusResponse[];
  accountStatuses: StatusResponse[];
  accountRightsStatuses: StatusResponse[];
  digitalStatuses: StatusResponse[];
}

export const AuthorizationView = ({
  customerStatuses,
  specimenStatuses,
  accountStatuses,
  accountRightsStatuses,
}: AuthorizationViewProps) => {
  const { tr } = useI18n();
  const location = useLocation();
  const size = useCurrentBreakpoint();
  const searchParams = new URLSearchParams(location.search);
  const activeTabFromParams =
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    searchParams.get("tab") || AuthorizationTabs.Customers;
  const { isUserAllowed } = usePermission();
  const tabs = useTabs(activeTabFromParams);
  const { isFeatureEnabled } = useFeatureFlags();
  return (
    <Container as="main">
      <Card customStyle={size === "xl" && styles.card}>
        <Stack customStyle={{ paddingBottom: "2rem" }}>
          <Tabs tabs={tabs}>
            {isUserAllowed(RESOURCES.CUSTOMER, PERMISSIONS.AUTHORIZE) && (
              <Tab
                text={tr(authorizationI18n.tabs.customers)}
                tabId={AuthorizationTabs.Customers}
              />
            )}
            {isUserAllowed(RESOURCES.SPECIMEN, PERMISSIONS.AUTHORIZE) && (
              <Tab
                text={tr(authorizationI18n.tabs.specimen)}
                tabId={AuthorizationTabs.Specimen}
              />
            )}
            {isUserAllowed(RESOURCES.ACCOUNT, PERMISSIONS.AUTHORIZE) && (
              <Tab
                text={tr(authorizationI18n.tabs.accounts)}
                tabId={AuthorizationTabs.Accounts}
              />
            )}
            {isFeatureEnabled(
              FLAGSMITH_FEATURES.ACCOUNT_AUTHORIZATION_RIGHTS
            ) &&
              isUserAllowed(
                RESOURCES.ACCOUNT_RIGHTS,
                PERMISSIONS.AUTHORIZE
              ) && (
                <Tab
                  text={tr(authorizationI18n.tabs.authorizeAccountRights)}
                  tabId={AuthorizationTabs.AccountRights}
                />
              )}
            {isFeatureEnabled(
              FLAGSMITH_FEATURES.AUTHORIZATION_DIGITAL_BANKING
            ) &&
              isUserAllowed(RESOURCES.DIGITAL, PERMISSIONS.AUTHORIZE) && (
                <Tab
                  text={tr(authorizationI18n.tabs.authorizeDigitalBanking)}
                  tabId={AuthorizationTabs.DigitalBanking}
                />
              )}
            {isFeatureEnabled(FLAGSMITH_FEATURES.AUTHORIZATION_AML) &&
              isUserAllowed(RESOURCES.AML, PERMISSIONS.AUTHORIZE) && (
                <Tab
                  text={tr(authorizationI18n.tabs.aml)}
                  tabId={AuthorizationTabs.Aml}
                />
              )}
            {isFeatureEnabled(FLAGSMITH_FEATURES.AUTHORIZATION_CRS) &&
              isUserAllowed(RESOURCES.CRS, PERMISSIONS.AUTHORIZE) && (
                <Tab
                  text={tr(authorizationI18n.tabs.crs)}
                  tabId={AuthorizationTabs.Crs}
                />
              )}
            <Tab
              text={tr(authorizationI18n.tabs.more)}
              tabId={AuthorizationTabs.More}
              disabled={true}
            />
          </Tabs>
        </Stack>
        <Stack>
          {(() => {
            switch (tabs.activeTabId) {
              case AuthorizationTabs.Customers:
                return (
                  <CustomerAuthorization
                    statusData={customerStatuses}
                  ></CustomerAuthorization>
                );
              case AuthorizationTabs.Specimen:
                return (
                  <SpecimenAuthorization
                    statusData={specimenStatuses}
                  ></SpecimenAuthorization>
                );
              case AuthorizationTabs.Accounts:
                return (
                  <AccountAuthorization
                    statusData={accountStatuses} // TODO: provide the account statuses
                  />
                );
              case AuthorizationTabs.AccountRights:
                return isFeatureEnabled("authorization_account_rights") ? (
                  <AccountRightsAuthorization
                    statusData={accountRightsStatuses}
                  />
                ) : null;
              case AuthorizationTabs.DigitalBanking:
                return isFeatureEnabled("authorization_digital_banking") ? (
                  <DigitalAuthorization />
                ) : null;
              case AuthorizationTabs.Aml:
                return isFeatureEnabled("authorization_aml") ? (
                  <AmlAuthorization />
                ) : null;
              case AuthorizationTabs.Crs:
                return isFeatureEnabled("authorization_crs") ? (
                  <CrsAuthorization />
                ) : null;
              case AuthorizationTabs.More:
                return <>More</>;
              default:
                return null;
            }
          })()}
        </Stack>
      </Card>
    </Container>
  );
};
