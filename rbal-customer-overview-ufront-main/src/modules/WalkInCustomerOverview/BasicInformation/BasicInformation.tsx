import { WalkInCustomerDto } from "~/api/walkInCustomer/walkInCustomerApi.types";
import { Stack, Text, Icon } from "@rbal-modern-luka/ui-library";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { useMemo } from "react";
import {
  formatIntlLocalDate,
  useI18n,
} from "@rbal-modern-luka/luka-portal-shell";
import { basicInformationi18n } from "./BasicInformation.i18n";
import { css } from "@emotion/react";

interface BasicInformationProps {
  customer: WalkInCustomerDto;
}

export const BasicInformation = ({ customer }: BasicInformationProps) => {
  const { tr } = useI18n();

  const personalDataRows = useMemo(
    () => ({
      id: 1,
      title: tr(basicInformationi18n.headers.personalData),
      data: [
        {
          label: tr(basicInformationi18n.personalData.firstName),
          value: customer?.basicInformation?.personalInformation.firstName,
        },
        {
          label: tr(basicInformationi18n.personalData.lastName),
          value: customer?.basicInformation?.personalInformation.lastName,
        },
        {
          label: tr(basicInformationi18n.personalData.fatherName),
          value: customer?.basicInformation?.personalInformation.fatherName,
        },
        {
          label: tr(basicInformationi18n.personalData.motherName),
          value: customer?.basicInformation?.personalInformation.motherName,
        },
        {
          label: tr(basicInformationi18n.personalData.birthdayDate),
          value: formatIntlLocalDate(
            customer?.basicInformation?.personalInformation.birthdate
          ),
        },
        {
          label: tr(basicInformationi18n.personalData.nationality),
          value: customer?.basicInformation?.personalInformation.nationality,
        },
        {
          label: tr(basicInformationi18n.personalData.countryOfBirth),
          value: customer?.basicInformation?.personalInformation.countryOfBirth,
        },
        {
          label: tr(basicInformationi18n.personalData.placeOfBirth),
          value: customer?.basicInformation?.personalInformation.birthplace,
        },
        {
          label: tr(basicInformationi18n.personalData.gender),
          value: customer?.basicInformation?.personalInformation.gender,
        },
        {
          label: tr(basicInformationi18n.personalData.civilStatus),
          value: customer?.basicInformation?.personalInformation.martialStatus,
        },
        {
          label: tr(basicInformationi18n.personalData.otherLastName),
          value: customer?.basicInformation?.personalInformation.maidenName,
        },
      ],
    }),
    [tr, customer]
  );

  const personalDocumentDataRows = useMemo(
    () => ({
      id: 2,
      title: tr(basicInformationi18n.headers.personalDocumentData),
      data: [
        {
          label: tr(basicInformationi18n.personalDocumentData.documentType),
          value: customer?.basicInformation?.documentData.type,
        },
        {
          label: tr(
            basicInformationi18n.personalDocumentData.docIssueAuthority
          ),
          value: customer?.basicInformation?.documentData.issuer,
        },
        {
          label: tr(basicInformationi18n.personalDocumentData.docNo),
          value: customer?.basicInformation?.documentData.number,
        },
        {
          label: tr(basicInformationi18n.personalDocumentData.ssn),
          value: customer?.basicInformation?.documentData.ssn,
        },
        {
          label: tr(basicInformationi18n.personalDocumentData.issueDate),
          value: formatIntlLocalDate(
            customer?.basicInformation?.documentData.issueDate
          ),
        },
        {
          label: tr(basicInformationi18n.personalDocumentData.expiryDate),
          value: formatIntlLocalDate(
            customer?.basicInformation?.documentData.expiryDate
          ),
        },
      ],
    }),
    [tr, customer]
  );

  const addressDataRows = useMemo(
    () => ({
      id: 3,
      title: tr(basicInformationi18n.headers.addressData),
      data: [
        {
          label: tr(basicInformationi18n.addressData.residentialAddress),
          value: customer?.basicInformation?.addressInformation.address,
        },
        {
          label: tr(basicInformationi18n.addressData.stateOfResidence),
          value: customer?.basicInformation?.addressInformation.country,
        },
        {
          label: tr(basicInformationi18n.addressData.cityOfResidence),
          value: customer?.basicInformation?.addressInformation.city,
        },
      ],
    }),
    [tr, customer]
  );

  const contactDataRows = useMemo(
    () => ({
      id: 4,
      title: tr(basicInformationi18n.headers.contactData),
      data: [
        {
          label: tr(basicInformationi18n.contactData.mobileNumber),
          value: customer?.basicInformation?.contactData.mobileNumber,
        },
        {
          label: tr(basicInformationi18n.contactData.alternatePhone),
          value: customer.basicInformation?.contactData.alternativeMobileNumber,
        },
        {
          label: tr(basicInformationi18n.contactData.email),
          value: customer?.basicInformation?.contactData.email,
          extraComponent: customer?.basicInformation?.contactData
            .isEmailValidated ? (
            <Icon type="checkmark" fgColor="green400" size="16" />
          ) : (
            <Icon type="close" fgColor="red500" size="16" />
          ),
        },
      ],
    }),
    [tr, customer]
  );

  const amlDataRows = useMemo(
    () => ({
      id: 5,
      title: tr(basicInformationi18n.headers.amlData),
      data: [
        {
          label: tr(basicInformationi18n.amlData.educationLevel),
          value: customer?.basicInformation?.amlInformation.educationLevel,
        },
        {
          label: tr(basicInformationi18n.amlData.overallRiskRating),
          value: customer?.basicInformation?.amlInformation.overallRiskRating,
        },
        {
          label: tr(basicInformationi18n.amlData.deathDate),
          value: formatIntlLocalDate(
            customer?.basicInformation?.amlInformation.deathDate
          ),
        },
      ],
    }),
    [tr, customer]
  );

  const sections = useMemo(
    () => [
      personalDataRows,
      personalDocumentDataRows,
      addressDataRows,
      contactDataRows,
      amlDataRows,
    ],
    [
      personalDataRows,
      personalDocumentDataRows,
      addressDataRows,
      contactDataRows,
      amlDataRows,
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
