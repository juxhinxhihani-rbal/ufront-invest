import { css } from "@emotion/react";
import { theme, tokens } from "@rbal-modern-luka/ui-library";

export const styles = {
  fill: css({
    flex: 1,
  }),
  buttonLink: css({
    textDecoration: "none",
  }),
  details: css({
    fontSize: tokens.scale(theme, "18"),
  }),
  dataWrapper: css({
    marginTop: 32,
  }),
  dataRow: css({
    borderBottom: `1px solid ${tokens.color(theme, "gray150")}`,
  }),
  dataContainer: css({
    flex: 1,
    height: "auto",
    paddingBottom: tokens.scale(theme, "8"),
    paddingTop: tokens.scale(theme, "8"),
    alignItems: "center",
  }),
  content: css({
    marginTop: 16,
  }),
};
