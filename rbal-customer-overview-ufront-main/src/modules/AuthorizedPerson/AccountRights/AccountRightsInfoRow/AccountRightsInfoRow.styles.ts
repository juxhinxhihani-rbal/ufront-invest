import { css } from "@emotion/react";

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
    background: "#00758F",
    border: "none",
  }),

  checkmark: css({
    cursor: "pointer",
    position: "absolute",
    left: 0,
    top: 0,
  }),

  checkbox: css({}),
};
