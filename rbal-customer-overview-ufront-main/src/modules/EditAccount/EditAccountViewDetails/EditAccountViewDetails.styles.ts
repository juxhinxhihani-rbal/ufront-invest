import { css, Theme } from "@emotion/react";
import { theme, tokens } from "@rbal-modern-luka/ui-library";

export const editAccountViewDetailsStyles = {
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

  editCustomerIcon: (t: Theme) =>
    css({
      background: tokens.color(t, "yellow300"),
      padding: tokens.scale(t, "6"),
    }),

  amendForCloseCustomerIcon: (t: Theme) =>
    css({
      background: tokens.color(t, "red300"),
      padding: tokens.scale(t, "6"),
    }),

  closeCustomerIcon: (t: Theme) =>
    css({
      background: tokens.color(t, "red500"),
      padding: tokens.scale(t, "6"),
    }),

  activateAccountIcon: (t: Theme) =>
    css({
      background: tokens.color(t, "green400"),
      padding: tokens.scale(t, "6"),
    }),

  buttonsContainer: css({
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
  }),
  link: css({
    color: "#131416",
    textDecoration: "none",
    display: "flex",
    gap: "1rem",
  }),

  checkbox: (t: Theme) =>
    css({
      accentColor: "#00758F",
      height: tokens.scale(t, "20"),
      width: tokens.scale(t, "20"),
      marginRight: tokens.scale(t, "12"),
      flex: 1,
      alignItems: "flex-start",
    }),

  errorButtonLink: css({
    textDecoration: "none",
  }),
};
