import { css, Theme } from "@emotion/react";
import { tokens } from "@rbal-modern-luka/ui-library";

export const styles = {
  inputWrapper: (t: Theme) =>
    css({
      padding: tokens.scale(t, "10"),
      paddingLeft: 0,
    }),
  textWrapper: (t: Theme) =>
    css({
      borderLeft: "1px solid #AFB1B6",
      paddingLeft: tokens.scale(t, "16"),
    }),
  label: css({
    display: "flex",
    alignItems: "center",
  }),
  radio: (t: Theme) =>
    css({
      outline: "none",
      accentColor: "#00758F",
      height: tokens.scale(t, "20"),
      width: tokens.scale(t, "20"),
      marginRight: tokens.scale(t, "12"),
    }),
};
