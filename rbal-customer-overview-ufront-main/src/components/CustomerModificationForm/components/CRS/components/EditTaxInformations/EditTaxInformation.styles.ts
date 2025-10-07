import { css, Theme } from "@emotion/react";
import { tokens } from "@rbal-modern-luka/ui-library";

export const styles = {
  table: {
    width: "unset",
    flexGrow: 1,
  },
  buttonContainer: css({
    alignItems: "center",
  }),
  addTaxInformationIcon: (t: Theme) =>
    css({
      background: tokens.color(t, "yellow300"),
      padding: tokens.scale(t, "6"),
      cursor: "pointer",
    }),
  disabledIcon: css({
    background: "#EAEAEB",
    cursor: "no-drop",
  }),
  actionContainer: css({
    justifyContent: "flex-end",
  }),
  editingMessage: css({
    alignItems: "center",
    marginTop: 12,
  }),
  taxInformationForm: css({
    marginTop: 12,
    marginBottom: 12,
  }),
  noBg: css({
    background: "none",
  }),
  selectedRow: css({
    background: "#DFF2F666",
  }),
  loadingContainer: css({
    paddingRight: 40,
  }),
};
