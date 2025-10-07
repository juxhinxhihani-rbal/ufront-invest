import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Card,
  Container,
  Stack,
  Text,
  Button,
  tokens,
  Loader,
} from "@rbal-modern-luka/ui-library";
import { css, Theme } from "@emotion/react";
import { BackCustomerView } from "~/components/BackCustomer/BackCustomer";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import {
  ActionTypes,
  ManageAccountsViewTabs,
  UnblockInputRequestFormValues,
} from "../../types";
import { Input } from "~/components/Input/Input";
import { Textarea } from "~/components/Textarea/Textarea";
import { useForm } from "react-hook-form";
import { Select } from "~/components/Select/Select";
import { yupResolver } from "@hookform/resolvers/yup";
import { unblockInputRequestValidation } from "../../validators/manageAccountsValidators";
import {
  useActionTypes,
  useCurrentUserRoleQuery,
} from "~/features/dictionaries/dictionariesQueries";
import { useAccountsForInputRequestQuery } from "~/features/manageAccounts/manageAccountsQueries";
import { useNavigate, useParams } from "react-router";
import { InputRequestTable } from "../../SharedComponents/InputRequestTable/InputRequestTable";
import { useSelectAccounts } from "../../SharedComponents/hooks/useSelectAccounts";
import { mapUnblockAccountsFormToBlockAccountDTO } from "~/api/manageAccounts/manageAccountsDto";
import { useUnblockAccountMutation } from "~/api/manageAccounts/manageAccountsMutations";
import {
  AccountForInputRequest,
  UnblockAccountDto,
} from "~/api/manageAccounts/manageAccountsApi.types";
import { showError, showSuccess } from "~/components/Toast/ToastContainer";
import { Checkbox } from "~/components/Checkbox/Checkbox";
import { unblockInputRequestI18n } from "./UnblockInputRequest.i18n";
import { lowerFirst } from "lodash";

