import { css } from "@emotion/react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Button, Stack, Text } from "@rbal-modern-luka/ui-library";
import { useState } from "react";
import { Link } from "react-router-dom";
import { UpdloadFileInput } from "~/components/UploadFile/UpdloadFileInput";
import { handlePrintDocument } from "~/features/files/files";
import { useCustomerAttachments } from "~/features/hooks/useCustomerAttachments/useCustomerAttachments";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { DocumentRow } from "~/modules/CreateRetailAccount/DocumentRow/DocumentRow";
import { CustomerAttachmentsContextValues } from "~/modules/CreateRetailAccount/types";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { editAttachmentsI18n } from "./EditAttachments.i18n";

const styles = {
  button: css({
    width: "fit-content",
    textDecoration: "none",
  }),
  buttonsWrapper: css({
    justifyContent: "space-between",
  }),
};

type CallbackAction = (loading: boolean) => void;

interface EditAttachmentsProps {
  customerId: string;
  customerContext: React.Context<CustomerAttachmentsContextValues>;
  onSubmit?: () => void;
  stepIdx: number;
  handleDocumentAction?: (setLoading: CallbackAction) => void;
  fileName: string;
}

export const EditAttachments = ({
  customerId,
  customerContext,
  onSubmit,
  stepIdx,
  handleDocumentAction,
  fileName,
}: EditAttachmentsProps) => {
  const { tr } = useI18n();
  const [loading, setLoading] = useState(false);

  const {
    isMutating,
    inputRef,
    attachments,
    handleAddDocument,
    handleDeleteDocument,
    handleSubmit,
  } = useCustomerAttachments({ customerId, customerContext, onSubmit });

  return (
    <Stack gap="40">
      {(isMutating || loading) && (
        <OverlayLoader
          label={tr(editAttachmentsI18n.pleaseWait)}
          isCenteredIcon
        />
      )}

      <Stack gap="4">
        <Text
          size="24"
          weight="bold"
          text={`${stepIdx + 1}. ${tr(editAttachmentsI18n.attachments)}`}
        />

        <Text size="14" text={tr(editAttachmentsI18n.subtitle)} />
      </Stack>

      <Stack gap="40">
        <Stack gap="0">
          <RowHeader
            pb="12"
            label={
              <Text
                size="16"
                weight="bold"
                text={tr(editAttachmentsI18n.readyToPrint)}
              />
            }
          />

          <DocumentRow
            fileName={fileName}
            handlePrintDocument={() => handleDocumentAction?.(setLoading)}
          />
        </Stack>

        <Stack>
          <Text
            size="16"
            weight="bold"
            text={tr(editAttachmentsI18n.uploadDocuments)}
          />

          <UpdloadFileInput
            onDropHandler={handleAddDocument}
            onChangeHandler={handleAddDocument}
            inputRef={inputRef}
            label={
              <div>
                <Text size="16" weight="regular" fgColor="green600">
                  {tr(editAttachmentsI18n.clickToUpload)}
                </Text>
                &nbsp;
                <Text size="16" weight="medium" fgColor="gray200">
                  {tr(editAttachmentsI18n.dragAndDrop)}
                </Text>
              </div>
            }
          />
        </Stack>

        <Stack gap="0">
          <RowHeader
            pb="12"
            label={
              <Text
                size="16"
                weight="bold"
                text={tr(editAttachmentsI18n.uploadedDocument)}
              />
            }
          />

          {attachments?.map((file, index) => (
            <DocumentRow
              key={index}
              fileName={file.name}
              handleDeleteDocument={() => handleDeleteDocument(index)}
              handlePrintDocument={() => handlePrintDocument(file)}
            />
          ))}
        </Stack>
      </Stack>

      <Stack d="h" customStyle={styles.buttonsWrapper}>
        <Button
          text={tr(editAttachmentsI18n.cancel)}
          as={Link}
          to={`/customers/${customerId}`}
          colorScheme="red"
          variant="outline"
          css={styles.button}
        />

        <Button
          variant="solid"
          colorScheme="yellow"
          text={tr(editAttachmentsI18n.confirmAndPrint)}
          css={styles.button}
          onClick={() => handleSubmit()}
        />
      </Stack>
    </Stack>
  );
};
