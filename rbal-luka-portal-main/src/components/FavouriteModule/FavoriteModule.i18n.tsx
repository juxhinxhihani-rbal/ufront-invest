import { css, Theme } from "@emotion/react";
import { theme, tokens } from "@rbal-modern-luka/ui-library";

export const favoriteModuleStyles = {
  header: css({
    display: "flex",
    alignItems: "center",
  }),

  badge: (t: Theme) =>
    css({
      backgroundColor: `${tokens.color(t, "yellow300")}`,
      padding: "0.1rem 0.5rem",
      borderRadius: tokens.borderRadius(theme, "radius2"),
      fontWeight: tokens.fontWeight(theme, "medium"),
    }),
};
