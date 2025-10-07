import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { css } from "@emotion/react";
import { Button, Stack, Text } from "@rbal-modern-luka/ui-library";
import { InfoRow } from "~/modules/CustomerOverview/components/InfoRow/InfoRow";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { attachmentsI18n } from "./Attachments.i18n";
import { UpdloadFileInput } from "~/components/UploadFile/UpdloadFileInput";
import { DocumentRow } from "../DocumentRow/DocumentRow";
import { CustomerAttachmentsContextValues } from "../types";
import {
  DocumentTypes,
  useCustomerAttachments,
} from "~/features/hooks/useCustomerAttachments/useCustomerAttachments";
import { handlePrintDocument } from "~/features/files/files";
import { useState } from "react";
import { OverlayLoader } from "../ConfirmationLoader/ConfirmationLoader";
import useDocumentHandler from "~/features/hooks/useDocumentHandler";

const styles = {
  confirmButton: css({
    width: "8.75rem",
  }),
};

interface AttachmentsProps {
  customerId: string;
  onSubmit?: () => void;
  customerContext: React.Context<CustomerAttachmentsContextValues>;
}

export const Attachments: React.FC<AttachmentsProps> = (props) => {
  const { customerId, customerContext, onSubmit } = props;
  const { handleDocumentAction } = useDocumentHandler({ customerId });

  const { tr } = useI18n();
  const [loading, setLoading] = useState(false);

  const {
    inputRef,
    attachments,
    response,
    handleAddDocument,
    handleDeleteDocument,
    handleSubmit,
  } = useCustomerAttachments({ customerId, customerContext, onSubmit });

  const handleSave = () => {
    handleSubmit();
  };

  return (
    <Stack gap="40">
      {loading && (
        <OverlayLoader label={tr(attachmentsI18n.pleaseWait)} isCenteredIcon />
      )}
      <Text size="24" weight="bold" text={tr(attachmentsI18n.attachments)} />

      <Stack gap="0">
        <RowHeader
          pb="12"
          label={
            <Text
              size="16"
              weight="bold"
              text={tr(attachmentsI18n.accountDetails)}
            />
          }
        />

        <InfoRow
          label={tr(attachmentsI18n.accountNumber)}
          value={response?.accountNumber}
        />
        <InfoRow
          label={tr(attachmentsI18n.retailAccountNumber)}
          value={response?.retailAccountNumber}
        />
        <InfoRow label={tr(attachmentsI18n.iban)} value={response?.iban} />
      </Stack>

      <Stack gap="40">
        <Stack gap="0">
          <RowHeader
            pb="12"
            label={
              <Text
                size="16"
                weight="bold"
                text={tr(attachmentsI18n.readyToPrint)}
              />
            }
          />

          <DocumentRow
            fileName={tr(attachmentsI18n.applicationForm)}
            handlePrintDocument={() =>
              handleDocumentAction(
                DocumentTypes.ApplicationForm,
                true,
                setLoading
              )
            }
            handleViewDocument={() =>
              handleDocumentAction(
                DocumentTypes.ApplicationForm,
                false,
                setLoading
              )
            }
          />

          <DocumentRow
            fileName={tr(attachmentsI18n.albanianContract)}
            handlePrintDocument={() =>
              handleDocumentAction(
                DocumentTypes.AlbanianContract,
                true,
                setLoading
              )
            }
            handleViewDocument={() =>
              handleDocumentAction(
                DocumentTypes.AlbanianContract,
                false,
                setLoading
              )
            }
          />

          <DocumentRow
            fileName={tr(attachmentsI18n.englishcontract)}
            handlePrintDocument={() =>
              handleDocumentAction(
                DocumentTypes.EnglishContract,
                true,
                setLoading
              )
            }
            handleViewDocument={() =>
              handleDocumentAction(
                DocumentTypes.EnglishContract,
                false,
                setLoading
              )
            }
          />
        </Stack>

        <Stack>
          <Text
            size="16"
            weight="bold"
            text={tr(attachmentsI18n.uploadScannedDocuments)}
          />

          <UpdloadFileInput
            onDropHandler={handleAddDocument}
            onChangeHandler={handleAddDocument}
            inputRef={inputRef}
            label={
              <div>
                <Text size="16" weight="regular" fgColor="green600">
                  {tr(attachmentsI18n.clickToUpload)}
                </Text>
                &nbsp;
                <Text size="16" weight="medium" fgColor="gray200">
                  {tr(attachmentsI18n.dragAndDrop)}
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
                text={tr(attachmentsI18n.uploadedDocument)}
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

      <Button
        variant="solid"
        colorScheme="green"
        text={tr(attachmentsI18n.confirm)}
        css={styles.confirmButton}
        onClick={handleSave}
      />
    </Stack>
  );
};
