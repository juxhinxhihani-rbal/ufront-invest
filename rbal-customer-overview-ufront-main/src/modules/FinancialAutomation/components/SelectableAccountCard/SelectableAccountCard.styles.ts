import { css, Theme } from "@emotion/react";
import { tokens } from "@rbal-modern-luka/ui-library";

export const styles = {
  listItem: (t: Theme) =>
    css({
      padding: tokens.scale(t, "6"),
    }),

  cardDetailsWrapper: css({
    marginLeft: 15,
    width: "100%",
    flexWrap: "wrap",
  }),

  cardSection: css({
    minWidth: "31%",
    flexShrink: 0,
  }),
};
