import { css } from "@emotion/react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Button, Stack, Text } from "@rbal-modern-luka/ui-library";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { CustomerDto } from "~/api/customer/customerApi.types";
import { Select } from "~/components/Select/Select";
import { UpdloadFileInput } from "~/components/UploadFile/UpdloadFileInput";
import {
  useDocumentCategoryTypeQuery,
  useDocumentTypeQuery,
} from "~/features/dictionaries/dictionariesQueries";
import { useCustomerAttachments } from "~/features/hooks/useCustomerAttachments/useCustomerAttachments";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { DocumentRow } from "~/modules/CreateRetailAccount/DocumentRow/DocumentRow";
import { CustomerAttachmentsContextValues } from "~/modules/CreateRetailAccount/types";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { CustomerDocumentsContext } from "../CustomerDocumentsPage";
import { formatDocumentCategory, formatDocumentType } from "../utils";
import { customerDocumentsUploadI18n } from "./CustomerDocumentsUpload.i18n";

interface DocumensUploadFormValues {
  documentType?: number;
  categoryType?: number;
}

const styles = {
  saveButton: css({
    maxWidth: "125px",
    margin: "0 auto",
  }),
  wrapper: css({
    position: "relative",
  }),
};

interface CustomerDocumentsUploadProps {
  customer?: CustomerDto;
  customerContext: React.Context<CustomerAttachmentsContextValues>;
}

export const CustomerDocumentsUpload: React.FC<
  CustomerDocumentsUploadProps
> = ({ customer, customerContext }) => {
  const { tr } = useI18n();

  const { setShouldRefetchDocuments } = useContext(CustomerDocumentsContext);

  const {
    isMutating,
    inputRef,
    attachments,
    handleSubmit,
    handleAddDocument,
    handleDeleteDocument,
  } = useCustomerAttachments({
    customerId: String(customer?.idParty),
    customerContext,
    setShouldRefetchDocuments: setShouldRefetchDocuments,
  });

  const { control, watch, setValue } = useForm<DocumensUploadFormValues>();

  const formValues = watch();

  const documentCategoryTypeQuery = useDocumentCategoryTypeQuery();

  const documentTypeQuery = useDocumentTypeQuery(
    formValues.categoryType,
    customer?.customerInformation.customerSegmentId
  );

  const handleSave = () => {
    handleSubmit(formValues.documentType);
  };

  useEffect(() => {
    setValue("documentType", undefined);
  }, [formValues.categoryType, setValue]);

  return (
    <>
      <Stack gap="40" customStyle={styles.wrapper}>
        {isMutating && (
          <OverlayLoader
            label={tr(customerDocumentsUploadI18n.pleaseWait)}
            isCenteredIcon
          />
        )}

        <RowHeader
          pb="12"
          label={
            <Text
              size="16"
              weight="bold"
              text={tr(customerDocumentsUploadI18n.title)}
            />
          }
        />

        <UpdloadFileInput
          onDropHandler={handleAddDocument}
          onChangeHandler={handleAddDocument}
          inputRef={inputRef}
          label={
            <div>
              <Text size="16" weight="regular" fgColor="green600">
                {tr(customerDocumentsUploadI18n.clickToUpload)}
              </Text>
              &nbsp;
              <Text size="16" weight="medium" fgColor="gray200">
                {tr(customerDocumentsUploadI18n.dragAndDrop)}
              </Text>
            </div>
          }
        />

        <Stack d="h" gap="40">
          <Select
            id="categoryType"
            label={tr(customerDocumentsUploadI18n.categoryType)}
            name="categoryType"
            control={control}
            shouldGrow
            data={formatDocumentCategory(documentCategoryTypeQuery.data)}
          />

          <Select
            id="documentType"
            label={tr(customerDocumentsUploadI18n.documentType)}
            name="documentType"
            control={control}
            shouldGrow
            data={formatDocumentType(documentTypeQuery.data)}
            disabled={!formValues.categoryType}
          />
        </Stack>

        <Stack gap="0">
          <RowHeader
            pb="12"
            label={
              <Text
                size="16"
                weight="bold"
                text={tr(customerDocumentsUploadI18n.uploadedDocument)}
              />
            }
          />

          {attachments.map((file, index) => (
            <DocumentRow
              key={index}
              fileName={file.name}
              handleDeleteDocument={() => handleDeleteDocument(index)}
              previewUrl={URL.createObjectURL(file)}
            />
          ))}
        </Stack>

        <Button
          variant="solid"
          colorScheme="yellow"
          text={tr(customerDocumentsUploadI18n.save)}
          css={styles.saveButton}
          disabled={!formValues.documentType || !attachments.length}
          onClick={handleSave}
        />
      </Stack>
    </>
  );
};
