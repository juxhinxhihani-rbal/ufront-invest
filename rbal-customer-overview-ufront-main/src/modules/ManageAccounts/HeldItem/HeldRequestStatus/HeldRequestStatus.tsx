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
import { format, isAfter } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  HeldRequestsStatusFilterParams,
  HeldRequestStatusResponse,
} from "~/api/manageAccounts/manageAccountsApi.types";
import { useHeldRequestsStatusListMutation } from "~/api/manageAccounts/manageAccountsMutations";
import { BackCustomerView } from "~/components/BackCustomer/BackCustomer";
import { Input } from "~/components/Input/Input";
import { showError } from "~/components/Toast/ToastContainer";
import { HeldRequestStatusTable } from "../../SharedComponents/RequestStatusTable/HeldRequestStatusTable";
import { ManageAccountsViewTabs } from "../../types";
import { heldRequestStatusI18n } from "./HeldRequestStatus.i18n";

const styles = {
  filtersRow: (t: Theme) =>
    css({
      paddingTop: tokens.scale(t, "16"),
      justifyContent: "space-between",
      alignItems: "flex-end",
    }),
  field: css({
    maxWidth: "50%",
  }),
};

export const HeldRequestStatus = () => {
  const { tr } = useI18n();

  const [heldRequestsStatusResponse, setHeldRequestsStatusResponse] =
    useState<HeldRequestStatusResponse>();

  const heldRequestsStatusList = useHeldRequestsStatusListMutation();

  const { register, handleSubmit, setValue, watch, getValues } =
    useForm<HeldRequestsStatusFilterParams>({
      defaultValues: {
        startDate: "",
        endDate: "",
        pageNumber: 1,
      },
    });

  const handleGetRequestStatusList = () => {
    const values = getValues();
    heldRequestsStatusList.mutate(values, {
      onSuccess: (response) => {
        setHeldRequestsStatusResponse(response);
      },
      onError() {
        showError(tr(heldRequestStatusI18n.failedToGetList));
      },
    });
  };

  const handlePageNumberChange = (newPageNumber: number) => {
    setValue("pageNumber", newPageNumber);
    handleGetRequestStatusList();
  };

  const checkDatesForDisable = (): boolean => {
    const startDate = watch("startDate");
    const endDate = watch("endDate");

    return (
      !startDate ||
      !endDate ||
      isAfter(format(startDate, "yyyy-MM-dd"), format(endDate, "yyyy-MM-dd"))
    );
  };

  return (
    <Container as="main">
      <Stack>
        <BackCustomerView
          to={`/customers/manage-accounts?tab=${ManageAccountsViewTabs.BlockAccount}`}
        />
        <Card>
          <Text
            text={tr(heldRequestStatusI18n.header)}
            size="24"
            lineHeight="32"
            weight="bold"
          />
          <Stack d="v" gap="32">
            <Stack d="h" customStyle={styles.filtersRow}>
              <Stack d="h" gap="4" customStyle={css({ width: "60%" })}>
                <Input
                  type="date"
                  id="startDate"
                  label={tr(heldRequestStatusI18n.startDate)}
                  register={register("startDate")}
                  inputStyle={styles.field}
                  isRequired
                />
                <Input
                  type="date"
                  id="endDate"
                  label={tr(heldRequestStatusI18n.endDate)}
                  register={register("endDate")}
                  inputStyle={styles.field}
                  isRequired
                />
              </Stack>

              <Button
                type="button"
                text={tr(heldRequestStatusI18n.search)}
                colorScheme="yellow"
                variant="solid"
                onClick={handleSubmit(handleGetRequestStatusList)}
                disabled={checkDatesForDisable()}
              />
            </Stack>
            <Stack>
              {heldRequestsStatusList.isLoading && (
                <Loader withContainer={false} linesNo={4} />
              )}
              {heldRequestsStatusResponse && (
                <HeldRequestStatusTable
                  data={heldRequestsStatusResponse}
                  onPageNumberChange={handlePageNumberChange}
                />
              )}
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};
