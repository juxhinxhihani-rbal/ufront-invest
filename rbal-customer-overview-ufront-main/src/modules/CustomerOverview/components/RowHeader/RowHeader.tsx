import { css, Theme } from "@emotion/react";
import { Stack, Text, tokens } from "@rbal-modern-luka/ui-library";

const styles = {
  header: css({
    borderBottom: `1px solid #65C9D7`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
  }),
  withoutBorder: css({
    border: "none",
    paddingBottom: 0,
  }),
  borderError: css({
    borderColor: "#D7424B",
  }),
  pb4: (t: Theme) =>
    css({
      paddingBottom: tokens.scale(t, "4"),
    }),
  pb12: (t: Theme) =>
    css({
      paddingBottom: tokens.scale(t, "12"),
    }),
  pb24: (t: Theme) =>
    css({
      paddingBottom: tokens.scale(t, "24"),
    }),
};

interface RowHeaderProps {
  label: string | React.ReactNode;
  cta?: React.ReactNode;
  pb?: "4" | "12" | "24";
  withBorder?: boolean;
  hasError?: boolean;
}

export const RowHeader: React.FC<RowHeaderProps> = (props) => {
  const { label, pb = "12", withBorder = true, cta, hasError } = props;

  const pbCss =
    pb === "4" ? styles.pb4 : pb === "12" ? styles.pb12 : styles.pb24;

  return (
    <Stack
      customStyle={[
        styles.header,
        pbCss,
        !withBorder && styles.withoutBorder,
        hasError && styles.borderError,
      ]}
      d="h"
    >
      {typeof label === "string" ? (
        <Text size="24" weight="bold" text={label} />
      ) : (
        label
      )}

      {cta && cta}
    </Stack>
  );
};
