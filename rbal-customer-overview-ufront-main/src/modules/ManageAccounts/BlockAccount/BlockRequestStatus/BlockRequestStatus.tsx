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
  RequestsStatusFilterParams,
  RequestsStatusListResponse,
} from "~/api/manageAccounts/manageAccountsApi.types";
import { useBlockRequestsStatusListMutation } from "~/api/manageAccounts/manageAccountsMutations";
import { BackCustomerView } from "~/components/BackCustomer/BackCustomer";
import { Input } from "~/components/Input/Input";
import { showError } from "~/components/Toast/ToastContainer";
import { BlockRequestStatusTable } from "../../SharedComponents/RequestStatusTable/BlockRequestStatusTable";
import { ManageAccountsViewTabs } from "../../types";
import { blockRequestStatusI18n } from "./BlockRequestStatus.i18n";

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
  row: css({ alignItems: "flex-end" }),
};

export const BlockRequestStatus = () => {
  const { tr } = useI18n();

  const [blockRequestsStatusResponse, setBlockRequestsStatusResponse] =
    useState<RequestsStatusListResponse>();

  const requestsStatusList = useBlockRequestsStatusListMutation();

  const { register, handleSubmit, setValue, watch, getValues } =
    useForm<RequestsStatusFilterParams>({
      defaultValues: {
        startDate: "",
        endDate: "",
        pageNumber: 1,
      },
    });

  const handleGetRequestStatusList = () => {
    const values = getValues();
    requestsStatusList.mutate(values, {
      onSuccess: (response) => {
        setBlockRequestsStatusResponse(response);
      },
      onError() {
        showError(tr(blockRequestStatusI18n.failedToGetList));
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
            text={tr(blockRequestStatusI18n.header)}
            size="24"
            lineHeight="32"
            weight="bold"
          />
          <Stack gap="32">
            <Stack d="h" customStyle={styles.filtersRow}>
              <Stack d="h" customStyle={css({ width: "60%" })}>
                <Input
                  type="date"
                  id="startDate"
                  label={tr(blockRequestStatusI18n.startDate)}
                  register={register("startDate")}
                  inputStyle={styles.field}
                  isRequired
                />
                <Input
                  type="date"
                  id="endDate"
                  label={tr(blockRequestStatusI18n.endDate)}
                  register={register("endDate")}
                  inputStyle={styles.field}
                  isRequired
                />
              </Stack>
              <Button
                type="button"
                text={tr(blockRequestStatusI18n.search)}
                colorScheme="yellow"
                variant="solid"
                onClick={handleSubmit(handleGetRequestStatusList)}
                disabled={checkDatesForDisable()}
              />
            </Stack>
            <Stack>
              {requestsStatusList.isLoading && !blockRequestsStatusResponse && (
                <Loader withContainer={false} linesNo={4} />
              )}
              {blockRequestsStatusResponse && (
                <BlockRequestStatusTable
                  data={blockRequestsStatusResponse}
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
