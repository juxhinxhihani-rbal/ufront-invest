import {
  Button,
  Card,
  Container,
  Stack,
  Text,
  tokens,
  Loader,
  Table,
  Tr,
  useToggle,
  Icon,
} from "@rbal-modern-luka/ui-library";
import { Input } from "~/components/Input/Input";
import { Select } from "~/components/Select/Select";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  formatIntlLocalDateTime,
  TrFunction,
  useI18n,
} from "@rbal-modern-luka/luka-portal-shell";
import { statementPageI18n } from "./StatementPage.i18n";
import { css, Theme } from "@emotion/react";
import { useParams } from "react-router";
import {
  branchesMapper,
  retailAccountNumberMapper,
  usersMapper,
} from "~/api/dictionaries/dictionariesMappers";
import React, { useEffect, useMemo, useState } from "react";
import { InfoBar } from "~/components/InfoBar/InfoBar";
import {
  GenerateOldStatementDto,
  GetOldStatementPdfDto,
  StatementFormFilterParams,
} from "~/api/statement/statementApi.types";
import {
  useCheckIdExpireDateQuery,
  useStatementListQuery,
} from "~/features/statement/statementQueries";
import { useStatementSearchParams } from "~/features/hooks/useStatementSearchParams";
import { downloadBase64Pdf } from "~/features/files/files";
import {
  useGenerateOldStatement,
  useGenerateOldStatementPdf,
  useGenerateStatement,
} from "~/api/statement/statementMutations";
import {
  showError,
  showMultipleError,
  showMultipleWarning,
  showSuccess,
  showWarning,
} from "~/components/Toast/ToastContainer";
import { lowerFirst } from "lodash";
import { OverlayLoader } from "../CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { BackCustomerView } from "~/components/BackCustomer/BackCustomer";
import { useStatementAuthorizedPersons } from "~/features/dictionaries/dictionariesQueries";
import { CommissionModal } from "./CommissionModal/CommissionModal";
import { FullPageFeedback } from "~/components/FullPageFeedback/FullPageFeedback";
import { Link, useSearchParams } from "react-router-dom";
import { format, isBefore, subDays, subMonths } from "date-fns";
import { useFeatureFlags } from "~/features/hooks/useFlags";

const styles = {
  filters: (t: Theme) =>
    css({
      paddingTop: tokens.scale(t, "16"),
    }),
  actions: css({
    justifyContent: "flex-end",
  }),
  field: css({
    maxWidth: "33%",
  }),
  paginationButtons: css({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "& button[disabled] svg": {
      opacity: 0.3,
    },
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "1.5rem",
  }),
};

const statementTableConfig = {
  cols: ["80px", "80px", "80px", "80px", "100px", "100px", "100px"],
  headers: (tr: TrFunction) => [
    tr(statementPageI18n.table.headers.fromDate),
    tr(statementPageI18n.table.headers.toDate),
    tr(statementPageI18n.table.headers.user),
    tr(statementPageI18n.table.headers.branchCode),
    tr(statementPageI18n.table.headers.commissionValue),
    tr(statementPageI18n.table.headers.date),
    tr(statementPageI18n.table.headers.withdrewStatement),
  ],
};

