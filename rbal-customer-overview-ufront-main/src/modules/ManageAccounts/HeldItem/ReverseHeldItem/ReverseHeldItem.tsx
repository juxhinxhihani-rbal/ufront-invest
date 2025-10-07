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
import { useCurrentUserRoleQuery } from "~/features/dictionaries/dictionariesQueries";
import { reverseHeldItemI18n } from "./ReverseHeldItem.i18n";
import { ManageAccountsViewTabs, ReverseHeldItemFormValues } from "../../types";
import { css, Theme } from "@emotion/react";
import { BackCustomerView } from "~/components/BackCustomer/BackCustomer";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { Input } from "~/components/Input/Input";
import { Textarea } from "~/components/Textarea/Textarea";
import { useLocation, useNavigate } from "react-router";
import { Checkbox } from "~/components/Checkbox/Checkbox";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRequestsForReverseHeldItemQuery } from "~/features/manageAccounts/manageAccountsQueries";
import { ListCustomersParams } from "~/modules/CustomerListingPage/types";
import { useMemo } from "react";
import { useSelectAccounts } from "../../SharedComponents/hooks/useSelectAccounts";
import {
  HeldItemRequestsForReverse,
  ReverseHeldItemRequestDto,
  ReverseHeldItemsList,
} from "~/api/manageAccounts/manageAccountsApi.types";
import { ReverseHeldItemTable } from "../../SharedComponents/ReverseHeldItemTable/ReverseHeldItemTable";
import { mapReverseHeldItemsFormToReverseHeldItemsDto } from "~/api/manageAccounts/manageAccountsDto";
import { reverseHeldItemRequestValidation } from "../../validators/manageAccountsValidators";
import { useReverseHeldItemMutation } from "~/api/manageAccounts/manageAccountsMutations";
import { showError, showSuccess } from "~/components/Toast/ToastContainer";

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

export const ReverseHeldItem = () => {
  const currentLocation = useLocation();
  const navigate = useNavigate();

  const { tr } = useI18n();

  const listCustomersParams: ListCustomersParams = useMemo(() => {
    return toListCustomersParams(currentLocation.search);
  }, [currentLocation.search]);

  const {
    query: { data: requests, isFetching },
  } = useRequestsForReverseHeldItemQuery(listCustomersParams);

  const currentUserRoleQuery = useCurrentUserRoleQuery();
  const currentUserRole = currentUserRoleQuery.data;
  const reverseHeldItem = useReverseHeldItemMutation();

  const {
    selectedIds,
    toggleSelectAccount,
    isAccountSelected,
    isAllAccountsSelected,
    toggleSelectAllAccounts,
  } = useSelectAccounts<ReverseHeldItemsList, number>({
    accounts: requests ?? [],
    getId: (acc) => acc.requestId,
  });
  const handleReverseHeldItemsRequests = (
    values: ReverseHeldItemFormValues
  ) => {
    const requestBody: ReverseHeldItemRequestDto =
      mapReverseHeldItemsFormToReverseHeldItemsDto(
        values,
        getSelectedRequestDetails(selectedIds, requests ?? [])
      );
    console.log(requestBody);
    reverseHeldItem.mutate(requestBody, {
      onSuccess: (response) => {
        if (response.isSuccess) {
          showSuccess(tr(reverseHeldItemI18n.reverseSucccess));
          navigate(
            `/customers/manage-accounts?tab=${ManageAccountsViewTabs.HeldItem}`
          );
        } else {
          showError(tr(reverseHeldItemI18n.cannotProccess));
        }
      },
      onError() {
        showError(tr(reverseHeldItemI18n.reverseError));
      },
    });
  };

  const {
    control,
    reset,
    handleSubmit,
    formState: { isValid: isFormValid },
  } = useForm<ReverseHeldItemFormValues>({
    defaultValues: {
      isTemporary: true,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(reverseHeldItemRequestValidation(tr)) as any,
  });

  const handleClearFilters = () => {
    const clearFilters: ReverseHeldItemFormValues = {
      reverseDescription: "",
      isTemporary: true,
    };
    reset(clearFilters);
  };

  const getSelectedRequestDetails = (
    selectedIds: number[],
    requests: ReverseHeldItemsList[]
  ): HeldItemRequestsForReverse[] => {
    return requests
      .filter((request) => selectedIds.includes(request.requestId))
      .map((request) => ({
        idRequest: request.requestId,
        currencyCode: request.currencyCode,
        accountCode: request.accountCode,
        customerName: request.customerName,
        customerNumber: request.customerNumber,
        retailAccountNumber: request.retailAccountNumber,
      }));
  };

  return (
    <Container as="main">
      {reverseHeldItem.isLoading && (
        <OverlayLoader
          label={tr(reverseHeldItemI18n.pleaseWait)}
          isCenteredIcon
        />
      )}
      <Stack>
        <BackCustomerView
          to={`/customers/manage-accounts?tab=${ManageAccountsViewTabs.HeldItem}`}
        />
        <Card>
          <Text
            text={tr(reverseHeldItemI18n.header)}
            size="24"
            lineHeight="32"
            weight="bold"
          />
          <Stack customStyle={styles.filters} gap="16">
            <Stack gap="16">
              <Stack d="h">
                <Input
                  id="blockAuthority"
                  label={tr(reverseHeldItemI18n.blockAuthority)}
                  inputStyle={styles.field}
                  value={currentUserRole}
                  disabled
                />
                <Stack d="v" gap="0" css={css({ justifyContent: "flex-end" })}>
                  <Checkbox
                    name={"isTemporary"}
                    text={tr(reverseHeldItemI18n.temporary)}
                    checkboxStyles={{ padding: 0 }}
                    control={control}
                  />
                </Stack>
              </Stack>
              <Stack d="h">
                <Textarea
                  label={tr(reverseHeldItemI18n.reverseDescription)}
                  id="reverseDescription"
                  name="reverseDescription"
                  isRequired
                  control={control}
                />
              </Stack>
              <Stack d="h" customStyle={styles.actions}>
                <Button
                  type="button"
                  text={tr(reverseHeldItemI18n.reverseItemButton)}
                  colorScheme="yellow"
                  icon="blocked"
                  variant="solid"
                  disabled={!isFormValid || selectedIds.length == 0}
                  onClick={handleSubmit(handleReverseHeldItemsRequests)}
                />
                <Button
                  type="button"
                  text={tr(reverseHeldItemI18n.clearButton)}
                  colorScheme="yellow"
                  icon="clear-ring"
                  variant="outline"
                  onClick={handleClearFilters}
                />
              </Stack>
            </Stack>

            <Stack>
              {isFetching ? (
                <Loader withContainer={false} linesNo={4} />
              ) : (
                <ReverseHeldItemTable
                  accounts={requests ?? []}
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
function toListCustomersParams(searchString: string): ListCustomersParams {
  const searchParams = new URLSearchParams(searchString);

  return {
    fullNameContains: searchParams.get("fullNameContains") ?? undefined,
    customerNo: searchParams.get("customerNo") ?? undefined,
    retailAccountNo: searchParams.get("retailAccountNo") ?? undefined,
  };
}
