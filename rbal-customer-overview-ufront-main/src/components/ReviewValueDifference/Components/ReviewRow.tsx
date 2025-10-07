import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Text, Tr } from "@rbal-modern-luka/ui-library";
import { editCustomerValuesI18n } from "~/modules/EditCustomer/Translations/EditCustomerValues.i18n";
import { Value } from "~/common/utils";
import { getLabel } from "../utils";
import { css } from "@emotion/react";

interface ReviewRowProps {
  oldValue: Value;
  newValue: Value;
  fieldKey?: string;
  label?: string;
}

const styles = {
  oldValue: css({
    color: "#9C3039",
  }),
  newValue: css({
    color: "#19B18C",
  }),
};

export const ReviewRow = ({
  oldValue,
  newValue,
  fieldKey,
  label,
}: ReviewRowProps) => {
  const { tr } = useI18n();

  return (
    <Tr>
      <Text
        text={
          label ?? tr(getLabel(fieldKey as keyof typeof editCustomerValuesI18n))
        }
      />
      <Text customStyle={styles.oldValue} text={oldValue} />
      <Text customStyle={styles.newValue} text={newValue} />
    </Tr>
  );
};
