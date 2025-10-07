import { Button, Stack, Text, Table, Tr } from "@rbal-modern-luka/ui-library";
import {
  formatIntlLocalDateTime,
  TrFunction,
  useI18n,
} from "@rbal-modern-luka/luka-portal-shell";
import React, { useMemo, useState } from "react";
import { heldRequestStatusTableI18n } from "./HeldRequestStatusTable.i18n";
import { styles } from "./RequestStatusTable.styles";
import { HeldRequestStatusResponse } from "~/api/manageAccounts/manageAccountsApi.types";
import { booleansI18n } from "~/features/i18n";

const heldRequestsStatusTableConfig = {
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
    "140px",
    "180px",
    "160px",
    "120px",
    "120px",
    "120px",
    "120px",
    "120px",
  ],
  headers: (tr: TrFunction) => [
    tr(heldRequestStatusTableI18n.customerNumber),
    tr(heldRequestStatusTableI18n.retailAccountNumber),
    tr(heldRequestStatusTableI18n.heldAmount),
    tr(heldRequestStatusTableI18n.currency),
    tr(heldRequestStatusTableI18n.userInputHeldAmount),
    tr(heldRequestStatusTableI18n.inputCurrency),
    tr(heldRequestStatusTableI18n.accountCode),
    tr(heldRequestStatusTableI18n.heldType),
    tr(heldRequestStatusTableI18n.requestAuthority),
    tr(heldRequestStatusTableI18n.heldReason),
    tr(heldRequestStatusTableI18n.heldStartDate),
    tr(heldRequestStatusTableI18n.heldEndDate),
    tr(heldRequestStatusTableI18n.cardUnitNotification),
    tr(heldRequestStatusTableI18n.amlUnitNotification),
    tr(heldRequestStatusTableI18n.requestStatus),
    tr(heldRequestStatusTableI18n.midasMessage),
    tr(heldRequestStatusTableI18n.comment),
    tr(heldRequestStatusTableI18n.userRequested),
    tr(heldRequestStatusTableI18n.dateTimeInput),
    tr(heldRequestStatusTableI18n.amendId),
    tr(heldRequestStatusTableI18n.reverseId),
    tr(heldRequestStatusTableI18n.heldItemReference),
  ],
};

interface HeldRequestStatusTableProps {
  data: HeldRequestStatusResponse;
  onPageNumberChange: (newPageNumber: number) => void;
}

export const HeldRequestStatusTable = ({
  data,
  onPageNumberChange,
}: HeldRequestStatusTableProps) => {
  const { tr } = useI18n();

  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  const tableHeaders = useMemo(
    () => heldRequestsStatusTableConfig.headers(tr),
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
        <Table cols={heldRequestsStatusTableConfig.cols} headers={tableHeaders}>
          {data.response?.map((request) => (
            <React.Fragment key={request.requestId}>
              <Tr>
                <Text text={request.customerNumber} />
                <Text text={request.retailAccountNumber} />
                <Text text={request.heldAmount} />
                <Text text={request.currencyCode} />
                <Text text={request.heldAmountUserInput} />
                <Text text={request.inputCurrencyCode} />
                <Text text={request.accountCode} />
                <Text text={request.heldType} />
                <Text text={request.requesterAuthority} />
                <Text text={request.heldReason} />
                <Text text={formatIntlLocalDateTime(request.heldStartDate)} />
                <Text text={formatIntlLocalDateTime(request.heldEndDate)} />
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
                <Text text={request.requestStatus} />
                <Text text={request.midasMessage} />
                <Text text={request.comment} />
                <Text text={request.userRequested} />
                <Text text={formatIntlLocalDateTime(request.dateTimeInput)} />
                <Text text={request.refAmendId} />
                <Text text={request.refReverseId} />
                <Text text={request.heldItemReference} />
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
