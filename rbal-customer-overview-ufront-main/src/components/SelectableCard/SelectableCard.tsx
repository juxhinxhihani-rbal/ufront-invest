import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { styles } from "./SelectableCard.styles";
import { SelectableCardProps } from "./types";

export const SelectableCard = ({
  title,
  children,
  isActive = false,
  wrapperCustomStyle,
  onClick,
}: SelectableCardProps) => {
  return (
    <Stack
      d="h"
      customStyle={[
        styles.wrapper,
        isActive && styles.wrapperActive,
        wrapperCustomStyle,
      ]}
      onClick={onClick}
    >
      <Stack customStyle={[styles.bigCircle, isActive && styles.activeBorder]}>
        <Stack
          customStyle={[
            styles.smallCircle,
            isActive && styles.activeSmallCircle,
          ]}
        />
      </Stack>

      {title ? (
        <Text text={title} size="16" lineHeight="24" weight="medium" />
      ) : (
        children
      )}
    </Stack>
  );
};
