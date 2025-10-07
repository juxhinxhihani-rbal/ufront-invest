import { css, Theme } from "@emotion/react";
import { tokens } from "@rbal-modern-luka/ui-library";

export const styles = {
  contentWrapper: (t: Theme) =>
    css({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      paddingTop: tokens.scale(t, "56"),
    }),
  title: (t: Theme) =>
    css({
      fontSize: tokens.scale(t, "40"),
      fontWeight: tokens.fontWeight(t, "bold"),
    }),
  button: css({
    width: "fit-content",
  }),
  input: css({
    border: "none",
    outline: "none",
    width: "100%",
    minWidth: "200px",
  }),
  inputsWrapper: (t: Theme) =>
    css({
      display: "flex",
      justifyContent: "space-between",
      padding: `${tokens.scale(t, "12")} ${tokens.scale(t, "16")}`,
      margin: `${tokens.scale(t, "40")} 0`,
      border: "1px solid #EAEAEB",
      borderRadius: tokens.scale(t, "4"),
    }),
  inputContainer: (t: Theme) =>
    css({
      position: "relative",
      width: "100%",
      alignItems: "center",
      paddingRight: tokens.scale(t, "20"),

      "& *": {
        fill: "#AFB1B6",
      },
    }),
  clearInputIcon: css({
    position: "absolute",
    right: 0,
    cursor: "pointer",
    "& *": {
      fill: "#131416",
    },
  }),
  separator: (t: Theme) =>
    css({
      height: tokens.scale(t, "32"),
      width: "1px",
      background: "#AFB1B6",
    }),
  buttonsStack: (t: Theme) =>
    css({
      alignItems: "center",
      paddingTop: tokens.scale(t, "24"),
    }),
};
