import { css } from "@emotion/react";

export const styles = {
  table: css({ overflowX: "auto" }),
  paginationButtons: css({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "& button[disabled] svg": {
      opacity: 0.3,
    },
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "1.5rem",
  }),
};
