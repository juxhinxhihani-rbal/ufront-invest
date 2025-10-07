import { AmlAdditionalInformationData } from "~/api/authorization/authorizationApi.types";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { styles } from "../../Customer/CustomerAuthorizationDetails.styles";
import { amlAdditionalInformationi18n } from "./AmlAdditionalInformation.i18n";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";
import { useMemo } from "react";
import { booleansI18n } from "~/features/i18n";

interface AmlAdditionalInformationDataProps {
  amlAdditionalInformationData?: AmlAdditionalInformationData;
}

export const AmlAdditionalInformation = ({
  amlAdditionalInformationData,
}: AmlAdditionalInformationDataProps) => {
  const { tr } = useI18n();

  const employmentData = useMemo(
    () => ({
      id: 1,
      title: tr(amlAdditionalInformationi18n.personalData),
      data: [
        {
          label: tr(amlAdditionalInformationi18n.proffesion),
          value: amlAdditionalInformationData?.employmentData.proffesion,
        },
        {
          label: tr(amlAdditionalInformationi18n.ministry),
          value: amlAdditionalInformationData?.employmentData.ministry,
        },
        {
          label: tr(amlAdditionalInformationi18n.institution),
          value: amlAdditionalInformationData?.employmentData.institution,
        },
      ],
    }),
    [tr, amlAdditionalInformationData]
  );

  const amlData = useMemo(
    () => ({
      id: 2,
      title: tr(amlAdditionalInformationi18n.documentData),
      data: [
        {
          label: tr(amlAdditionalInformationi18n.educationLevel),
          value: amlAdditionalInformationData?.amlData.educationLevel,
        },
        {
          label: tr(amlAdditionalInformationi18n.overallRiskRating),
          value: amlAdditionalInformationData?.amlData.overallRiskRating,
        },
        {
          label: tr(amlAdditionalInformationi18n.accountOfficerCode),
          value: amlAdditionalInformationData?.amlData.accountOfficerCode,
        },
        {
          label: tr(amlAdditionalInformationi18n.naceCode),
          value: amlAdditionalInformationData?.amlData.naceCode,
        },
        {
          label: tr(amlAdditionalInformationi18n.riskRating),
          value: amlAdditionalInformationData?.amlData.riskRating,
        },
        {
          label: tr(amlAdditionalInformationi18n.lineOfBusiness),
          value: amlAdditionalInformationData?.amlData.lineOfBusiness,
        },
        {
          label: tr(amlAdditionalInformationi18n.prodLine),
          value: amlAdditionalInformationData?.amlData.prodLine,
        },
        {
          label: tr(amlAdditionalInformationi18n.isPep),
          value: amlAdditionalInformationData?.amlData.isPep
            ? tr(booleansI18n.yes)
            : tr(booleansI18n.no),
        },
        {
          label: tr(amlAdditionalInformationi18n.isFisa),
          value: amlAdditionalInformationData?.amlData.isFisa
            ? tr(booleansI18n.yes)
            : tr(booleansI18n.no),
        },
        {
          label: tr(amlAdditionalInformationi18n.crsStatus),
          value: amlAdditionalInformationData?.amlData.crsStatus,
        },
      ],
    }),
    [tr, amlAdditionalInformationData]
  );

  const sections = useMemo(
    () => [employmentData, amlData],
    [employmentData, amlData]
  );

  return (
    <>
      {sections.map((section) => (
        <Stack gap="0" customStyle={styles.content} key={section.id}>
          <RowHeader
            label={<Text size="16" weight="bold" text={section.title} />}
          />
          <InfoRows rows={section} />
        </Stack>
      ))}
    </>
  );
};
