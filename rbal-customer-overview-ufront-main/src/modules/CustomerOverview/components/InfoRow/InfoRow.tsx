import { useState, useCallback } from "react";
import { css, Theme } from "@emotion/react";
import {
  Icon,
  Loader,
  Stack,
  Text,
  tokens,
} from "@rbal-modern-luka/ui-library";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { infoRowI18n } from "./InfoRow.i18n";
import { Tooltip } from "react-tooltip";

const styles = {
  infoWrapper: (t: Theme) =>
    css({
      alignItems: "center",
      flexDirection: "row",
      paddingTop: tokens.scale(t, "16"),
      paddingBottom: tokens.scale(t, "16"),
      flex: "1",
    }),
  rowLabel: css({
    flex: 1,
  }),
  cursorPointer: css({
    cursor: "pointer",
  }),
  loader: {
    width: 150,
    height: 20,
  },
  tooltip: css({
    ".react-tooltip": {
      padding: 0,
    },
  }),
  tooltipContent: css({
    display: "flex",
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: 8,
    paddingLeft: 8,
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    color: "#000",
  }),
  valueWrapper: css({
    flex: 1,
    alignItems: "flex-start",
  }),
  extraComponentWrapper: css({
    alignSelf: "center",
  }),
};

export interface InfoRowProps {
  id?: string;
  label?: string;
  value?: string | number | boolean | number[];
  extraComponent?: React.ReactNode;
  isGettingValue?: boolean;
}

export const InfoRow: React.FC<InfoRowProps> = (props) => {
  const { label, value, extraComponent, isGettingValue } = props;

  const { tr } = useI18n();

  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToClipboard = useCallback(() => {
    void navigator.clipboard.writeText(value ? String(value) : "");
    setIsCopied(true);
  }, [value]);

  return (
    <Stack d="h" customStyle={styles.infoWrapper} id={props.id}>
      <Text
        size="14"
        weight="regular"
        customStyle={styles.rowLabel}
        text={label}
      />
      <Stack d="h" customStyle={styles.valueWrapper}>
        {isGettingValue ? (
          <Loader
            customLine={styles.loader}
            linesNo={1}
            withContainer={false}
          />
        ) : (
          <>
            <Text
              size="14"
              weight="medium"
              text={value}
              customStyle={value && styles.cursorPointer}
              onClick={handleCopyToClipboard}
              data-tooltip-id={label}
              data-tooltip-place="bottom"
              data-tooltip-offset={0}
            />
            <Stack customStyle={styles.extraComponentWrapper}>
              {extraComponent}
            </Stack>
            <Stack gap="0" css={styles.tooltip}>
              <Tooltip
                id={label}
                style={{ background: "white" }}
                border="1px solid #D8D8DA"
                opacity={1}
                place="left-start"
              >
                <Stack d="h" gap="4" css={styles.tooltipContent}>
                  <Icon type={isCopied ? "checkmark" : "copy"} size="18" />
                  <Text
                    size="10"
                    text={
                      isCopied
                        ? tr(infoRowI18n.copiedToClipboard)
                        : tr(infoRowI18n.clickToCopy)
                    }
                  />
                </Stack>
              </Tooltip>
            </Stack>
          </>
        )}
      </Stack>
    </Stack>
  );
};
