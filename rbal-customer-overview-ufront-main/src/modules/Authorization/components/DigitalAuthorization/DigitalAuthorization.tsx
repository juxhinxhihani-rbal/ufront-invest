import {
  Button,
  Stack,
  Text,
  Table,
  Tr,
  Loader,
} from "@rbal-modern-luka/ui-library";
import { Select } from "~/components/Select/Select";
import { Input } from "~/components/Input/Input";
import {
  formatIntlLocalDate,
  TrFunction,
  useI18n,
} from "@rbal-modern-luka/luka-portal-shell";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { AuthorizationContext } from "~/context/AuthorizationContext";
import { digitalAuthorizationI18n } from "./DigitalAuthorization.i18n";
import { authorizationStyles } from "../../Authorization.styles";
import { styles } from "./DigitalAuthorization.styles";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { authorizationI18n } from "../../Authorization.i18n";
import { InfoBar } from "~/components/InfoBar/InfoBar";
import { useDigitalAuthorizationListQuery } from "~/features/customer/customerQueries";
import { DefaultDigitalAuthorizationFiltersParams } from "../../types";
import { defaultDigitalAuthorizationFilters } from "../../defaultFilters";
import { booleansI18n } from "~/features/i18n";

const digitalTableConfig = {
  cols: [
    "120px",
    "140px",
    "80px",
    "140px",
    "150px",
    "150px",
    "150px",
    "130px",
    "110px",
    "200px",
    "210px",
    "140px",
    "120px",
    "120px",
    "110px",
    "110px",
  ],
  headers: (tr: TrFunction) => [
    tr(digitalAuthorizationI18n.table.headers.createdDate),
    tr(digitalAuthorizationI18n.table.headers.updatedDate),
    tr(digitalAuthorizationI18n.table.headers.active),
    tr(digitalAuthorizationI18n.table.headers.digitalBankingId),
    tr(digitalAuthorizationI18n.table.headers.name),
    tr(digitalAuthorizationI18n.table.headers.fathersName),
    tr(digitalAuthorizationI18n.table.headers.surname),
    tr(digitalAuthorizationI18n.table.headers.customerNumber),
    tr(digitalAuthorizationI18n.table.headers.mobile),
    tr(digitalAuthorizationI18n.table.headers.personalDocumentNumber),
    tr(digitalAuthorizationI18n.table.headers.email),
    tr(digitalAuthorizationI18n.table.headers.customerSegmentId),
    tr(digitalAuthorizationI18n.table.headers.branchCreated),
    tr(digitalAuthorizationI18n.table.headers.branchAmended),
    tr(digitalAuthorizationI18n.table.headers.userCreated),
    tr(digitalAuthorizationI18n.table.headers.userSaved),
  ],
};

