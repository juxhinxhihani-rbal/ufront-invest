import { css, Theme } from "@emotion/react";
import { tokens } from "@rbal-modern-luka/ui-library";

export const styles = {
  inputWrapper: (t: Theme) =>
    css({
      padding: tokens.scale(t, "10"),
      paddingLeft: 0,
    }),
  label: css({
    display: "flex",
    alignItems: "center",
  }),
  checkbox: (t: Theme) =>
    css({
      accentColor: "#00758F",
      height: tokens.scale(t, "20"),
      width: tokens.scale(t, "20"),
      marginRight: tokens.scale(t, "12"),
    }),
};
