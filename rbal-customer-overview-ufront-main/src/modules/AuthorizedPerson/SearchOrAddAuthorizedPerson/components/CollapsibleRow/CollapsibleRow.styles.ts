import { css, Theme } from "@emotion/react";
import { tokens } from "@rbal-modern-luka/ui-library";

export const styles = {
  rowContentWrapper: css({
    justifyContent: "space-between",
    alignItems: "center",
  }),

  radio: (t: Theme) =>
    css({
      cursor: "pointer",
      outline: "none",
      accentColor: "#00758F",
      height: tokens.scale(t, "20"),
      width: tokens.scale(t, "20"),
    }),

  centeredContent: css({
    alignItems: "center",
  }),

  flexContainer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  subRows: css({
    fontSize: "12px",
    lineHeight: "16px",
    color: "#8F9199",
    fontWeight: "400",
  }),

  customerNoText: css({
    textWrap: "nowrap",
  }),

  collapsibleRow: (t: Theme) =>
    css({
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: `${tokens.scale(t, "18")} ${tokens.scale(t, "32")}`,
      backgroundColor: "#F7F7F8",
      border: "1px solid #EAEAEB",
      maxHeight: "86px",
      transition: "height 0.25s ease",
    }),

  closedRow: css({
    padding: 0,
    maxHeight: 0,
    visibility: "hidden",
  }),
};