const styles = {
  filters: (t: Theme) =>
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

export const UnblockInputRequest = () => {
  const { tr } = useI18n();
  const { customerId = "" } = useParams();
  const navigate = useNavigate();

  const accountsForInputRequestQuery =
    useAccountsForInputRequestQuery(customerId);
  const currentUserRoleQuery = useCurrentUserRoleQuery();
  const currentUserRole = currentUserRoleQuery.data;
  const actiontypes = useActionTypes(ActionTypes.Unblock);
  const unblockAccount = useUnblockAccountMutation();

  const {
    selectedIds,
    toggleSelectAccount,
    isAccountSelected,
    isAllAccountsSelected,
    toggleSelectAllAccounts,
  } = useSelectAccounts<AccountForInputRequest, string>({
    accounts: accountsForInputRequestQuery.query.data ?? [],
    getId: (acc) => acc.retailAccountNumber,
  });

  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors, isValid: isFormValid },
  } = useForm<UnblockInputRequestFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(unblockInputRequestValidation(tr)) as any,
  });

  const handleClearFilters = () => {
    const clearFilters: UnblockInputRequestFormValues = {
      unblockActionId: undefined,
      unblockingOrder: "",
      unblockDescription: "",
      isCardUnitNotification: undefined,
      isAmlUnitNotification: undefined,
    };
    reset(clearFilters);
  };

  const handleUnblockAccounts = (values: UnblockInputRequestFormValues) => {
    const requestBody: UnblockAccountDto =
      mapUnblockAccountsFormToBlockAccountDTO(values, customerId, selectedIds);

    unblockAccount.mutate(requestBody, {
      onSuccess: (response) => {
        if (response.isSuccess) {
          if (
            response.successfulAccounts &&
            response.successfulAccounts.length > 0
          ) {
            showSuccess(tr(unblockInputRequestI18n.response.unblockSuccess));
          }
          if (response.failedAccounts && response.failedAccounts.length > 0) {
            const accounts: string = response.failedAccounts.join(", ");
            showError(
              tr(unblockInputRequestI18n.unblockFailed, accounts) as string
            );
          }
          navigate(
            `/customers/manage-accounts?tab=${ManageAccountsViewTabs.UnblockAccount}`
          );
        } else {
          const messageCode = tr(
            unblockInputRequestI18n.response[
              lowerFirst(
                response.message
              ) as keyof typeof unblockInputRequestI18n.response
            ]
          );
          showError(messageCode);
        }
      },
      onError() {
        showError(tr(unblockInputRequestI18n.response.unblockError));
      },
    });
  };

  return (
    <Container as="main">
      {unblockAccount.isLoading && (
        <OverlayLoader
          label={tr(unblockInputRequestI18n.pleaseWait)}
          isCenteredIcon
        />
      )}
      <Stack>
        <BackCustomerView
          to={`/customers/manage-accounts?tab=${ManageAccountsViewTabs.BlockAccount}`}
        />
        <Card>
          <Text
            text={tr(unblockInputRequestI18n.header)}
            size="24"
            lineHeight="32"
            weight="bold"
          />
          <Stack customStyle={styles.filters} gap="16">
            <Stack gap="16">
              <Stack d="h">
                <Select
                  id="unblockActionId"
                  label={tr(unblockInputRequestI18n.unblockAction)}
                  name={"unblockActionId"}
                  control={control}
                  inputStyle={styles.field}
                  data={actiontypes.data}
                  errorMessage={errors.unblockActionId?.message}
                  isRequired
                />
                <Input
                  id="unblockAuthority"
                  label={tr(unblockInputRequestI18n.unblockAuthority)}
                  inputStyle={styles.field}
                  value={currentUserRole}
                  disabled
                />
                <Input
                  id="unblockingOrder"
                  label={tr(unblockInputRequestI18n.unblockingOrder)}
                  register={register("unblockingOrder")}
                  inputStyle={styles.field}
                  isRequired
                />
              </Stack>
              <Stack d="h">
                <Stack d="v" gap="0" css={css({ justifyContent: "flex-end" })}>
                  <Checkbox
                    name={"isCardUnitNotification"}
                    text={tr(unblockInputRequestI18n.cardUnitNotification)}
                    control={control}
                    checkboxStyles={{ padding: 0 }}
                  />
                  <Checkbox
                    name={"isAmlUnitNotification"}
                    text={tr(unblockInputRequestI18n.amlUnitNotification)}
                    control={control}
                    checkboxStyles={{ padding: 0 }}
                  />
                </Stack>
              </Stack>
              <Stack d="h">
                <Textarea
                  label={tr(unblockInputRequestI18n.unblockDescription)}
                  id="unblockDescription"
                  name="unblockDescription"
                  control={control}
                  isRequired
                />
              </Stack>
              <Stack d="h" customStyle={styles.actions}>
                <Button
                  type="button"
                  text={tr(unblockInputRequestI18n.unblockButton)}
                  colorScheme="yellow"
                  icon="unlocked"
                  variant="solid"
                  disabled={!isFormValid || selectedIds.length == 0}
                  onClick={handleSubmit(handleUnblockAccounts)}
                />
                <Button
                  type="button"
                  text={tr(unblockInputRequestI18n.clearButton)}
                  colorScheme="yellow"
                  icon="clear-ring"
                  variant="outline"
                  onClick={handleClearFilters}
                />
              </Stack>
            </Stack>

            <Stack>
              {accountsForInputRequestQuery.query.isLoading ? (
                <Loader withContainer={false} linesNo={4} />
              ) : (
                <InputRequestTable
                  accounts={accountsForInputRequestQuery.query.data ?? []}
                  toggleSelectAccount={toggleSelectAccount}
                  isAccountSelected={isAccountSelected}
                  isAllAccountsSelected={isAllAccountsSelected}
                  toggleSelectAllAccounts={toggleSelectAllAccounts}
                />
              )}
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};
