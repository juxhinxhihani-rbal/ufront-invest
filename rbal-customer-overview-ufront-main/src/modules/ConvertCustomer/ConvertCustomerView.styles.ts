import { css } from "@emotion/react";

export const styles = {
  container: css({
    gap: "80px!important",
  }),
  menu: css({
    justifyContent: "space-between",
    alignItems: "center",
  }),
  navigationContainer: css({
    flexShrink: 0,
  }),
  contentContainer: css({
    flexGrow: 1,
  }),
};
