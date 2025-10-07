import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Button, Card, Icon, Stack, Text } from "@rbal-modern-luka/ui-library";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { toQueryParams } from "~/api/customer/customerApi";
import { PERMISSIONS } from "~/common/permissions";
import { RESOURCES } from "~/common/resources";
import { usePermission } from "~/features/hooks/useHasPermission";
import { ListCustomersParams } from "~/modules/CustomerListingPage/types";
import { ManageAccountsViewTabs } from "../../types";
import { customerSearchi18n } from "./CustomerSearch.i18n";
import { styles } from "./CustomerSearch.styles";

interface CustomerSearchProps {
  subTitle?: React.ReactNode;
  actionButtons?: React.ReactNode;
  activeTabId: ManageAccountsViewTabs;
}

export const CustomerSearch = ({
  subTitle,
  actionButtons,
  activeTabId,
}: CustomerSearchProps) => {
  const navigate = useNavigate();
  const { tr } = useI18n();
  const { isUserAllowed } = usePermission();

  const [fullName, setFullName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [retailAccountNumber, setretailAccountNumber] = useState("");

  const handleSubmit = useCallback(
    (listingParams: ListCustomersParams) => {
      const searchParams = toQueryParams(listingParams);
      if (activeTabId == ManageAccountsViewTabs.HeldItem) {
        navigate(
          `/customers/manage-accounts/reverse-held-item?${searchParams.toString()}`
        );
        return;
      }
      searchParams.append("manageAccountsTab", activeTabId);

      navigate(`/customers/search?${searchParams.toString()}`);
    },
    [navigate, activeTabId]
  );

  const checkPermissionsForSearch = () => {
    const permissionChecks = [
      {
        resource: RESOURCES.ACCOUNT,
        permission: PERMISSIONS.BLOCK,
        tab: ManageAccountsViewTabs.BlockAccount,
      },
      {
        resource: RESOURCES.ACCOUNT,
        permission: PERMISSIONS.UNBLOCK,
        tab: ManageAccountsViewTabs.UnblockAccount,
      },
      {
        resource: RESOURCES.HELD,
        permission: PERMISSIONS.REVERSE,
        tab: ManageAccountsViewTabs.HeldItem,
      },
    ];

    return permissionChecks.some(
      ({ resource, permission, tab }) =>
        isUserAllowed(resource, permission) && activeTabId === tab
    );
  };

  return (
    <Card isFullPage>
      {checkPermissionsForSearch() && (
        <form
          onSubmit={() =>
            handleSubmit({
              fullNameContains: fullName,
              customerNo: customerNumber,
              retailAccountNo: retailAccountNumber,
            })
          }
        >
          <Stack d="v" customStyle={styles.contentWrapper}>
            <Text
              text={tr(customerSearchi18n.searchCustomer)}
              customStyle={styles.title}
            />
            {subTitle}
            <Stack d="h" customStyle={styles.inputsWrapper}>
              <Stack gap="8" d="h" customStyle={styles.inputContainer}>
                <Icon type="search" size="20" />

                <input
                  name="fullNameInput"
                  css={styles.input}
                  placeholder={tr(customerSearchi18n.fields.fullName)}
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  maxLength={80}
                  autoFocus
                  autoComplete={"new-fullNameInput"}
                />

                {fullName && (
                  <Icon
                    type="close"
                    size="16"
                    css={styles.clearInputIcon}
                    onClick={() => setFullName("")}
                  />
                )}
              </Stack>

              <Stack css={styles.separator} />

              <Stack gap="8" d="h" customStyle={styles.inputContainer}>
                <Icon type="man-butterfly" size="20" />

                <input
                  name="customerNumberInput"
                  css={styles.input}
                  placeholder={tr(customerSearchi18n.fields.customerNo)}
                  value={customerNumber}
                  onChange={(event) => setCustomerNumber(event.target.value)}
                  maxLength={6}
                  autoComplete={"new-customerNumberInput"}
                />

                {customerNumber && (
                  <Icon
                    type="close"
                    size="16"
                    css={styles.clearInputIcon}
                    onClick={() => setCustomerNumber("")}
                  />
                )}
              </Stack>

              <Stack css={styles.separator} />

              <Stack gap="8" d="h" customStyle={styles.inputContainer}>
                <Icon type="safe" size="20" />

                <input
                  css={styles.input}
                  placeholder={tr(customerSearchi18n.fields.retailAccountNo)}
                  value={retailAccountNumber}
                  onChange={(event) =>
                    setretailAccountNumber(event.target.value)
                  }
                  maxLength={10}
                  autoComplete={"new-customerNumberInput"}
                />

                {retailAccountNumber && (
                  <Icon
                    type="close"
                    size="16"
                    css={styles.clearInputIcon}
                    onClick={() => setretailAccountNumber("")}
                  />
                )}
              </Stack>
            </Stack>
            <Button
              css={styles.button}
              disabled={!fullName && !customerNumber && !retailAccountNumber}
              type="submit"
              variant="solid"
              colorScheme="yellow"
              text={tr(customerSearchi18n.search)}
            />
          </Stack>
        </form>
      )}
      {actionButtons && (
        <Stack gap="32" customStyle={styles.buttonsStack}>
          {actionButtons}
        </Stack>
      )}
    </Card>
  );
};
