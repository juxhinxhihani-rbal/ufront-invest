import { css, Theme } from "@emotion/react";
import { tokens } from "@rbal-modern-luka/ui-library";

export const styles = {
  row: css({
    width: "100%",
    alignItems: "center",
  }),
  fill: css({ justifyContent: "space-between", alignItems: "center", flex: 1 }),
  customizedButton: (t: Theme) =>
    css({ padding: `${tokens.scale(t, "0")} ${tokens.scale(t, "18")}` }),
};
