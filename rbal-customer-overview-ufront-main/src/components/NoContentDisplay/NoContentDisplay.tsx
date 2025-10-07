import { Icon, Stack, Text } from "@rbal-modern-luka/ui-library";
import { styles } from "./NoContentDisplay.styles";
import { NoContentDisplayProps } from "./types";

export const NoContentDisplay = ({
  title,
  description,
  titleSize = "24",
  descriptionSize,
  icon,
  iconSize = "40",
  wrapperCustomStyle,
  titleCustomStyle,
  descriptionCustomStyle,
}: NoContentDisplayProps) => {
  return (
    <Stack customStyle={[styles.wrapper, wrapperCustomStyle]}>
      {!!icon && <Icon type={icon} size={iconSize} />}
      {!!title && (
        <Text
          text={title}
          size={titleSize}
          customStyle={[styles.title, titleCustomStyle]}
        />
      )}
      {!!description && (
        <Text
          text={description}
          size={descriptionSize}
          customStyle={descriptionCustomStyle}
        />
      )}
    </Stack>
  );
};
