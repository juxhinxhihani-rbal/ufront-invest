import { css } from "@emotion/react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack } from "@rbal-modern-luka/ui-library";
import { OverlayLoader } from "../../ConfirmationLoader/ConfirmationLoader";
import { accountDetailsLoaderI18n } from "./AccountDetailsLoader.i18n";

const LOADER_LABEL_SWITCH_TIMEOUT = 40;

const styles = {
  loadingContainer: css({
    textAlign: "center",
  }),
};

interface AccountDetailsLoaderProps {
  requestDuration: number;
}

export const AccountDetailsLoader: React.FC<AccountDetailsLoaderProps> = (
  props
) => {
  const { requestDuration } = props;
  const { tr } = useI18n();

  const isLongLoading = requestDuration > LOADER_LABEL_SWITCH_TIMEOUT;

  const loadingLabelKey = isLongLoading
    ? accountDetailsLoaderI18n.longLoadingLabel
    : accountDetailsLoaderI18n.loadingLabel;

  const loadingSubLabelKey = isLongLoading
    ? accountDetailsLoaderI18n.longLoadingSubLabel
    : accountDetailsLoaderI18n.loadingSubLabel;

  const loadingLabel = tr(loadingLabelKey);
  const loadingSubLabel = tr(loadingSubLabelKey);

  return (
    <OverlayLoader
      isCenteredIcon
      label={
        <Stack customStyle={styles.loadingContainer}>
          {loadingLabel}
          <br />
          {loadingSubLabel}
        </Stack>
      }
    />
  );
};
