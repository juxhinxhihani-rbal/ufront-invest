import { useMemo } from "react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { BoaDto } from "~/api/customer/customerApi.types";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { boaDatai18n } from "./BoaData.i18n";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";

interface BoaDataProps {
  boaData?: BoaDto;
}

export const BoaData: React.FC<BoaDataProps> = ({ boaData }) => {
  const { tr } = useI18n();

  const boaRows = useMemo(
    () => ({
      title: tr(boaDatai18n.header),
      data: [
        {
          label: tr(boaDatai18n.boaSegment),
          value: boaData?.boaSegment,
        },
        {
          label: tr(boaDatai18n.description),
          value: boaData?.description,
        },
      ],
    }),
    [tr, boaData]
  );

  return (
    <Stack gap="0">
      <RowHeader
        label={<Text size="16" weight="bold" text={tr(boaDatai18n.header)} />}
      />

      <InfoRows rows={boaRows} />
    </Stack>
  );
};
