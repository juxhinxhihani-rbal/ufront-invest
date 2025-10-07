import { css } from "@emotion/react";
import { tokens } from "@rbal-modern-luka/ui-library";
import { Theme } from "react-select";

export const authorizationStyles = {
  container: css({ flexWrap: "wrap", flex: 1, width: "100%" }),

  customerAuthorizationContainer: css({
    display: "flex",
    flexDirection: "column",
  }),

  wrappedCell: (t: Theme) =>
    css({
      [tokens.mediaQueries(t, "xl")]: {
        textWrap: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
      },
    }),
  clickableRow: css({
    cursor: "pointer",
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: "#DFF2F666",
    },
  }),
  disabledRow: css({
    pointerEvents: "none",
  }),
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

  searchFieldWidth: css({
    width: "20%",
  }),

  sectionFlex: css({
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    paddingBottom: "2rem",
  }),

  buttons: css({
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
  }),

  tableHeader: css({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  }),
};
