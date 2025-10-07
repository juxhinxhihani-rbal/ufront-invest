import { css, Theme } from "@emotion/react";
import { tokens } from "@rbal-modern-luka/ui-library";

export const styles = {
  textWrapper: (t: Theme) =>
    css({
      borderLeft: "1px solid #AFB1B6",
      paddingLeft: tokens.scale(t, "16"),
    }),
};
