import { Theme, css } from "@emotion/react";
import { tokens } from "@rbal-modern-luka/ui-library";

export const styles = {
  documentRow: (t: Theme) =>
    css({
      justifyContent: "space-between",
      padding: `${tokens.scale(t, "10")} 0`,
      borderBottom: `1px solid ${tokens.color(t, "gray150")}}`,
      height: tokens.scale(t, "56"),
      boxSizing: "border-box",
    }),
  specimen: css({
    padding: "6px 0px",
    justifyContent: "center",
    alignItems: "center",
  }),
  content: (t: Theme) =>
    css({
      marginTop: tokens.scale(t, "32"),
    }),
  specimenCtaIcon: (t: Theme) =>
    css({
      background: tokens.color(t, "yellow300"),
      padding: tokens.scale(t, "6"),
      cursor: "pointer",
    }),
  specimenCtaIconDisabled: (t: Theme) =>
    css({
      background: tokens.color(t, "gray150"),
      padding: tokens.scale(t, "6"),
    }),
  modalHeader: css({
    alignItems: "center",
  }),
  modalFooter: css({
    alignSelf: "flex-end",
  }),
  canvasPreview: css({
    display: "none",
    objectFit: "contain",
  }),
  imageStyle: css({
    width: 476,
    height: 674,
  }),
  hiddenAnchor: css({
    position: "absolute",
    visibility: "hidden",
  }),
  specimenCta: css({
    alignItems: "center",
  }),
  specimenCtaDisabled: (t: Theme) =>
    css({
      alignItems: "center",
      color: tokens.color(t, "gray550"),
      pointerEvents: "none",
      cursor: "default",
    }),
};
