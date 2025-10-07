import { css } from "@emotion/react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { useMemo } from "react";
import { CrsAdditionalInformationData } from "~/api/authorization/authorizationApi.types";
import { booleansI18n } from "~/features/i18n";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { crsAdditionalInformationi18n } from "./CrsAdditionalInformation.i18n";

const styles = {
  content: css({
    marginTop: 16,
  }),
};

interface CrsAdditionalInformationDataProps {
  crsAdditionalInformationData?: CrsAdditionalInformationData;
}

export const CrsAdditionalInformation = ({
  crsAdditionalInformationData,
}: CrsAdditionalInformationDataProps) => {
  const { tr } = useI18n();

  const alternativeAddressInfoRows = useMemo(
    () => ({
      title: tr(crsAdditionalInformationi18n.alternativeAddress),
      data: [
        {
          label: tr(crsAdditionalInformationi18n.residentialAddress),
          value:
            crsAdditionalInformationData?.alternativeAddress.residentialAddress,
        },
        {
          label: tr(crsAdditionalInformationi18n.countryResidence),
          value:
            crsAdditionalInformationData?.alternativeAddress.countryResidence,
        },
        {
          label: tr(crsAdditionalInformationi18n.citizenship),
          value: crsAdditionalInformationData?.alternativeAddress.citizenship,
        },
        {
          label: tr(crsAdditionalInformationi18n.cityResidence),
          value: crsAdditionalInformationData?.alternativeAddress.cityResidence,
        },
        {
          label: tr(crsAdditionalInformationi18n.stateOfTaxPayment),
          value:
            crsAdditionalInformationData?.alternativeAddress.stateOfTaxPayment,
        },
      ],
    }),
    [tr, crsAdditionalInformationData]
  );

  const employmentDataInfoRows = useMemo(
    () => ({
      title: tr(crsAdditionalInformationi18n.employmentData),
      data: [
        {
          label: tr(crsAdditionalInformationi18n.profession),
          value: crsAdditionalInformationData?.employment.profession,
        },
        {
          label: tr(crsAdditionalInformationi18n.ministry),
          value: crsAdditionalInformationData?.employment.ministry,
        },
        {
          label: tr(crsAdditionalInformationi18n.institution),
          value: crsAdditionalInformationData?.employment.institution,
        },
      ],
    }),
    [tr, crsAdditionalInformationData]
  );

  const amlDataInfoRows = useMemo(
    () => ({
      title: tr(crsAdditionalInformationi18n.amlData),
      data: [
        {
          label: tr(crsAdditionalInformationi18n.educationLevel),
          value: crsAdditionalInformationData?.amlData.educationLevel,
        },
        {
          label: tr(crsAdditionalInformationi18n.overallRiskRating),
          value: crsAdditionalInformationData?.amlData.overallRiskRating,
        },
        {
          label: tr(crsAdditionalInformationi18n.accountOfficer),
          value: crsAdditionalInformationData?.amlData.accountOfficer,
        },
        {
          label: tr(crsAdditionalInformationi18n.naceCode),
          value: crsAdditionalInformationData?.amlData.naceCode,
        },
        {
          label: tr(crsAdditionalInformationi18n.customerRisk),
          value: crsAdditionalInformationData?.amlData.customerRisk,
        },
        {
          label: tr(crsAdditionalInformationi18n.riskRating),
          value: crsAdditionalInformationData?.amlData.riskRating,
        },
        {
          label: tr(crsAdditionalInformationi18n.lineOfBusiness),
          value: crsAdditionalInformationData?.amlData.lob,
        },
        {
          label: tr(crsAdditionalInformationi18n.prodLine),
          value: crsAdditionalInformationData?.amlData.prodLine,
        },
        {
          label: tr(crsAdditionalInformationi18n.isPep),
          value: crsAdditionalInformationData?.amlData.isPep
            ? tr(booleansI18n.yes)
            : tr(booleansI18n.no),
        },
        {
          label: tr(crsAdditionalInformationi18n.isFisa),
          value: crsAdditionalInformationData?.amlData.isFisa
            ? tr(booleansI18n.yes)
            : tr(booleansI18n.no),
        },
        {
          label: tr(crsAdditionalInformationi18n.crsStatus),
          value: crsAdditionalInformationData?.amlData.crsStatus,
        },
      ],
    }),
    [tr, crsAdditionalInformationData]
  );

  return (
    <Stack>
      <Stack gap="0" customStyle={styles.content}>
        <RowHeader
          label={
            <Text
              size="16"
              weight="bold"
              text={tr(crsAdditionalInformationi18n.alternativeAddress)}
            />
          }
        />
        <InfoRows rows={alternativeAddressInfoRows} />
      </Stack>
      <Stack gap="0" customStyle={styles.content}>
        <RowHeader
          label={
            <Text
              size="16"
              weight="bold"
              text={tr(crsAdditionalInformationi18n.employmentData)}
            />
          }
        />
        <InfoRows rows={employmentDataInfoRows} />
      </Stack>
      <Stack gap="0" customStyle={styles.content}>
        <RowHeader
          label={
            <Text
              size="16"
              weight="bold"
              text={tr(crsAdditionalInformationi18n.amlData)}
            />
          }
        />
        <InfoRows rows={amlDataInfoRows} />
      </Stack>
    </Stack>
  );
};
