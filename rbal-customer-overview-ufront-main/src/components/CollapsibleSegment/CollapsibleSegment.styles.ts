import { css, Theme } from "@emotion/react";
import { tokens } from "@rbal-modern-luka/ui-library";

export const styles = {
  container: (t: Theme) =>
    css({
      maxHeight: tokens.scale(t, "56"),
      cursor: "pointer",
    }),
  childrenContainer: css({ flexWrap: "wrap" }),
  opened: css({
    maxHeight: "none",
  }),
  hidden: {
    display: "none",
  },
  collapseHeader: (t: Theme) =>
    css({
      justifyContent: "space-between",
      borderBottom: "1px solid #65C9D7",
      padding: `${tokens.scale(t, "4")} 0`,

      "& *": {
        fill: "#65C9D7",
      },
    }),
  headerBorderError: css({
    borderColor: "#D7424B",
  }),
  iconError: css({
    "& *": {
      fill: "#D7424B",
    },
  }),
  collapseText: (t: Theme) =>
    css({
      fontSize: tokens.scale(t, "16", true),
      lineHeight: tokens.scale(t, "24", true),
    }),
  centerContent: css({
    alignItems: "center",
  }),
  disabledArrow: css({
    "& *": {
      fill: "#AFB1B6",
    },
  }),
};
