import { useMemo } from "react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { SourceOfIncomeDto } from "~/api/customer/customerApi.types";
import { multiSelectValuesToString } from "~/common/utils";
import { useSourceFundsTypes } from "~/features/dictionaries/dictionariesQueries";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";
import { RowHeader } from "../../../components/RowHeader/RowHeader";
import { sourceOfIncomeI18n } from "./SourceOfIncome.i18n";

interface SourceOfIncomeProps {
  sourceOfIncome?: SourceOfIncomeDto;
}

export const SourceOfIncome: React.FC<SourceOfIncomeProps> = (props) => {
  const { sourceOfIncome } = props;
  const { tr } = useI18n();

  const sourceFundsTypesQuery = useSourceFundsTypes();

  const sourceOfIncomeRows = useMemo(() => {
    return {
      title: tr(sourceOfIncomeI18n.header),
      data: [
        {
          label: tr(sourceOfIncomeI18n.sourceOfIncome),
          value: multiSelectValuesToString(
            sourceFundsTypesQuery.data,
            sourceOfIncome?.sourceFundTypeIds
          ),
          isGettingValue: sourceFundsTypesQuery.isLoading,
        },
      ],
    };
  }, [
    tr,
    sourceFundsTypesQuery.data,
    sourceFundsTypesQuery.isLoading,
    sourceOfIncome,
  ]);

  return (
    <Stack gap="0">
      <RowHeader
        label={
          <Text size="16" weight="bold" text={tr(sourceOfIncomeI18n.header)} />
        }
      />
      <InfoRows rows={sourceOfIncomeRows} />
    </Stack>
  );
};
