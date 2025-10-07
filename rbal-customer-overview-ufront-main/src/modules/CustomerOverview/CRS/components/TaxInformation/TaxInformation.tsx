import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { CrsTaxInformationDto } from "~/api/customer/customerApi.types";
import { taxInformationI18n } from "./TaxInformation.i18n";
import { TaxInformationTable } from "./TaxInformationTable";

interface TaxInformationProps {
  crsTaxInformation?: CrsTaxInformationDto[];
}

export const TaxInformation = (props: TaxInformationProps) => {
  const { tr } = useI18n();
  const { crsTaxInformation } = props;

  return (
    <Stack gap="4">
      <RowHeader
        label={
          <Text size="16" weight="bold" text={tr(taxInformationI18n.header)} />
        }
      />
      <Stack d="h">
        <TaxInformationTable taxInformations={crsTaxInformation} />
      </Stack>
    </Stack>
  );
};
