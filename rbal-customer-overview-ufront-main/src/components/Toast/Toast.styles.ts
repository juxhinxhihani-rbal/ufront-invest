import { theme, tokens } from "@rbal-modern-luka/ui-library";

export const toastStyle = {
  borderRadius: 4,
  padding: 4,
  minHeight: tokens.scale(theme, "48"),
};
export const styles = {
  container: {
    width: 420,
  },
  bodyStyle: {
    padding: tokens.scale(theme, "4"),
    paddingLeft: tokens.scale(theme, "8"),
    marginTop: tokens.scale(theme, "4"),
    marginBottom: tokens.scale(theme, "4"),
    lineHeight: "22px",
  },
  closeButton: {
    justifyContent: "center",
    paddingRight: tokens.scale(theme, "8"),
    cursor: "pointer",
  },
  error: {
    ...toastStyle,
    backgroundColor: tokens.color(theme, "red500"),
  },
  success: {
    ...toastStyle,
    backgroundColor: "#1f883d",
  },
  info: {
    ...toastStyle,
    backgroundColor: "#57B6ED",
  },
};
