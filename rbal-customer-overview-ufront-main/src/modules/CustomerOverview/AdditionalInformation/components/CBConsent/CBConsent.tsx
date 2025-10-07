import React, { useMemo } from "react";
import {
  formatIntlLocalDateTime,
  useI18n,
} from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { CBConsentDto, ConsentStatus } from "~/api/customer/customerApi.types";
import { consentStatusI18n } from "~/features/i18n/consentStatus.i18n";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { cbConsenti18n } from "./CBConsent.i18n";

interface CBConsentProps {
  cbConsent?: CBConsentDto;
}

export const CBConsent: React.FC<CBConsentProps> = (props) => {
  const { cbConsent } = props;

  const { tr } = useI18n();

  const infoRows = useMemo(
    () => ({
      title: tr(cbConsenti18n.header),
      data: [
        {
          label: tr(cbConsenti18n.branchDigital),
          value: tr(
            consentStatusI18n[cbConsent?.branchOrDigital ?? ConsentStatus.None]
          ),
        },
        {
          label: tr(cbConsenti18n.cbConsentDate),
          value: formatIntlLocalDateTime(cbConsent?.cbConsentDateTime),
        },
      ],
    }),
    [cbConsent, tr]
  );

  return (
    <Stack gap="0">
      <RowHeader
        label={<Text size="16" weight="bold" text={tr(cbConsenti18n.header)} />}
      />
      <InfoRows rows={infoRows} />
    </Stack>
  );
};
