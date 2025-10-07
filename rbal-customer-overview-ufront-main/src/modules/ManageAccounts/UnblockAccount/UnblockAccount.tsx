import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Icon, Stack, Text } from "@rbal-modern-luka/ui-library";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { PERMISSIONS } from "~/common/permissions";
import { RESOURCES } from "~/common/resources";
import { usePermission } from "~/features/hooks/useHasPermission";
import { CustomerSearch } from "../SharedComponents/CustomerSearch/CustomerSearch";
import { ManageAccountsViewTabs } from "../types";
import { unblockAccounti18n } from "./UnblockAccount.i18n";
import { styles } from "./UnblockAccount.styles";

export const UnblockAccount = () => {
  const { tr } = useI18n();
  const navigate = useNavigate();
  const { isUserAllowed } = usePermission();

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("tab", ManageAccountsViewTabs.UnblockAccount);
    navigate(`?${params.toString()}`, { replace: true });
  }, [navigate]);

  const subTitle = (
    <Text
      text={tr(unblockAccounti18n.forUnblockRequest)}
      customStyle={styles.subTitle}
    />
  );

  const actionButtons = (
    <>
      {isUserAllowed(RESOURCES.ACCOUNT, PERMISSIONS.VIEW_REQUESTS_STATUS) && (
        <Stack d="h" gap="6" css={styles.buttonContainer}>
          <Icon type="in-progress" size="20" css={styles.buttonIcon} />
          <Text
            text={tr(unblockAccounti18n.requestStatus)}
            customStyle={styles.buttonText}
            onClick={() => {
              navigate(
                `/customers/manage-accounts/request-status/${ManageAccountsViewTabs.UnblockAccount}`
              );
            }}
          />
        </Stack>
      )}
      {isUserAllowed(RESOURCES.ACCOUNT, PERMISSIONS.UNBLOCK) && (
        <Stack d="h" gap="6" css={styles.buttonContainer}>
          <Icon type="checkmark-progress" size="20" css={styles.buttonIcon} />
          <Text
            text={tr(unblockAccounti18n.approveTemporaryUnblockRequest)}
            customStyle={styles.buttonText}
            onClick={() => {
              navigate(
                `/customers/manage-accounts/approve-temporary-unblock-request/${ManageAccountsViewTabs.UnblockAccount}`
              );
            }}
          />
        </Stack>
      )}
      {isUserAllowed(RESOURCES.ACCOUNT, PERMISSIONS.PROCESS) && (
        <Stack d="h" gap="6" css={styles.buttonContainer}>
          <Icon type="services" size="20" css={styles.buttonIcon} />
          <Text
            text={tr(unblockAccounti18n.sendRequestForProccess)}
            customStyle={styles.buttonText}
            onClick={() => {
              navigate(
                `/customers/manage-accounts/send-request-for-process/${ManageAccountsViewTabs.UnblockAccount}`
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
      activeTabId={ManageAccountsViewTabs.UnblockAccount}
    />
  );
};
