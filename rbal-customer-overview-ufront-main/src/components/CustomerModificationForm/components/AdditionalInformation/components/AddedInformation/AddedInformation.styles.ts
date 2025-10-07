import { css, Theme } from "@emotion/react";
import { tokens } from "@rbal-modern-luka/ui-library";

export const styles = {
  fill: css({
    flex: 1,
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
