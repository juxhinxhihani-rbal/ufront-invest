import { css, Theme } from "@emotion/react";
import { tokens } from "@rbal-modern-luka/ui-library";

export const styles = {
  digitalBankingIcon: (t: Theme) =>
    css({
      background: tokens.color(t, "yellow300"),
      padding: tokens.scale(t, "4"),
    }),
  buttonsContainer: css({
    alignItems: "center",
    justifyContent: "space-between",
  }),
  link: css({
    color: "#131416",
    textDecoration: "none",
  }),
};