export const StatementPage = () => {
  const { tr } = useI18n();
  const { customerId = "", accountId = "" } = useParams();

  const [searchParams] = useSearchParams();
  const isOldStatement = searchParams.has("isOldStatement");

  const { isFeatureEnabled } = useFeatureFlags();

  const midasDate = sessionStorage.getItem("midasDate");

  const tableHeaders = useMemo(() => statementTableConfig.headers(tr), [tr]);

  const {
    toDate,
    branches,
    retailAccountNumbers,
    isLoadingRetailAccountNumbers,
    users,
    calculateFromDate,
  } = useStatementSearchParams(
    customerId,
    midasDate ?? new Date().toISOString()
  );

  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const { data: validationDataId } = useCheckIdExpireDateQuery(
    Number(customerId)
  );

  const authorizeCommissionModal = useToggle(false);

  const defaultStatementFilters: StatementFormFilterParams = {
    retailAccountNumberId: Number(accountId),
    fromDate: "",
    initialFromDate: "",
    toDate: isOldStatement
      ? format(subMonths(toDate, 1), "yyyy-MM-dd")
      : toDate,
    authorizedPersonId: undefined,
    branchId: undefined,
    userId: undefined,
    pageNumber: 1,
  };

  const [filters, setFilters] = useState<StatementFormFilterParams>(
    defaultStatementFilters
  );

  const [shouldSendEmail, setShouldSendEmail] = useState<boolean>(false);

  const { query: statementListQuery, isDataEmpty } = useStatementListQuery(
    filters,
    isOldStatement
  );

  const { mutate: generateStatement, isLoading: isGenerating } =
    useGenerateStatement();

  const { mutate: generateOldStatement, isLoading: isGeneratingOldStatement } =
    useGenerateOldStatement();

  const {
    mutate: generateOldStatementPdf,
    isLoading: isGeneratingOldStatementPdf,
  } = useGenerateOldStatementPdf();

  const statementList = statementListQuery.data?.response ?? [];
  const totalPageNumber = statementListQuery.data?.totalPagesNumber ?? 0;

  const { control, register, handleSubmit, setValue, watch } =
    useForm<StatementFormFilterParams>({
      defaultValues: defaultStatementFilters,
    });

  const currentFormValues = watch();

  const handleAccountSelectionChange = (accountId: number) => {
    setValue("fromDate", calculateFromDate(Number(accountId), isOldStatement));
    setValue(
      "initialFromDate",
      calculateFromDate(Number(accountId), isOldStatement)
    );
  };

  const authorizedPersonsQuery = useStatementAuthorizedPersons(
    Number(customerId),
    watch("retailAccountNumberId")
  );

  const onSubmit: SubmitHandler<StatementFormFilterParams> = (data) => {
    setFilters(data);
  };

  const handleNextPage = () => {
    const newPage = currentPageNumber + 1;
    setCurrentPageNumber(newPage);
    setFilters((prev) => ({ ...prev, pageNumber: newPage }));
  };

  const handlePreviousPage = () => {
    if (currentPageNumber > 1) {
      const newPage = currentPageNumber - 1;
      setCurrentPageNumber(newPage);
      setFilters((prev) => ({ ...prev, pageNumber: newPage }));
    }
  };
  const handleRowClick = (idStatement: number, idProduct: number) => {
    processOldStatementPdf(idStatement, idProduct);
  };
  useEffect(() => {
    if (!isLoadingRetailAccountNumbers) {
      setValue(
        "fromDate",
        calculateFromDate(Number(accountId), isOldStatement)
      );
      setValue(
        "initialFromDate",
        calculateFromDate(Number(accountId), isOldStatement)
      );
      setFilters(currentFormValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isLoadingRetailAccountNumbers,
    accountId,
    isOldStatement,
    calculateFromDate,
    setValue,
  ]);

  const processOldStatementGeneration = (
    currentFilters: StatementFormFilterParams
  ) => {
    const requestBody: GenerateOldStatementDto = {
      customerId: Number(customerId),
      productId: currentFilters.retailAccountNumberId,
      startDate: currentFilters.fromDate,
      endDate: currentFilters.toDate,
      authorizedPersonId: currentFilters.authorizedPersonId
        ? Number(currentFilters.authorizedPersonId)
        : 0,
    };
    generateOldStatement(requestBody, {
      onSuccess: (response) => {
        setFilters(currentFilters);
        const hasMessages = response.message && response.message.length !== 0;
        const errorMessages = hasMessages
          ? response.message.map((message) => {
              const messageKey = lowerFirst(
                message.toString()
              ) as keyof typeof statementPageI18n.responseMessages;
              return tr(statementPageI18n.responseMessages[messageKey]);
            })
          : [];

        if (response.pdfBytes) {
          if (hasMessages && response.message.length === 1) {
            const successMessage = tr(
              statementPageI18n.responseMessages[
                lowerFirst(
                  response.message[0].toString()
                ) as keyof typeof statementPageI18n.responseMessages
              ]
            );
            showSuccess(successMessage);
          } else if (hasMessages && errorMessages.length > 1) {
            const firstMessage = errorMessages[0];
            const manualPaymentMessage = tr(
              statementPageI18n.responseMessages.manualPayment
            );
            if (
              response.message.includes("InsufficientFunds") ||
              response.message.includes("AccountIsClosed")
            ) {
              showMultipleWarning([firstMessage, manualPaymentMessage]);
            } else {
              showMultipleWarning(errorMessages);
            }
          } else {
            showMultipleWarning(errorMessages);
          }
          downloadBase64Pdf(response.pdfBytes, "Old Statement");
        } else if (hasMessages) {
          showMultipleError(errorMessages);
        }
      },
      onError: () => {
        showError(tr(statementPageI18n.failedGenerateOldStatement));
      },
    });
  };

  const processOldStatementPdf = (idStatement: number, idProduct: number) => {
    const requestBody: GetOldStatementPdfDto = {
      idStatement,
      idProduct,
    };
    generateOldStatementPdf(requestBody, {
      onSuccess: (response) => {
        const messageCode = tr(
          statementPageI18n.responseMessages[
            lowerFirst(
              response.responseMessage.toString()
            ) as keyof typeof statementPageI18n.responseMessages
          ]
        );
        if (response.documentByte) {
          showSuccess(messageCode);
          downloadBase64Pdf(response.documentByte, "Old Statement");
        } else {
          showWarning(messageCode);
        }
      },
      onError: () => {
        showError(tr(statementPageI18n.failedGenerateOldStatementPdf));
      },
    });
  };

  const handleGenerateStatement = (sendEmail: boolean) => {
    if (
      isBefore(
        new Date(currentFormValues.toDate),
        new Date(currentFormValues.fromDate)
      )
    ) {
      showWarning(tr(statementPageI18n.responseMessages.higherStartDate));
    } else {
      authorizeCommissionModal.toggle();
      setShouldSendEmail(sendEmail);
    }
  };

  const processStatementGeneration = (
    currentFilters: StatementFormFilterParams,
    sendEmail: boolean
  ) => {
    generateStatement(
      { filters: currentFilters, isSendEmail: sendEmail },
      {
        onSuccess: (response) => {
          setFilters(currentFilters);
          const messageCode = tr(
            statementPageI18n.responseMessages[
              lowerFirst(
                response.responseMessage.toString()
              ) as keyof typeof statementPageI18n.responseMessages
            ]
          );
          if (sendEmail) {
            response.isSent
              ? showSuccess(messageCode)
              : showWarning(messageCode);
          } else {
            response.documentByte
              ? downloadBase64Pdf(response.documentByte, "Statement")
              : showWarning(messageCode);
          }
        },
        onError: () => {
          showError(tr(statementPageI18n.failedGenerateStatement));
        },
      }
    );
  };

  const getMaxDate = (
    isOldStatement: boolean,
    midasDate: string | null,
    subtractFn: (date: Date) => Date
  ): string => {
    if (isOldStatement) {
      return midasDate
        ? format(subtractFn(new Date(midasDate)), "yyyy-MM-dd")
        : new Date().toISOString();
    } else {
      return midasDate
        ? format(new Date(midasDate), "yyyy-MM-dd")
        : new Date().toISOString();
    }
  };

  if (validationDataId && validationDataId.statuses.length !== 0) {
    const errorMessages = validationDataId.statuses.map((status) => {
      const statusKey = lowerFirst(
        status.toString()
      ) as keyof typeof statementPageI18n.validationResponseStatus;
      return tr(statementPageI18n.validationResponseStatus[statusKey]);
    });
    return (
      <FullPageFeedback
        title={tr(statementPageI18n.statementErrorMessages.errorTitle)}
        text={errorMessages.join(", ")}
        icon={<Icon type="retry-with-errors" size="56" />}
        cta={
          <Button
            css={{ textDecoration: "none" }}
            as={Link}
            to={`/customers/${customerId}`}
            colorScheme="yellow"
            text={tr(statementPageI18n.statementErrorMessages.goBackButton)}
          />
        }
      />
    );
  }

  if (
    (!isFeatureEnabled("statement") && !isOldStatement) ||
    (!isFeatureEnabled("old_statement") && isOldStatement)
  ) {
    return (
      <FullPageFeedback
        title={tr(statementPageI18n.statementErrorMessages.errorTitle)}
        text={
          !isFeatureEnabled("old_statement") && isOldStatement
            ? tr(statementPageI18n.cantAccessOldStatementFeature)
            : tr(statementPageI18n.cantAccessStatementFeature)
        }
        icon={<Icon type="retry-with-errors" size="56" />}
        cta={
          <Button
            css={{ textDecoration: "none" }}
            as={Link}
            to={`/customers/${customerId}`}
            colorScheme="yellow"
            text={tr(statementPageI18n.statementErrorMessages.goBackButton)}
          />
        }
      />
    );
  }

  if (isLoadingRetailAccountNumbers) {
    return (
      <div
        css={css({
          margin: "10% 25%",
        })}
      >
        <Loader withContainer={false} />
      </div>
    );
  }

  if (
    accountId &&
    retailAccountNumbers &&
    !retailAccountNumbers.some(
      (account) => account.productId.toString() === accountId
    )
  ) {
    return (
      <FullPageFeedback
        title={tr(statementPageI18n.statementErrorMessages.errorTitle)}
        text={tr(statementPageI18n.cantAccessStatement)}
        icon={<Icon type="retry-with-errors" size="56" />}
        cta={
          <Button
            css={{ textDecoration: "none" }}
            as={Link}
            to={`/customers/${customerId}`}
            colorScheme="yellow"
            text={tr(statementPageI18n.statementErrorMessages.goBackButton)}
          />
        }
      />
    );
  }

  return (
    <>
      {(isGenerating ||
        isGeneratingOldStatement ||
        isGeneratingOldStatementPdf) && (
        <OverlayLoader
          label={tr(statementPageI18n.generateStatementPleaseWait)}
          isCenteredIcon
        />
      )}
      <CommissionModal
        isOpen={authorizeCommissionModal.isOn}
        onCancel={authorizeCommissionModal.off}
        onConfirm={() => {
          authorizeCommissionModal.off();
          isOldStatement
            ? processOldStatementGeneration(currentFormValues)
            : processStatementGeneration(currentFormValues, shouldSendEmail);
        }}
        currentFilters={currentFormValues}
        isOldStatement={isOldStatement}
      />
      <Container as="main">
        <Stack>
          <BackCustomerView to={`/customers/${customerId}`} />
          <Card>
            <Text
              text={isOldStatement ? "Old Statement" : "Statement"}
              size="24"
              lineHeight="32"
              weight="bold"
            />
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack gap="24">
                <Stack customStyle={styles.filters} gap="16">
                  <Stack d="h">
                    <Select
                      id="retailAccountNumber"
                      label={tr(statementPageI18n.retailAccountNumber)}
                      name={"retailAccountNumberId"}
                      control={control}
                      data={retailAccountNumberMapper(retailAccountNumbers)}
                      inputStyle={styles.field}
                      customOnChange={(option) => {
                        handleAccountSelectionChange(Number(option?.id));
                      }}
                    />
                    <Input
                      type="date"
                      id="fromDate"
                      label={tr(statementPageI18n.fromDate)}
                      register={register("fromDate")}
                      inputStyle={styles.field}
                      min={watch("initialFromDate")}
                      max={getMaxDate(isOldStatement, midasDate, (date) =>
                        subDays(date, 1)
                      )}
                    />

                    <Input
                      type="date"
                      id="toDate"
                      label={tr(statementPageI18n.toDate)}
                      register={register("toDate")}
                      inputStyle={styles.field}
                      min={watch("initialFromDate")}
                      max={getMaxDate(isOldStatement, midasDate, (date) =>
                        subMonths(date, 1)
                      )}
                    />
                  </Stack>
                  <Stack d="h">
                    <Select
                      id="authorizedPersonId"
                      label={tr(statementPageI18n.authorizedPerson)}
                      name={"authorizedPersonId"}
                      control={control}
                      data={authorizedPersonsQuery.data}
                      inputStyle={styles.field}
                    />
                    <Select
                      id="branchId"
                      label={tr(statementPageI18n.branch)}
                      name={"branchId"}
                      control={control}
                      data={branchesMapper(branches)}
                      inputStyle={styles.field}
                    />
                    <Select
                      id="userId"
                      label={tr(statementPageI18n.user)}
                      name={"userId"}
                      control={control}
                      data={usersMapper(users)}
                      inputStyle={styles.field}
                    />
                  </Stack>
                  <Stack d="h" customStyle={styles.actions}>
                    <Button
                      type="submit"
                      text={tr(statementPageI18n.search)}
                      colorScheme="yellow"
                      icon="search"
                      variant="solid"
                    />
                    <Button
                      type="button"
                      text={
                        isOldStatement
                          ? tr(statementPageI18n.generateOldStatement)
                          : tr(statementPageI18n.generateStatement)
                      }
                      colorScheme="yellow"
                      icon="pdf"
                      variant="outline"
                      onClick={() => handleGenerateStatement(false)}
                    />
                    {!isOldStatement && (
                      <Button
                        type="button"
                        text={tr(statementPageI18n.generateAndSendStatement)}
                        colorScheme="yellow"
                        icon="doc-send"
                        variant="outline"
                        onClick={() => handleGenerateStatement(true)}
                      />
                    )}
                  </Stack>
                </Stack>
                <Stack>
                  {statementListQuery.isFetching ? (
                    <Loader withContainer={false} linesNo={6} />
                  ) : !isDataEmpty ? (
                    <>
                      <Table
                        cols={statementTableConfig.cols}
                        headers={tableHeaders}
                      >
                        {statementList?.map((statement) => (
                          <React.Fragment key={statement.statementId}>
                            <Tr
                              onClick={() =>
                                handleRowClick(
                                  statement.statementId,
                                  statement.productId
                                )
                              }
                            >
                              <Text
                                text={formatIntlLocalDateTime(
                                  statement.startDate
                                )}
                              />
                              <Text
                                text={formatIntlLocalDateTime(
                                  statement.endDate
                                )}
                              />
                              <Text text={statement.user} />
                              <Text text={statement.branchCode} />
                              <Text text={statement.commissionValue} />
                              <Text
                                text={formatIntlLocalDateTime(
                                  statement.statementDatetime
                                )}
                              />
                              <Text text={statement.productId} />
                            </Tr>
                          </React.Fragment>
                        ))}
                      </Table>
                      <Stack d="h" customStyle={styles.paginationButtons}>
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
                    <InfoBar text={tr(statementPageI18n.table.noData)} />
                  )}
                </Stack>
              </Stack>
            </form>
          </Card>
        </Stack>
      </Container>
    </>
  );
};
