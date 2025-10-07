import React, { useCallback, useContext, useEffect } from "react";
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
import { walkInCustomerOverviewViewI18n } from "./WalkInCustomerOverviewView.i18n";
import { css, Theme } from "@emotion/react";
import { WalkInCustomerOverviewTabs } from "./types";
import { BasicInformation } from "./BasicInformation/BasicInformation";
import { AdditionalInformation } from "./AdditionalInformation/AdditionalInformation";
import { WalkInCustomerDto } from "~/api/walkInCustomer/walkInCustomerApi.types";
import { WalkInCustomerBasicInfo } from "./components/WalkInCustomerBasicInfo/WalkInCustomerBasicInfo";

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
  tabsBorder: css({
    borderBottom: "1px solid #D8D8DA",
  }),
};

interface WalkInCustomerOverviewView {
  backUrl: string;
  customer: WalkInCustomerDto;
}

export const WalkInCustomerOverviewView: React.FC<
  WalkInCustomerOverviewView
> = (props) => {
  const { customer, backUrl } = props;

  const { editMicroData } = useContext(PortalContext);

  useEffect(() => {
    editMicroData("retail-customer-customer", {
      routeTo: `/customers/walkIn/${customer.idParty}`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useNavigate();
  const { tr } = useI18n();
  const tabs = useTabs(WalkInCustomerOverviewTabs.BasicInformation);

  const handleGoBack = useCallback(() => {
    editMicroData("retail-customer-customer", {
      routeTo: `/customers`,
    });
    navigate(backUrl);
  }, [editMicroData, navigate, backUrl]);

  return (
    <Container as="main">
      <Stack gap={["16", "32"]}>
        <Stack gap={"32"}>
          <Stack d="h" css={styles.buttonsContainer}>
            <BackdropButton
              onClick={handleGoBack}
              text={tr(walkInCustomerOverviewViewI18n.backButton)}
            />

            <Link
              to={`/customers/walkIn/${customer.idParty}/edit-customer`}
              css={styles.editCustomerLink}
            >
              <Stack d="h" css={styles.buttonsContainer}>
                <Text
                  text={tr(walkInCustomerOverviewViewI18n.editWalkInCustomer)}
                  size="16"
                  lineHeight="24"
                  weight="medium"
                />
                <Icon type="edit" size="20" css={styles.editCustomerIcon} />
              </Stack>
            </Link>
          </Stack>

          <WalkInCustomerBasicInfo customer={customer} />
        </Stack>

        <Card>
          <Stack customStyle={{ paddingBottom: "1rem" }}>
            <Tabs tabs={tabs} css={styles.tabsBorder}>
              <Tab
                text={tr(walkInCustomerOverviewViewI18n.tabs.basicInformation)}
                tabId={WalkInCustomerOverviewTabs.BasicInformation}
              />
              <Tab
                text={tr(
                  walkInCustomerOverviewViewI18n.tabs.additionalInformation
                )}
                tabId={WalkInCustomerOverviewTabs.AdditionalInformation}
              />
            </Tabs>
          </Stack>

          <Stack customStyle={{ paddingBottom: "2rem" }}>
            {(() => {
              switch (tabs.activeTabId) {
                case WalkInCustomerOverviewTabs.BasicInformation:
                  return <BasicInformation customer={customer} />;
                case WalkInCustomerOverviewTabs.AdditionalInformation:
                  return (
                    <AdditionalInformation
                      additionalData={customer.additionalInformation}
                    />
                  );
                default:
                  return null;
              }
            })()}
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};
