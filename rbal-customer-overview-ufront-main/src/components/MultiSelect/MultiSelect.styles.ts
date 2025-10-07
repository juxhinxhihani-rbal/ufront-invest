import { css } from "@emotion/react";
import { theme, tokens } from "@rbal-modern-luka/ui-library";

export const styles = {
  inputWrapper: css({
    flex: "1 0 calc(33% - 2rem)",
    maxWidth: "32%",
  }),
  flexGrow: css({ flex: 1, maxWidth: "unset" }),
  icon: css({
    "& *": {
      fill: "#8F9199 !important",
    },
  }),
  control: {
    fontSize: tokens.scale(theme, "16"),
    paddingTop: 4,
    paddingBottom: 4,
    borderColor: "#EAEAEB",
    "&:hover": {
      borderColor: "#EAEAEB",
    },
    boxShadow: "none",
    borderRadius: 5,
  },
  menuPortal: { zIndex: 9999 },
  indicator: { paddingRight: 12, paddingLeft: 12 },
  multiValueRemove: {
    "&:hover": {
      backgroundColor: tokens.color(theme, "yellow300"),
      color: tokens.color(theme, "gray800"),
    },
  },
  option: {
    fontSize: 15,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ":active": {
      backgroundColor: undefined,
    },
  },
  error: {
    borderColor: tokens.color(theme, "red500"),
    "&:hover": {
      borderColr: tokens.color(theme, "red500"),
    },
  },
};