export const DigitalAuthorization = () => {
  const { tr } = useI18n();
  const navigate = useNavigate();
  const { branches, users, currentBranch, currentUser, midasDate } =
    useContext(AuthorizationContext);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("tab", "digitalBanking");
    navigate(`?${params.toString()}`, { replace: true });
  }, [navigate]);

  const { control, reset, register, handleSubmit, setValue } =
    useForm<DefaultDigitalAuthorizationFiltersParams>({
      defaultValues: defaultDigitalAuthorizationFilters,
    });

  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  const [filters, setFilters] =
    useState<DefaultDigitalAuthorizationFiltersParams>(
      defaultDigitalAuthorizationFilters
    );

  useEffect(() => {
    if (currentUser && currentBranch) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        dateTimeDigital: midasDate,
        idBranch: currentBranch?.branchId,
      }));
      setValue("dateTimeDigital", midasDate);
      setValue("idBranch", currentBranch?.branchId);
    }
  }, [currentUser, currentBranch, setValue, midasDate]);

  const { query, isDataEmpty, refresh } =
    useDigitalAuthorizationListQuery(filters);
  //eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const digitalAuthorizationList = query.data?.response ?? [];

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const totalPageNumber = query.data?.totalPageNumber ?? 0;

  const handleOnClickDigitalRow = (
    customerId: number,
    applicationId: number
  ) => {
    navigate(
      `/customers/authorization/digital-banking/${customerId}/${applicationId}`
    );
  };

  const tableHeaders = useMemo(() => digitalTableConfig.headers(tr), [tr]);

  const onSubmit: SubmitHandler<DefaultDigitalAuthorizationFiltersParams> = (
    data
  ) => {
    setFilters(data);
    refresh();
  };

  const handleClearFilters = () => {
    const clearFilters: DefaultDigitalAuthorizationFiltersParams = {
      ...defaultDigitalAuthorizationFilters,
      dateTimeDigital: midasDate,
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
            <Stack customStyle={styles.searchFieldWidth}>
              <Input
                type="date"
                id="dateTimeDigital"
                label={tr(digitalAuthorizationI18n.searchFields.date)}
                isFullWidth={true}
                register={register("dateTimeDigital")}
              />
            </Stack>
            <Stack customStyle={styles.searchFieldWidth}>
              <Input
                id="customerNumber"
                label={tr(digitalAuthorizationI18n.searchFields.customerNumber)}
                register={register("customerNumber")}
                isFullWidth={true}
              />
            </Stack>
            <Stack customStyle={styles.searchFieldWidth}>
              <Select
                id="idUser"
                label={tr(digitalAuthorizationI18n.searchFields.user)}
                name={"idUser"}
                control={control}
                data={users?.map((item) => ({
                  id: item.userId,
                  name: item.user,
                }))}
              />
            </Stack>
            <Stack customStyle={styles.searchFieldWidth}>
              <Select
                id="idBranch"
                label={tr(digitalAuthorizationI18n.searchFields.branch)}
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
        <Stack
          gap={digitalAuthorizationList ? "0" : "12"}
          customStyle={styles.tableContainer}
        >
          <RowHeader
            withBorder={false}
            pb="12"
            label={
              <Text
                size="16"
                weight="bold"
                text={tr(authorizationI18n.table.digitalTitle)}
              />
            }
          />

          {query.isFetching ? (
            <Loader withContainer={false} linesNo={5} />
          ) : !isDataEmpty ? (
            <>
              <Stack customStyle={styles.table}>
                <Table cols={digitalTableConfig.cols} headers={tableHeaders}>
                  {digitalAuthorizationList?.map((digitalDetails) => (
                    <React.Fragment key={digitalDetails.digitalBankingId}>
                      <Tr
                        css={authorizationStyles.clickableRow}
                        onClick={() =>
                          handleOnClickDigitalRow(
                            digitalDetails.idParty,
                            digitalDetails.idApplication
                          )
                        }
                      >
                        <Text
                          text={formatIntlLocalDate(
                            digitalDetails.dateTimeCreated
                          )}
                        />
                        <Text
                          text={formatIntlLocalDate(
                            digitalDetails.dateTimeUpdated
                          )}
                        />
                        <Text
                          text={
                            digitalDetails.isActive
                              ? tr(booleansI18n.yes)
                              : tr(booleansI18n.no)
                          }
                        />
                        <Text text={digitalDetails.digitalBankingId} />
                        <Text text={digitalDetails.name} />
                        <Text text={digitalDetails.fathersName} />
                        <Text text={digitalDetails.surname} />
                        <Text text={digitalDetails.customerNumber} />
                        <Text text={digitalDetails.mobile} />
                        <Text text={digitalDetails.personalDocNumber} />
                        <Text text={digitalDetails.email} />
                        <Text text={digitalDetails.customerSegment} />
                        <Text text={digitalDetails.branchCreated} />
                        <Text text={digitalDetails.branchAmended} />
                        <Text text={digitalDetails.userCreated} />
                        <Text text={digitalDetails.userSaved} />
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
