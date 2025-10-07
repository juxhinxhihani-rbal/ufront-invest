import { css, Theme } from "@emotion/react";
import { tokens } from "@rbal-modern-luka/ui-library";

export const styles = {
  header: (t: Theme) =>
    css({
      paddingBottom: tokens.scale(t, "16"),
      borderBottom: `1px solid ${tokens.color(t, "gray150")}`,
    }),

  contentWrapper: css({
    marginTop: 15,
    marginBottom: 15,
  }),

  selectContainer: css({
    width: "33%",
  }),

  buttonsWrapper: (t: Theme) =>
    css({
      borderTop: `1px solid ${tokens.color(t, "gray150")}`,
      paddingTop: 20,
      justifyContent: "space-between",
    }),

  button: css({
    width: "fit-content",
    textDecoration: "none",
  }),
};
