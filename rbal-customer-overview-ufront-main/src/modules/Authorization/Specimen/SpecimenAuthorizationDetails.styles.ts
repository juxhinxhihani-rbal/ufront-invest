import { css } from "@emotion/react";
import { theme, tokens } from "@rbal-modern-luka/ui-library";

export const specimenAuthorizationDetailsStyles = {
  details: css({
    fontSize: tokens.scale(theme, "18"),
  }),
  textWrapper: css({
    display: "flex",
    flexDirection: "column",
    marginTop: "20px",
  }),
  rowWrapper: css({
    display: "flex",
    flexDirection: "row",
  }),
  imageWrapper: css({
    marginTop: "30px",
    width: "100%",
    textAlign: "center",
  }),
};
