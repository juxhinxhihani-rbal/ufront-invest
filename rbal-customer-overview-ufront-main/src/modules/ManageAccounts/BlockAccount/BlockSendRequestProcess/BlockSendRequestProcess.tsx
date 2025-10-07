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
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  RequestsStatusListItem,
  SendRequestProcessParams,
} from "~/api/manageAccounts/manageAccountsApi.types";
import {
  useAccountsForBlockRequestMutation,
  useBlockProcessRequestMutation,
} from "~/api/manageAccounts/manageAccountsMutations";
import { BackCustomerView } from "~/components/BackCustomer/BackCustomer";
import { showError, showSuccess } from "~/components/Toast/ToastContainer";
import { Input } from "~/components/Input/Input";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { BlockRequestProcessTable } from "../../SharedComponents/BlockRequestProcessTable/BlockRequestProcessTable";
import { useSelectAccounts } from "../../SharedComponents/hooks/useSelectAccounts";
import { ManageAccountsViewTabs } from "../../types";
import { blockSendRequestProcessI18n } from "./BlockSendRequestProcess.i18n";

const styles = {
  tableWrapper: (t: Theme) =>
    css({
      paddingTop: tokens.scale(t, "16"),
    }),
  field: css({
    maxWidth: "32%",
  }),
  actions: css({
    justifyContent: "flex-end",
  }),
  filtersRow: (t: Theme) =>
    css({
      paddingTop: tokens.scale(t, "16"),
      justifyContent: "space-between",
      alignItems: "flex-end",
    }),
};

export const BlockSendRequestProcess = () => {
  const { tr } = useI18n();
  const navigate = useNavigate();

  const [blockSendRequestProcessResponse, setBlockSendRequestProcess] =
    useState<RequestsStatusListItem[]>();
  const blockSendRequestProcessListMutation =
    useAccountsForBlockRequestMutation();

  const blockProcessRequest = useBlockProcessRequestMutation();

  const { register, handleSubmit, getValues } =
    useForm<SendRequestProcessParams>({
      defaultValues: {
        startDate: "",
        endDate: "",
      },
    });

  const {
    selectedIds,
    toggleSelectAccount,
    isAccountSelected,
    isAllAccountsSelected,
    toggleSelectAllAccounts,
  } = useSelectAccounts<RequestsStatusListItem, number>({
    accounts: blockSendRequestProcessResponse ?? [],
    getId: (acc) => acc.idRequest,
  });
  const handleSendForProcessList = () => {
    const values = getValues();
    blockSendRequestProcessListMutation.mutate(values, {
      onSuccess: (response) => {
        setBlockSendRequestProcess(response);
      },
      onError: () => {
        showError(tr(blockSendRequestProcessI18n.failedToGetList));
      },
    });
  };
  const checkDatesForDisable = () => {
    return false;
  };

  const handleSendForProcess = (isForProcess: boolean) => {
    blockProcessRequest.mutate(
      { selectedRequestIds: selectedIds, isForProcess: isForProcess },
      {
        onSuccess: (response) => {
          if (response) {
            showSuccess(
              isForProcess
                ? tr(blockSendRequestProcessI18n.sendForProcessSuccess)
                : tr(blockSendRequestProcessI18n.cancelRequestSuccess)
            );
            navigate(
              `/customers/manage-accounts?tab=${ManageAccountsViewTabs.BlockAccount}`
            );
          } else
            showError(
              isForProcess
                ? tr(blockSendRequestProcessI18n.sendForProcessError)
                : tr(blockSendRequestProcessI18n.cancelRequestError)
            );
        },
        onError: () => {
          showError(
            isForProcess
              ? tr(blockSendRequestProcessI18n.sendForProcessError)
              : tr(blockSendRequestProcessI18n.cancelRequestError)
          );
        },
      }
    );
  };

  return (
    <Container as="main">
      {blockProcessRequest.isLoading && (
        <OverlayLoader
          label={tr(blockSendRequestProcessI18n.pleaseWait)}
          isCenteredIcon
        />
      )}
      <Stack>
        <BackCustomerView
          to={`/customers/manage-accounts?tab=${ManageAccountsViewTabs.BlockAccount}`}
        />
        <Card>
          <Text
            text={tr(blockSendRequestProcessI18n.header)}
            size="24"
            lineHeight="32"
            weight="bold"
          />
          <Stack d="h" customStyle={styles.filtersRow}>
            <Stack d="h" customStyle={css({ width: "60%" })}>
              <Input
                type="date"
                id="startDate"
                label={tr(blockSendRequestProcessI18n.startDate)}
                register={register("startDate")}
                inputStyle={styles.field}
                isRequired
              />
              <Input
                type="date"
                id="endDate"
                label={tr(blockSendRequestProcessI18n.endDate)}
                register={register("endDate")}
                inputStyle={styles.field}
                isRequired
              />
            </Stack>
            <Button
              type="button"
              text={tr(blockSendRequestProcessI18n.search)}
              colorScheme="yellow"
              variant="solid"
              onClick={handleSubmit(handleSendForProcessList)}
              disabled={checkDatesForDisable()}
            />
          </Stack>
          <Stack customStyle={styles.tableWrapper} gap="20">
            {blockSendRequestProcessListMutation.isLoading &&
              !blockSendRequestProcessResponse && (
                <Loader withContainer={false} linesNo={4} />
              )}
            {blockSendRequestProcessResponse && (
              <BlockRequestProcessTable
                accounts={blockSendRequestProcessResponse ?? []}
                toggleSelectAccount={toggleSelectAccount}
                isAccountSelected={isAccountSelected}
                isAllAccountsSelected={isAllAccountsSelected}
                toggleSelectAllAccounts={toggleSelectAllAccounts}
              />
            )}
            <Stack d="h" customStyle={styles.actions}>
              {blockSendRequestProcessResponse && (
                <Button
                  type="button"
                  text={tr(blockSendRequestProcessI18n.sendForProcess)}
                  colorScheme="yellow"
                  variant="solid"
                  disabled={selectedIds.length == 0}
                  onClick={() => handleSendForProcess(true)}
                />
              )}
              {blockSendRequestProcessResponse && (
                <Button
                  type="button"
                  text={tr(blockSendRequestProcessI18n.cancelRequest)}
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
