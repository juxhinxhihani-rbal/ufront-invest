import { useMemo } from "react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { CashTransactionsDto } from "~/api/customer/customerApi.types";
import { getNameById, multiSelectValuesToString } from "~/common/utils";
import {
  useDiligenceBandTypes,
  useFrequencyTypes,
  useTransactionCurrencyTypes,
} from "~/features/dictionaries/dictionariesQueries";
import { booleansI18n } from "~/features/i18n";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";
import { RowHeader } from "../../../components/RowHeader/RowHeader";
import { cashTransactionsDataI18n } from "./CashTransactionsData.i18n";

interface CashTransactionsDataProps {
  cashTransactions?: CashTransactionsDto;
}

export const CashTransactionsData: React.FC<CashTransactionsDataProps> = (
  props
) => {
  const { cashTransactions } = props;
  const { tr } = useI18n();

  const diligenceBandTypes = useDiligenceBandTypes();
  const transactionCurrencyTypes = useTransactionCurrencyTypes();
  const frequencyTypes = useFrequencyTypes();

  const cashTransactionsRows = useMemo(
    () => ({
      title: tr(cashTransactionsDataI18n.header),
      data: [
        {
          label: tr(cashTransactionsDataI18n.hasCashTransaction),
          value: cashTransactions?.hasCashTransaction
            ? tr(booleansI18n.yes)
            : tr(booleansI18n.no),
        },
        {
          label: tr(cashTransactionsDataI18n.transactionBand),
          value: getNameById(diligenceBandTypes.data, cashTransactions?.bandId),
          isGettingValue: diligenceBandTypes.isLoading,
        },
        {
          label: tr(cashTransactionsDataI18n.transactionFrequency),
          value: getNameById(
            frequencyTypes.data,
            cashTransactions?.transactionFrequencyId
          ),
          isGettingValue: frequencyTypes.isLoading,
        },
        {
          label: tr(cashTransactionsDataI18n.transactionCurrency),
          value: multiSelectValuesToString(
            transactionCurrencyTypes.data,
            cashTransactions?.currencyIds
          ),
          isGettingValue: transactionCurrencyTypes.isLoading,
        },
        {
          label: tr(cashTransactionsDataI18n.averageTransactionValueInAll),
          value: cashTransactions?.averageTransactionAmount?.toString(),
        },
      ],
    }),
    [
      tr,
      cashTransactions,
      diligenceBandTypes,
      transactionCurrencyTypes,
      frequencyTypes,
    ]
  );

  return (
    <Stack gap="0">
      <RowHeader
        label={
          <Text
            size="16"
            weight="bold"
            text={tr(cashTransactionsDataI18n.header)}
          />
        }
      />
      <InfoRows rows={cashTransactionsRows} />
    </Stack>
  );
};
