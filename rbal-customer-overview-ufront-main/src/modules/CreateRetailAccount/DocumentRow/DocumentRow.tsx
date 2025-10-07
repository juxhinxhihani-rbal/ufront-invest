import { css, Theme } from "@emotion/react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Button,
  Icon,
  Stack,
  Text,
  tokens,
} from "@rbal-modern-luka/ui-library";
import { documentRowI18n } from "./DocumentRow.i18n";

const styles = {
  documentRow: (t: Theme) =>
    css({
      justifyContent: "space-between",
      padding: `${tokens.scale(t, "10")} 0`,
      borderBottom: `1px solid ${tokens.color(t, "gray150")}}`,
      height: tokens.scale(t, "56"),
      boxSizing: "border-box",
    }),
  center: css({
    justifyContent: "center",
    alignItems: "center",
  }),
};

interface DocumentRowProps {
  fileName: string;
  isDisabled?: boolean;
  previewUrl?: string;
  handleDeleteDocument?: () => void;
  handlePrintDocument?: () => void;
  handleViewDocument?: () => void;
}

export const DocumentRow: React.FC<DocumentRowProps> = (props) => {
  const {
    fileName,
    previewUrl,
    isDisabled,
    handleDeleteDocument,
    handlePrintDocument,
    handleViewDocument,
  } = props;

  const { tr } = useI18n();

  return (
    <Stack customStyle={styles.documentRow} d="h">
      <Stack gap="8" customStyle={styles.center} d="h">
        <Icon type="pdf" fgColor="green600" size="16" />
        <Text size="16" weight="medium" text={fileName} fgColor="green600" />
      </Stack>

      <Stack d="h" gap="24">
        {Boolean(handlePrintDocument) && (
          <Stack gap="8" customStyle={styles.center} d="h">
            <Button
              variant="link"
              text={tr(documentRowI18n.print)}
              onClick={handlePrintDocument}
              disabled={isDisabled}
            >
              <Icon type="printer" fgColor="green600" size="16" />
            </Button>
          </Stack>
        )}

        {(Boolean(handleViewDocument) || Boolean(previewUrl)) && (
          <Stack gap="8" customStyle={styles.center} d="h">
            <Button
              variant="link"
              text={tr(documentRowI18n.preview)}
              onClick={() => {
                if (previewUrl) {
                  window.open(previewUrl, "_blank");
                } else if (handleViewDocument) {
                  handleViewDocument();
                }
              }}
              disabled={isDisabled}
            >
              <Icon type="eye-opened" fgColor="green600" size="16" />
            </Button>
          </Stack>
        )}

        {Boolean(handleDeleteDocument) && (
          <Stack gap="8" css={styles.center} d="h">
            <Button variant="link" onClick={handleDeleteDocument}>
              <Icon type="trash" fgColor="green600" size="16" />
              <Text text={tr(documentRowI18n.delete)} />
            </Button>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
