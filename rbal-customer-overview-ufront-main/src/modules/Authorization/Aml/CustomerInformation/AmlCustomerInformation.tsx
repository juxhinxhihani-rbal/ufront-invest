import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { AmlCustomerInformationData } from "~/api/authorization/authorizationApi.types";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { styles } from "../../Customer/CustomerAuthorizationDetails.styles";
import { amlCustomerInformationi18n } from "./AmlCustomerInformation.i18n";
import { useMemo } from "react";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";

interface AmlCustomerInformationDataProps {
  amlCustomerInformationData?: AmlCustomerInformationData;
}

export const AmlCustomerInformation = ({
  amlCustomerInformationData,
}: AmlCustomerInformationDataProps) => {
  const { tr } = useI18n();

  const personalData = useMemo(
    () => ({
      id: 1,
      title: tr(amlCustomerInformationi18n.personalData),
      data: [
        {
          label: tr(amlCustomerInformationi18n.name),
          value: amlCustomerInformationData?.personalData.name,
        },
        {
          label: tr(amlCustomerInformationi18n.surname),
          value: amlCustomerInformationData?.personalData.surname,
        },
        {
          label: tr(amlCustomerInformationi18n.fatherName),
          value: amlCustomerInformationData?.personalData.fatherName,
        },
        {
          label: tr(amlCustomerInformationi18n.motherName),
          value: amlCustomerInformationData?.personalData.motherName,
        },
        {
          label: tr(amlCustomerInformationi18n.birthdate),
          value: amlCustomerInformationData?.personalData.birthdate,
        },
        {
          label: tr(amlCustomerInformationi18n.nationality),
          value: amlCustomerInformationData?.personalData.nationality,
        },
        {
          label: tr(amlCustomerInformationi18n.contryOfBirth),
          value: amlCustomerInformationData?.personalData.contryOfBirth,
        },
        {
          label: tr(amlCustomerInformationi18n.birthplace),
          value: amlCustomerInformationData?.personalData.birthplace,
        },
        {
          label: tr(amlCustomerInformationi18n.gender),
          value: amlCustomerInformationData?.personalData.gender,
        },
        {
          label: tr(amlCustomerInformationi18n.civilStatus),
          value: amlCustomerInformationData?.personalData.civilStatus,
        },
        {
          label: tr(amlCustomerInformationi18n.additionalLastName),
          value: amlCustomerInformationData?.personalData.additionalLastName,
        },
      ],
    }),
    [tr, amlCustomerInformationData]
  );

  const documentData = useMemo(
    () => ({
      id: 2,
      title: tr(amlCustomerInformationi18n.documentData),
      data: [
        {
          label: tr(amlCustomerInformationi18n.documentType),
          value: amlCustomerInformationData?.documentData.documentType,
        },
        {
          label: tr(amlCustomerInformationi18n.authorityIssue),
          value: amlCustomerInformationData?.documentData.authorityIssue,
        },
        {
          label: tr(amlCustomerInformationi18n.documentNumber),
          value: amlCustomerInformationData?.documentData.documentNumber,
        },
        {
          label: tr(amlCustomerInformationi18n.personalNumber),
          value: amlCustomerInformationData?.documentData.personalNumber,
        },
        {
          label: tr(amlCustomerInformationi18n.issueDate),
          value: amlCustomerInformationData?.documentData.issueDate,
        },
        {
          label: tr(amlCustomerInformationi18n.expiryDate),
          value: amlCustomerInformationData?.documentData.expiryDate,
        },
      ],
    }),
    [tr, amlCustomerInformationData]
  );

  const addressData = useMemo(
    () => ({
      id: 3,
      title: tr(amlCustomerInformationi18n.addressData),
      data: [
        {
          label: tr(amlCustomerInformationi18n.address),
          value: amlCustomerInformationData?.addressData.address,
        },
        {
          label: tr(amlCustomerInformationi18n.countryOfResidence),
          value: amlCustomerInformationData?.addressData.countryOfResidence,
        },
        {
          label: tr(amlCustomerInformationi18n.cityOfResidence),
          value: amlCustomerInformationData?.addressData.cityOfResidence,
        },
      ],
    }),
    [tr, amlCustomerInformationData]
  );

  const contactData = useMemo(
    () => ({
      id: 4,
      title: tr(amlCustomerInformationi18n.contactData),
      data: [
        {
          label: tr(amlCustomerInformationi18n.mobileNumber),
          value: amlCustomerInformationData?.contactData.mobileNumber,
        },
        {
          label: tr(amlCustomerInformationi18n.alternativeNumber),
          value: amlCustomerInformationData?.contactData.alternativeNumber,
        },
        {
          label: tr(amlCustomerInformationi18n.workMobile),
          value: amlCustomerInformationData?.contactData.workMobile,
        },
        {
          label: tr(amlCustomerInformationi18n.fax),
          value: amlCustomerInformationData?.contactData.fax,
        },
        {
          label: tr(amlCustomerInformationi18n.email),
          value: amlCustomerInformationData?.contactData.email,
        },
      ],
    }),
    [tr, amlCustomerInformationData]
  );

  const sections = useMemo(
    () => [personalData, documentData, contactData, addressData],
    [personalData, documentData, contactData, addressData]
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
