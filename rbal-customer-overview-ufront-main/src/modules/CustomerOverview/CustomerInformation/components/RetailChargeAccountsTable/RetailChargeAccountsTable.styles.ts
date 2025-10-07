import { Theme, css } from "@emotion/react";
import { tokens } from "@rbal-modern-luka/ui-library";

export const styles = {
  table: {
    width: "unset",
    flexGrow: 1,
  },
  collapsibleRow: (t: Theme) =>
    css({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingTop: tokens.scale(t, "8"),
      paddingBottom: tokens.scale(t, "6"),
      backgroundColor: "#F7F7F8",
      "& > *": {
        margin: "0 20px",
      },
    }),
  // TODO: remove after implementing number-like columns in ui-lib
  alignRight: (t: Theme) =>
    css({
      [tokens.mediaQueries(t, "xl")]: {
        textAlign: "right",
      },
    }),
  collapseButtonWrapper: css({
    display: "flex",
    justifyContent: "end",
  }),
  radio: (t: Theme) =>
    css({
      cursor: "pointer",
      outline: "none",
      accentColor: "#00758F",
      height: tokens.scale(t, "20"),
      width: tokens.scale(t, "20"),
      marginRight: tokens.scale(t, "12"),
    }),
  arrowDown: css({
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "0.4rem",
  }),
};
