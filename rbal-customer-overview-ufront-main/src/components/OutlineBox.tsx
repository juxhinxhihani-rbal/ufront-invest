import { Theme, css } from "@emotion/react";
import { Stack, tokens } from "@rbal-modern-luka/ui-library";
import React from "react";

interface Props {
  children?: React.ReactNode;
  mt?: string;
}

const styles = {
  outlineBox: (t: Theme) =>
    css({
      display: "none",
      width: "15rem",

      [tokens.mediaQueries(t, "xl")]: {
        display: "block",
      },
    }),
  outline: (t: Theme) =>
    css({
      position: "sticky",
      top: tokens.scale(t, "64"),
    }),
};

export const OutlineBox: React.FC<Props> = (props) => {
  const { children, mt = "3.375rem" } = props;
  return (
    <div css={styles.outlineBox}>
      <Stack gap="24" style={{ marginTop: mt }} customStyle={styles.outline}>
        {children}
      </Stack>
    </div>
  );
};
