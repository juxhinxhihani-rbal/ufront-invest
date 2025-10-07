import { css, Theme } from "@emotion/react";
import {
  CollapseButton,
  Stack,
  Text,
  tokens,
} from "@rbal-modern-luka/ui-library";
import { CustomerRetailAccount } from "~/api/customer/customerApi.types";

const styles = {
  collapseButtonWrapper: css({
    display: "flex",
    justifyContent: "end",
  }),
  arrowDown: css({
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "0.4rem",
  }),
  accountItem: (t: Theme) =>
    css({
      height: "3.25rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      alignSelf: "stretch",
      borderBottom: `1px solid #65C9D7`,
      borderTop: `1px solid #65C9D7`,
      paddingTop: `${tokens.scale(t, "8")}`,
      paddingBottom: `${tokens.scale(t, "8")}`,
      boxSizing: "border-box",
    }),
  itemLabel: css({
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "150%",
    letterSpacing: "0.04px",
    color: "#42444C",
  }),
  itemValue: css({
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: "150%",
    letterSpacing: "0.04px",
    color: "#232529",
  }),
};

interface AccountRowHeaderProps {
  account?: CustomerRetailAccount;
  handleToggleRow?: (rowId: number) => void;
  openedRows?: Record<string, boolean>;
  isCollapsible?: boolean;
}

export const AccountRowHeader = ({
  handleToggleRow,
  account,
  openedRows,
  isCollapsible,
}: AccountRowHeaderProps) => {
  return (
    <Stack d="h" customStyle={styles.accountItem}>
      <Stack d="h">
        <Text text={`Account No `} customStyle={styles.itemLabel} />

        <Text
          text={account?.retailAccountNumber}
          customStyle={styles.itemValue}
        />
      </Stack>

      <Stack d="h">
        <Text text={`Currency `} customStyle={styles.itemLabel} />

        <Text text={account?.currency} customStyle={styles.itemValue} />
      </Stack>

      <Stack d="h">
        <Text text={`Type `} customStyle={styles.itemLabel} />

        <Text text={account?.segment} customStyle={styles.itemValue} />
      </Stack>

      {isCollapsible && (
        <div css={styles.collapseButtonWrapper}>
          <CollapseButton
            css={styles.arrowDown}
            aria-controls={`account-row:${account?.productId}`}
            isOpen={Boolean(openedRows?.[account?.productId ?? 0])}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => handleToggleRow?.(Number(account?.productId))}
          />
        </div>
      )}
    </Stack>
  );
};
