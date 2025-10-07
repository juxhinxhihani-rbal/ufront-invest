import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Stack,
  BackdropButton,
  Container,
  tokens,
  useTabs,
  Tabs,
  Tab,
  Icon,
  Text,
  Card,
} from "@rbal-modern-luka/ui-library";
import { Link, useNavigate } from "react-router-dom";
import { PortalContext, useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { customerOverviewViewI18n } from "./CustomerOverviewView.i18n";
import { css, Theme } from "@emotion/react";
import { CustomerOverviewSwitch } from "./CustomerOverviewSwitch/CustomerOverviewSwitch";
import { CustomerOverviewTabs } from "./types";
import {
  CustomerAuthorizedPersonsResponse,
  CustomerDto,
} from "~/api/customer/customerApi.types";
import { RetailAccounts } from "./CustomerInformation/components/RetailAccounts/RetailAccounts";
import { AuthorizedPersons } from "./CustomerInformation/components/AuthorizedPersons/AuthorizedPersons";
import { CustomerDocumentsContext } from "~/context/CustomerDocumentsContext";
import { hasAtLeastOneUsaIndicaPerson } from "../EditCustomer/utils";
import { useCustomerAuthorizedPersonsQuery } from "~/features/customer/customerQueries";
import { CustomerBasicInfo } from "~/components/CustomerBasicInfo/CustomerBasicInfo";

const styles = {
  main: (t: Theme) =>
    css({
      marginTop: tokens.scale(t, "24"),
      [tokens.mediaQueries(t, "xl")]: {
        maxWidth: "78rem",
      },
    }),
  editCustomerIcon: (t: Theme) =>
    css({
      background: tokens.color(t, "yellow300"),
      padding: tokens.scale(t, "6"),
    }),
  disabledEditCustomerIcon: (t: Theme) =>
    css({
      background: tokens.color(t, "gray150"),
      padding: tokens.scale(t, "6"),
    }),
  buttonsContainer: css({
    alignItems: "center",
    justifyContent: "space-between",
  }),
  editCustomerLink: css({
    color: "#131416",
    textDecoration: "none",
  }),
  disabledEditCustomerLink: (t: Theme) =>
    css({
      textDecoration: "none",
      color: tokens.color(t, "gray550"),
      pointerEvents: "none",
      cursor: "default",
    }),
  tabsBorder: css({
    borderBottom: "1px solid #D8D8DA",
  }),
};

interface CustomerOverviewView {
  backUrl: string;
  customer: CustomerDto;
}

export const CustomerOverviewView: React.FC<CustomerOverviewView> = (props) => {
  const { customer, backUrl } = props;
  const [canPrintOsheConsent, setCanPrintOsheConsent] = useState(false);

  const { editMicroData } = useContext(PortalContext);

  useEffect(() => {
    editMicroData("retail-customer-customer", {
      routeTo: `/customers/${customer.idParty}`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canUpdate = useMemo(
    () => customer?.actions.includes("customer.update") ?? false,
    [customer]
  );
  const tabs = useTabs("customer-info");
  const isNotSpecimanTab = tabs.activeTabId !== CustomerOverviewTabs.Specimen;
  const authorizedPersonsQuery = useCustomerAuthorizedPersonsQuery(
    customer.idParty,
    isNotSpecimanTab
  );
  const authorizedPersons = authorizedPersonsQuery.query
    .data as CustomerAuthorizedPersonsResponse[];

  const navigate = useNavigate();
  const { tr } = useI18n();
  const handleGoBack = useCallback(() => {
    editMicroData("retail-customer-customer", {
      routeTo: `/customers`,
    });
    navigate(backUrl);
  }, [editMicroData, navigate, backUrl]);

  return (
    <CustomerDocumentsContext.Provider
      value={{
        enableOsheConsent: canPrintOsheConsent,
        setEnableOsheConsent: setCanPrintOsheConsent,
      }}
    >
      <Container as="main">
        <Stack gap={["16", "32"]}>
          <Stack gap={"32"}>
            <Stack d="h" css={styles.buttonsContainer}>
              <BackdropButton
                onClick={handleGoBack}
                text={tr(customerOverviewViewI18n.backButton)}
              />

              <Link
                to={`/customers/${customer.idParty}/edit-customer`}
                state={{
                  customer,
                  authorizedPersons,
                  shouldShowFactaPopup: hasAtLeastOneUsaIndicaPerson({
                    customer,
                    authorizedPersons,
                  }),
                }}
                css={
                  canUpdate
                    ? styles.editCustomerLink
                    : styles.disabledEditCustomerLink
                }
              >
                <Stack d="h" css={styles.buttonsContainer}>
                  <Text
                    text={tr(customerOverviewViewI18n.editCustomer)}
                    size="16"
                    lineHeight="24"
                    weight="medium"
                  />
                  <Icon
                    type="edit"
                    size="20"
                    css={
                      canUpdate
                        ? styles.editCustomerIcon
                        : styles.disabledEditCustomerIcon
                    }
                  />
                </Stack>
              </Link>
            </Stack>

            <CustomerBasicInfo customer={customer} />
          </Stack>

          <Card>
            <Stack>
              <Tabs tabs={tabs} css={styles.tabsBorder}>
                <Tab
                  text={tr(customerOverviewViewI18n.tabs.customerInformation)}
                  tabId={CustomerOverviewTabs.CustomerInformation}
                />
                <Tab
                  text={tr(customerOverviewViewI18n.tabs.additionalInformation)}
                  tabId={CustomerOverviewTabs.AdditionalInformation}
                />
                <Tab
                  text={tr(customerOverviewViewI18n.tabs.customerDocuments)}
                  tabId={CustomerOverviewTabs.CustomerDocuments}
                />
                <Tab
                  text={tr(customerOverviewViewI18n.tabs.digitalBanking)}
                  tabId={CustomerOverviewTabs.DigitalBanking}
                />
                <Tab
                  text={tr(customerOverviewViewI18n.tabs.dueDiligence)}
                  tabId={CustomerOverviewTabs.DueDiligence}
                />
                <Tab
                  text={tr(customerOverviewViewI18n.tabs.specimen)}
                  tabId={CustomerOverviewTabs.Specimen}
                />
                <Tab
                  text={tr(customerOverviewViewI18n.tabs.crs)}
                  tabId={CustomerOverviewTabs.Crs}
                />
                <Tab
                  text={tr(customerOverviewViewI18n.tabs.fatca)}
                  tabId={CustomerOverviewTabs.Fatca}
                />
              </Tabs>
            </Stack>

            <CustomerOverviewSwitch
              currentTab={tabs.activeTabId}
              customer={customer}
              authorizedPersons={authorizedPersons}
            />
          </Card>
          {isNotSpecimanTab && (
            <Card>
              <Stack gap="40">
                <RetailAccounts
                  customer={customer}
                  authorizedPersons={authorizedPersons}
                />

                <AuthorizedPersons
                  customer={customer}
                  authorizedPersonsQuery={authorizedPersonsQuery}
                />
              </Stack>
            </Card>
          )}
        </Stack>
      </Container>
    </CustomerDocumentsContext.Provider>
  );
};
