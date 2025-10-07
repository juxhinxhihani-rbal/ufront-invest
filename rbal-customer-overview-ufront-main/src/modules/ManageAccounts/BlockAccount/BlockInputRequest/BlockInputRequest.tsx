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
  BlockInputRequestFormValues,
  ManageAccountsViewTabs,
} from "../../types";
import { blockInputRequestI18n } from "./BlockInputRequest.i18n";
import { Input } from "~/components/Input/Input";
import { Textarea } from "~/components/Textarea/Textarea";
import { useForm } from "react-hook-form";
import { Select } from "~/components/Select/Select";
import { yupResolver } from "@hookform/resolvers/yup";
import { blockInputRequestValidation } from "../../validators/manageAccountsValidators";
import {
  useActionTypes,
  useCurrentUserRoleQuery,
} from "~/features/dictionaries/dictionariesQueries";
import { useAccountsForInputRequestQuery } from "~/features/manageAccounts/manageAccountsQueries";
import { useNavigate, useParams } from "react-router";
import { InputRequestTable } from "../../SharedComponents/InputRequestTable/InputRequestTable";
import { useSelectAccounts } from "../../SharedComponents/hooks/useSelectAccounts";
import { mapBlockAccountsFormToBlockAccountDTO } from "~/api/manageAccounts/manageAccountsDto";
import { useBlockAccountMutation } from "~/api/manageAccounts/manageAccountsMutations";
import {
  AccountForInputRequest,
  BlockAccountDto,
} from "~/api/manageAccounts/manageAccountsApi.types";
import { showError, showSuccess } from "~/components/Toast/ToastContainer";
import { Checkbox } from "~/components/Checkbox/Checkbox";
import { addDays, format } from "date-fns";

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

export const BlockInputRequest = () => {
  const { tr } = useI18n();
  const { customerId = "" } = useParams();
  const navigate = useNavigate();

  const accountsForInputRequestQuery =
    useAccountsForInputRequestQuery(customerId);
  const currentUserRoleQuery = useCurrentUserRoleQuery();
  const currentUserRole = currentUserRoleQuery.data;
  const actiontypes = useActionTypes(ActionTypes.Block);
  const blockAccount = useBlockAccountMutation();

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
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors, isValid: isFormValid },
  } = useForm<BlockInputRequestFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(blockInputRequestValidation(tr)) as any,
  });

  const handleClearFilters = () => {
    const clearFilters: BlockInputRequestFormValues = {
      blockActionId: undefined,
      blockingOrder: "",
      blockStartDate: "",
      blockEndDate: "",
      blockDescription: "",
      isCardUnitNotification: undefined,
      isAmlUnitNotification: undefined,
    };
    reset(clearFilters);
  };

  const handleBlockAccounts = (values: BlockInputRequestFormValues) => {
    const requestBody: BlockAccountDto = mapBlockAccountsFormToBlockAccountDTO(
      values,
      customerId,
      selectedIds
    );

    blockAccount.mutate(requestBody, {
      onSuccess: (response) => {
        if (response.isSuccess) {
          showSuccess(tr(blockInputRequestI18n.blockSuccess));
          navigate(
            `/customers/manage-accounts?tab=${ManageAccountsViewTabs.BlockAccount}`
          );
        } else {
          showError(tr(blockInputRequestI18n.blockFailed));
        }
      },
      onError() {
        showError(tr(blockInputRequestI18n.blockFailed));
      },
    });
  };

  return (
    <Container as="main">
      {blockAccount.isLoading && (
        <OverlayLoader
          label={tr(blockInputRequestI18n.pleaseWait)}
          isCenteredIcon
        />
      )}
      <Stack>
        <BackCustomerView
          to={`/customers/manage-accounts?tab=${ManageAccountsViewTabs.BlockAccount}`}
        />
        <Card>
          <Text
            text={tr(blockInputRequestI18n.header)}
            size="24"
            lineHeight="32"
            weight="bold"
          />
          <Stack customStyle={styles.filters} gap="16">
            <Stack gap="16">
              <Stack d="h">
                <Select
                  id="blockActionId"
                  label={tr(blockInputRequestI18n.blockAction)}
                  name={"blockActionId"}
                  control={control}
                  inputStyle={styles.field}
                  data={actiontypes.data}
                  errorMessage={errors.blockActionId?.message}
                  isRequired
                />
                <Input
                  id="blockAuthority"
                  label={tr(blockInputRequestI18n.blockAuthority)}
                  inputStyle={styles.field}
                  value={currentUserRole}
                  disabled
                />
                <Input
                  id="blockingOrder"
                  label={tr(blockInputRequestI18n.blockingOrder)}
                  register={register("blockingOrder")}
                  inputStyle={styles.field}
                  isRequired
                />
              </Stack>
              <Stack d="h">
                <Input
                  type="date"
                  id="blockStartDate"
                  label={tr(blockInputRequestI18n.blockStartDate)}
                  register={register("blockStartDate")}
                  min={format(new Date(), "yyyy-MM-dd")}
                  isRequired
                />
                <Input
                  type="date"
                  id="blockEndDate"
                  label={tr(blockInputRequestI18n.blockEndDate)}
                  min={format(addDays(new Date(), 1), "yyyy-MM-dd")}
                  register={register("blockEndDate")}
                  isRequired
                />
                <Stack d="v" gap="0" css={css({ justifyContent: "flex-end" })}>
                  <Checkbox
                    name={"isCardUnitNotification"}
                    text={tr(blockInputRequestI18n.cardUnitNotification)}
                    control={control}
                    checkboxStyles={{ padding: 0 }}
                  />
                  <Checkbox
                    name={"isAmlUnitNotification"}
                    text={tr(blockInputRequestI18n.amlUnitNotification)}
                    control={control}
                    checkboxStyles={{ padding: 0 }}
                  />
                </Stack>
              </Stack>
              <Stack d="h">
                <Textarea
                  label={tr(blockInputRequestI18n.blockDescription)}
                  id="blockDescription"
                  name="blockDescription"
                  control={control}
                  isRequired
                />
              </Stack>
              <Stack d="h" customStyle={styles.actions}>
                <Button
                  type="button"
                  text={tr(blockInputRequestI18n.blockButton)}
                  colorScheme="yellow"
                  icon="blocked"
                  variant="solid"
                  disabled={!isFormValid || selectedIds.length == 0}
                  onClick={handleSubmit(handleBlockAccounts)}
                />
                <Button
                  type="button"
                  text={tr(blockInputRequestI18n.clearButton)}
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
