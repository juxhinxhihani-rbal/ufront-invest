import { css, Theme } from "@emotion/react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Button,
  Card,
  Container,
  Loader,
  Stack,
  Text,
  tokens,
} from "@rbal-modern-luka/ui-library";
import { useNavigate } from "react-router";
import { TemporaryUnblockRequestItem } from "~/api/manageAccounts/manageAccountsApi.types";
import {
  useCancelTemporaryUnblockRequestMutation,
  useRejectTemporaryUnblockRequestMutation,
} from "~/api/manageAccounts/manageAccountsMutations";
import { BackCustomerView } from "~/components/BackCustomer/BackCustomer";
import { showError, showSuccess } from "~/components/Toast/ToastContainer";
import { useAccountsForTemporaryUnblockRequestQuery } from "~/features/manageAccounts/manageAccountsQueries";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { useSelectAccounts } from "../../SharedComponents/hooks/useSelectAccounts";
import { TemporaryUnblockRequestsTable } from "../../SharedComponents/TemporaryUnblockRequestsTable/TemporaryUnblockRequestsTable";
import { ManageAccountsViewTabs } from "../../types";
import { temporaryUnblockRequestsI18n } from "./TemporaryUnblockRequests.i18n";

const styles = {
  tableWrapper: (t: Theme) =>
    css({
      paddingTop: tokens.scale(t, "16"),
    }),
  actions: css({
    justifyContent: "flex-end",
  }),
  field: css({
    maxWidth: "32%",
  }),
};

export const TemporaryUnblockRequests = () => {
  const { tr } = useI18n();
  const navigate = useNavigate();

  const temporaryUnblockRequestQuery =
    useAccountsForTemporaryUnblockRequestQuery();
  const accountsForTemporaryUnblockRequestResponse =
    temporaryUnblockRequestQuery.query.data;

  const rejectTemporaryUnblockRequest =
    useRejectTemporaryUnblockRequestMutation();

  const cancelTemporaryUnblockRequest =
    useCancelTemporaryUnblockRequestMutation();

  const {
    selectedIds,
    toggleSelectAccount,
    isAccountSelected,
    isAllAccountsSelected,
    toggleSelectAllAccounts,
  } = useSelectAccounts<TemporaryUnblockRequestItem, number>({
    accounts: accountsForTemporaryUnblockRequestResponse ?? [],
    getId: (acc) => acc.idRequest,
  });

  const handleRejectTemporaryRequests = () => {
    rejectTemporaryUnblockRequest.mutate(
      { selectedRequestIds: selectedIds },
      {
        onSuccess: (response) => {
          showSuccess(
            tr(
              temporaryUnblockRequestsI18n.refusedRequestsSuccessMessage,
              response.numberOfRefusedTemporaryRequests
            ) as string
          );
          navigate(
            `/customers/manage-accounts?tab=${ManageAccountsViewTabs.UnblockAccount}`
          );
        },
        onError: () => {
          showError(
            tr(temporaryUnblockRequestsI18n.refusedRequestsErrorMessage)
          );
        },
      }
    );
  };

  const handleCancelTemporaryRequests = () => {
    cancelTemporaryUnblockRequest.mutate(
      { selectedRequestIds: selectedIds },
      {
        onSuccess: (response) => {
          showSuccess(
            tr(
              temporaryUnblockRequestsI18n.canceledRequestsSuccessMessage,
              response.numberOfCanceledTemporaryRequests
            ) as string
          );
          navigate(
            `/customers/manage-accounts?tab=${ManageAccountsViewTabs.UnblockAccount}`
          );
        },
        onError: () => {
          showError(
            tr(temporaryUnblockRequestsI18n.canceledRequestsErrorMessage)
          );
        },
      }
    );
  };

  return (
    <Container as="main">
      {(rejectTemporaryUnblockRequest.isLoading ||
        cancelTemporaryUnblockRequest.isLoading) && (
        <OverlayLoader
          label={tr(temporaryUnblockRequestsI18n.pleaseWait)}
          isCenteredIcon
        />
      )}
      <Stack>
        <BackCustomerView
          to={`/customers/manage-accounts?tab=${ManageAccountsViewTabs.UnblockAccount}`}
        />
        <Card>
          <Text
            text={tr(temporaryUnblockRequestsI18n.header)}
            size="24"
            lineHeight="32"
            weight="bold"
          />
          <Stack customStyle={styles.tableWrapper} gap="20">
            {temporaryUnblockRequestQuery.query.isLoading ? (
              <Loader withContainer={false} linesNo={4} />
            ) : (
              <TemporaryUnblockRequestsTable
                accounts={accountsForTemporaryUnblockRequestResponse ?? []}
                toggleSelectAccount={toggleSelectAccount}
                isAccountSelected={isAccountSelected}
                isAllAccountsSelected={isAllAccountsSelected}
                toggleSelectAllAccounts={toggleSelectAllAccounts}
              />
            )}
            <Stack d="h" customStyle={styles.actions}>
              <Button
                type="button"
                text={tr(temporaryUnblockRequestsI18n.rejectRequest)}
                colorScheme="yellow"
                variant="solid"
                disabled={selectedIds.length == 0}
                onClick={() => handleRejectTemporaryRequests()}
              />
              <Button
                type="button"
                text={tr(temporaryUnblockRequestsI18n.cancelOrder)}
                colorScheme="yellow"
                variant="outline"
                disabled={selectedIds.length == 0}
                onClick={() => handleCancelTemporaryRequests()}
              />
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};
