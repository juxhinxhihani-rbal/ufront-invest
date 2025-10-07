import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Card,
  Container,
  Stack,
  Tab,
  Tabs,
  useTabs,
} from "@rbal-modern-luka/ui-library";
import { useLocation } from "react-router";
import { BlockAccount } from "./BlockAccount/BlockAccount";
import { UnblockAccount } from "./UnblockAccount/UnblockAccount";
import { HeldItem } from "./HeldItem/HeldItem";
import { manageAccountsViewI18n } from "./ManageAccounts.i18n";
import { ManageAccountsViewTabs } from "./types";

export const ManageAccountsView = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTabFromParams =
    searchParams.get("tab") ?? ManageAccountsViewTabs.BlockAccount;
  const tabs = useTabs(activeTabFromParams);
  const { tr } = useI18n();

  return (
    <Container as="main">
      <Card>
        <Stack customStyle={{ paddingBottom: "2rem" }}>
          <Tabs tabs={tabs}>
            <Tab
              text={tr(manageAccountsViewI18n.tabs.blockAccount)}
              tabId={ManageAccountsViewTabs.BlockAccount}
            />
            <Tab
              text={tr(manageAccountsViewI18n.tabs.unblockAccount)}
              tabId={ManageAccountsViewTabs.UnblockAccount}
            />
            <Tab
              text={tr(manageAccountsViewI18n.tabs.heldItem)}
              tabId={ManageAccountsViewTabs.HeldItem}
            />
          </Tabs>
        </Stack>
        <Stack>
          {(() => {
            switch (tabs.activeTabId) {
              case ManageAccountsViewTabs.BlockAccount:
                return <BlockAccount />;
              case ManageAccountsViewTabs.UnblockAccount:
                return <UnblockAccount />;
              case ManageAccountsViewTabs.HeldItem:
                return <HeldItem />;
              default:
                return null;
            }
          })()}
        </Stack>
      </Card>
    </Container>
  );
};
