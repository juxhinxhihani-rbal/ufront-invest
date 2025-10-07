import { css } from "@emotion/react";
import { theme, tokens } from "@rbal-modern-luka/ui-library";

export const styles = {
  personsInfo: css({
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 32,
  }),
  buttonLink: css({
    textDecoration: "none",
  }),
  details: css({
    fontSize: tokens.scale(theme, "18"),
  }),
};
