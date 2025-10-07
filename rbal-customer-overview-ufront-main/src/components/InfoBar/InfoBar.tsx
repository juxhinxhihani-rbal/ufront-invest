import { css, FunctionInterpolation, Theme } from "@emotion/react";
import {
  ColorToken,
  Icon,
  IconType,
  Stack,
  Text,
  theme,
  tokens,
} from "@rbal-modern-luka/ui-library";
import { useMemo } from "react";

const styles = {
  infoBar: (t: Theme) =>
    css({
      boxSizing: "border-box",
      height: tokens.scale(t, "48"),
      alignItems: "center",
      padding: `${tokens.scale(t, "16")} ${tokens.scale(t, "12")}`,
    }),
};

const bgStyles = createBackgroundColors();

interface InfoBarProps {
  text: string;
  bgColor?: ColorToken;
  icon?: IconType;
}

export const InfoBar: React.FC<InfoBarProps> = (props) => {
  const { text, icon = "info-ring", bgColor = "gray100" } = props;

  const fgColor: ColorToken | undefined = useMemo(() => {
    if (
      bgColor.endsWith("500") ||
      bgColor.endsWith("600") ||
      bgColor.endsWith("700") ||
      bgColor.endsWith("800")
    ) {
      return "white";
    }

    return undefined;
  }, [bgColor]);

  return (
    <Stack customStyle={[styles.infoBar, bgStyles[bgColor]]} d="h" gap="8">
      <Icon fgColor={fgColor} type={icon} />
      <Text fgColor={fgColor} text={text} />
    </Stack>
  );
};

// TODO: Reuse ui-library function after moving the component to ui-library
export function createBackgroundColors() {
  return Object.fromEntries(
    Object.keys(theme.colors).map(
      (color) =>
        [
          color as ColorToken,
          (theme: Theme) =>
            css({
              backgroundColor: tokens.color(theme, color as ColorToken, true),
            }),
        ] as [ColorToken, FunctionInterpolation<Theme>]
    )
  );
}
