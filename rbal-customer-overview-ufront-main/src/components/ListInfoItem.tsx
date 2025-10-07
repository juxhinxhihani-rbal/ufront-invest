import React from "react";
import { css, Theme } from "@emotion/react";
import {
  Stack,
  Text,
  Icon,
  IconType,
  tokens,
} from "@rbal-modern-luka/ui-library";

interface Props {
  label: string;
  value: string;
  icon?: IconType;
}

const styles = {
  iconArea: css({
    position: "relative",
  }),
  icon: css({
    position: "absolute",
  }),
  back: (t: Theme) =>
    css({
      content: '""',
      width: "24px",
      marginTop: "6px",
      height: tokens.scale(t, "10"),
      background: tokens.color(t, "yellow300"),
    }),
};

export const ListInfoItem: React.FC<Props> = (props) => {
  const { label, value, icon = "mobile" } = props;

  return (
    <Stack d="h" gap="16" style={{ width: 293 }}>
      <div css={styles.iconArea}>
        <Icon css={styles.icon} type={icon} size="24" fgColor="gray800" />
        <div css={styles.back} />
      </div>
      <Stack gap="4">
        <Text fgColor="gray200" size="12" text={label} />
        <Text size="16" weight="medium" text={value} />
      </Stack>
    </Stack>
  );
};
