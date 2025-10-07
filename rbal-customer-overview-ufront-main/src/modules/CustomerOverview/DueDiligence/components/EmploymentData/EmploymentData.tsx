import { useMemo } from "react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { DueDiligenceEmploymentDto } from "~/api/customer/customerApi.types";
import { getNameById } from "~/common/utils";
import { useDiligenceEmployTypes } from "~/features/dictionaries/dictionariesQueries";
import { booleansI18n } from "~/features/i18n";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";
import { RowHeader } from "../../../components/RowHeader/RowHeader";
import { employmentDataI18n } from "./EmploymentData.i18n";

interface EmploymentProps {
  employment?: DueDiligenceEmploymentDto;
}

export const EmploymentData: React.FC<EmploymentProps> = (props) => {
  const { employment } = props;
  const { tr } = useI18n();

  const diligenceEmployTypesQuery = useDiligenceEmployTypes();

  const baseData = useMemo(() => {
    const data = [
      {
        label: tr(employmentDataI18n.employment),
        value: getNameById(
          diligenceEmployTypesQuery.data,
          employment?.employmentTypeId
        ),
        isGettingValue: diligenceEmployTypesQuery.isLoading,
      },
      {
        label: tr(employmentDataI18n.clientHasManagerialPosition),
        value: employment?.clientHasManagerialPosition
          ? tr(booleansI18n.yes)
          : tr(booleansI18n.no),
      },
    ];

    if (employment?.clientHasManagerialPosition) {
      data.push({
        label: tr(employmentDataI18n.specify),
        value: employment?.specify ?? "",
      });
    }

    return data;
  }, [
    tr,
    diligenceEmployTypesQuery.data,
    diligenceEmployTypesQuery.isLoading,
    employment,
  ]);

  const employmentRows = useMemo(() => {
    return {
      title: tr(employmentDataI18n.header),
      data: baseData,
    };
  }, [tr, baseData]);

  return (
    <Stack gap="0">
      <RowHeader
        label={
          <Text size="16" weight="bold" text={tr(employmentDataI18n.header)} />
        }
      />
      <InfoRows rows={employmentRows} />
    </Stack>
  );
};
