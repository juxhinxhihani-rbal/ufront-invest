import {
  Button,
  Stack,
  Text,
  Table,
  Tr,
  Loader,
} from "@rbal-modern-luka/ui-library";
import { useContext, useEffect, useMemo, useState } from "react";
import { Select } from "~/components/Select/Select";
import { Input } from "~/components/Input/Input";
import {
  formatIntlLocalDate,
  TrFunction,
  useI18n,
} from "@rbal-modern-luka/luka-portal-shell";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAccountRightsAuthorizationListQuery } from "~/features/customer/customerQueries";
import { useNavigate } from "react-router";
import { InfoBar } from "~/components/InfoBar/InfoBar";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";

import { AuthorizationContext } from "~/context/AuthorizationContext";
import { DefaultAccountRightsAuthorizationFiltersParams } from "../../types";
import { authorizationStyles } from "../../Authorization.styles";
import { authorizationI18n } from "../../Authorization.i18n";
import { styles } from "./AccountRightsAuthorization.styles";
import { accountRightsAuthorizationi18n } from "./AccountRightsAuthorization.i18n";
import { getHexColor } from "~/common/utils";
import { defaultAccountRightsAuthorizationFilters } from "../../defaultFilters";
import { StatusResponse } from "~/features/dictionaries/dictionariesQueries";

const accountRightsTableConfig = {
  cols: [
    "110px",
    "90px",
    "90px",
    "160px",
    "170px",
    "160px",
    "140px",
    "140px",
    "130px",
    "120px",
  ],
  headers: (tr: TrFunction) => [
    tr(accountRightsAuthorizationi18n.table.headers.customerNumber),
    tr(accountRightsAuthorizationi18n.table.headers.branchCreated),
    tr(accountRightsAuthorizationi18n.table.headers.branchUpdated),
    tr(accountRightsAuthorizationi18n.table.headers.headFullName),
    tr(accountRightsAuthorizationi18n.table.headers.customerStatus),
    tr(accountRightsAuthorizationi18n.table.headers.authorizedPersonName),
    tr(accountRightsAuthorizationi18n.table.headers.dataInsterted),
    tr(accountRightsAuthorizationi18n.table.headers.userCreated),
    tr(accountRightsAuthorizationi18n.table.headers.userAuthorized),
    tr(accountRightsAuthorizationi18n.table.headers.customerType),
  ],
};

const isRowDisabled = (rowId: number) => rowId === -1;

interface AccountRightsAuthorizationProps {
  statusData: StatusResponse[];
}

