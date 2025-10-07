import { Button, Stack, Text, Table, Tr } from "@rbal-modern-luka/ui-library";
import {
  formatIntlLocalDate,
  formatIntlLocalDateTime,
  TrFunction,
  useI18n,
} from "@rbal-modern-luka/luka-portal-shell";
import React, { useMemo, useState } from "react";
import { requestStatusTableI18n } from "./RequestStatusTable.i18n";
import { styles } from "./RequestStatusTable.styles";
import { RequestsStatusListResponse } from "~/api/manageAccounts/manageAccountsApi.types";
import { booleansI18n } from "~/features/i18n";

const blockRequestsStatusTableConfig = {
  cols: [
    "100px",
    "120px",
    "80px",
    "100px",
    "160px",
    "120px",
    "150px",
    "160px",
    "160px",
    "120px",
    "120px",
    "150px",
    "140px",
    "140px",
    "180px",
    "180px",
  ],
  headers: (tr: TrFunction) => [
    tr(requestStatusTableI18n.customerNumber),
    tr(requestStatusTableI18n.retailAccountNumber),
    tr(requestStatusTableI18n.currency),
    tr(requestStatusTableI18n.accountCode),
    tr(requestStatusTableI18n.blockType),
    tr(requestStatusTableI18n.blockAuthority),
    tr(requestStatusTableI18n.blockingReason),
    tr(requestStatusTableI18n.blockStartDate),
    tr(requestStatusTableI18n.blockEndDate),
    tr(requestStatusTableI18n.cardUnitNotification),
    tr(requestStatusTableI18n.amlUnitNotification),
    tr(requestStatusTableI18n.executionOrder),
    tr(requestStatusTableI18n.requestStatus),
    tr(requestStatusTableI18n.userRequested),
    tr(requestStatusTableI18n.dateTimeInserted),
    tr(requestStatusTableI18n.dateTimeBranchAuthorized),
  ],
};

interface RequestStatusTableProps {
  data: RequestsStatusListResponse;
  onPageNumberChange: (newPageNumber: number) => void;
}

export const BlockRequestStatusTable = ({
  data,
  onPageNumberChange,
}: RequestStatusTableProps) => {
  const { tr } = useI18n();

  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  const tableHeaders = useMemo(
    () => blockRequestsStatusTableConfig.headers(tr),
    [tr]
  );

  const totalPageNumber = data.totalPageNumber ?? 0;

  const handleNextPage = () => {
    const newPage = currentPageNumber + 1;
    setCurrentPageNumber(newPage);
    onPageNumberChange(newPage);
  };

  const handlePreviousPage = () => {
    if (currentPageNumber > 1) {
      const newPage = currentPageNumber - 1;
      setCurrentPageNumber(newPage);
      onPageNumberChange(newPage);
    }
  };

  return (
    <>
      <Stack customStyle={styles.table}>
        <Table
          cols={blockRequestsStatusTableConfig.cols}
          headers={tableHeaders}
        >
          {data.response?.map((request) => (
            <React.Fragment key={request.idRequest}>
              <Tr>
                <Text text={request.customerNumber} />
                <Text text={request.retailAccountNumber} />
                <Text text={request.currencyCode} />
                <Text text={request.accountCode} />
                <Text text={request.blockType} />
                <Text text={request.blockAuthority} />
                <Text text={request.blockingReason} />
                <Text text={formatIntlLocalDate(request.blockStartDate)} />
                <Text text={formatIntlLocalDate(request.blockEndDate)} />
                <Text
                  text={
                    request.shouldNotifyCardUnit
                      ? tr(booleansI18n.yes)
                      : tr(booleansI18n.no)
                  }
                />
                <Text
                  text={
                    request.shouldNotifyAmlUnit
                      ? tr(booleansI18n.yes)
                      : tr(booleansI18n.no)
                  }
                />
                <Text text={request.executionOrder} />
                <Text text={request.requestStatus} />
                <Text text={request.userRequested} />
                <Text
                  text={formatIntlLocalDateTime(request.dateTimeInserted)}
                />
                <Text
                  text={formatIntlLocalDateTime(
                    request.dateTimeBranchAuthorized
                  )}
                />
              </Tr>
            </React.Fragment>
          ))}
        </Table>
      </Stack>
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
  );
};
