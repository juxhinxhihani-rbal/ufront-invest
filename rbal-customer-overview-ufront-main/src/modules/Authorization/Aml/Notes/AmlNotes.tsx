import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { AmlNotesData } from "~/api/authorization/authorizationApi.types";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { amlNotesi18n } from "./AmlNotes.i18n";
import { styles } from "../../Customer/CustomerAuthorizationDetails.styles";
import { useMemo } from "react";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";

interface AmlNotesProps {
  amlNotes?: AmlNotesData;
}

export const AmlNotes: React.FC<AmlNotesProps> = ({ amlNotes }) => {
  const { tr } = useI18n();

  const amlAuthorizationNotesData = useMemo(
    () => ({
      id: 1,
      title: tr(amlNotesi18n.amlAuthorizationNotesData),
      data: [
        {
          label: tr(amlNotesi18n.userAmlAuth),
          value: amlNotes?.userAmlAuth,
        },
        {
          label: tr(amlNotesi18n.amlDateTimeAuth),
          value: amlNotes?.amlDateTimeAuth,
        },
        {
          label: tr(amlNotesi18n.amlAuthorizationCommentsApproval),
          value: amlNotes?.amlAuthorizationCommentsApproval,
        },
      ],
    }),
    [tr, amlNotes]
  );

  const retailKycAuthorizationNotesData = useMemo(
    () => ({
      id: 2,
      title: tr(amlNotesi18n.retailKycAuthorizationNotesData),
      data: [
        {
          label: tr(amlNotesi18n.userRetailAuth),
          value: amlNotes?.userRetailAuth,
        },
        {
          label: tr(amlNotesi18n.retailDateTimeAuth),
          value: amlNotes?.retailDateTimeAuth,
        },
        {
          label: tr(amlNotesi18n.retailKycUserNotes),
          value: amlNotes?.retailKycUserNotes,
        },
      ],
    }),
    [tr, amlNotes]
  );

  const sections = useMemo(
    () => [amlAuthorizationNotesData, retailKycAuthorizationNotesData],
    [amlAuthorizationNotesData, retailKycAuthorizationNotesData]
  );

  return (
    <>
      {sections.map((section) => (
        <Stack gap="0" customStyle={styles.content} key={section.id}>
          <RowHeader
            label={<Text size="16" weight="bold" text={section.title} />}
          />
          <InfoRows rows={section} />
        </Stack>
      ))}
    </>
  );
};
