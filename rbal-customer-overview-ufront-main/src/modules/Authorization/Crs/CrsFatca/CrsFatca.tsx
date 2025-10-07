import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { CrsFatcaData } from "~/api/authorization/authorizationApi.types";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { useMemo } from "react";
import { css } from "@emotion/react";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";
import { crsFatcai18n } from "./CrsFatca.i18n";

const styles = {
  content: css({
    marginTop: 16,
  }),
};
interface CrsFactaProps {
  crsFatcaData?: CrsFatcaData;
}

export const CrsFatca = ({ crsFatcaData }: CrsFactaProps) => {
  const { tr } = useI18n();

  const fatcaInformationData = useMemo(
    () => ({
      title: tr(crsFatcai18n.fatcaInformation),
      data: [
        {
          label: tr(crsFatcai18n.fatcaDocumentaryDate),
          value: crsFatcaData?.fatcaInformation.fatcaDocumentaryDate,
        },
        {
          label: tr(crsFatcai18n.fatcaDocumentaryDeadline),
          value: crsFatcaData?.fatcaInformation.fatcaDocumentaryDeadline,
        },
        {
          label: tr(crsFatcai18n.fatcaStatus),
          value: crsFatcaData?.fatcaInformation.fatcaStatus,
        },
        {
          label: tr(crsFatcai18n.fatcaStatusDate),
          value: crsFatcaData?.fatcaInformation.fatcaStatusDate,
        },
        {
          label: tr(crsFatcai18n.fatcaDocumentType),
          value: crsFatcaData?.fatcaInformation.fatcaDocumentType,
        },
        {
          label: tr(crsFatcai18n.taxPayerCountry),
          value: crsFatcaData?.fatcaInformation.taxPayerCountry,
        },
      ],
    }),
    [tr, crsFatcaData]
  );

  return (
    <>
      <Stack gap="0" customStyle={styles.content}>
        <RowHeader
          label={
            <Text
              size="16"
              weight="bold"
              text={tr(crsFatcai18n?.fatcaInformation)}
            />
          }
        />
        <InfoRows rows={fatcaInformationData} />
      </Stack>
    </>
  );
};
