import { css, Theme } from "@emotion/react";
import { tokens } from "@rbal-modern-luka/ui-library";

export const styles = {
  button: css({
    width: "fit-content",
    textDecoration: "none",
  }),
  buttonsWrapper: css({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }),
  headerTitle: (t: Theme) =>
    css({
      fontSize: tokens.scale(t, "24"),
      lineHeight: tokens.scale(t, "24"),
    }),

  subtitle: css({
    display: "flex",
    marginBottom: "0.5rem",
  }),

  headertitle: css({
    marginBottom: 8,
  }),
};
