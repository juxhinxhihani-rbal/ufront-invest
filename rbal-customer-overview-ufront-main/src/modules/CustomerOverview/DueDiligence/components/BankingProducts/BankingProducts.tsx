import { useMemo } from "react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { BankingProductsDto } from "~/api/customer/customerApi.types";
import { multiSelectValuesToString } from "~/common/utils";
import { useFetchPurposeOfBankRelationTypes } from "~/features/dictionaries/dictionariesQueries";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";
import { RowHeader } from "../../../components/RowHeader/RowHeader";
import { bankingProductsI18n } from "./BankingProducts.i18n";

interface BankingProductsProps {
  bankingProducts?: BankingProductsDto;
}

export const BankingProducts: React.FC<BankingProductsProps> = (props) => {
  const { bankingProducts } = props;
  const { tr } = useI18n();

  const purposeOfBankRelationTypesQuery = useFetchPurposeOfBankRelationTypes();

  const bankingProductsRows = useMemo(
    () => ({
      title: tr(bankingProductsI18n.header),
      data: [
        {
          label: tr(bankingProductsI18n.purposeOfBankRelationType),
          value: multiSelectValuesToString(
            purposeOfBankRelationTypesQuery.data,
            bankingProducts?.purposeOfBankRelationTypeIds
          ),
          isGettingValue: purposeOfBankRelationTypesQuery.isLoading,
        },
      ],
    }),
    [tr, bankingProducts, purposeOfBankRelationTypesQuery]
  );

  return (
    <Stack gap="0">
      <RowHeader
        label={
          <Text size="16" weight="bold" text={tr(bankingProductsI18n.header)} />
        }
      />
      <InfoRows rows={bankingProductsRows} />
    </Stack>
  );
};
