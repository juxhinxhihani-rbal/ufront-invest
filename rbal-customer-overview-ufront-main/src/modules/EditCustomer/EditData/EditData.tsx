import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { useContext } from "react";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";
import { CustomerModificationForm } from "~/components/CustomerModificationForm/CustomerModificationForm";
import { editDataI18n } from "./EditData.i18n";
import { styles } from "./EditData.styles";

interface EditDataProps {
  stepIdx: number;
}

export const EditData = ({ stepIdx }: EditDataProps) => {
  const { tr } = useI18n();
  const customerFormContext = useContext(CustomerFormContext);

  return (
    <CustomerModificationForm
      isResegmentation={customerFormContext.isResegmentation}
      header={
        <Stack gap="4">
          <Text
            text={
              customerFormContext.isCreateMode
                ? tr(editDataI18n.createTitle)
                : tr(editDataI18n.title, stepIdx + 1)
            }
            size="24"
            lineHeight="32"
            weight="bold"
            customStyle={styles.title}
          />
          <Text
            text={tr(
              customerFormContext.isCreateMode
                ? editDataI18n.createSubtitle
                : editDataI18n.updateSubtitle
            )}
            size="14"
            lineHeight="24"
            customStyle={styles.subtitle}
          />
        </Stack>
      }
    />
  );
};
