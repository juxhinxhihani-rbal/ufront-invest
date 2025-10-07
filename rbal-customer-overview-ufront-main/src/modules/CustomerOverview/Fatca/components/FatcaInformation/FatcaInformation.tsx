import React, { useMemo } from "react";
import {
  formatIntlLocalDate,
  useI18n,
} from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { FatcaInformationDto } from "~/api/customer/customerApi.types";
import { getNameById } from "~/common/utils";
import {
  useFatcaDocumentTypes,
  useFatcaStatusTypes,
} from "~/features/dictionaries/dictionariesQueries";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";
import { RowHeader } from "../../../components/RowHeader/RowHeader";
import { fatcaInformationI18n } from "./FatcaInformation.i18n";

interface FatcaInformationProps {
  fatcaInformation?: FatcaInformationDto;
}

export const FatcaInformation: React.FC<FatcaInformationProps> = (props) => {
  const { fatcaInformation } = props;
  const { tr } = useI18n();

  const fatcaDocumentTypesQuery = useFatcaDocumentTypes();
  const fatcaStatusTypesQuery = useFatcaStatusTypes();

  const fatcaInformationRows = useMemo(
    () => ({
      title: tr(fatcaInformationI18n.header),
      data: [
        {
          label: tr(fatcaInformationI18n.documentaryDate),
          value: formatIntlLocalDate(fatcaInformation?.documentaryDate),
        },
        {
          label: tr(fatcaInformationI18n.documentaryDeadline),
          value: formatIntlLocalDate(fatcaInformation?.documentaryDeadline),
        },
        {
          label: tr(fatcaInformationI18n.documentType),
          value: getNameById(
            fatcaDocumentTypesQuery.data,
            fatcaInformation?.documentType
          ),
          isGettingValue: fatcaDocumentTypesQuery.isLoading,
        },
        {
          label: tr(fatcaInformationI18n.statusDate),
          value: formatIntlLocalDate(fatcaInformation?.statusDate),
        },
        {
          label: tr(fatcaInformationI18n.status),
          value: getNameById(
            fatcaStatusTypesQuery.data,
            fatcaInformation?.status
          ),
          isGettingValue: fatcaStatusTypesQuery.isLoading,
        },
        {
          label: tr(fatcaInformationI18n.fatcaAction),
          value: fatcaInformation?.fciAction,
        },
      ],
    }),
    [
      tr,
      fatcaInformation,
      fatcaDocumentTypesQuery.data,
      fatcaDocumentTypesQuery.isLoading,
      fatcaStatusTypesQuery.data,
      fatcaStatusTypesQuery.isLoading,
    ]
  );

  return (
    <Stack gap="0">
      <RowHeader
        label={
          <Text
            size="16"
            weight="bold"
            text={tr(fatcaInformationI18n.header)}
          />
        }
      />
      <InfoRows rows={fatcaInformationRows} />
    </Stack>
  );
};
