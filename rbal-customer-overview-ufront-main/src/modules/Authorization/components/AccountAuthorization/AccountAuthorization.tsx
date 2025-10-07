import {
  formatIntlLocalDate,
  TrFunction,
  useI18n,
} from "@rbal-modern-luka/luka-portal-shell";
import { useContext, useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { StatusResponse } from "~/features/dictionaries/dictionariesQueries";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { DefaultAccountAuthorizationFiltersParams } from "../../types";
import { accountAuthorizationi18n } from "./AccountAuthorization.i18n";
import {
  Button,
  Stack,
  Text,
  Table,
  Tr,
  Loader,
} from "@rbal-modern-luka/ui-library";
import { authorizationStyles } from "../../Authorization.styles";
import React from "react";
import { InfoBar } from "~/components/InfoBar/InfoBar";
import { useNavigate } from "react-router";
import { authorizationI18n } from "../../Authorization.i18n";
import { useAccountAuthorizationListQuery } from "~/features/customer/customerQueries";
import { format } from "date-fns";
import { Input } from "~/components/Input/Input";
import { Select } from "~/components/Select/Select";
import { AuthorizationContext } from "~/context/AuthorizationContext";
import { formatCurrency } from "~/modules/CustomerOverview/CustomerInformation/components/RetailAccountsTable/RetailAccountsTable";
import { styles } from "./AccountAuthorization.styles";
import { booleansI18n } from "~/features/i18n";
import { defaultAccountAuthorizationFilters } from "../../defaultFilters";

const authorizableAccountsTableConfig = {
  cols: [
    "140px",
    "200px",
    "100px",
    "200px",
    "120px",
    "120px",
    "120px",
    "100px",
    "100px",
    "100px",
    "130px",
    "120px",
    "150px",
    "200px",
  ],
  headers: (tr: TrFunction) => [
    tr(accountAuthorizationi18n.table.headers.retailAccountNumber),
    tr(accountAuthorizationi18n.table.headers.accountNumber),
    tr(accountAuthorizationi18n.table.headers.ccy),
    tr(accountAuthorizationi18n.table.headers.product),
    tr(accountAuthorizationi18n.table.headers.isOpen),
    tr(accountAuthorizationi18n.table.headers.isActive),
    tr(accountAuthorizationi18n.table.headers.branch),
    tr(accountAuthorizationi18n.table.headers.minimumBalance),
    tr(accountAuthorizationi18n.table.headers.openCommission),
    tr(accountAuthorizationi18n.table.headers.closeCommission),
    tr(accountAuthorizationi18n.table.headers.accountToPostCrInterest),
    tr(accountAuthorizationi18n.table.headers.lastSavedDate),
    tr(accountAuthorizationi18n.table.headers.userModified),
    tr(accountAuthorizationi18n.table.headers.retailAccountStatus),
  ],
};

interface AccountAuthorizationProps {
  statusData: StatusResponse[];
}

export const AccountAuthorization = ({
  statusData,
}: AccountAuthorizationProps) => {
  const { tr } = useI18n();
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("tab", "accounts");
    navigate(`?${params.toString()}`, { replace: true });
  }, [navigate]);

  const { branches, users, currentBranch, currentUser, midasDate } =
    useContext(AuthorizationContext);

  const { control, reset, register, setValue, handleSubmit } =
    useForm<DefaultAccountAuthorizationFiltersParams>({
      defaultValues: defaultAccountAuthorizationFilters,
    });

  const [filters, setFilters] =
    useState<DefaultAccountAuthorizationFiltersParams>(
      defaultAccountAuthorizationFilters
    );

  useEffect(() => {
    if (currentUser && currentBranch) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        date: midasDate,
        branchId: currentBranch?.branchId,
      }));
      setValue("date", midasDate);
      setValue("branchId", currentBranch?.branchId);
    }
  }, [currentUser, currentBranch, setValue, midasDate]);

  const tableHeaders = useMemo(
    () => authorizableAccountsTableConfig.headers(tr),
    [tr]
  );

  const handleOnClickAccountRow = (accountId: number) => {
    navigate(`accounts/${accountId}`);
  };

  const [currentPageNumber, setCurrentPageNumber] = useState(1);

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

  const { query, isDataEmpty, refresh } =
    useAccountAuthorizationListQuery(filters);
  //eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const authorizableAccountsList = query.data?.response ?? [];

  const totalPageNumber = query.data?.totalPageNumber ?? 0;
  const todaysDate = format(new Date(), "yyyy-MM-dd");

  const onSubmit: SubmitHandler<DefaultAccountAuthorizationFiltersParams> = (
    data
  ) => {
    setFilters(data);
    refresh();
  };

  const handleClearFilters = () => {
    const clearFilters: DefaultAccountAuthorizationFiltersParams = {
      ...defaultAccountAuthorizationFilters,
      branchId: currentBranch?.branchId,
      date: midasDate,
    };
    reset(clearFilters);
    setFilters(clearFilters);
    refresh();
  };

  return (
    <Stack d="v" gap="4" customStyle={authorizationStyles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack customStyle={authorizationStyles.sectionFlex}>
          <Stack customStyle={authorizationStyles.searchFieldWidth}>
            <Input
              id="retailAccountNumber"
              label={tr(
                accountAuthorizationi18n.searchFields.retailAccountNumber
              )}
              register={register("retailAccountNumber")}
              isFullWidth={true}
            />
          </Stack>
          <Stack customStyle={authorizationStyles.searchFieldWidth}>
            <Input
              type="date"
              id="date"
              label={tr(accountAuthorizationi18n.searchFields.date)}
              isFullWidth={true}
              register={register("date")}
              max={todaysDate}
            />
          </Stack>
          <Stack customStyle={authorizationStyles.searchFieldWidth}>
            <Select
              id="accountStatusId"
              label={tr(accountAuthorizationi18n.searchFields.accountStatus)}
              name={"accountStatusId"}
              control={control}
              data={statusData?.map((item) => ({
                id: item.statusId,
                name: item.status,
              }))}
              selectedFontSize={"13px"}
            />
          </Stack>
          <Stack customStyle={authorizationStyles.searchFieldWidth}>
            <Select
              id="userId"
              label={tr(accountAuthorizationi18n.searchFields.user)}
              name={"userId"}
              control={control}
              data={users?.map((item) => ({
                id: item.userId,
                name: item.user,
              }))}
            />
          </Stack>
          <Stack customStyle={authorizationStyles.searchFieldWidth}>
            <Select
              id="branchId"
              label={tr(accountAuthorizationi18n.searchFields.branch)}
              name={"branchId"}
              control={control}
              data={branches?.map((item) => ({
                id: item.branchId,
                name: item.branchCode + " " + item.branchName,
              }))}
              selectedFontSize={"13px"}
              disabled={true}
            />
          </Stack>
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
      </form>
      <Stack customStyle={styles.tableContainer} gap={isDataEmpty ? "0" : "12"}>
        <RowHeader
          withBorder={false}
          pb="12"
          label={
            <Text
              size="16"
              weight="bold"
              text={tr(accountAuthorizationi18n.table.title)}
            />
          }
        />

        {query.isFetching ? (
          <Loader withContainer={false} linesNo={5} />
        ) : !isDataEmpty ? (
          <>
            <Stack customStyle={styles.table}>
              <Table
                cols={authorizableAccountsTableConfig.cols}
                headers={tableHeaders}
              >
                {authorizableAccountsList?.map((account) => (
                  <React.Fragment key={account.retailAccountNumber}>
                    <Tr
                      css={authorizationStyles.clickableRow}
                      onClick={() => handleOnClickAccountRow(account.productId)}
                    >
                      <Text text={account.retailAccountNumber} />
                      <Text text={account.accountNumber} />
                      <Text text={account.currency} />
                      <Text text={account.segment} />
                      <Text
                        text={
                          account.isOpen
                            ? tr(booleansI18n.yes)
                            : tr(booleansI18n.no)
                        }
                      />
                      <Text
                        text={
                          account.isActive
                            ? tr(booleansI18n.yes)
                            : tr(booleansI18n.no)
                        }
                      />
                      <Text text={account.branch} />
                      <Text
                        text={formatCurrency(
                          account.minimumBalance ?? 0,
                          account.currency
                        )}
                      />
                      <Text
                        text={formatCurrency(
                          account.openCommission ?? 0,
                          account.currency
                        )}
                      />
                      <Text
                        text={formatCurrency(
                          account.closeCommission ?? 0,
                          account.currency
                        )}
                      />
                      <Text text={account.accountToPostCrInterest ?? " "} />
                      <Text text={formatIntlLocalDate(account.lastSavedDate)} />
                      <Text text={account.userModified} />
                      <Text text={account.status} />
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
  );
};
