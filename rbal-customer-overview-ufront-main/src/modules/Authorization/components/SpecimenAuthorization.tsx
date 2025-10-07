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
import { DefaultSpecimenAuthorizationFiltersParams } from "../types";
import { useAuthorizationSpecimenListQuery } from "~/features/customer/customerQueries";
import { StatusResponse } from "~/features/dictionaries/dictionariesQueries";
import { useNavigate } from "react-router";
import { InfoBar } from "~/components/InfoBar/InfoBar";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { getHexColor } from "~/common/utils";
import { AuthorizationContext } from "~/context/AuthorizationContext";
import { defaultSpecimenAuthorizationFilters } from "../defaultFilters";

const authorizationSpecimenTableConfig = {
  cols: ["90px", "90px", "165px", "125px", "90px", "110px", "140px", "140px"],
  headers: (tr: TrFunction) => [
    tr(authorizationI18n.table.headers.idParty),
    tr(authorizationI18n.table.headers.customerNumber),
    tr(authorizationI18n.table.headers.fullName),
    tr(authorizationI18n.table.headers.userInput),
    tr(authorizationI18n.table.headers.branchInput),
    tr(authorizationI18n.table.headers.dateInput),
    tr(authorizationI18n.table.headers.customerSegment),
    tr(authorizationI18n.table.headers.signatureStatus),
  ],
};

interface SpecimenAuthorizationProps {
  statusData: StatusResponse[];
}

export const SpecimenAuthorization = ({
  statusData,
}: SpecimenAuthorizationProps) => {
  const { tr } = useI18n();
  const navigate = useNavigate();
  const { branches, users, currentBranch, currentUser, midasDate } =
    useContext(AuthorizationContext);
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("tab", "specimens");
    navigate(`?${params.toString()}`, { replace: true });
  }, [navigate]);

  const { control, reset, register, setValue, handleSubmit } =
    useForm<DefaultSpecimenAuthorizationFiltersParams>({
      defaultValues: defaultSpecimenAuthorizationFilters,
    });

  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  const [filters, setFilters] =
    useState<DefaultSpecimenAuthorizationFiltersParams>(
      defaultSpecimenAuthorizationFilters
    );

  useEffect(() => {
    if (currentUser && currentBranch) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        dateTimeSpecimen: midasDate,
        idBranch: currentBranch?.branchId,
      }));
      setValue("dateTimeSpecimen", midasDate);
      setValue("idBranch", currentBranch?.branchId);
    }
  }, [currentUser, currentBranch, setValue, midasDate]);

  const { query, isDataEmpty, refresh } =
    useAuthorizationSpecimenListQuery(filters);
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const specimenList = query?.data?.response || [];

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const totalPageNumber = query.data?.totalPageNumber || 0;

  const handleOnClickCustomerRow = (customerId: number) => {
    navigate(`/customers/authorization/specimen/${customerId}`);
  };

  const tableHeaders = useMemo(
    () => authorizationSpecimenTableConfig.headers(tr),
    [tr]
  );

  const onSubmit: SubmitHandler<DefaultSpecimenAuthorizationFiltersParams> = (
    data
  ) => {
    setFilters(data);
    refresh();
  };

  const handleClearFilters = () => {
    const clearFilters: DefaultSpecimenAuthorizationFiltersParams = {
      ...defaultSpecimenAuthorizationFilters,
      dateTimeSpecimen: midasDate,
      idBranch: currentBranch?.branchId,
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
                id="dateTimeSpecimen"
                label={tr(authorizationI18n.searchFields.date)}
                isFullWidth={true}
                register={register("dateTimeSpecimen")}
                // max={midasDate}
              />
            </Stack>

            <Stack customStyle={authorizationStyles.searchFieldWidth}>
              <Select
                id="signatureStatusId"
                label={tr(authorizationI18n.searchFields.signatureStatus)}
                name={"signatureStatusId"}
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
                id="idUser"
                label={tr(authorizationI18n.searchFields.user)}
                name={"idUser"}
                control={control}
                data={users?.map((item) => ({
                  id: item.userId,
                  name: item.user,
                }))}
              />
            </Stack>
            <Stack customStyle={authorizationStyles.searchFieldWidth}>
              <Select
                id="idBranch"
                label={tr(authorizationI18n.searchFields.branch)}
                name={"idBranch"}
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
              variant="solid"
              icon="search"
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
                  text={tr(authorizationI18n.table.specimenTitle)}
                />
              }
            />
            {query.isFetching ? (
              <Loader withContainer={false} linesNo={6} />
            ) : !isDataEmpty ? (
              <>
                <Table
                  cols={authorizationSpecimenTableConfig.cols}
                  headers={tableHeaders}
                >
                  {specimenList?.map((listItem) => (
                    <React.Fragment key={listItem.idParty}>
                      <Tr
                        css={authorizationStyles.clickableRow}
                        onClick={() =>
                          handleOnClickCustomerRow(listItem.idParty)
                        }
                      >
                        <Text text={listItem.idParty} />
                        <Text text={listItem.customerNumber} />
                        <Text text={listItem.nameSurnameFatherName} />
                        <Text text={listItem.userInput} />
                        <Text text={listItem.branchInput} />
                        <Text text={formatIntlLocalDate(listItem.dateInput)} />
                        <Text text={listItem.customerSegment} />
                        <Text
                          text={listItem.signitureStatus}
                          customStyle={{
                            color: getHexColor(listItem.signitureStatusColor),
                          }}
                        />
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
