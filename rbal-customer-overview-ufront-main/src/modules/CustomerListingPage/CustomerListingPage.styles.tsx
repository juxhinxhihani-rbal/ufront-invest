import { css, Theme } from "@emotion/react";
import { tokens } from "@rbal-modern-luka/ui-library";

export const styles = {
  link: css({
    "&:hover": { textDecoration: "underline" },
  }),
  bg: (t: Theme) =>
    css({
      paddingTop: tokens.scale(t, "32"),
      paddingBottom: tokens.scale(t, "32"),
    }),

  resultsCard: (theme: Theme) =>
    css({
      position: "relative",
      justifyContent: "center",
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      backgroundColor: tokens.color(theme, "white"),
      bottom: "2rem",
    }),

  loaderWrapper: css({
    width: "100%",
  }),
  tableHeader: css({
    alignItems: "center",
    justifyContent: "space-between",
  }),
  buttonsContainer: (t: Theme) =>
    css({
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: tokens.scale(t, "32"),
    }),
};
