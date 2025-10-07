import { css, Theme } from "@emotion/react";
import { tokens } from "@rbal-modern-luka/ui-library";

export const styles = {
  resegmentCustomerIcon: (t: Theme) =>
    css({
      background: tokens.color(t, "yellow300"),
      padding: tokens.scale(t, "4"),
    }),
  disabledResegmentCustomerIcon: (t: Theme) =>
    css({
      background: tokens.color(t, "gray150"),
      padding: tokens.scale(t, "6"),
    }),
  buttonsContainer: css({
    alignItems: "center",
    justifyContent: "space-between",
  }),
  resegmentCustomerLink: css({
    color: "#131416",
    textDecoration: "none",
  }),
  disabledResegmentCustomerLink: (t: Theme) =>
    css({
      textDecoration: "none",
      color: tokens.color(t, "gray550"),
      pointerEvents: "none",
      cursor: "default",
    }),
};
