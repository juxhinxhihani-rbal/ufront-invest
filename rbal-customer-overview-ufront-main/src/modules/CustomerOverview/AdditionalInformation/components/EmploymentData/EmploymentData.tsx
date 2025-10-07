import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { employmentDatai18n } from "./EmploymentData.i18n";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { EmploymentDto } from "~/api/customer/customerApi.types";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";
import { useMemo } from "react";

interface EmploymentDataProps {
  employment?: EmploymentDto;
}

export const EmploymentData: React.FC<EmploymentDataProps> = ({
  employment,
}) => {
  const { tr } = useI18n();

  const employmentRows = useMemo(
    () => ({
      title: tr(employmentDatai18n.header),
      data: [
        {
          label: tr(employmentDatai18n.profession),
          value: employment?.profession.profession,
        },
        {
          label: tr(employmentDatai18n.ministry),
          value: employment?.ministry.ministry,
        },
        {
          label: tr(employmentDatai18n.institution),
          value: employment?.institution.dicastery,
        },
      ],
    }),
    [employment, tr]
  );

  return (
    <Stack gap="0">
      <RowHeader
        label={
          <Text size="16" weight="bold" text={tr(employmentDatai18n.header)} />
        }
      />
      <InfoRows rows={employmentRows} />
    </Stack>
  );
};
