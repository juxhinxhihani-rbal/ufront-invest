import { Theme, css } from "@emotion/react";
import { tokens } from "@rbal-modern-luka/ui-library";

export const styles = {
  infoWrapper: (t: Theme) =>
    css({
      alignItems: "left",
      paddingTop: tokens.scale(t, "16"),
      paddingBottom: tokens.scale(t, "16"),
    }),
  titleLabel: css({
    minWidth: "420px",
    display: "flex",
    paddingBottom: "8px",
    alignItems: "flex-start",
    alignSelf: "stretch",
    borderBottom: "1px solid #65C9D7",
  }),
  errorTitleLabel: css({
    minWidth: "420px",
    display: "flex",
    paddingBottom: "8px",
    alignItems: "flex-start",
    alignSelf: "stretch",
    borderBottom: "1px solid #D7424B",
  }),
  titleName: css({
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: "150%",
    letterSpacing: "0.04px",
    color: "#232529",
  }),
  rowLabel: css({
    display: "flex",
    padding: "16px 0px",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "16px",
    alignSelf: "stretch",
  }),
  row: css({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
  }),
  keyRow: css({
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "150%",
    letterSpacing: "0.04px",
    color: "#42444C",
  }),
  valueRow: css({
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: "150%",
    letterSpacing: "0.04px",
    color: "#232529",
  }),
  icon: css({
    "& *": {
      fill: "#65C9D7 !important",
    },
  }),
  errorIcon: css({
    "& *": {
      fill: "#D7424B !important",
    },
  }),
};
