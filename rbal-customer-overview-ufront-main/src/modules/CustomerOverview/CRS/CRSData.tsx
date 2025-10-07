import { css, Theme } from "@emotion/react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text, tokens } from "@rbal-modern-luka/ui-library";
import { memo } from "react";
import {
  CustomerDto,
  CustomerStatusCode,
} from "~/api/customer/customerApi.types";
import { useFeatureFlags } from "~/features/hooks/useFlags";
import { RowHeader } from "../components/RowHeader/RowHeader";
import { CRSDetails } from "./components/CRSDetails/CRSDetails";
import { TaxInformation } from "./components/TaxInformation/TaxInformation";
import { crsDataI18n } from "./CRSData.i18n";

interface CRSDataProps {
  customer: CustomerDto;
}

const styles = {
  content: (t: Theme) =>
    css({
      marginTop: tokens.scale(t, "24"),
    }),
  crsAuthNote: (t: Theme) =>
    css({
      paddingTop: tokens.scale(t, "16"),
      paddingBottom: tokens.scale(t, "16"),
    }),
};

export const CRSData: React.FC<CRSDataProps> = memo((props) => {
  const { customer } = props;
  const { tr } = useI18n();
  const { isFeatureEnabled } = useFeatureFlags();
  return (
    <Stack gap="40" customStyle={styles.content}>
      <CRSDetails crsDetails={customer.crs?.crsDetails} />
      <TaxInformation crsTaxInformation={customer.crs?.crsTaxInformation} />
      {isFeatureEnabled("authorization_crs") &&
        customer.customerInformation.customerStatus?.customerStatusId ===
          CustomerStatusCode.RejectPiForCrsApproval && (
          <Stack gap="0">
            <RowHeader
              label={
                <Text
                  size="16"
                  weight="bold"
                  text={tr(crsDataI18n.crsAuthNote)}
                />
              }
            />
            <Text
              customStyle={styles.crsAuthNote}
              text={customer.notes.crsAuthNote}
            />
          </Stack>
        )}
    </Stack>
  );
});
