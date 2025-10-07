import { css } from "@emotion/react";

export const styles = {
  row: css({
    width: "100%",
  }),
  column: css({
    width: "100%",
    display: "flex",
    flexDirection: "column",
  }),
  inputWrapper: css({
    flex: "1 0 calc(33% - 2rem)",
  }),
};
