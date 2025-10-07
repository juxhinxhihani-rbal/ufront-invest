import { css, Theme } from "@emotion/react";
import { tokens } from "@rbal-modern-luka/ui-library";

export const styles = {
  loaderContainer: css({
    margin: "10% 25%",
  }),

  buttonsContainer: css({
    alignItems: "center",
    justifyContent: "space-between",
  }),

  newConfigurationLink: css({
    color: "#131416",
    textDecoration: "none",
  }),

  newConfigurationIcon: (t: Theme) =>
    css({
      background: tokens.color(t, "yellow300"),
      padding: tokens.scale(t, "6"),
    }),

  header: (t: Theme) =>
    css({
      paddingBottom: tokens.scale(t, "20"),
      borderBottom: `1px solid ${tokens.color(t, "gray200")}`,
    }),

  financialRulesTitle: css({
    fontWeight: "bold",
  }),
};
