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
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  UnblockRequestsForProcessItem,
  SendRequestProcessParams,
} from "~/api/manageAccounts/manageAccountsApi.types";
import {
  useAccountsForUnblockRequestMutation,
  useUnblockProcessRequestMutation,
} from "~/api/manageAccounts/manageAccountsMutations";
import { BackCustomerView } from "~/components/BackCustomer/BackCustomer";
import { showError, showSuccess } from "~/components/Toast/ToastContainer";
import { Input } from "~/components/Input/Input";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { useSelectAccounts } from "../../SharedComponents/hooks/useSelectAccounts";
import { UnblockRequestProcessTable } from "../../SharedComponents/UnblockRequestProcessTable/UnblockRequestProcessTable";
import { ManageAccountsViewTabs } from "../../types";
import { unblockSendRequestProcessI18n } from "./UnblockSendRequestProcess.i18n";
import { format, isAfter } from "date-fns";

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
  filtersRow: (t: Theme) =>
    css({
      paddingTop: tokens.scale(t, "16"),
      justifyContent: "space-between",
      alignItems: "flex-end",
    }),
};

export const UnblockSendRequestProcess = () => {
  const { tr } = useI18n();
  const navigate = useNavigate();

  const unblockProcessRequest = useUnblockProcessRequestMutation();
  const { register, handleSubmit, watch, getValues } =
    useForm<SendRequestProcessParams>({
      defaultValues: {
        startDate: "",
        endDate: "",
      },
    });
  const [unblockSendRequestProcessResponse, setUnblockSendRequestProcess] =
    useState<UnblockRequestsForProcessItem[]>();
  const unblockSendRequestProcessListMutation =
    useAccountsForUnblockRequestMutation();

  const {
    selectedIds,
    toggleSelectAccount,
    isAccountSelected,
    isAllAccountsSelected,
    toggleSelectAllAccounts,
  } = useSelectAccounts<UnblockRequestsForProcessItem, number>({
    accounts: unblockSendRequestProcessResponse ?? [],
    getId: (acc) => acc.idRequest,
  });

  const handleSendForProcessList = () => {
    if (isInvalidDateRange()) {
      showError(tr(unblockSendRequestProcessI18n.invalidDateRangeError));
      return;
    }
    const values = getValues();
    unblockSendRequestProcessListMutation.mutate(values, {
      onSuccess: (response) => {
        setUnblockSendRequestProcess(response);
      },
      onError: () => {
        showError(tr(unblockSendRequestProcessI18n.failedToGetList));
      },
    });
  };
  const isInvalidDateRange = (): boolean => {
    const startDate = watch("startDate");
    const endDate = watch("endDate");
    if (!startDate || !endDate) return false;
    return isAfter(
      format(startDate, "yyyy-MM-dd"),
      format(endDate, "yyyy-MM-dd")
    );
  };
  const handleSendForProcess = (isForProcess: boolean) => {
    unblockProcessRequest.mutate(
      { selectedRequestIds: selectedIds, isForProcess: isForProcess },
      {
        onSuccess: (response) => {
          if (response) {
            showSuccess(
              isForProcess
                ? tr(unblockSendRequestProcessI18n.sendForProcessSuccess)
                : tr(unblockSendRequestProcessI18n.cancelRequestSuccess)
            );
            navigate(
              `/customers/manage-accounts?tab=${ManageAccountsViewTabs.UnblockAccount}`
            );
          } else
            showError(
              isForProcess
                ? tr(unblockSendRequestProcessI18n.sendForProcessError)
                : tr(unblockSendRequestProcessI18n.cancelRequestError)
            );
        },
        onError: () => {
          showError(
            isForProcess
              ? tr(unblockSendRequestProcessI18n.sendForProcessError)
              : tr(unblockSendRequestProcessI18n.cancelRequestError)
          );
        },
      }
    );
  };

  return (
    <Container as="main">
      {unblockProcessRequest.isLoading && (
        <OverlayLoader
          label={tr(unblockSendRequestProcessI18n.pleaseWait)}
          isCenteredIcon
        />
      )}
      <Stack>
        <BackCustomerView
          to={`/customers/manage-accounts?tab=${ManageAccountsViewTabs.BlockAccount}`}
        />
        <Card>
          <Text
            text={tr(unblockSendRequestProcessI18n.header)}
            size="24"
            lineHeight="32"
            weight="bold"
          />
          <Stack d="h" customStyle={styles.filtersRow}>
            <Stack d="h" customStyle={css({ width: "60%" })}>
              <Input
                type="date"
                id="startDate"
                label={tr(unblockSendRequestProcessI18n.startDate)}
                register={register("startDate")}
                inputStyle={styles.field}
              />
              <Input
                type="date"
                id="endDate"
                label={tr(unblockSendRequestProcessI18n.endDate)}
                register={register("endDate")}
                inputStyle={styles.field}
              />
            </Stack>
            <Button
              type="button"
              text={tr(unblockSendRequestProcessI18n.search)}
              colorScheme="yellow"
              variant="solid"
              onClick={handleSubmit(handleSendForProcessList)}
            />
          </Stack>
          <Stack customStyle={styles.tableWrapper} gap="20">
            {unblockSendRequestProcessListMutation.isLoading &&
              !unblockSendRequestProcessResponse && (
                <Loader withContainer={false} linesNo={4} />
              )}
            {unblockSendRequestProcessResponse && (
              <UnblockRequestProcessTable
                accounts={unblockSendRequestProcessResponse ?? []}
                toggleSelectAccount={toggleSelectAccount}
                isAccountSelected={isAccountSelected}
                isAllAccountsSelected={isAllAccountsSelected}
                toggleSelectAllAccounts={toggleSelectAllAccounts}
              />
            )}
            <Stack d="h" customStyle={styles.actions}>
              {unblockSendRequestProcessResponse && (
                <Button
                  type="button"
                  text={tr(unblockSendRequestProcessI18n.sendForProcess)}
                  colorScheme="yellow"
                  variant="solid"
                  disabled={selectedIds.length == 0}
                  onClick={() => handleSendForProcess(true)}
                />
              )}
              {unblockSendRequestProcessResponse && (
                <Button
                  type="button"
                  text={tr(unblockSendRequestProcessI18n.cancelRequest)}
                  colorScheme="yellow"
                  variant="outline"
                  disabled={selectedIds.length == 0}
                  onClick={() => handleSendForProcess(false)}
                />
              )}
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};
