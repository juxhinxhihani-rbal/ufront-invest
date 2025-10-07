import { css } from "@emotion/react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Icon, Stack, Text } from "@rbal-modern-luka/ui-library";
import { confirmationLoaderI18n } from "./ConfirmationLoader.i18n";

const style = {
  container: css({
    position: "fixed",
    top: 0,
    left: 0,
    background: "rgba(255,255,255,0.8)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    height: "100%",
    width: "100%",
    zIndex: 1,
  }),
  centeredIcon: css({
    justifyContent: "center",
  }),
};

interface OverlayLoaderProps {
  label?: string | React.ReactElement;
  isCenteredIcon?: boolean;
}

export const OverlayLoader = (props: OverlayLoaderProps) => {
  const { label, isCenteredIcon } = props;

  const { tr } = useI18n();

  return (
    <Stack
      customStyle={[style.container, isCenteredIcon && style.centeredIcon]}
    >
      <Icon type="history-partial" size="48" />
      <Text size="16" weight="regular">
        {label ?? tr(confirmationLoaderI18n.label)}
      </Text>
    </Stack>
  );
};
