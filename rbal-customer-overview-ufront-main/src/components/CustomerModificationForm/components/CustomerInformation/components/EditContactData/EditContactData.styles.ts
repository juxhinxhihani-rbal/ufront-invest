import { css } from "@emotion/react";

export const styles = {
  container: css({
    flexWrap: "wrap",
    flex: 1,
    display: "flex",
    flexDirection: "row",
  }),
  inputWrapper: css({
    flex: "1 0 calc(33% - 2rem)",
  }),
  shortSelect: css({
    minWidth: 95,
  }),
  stackGrow: css({
    flexGrow: 1,
  }),
  customInput: css({
    width: "100%",
  }),
  prefixText: css({
    color: "#8F9199",
  }),
  phoneNumbers: css({
    display: "flex",
    flexDirection: "row",
  }),
};
