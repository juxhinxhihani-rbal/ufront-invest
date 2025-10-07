import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { AmlDueDiligenceData } from "~/api/authorization/authorizationApi.types";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { getNameById, multiSelectValuesToString } from "~/common/utils";
import { amlDueDiligencei18n } from "./AmlDueDilligence.i18n";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";
import {
  useDiligenceBandTypes,
  useFetchPurposeOfBankRelationTypes,
  useFrequencyTypes,
  useSourceFundsTypes,
  useTransactionCurrencyTypes,
} from "~/features/dictionaries/dictionariesQueries";
import { useMemo } from "react";
import { booleansI18n } from "~/features/i18n";
import { css } from "@emotion/react";

interface AmlDueDiligenceDataProps {
  amlDueDiligenceData?: AmlDueDiligenceData;
}

const styles = {
  content: css({
    marginTop: 16,
  }),
};

export const AmlDueDilligence: React.FC<AmlDueDiligenceDataProps> = ({
  amlDueDiligenceData,
}) => {
  const { tr } = useI18n();

  const diligenceBandTypes = useDiligenceBandTypes();
  const transactionCurrencyTypes = useTransactionCurrencyTypes();
  const frequencyTypes = useFrequencyTypes();
  const sourceFundsTypesQuery = useSourceFundsTypes();
  const purposeOfBankRelationTypesQuery = useFetchPurposeOfBankRelationTypes();

  const dueDilligenceRows = useMemo(
    () => ({
      title: tr(amlDueDiligencei18n.dueDiligenceData),
      data: [
        {
          label: tr(amlDueDiligencei18n.employment),
          value: amlDueDiligenceData?.employment,
        },
        {
          label: tr(amlDueDiligencei18n.isActForThirdParty),
          value: amlDueDiligenceData?.isActForThirdParty
            ? tr(booleansI18n.yes)
            : tr(booleansI18n.no),
        },
        {
          label: tr(amlDueDiligencei18n.expectedVolumesOfTrnx),
          value: amlDueDiligenceData?.expectedVolumesOfTrnx,
        },
        {
          label: tr(amlDueDiligencei18n.sourceOfFunds),
          value: multiSelectValuesToString(
            sourceFundsTypesQuery.data,
            amlDueDiligenceData?.sourceOfFunds
          ),
          isGettingValue: sourceFundsTypesQuery.isLoading,
        },
        {
          label: tr(amlDueDiligencei18n.relationPurposeWithBank),
          value: multiSelectValuesToString(
            purposeOfBankRelationTypesQuery.data,
            amlDueDiligenceData?.relationPurposeWithBank
          ),
          isGettingValue: purposeOfBankRelationTypesQuery.isLoading,
        },
        {
          label: tr(amlDueDiligencei18n.hasCashTransaction),
          value: amlDueDiligenceData?.hasCashTransationWithBank
            ? tr(booleansI18n.yes)
            : tr(booleansI18n.no),
        },
        {
          label: tr(amlDueDiligencei18n.transactionBand),
          value: getNameById(
            diligenceBandTypes.data,
            amlDueDiligenceData?.bandId
          ),
          isGettingValue: diligenceBandTypes.isLoading,
        },
        {
          label: tr(amlDueDiligencei18n.transactionFrequency),
          value: getNameById(
            frequencyTypes.data,
            amlDueDiligenceData?.transactionFrequency
          ),
          isGettingValue: frequencyTypes.isLoading,
        },
        {
          label: tr(amlDueDiligencei18n.transactionCurrency),
          value: multiSelectValuesToString(
            transactionCurrencyTypes.data,
            amlDueDiligenceData?.transactionCurrency
          ),
          isGettingValue: transactionCurrencyTypes.isLoading,
        },
        {
          label: tr(amlDueDiligencei18n.averageTransactionValueInAll),
          value: amlDueDiligenceData?.transactionAmount?.toString(),
        },
      ],
    }),
    [
      tr,
      amlDueDiligenceData,
      sourceFundsTypesQuery,
      purposeOfBankRelationTypesQuery,
      diligenceBandTypes,
      frequencyTypes,
      transactionCurrencyTypes,
    ]
  );

  return (
    <>
      <Stack gap="0" customStyle={styles.content}>
        <RowHeader
          label={
            <Text
              size="16"
              weight="bold"
              text={tr(amlDueDiligencei18n.dueDiligenceData)}
            />
          }
        />
        <InfoRows rows={dueDilligenceRows} />
      </Stack>
    </>
  );
};
