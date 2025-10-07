import { css, Theme } from "@emotion/react";
import { tokens } from "@rbal-modern-luka/ui-library";

export const styles = {
  inputContainer: (t: Theme) =>
    css({
      position: "relative",
      alignItems: "center",
      paddingRight: tokens.scale(t, "20"),

      "& *": {
        fill: "#AFB1B6",
      },
    }),
  inputsWrapper: (t: Theme) =>
    css({
      boxSizing: "border-box",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: tokens.scale(t, "56"),
      padding: `0 ${tokens.scale(t, "16")}`,
      border: "1px solid #EAEAEB",
      borderRadius: tokens.scale(t, "4"),
    }),
  input: css({
    border: "none",
    outline: "none",
    minWidth: "13.5rem",
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

  titleText: (t: Theme) =>
    css({
      textWrap: "nowrap",
      fontSize: tokens.scale(t, "20"),
      lineHeight: tokens.scale(t, "24"),
    }),
  form: (t: Theme) =>
    css({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      background: tokens.color(t, "white"),
      padding: tokens.scale(t, "32"),
    }),

  hiddenSubmitButton: css({
    display: "none",
  }),
};
