import { useMemo } from "react";
import {
  formatIntlLocalDate,
  useI18n,
} from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { personalDocumentDataI18n } from "./PersonalDocumentData.i18n";
import { CustomerDto } from "~/api/customer/customerApi.types";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";

interface PersonalDocumentDataProps {
  customer?: CustomerDto;
}

export const PersonalDocumentData: React.FC<PersonalDocumentDataProps> = ({
  customer,
}) => {
  const { tr } = useI18n();

  const documentRows = useMemo(
    () => ({
      title: tr(personalDocumentDataI18n.header),
      data: [
        {
          label: tr(personalDocumentDataI18n.documentType),
          value: customer?.customerInformation.document.type,
        },
        {
          label: tr(personalDocumentDataI18n.docIssueAuthority),
          value: customer?.customerInformation.document.issuer,
        },
        {
          label: tr(personalDocumentDataI18n.docNo),
          value: customer?.customerInformation.document.number,
        },
        {
          label: tr(personalDocumentDataI18n.ssn),
          value: customer?.customerInformation.document.ssn,
        },
        {
          label: tr(personalDocumentDataI18n.issueDate),
          value: formatIntlLocalDate(
            customer?.customerInformation.document.issueDate
          ),
        },
        {
          label: tr(personalDocumentDataI18n.expiryDate),
          value: formatIntlLocalDate(
            customer?.customerInformation.document.expiryDate
          ),
        },
      ],
    }),
    [tr, customer]
  );

  return (
    <Stack gap="0">
      <RowHeader
        label={
          <Text
            size="16"
            weight="bold"
            text={tr(personalDocumentDataI18n.header)}
          />
        }
      />
      <InfoRows
        rows={{
          title: documentRows.title,
          data: documentRows.data.map((row) => ({
            ...row,
            id: `document-detail-${row.label
              .toLowerCase()
              .replace(/\s+/g, "-")}`,
          })),
        }}
      />
    </Stack>
  );
};
