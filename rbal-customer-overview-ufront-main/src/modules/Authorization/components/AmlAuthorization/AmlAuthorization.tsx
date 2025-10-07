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
import { AuthorizationContext } from "~/context/AuthorizationContext";
import { useAmlAuthorizationListQuery } from "~/features/customer/customerQueries";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { authorizationI18n } from "../../Authorization.i18n";
import { authorizationStyles } from "../../Authorization.styles";
import { DefaultAmlAuthorizationFiltersParams } from "../../types";
import { amlAuthorizationi18n } from "./AmlAuthorization.i18n";
import { amlStyles } from "./AmlAuthorization.styles";
import { InfoBar } from "~/components/InfoBar/InfoBar";
import { getHexColor } from "~/common/utils";
import { defaultAmlAuthorizationFilters } from "../../defaultFilters";

const amlAuthorizationTableConfig = {
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
    tr(amlAuthorizationi18n.table.headers.customerStatus),
    tr(amlAuthorizationi18n.table.headers.customerNumber),
    tr(amlAuthorizationi18n.table.headers.customerFullName),
    tr(amlAuthorizationi18n.table.headers.personalDocNumber),
    tr(amlAuthorizationi18n.table.headers.customerSegment),
    tr(amlAuthorizationi18n.table.headers.risk),
    tr(amlAuthorizationi18n.table.headers.openDate),
    tr(amlAuthorizationi18n.table.headers.userInput),
    tr(amlAuthorizationi18n.table.headers.userAssigned),
  ],
};

export const AmlAuthorization = () => {
  const { tr } = useI18n();
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("tab", "aml");
    navigate(`?${params.toString()}`, { replace: true });
  }, [navigate]);

  const { branches, users, currentBranch, currentUser, midasDate } =
    useContext(AuthorizationContext);

  const { control, reset, register, setValue, handleSubmit } =
    useForm<DefaultAmlAuthorizationFiltersParams>({
      defaultValues: defaultAmlAuthorizationFilters,
    });

  const [filters, setFilters] = useState<DefaultAmlAuthorizationFiltersParams>(
    defaultAmlAuthorizationFilters
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
    () => amlAuthorizationTableConfig.headers(tr),
    [tr]
  );

  const handleOnClickAccountRow = (accountId: number) => {
    navigate(`aml/${accountId}`);
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

  const { query, isDataEmpty, refresh } = useAmlAuthorizationListQuery(filters);
  //eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const amlAuthorizationList = query.data?.response ?? [];
  const totalPageNumber = query.data?.totalPagesNumber ?? 0;

  const onSubmit: SubmitHandler<DefaultAmlAuthorizationFiltersParams> = (
    data
  ) => {
    setFilters(data);
    refresh();
  };

  const handleClearFilters = () => {
    const clearFilters: DefaultAmlAuthorizationFiltersParams = {
      ...defaultAmlAuthorizationFilters,
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
              label={tr(amlAuthorizationi18n.searchFields.customerNumber)}
              isFullWidth={true}
              register={register("customerNumber")}
            />
          </Stack>
          <Stack customStyle={authorizationStyles.searchFieldWidth}>
            <Select
              id="userId"
              label={tr(amlAuthorizationi18n.searchFields.user)}
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
              label={tr(amlAuthorizationi18n.searchFields.branch)}
              name={"branchId"}
              control={control}
              data={branches?.map((item) => ({
                id: item.branchId,
                name: item.branchCode + " " + item.branchName,
              }))}
              selectedFontSize={"13px"}
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
        customStyle={amlStyles.tableContainer}
        gap={isDataEmpty ? "0" : "12"}
      >
        <RowHeader
          withBorder={false}
          pb="12"
          label={
            <Text
              size="16"
              weight="bold"
              text={tr(amlAuthorizationi18n.table.title)}
            />
          }
        />

        {query.isFetching ? (
          <Loader withContainer={false} linesNo={5} />
        ) : !isDataEmpty ? (
          <>
            <Stack customStyle={amlStyles.table}>
              <Table
                cols={amlAuthorizationTableConfig.cols}
                headers={tableHeaders}
              >
                {amlAuthorizationList?.map((aml) => (
                  <React.Fragment key={aml.idParty}>
                    <Tr
                      css={authorizationStyles.clickableRow}
                      onClick={() => handleOnClickAccountRow(aml.idParty)}
                    >
                      <Text
                        text={aml.customerStatus}
                        customStyle={{
                          color: getHexColor(aml.bgColor),
                          wordBreak: "break-word",
                          whiteSpace: "break-spaces",
                        }}
                      />
                      <Text text={aml.customerNumber} />
                      <Text text={aml.name} customStyle={amlStyles.wordBreak} />
                      <Text text={aml.personalDocNumber} />
                      <Text
                        text={aml.customerSegment}
                        customStyle={amlStyles.wordBreak}
                      />
                      <Text text={aml.risk} />
                      <Text text={formatIntlLocalDate(aml.openDate)} />
                      <Text
                        text={aml.userInput}
                        customStyle={amlStyles.wordBreak}
                      />
                      <Text
                        text={aml.userAssigned}
                        customStyle={amlStyles.wordBreak}
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
