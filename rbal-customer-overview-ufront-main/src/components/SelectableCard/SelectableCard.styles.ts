import { css, Theme } from "@emotion/react";
import { tokens } from "@rbal-modern-luka/ui-library";

export const styles = {
  wrapper: (t: Theme) =>
    css({
      padding: tokens.scale(t, "14"),
      border: `1px solid ${tokens.color(t, "gray200")}`,
      borderRadius: tokens.borderRadius(t, "radius1"),
      gap: 10,
      alignItems: "center",
      cursor: "pointer",
      userSelect: "none",
      "&:hover": {
        opacity: 0.9,
      },
      "&:active": {
        opacity: 0.75,
      },
    }),
  wrapperActive: css({
    border: "1px solid rgb(12 123 163)",
    backgroundColor: "aliceblue",
  }),
  activeBorder: css({
    border: "1px solid rgb(12 123 163)",
  }),
  bigCircle: (t: Theme) =>
    css({
      borderRadius: "50%",
      padding: 2,
      border: `1px solid ${tokens.color(t, "gray550")}`,
    }),
  smallCircle: (t: Theme) =>
    css({
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      backgroundColor: tokens.color(t, "gray200"),
    }),
  activeSmallCircle: css({
    backgroundColor: "rgb(12 123 163)",
  }),
};