export const AccountRightsAuthorization = ({
  statusData,
}: AccountRightsAuthorizationProps) => {
  const { tr } = useI18n();
  const navigate = useNavigate();
  const { branches, users, currentBranch, currentUser, midasDate } =
    useContext(AuthorizationContext);
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("tab", "accountRights");
    navigate(`?${params.toString()}`, { replace: true });
  }, [navigate]);

  const { control, reset, register, handleSubmit, setValue } =
    useForm<DefaultAccountRightsAuthorizationFiltersParams>({
      defaultValues: defaultAccountRightsAuthorizationFilters,
    });

  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  const [filters, setFilters] =
    useState<DefaultAccountRightsAuthorizationFiltersParams>(
      defaultAccountRightsAuthorizationFilters
    );

  useEffect(() => {
    if (currentUser && currentBranch) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        dateTimeAccountRights: midasDate,
        branchId: currentBranch?.branchId,
      }));
      setValue("dateTimeAccountRights", midasDate);
      setValue("branchId", currentBranch?.branchId);
    }
  }, [currentUser, currentBranch, setValue, midasDate]);

  const { query, isDataEmpty, refresh } =
    useAccountRightsAuthorizationListQuery(filters);
  //eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const accountRightsAuthorizationList = query.data?.response || [];

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const totalPageNumber = query.data?.totalPageNumber || 0;

  const handleOnClickAuthorizedPersonRow = (
    authorizationRightListId: number
  ) => {
    navigate(
      `/customers/authorization/account-rights/${authorizationRightListId}`
    );
  };

  const tableHeaders = useMemo(
    () => accountRightsTableConfig.headers(tr),
    [tr]
  );

  const onSubmit: SubmitHandler<
    DefaultAccountRightsAuthorizationFiltersParams
  > = (data) => {
    setFilters(data);
    refresh();
  };

  const handleClearFilters = () => {
    const clearFilters: DefaultAccountRightsAuthorizationFiltersParams = {
      ...defaultAccountRightsAuthorizationFilters,
      dateTimeAccountRights: midasDate,
      branchId: currentBranch?.branchId,
    };
    reset(clearFilters);
    setFilters(clearFilters);
    refresh();
  };

  const handleNextPage = () => {
    const newPage = currentPageNumber + 1;
    setCurrentPageNumber(newPage);
    setFilters((prev) => ({ ...prev, pageNumber: newPage }));
    refresh();
  };

  const handlePreviousPage = () => {
    if (currentPageNumber > 1) {
      const newPage = currentPageNumber - 1;
      setCurrentPageNumber(newPage);
      setFilters((prev) => ({ ...prev, pageNumber: newPage }));
      refresh();
    }
  };

  return (
    <>
      <Stack d="v" gap="4" customStyle={authorizationStyles.container}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="16">
            <Stack d="h" isSpaceBetween>
              <Input
                type="date"
                id="dateTimeAccountRights"
                label={tr(authorizationI18n.searchFields.date)}
                register={register("dateTimeAccountRights")}
              />
              <Input
                id="customerNumber"
                label={tr(authorizationI18n.searchFields.customerNumber)}
                register={register("customerNumber")}
              />
              <Input
                id="retailAccountNumber"
                label={tr(
                  accountRightsAuthorizationi18n.searchFields
                    .retailAccountNumber
                )}
                register={register("retailAccountNumber")}
              />
            </Stack>
            <Stack d="h">
              <Select
                id="userId"
                label={tr(authorizationI18n.searchFields.user)}
                name={"userId"}
                control={control}
                data={users?.map((item) => ({
                  id: item.userId,
                  name: item.user,
                }))}
              />
              <Select
                id="branchId"
                label={tr(authorizationI18n.searchFields.branch)}
                name={"branchId"}
                control={control}
                data={branches?.map((item) => ({
                  id: item.branchId,
                  name: item.branchCode + " " + item.branchName,
                }))}
                selectedFontSize={"13px"}
                disabled={true}
              />
              <Select
                id="signatureStatusId"
                label={"Status"}
                name={"signatureStatusId"}
                control={control}
                data={statusData?.map((item) => ({
                  id: item.statusId,
                  name: item.status,
                }))}
                selectedFontSize={"13px"}
              />
            </Stack>
            <Stack
              customStyle={authorizationStyles.sectionFlex}
              style={{
                justifyContent: "flex-end",
              }}
            >
              <Button
                type="submit"
                text={tr(authorizationI18n.searchButtons.search)}
                colorScheme="yellow"
                icon="search"
                variant="solid"
              />
              <Button
                type="button"
                text={tr(authorizationI18n.searchButtons.clear)}
                colorScheme="red"
                variant="outline"
                icon="clear-ring"
                iconFgColor="red500"
                onClick={handleClearFilters}
              />
            </Stack>
          </Stack>
        </form>
        <Stack
          gap={accountRightsAuthorizationList ? "0" : "12"}
          customStyle={styles.tableContainer}
        >
          <RowHeader
            withBorder={false}
            pb="12"
            label={
              <Text
                size="16"
                weight="bold"
                text={tr(authorizationI18n.table.authorizedPersonTitle)}
              />
            }
          />

          {query.isFetching ? (
            <Loader withContainer={false} linesNo={5} />
          ) : !isDataEmpty ? (
            <>
              <Stack customStyle={styles.table}>
                <Table
                  cols={accountRightsTableConfig.cols}
                  headers={tableHeaders}
                >
                  {accountRightsAuthorizationList?.map((accountDetails) => (
                    <React.Fragment key={accountDetails.retailAccountNumber}>
                      <Tr
                        css={
                          isRowDisabled(accountDetails.authorizationRightListId)
                            ? authorizationStyles.disabledRow
                            : authorizationStyles.clickableRow
                        }
                        onClick={() =>
                          handleOnClickAuthorizedPersonRow(
                            accountDetails.authorizationRightListId
                          )
                        }
                      >
                        <Text text={accountDetails.customerNumber} />
                        <Text text={accountDetails.branchCreated} />
                        <Text text={accountDetails.branchUpdated} />
                        <Text text={accountDetails.headFullName} />
                        <Text
                          text={accountDetails.customerStatus}
                          customStyle={[
                            styles.wordBreak,
                            { color: getHexColor(accountDetails.statusColor) },
                          ]}
                        />
                        <Text text={accountDetails.authorizedPersonName} />
                        <Text
                          text={formatIntlLocalDate(
                            accountDetails.dateInserted
                          )}
                        />
                        <Text text={accountDetails.userCreated} />
                        <Text text={accountDetails.userAuthorized} />
                        <Text text={accountDetails.customerType} />
                      </Tr>
                    </React.Fragment>
                  ))}
                </Table>
              </Stack>
              <Stack d="h" customStyle={authorizationStyles.paginationButtons}>
                <Text text={currentPageNumber ?? 0} />
                <Text text="/" />
                <Text text={totalPageNumber ?? 0} />
                <Button
                  variant="link"
                  onClick={() => handlePreviousPage()}
                  icon="back"
                  disabled={currentPageNumber === 1}
                />
                <Button
                  variant="link"
                  onClick={() => handleNextPage()}
                  icon="forward"
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  disabled={currentPageNumber >= totalPageNumber!}
                />
              </Stack>
            </>
          ) : (
            <InfoBar text={tr(authorizationI18n.table.noData)} />
          )}
        </Stack>
      </Stack>
    </>
  );
};
