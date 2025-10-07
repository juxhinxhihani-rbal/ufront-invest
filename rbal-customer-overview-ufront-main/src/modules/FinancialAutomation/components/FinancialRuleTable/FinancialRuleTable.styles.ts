import { css, Theme } from "@emotion/react";
import { tokens } from "@rbal-modern-luka/ui-library";

export const styles = {
  createNewCofiguration: css({
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    justifyContent: "space-between",
    width: "fit-content",
    color: "#131416",
  }),

  createNewCofigurationIcon: (t: Theme) =>
    css({
      background: tokens.color(t, "yellow300"),
      padding: tokens.scale(t, "4"),
      marginLeft: tokens.scale(t, "8"),
    }),

  dotsMenuWrapper: (t: Theme) =>
    css({
      paddingTop: tokens.scale(t, "4"),
    }),
};
