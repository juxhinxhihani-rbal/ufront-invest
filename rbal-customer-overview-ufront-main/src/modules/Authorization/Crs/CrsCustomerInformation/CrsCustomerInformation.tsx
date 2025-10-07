import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { CrsCustomerInformationData } from "~/api/authorization/authorizationApi.types";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { crsCustomerInformationi18n } from "./CrsCustomerInformation.i18n";
import { useMemo } from "react";
import { css } from "@emotion/react";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";

const styles = {
  content: css({
    marginTop: 16,
  }),
};
interface CrsCustomerInformationDataProps {
  crsCustomerInformationData?: CrsCustomerInformationData;
}

export const CrsCustomerInformation = ({
  crsCustomerInformationData,
}: CrsCustomerInformationDataProps) => {
  const { tr } = useI18n();

  const personalDataRow = useMemo(
    () => ({
      title: tr(crsCustomerInformationi18n.personalData),
      data: [
        {
          label: tr(crsCustomerInformationi18n.firstName),
          value: crsCustomerInformationData?.personalData.firstName,
        },
        {
          label: tr(crsCustomerInformationi18n.lastName),
          value: crsCustomerInformationData?.personalData.lastName,
        },
        {
          label: tr(crsCustomerInformationi18n.fatherName),
          value: crsCustomerInformationData?.personalData.fatherName,
        },
        {
          label: tr(crsCustomerInformationi18n.motherName),
          value: crsCustomerInformationData?.personalData.motherName,
        },
        {
          label: tr(crsCustomerInformationi18n.birthdate),
          value: crsCustomerInformationData?.personalData.birthdate,
        },
        {
          label: tr(crsCustomerInformationi18n.nationality),
          value: crsCustomerInformationData?.personalData.nationality,
        },
        {
          label: tr(crsCustomerInformationi18n.countryOfBirth),
          value: crsCustomerInformationData?.personalData.countryOfBirth,
        },
        {
          label: tr(crsCustomerInformationi18n.birthplace),
          value: crsCustomerInformationData?.personalData.birthplace,
        },
        {
          label: tr(crsCustomerInformationi18n.gender),
          value: crsCustomerInformationData?.personalData.gender,
        },
        {
          label: tr(crsCustomerInformationi18n.maritalStatus),
          value: crsCustomerInformationData?.personalData.maritalStatus,
        },
        {
          label: tr(crsCustomerInformationi18n.additionalLastName),
          value: crsCustomerInformationData?.personalData.additionalLastName,
        },
      ],
    }),
    [tr, crsCustomerInformationData]
  );

  const documentDataRow = useMemo(
    () => ({
      title: tr(crsCustomerInformationi18n.documentData),
      data: [
        {
          label: tr(crsCustomerInformationi18n.documentType),
          value: crsCustomerInformationData?.personalDocumentData.documentType,
        },
        {
          label: tr(crsCustomerInformationi18n.authorityIssue),
          value:
            crsCustomerInformationData?.personalDocumentData.authorityIssue,
        },
        {
          label: tr(crsCustomerInformationi18n.documentNumber),
          value:
            crsCustomerInformationData?.personalDocumentData.documentNumber,
        },
        {
          label: tr(crsCustomerInformationi18n.personalNumber),
          value:
            crsCustomerInformationData?.personalDocumentData.personalNumber,
        },
        {
          label: tr(crsCustomerInformationi18n.issueDate),
          value: crsCustomerInformationData?.personalDocumentData.issueDate,
        },
        {
          label: tr(crsCustomerInformationi18n.expiryDate),
          value: crsCustomerInformationData?.personalDocumentData.expiryDate,
        },
      ],
    }),
    [tr, crsCustomerInformationData]
  );

  const addressDataRow = useMemo(
    () => ({
      title: tr(crsCustomerInformationi18n.addressData),
      data: [
        {
          label: tr(crsCustomerInformationi18n.address),
          value: crsCustomerInformationData?.addressData.address,
        },
        {
          label: tr(crsCustomerInformationi18n.country),
          value: crsCustomerInformationData?.addressData.country,
        },
        {
          label: tr(crsCustomerInformationi18n.city),
          value: crsCustomerInformationData?.addressData.city,
        },
      ],
    }),
    [tr, crsCustomerInformationData]
  );

  const contactDataRow = useMemo(
    () => ({
      title: tr(crsCustomerInformationi18n.contactData),
      data: [
        {
          label: tr(crsCustomerInformationi18n.mobileNumber),
          value: crsCustomerInformationData?.contactData.mobileNumber,
        },
        {
          label: tr(crsCustomerInformationi18n.alternativeMobileNumber),
          value:
            crsCustomerInformationData?.contactData.alternativeMobileNumber,
        },
        {
          label: tr(crsCustomerInformationi18n.workMobile),
          value: crsCustomerInformationData?.contactData.workMobile,
        },
        {
          label: tr(crsCustomerInformationi18n.fax),
          value: crsCustomerInformationData?.contactData.fax,
        },
        {
          label: tr(crsCustomerInformationi18n.email),
          value: crsCustomerInformationData?.contactData.email,
        },
      ],
    }),
    [tr, crsCustomerInformationData]
  );

  return (
    <>
      <Stack gap="0" customStyle={styles.content}>
        <RowHeader
          label={
            <Text
              size="16"
              weight="bold"
              text={tr(crsCustomerInformationi18n?.personalData)}
            />
          }
        />
        <InfoRows rows={personalDataRow} />
        <Stack gap="0" customStyle={styles.content}>
          <RowHeader
            label={
              <Text
                size="16"
                weight="bold"
                text={tr(crsCustomerInformationi18n?.documentData)}
              />
            }
          />
          <InfoRows rows={documentDataRow} />
        </Stack>
        <Stack gap="0" customStyle={styles.content}>
          <RowHeader
            label={
              <Text
                size="16"
                weight="bold"
                text={tr(crsCustomerInformationi18n?.addressData)}
              />
            }
          />
          <InfoRows rows={addressDataRow} />
        </Stack>
        <Stack gap="0" customStyle={styles.content}>
          <RowHeader
            label={
              <Text
                size="16"
                weight="bold"
                text={tr(crsCustomerInformationi18n?.contactData)}
              />
            }
          />
          <InfoRows rows={contactDataRow} />
        </Stack>
      </Stack>
    </>
  );
};
