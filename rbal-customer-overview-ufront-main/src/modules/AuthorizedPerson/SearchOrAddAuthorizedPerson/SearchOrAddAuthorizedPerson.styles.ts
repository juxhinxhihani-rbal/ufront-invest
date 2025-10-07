import { css } from "@emotion/react";

export const styles = {
  title: css({
    fontSize: "1.25rem",
    lineHeight: "1.875rem",
    fontWeight: "700",
    color: "#131416",
  }),

  subtitle: css({
    color: "#42444C",
    fontWeight: "400",
  }),

  form: css({
    width: "25.375rem",
  }),

  searchInput: css({
    fontSize: "0.875rem",
    lineHeight: "1.5rem",
    fontWeight: "400",
    color: "#131416",

    "&::placeholder": {
      color: "#8F9199",
    },
  }),

  icon: css({
    "& *": {
      fill: "#AFB1B6!important",
    },
  }),

  resultsCount: css({
    borderBottom: "1px solid #D8D8DA",
    paddingBottom: "0.5rem",
  }),
  buttonSearch: css({
    padding: "0.375rem 1rem",
  }),

  createProspectWrapper: css({
    alignItems: "center",
  }),
  createProspectButton: css({
    textDecoration: "none",
  }),

  loaderWrapper: css({
    width: "100%",
    height: "50%",
  }),

  buttonsWrapper: css({
    justifyContent: "space-between",
  }),

  cancelButton: css({
    padding: "0.375rem 1rem",
    border: "none",
    textDecoration: "none",
  }),
};
