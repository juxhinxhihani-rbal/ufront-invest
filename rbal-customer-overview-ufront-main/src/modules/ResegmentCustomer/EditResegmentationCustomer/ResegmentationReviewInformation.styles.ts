import { css, Theme } from "@emotion/react";
import { tokens } from "@rbal-modern-luka/ui-library";

export const styles = {
  button: css({
    width: "fit-content",
    textDecoration: "none",
  }),
  buttonsWrapper: css({
    display: "flex",
    justifyContent: "flex-end",
  }),
  paragraph: (t: Theme) =>
    css({
      fontSize: tokens.scale(t, "12"),
      lineHeight: tokens.scale(t, "24"),
    }),
  stack: css({
    padding: "0 8.5rem",
  }),
  ul: css({
    paddingInlineStart: "unset",
    listStylePosition: "inside",
    marginBlockStart: "unset",
  }),
};
