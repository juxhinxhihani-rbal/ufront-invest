import { css, Theme } from "@emotion/react";
import { tokens } from "@rbal-modern-luka/ui-library";

export const styles = {
  subTitle: (t: Theme) =>
    css({
      fontSize: tokens.scale(t, "24"),
      color: "#8F9199",
    }),
  buttonContainer: css({
    cursor: "pointer",
    alignItems: "center",
  }),
  buttonText: (t: Theme) =>
    css({
      fontSize: tokens.scale(t, "20"),
      fontWeight: tokens.fontWeight(t, "bold"),
      color: "#00758F",
    }),
  buttonIcon: css({
    "& *": {
      fill: "#00758F !important",
    },
  }),
};
