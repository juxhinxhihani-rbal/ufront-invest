import { Icon, IconType, Stack, Text } from "@rbal-modern-luka/ui-library";
import { styles } from "./Banner.styles";
import { BannerProps, BannerType } from "./types";

const getBannerIcon = (type: BannerType): IconType => {
  switch (type) {
    case "success":
      return "checkmark";
    case "warning":
      return "warning-tr";
    case "danger":
      return "warning-ring";
    default:
      return "info-ring";
  }
};

export const Banner = ({ title, description, type = "info" }: BannerProps) => {
  const hasTitle = Boolean(title);
  const hasDescription = Boolean(description);

  return (
    <Stack d="h" gap="4" css={[styles.variants[type], styles.wrapper]}>
      <Icon type={getBannerIcon(type)} size={"24"} />

      <Stack gap="4" css={styles.body}>
        {hasTitle && (
          <Text size="16" fontWeight="bold" customStyle={styles.title[type]}>
            {title}
          </Text>
        )}
        {hasDescription && <Text size="16">{description}</Text>}
      </Stack>
    </Stack>
  );
};
