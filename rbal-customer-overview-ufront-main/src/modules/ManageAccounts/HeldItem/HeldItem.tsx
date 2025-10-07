import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Icon, Stack, Text } from "@rbal-modern-luka/ui-library";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { PERMISSIONS } from "~/common/permissions";
import { RESOURCES } from "~/common/resources";
import { usePermission } from "~/features/hooks/useHasPermission";
import { CustomerSearch } from "../SharedComponents/CustomerSearch/CustomerSearch";
import { ManageAccountsViewTabs } from "../types";
import { heldItemi18n } from "./HeldItem.i18n";
import { styles } from "./HeldItem.styles";

export const HeldItem = () => {
  const { tr } = useI18n();
  const navigate = useNavigate();
  const { isUserAllowed } = usePermission();

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("tab", ManageAccountsViewTabs.HeldItem);
    navigate(`?${params.toString()}`, { replace: true });
  }, [navigate]);

  const subTitle = (
    <Text
      text={tr(heldItemi18n.reverseHeldItem)}
      customStyle={styles.subTitle}
    />
  );

  const actionButtons = (
    <>
      {isUserAllowed(RESOURCES.HELD, PERMISSIONS.VIEW_REQUESTS_STATUS) && (
        <Stack d="h" gap="6" css={styles.buttonContainer}>
          <Icon type="in-progress" size="20" css={styles.buttonIcon} />
          <Text
            text={tr(heldItemi18n.requestStatus)}
            customStyle={styles.buttonText}
            onClick={() => {
              navigate(
                `/customers/manage-accounts/request-status/${ManageAccountsViewTabs.HeldItem}`
              );
            }}
          />
        </Stack>
      )}
    </>
  );

  return (
    <CustomerSearch
      subTitle={subTitle}
      actionButtons={actionButtons}
      activeTabId={ManageAccountsViewTabs.HeldItem}
    />
  );
};
