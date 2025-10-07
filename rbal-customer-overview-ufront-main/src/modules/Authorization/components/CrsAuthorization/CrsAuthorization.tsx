import {
  TrFunction,
  useI18n,
  formatIntlLocalDate,
} from "@rbal-modern-luka/luka-portal-shell";
import {
  Text,
  Stack,
  Button,
  Table,
  Tr,
  Loader,
} from "@rbal-modern-luka/ui-library";
import { Select } from "~/components/Select/Select";
import { Input } from "~/components/Input/Input";
import React, { useEffect, useContext, useState, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import { getHexColor } from "~/common/utils";
import { InfoBar } from "~/components/InfoBar/InfoBar";
import { AuthorizationContext } from "~/context/AuthorizationContext";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { authorizationI18n } from "../../Authorization.i18n";
import { authorizationStyles } from "../../Authorization.styles";
import { defaultCrsAuthorizationFilters } from "../../defaultFilters";
import { DefaultCrsAuthorizationFiltersParams } from "../../types";
import { crsAuthorizationi18n } from "./CrsAuthorization.i18n";
import { crsStyles } from "./CrsAuthorization.styles";
import { useCrsAuthorizationListQuery } from "~/features/customer/customerQueries";

const crsAuthorizationTableConfig = {
  cols: [
    "200px",
    "130px",
    "220px",
    "140px",
    "220px",
    "100px",
    "140px",
    "200px",
    "200px",
  ],
  headers: (tr: TrFunction) => [
    tr(crsAuthorizationi18n.table.headers.customerStatus),
    tr(crsAuthorizationi18n.table.headers.customerNumber),
    tr(crsAuthorizationi18n.table.headers.customerFullName),
    tr(crsAuthorizationi18n.table.headers.personalDocNumber),
    tr(crsAuthorizationi18n.table.headers.customerSegment),
    tr(crsAuthorizationi18n.table.headers.crsStatus),
    tr(crsAuthorizationi18n.table.headers.openDate),
    tr(crsAuthorizationi18n.table.headers.userInput),
    tr(crsAuthorizationi18n.table.headers.userAssigned),
  ],
};

export const CrsAuthorization = () => {
  const { tr } = useI18n();
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("tab", "crs");
    navigate(`?${params.toString()}`, { replace: true });
  }, [navigate]);

  const { branches, users, currentBranch, currentUser, midasDate } =
    useContext(AuthorizationContext);

  const { control, reset, register, setValue, handleSubmit } =
    useForm<DefaultCrsAuthorizationFiltersParams>({
      defaultValues: defaultCrsAuthorizationFilters,
    });

  const [filters, setFilters] = useState<DefaultCrsAuthorizationFiltersParams>(
    defaultCrsAuthorizationFilters
  );

  useEffect(() => {
    if (currentUser && currentBranch) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        branchId: currentBranch?.branchId,
      }));
      setValue("branchId", currentBranch?.branchId);
    }
  }, [currentUser, currentBranch, setValue, midasDate]);

  const tableHeaders = useMemo(
    () => crsAuthorizationTableConfig.headers(tr),
    [tr]
  );

  const handleOnClickAccountRow = (accountId: number) => {
    navigate(`crs/${accountId}`);
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

  const { query, isDataEmpty, refresh } = useCrsAuthorizationListQuery(filters);
  //eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const crsAuthorizationList = query.data?.response ?? [];
  const totalPageNumber = query.data?.totalPagesNumber ?? 0;

  const onSubmit: SubmitHandler<DefaultCrsAuthorizationFiltersParams> = (
    data
  ) => {
    setFilters(data);
    refresh();
  };

  const handleClearFilters = () => {
    const clearFilters: DefaultCrsAuthorizationFiltersParams = {
      ...defaultCrsAuthorizationFilters,
      branchId: currentBranch?.branchId,
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
              id="customerNumber"
              label={tr(crsAuthorizationi18n.searchFields.customerNumber)}
              isFullWidth={true}
              register={register("customerNumber")}
            />
          </Stack>
          <Stack customStyle={authorizationStyles.searchFieldWidth}>
            <Select
              id="userId"
              label={tr(crsAuthorizationi18n.searchFields.user)}
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
              label={tr(crsAuthorizationi18n.searchFields.branch)}
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
          <Stack customStyle={authorizationStyles.buttons}>
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
        customStyle={crsStyles.tableContainer}
        gap={isDataEmpty ? "0" : "12"}
      >
        <RowHeader
          withBorder={false}
          pb="12"
          label={
            <Text
              size="16"
              weight="bold"
              text={tr(crsAuthorizationi18n.table.title)}
            />
          }
        />

        {query.isFetching ? (
          <Loader withContainer={false} linesNo={5} />
        ) : !isDataEmpty ? (
          <>
            <Stack customStyle={crsStyles.table}>
              <Table
                cols={crsAuthorizationTableConfig.cols}
                headers={tableHeaders}
              >
                {crsAuthorizationList?.map((crs) => (
                  <React.Fragment key={crs.idParty}>
                    <Tr
                      css={authorizationStyles.clickableRow}
                      onClick={() => handleOnClickAccountRow(crs.idParty)}
                    >
                      <Text
                        text={crs.customerStatus}
                        customStyle={{
                          color: getHexColor(crs.bgColor),
                          wordBreak: "break-word",
                          whiteSpace: "break-spaces",
                        }}
                      />
                      <Text text={crs.customerNumber} />
                      <Text text={crs.name} customStyle={crsStyles.wordBreak} />
                      <Text text={crs.personalDocNumber} />
                      <Text
                        text={crs.customerSegment}
                        customStyle={crsStyles.wordBreak}
                      />
                      <Text text={crs.crsStatus} />
                      <Text text={formatIntlLocalDate(crs.openDate)} />
                      <Text
                        text={crs.userInput}
                        customStyle={crsStyles.wordBreak}
                      />
                      <Text
                        text={crs.userAssigned}
                        customStyle={crsStyles.wordBreak}
                      />
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
                disabled={currentPageNumber >= totalPageNumber}
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
