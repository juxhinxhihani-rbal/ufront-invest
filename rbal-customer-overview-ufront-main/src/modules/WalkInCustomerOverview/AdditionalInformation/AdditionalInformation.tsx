import { WalkInCustomerAdditionalInformationDto } from "~/api/walkInCustomer/walkInCustomerApi.types";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { useMemo } from "react";
import {
  formatIntlLocalDate,
  useI18n,
} from "@rbal-modern-luka/luka-portal-shell";
import { additionalInformationi18n } from "./AdditionalInformation.i18n";
import { css } from "@emotion/react";
import { booleansI18n } from "~/features/i18n";

interface AdditionalInformationProps {
  additionalData: WalkInCustomerAdditionalInformationDto;
}

export const AdditionalInformation = ({
  additionalData,
}: AdditionalInformationProps) => {
  const { tr } = useI18n();

  const fatcaInformationDataRows = useMemo(
    () => ({
      id: 1,
      title: tr(additionalInformationi18n.headers.fatcaInformationData),
      data: [
        {
          label: tr(
            additionalInformationi18n.fatcaInformationData.documentaryDate
          ),
          value: formatIntlLocalDate(
            additionalData?.fatcaInformation.documentaryDate
          ),
        },
        {
          label: tr(
            additionalInformationi18n.fatcaInformationData.documentaryDeadline
          ),
          value: formatIntlLocalDate(
            additionalData?.fatcaInformation.documentaryDeadline
          ),
        },
        {
          label: tr(additionalInformationi18n.fatcaInformationData.status),
          value: additionalData?.fatcaInformation.fatcaStatus,
        },
        {
          label: tr(additionalInformationi18n.fatcaInformationData.statusDate),
          value: formatIntlLocalDate(
            additionalData?.fatcaInformation.statusDate
          ),
        },
      ],
    }),
    [tr, additionalData]
  );

  const employmentDataRows = useMemo(
    () => ({
      id: 2,
      title: tr(additionalInformationi18n.headers.employmentData),
      data: [
        {
          label: tr(additionalInformationi18n.employmentData.profession),
          value: additionalData?.employmentData.profession,
        },
        {
          label: tr(additionalInformationi18n.employmentData.ministry),
          value: additionalData?.employmentData.ministry,
        },
        {
          label: tr(additionalInformationi18n.employmentData.institution),
          value: additionalData?.employmentData.dicastery,
        },
      ],
    }),
    [tr, additionalData]
  );

  const alternativeAddressDataRows = useMemo(
    () => ({
      id: 3,
      title: tr(additionalInformationi18n.headers.alternativeAddressData),
      data: [
        {
          label: tr(
            additionalInformationi18n.alternativeAddressData.residentialAddress
          ),
          value: additionalData?.alternativeAddress.residentialAddress,
        },
        {
          label: tr(
            additionalInformationi18n.alternativeAddressData.countryOfResidence
          ),
          value: additionalData?.alternativeAddress.countryResidence,
        },
        {
          label: tr(
            additionalInformationi18n.alternativeAddressData.citizenship
          ),
          value: additionalData?.alternativeAddress.citizenship,
        },
        {
          label: tr(
            additionalInformationi18n.alternativeAddressData.cityOfResidence
          ),
          value: additionalData?.alternativeAddress.cityResidence,
        },
        {
          label: tr(
            additionalInformationi18n.alternativeAddressData.taxesState
          ),
          value: additionalData?.alternativeAddress.stateOfTaxPayment,
        },
      ],
    }),
    [tr, additionalData]
  );

  const marketableCustomerDataRows = useMemo(
    () => ({
      id: 4,
      title: tr(additionalInformationi18n.headers.marketableCustomerData),
      data: [
        {
          label: tr(additionalInformationi18n.marketableCustomerData.status),
          value: additionalData?.marketableCustomer
            ? tr(booleansI18n.yes)
            : tr(booleansI18n.no),
        },
      ],
    }),
    [tr, additionalData]
  );

  const sections = useMemo(
    () => [
      fatcaInformationDataRows,
      employmentDataRows,
      alternativeAddressDataRows,
      marketableCustomerDataRows,
    ],
    [
      fatcaInformationDataRows,
      employmentDataRows,
      alternativeAddressDataRows,
      marketableCustomerDataRows,
    ]
  );
  return (
    <>
      {sections.map((section) => (
        <Stack gap="0" customStyle={css({ marginTop: 16 })} key={section.id}>
          <RowHeader
            label={<Text size="16" weight="bold" text={section.title} />}
          />
          <InfoRows rows={section} />
        </Stack>
      ))}
    </>
  );
};
