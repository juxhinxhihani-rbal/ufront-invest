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
import { authorizationI18n } from "../Authorization.i18n";
import { authorizationStyles } from "../Authorization.styles";
import { useAuthorizationCustomerListQuery } from "~/features/customer/customerQueries";
import { StatusResponse } from "~/features/dictionaries/dictionariesQueries";
import { useNavigate } from "react-router";
import { InfoBar } from "~/components/InfoBar/InfoBar";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { DefaultCustomerAuthorizationFiltersParams } from "../types";
import { AuthorizationContext } from "~/context/AuthorizationContext";
import { defaultCustomerAuthorizationFilters } from "../defaultFilters";
import { RESOURCES } from "~/common/resources";
import { PERMISSIONS } from "~/common/permissions";
import { usePermission } from "~/features/hooks/useHasPermission";

const customerTableConfig = {
  cols: [
    "100px",
    "165px",
    "105px",
    "125px",
    "121px",
    "125px",
    "140px",
    "106px",
    "125px",
  ],
  headers: (tr: TrFunction) => [
    tr(authorizationI18n.table.headers.customerNumber),
    tr(authorizationI18n.table.headers.fullName),
    tr(authorizationI18n.table.headers.birthDate),
    tr(authorizationI18n.table.headers.birthPlace),
    tr(authorizationI18n.table.headers.lastSavedDate),
    tr(authorizationI18n.table.headers.customerStatus),
    tr(authorizationI18n.table.headers.address),
    tr(authorizationI18n.table.headers.dateChanged),
    tr(authorizationI18n.table.headers.userChanged),
  ],
};

interface CustomerAuthorizationProps {
  statusData: StatusResponse[];
}

export const CustomerAuthorization = ({
  statusData,
}: CustomerAuthorizationProps) => {
  const { tr } = useI18n();
  const navigate = useNavigate();
  const { branches, users, currentBranch, currentUser, midasDate } =
    useContext(AuthorizationContext);

  const { isUserAllowed } = usePermission();

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("tab", "customers");
    navigate(`?${params.toString()}`, { replace: true });
  }, [navigate]);

  const { control, reset, register, handleSubmit, setValue } =
    useForm<DefaultCustomerAuthorizationFiltersParams>({
      defaultValues: defaultCustomerAuthorizationFilters,
    });

  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  const [filters, setFilters] =
    useState<DefaultCustomerAuthorizationFiltersParams>(
      defaultCustomerAuthorizationFilters
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

  const { query, isDataEmpty, refresh } =
    useAuthorizationCustomerListQuery(filters);
  //eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const customerAuthorizationList = query.data?.response || [];

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const totalPageNumber = query.data?.totalPageNumber || 0;

  const handleOnClickCustomerRow = (customerId: number) => {
    if (!isUserAllowed(RESOURCES.CUSTOMER, PERMISSIONS.AUTHORIZE)) return;
    navigate(`/customers/authorization/${customerId}`);
  };

  const tableHeaders = useMemo(() => customerTableConfig.headers(tr), [tr]);

  const onSubmit: SubmitHandler<DefaultCustomerAuthorizationFiltersParams> = (
    data
  ) => {
    setFilters(data);
    refresh();
  };

  const handleClearFilters = () => {
    const clearFilters: DefaultCustomerAuthorizationFiltersParams = {
      ...defaultCustomerAuthorizationFilters,
      date: midasDate,
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
          <Stack customStyle={authorizationStyles.sectionFlex}>
            <Stack customStyle={authorizationStyles.searchFieldWidth}>
              <Input
                id="customerNumber"
                label={tr(authorizationI18n.searchFields.customerNumber)}
                register={register("customerNumber")}
                isFullWidth={true}
              />
            </Stack>
            <Stack customStyle={authorizationStyles.searchFieldWidth}>
              <Input
                type="date"
                id="date"
                label={tr(authorizationI18n.searchFields.date)}
                isFullWidth={true}
                register={register("date")}
                max={midasDate}
              />
            </Stack>
            <Stack customStyle={authorizationStyles.searchFieldWidth}>
              <Select
                id="customerStatusId"
                label={tr(authorizationI18n.searchFields.customerStatus)}
                name={"customerStatusId"}
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
                label={tr(authorizationI18n.searchFields.user)}
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
          <Stack gap={isDataEmpty ? "0" : "12"}>
            <RowHeader
              withBorder={false}
              pb="12"
              label={
                <Text
                  size="16"
                  weight="bold"
                  text={tr(authorizationI18n.table.customerTitle)}
                />
              }
            />

            {query.isFetching ? (
              <Loader withContainer={false} linesNo={6} />
            ) : !isDataEmpty ? (
              <>
                <Table cols={customerTableConfig.cols} headers={tableHeaders}>
                  {customerAuthorizationList?.map((customer) => (
                    <React.Fragment key={customer.idParty}>
                      <Tr
                        css={authorizationStyles.clickableRow}
                        onClick={() =>
                          handleOnClickCustomerRow(customer.idParty)
                        }
                      >
                        <Text text={customer.customerNumber} />
                        <Text
                          text={
                            customer.name +
                            " " +
                            customer.fathersName +
                            " " +
                            customer.surname
                          }
                        />
                        <Text text={formatIntlLocalDate(customer.birthdate)} />
                        <Text text={customer.birthPlace} />
                        <Text
                          text={formatIntlLocalDate(customer.lastSavedDate)}
                        />
                        <Text text={customer.customerStatus} />
                        <Text
                          customStyle={{
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                          }}
                          text={customer.address}
                        />
                        <Text
                          text={formatIntlLocalDate(customer.lastSavedDate)}
                        />
                        <Text text={customer.userChanges} />
                      </Tr>
                    </React.Fragment>
                  ))}
                </Table>
                <Stack
                  d="h"
                  customStyle={authorizationStyles.paginationButtons}
                >
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
        </form>
      </Stack>
    </>
  );
};
