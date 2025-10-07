import { css } from "@emotion/react";
import { Stack, theme, tokens } from "@rbal-modern-luka/ui-library";
import { makeArrayLengthEven } from "~/common/utils";
import { InfoRow, InfoRowProps } from "../InfoRow/InfoRow";

export const styles = {
  dataRow: css({
    borderBottom: `1px solid ${tokens.color(theme, "gray150")}`,
  }),
};

interface InfoRowsProps {
  rows: {
    title: string;
    data: InfoRowProps[];
  };
}

export const InfoRows = ({ rows }: InfoRowsProps) => (
  <Stack
    d="h"
    gap="0"
    customStyle={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
    }}
  >
    {makeArrayLengthEven(rows.data, rows.title).map((row) => (
      <Stack d="h" gap="0" key={row.label} customStyle={styles.dataRow}>
        {!row.fieldKey?.includes("emptyCell") && (
          <InfoRow
            label={row.label}
            value={row.value}
            extraComponent={row.extraComponent}
            isGettingValue={row.isGettingValue}
          />
        )}
      </Stack>
    ))}
  </Stack>
);
