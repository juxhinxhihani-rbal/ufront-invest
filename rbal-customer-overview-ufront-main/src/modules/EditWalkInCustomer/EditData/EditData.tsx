import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { useContext } from "react";
import { WalkInCustomerFormContext } from "~/components/WalkInCustomerModificationForm/context/WalkInCustomerFormContext";
import { WalkInCustomerModificationForm } from "~/components/WalkInCustomerModificationForm/WalkInCustomerModificationForm";
import { editDataI18n } from "./EditData.i18n";
import { styles } from "./EditData.styles";

interface EditDataProps {
  stepIdx: number;
}

export const EditData = ({ stepIdx }: EditDataProps) => {
  const { tr } = useI18n();
  const walkingCustomerFormContext = useContext(WalkInCustomerFormContext);

  return (
    <WalkInCustomerModificationForm
      header={
        <Stack gap="4">
          <Text
            text={
              walkingCustomerFormContext.isCreateMode
                ? tr(editDataI18n.createTitle)
                : tr(editDataI18n.title, stepIdx + 1)
            }
            size="24"
            lineHeight="32"
            weight="bold"
            customStyle={styles.title}
          />
          <Text
            text={tr(editDataI18n.createSubtitle)}
            size="14"
            lineHeight="24"
            customStyle={styles.subtitle}
          />
        </Stack>
      }
    />
  );
};
