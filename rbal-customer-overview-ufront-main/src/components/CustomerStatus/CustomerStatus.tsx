/* eslint-disable @typescript-eslint/naming-convention */
import { css } from "@emotion/react";
import { Stack, Text, theme, tokens } from "@rbal-modern-luka/ui-library";
import { useMemo } from "react";
import { getHexColor } from "~/common/utils";

const styles = {
  container: css({
    alignItems: "flex-end",
    textAlign: "right",
  }),
  description: css({
    color: tokens.color(theme, "red500"),
  }),
};

interface CustomerStatusProps {
  status?: string;
  description?: string;
  color?: string;
}

export const CustomerStatus = ({
  status,
  description,
  color,
}: CustomerStatusProps) => {
  const textColor = useMemo(() => getHexColor(color), [color]);
  const hasDescription = Boolean(description);
  return (
    <Stack gap="0" css={styles.container}>
      <Text weight="medium" style={{ color: textColor }} text={status} />
      {hasDescription && (
        <Text
          weight="medium"
          customStyle={styles.description}
          text={description}
        />
      )}
    </Stack>
  );
};
