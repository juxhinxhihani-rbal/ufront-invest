import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Icon, Stack, Text } from "@rbal-modern-luka/ui-library";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { PERMISSIONS } from "~/common/permissions";
import { RESOURCES } from "~/common/resources";
import { usePermission } from "~/features/hooks/useHasPermission";
import { CustomerSearch } from "../SharedComponents/CustomerSearch/CustomerSearch";
import { ManageAccountsViewTabs } from "../types";
import { blockAccounti18n } from "./BlockAccount.i18n";
import { styles } from "./BlockAccount.styles";

export const BlockAccount = () => {
  const { tr } = useI18n();
  const navigate = useNavigate();
  const { isUserAllowed } = usePermission();

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("tab", ManageAccountsViewTabs.BlockAccount);
    navigate(`?${params.toString()}`, { replace: true });
  }, [navigate]);

  const subTitle = (
    <Text
      text={tr(blockAccounti18n.forBlockRequest)}
      customStyle={styles.subTitle}
    />
  );

  const actionButtons = (
    <>
      {isUserAllowed(RESOURCES.ACCOUNT, PERMISSIONS.VIEW_REQUESTS_STATUS) && (
        <Stack d="h" gap="6" css={styles.buttonContainer}>
          <Icon type="in-progress" size="20" css={styles.buttonIcon} />
          <Text
            text={tr(blockAccounti18n.requestStatus)}
            customStyle={styles.buttonText}
            onClick={() => {
              navigate(
                `/customers/manage-accounts/request-status/${ManageAccountsViewTabs.BlockAccount}`
              );
            }}
          />
        </Stack>
      )}
      {isUserAllowed(RESOURCES.ACCOUNT, PERMISSIONS.PROCESS) && (
        <Stack d="h" gap="6" css={styles.buttonContainer}>
          <Icon type="services" size="20" css={styles.buttonIcon} />
          <Text
            text={tr(blockAccounti18n.sendRequestForProccess)}
            customStyle={styles.buttonText}
            onClick={() => {
              navigate(
                `/customers/manage-accounts/send-request-for-process/${ManageAccountsViewTabs.BlockAccount}`
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
      activeTabId={ManageAccountsViewTabs.BlockAccount}
    />
  );
};
