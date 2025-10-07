import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text, Icon } from "@rbal-modern-luka/ui-library";
import { contactDataI18n } from "./ContactData.i18n";
import { CustomerDto } from "~/api/customer/customerApi.types";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { useMemo } from "react";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";

interface ContactDataProps {
  customer?: CustomerDto;
}

export const ContactData: React.FC<ContactDataProps> = ({ customer }) => {
  const { tr } = useI18n();

  const phoneNumber = useMemo(() => {
    if (customer?.customerInformation.contact) {
      return `+${customer.customerInformation.contact.prefix} ${customer.customerInformation.contact.mobileNumber}`;
    }
    return "";
  }, [customer]);

  const contactRows = useMemo(
    () => ({
      title: tr(contactDataI18n.header),
      data: [
        {
          label: tr(contactDataI18n.mobileNumber),
          value: phoneNumber,
          extraComponent: customer?.customerInformation.contact
            .isPhoneNumberVerified ? (
            <Icon type="checkmark" fgColor="green400" size="16" />
          ) : (
            <Icon type="close" fgColor="red500" size="16" />
          ),
        },
        {
          label: tr(contactDataI18n.alternatePhone),
          value: customer?.customerInformation.contact.alternativeMobileNumber,
        },
        {
          label: tr(contactDataI18n.email),
          value: customer?.customerInformation.contact.email,
          extraComponent: customer?.customerInformation.contact
            .isEmailValidated ? (
            <Icon type="checkmark" fgColor="green400" size="16" />
          ) : (
            <Icon type="close" fgColor="red500" size="16" />
          ),
        },
      ],
    }),
    [customer, phoneNumber, tr]
  );

  return (
    <Stack gap="0">
      <RowHeader
        label={
          <Text size="16" weight="bold" text={tr(contactDataI18n.header)} />
        }
      />
      <InfoRows
        rows={{
          title: contactRows.title,
          data: contactRows.data.map((row) => ({
            ...row,
            id: `contact-detail-${row.label
              .toLowerCase()
              .replace(/\s+/g, "-")}`,
          })),
        }}
      />
    </Stack>
  );
};
