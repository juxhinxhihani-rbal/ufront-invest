import { css, Theme } from "@emotion/react";
import { tokens } from "@rbal-modern-luka/ui-library";

export const styles = {
  checkboxWrapper: css({
    position: "relative",
    cursor: "pointer",
    display: "block",
    width: "20px",
    height: "20px",
    borderRadius: "2px",
    border: "1px solid #AFB1B6",

    input: {
      cursor: "pointer",
      opacity: 0,
    },
  }),

  checkboxChecked: css({
    background: "#AFB1B6",
    border: "none",
  }),

  checkmark: css({
    // cursor: "pointer",
    position: "absolute",
    left: 0,
    top: 0,
  }),

  checkbox: css({}),

  accountItem: (t: Theme) =>
    css({
      height: "3.25rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      alignSelf: "stretch",
      borderBottom: `1px solid #65C9D7`,
      borderTop: `1px solid #65C9D7`,
      paddingTop: `${tokens.scale(t, "8")}`,
      paddingBottom: `${tokens.scale(t, "8")}`,
      boxSizing: "border-box",
    }),
  itemLabel: css({
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "150%",
    letterSpacing: "0.04px",
    color: "#42444C",
  }),
  itemValue: css({
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: "150%",
    letterSpacing: "0.04px",
    color: "#232529",
  }),
};
