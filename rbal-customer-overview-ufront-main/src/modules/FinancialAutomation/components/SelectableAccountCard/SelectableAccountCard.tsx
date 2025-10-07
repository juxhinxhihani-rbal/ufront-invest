import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { SelectableCard } from "~/components/SelectableCard/SelectableCard";
import { selectableAccountCardI18n } from "./SelectableAccountCard.i18n";
import { styles } from "./SelectableAccountCard.styles";
import { SelectableAccountCardProps } from "./types";

export const SelectableAccountCard = ({
  account,
  isActive = false,
  onClick,
  wrapperCustomStyle,
}: SelectableAccountCardProps) => {
  const { tr } = useI18n();
  return (
    <SelectableCard
      key={account.productId}
      isActive={isActive}
      wrapperCustomStyle={wrapperCustomStyle}
      onClick={onClick}
    >
      <Stack d="h" customStyle={styles.cardDetailsWrapper}>
        <Stack gap="4" customStyle={styles.cardSection}>
          <Text
            text={tr(selectableAccountCardI18n.accountNumberLabel)}
            fgColor="gray200"
          />
          <Text text={account.accountNumber} />
        </Stack>
        <Stack gap="4" customStyle={styles.cardSection}>
          <Text
            text={tr(selectableAccountCardI18n.currencyLabel)}
            fgColor="gray200"
          />
          <Text text={account.currency} />
        </Stack>
        <Stack gap="4" customStyle={styles.cardSection}>
          <Text
            text={tr(selectableAccountCardI18n.accountTypeLabel)}
            fgColor="gray200"
          />
          <Text text={account.segment} />
        </Stack>
      </Stack>
    </SelectableCard>
  );
};
