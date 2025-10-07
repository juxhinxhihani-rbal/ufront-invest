import { css } from "@emotion/react";

export const styles = {
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
    width: 641,
    height: 911,
  }),
  hiddenAnchor: css({
    position: "absolute",
    visibility: "hidden",
  }),
  specimenCta: css({
    alignItems: "center",
  }),
};
