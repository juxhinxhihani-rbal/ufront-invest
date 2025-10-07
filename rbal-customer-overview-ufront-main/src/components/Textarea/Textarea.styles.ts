import { css } from "@emotion/react";
import { theme, tokens } from "@rbal-modern-luka/ui-library";

export const styles = {
  fullWidthTextarea: css({
    width: "100%",
  }),
  textarea: css({
    width: "auto",
    fontFamily: theme.fontFamily.default,
    fontSize: tokens.scale(theme, "14"),
    borderRadius: tokens.borderRadius(theme, "radius1"),
    resize: "none",
    padding: 12,
    borderColor: "#EAEAEB",
    "&:focus": {
      outline: "none",
      borderColor: "#EAEAEB",
    },
  }),
  error: css({
    borderColor: tokens.color(theme, "red500"),
    "&:focus": {
      outline: "none",
      borderColor: tokens.color(theme, "red500"),
    },
  }),
};
