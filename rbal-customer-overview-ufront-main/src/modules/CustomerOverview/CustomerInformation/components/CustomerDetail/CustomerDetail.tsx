import {
  formatIntlLocalDate,
  useI18n,
} from "@rbal-modern-luka/luka-portal-shell";
import { Button, Icon, Stack, Text } from "@rbal-modern-luka/ui-library";
import { customerDetailI18n } from "./CustomerDetail.i18n";
import {
  CustomerDto,
  CustomerStatus,
  MidasStatus,
} from "~/api/customer/customerApi.types";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { booleansI18n } from "~/features/i18n";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";
import { useContext, useMemo } from "react";
import { useCustomerFshuInformation } from "~/features/hooks/useCutomerFshuInformation/useCustomerFshuInformation";
import { usePermission } from "~/features/hooks/useHasPermission";
import { RESOURCES } from "~/common/resources";
import { OsheContractsModal } from "~/components/OsheContractsModal/OsheContractsModal";
import { CustomerDocumentsContext } from "~/context/CustomerDocumentsContext";
import { useFeatureFlags } from "~/features/hooks/useFlags";

interface CustomerDetailProps {
  customer: CustomerDto;
}

export const CustomerDetail: React.FC<CustomerDetailProps> = ({ customer }) => {
  const { tr } = useI18n();
  const { isViewOnlyUser } = usePermission();
  const { isFeatureEnabled } = useFeatureFlags();
  const { setEnableOsheConsent } = useContext(CustomerDocumentsContext);
  const {
    osheContractModal,
    isLoading,
    osheContracts,
    sendCustomerFshuInformation,
  } = useCustomerFshuInformation({
    customer,
  });

  const personalInfo = customer.customerInformation.personalInfo;
  const detailRows = useMemo(
    () => ({
      title: tr(customerDetailI18n.header),
      data: [
        {
          label: tr(customerDetailI18n.firstName),
          value: personalInfo?.firstName,
        },
        {
          label: tr(customerDetailI18n.lastName),
          value: personalInfo?.lastName,
        },
        {
          label: tr(customerDetailI18n.fatherName),
          value: personalInfo?.fatherName,
        },
        {
          label: tr(customerDetailI18n.motherName),
          value: personalInfo?.motherName,
        },
        {
          label: tr(customerDetailI18n.birthdayDate),
          value: formatIntlLocalDate(personalInfo?.birthdate),
        },
        {
          label: tr(customerDetailI18n.nationality),
          value: personalInfo?.nationality,
        },
        {
          label: tr(customerDetailI18n.countryOfBirth),
          value: personalInfo?.countryOfBirth,
        },
        {
          label: tr(customerDetailI18n.placeOfBirth),
          value: personalInfo?.birthplace,
        },
        {
          label: tr(customerDetailI18n.gender),
          value: personalInfo?.gender,
        },
        {
          label: tr(customerDetailI18n.civilStatus),
          value: personalInfo?.martialStatus,
        },
        {
          label: tr(customerDetailI18n.otherLastName),
          value: personalInfo?.additionalLastName,
        },
        {
          label: tr(customerDetailI18n.salaryDepositor),
          value: personalInfo?.isSalaryReceivedAtRbal
            ? tr(booleansI18n.yes)
            : tr(booleansI18n.no),
        },
      ],
    }),
    [tr, personalInfo]
  );

  const shouldShowFshuButton =
    customer.customerInformation.midasStatus === MidasStatus.Active &&
    customer.customerInformation.customerStatus?.status ===
      CustomerStatus.Active &&
    !isViewOnlyUser(RESOURCES.CUSTOMER) &&
    isFeatureEnabled("oshee_feature");

  return (
    <Stack gap="0">
      <RowHeader
        label={
          <Text size="16" weight="bold" text={tr(customerDetailI18n.header)} />
        }
        cta={
          shouldShowFshuButton ? (
            <Button
              variant="outline"
              text={tr(customerDetailI18n.fshuContractButton)}
              disabled={isLoading}
              isLoading={isLoading}
              onClick={() => {
                sendCustomerFshuInformation();
                setEnableOsheConsent(true);
              }}
            >
              <Icon
                type="info-filled"
                fgColor={isLoading ? "gray600" : "green600"}
                size="16"
              />
            </Button>
          ) : null
        }
      />
      <InfoRows
        rows={{
          title: detailRows.title,
          data: detailRows.data.map((row) => ({
            ...row,
            id: `customer-detail-${row.label
              .toLowerCase()
              .replace(/\s+/g, "-")}`,
          })),
        }}
      />

      <OsheContractsModal
        isOpen={osheContractModal.isOn}
        customer={customer}
        osheContracts={osheContracts}
        onCancel={osheContractModal.off}
      />
    </Stack>
  );
};
