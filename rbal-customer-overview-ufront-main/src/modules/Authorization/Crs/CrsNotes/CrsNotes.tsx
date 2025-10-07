import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { CrsNotesData } from "~/api/authorization/authorizationApi.types";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { useMemo } from "react";
import { css } from "@emotion/react";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";
import { crsNotesi18n } from "./CrsNotes.i18n";

const styles = {
  content: css({
    marginTop: 16,
  }),
};
interface CrsNotesProps {
  crsNotesData?: CrsNotesData;
}

export const CrsNotes = ({ crsNotesData }: CrsNotesProps) => {
  const { tr } = useI18n();

  const amlAuthorizationNotes = useMemo(
    () => ({
      title: tr(crsNotesi18n.amlAuthorizationNotes),
      data: [
        {
          label: tr(crsNotesi18n.amlAuthorizationCommentsApproval),
          value: crsNotesData?.amlAuthorizationCommentsApproval,
        },
        {
          label: tr(crsNotesi18n.userAmlAuth),
          value: crsNotesData?.userAmlAuth,
        },
        {
          label: tr(crsNotesi18n.amlDateTimeAuth),
          value: crsNotesData?.amlDateTimeAuth,
        },
      ],
    }),
    [tr, crsNotesData]
  );

  const retailKycAuthorizationNotes = useMemo(
    () => ({
      title: tr(crsNotesi18n.retailKycAuthorizationNotes),
      data: [
        {
          label: tr(crsNotesi18n.retailKycUserNotes),
          value: crsNotesData?.retailKycUserNotes,
        },
        {
          label: tr(crsNotesi18n.userRetailAuth),
          value: crsNotesData?.userRetailAuth,
        },
        {
          label: tr(crsNotesi18n.retailDateAuth),
          value: crsNotesData?.retailDateAuth,
        },
      ],
    }),
    [tr, crsNotesData]
  );

  return (
    <>
      <Stack gap="0" customStyle={styles.content}>
        <RowHeader
          label={
            <Text
              size="16"
              weight="bold"
              text={tr(crsNotesi18n?.amlAuthorizationNotes)}
            />
          }
        />
        <InfoRows rows={amlAuthorizationNotes} />
        <Stack gap="0" customStyle={styles.content}>
          <RowHeader
            label={
              <Text
                size="16"
                weight="bold"
                text={tr(crsNotesi18n?.retailKycAuthorizationNotes)}
              />
            }
          />
          <InfoRows rows={retailKycAuthorizationNotes} />
        </Stack>
      </Stack>
    </>
  );
};
