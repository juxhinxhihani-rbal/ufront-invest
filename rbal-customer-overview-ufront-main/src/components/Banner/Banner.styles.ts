import { css } from "@emotion/react";

export const styles = {
  wrapper: css({
    display: "flex",
    padding: "16px 12px 16px 8px",
    borderLeftWidth: 4,
    borderRadius: 4,
    boxSizing: "border-box",
    flexDirection: "row",
  }),
  variants: {
    danger: css({
      border: `1px solid #b70017`,
      backgroundColor: "#ffa6a14d",

      "& *": {
        fill: "#b70017 !important",
      },
    }),
    warning: css({
      border: `1px solid #825000`,
      backgroundColor: "#ffeacc",

      "& *": {
        fill: "#825000 !important",
      },
    }),
    success: css({
      border: `1px solid #207100`,
      backgroundColor: "#dffdd8",

      "& *": {
        fill: "#207100 !important",
      },
    }),
    info: css({
      border: `1px solid #6644ad`,
      backgroundColor: "#f1ebff",

      "& *": {
        fill: "#6644ad !important",
      },
    }),
  },
  body: css({
    display: "flex",
    flexDirection: "column",
  }),
  title: {
    danger: css({
      color: "#b70017",
    }),
    warning: css({
      color: "#825000",
    }),
    success: css({
      color: "#207100",
    }),
    info: css({
      color: "#6644ad",
    }),
  },
};
