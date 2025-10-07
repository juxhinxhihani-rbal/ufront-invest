import { css, Theme } from "@emotion/react";
import { tokens } from "@rbal-modern-luka/ui-library";

export const styles = {
  title: (t: Theme) =>
    css({
      color: "#131416",
      fontSize: tokens.scale(t, "20"),
      lineHeight: tokens.scale(t, "32"),
      fontWeight: tokens.fontWeight(t, "bold"),
    }),
  subtitle: css({
    color: "#42444C",
  }),

  personsInfo: css({
    display: "flex",
    alignItems: "flex-start",
    alignSelf: "stretch",
  }),

  button: css({
    width: "fit-content",
    textDecoration: "none",
  }),
  buttonsWrapper: css({
    justifyContent: "space-between",
  }),
  addedRights: (t: Theme) =>
    css({
      padding: `${tokens.scale(t, "12")} 0`,
      color: "#00997D",
      borderBottom: "1px solid #EAEAEB",

      "&:last-of-type": {
        border: "none",
      },
    }),
  removedRights: (t: Theme) =>
    css({
      padding: `${tokens.scale(t, "12")} 0`,
      color: "#D7424B",
      borderBottom: "1px solid #EAEAEB",

      "&:last-of-type": {
        border: "none",
      },
    }),
  infoWithBorder: css({
    borderBottom: "1px solid #EAEAEB",
  }),
};
