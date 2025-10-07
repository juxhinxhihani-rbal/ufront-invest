import { css, Theme } from "@emotion/react";
import { tokens } from "@rbal-modern-luka/ui-library";

export const styles = {
  modalHeader: css({
    alignItems: "center",
  }),
  modalContent: css({
    maxHeight: 350,
    minHeight: 200,
    overflowY: "auto",
  }),
  listItem: (t: Theme) =>
    css({
      alignItems: "center",
      border: `1px solid ${tokens.color(t, "yellow300")}`,
      paddingLeft: 10,
      borderRadius: 3,
      width: "95%",
      alignSelf: "center",
    }),
  listItemIcon: (t: Theme) =>
    css({
      background: tokens.color(t, "yellow100"),
      padding: tokens.scale(t, "6"),
    }),
  modalFooter: css({
    alignSelf: "flex-end",
  }),
};
